import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Department from './models/Department.js';

dotenv.config();

const verifyDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✓ Connected to MongoDB\n');

        console.log('📊 DATABASE VERIFICATION REPORT');
        console.log('================================\n');

        // Check Users
        const adminCount = await User.countDocuments({ role: 'admin' });
        const coordCount = await User.countDocuments({ role: 'coordinator' });
        const facultyCount = await User.countDocuments({ role: 'faculty' });
        const studentCount = await User.countDocuments({ role: 'student' });
        const totalUsers = await User.countDocuments();

        console.log('👥 USERS:');
        console.log(`   Total Users: ${totalUsers}`);
        console.log(`   ${adminCount > 0 ? '✓' : '✗'} Admins: ${adminCount}`);
        console.log(`   ${coordCount > 0 ? '✓' : '✗'} Coordinators: ${coordCount}`);
        console.log(`   ${facultyCount > 0 ? '✓' : '✗'} Faculty: ${facultyCount}`);
        console.log(`   ${studentCount > 0 ? '✓' : '✗'} Students: ${studentCount}\n`);

        // Check Departments
        const deptCount = await Department.countDocuments();
        console.log('🏢 DEPARTMENTS:');
        console.log(`   ${deptCount > 0 ? '✓' : '✗'} Total Departments: ${deptCount}\n`);

        if (deptCount > 0) {
            const departments = await Department.find().select('name code');
            departments.forEach(dept => {
                console.log(`   - ${dept.code}: ${dept.name}`);
            });
            console.log();
        }

        // Check Faculty Activities
        const db = mongoose.connection.db;

        const researchCount = await db.collection('researchpublications').countDocuments();
        const profDevCount = await db.collection('professionaldevelopments').countDocuments();
        const coursesCount = await db.collection('coursetaughts').countDocuments();
        const eventsCount = await db.collection('eventsorganizeds').countDocuments();
        const institutionalCount = await db.collection('institutionalevents').countDocuments();

        console.log('📚 FACULTY ACTIVITIES:');
        console.log(`   ${researchCount > 0 ? '✓' : '✗'} Research Publications: ${researchCount}`);
        console.log(`   ${profDevCount > 0 ? '✓' : '✗'} Professional Development: ${profDevCount}`);
        console.log(`   ${coursesCount > 0 ? '✓' : '✗'} Courses Taught: ${coursesCount}`);
        console.log(`   ${eventsCount > 0 ? '✓' : '✗'} Events Organized: ${eventsCount}`);
        console.log(`   ${institutionalCount > 0 ? '✓' : '✗'} Institutional Events: ${institutionalCount}\n`);

        // Check Other Collections
        const feedbackCount = await db.collection('feedbacks').countDocuments();
        const timetableCount = await db.collection('timetables').countDocuments();
        const announcementCount = await db.collection('announcements').countDocuments();
        const documentCount = await db.collection('documents').countDocuments();

        console.log('📋 OTHER DATA:');
        console.log(`   ${feedbackCount > 0 ? '✓' : '✗'} Feedback: ${feedbackCount}`);
        console.log(`   ${timetableCount > 0 ? '✓' : '✗'} Timetables: ${timetableCount}`);
        console.log(`   ${announcementCount > 0 ? '✓' : '✗'} Announcements: ${announcementCount}`);
        console.log(`   ${documentCount > 0 ? '✓' : '✗'} Documents: ${documentCount}\n`);

        console.log('================================');

        // Show login credentials
        if (adminCount > 0) {
            console.log('\n🔑 DEFAULT LOGIN CREDENTIALS:\n');
            console.log('ADMIN:');
            console.log('   Email: admin@mgmcen.ac.in');
            console.log('   Password: Admin@123\n');
        }

        if (coordCount > 0) {
            console.log('COORDINATORS:');
            const coordinators = await User.find({ role: 'coordinator' }).select('email');
            coordinators.forEach(coord => {
                const dept = coord.email.split('.')[0].toUpperCase();
                console.log(`   ${coord.email} / ${dept.toLowerCase()}123`);
            });
            console.log();
        }

        console.log('================================\n');

        await mongoose.disconnect();
        console.log('✓ Disconnected from MongoDB');
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

verifyDatabase();
