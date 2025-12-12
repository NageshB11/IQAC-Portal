import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: {
        type: String, // Store name directly for easier display even if user is deleted
        required: false
    },
    userRole: {
        type: String, // 'admin', 'coordinator', 'faculty'
        required: true
    },
    action: {
        type: String,
        enum: ['CREATE', 'UPDATE', 'DELETE'],
        required: true
    },
    entityType: {
        type: String,
        required: true
    },
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false // Might be null if we just deleted it and don't want to keep a ref, but usually good to keep the ID string
    },
    details: {
        type: mongoose.Schema.Types.Mixed, // Store previous values or description of change
        required: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

export const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
