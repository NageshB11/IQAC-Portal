import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  feedbackType: {
    type: String,
    enum: ['course', 'faculty', 'institution'],
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comments: String,
  subject: {
    type: String,
    required: function() {
      return this.feedbackType === 'course' || this.feedbackType === 'faculty';
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Feedback', feedbackSchema);
