import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { InstitutionalEvent } from './models/FacultyActivity.js';

dotenv.config();

async function cleanNAData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Find and remove events with N/A or missing critical data
        const result = await InstitutionalEvent.deleteMany({
            $or: [
                { eventName: { $in: [null, 'N/A', ''] } },
                { department: null },
                { academicYear: { $in: [null, 'N/A', ''] } }
            ]
        });

        console.log(`🗑️  Removed ${result.deletedCount} events with N/A or missing data`);

        // Show remaining count
        const remaining = await InstitutionalEvent.countDocuments();
        console.log(`✅ Remaining events: ${remaining}\n`);

        // Show sample of remaining data
        const samples = await InstitutionalEvent.find().populate('department', 'name').limit(5);
        console.log('Sample remaining events:');
        samples.forEach((event, i) => {
            console.log(`${i + 1}. ${event.eventName}`);
            console.log(`   Dept: ${event.department?.name}`);
            console.log(`   Year: ${event.academicYear}`);
        });

        await mongoose.connection.close();
        console.log('\n✅ Done');
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

cleanNAData();
