import mongoose from 'mongoose';
import Department from './models/Department.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/iqac-portal';

const departments = [
    { name: 'Computer Science & Engineering', code: 'CSE', description: 'Department of Computer Science and Engineering' },
    { name: 'Information Technology', code: 'IT', description: 'Department of Information Technology' },
    { name: 'Electronics & Telecommunication', code: 'ENTC', description: 'Department of Electronics and Telecommunication' },
    { name: 'Mechanical Engineering', code: 'ME', description: 'Department of Mechanical Engineering' },
    { name: 'Civil Engineering', code: 'CE', description: 'Department of Civil Engineering' }
];

async function createDepartments() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✓ Connected to MongoDB\n');

        // Check existing departments
        const existing = await Department.find();
        console.log(`Found ${existing.length} existing departments:`);
        existing.forEach(dept => {
            console.log(`  - ${dept.name} (${dept.code})`);
        });
        console.log('');

        // Create departments
        for (const dept of departments) {
            const existingDept = await Department.findOne({
                $or: [{ code: dept.code }, { name: dept.name }]
            });

            if (existingDept) {
                console.log(`  ${dept.code} - Already exists`);
                continue;
            }

            const newDept = new Department(dept);
            await newDept.save();
            console.log(`✓ ${dept.code} - Created: ${dept.name}`);
        }

        console.log('\n✓ All departments processed!');
        console.log('\nDepartments in database:');
        const allDepts = await Department.find();
        allDepts.forEach(dept => {
            console.log(`  - ${dept.name} (Code: ${dept.code})`);
        });

        process.exit(0);
    } catch (error) {
        console.error('\n✗ Error:', error.message);
        process.exit(1);
    }
}

createDepartments();
