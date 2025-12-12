import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function compareDepartments() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const { InstitutionalEvent } = await import('./models/FacultyActivity.js');
        const Department = (await import('./models/Department.js')).default;

        console.log('=== ALL DEPARTMENTS ===\n');
        const allDepts = await Department.find();
        allDepts.forEach(dept => {
            console.log(`${dept.name} (${dept.code})`);
            console.log(`  ID: ${dept._id.toString()}`);
        });

        console.log('\n=== DEPARTMENT IDs IN EVENTS ===\n');
        const eventDepts = await InstitutionalEvent.distinct('department');
        console.log('Unique department IDs in events:');
        eventDepts.forEach(id => {
            console.log(`  ${id.toString()}`);
        });

        console.log('\n=== MATCHING CHECK ===\n');
        for (const dept of allDepts) {
            const hasEvents = eventDepts.some(id => id.toString() === dept._id.toString());
            const count = await InstitutionalEvent.countDocuments({ department: dept._id });
            console.log(`${dept.name}:`);
            console.log(`  Has events: ${hasEvents ? 'YES' : 'NO'}`);
            console.log(`  Event count: ${count}`);
            console.log(`  Dept ID: ${dept._id.toString()}`);

            if (count > 0) {
                const sample = await InstitutionalEvent.findOne({ department: dept._id });
                console.log(`  Sample event dept ID: ${sample.department.toString()}`);
                console.log(`  IDs match: ${sample.department.toString() === dept._id.toString()}`);
            }
            console.log('');
        }

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
    }
}

compareDepartments();
