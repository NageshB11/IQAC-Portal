import { ActivityLog } from '../models/ActivityLog.js';
import User from '../models/User.js';

export const logActivity = async (userId, action, entityType, entityId, details = {}) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            console.warn(`Failed to log activity: User ${userId} not found`);
            return;
        }

        const logEntry = new ActivityLog({
            user: userId,
            userName: `${user.firstName} ${user.lastName}`,
            userRole: user.role,
            action,
            entityType,
            entityId,
            details
        });

        await logEntry.save();
        console.log(`Activity logged: ${action} on ${entityType} by ${user.role} ${user.email}`);
    } catch (error) {
        console.error('Error creating activity log:', error);
    }
};
