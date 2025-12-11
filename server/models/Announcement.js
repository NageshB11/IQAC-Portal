import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: function() {
      return this.visibilityType === 'department';
    }
  },
  visibilityType: {
    type: String,
    enum: ['all', 'department', 'faculty', 'student'],
    default: 'all'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Announcement', announcementSchema);
