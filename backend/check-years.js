import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { InstitutionalEvent } from './models/FacultyActivity.js';

dotenv.config();

async function checkYears() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const years = await InstitutionalEvent.distinct('academicYear');
        console.log('Academic years in database:', years);

        const count = await InstitutionalEvent.countDocuments();
        console.log('Total events:', count);

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkYears();
