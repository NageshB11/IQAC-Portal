import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function debugQuery() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const { InstitutionalEvent } = await import('./models/FacultyActivity.js');
        const Department = (await import('./models/Department.js')).default;
        const User = (await import('./models/User.js')).default;

        // Find CSE department
        const cseDept = await Department.findOne({ code: 'CSE' });
        console.log('CSE Department:', cseDept);
        console.log('CSE Department ID:', cseDept?._id);

        // Find CSE coordinator
        const cseCoordinator = await User.findOne({ role: 'coordinator', department: cseDept?._id });
        console.log('\nCSE Coordinator:', cseCoordinator?.firstName, cseCoordinator?.lastName);
        console.log('Coordinator Department ID:', cseCoordinator?.department);

        // Query 1: All events
        console.log('\n=== Query 1: All Events ===');
        const allEvents = await InstitutionalEvent.find();
        console.log(`Total events: ${allEvents.length}`);

        // Query 2: Events for CSE department
        console.log('\n=== Query 2: Events for CSE Department ===');
        const cseEvents = await InstitutionalEvent.find({ department: cseDept?._id });
        console.log(`CSE events: ${cseEvents.length}`);
        if (cseEvents.length > 0) {
            console.log('Sample CSE event:');
            console.log(`  - ${cseEvents[0].eventName}`);
            console.log(`  - Academic Year: "${cseEvents[0].academicYear}"`);
            console.log(`  - Department ID: ${cseEvents[0].department}`);
        }

        // Query 3: Events for academic year 2023-2024
        console.log('\n=== Query 3: Events for 2023-2024 ===');
        const yearEvents = await InstitutionalEvent.find({ academicYear: '2023-2024' });
        console.log(`Events for 2023-2024: ${yearEvents.length}`);

        // Query 4: Combined query (CSE + 2023-2024)
        console.log('\n=== Query 4: CSE + 2023-2024 ===');
        const combinedEvents = await InstitutionalEvent.find({
            department: cseDept?._id,
            academicYear: '2023-2024'
        });
        console.log(`Combined query results: ${combinedEvents.length}`);

        // Query 5: What the backend actually does
        console.log('\n=== Query 5: Simulating Backend Query ===');
        const deptQuery = { department: cseDept?._id };
        const instEventQuery = { ...deptQuery, academicYear: '2023-2024' };
        console.log('Query object:', JSON.stringify(instEventQuery, null, 2));

        const backendResults = await InstitutionalEvent.find(instEventQuery).populate('department', 'name code');
        console.log(`Backend query results: ${backendResults.length}`);

        if (backendResults.length > 0) {
            console.log('\nSample results:');
            backendResults.slice(0, 3).forEach((event, i) => {
                console.log(`${i + 1}. ${event.eventName.substring(0, 50)}...`);
                console.log(`   Dept: ${event.department?.name}, Year: ${event.academicYear}`);
            });
        }

        // Check for any mismatches
        console.log('\n=== Checking for Issues ===');
        const allYears = await InstitutionalEvent.distinct('academicYear');
        console.log('All academic years in DB:', allYears);

        const allDepts = await InstitutionalEvent.distinct('department');
        console.log('All department IDs in events:', allDepts.map(d => d.toString()));
        console.log('CSE Department ID:', cseDept?._id.toString());

        await mongoose.connection.close();
        console.log('\n✅ Debug complete');
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

debugQuery();
