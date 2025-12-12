import express from 'express';
import Timetable from '../models/Timetable.js';
import { verifyToken, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Get timetable for a department and semester
router.get('/', verifyToken, async (req, res) => {
    try {
        const { department, semester, academicYear } = req.query;
        const User = (await import('../models/User.js')).default;
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let query = {};

        // Students and faculty see their department's timetable
        if (user.role === 'student' || user.role === 'faculty') {
            if (!user.department) {
                return res.status(400).json({ message: 'User not assigned to any department' });
            }
            query.department = user.department;
        }
        // Coordinators see their department's timetable
        else if (user.role === 'coordinator') {
            if (!user.department) {
                return res.status(400).json({ message: 'Coordinator not assigned to any department' });
            }
            query.department = user.department;
        }
        // Admins can see any department's timetable
        else if (user.role === 'admin' && department) {
            query.department = department;
        }

        if (semester) query.semester = semester;
        if (academicYear) query.academicYear = academicYear;

        const timetables = await Timetable.find(query)
            .populate('department', 'name code')
            .populate('createdBy', 'firstName lastName')
            .populate('updatedBy', 'firstName lastName')
            .sort({ createdAt: -1 });

        res.json(timetables);
    } catch (error) {
        console.error('Error fetching timetables:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get a specific timetable by ID
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const timetable = await Timetable.findById(req.params.id)
            .populate('department', 'name code')
            .populate('createdBy', 'firstName lastName')
            .populate('updatedBy', 'firstName lastName');

        if (!timetable) {
            return res.status(404).json({ message: 'Timetable not found' });
        }

        res.json(timetable);
    } catch (error) {
        console.error('Error fetching timetable:', error);
        res.status(500).json({ message: error.message });
    }
});

// Create new timetable (Coordinator, Admin)
router.post('/create', verifyToken, checkRole(['coordinator', 'admin']), async (req, res) => {
    try {
        const { department, semester, academicYear, schedule, timeSlots } = req.body;
        const User = (await import('../models/User.js')).default;
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Coordinators can only create timetables for their own department
        let targetDepartment = department;
        if (user.role === 'coordinator') {
            if (!user.department) {
                return res.status(400).json({ message: 'Coordinator not assigned to any department' });
            }
            targetDepartment = user.department;
        }

        // Check if timetable already exists for this combination
        const existing = await Timetable.findOne({
            department: targetDepartment,
            semester,
            academicYear
        });

        if (existing) {
            return res.status(400).json({
                message: 'Timetable already exists for this department, semester, and academic year. Please update the existing one.'
            });
        }

        const timetable = new Timetable({
            department: targetDepartment,
            semester,
            academicYear,
            schedule,
            timeSlots,
            createdBy: req.userId
        });

        await timetable.save();

        const populatedTimetable = await Timetable.findById(timetable._id)
            .populate('department', 'name code')
            .populate('createdBy', 'firstName lastName');

        res.status(201).json({
            message: 'Timetable created successfully',
            timetable: populatedTimetable
        });
    } catch (error) {
        console.error('Error creating timetable:', error);
        res.status(500).json({ message: error.message });
    }
});

// Update timetable (Coordinator, Admin)
router.put('/:id', verifyToken, checkRole(['coordinator', 'admin']), async (req, res) => {
    try {
        const { schedule, timeSlots, semester, academicYear } = req.body;
        const User = (await import('../models/User.js')).default;
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const timetable = await Timetable.findById(req.params.id);

        if (!timetable) {
            return res.status(404).json({ message: 'Timetable not found' });
        }

        // Coordinators can only update their department's timetable
        if (user.role === 'coordinator') {
            if (!user.department || timetable.department.toString() !== user.department.toString()) {
                return res.status(403).json({ message: 'You can only update timetables for your department' });
            }
        }

        // Update fields
        if (schedule) timetable.schedule = schedule;
        if (timeSlots) timetable.timeSlots = timeSlots;
        if (semester) timetable.semester = semester;
        if (academicYear) timetable.academicYear = academicYear;
        timetable.updatedBy = req.userId;

        await timetable.save();

        const updatedTimetable = await Timetable.findById(timetable._id)
            .populate('department', 'name code')
            .populate('createdBy', 'firstName lastName')
            .populate('updatedBy', 'firstName lastName');

        res.json({
            message: 'Timetable updated successfully',
            timetable: updatedTimetable
        });
    } catch (error) {
        console.error('Error updating timetable:', error);
        res.status(500).json({ message: error.message });
    }
});

// Delete timetable (Admin only)
router.delete('/:id', verifyToken, checkRole(['admin']), async (req, res) => {
    try {
        const timetable = await Timetable.findByIdAndDelete(req.params.id);

        if (!timetable) {
            return res.status(404).json({ message: 'Timetable not found' });
        }

        res.json({ message: 'Timetable deleted successfully' });
    } catch (error) {
        console.error('Error deleting timetable:', error);
        res.status(500).json({ message: error.message });
    }
});

export default router;
