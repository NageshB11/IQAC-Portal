import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function findNAData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected\n');

        const { InstitutionalEvent } = await import('./models/FacultyActivity.js');

        // Find events with missing data
        const allEvents = await InstitutionalEvent.find().populate('department', 'name code');

        console.log('📋 Checking for N/A or missing data...\n');

        let hasIssues = false;
        allEvents.forEach((event, index) => {
            const issues = [];

            if (!event.eventName || event.eventName === 'N/A') {
                issues.push('Missing event name');
            }
            if (!event.department || !event.department.name) {
                issues.push('Missing department');
            }
            if (!event.academicYear || event.academicYear === 'N/A') {
                issues.push('Missing academic year');
            }

            if (issues.length > 0) {
                hasIssues = true;
                console.log(`Event ${index + 1}:`);
                console.log(`  ID: ${event._id}`);
                console.log(`  Name: "${event.eventName || 'MISSING'}"`);
                console.log(`  Department: ${event.department?.name || 'MISSING'}`);
                console.log(`  Year: ${event.academicYear || 'MISSING'}`);
                console.log(`  Issues: ${issues.join(', ')}`);
                console.log('');
            }
        });

        if (!hasIssues) {
            console.log('✅ All events have valid data!');
        } else {
            console.log('\n⚠️  Found events with missing data');
        }

        console.log(`\nTotal events: ${allEvents.length}`);

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
    }
}

findNAData();
