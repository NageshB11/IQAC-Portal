import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { EventOrganized, InstitutionalEvent, ResearchPublication } from './backend/models/FacultyActivity.js';

dotenv.config();

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const eventCount = await EventOrganized.countDocuments({});
        const instCount = await InstitutionalEvent.countDocuments({});
        const resCount = await ResearchPublication.countDocuments({});
        console.log('--- DB SUMMARY ---');
        console.log('EventOrganized Count:', eventCount);
        console.log('InstitutionalEvent Count:', instCount);
        console.log('ResearchPublication Count:', resCount);

        if (eventCount > 0) {
            const sample = await EventOrganized.findOne({});
            console.log('Sample Event:', sample.eventName);
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

check();
