import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { InstitutionalEvent } from './models/FacultyActivity.js';

dotenv.config();

async function verifyEvents() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const events = await InstitutionalEvent.find().populate('department', 'name code');

        console.log(`📊 Total Institutional Events: ${events.length}\n`);

        // Group by department
        const byDept = {};
        events.forEach(event => {
            const deptName = event.department?.name || 'Unknown';
            if (!byDept[deptName]) {
                byDept[deptName] = [];
            }
            byDept[deptName].push(event);
        });

        console.log('Events by Department:\n');
        Object.keys(byDept).sort().forEach(dept => {
            console.log(`${dept}: ${byDept[dept].length} events`);
            byDept[dept].slice(0, 3).forEach(event => {
                console.log(`  - ${event.eventName.substring(0, 50)}...`);
            });
            if (byDept[dept].length > 3) {
                console.log(`  ... and ${byDept[dept].length - 3} more`);
            }
            console.log('');
        });

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

verifyEvents();
