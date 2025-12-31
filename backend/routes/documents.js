import express from 'express';
import multer from 'multer';
import path from 'path';
import Document from '../models/Document.js';
import { verifyToken, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/documents/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/jpg'
  ];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, and Image files are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// Upload document (Faculty, Student)
router.post('/upload', verifyToken, checkRole(['faculty', 'student']), upload.single('file'), async (req, res) => {
  try {
    const { title, description, documentType } = req.body;

    // Get the user to fetch their department
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Auto-approve achievement and research documents, others remain pending
    const status = (documentType === 'achievement' || documentType === 'research') ? 'approved' : 'pending';

    const document = new Document({
      title,
      description,
      documentType,
      uploadedBy: req.userId,
      department: user.department, // Link to faculty's department
      fileUrl: `/uploads/documents/${req.file.filename}`,
      status,
    });

    await document.save();
    res.status(201).json({
      message: documentType === 'achievement'
        ? 'Achievement document uploaded and approved successfully'
        : 'Document uploaded successfully',
      document
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get pending documents (Coordinator/Admin)
router.get('/pending', verifyToken, checkRole(['coordinator', 'admin']), async (req, res) => {
  try {
    // Get user to check role and department
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let query = { status: 'pending' };

    // If coordinator, filter by their department
    if (user.role === 'coordinator') {
      query.department = user.department;
    }
    // Admin sees all pending documents

    const documents = await Document.find(query)
      .populate('uploadedBy', 'firstName lastName email role')
      .populate('department', 'name code');
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all documents (Admin)
router.get('/all', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const documents = await Document.find()
      .populate('uploadedBy', 'firstName lastName email role')
      .populate('department', 'name code')
      .sort({ createdAt: -1 });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get department documents (Coordinator)
router.get('/department', verifyToken, checkRole(['coordinator']), async (req, res) => {
  try {
    // Get user to fetch their department
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(req.userId);

    if (!user || !user.department) {
      return res.status(404).json({ message: 'User or department not found' });
    }

    // Find documents linked to this department
    const allDocuments = await Document.find({ department: user.department })
      .populate({
        path: 'uploadedBy',
        select: 'firstName lastName email role department',
        match: { department: user.department } // Only populate if user is currently in this department
      })
      .populate('department', 'name code')
      .sort({ createdAt: -1 });

    // Filter out documents where the user is no longer in the department (uploadedBy will be null due to match)
    const documents = allDocuments.filter(doc => doc.uploadedBy !== null);

    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve document
router.put('/:id/approve', verifyToken, checkRole(['coordinator', 'admin']), async (req, res) => {
  try {
    const { comments } = req.body;
    const document = await Document.findByIdAndUpdate(
      req.params.id,
      {
        status: 'approved',
        comments,
        approvedBy: req.userId,
        updatedAt: new Date(),
      },
      { new: true }
    );
    res.json({ message: 'Document approved', document });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reject document
router.put('/:id/reject', verifyToken, checkRole(['coordinator', 'admin']), async (req, res) => {
  try {
    const { comments } = req.body;
    const document = await Document.findByIdAndUpdate(
      req.params.id,
      {
        status: 'rejected',
        comments,
        approvedBy: req.userId,
        updatedAt: new Date(),
      },
      { new: true }
    );
    res.json({ message: 'Document rejected', document });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's documents
router.get('/user/:userId', verifyToken, async (req, res) => {
  try {
    // Check permissions
    if (req.userId !== req.params.userId) {
      // If not the owner, check if admin or coordinator
      const User = (await import('../models/User.js')).default;
      const requester = await User.findById(req.userId);

      if (!requester) return res.status(401).json({ message: 'User not found' });

      if (requester.role === 'admin') {
        // Admin can see everything, proceed
      } else if (requester.role === 'coordinator') {
        // Coordinator can see if target user is in same department
        const targetUser = await User.findById(req.params.userId);
        if (!targetUser) {
          return res.status(404).json({ message: 'Target user not found' });
        }

        // Check if departments match
        if (!requester.department || !targetUser.department || requester.department.toString() !== targetUser.department.toString()) {
          return res.status(403).json({ message: 'Unauthorized access to this user\'s documents' });
        }
      } else {
        // Faculty/Student cannot see others' documents
        return res.status(403).json({ message: 'Unauthorized access' });
      }
    }

    const documents = await Document.find({ uploadedBy: req.params.userId });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete document (Faculty - only if pending)
router.delete('/:id', verifyToken, checkRole(['faculty']), async (req, res) => {
  try {
    const document = await Document.findOne({ _id: req.params.id, uploadedBy: req.userId });

    if (!document) {
      return res.status(404).json({ message: 'Document not found or unauthorized' });
    }

    if (document.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot delete processed documents' });
    }

    await Document.findByIdAndDelete(req.params.id);
    // In a real app, you should also delete the file from filesystem here

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update document (Faculty - only if pending)
router.put('/:id', verifyToken, checkRole(['faculty']), upload.single('file'), async (req, res) => {
  try {
    const { title, description, documentType } = req.body;
    const document = await Document.findOne({ _id: req.params.id, uploadedBy: req.userId });

    if (!document) {
      return res.status(404).json({ message: 'Document not found or unauthorized' });
    }

    if (document.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot edit processed documents' });
    }

    document.title = title || document.title;
    document.description = description || document.description;
    document.documentType = documentType || document.documentType;

    if (req.file) {
      document.fileUrl = `/uploads/documents/${req.file.filename}`;
    }

    await document.save();
    res.json({ message: 'Document updated successfully', document });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Download document
router.get('/:id/download', verifyToken, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if user has permission (owner or admin/coordinator)
    const userId = req.userId;
    const userRole = req.userRole;

    if (document.uploadedBy.toString() !== userId) {
      if (userRole === 'admin') {
        // Admin can download any document
      } else if (userRole === 'coordinator') {
        // Coordinator can download only if in same department
        const User = (await import('../models/User.js')).default;
        const requester = await User.findById(userId);

        // We need to check the department of the document or the uploader.
        // The document has a 'department' field.
        if (!requester || !requester.department || !document.department || requester.department.toString() !== document.department.toString()) {
          return res.status(403).json({ message: 'Unauthorized to download this document' });
        }
      } else {
        return res.status(403).json({ message: 'Unauthorized to download this document' });
      }
    }

    // Construct file path
    const filePath = path.join(process.cwd(), document.fileUrl);

    // Send file
    res.download(filePath, (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).json({ message: 'Error downloading file' });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

