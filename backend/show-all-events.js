import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function showData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected\n');

        const { InstitutionalEvent } = await import('./models/FacultyActivity.js');
        const Department = (await import('./models/Department.js')).default;

        // Get all departments
        const depts = await Department.find();
        console.log('📋 Departments:');
        for (const dept of depts) {
            const count = await InstitutionalEvent.countDocuments({ department: dept._id });
            console.log(`  ${dept.name} (${dept.code}): ${count} events`);
            console.log(`    ID: ${dept._id}`);
        }

        // Get all events with details
        console.log('\n📊 All Events:');
        const events = await InstitutionalEvent.find().populate('department', 'name code');
        events.forEach((e, i) => {
            console.log(`${i + 1}. ${e.eventName.substring(0, 40)}...`);
            console.log(`   Dept: ${e.department?.name} (ID: ${e.department?._id})`);
            console.log(`   Year: "${e.academicYear}"`);
            console.log(`   Type: ${e.eventType}`);
            console.log('');
        });

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
    }
}

showData();
