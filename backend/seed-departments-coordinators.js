import mongoose from 'mongoose';
import Department from './models/Department.js';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const DEPARTMENTS = [
    { name: 'Computer Science & Engineering', code: 'CSE', email: 'cse.coord@iqac.edu', password: 'cse123' },
    { name: 'Information Technology', code: 'IT', email: 'it.coord@iqac.edu', password: 'it123' },
    { name: 'Mechanical Engineering', code: 'ME', email: 'mech.coord@iqac.edu', password: 'mech123' },
    { name: 'Civil Engineering', code: 'CE', email: 'civil.coord@iqac.edu', password: 'civil123' },
    { name: 'Sports', code: 'SPORTS', email: 'sports.coord@iqac.edu', password: 'sports123' }
];

async function seedDepartmentsAndCoordinators() {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/iqac-portal';

        await mongoose.connect(MONGODB_URI);
        console.log('✓ Connected to MongoDB');

        for (const deptData of DEPARTMENTS) {
            console.log(`\nProcessing ${deptData.code}...`);

            // 1. Create/Update Department
            let dept = await Department.findOne({ code: deptData.code });

            if (!dept) {
                dept = new Department({
                    name: deptData.name,
                    code: deptData.code,
                    description: `Department of ${deptData.name}`
                });
                await dept.save();
                console.log(`  ✓ Created Department: ${deptData.name}`);
            } else {
                console.log(`  ✓ Department exists: ${deptData.name}`);
            }

            // 2. Manage Coordinator User
            const username = `COORD_${deptData.code}_001`;

            // Check if user exists by email OR username
            let coordinator = await User.findOne({
                $or: [
                    { email: deptData.email },
                    { username: username }
                ]
            });

            if (!coordinator) {
                // Create new
                coordinator = new User({
                    firstName: 'Coordinator',
                    lastName: deptData.code,
                    email: deptData.email,
                    username: username,
                    password: deptData.password,
                    role: 'coordinator',
                    department: dept._id,
                    isApproved: true,
                    designation: 'Department Coordinator'
                });
                await coordinator.save();
                console.log(`  ✓ Created Coordinator: ${deptData.email}`);
            } else {
                // Update existing
                coordinator.firstName = 'Coordinator';
                coordinator.lastName = deptData.code;
                coordinator.email = deptData.email;
                coordinator.username = username;
                coordinator.password = deptData.password; // Will be hashed by pre-save hook
                coordinator.role = 'coordinator';
                coordinator.department = dept._id;
                coordinator.isApproved = true;

                await coordinator.save();
                console.log(`  ✓ Updated Coordinator: ${deptData.email}`);
            }

            // 3. Link Coordinator to Department
            dept.coordinator = coordinator._id;
            await dept.save();
            console.log(`  ✓ Linked Coordinator to Department`);
        }

        console.log('\n=================================');
        console.log('Setup Complete!');
        console.log('All 5 departments and coordinators are ready.');
        console.log('=================================');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('\n✗ Error:', error.message);
        if (error.code === 11000) {
            console.error('  Duplicate key error details:', error.keyValue);
        }
        console.error(error);
        process.exit(1);
    }
}

seedDepartmentsAndCoordinators();
