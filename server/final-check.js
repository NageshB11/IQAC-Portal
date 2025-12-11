import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function finalCheck() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const { InstitutionalEvent } = await import('./models/FacultyActivity.js');
        const Department = (await import('./models/Department.js')).default;

        // Get CSE department
        const cse = await Department.findOne({ code: 'CSE' });
        console.log('CSE Department:', cse.name);
        console.log('CSE ID:', cse._id.toString());

        // Query exactly as the backend does
        const query = {
            department: cse._id,
            academicYear: '2023-2024'
        };

        console.log('\nQuery:', JSON.stringify(query, null, 2));

        const events = await InstitutionalEvent.find(query);
        console.log('\nResults:', events.length, 'events found');

        if (events.length > 0) {
            console.log('\nEvents:');
            events.forEach((e, i) => {
                console.log(`${i + 1}. ${e.eventName}`);
                console.log(`   Year: "${e.academicYear}"`);
                console.log(`   Type: ${e.eventType}`);
                console.log(`   Participants: ${e.participantCount}`);
            });
        } else {
            console.log('\n❌ NO EVENTS FOUND!');
            console.log('\nLet me check what IS in the database...');

            const allEvents = await InstitutionalEvent.find();
            console.log(`Total events in DB: ${allEvents.length}`);

            if (allEvents.length > 0) {
                const sample = allEvents[0];
                console.log('\nSample event:');
                console.log('  Name:', sample.eventName);
                console.log('  Academic Year:', `"${sample.academicYear}"`);
                console.log('  Academic Year type:', typeof sample.academicYear);
                console.log('  Department ID:', sample.department.toString());
                console.log('  Department ID type:', typeof sample.department);
            }
        }

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
    }
}

finalCheck();
