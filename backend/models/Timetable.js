import mongoose from 'mongoose';

const timeSlotSchema = new mongoose.Schema({
    subject: { type: String, required: true },
    faculty: { type: String },
    room: { type: String },
    type: { type: String, enum: ['Lecture', 'Lab', 'Tutorial', 'Break', 'Library', 'Other'], default: 'Lecture' }
});

const timetableSchema = new mongoose.Schema({
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    semester: {
        type: String,
        required: true
    },
    academicYear: {
        type: String,
        required: true
    },
    schedule: {
        Monday: [timeSlotSchema],
        Tuesday: [timeSlotSchema],
        Wednesday: [timeSlotSchema],
        Thursday: [timeSlotSchema],
        Friday: [timeSlotSchema],
        Saturday: [timeSlotSchema]
    },
    timeSlots: [{
        startTime: { type: String, required: true },
        endTime: { type: String, required: true }
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Ensure only one timetable per department-semester-year combination
timetableSchema.index({ department: 1, semester: 1, academicYear: 1 }, { unique: true });

export default mongoose.model('Timetable', timetableSchema);
