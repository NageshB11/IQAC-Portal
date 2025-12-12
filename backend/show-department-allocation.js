import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { InstitutionalEvent } from './models/FacultyActivity.js';
import Department from './models/Department.js';

dotenv.config();

async function showDepartmentAllocation() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected\n');

        const departments = await Department.find().sort({ name: 1 });

        console.log('📋 WORKSHOP/SEMINAR ALLOCATION BY DEPARTMENT\n');
        console.log('='.repeat(80));

        for (const dept of departments) {
            const events = await InstitutionalEvent.find({ department: dept._id })
                .sort({ startDate: -1 });

            console.log(`\n${dept.name} (${dept.code})`);
            console.log('-'.repeat(80));
            console.log(`Total Events: ${events.length}\n`);

            if (events.length > 0) {
                events.forEach((event, index) => {
                    console.log(`${index + 1}. ${event.eventName}`);
                    console.log(`   Type: ${event.eventType.toUpperCase()}`);
                    console.log(`   Participants: ${event.participantCount}`);
                    console.log(`   Date: ${new Date(event.startDate).toLocaleDateString()} - ${new Date(event.endDate).toLocaleDateString()}`);
                    console.log('');
                });
            }
        }

        console.log('='.repeat(80));
        console.log('\n✅ Department coordinators will see ONLY their department\'s events');
        console.log('✅ Admin will see ALL events from all departments\n');

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error.message);
    }
}

showDepartmentAllocation();
