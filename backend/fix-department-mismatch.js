import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { InstitutionalEvent } from './models/FacultyActivity.js';
import Department from './models/Department.js';

dotenv.config();

async function fixDepartmentMismatch() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected\n');

        // Get all departments
        const departments = await Department.find();
        console.log('📋 Departments in system:');
        departments.forEach(d => {
            console.log(`  ${d.name} (${d.code}) - ID: ${d._id}`);
        });

        // Get department IDs used in events
        const eventDeptIds = await InstitutionalEvent.distinct('department');
        console.log('\n📊 Department IDs in events:');
        eventDeptIds.forEach(id => console.log(`  ${id}`));

        // Check if they match
        console.log('\n🔍 Checking matches:');
        let mismatchFound = false;
        for (const dept of departments) {
            const hasEvents = eventDeptIds.some(id => id.toString() === dept._id.toString());
            const count = await InstitutionalEvent.countDocuments({ department: dept._id });
            console.log(`${dept.name}: ${count} events (Match: ${hasEvents})`);

            if (!hasEvents && count === 0) {
                mismatchFound = true;
            }
        }

        if (mismatchFound) {
            console.log('\n⚠️  MISMATCH DETECTED! Re-seeding with current department IDs...');

            // Delete all events
            await InstitutionalEvent.deleteMany({});

            // Re-run seed script
            const { execSync } = await import('child_process');
            execSync('node server/seed-institutional-events.js', { stdio: 'inherit' });
        } else {
            console.log('\n✅ All departments match!');
        }

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error.message);
    }
}

fixDepartmentMismatch();
