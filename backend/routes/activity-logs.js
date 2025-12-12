import express from 'express';
import { ActivityLog } from '../models/ActivityLog.js';
import { verifyToken, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Get all activity logs (Admin only)
router.get('/', verifyToken, checkRole(['admin']), async (req, res) => {
    try {
        const {
            action,
            entityType,
            userRole,
            startDate,
            endDate,
            page = 1,
            limit = 50
        } = req.query;

        // Build filter query
        const filter = {};

        if (action) {
            filter.action = action;
        }

        if (entityType) {
            filter.entityType = entityType;
        }

        if (userRole) {
            filter.userRole = userRole;
        }

        if (startDate || endDate) {
            filter.timestamp = {};
            if (startDate) {
                filter.timestamp.$gte = new Date(startDate);
            }
            if (endDate) {
                filter.timestamp.$lte = new Date(endDate);
            }
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Fetch activity logs with pagination
        const logs = await ActivityLog.find(filter)
            .populate('user', 'firstName lastName email role department')
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const totalCount = await ActivityLog.countDocuments(filter);

        res.json({
            logs,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalCount / parseInt(limit)),
                totalCount,
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Error fetching activity logs:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get activity logs for a specific entity
router.get('/entity/:entityType/:entityId', verifyToken, checkRole(['admin']), async (req, res) => {
    try {
        const { entityType, entityId } = req.params;

        const logs = await ActivityLog.find({
            entityType,
            entityId
        })
            .populate('user', 'firstName lastName email role')
            .sort({ timestamp: -1 });

        res.json(logs);
    } catch (error) {
        console.error('Error fetching entity activity logs:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get activity statistics
router.get('/stats', verifyToken, checkRole(['admin']), async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const filter = {};
        if (startDate || endDate) {
            filter.timestamp = {};
            if (startDate) {
                filter.timestamp.$gte = new Date(startDate);
            }
            if (endDate) {
                filter.timestamp.$lte = new Date(endDate);
            }
        }

        // Get statistics
        const totalLogs = await ActivityLog.countDocuments(filter);

        const actionStats = await ActivityLog.aggregate([
            { $match: filter },
            { $group: { _id: '$action', count: { $sum: 1 } } }
        ]);

        const entityStats = await ActivityLog.aggregate([
            { $match: filter },
            { $group: { _id: '$entityType', count: { $sum: 1 } } }
        ]);

        const userRoleStats = await ActivityLog.aggregate([
            { $match: filter },
            { $group: { _id: '$userRole', count: { $sum: 1 } } }
        ]);

        res.json({
            totalLogs,
            byAction: actionStats,
            byEntityType: entityStats,
            byUserRole: userRoleStats
        });
    } catch (error) {
        console.error('Error fetching activity stats:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get recent activities (last 24 hours)
router.get('/recent', verifyToken, checkRole(['admin']), async (req, res) => {
    try {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const logs = await ActivityLog.find({
            timestamp: { $gte: oneDayAgo }
        })
            .populate('user', 'firstName lastName email role')
            .sort({ timestamp: -1 })
            .limit(20);

        res.json(logs);
    } catch (error) {
        console.error('Error fetching recent activities:', error);
        res.status(500).json({ message: error.message });
    }
});

export default router;
