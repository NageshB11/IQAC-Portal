import express from 'express';
import Feedback from '../models/Feedback.js';
import { verifyToken, checkRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, checkRole(['student']), async (req, res) => {
  try {
    const { type, rating, comments, subject } = req.body;

    const feedback = new Feedback({
      studentId: req.userId,
      feedbackType: type,
      rating: parseInt(rating),
      comments,
      subject: subject || null,
      createdAt: new Date(),
    });

    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    console.log('[v0] Error submitting feedback:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/student/:studentId', verifyToken, async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ studentId: req.params.studentId });
    const count = feedbacks.length;

    res.json({
      count,
      feedback: feedbacks,
    });
  } catch (error) {
    console.log('[v0] Error fetching student feedback:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get student's own feedback
router.get('/my-feedback', verifyToken, checkRole(['student']), async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ studentId: req.userId });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all feedback (Admin, Coordinator)
router.get('/all', verifyToken, checkRole(['admin', 'coordinator']), async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate('studentId', 'firstName lastName email');
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get feedback analytics
router.get('/analytics', verifyToken, checkRole(['admin', 'coordinator']), async (req, res) => {
  try {
    const total = await Feedback.countDocuments();
    const byType = await Feedback.aggregate([
      { $group: { _id: '$feedbackType', count: { $sum: 1 } } },
    ]);
    const avgRating = await Feedback.aggregate([
      { $group: { _id: null, avg: { $avg: '$rating' } } },
    ]);

    res.json({
      totalFeedback: total,
      byType,
      averageRating: avgRating[0]?.avg || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
