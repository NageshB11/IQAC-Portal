import express from 'express';
import User from '../models/User.js';
import { verifyToken, checkRole } from '../middleware/auth.js';
import { logActivity } from '../utils/activityLogger.js';

const router = express.Router();

// Get all users (Admin, Coordinator)
router.get('/all', verifyToken, checkRole(['admin', 'coordinator']), async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .populate('department', 'name code');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get pending approvals (Admin)
router.get('/pending-approvals', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const users = await User.find({ isApproved: false, role: { $ne: 'admin' } })
      .select('-password')
      .populate('department', 'name code');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve user
router.put('/:id/approve', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    ).select('-password');

    await logActivity(
      req.userId,
      'UPDATE',
      'User',
      user._id,
      { action: 'APPROVE_USER', role: user.role, email: user.email }
    );

    res.json({ message: 'User approved', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reject user
router.delete('/:id', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (deletedUser) {
      await logActivity(
        req.userId,
        'DELETE',
        'User',
        req.params.id,
        { role: deletedUser.role, email: deletedUser.email }
      );
    }

    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user details (Admin)
router.put('/:id', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const { firstName, lastName, email, role, department, phoneNumber, designation } = req.body;

    const updateData = {
      firstName,
      lastName,
      email,
      role,
      phoneNumber,
      designation
    };

    if (department) {
      updateData.department = department;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully', user });

    await logActivity(
      req.userId,
      'UPDATE',
      'User',
      user._id,
      { changes: updateData, role: user.role, email: user.email }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-password')
      .populate('department', 'name code');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile (Self)
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, address, photo } = req.body;

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (address) updateData.address = address;
    if (photo) updateData.photo = photo;

    const user = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true }
    ).select('-password');

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get users from same department (Faculty/Coordinator)
router.get('/department-members', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user || !user.department) {
      return res.status(404).json({ message: 'User or department not found' });
    }

    const members = await User.find({
      department: user.department,
      role: 'faculty', // Only show faculty members
      _id: { $ne: user._id } // Exclude self
    })
      .select('firstName lastName email designation phoneNumber')
      .sort('firstName');

    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get students from same department (Coordinator)
router.get('/department-students', verifyToken, checkRole(['coordinator']), async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user || !user.department) {
      return res.status(404).json({ message: 'User or department not found' });
    }

    const students = await User.find({
      department: user.department,
      role: 'student'
    })
      .select('firstName lastName email enrollmentNumber phoneNumber address photo')
      .sort('firstName');

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
