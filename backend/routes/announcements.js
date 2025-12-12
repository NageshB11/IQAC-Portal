import express from 'express';
import Announcement from '../models/Announcement.js';
import User from '../models/User.js';
import { verifyToken, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Create announcement (Admin/Coordinator)
router.post('/create', verifyToken, checkRole(['admin', 'coordinator']), async (req, res) => {
  try {
    const { title, content, visibilityType, department } = req.body;

    let announcementDept = department;
    if (visibilityType === 'department' && !announcementDept) {
      const user = await User.findById(req.userId);
      announcementDept = user.department;
    }

    const announcement = new Announcement({
      title,
      content,
      createdBy: req.userId,
      visibilityType,
      department: visibilityType === 'department' ? announcementDept : null,
    });

    await announcement.save();
    const populated = await announcement.populate('createdBy', 'firstName lastName');
    res.status(201).json({ message: 'Announcement created', announcement: populated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get announcements for user - filters by role and department
router.get('/my-announcements', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    const query = {
      $or: [
        { visibilityType: 'all' },
        { visibilityType: user.role },
      ],
    };

    // If faculty, also show department-specific announcements
    if (user.role === 'faculty' && user.department) {
      query.$or.push({
        visibilityType: 'department',
        department: user.department
      });
    }

    const announcements = await Announcement.find(query)
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all announcements (Admin)
router.get('/all', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate('createdBy', 'firstName lastName')
      .populate('department', 'name')
      .sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
