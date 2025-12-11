import mongoose from 'mongoose';
import User from './models/User.js';
import Document from './models/Document.js';
import Feedback from './models/Feedback.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/iqac-portal';

async function clearFacultyAndStudentData() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✓ Connected to MongoDB\n');

        // Count before deletion
        const facultyCount = await User.countDocuments({ role: 'faculty' });
        const studentCount = await User.countDocuments({ role: 'student' });
        const documentCount = await Document.countDocuments();
        const feedbackCount = await Feedback.countDocuments();

        console.log('Current Data:');
        console.log(`  Faculty: ${facultyCount}`);
        console.log(`  Students: ${studentCount}`);
        console.log(`  Documents: ${documentCount}`);
        console.log(`  Feedback: ${feedbackCount}\n`);

        // Delete faculty users
        const deletedFaculty = await User.deleteMany({ role: 'faculty' });
        console.log(`✓ Deleted ${deletedFaculty.deletedCount} faculty users`);

        // Delete student users
        const deletedStudents = await User.deleteMany({ role: 'student' });
        console.log(`✓ Deleted ${deletedStudents.deletedCount} student users`);

        // Delete all documents
        const deletedDocuments = await Document.deleteMany({});
        console.log(`✓ Deleted ${deletedDocuments.deletedCount} documents`);

        // Delete all feedback
        const deletedFeedback = await Feedback.deleteMany({});
        console.log(`✓ Deleted ${deletedFeedback.deletedCount} feedback entries`);

        console.log('\n✓✓✓ All faculty and student data cleared! ✓✓✓');
        console.log('\nRemaining accounts:');

        const remainingUsers = await User.find().select('username role');
        remainingUsers.forEach(user => {
            console.log(`  - ${user.username} (${user.role})`);
        });

        console.log('\nYou can now add fresh faculty and student data.');

        process.exit(0);
    } catch (error) {
        console.error('\n✗ Error:', error.message);
        process.exit(1);
    }
}

clearFacultyAndStudentData();
