import express from 'express';
import SportsAchievement from '../models/SportsAchievement.js';
import SportsEvent from '../models/SportsEvent.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get sports dashboard stats
router.get('/stats', verifyToken, async (req, res) => {
    try {
        const totalAchievements = await SportsAchievement.countDocuments();
        const totalTournaments = await SportsEvent.countDocuments({ eventType: 'tournament' });

        // Count distinct students as 'Active Athletes'
        const uniqueStudents = await SportsAchievement.distinct('studentName');
        const activeAthletes = uniqueStudents.length;

        // Upcoming events (simple count of all events for now to avoid date format issues, or filter if possible)
        // Ideally compare date strings if they are YYYY-MM-DD
        const today = new Date().toISOString().split('T')[0];
        const upcomingEvents = await SportsEvent.countDocuments({ date: { $gte: today } });

        res.json({
            achievements: totalAchievements,
            upcomingEvents: upcomingEvents,
            activeAthletes: activeAthletes,
            tournaments: totalTournaments
        });
    } catch (error) {
        console.error('Error fetching sports stats:', error);
        res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
});

// Get all sports achievements
router.get('/achievements', verifyToken, async (req, res) => {
    try {
        const achievements = await SportsAchievement.find()
            .populate('createdBy', 'firstName lastName email')
            .sort({ createdAt: -1 });
        res.json(achievements);
    } catch (error) {
        console.error('Error fetching achievements:', error);
        res.status(500).json({ message: 'Error fetching achievements', error: error.message });
    }
});

// Create new sports achievement
router.post('/achievements', verifyToken, async (req, res) => {
    try {
        const { year, awardName, teamOrIndividual, level, sportsOrCultural, activityName, studentName } = req.body;

        // Validate required fields
        if (!year || !awardName || !teamOrIndividual || !level || !sportsOrCultural || !activityName || !studentName) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const achievement = new SportsAchievement({
            year,
            awardName,
            teamOrIndividual,
            level,
            sportsOrCultural,
            activityName,
            studentName,
            createdBy: req.userId
        });

        await achievement.save();
        res.status(201).json({ message: 'Achievement recorded successfully', achievement });
    } catch (error) {
        console.error('Error creating achievement:', error);
        res.status(500).json({ message: 'Error recording achievement', error: error.message });
    }
});

// Get all sports events
router.get('/events', verifyToken, async (req, res) => {
    try {
        const events = await SportsEvent.find()
            .populate('createdBy', 'firstName lastName email')
            .sort({ date: 1 });
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
});

// Create new sports event
router.post('/events', verifyToken, async (req, res) => {
    try {
        const { eventName, eventType, date, time, venue, description } = req.body;

        // Validate required fields
        if (!eventName || !eventType || !date || !time || !venue) {
            return res.status(400).json({ message: 'All required fields must be filled' });
        }

        const event = new SportsEvent({
            eventName,
            eventType,
            date,
            time,
            venue,
            description,
            createdBy: req.userId
        });

        await event.save();
        res.status(201).json({ message: 'Event scheduled successfully', event });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: 'Error scheduling event', error: error.message });
    }
});

// Delete achievement
router.delete('/achievements/:id', verifyToken, async (req, res) => {
    try {
        const achievement = await SportsAchievement.findByIdAndDelete(req.params.id);
        if (!achievement) {
            return res.status(404).json({ message: 'Achievement not found' });
        }
        res.json({ message: 'Achievement deleted successfully' });
    } catch (error) {
        console.error('Error deleting achievement:', error);
        res.status(500).json({ message: 'Error deleting achievement', error: error.message });
    }
});

// Delete event
router.delete('/events/:id', verifyToken, async (req, res) => {
    try {
        const event = await SportsEvent.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Error deleting event', error: error.message });
    }
});

export default router;
