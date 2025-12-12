import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { InstitutionalEvent } from './models/FacultyActivity.js';
import Department from './models/Department.js';

dotenv.config();

async function diagnose() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('=== DIAGNOSIS REPORT ===\n');

        // 1. Total events
        const total = await InstitutionalEvent.countDocuments();
        console.log(`1. Total events in database: ${total}`);

        if (total === 0) {
            console.log('   ❌ NO EVENTS! Database is empty.');
            await mongoose.connection.close();
            return;
        }

        // 2. Events by department
        console.log('\n2. Events by department:');
        const depts = await Department.find();
        for (const dept of depts) {
            const count = await InstitutionalEvent.countDocuments({ department: dept._id });
            console.log(`   ${dept.name} (${dept.code}): ${count} events`);
            console.log(`      Department _id: ${dept._id}`);
        }

        // 3. Sample query - exactly as backend does
        const cseDept = await Department.findOne({ code: 'CSE' });
        if (cseDept) {
            console.log('\n3. Testing CSE query (as backend does):');
            console.log(`   CSE Department _id: ${cseDept._id}`);

            const query = {
                department: cseDept._id,
                academicYear: '2023-2024'
            };
            console.log(`   Query: ${JSON.stringify(query)}`);

            const results = await InstitutionalEvent.find(query);
            console.log(`   Results: ${results.length} events`);

            if (results.length > 0) {
                console.log('\n   ✅ QUERY WORKS! Sample events:');
                results.slice(0, 3).forEach((e, i) => {
                    console.log(`   ${i + 1}. ${e.eventName}`);
                });
            } else {
                console.log('\n   ❌ QUERY RETURNS 0 RESULTS');

                // Check without year
                const noYear = await InstitutionalEvent.find({ department: cseDept._id });
                console.log(`   Without year filter: ${noYear.length} events`);

                if (noYear.length > 0) {
                    console.log(`   Years in DB: ${[...new Set(noYear.map(e => e.academicYear))]}`);
                }
            }
        }

        console.log('\n=== END DIAGNOSIS ===');
        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error.message);
    }
}

diagnose();
