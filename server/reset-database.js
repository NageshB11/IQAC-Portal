import mongoose from 'mongoose';
import User from './models/User.js';
import Document from './models/Document.js';
import Feedback from './models/Feedback.js';
import Announcement from './models/Announcement.js';
import Department from './models/Department.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/iqac-portal';

async function resetDatabase() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✓ Connected to MongoDB\n');

        console.log('⚠️  WARNING: This will delete ALL data except the admin account!\n');

        // Count current data
        const userCount = await User.countDocuments();
        const deptCount = await Department.countDocuments();
        const docCount = await Document.countDocuments();
        const feedbackCount = await Feedback.countDocuments();
        const announcementCount = await Announcement.countDocuments();

        console.log('Current Database:');
        console.log(`  Users: ${userCount}`);
        console.log(`  Departments: ${deptCount}`);
        console.log(`  Documents: ${docCount}`);
        console.log(`  Feedback: ${feedbackCount}`);
        console.log(`  Announcements: ${announcementCount}\n`);

        // Delete everything except admin
        const deletedUsers = await User.deleteMany({ role: { $ne: 'admin' } });
        console.log(`✓ Deleted ${deletedUsers.deletedCount} users (kept admin)`);

        const deletedDepts = await Department.deleteMany({});
        console.log(`✓ Deleted ${deletedDepts.deletedCount} departments`);

        const deletedDocs = await Document.deleteMany({});
        console.log(`✓ Deleted ${deletedDocs.deletedCount} documents`);

        const deletedFeedback = await Feedback.deleteMany({});
        console.log(`✓ Deleted ${deletedFeedback.deletedCount} feedback entries`);

        const deletedAnnouncements = await Announcement.deleteMany({});
        console.log(`✓ Deleted ${deletedAnnouncements.deletedCount} announcements`);

        console.log('\n✓✓✓ Database Reset Complete! ✓✓✓');
        console.log('\nRemaining account:');
        console.log('  - admin (username: admin, password: admin123)');
        console.log('\n⚠️  IMPORTANT: Clear your browser cache/localStorage!');
        console.log('  1. Open browser DevTools (F12)');
        console.log('  2. Go to Application/Storage tab');
        console.log('  3. Clear localStorage');
        console.log('  4. Refresh the page');
        console.log('  5. Login as admin to start fresh\n');

        process.exit(0);
    } catch (error) {
        console.error('\n✗ Error:', error.message);
        process.exit(1);
    }
}

resetDatabase();
