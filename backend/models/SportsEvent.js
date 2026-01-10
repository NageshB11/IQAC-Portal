import mongoose from 'mongoose';

const sportsEventSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: true
    },
    eventType: {
        type: String,
        required: true,
        enum: ['tournament', 'match', 'training', 'tryouts', 'other']
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    venue: {
        type: String,
        required: true
    },
    description: {
        type: String
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

export default mongoose.model('SportsEvent', sportsEventSchema);
