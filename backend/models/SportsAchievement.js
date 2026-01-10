import mongoose from 'mongoose';

const sportsAchievementSchema = new mongoose.Schema({
    year: {
        type: String,
        required: true
    },
    awardName: {
        type: String,
        required: true
    },
    teamOrIndividual: {
        type: String,
        required: true,
        enum: ['Individual', 'Team']
    },
    level: {
        type: String,
        required: true,
        enum: ['University', 'State', 'National', 'International']
    },
    sportsOrCultural: {
        type: String,
        required: true,
        enum: ['Sports', 'Cultural']
    },
    activityName: {
        type: String,
        required: true
    },
    studentName: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('SportsAchievement', sportsAchievementSchema);
