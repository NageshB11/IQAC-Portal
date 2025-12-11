import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function testQuery() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Import models after connection
        const { InstitutionalEvent } = await import('./models/FacultyActivity.js');
        const Department = (await import('./models/Department.js')).default;

        // Test 1: Get all events
        const allEvents = await InstitutionalEvent.find().populate('department', 'name code');
        console.log(`📊 Total Events: ${allEvents.length}\n`);

        // Test 2: Get events by department
        const departments = await Department.find();
        console.log('Events by Department:\n');

        for (const dept of departments) {
            const deptEvents = await InstitutionalEvent.find({ department: dept._id });
            console.log(`${dept.name} (${dept.code}): ${deptEvents.length} events`);
        }

        // Test 3: Get events by academic year
        console.log('\nEvents by Academic Year:\n');
        const eventsByYear = await InstitutionalEvent.aggregate([
            {
                $group: {
                    _id: '$academicYear',
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        eventsByYear.forEach(year => {
            console.log(`${year._id}: ${year.count} events`);
        });

        // Test 4: Sample events
        console.log('\nSample Events:\n');
        const sampleEvents = await InstitutionalEvent.find().populate('department', 'name').limit(5);
        sampleEvents.forEach(event => {
            console.log(`- ${event.eventName.substring(0, 50)}...`);
            console.log(`  Dept: ${event.department?.name || 'N/A'}, Type: ${event.eventType}, Participants: ${event.participantCount}`);
        });

        await mongoose.connection.close();
        console.log('\n✅ Tests completed successfully!');
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

testQuery();
