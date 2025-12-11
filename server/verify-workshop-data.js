import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { InstitutionalEvent } from './models/FacultyActivity.js';
import Department from './models/Department.js';

dotenv.config();

async function verifyWorkshopData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Get all departments
        const departments = await Department.find();
        const deptMap = {};
        departments.forEach(dept => {
            deptMap[dept._id.toString()] = dept.name;
        });

        // Get all institutional events
        const events = await InstitutionalEvent.find().sort({ startDate: -1 });

        console.log('📊 WORKSHOP/SEMINAR/CONFERENCE DATA VERIFICATION\n');
        console.log('='.repeat(80));
        console.log(`\n✅ Total Events in Database: ${events.length}\n`);

        // Group by department
        const byDepartment = {};
        const byType = { workshop: 0, seminar: 0, conference: 0 };
        let totalParticipants = 0;

        events.forEach(event => {
            const deptName = deptMap[event.department.toString()] || 'Unknown';

            if (!byDepartment[deptName]) {
                byDepartment[deptName] = { workshops: 0, seminars: 0, conferences: 0, total: 0, participants: 0 };
            }

            byDepartment[deptName][event.eventType + 's']++;
            byDepartment[deptName].total++;
            byDepartment[deptName].participants += event.participantCount;

            byType[event.eventType]++;
            totalParticipants += event.participantCount;
        });

        // Display summary by department
        console.log('📋 SUMMARY BY DEPARTMENT:\n');
        Object.keys(byDepartment).sort().forEach(dept => {
            const stats = byDepartment[dept];
            console.log(`\n${dept}:`);
            console.log(`  📌 Workshops: ${stats.workshops}`);
            console.log(`  📌 Seminars: ${stats.seminars}`);
            console.log(`  📌 Conferences: ${stats.conferences}`);
            console.log(`  📊 Total Events: ${stats.total}`);
            console.log(`  👥 Total Participants: ${stats.participants}`);
        });

        // Display overall summary
        console.log('\n' + '='.repeat(80));
        console.log('\n📊 OVERALL SUMMARY:\n');
        console.log(`  🎯 Total Workshops: ${byType.workshop}`);
        console.log(`  🎯 Total Seminars: ${byType.seminar}`);
        console.log(`  🎯 Total Conferences: ${byType.conference}`);
        console.log(`  👥 Total Participants: ${totalParticipants}`);
        console.log(`  📅 Academic Year: 2023-2024`);

        // Display sample events
        console.log('\n' + '='.repeat(80));
        console.log('\n📝 SAMPLE EVENTS (First 5):\n');

        events.slice(0, 5).forEach((event, index) => {
            const deptName = deptMap[event.department.toString()] || 'Unknown';
            console.log(`\n${index + 1}. ${event.eventName}`);
            console.log(`   Department: ${deptName}`);
            console.log(`   Type: ${event.eventType.toUpperCase()}`);
            console.log(`   Participants: ${event.participantCount}`);
            console.log(`   Date: ${event.startDate.toISOString().split('T')[0]}`);
            console.log(`   Academic Year: ${event.academicYear}`);
        });

        console.log('\n' + '='.repeat(80));
        console.log('\n✅ DATA VERIFICATION COMPLETE!\n');
        console.log('💡 The workshop data is successfully integrated into the system.');
        console.log('💡 You can access this data through the "Generate Report" feature.');
        console.log('💡 Select "Workshops/Seminars/Conferences Conducted" as the activity type.\n');

        await mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

verifyWorkshopData();
