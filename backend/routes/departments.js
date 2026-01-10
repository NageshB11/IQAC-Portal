import express from 'express';
import Department from '../models/Department.js';
import { verifyToken, checkRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const departments = await Department.find()
      .select('_id name code description')
      .sort('name');
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create department (Admin)
router.post('/create', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const { name, code, description } = req.body;

    const department = new Department({
      name,
      code,
      description,
    });

    await department.save();
    res.status(201).json({ message: 'Department created', department });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all departments
router.get('/all', verifyToken, async (req, res) => {
  try {
    const departments = await Department.find()
      .populate('coordinator', 'firstName lastName email');

    const User = (await import('../models/User.js')).default;

    const departmentsWithStats = await Promise.all(departments.map(async (dept) => {
      const studentCount = await User.countDocuments({ department: dept._id, role: 'student' });
      const facultyCount = await User.countDocuments({ department: dept._id, role: 'faculty' });

      return {
        ...dept.toObject(),
        stats: {
          students: studentCount,
          faculty: facultyCount
        }
      };
    }));

    res.json(departmentsWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Assign coordinator
router.put('/:id/assign-coordinator', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const { coordinatorId } = req.body;
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { coordinator: coordinatorId },
      { new: true }
    ).populate('coordinator', 'firstName lastName email');
    res.json({ message: 'Coordinator assigned', department });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update department (Admin)
router.put('/:id', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const { name, code, description } = req.body;
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { name, code, description },
      { new: true }
    );
    res.json({ message: 'Department updated', department });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get department faculty with documents (Admin)
router.get('/:id/faculty-documents', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const User = (await import('../models/User.js')).default;
    const Document = (await import('../models/Document.js')).default;

    // Get all faculty in this department
    const faculty = await User.find({
      department: req.params.id,
      role: 'faculty'
    }).select('firstName lastName email designation');

    // For each faculty, get their document count and documents
    const facultyWithDocs = await Promise.all(
      faculty.map(async (fac) => {
        const documents = await Document.find({ uploadedBy: fac._id })
          .select('title documentType status createdAt')
          .sort({ createdAt: -1 });

        return {
          _id: fac._id,
          firstName: fac.firstName,
          lastName: fac.lastName,
          email: fac.email,
          designation: fac.designation || 'N/A',
          documentCount: documents.length,
          documents: documents
        };
      })
    );

    res.json(facultyWithDocs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get department student feedback (Admin, Coordinator)
router.get('/:id/student-feedback', verifyToken, checkRole(['admin', 'coordinator']), async (req, res) => {
  try {
    const Feedback = (await import('../models/Feedback.js')).default;
    const User = (await import('../models/User.js')).default;

    // If coordinator, verify they can only access their own department
    if (req.userRole === 'coordinator') {
      const coordinator = await User.findById(req.userId);
      const coordinatorDeptId = coordinator.department?.toString();
      const requestedDeptId = req.params.id;

      if (coordinatorDeptId !== requestedDeptId) {
        return res.status(403).json({ message: 'Access denied: You can only view feedback from your own department' });
      }
    }

    // Get all students in this department (if they have department field)
    const students = await User.find({
      department: req.params.id,
      role: 'student'
    }).select('_id');

    const studentIds = students.map(s => s._id);

    // Get feedback from these students
    const feedback = await Feedback.find({ studentId: { $in: studentIds } })
      .populate('studentId', 'firstName lastName email enrollmentNumber')
      .sort({ createdAt: -1 });

    res.json(feedback);
  } catch (error) {
    console.error('Error fetching student feedback:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get department students (Admin)
router.get('/:id/students', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const User = (await import('../models/User.js')).default;

    // Get all students in this department
    const students = await User.find({
      department: req.params.id,
      role: 'student'
    }).select('firstName lastName email enrollmentNumber phoneNumber isApproved')
      .sort('firstName');

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
