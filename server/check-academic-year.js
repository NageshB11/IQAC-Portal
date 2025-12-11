import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function checkAcademicYear() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const { InstitutionalEvent } = await import('./models/FacultyActivity.js');

        // Get distinct academic years
        const years = await InstitutionalEvent.distinct('academicYear');
        console.log('Academic Years in database:');
        years.forEach(year => {
            console.log(`  - "${year}"`);
        });

        // Count by year
        console.log('\nEvent count by year:');
        for (const year of years) {
            const count = await InstitutionalEvent.countDocuments({ academicYear: year });
            console.log(`  ${year}: ${count} events`);
        }

        // Sample event
        const sample = await InstitutionalEvent.findOne().populate('department', 'name');
        if (sample) {
            console.log('\nSample Event:');
            console.log(`  Name: ${sample.eventName}`);
            console.log(`  Academic Year: "${sample.academicYear}"`);
            console.log(`  Department: ${sample.department?.name}`);
            console.log(`  Type: ${sample.eventType}`);
        }

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkAcademicYear();
