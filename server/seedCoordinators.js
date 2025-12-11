import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Department from './models/Department.js';

dotenv.config();

const coordinators = [
    { username: 'cse.coord@iqac.edu', password: 'cse123', deptCode: 'CSE', firstName: 'CSE', lastName: 'Coordinator' },
    { username: 'it.coord@iqac.edu', password: 'it123', deptCode: 'IT', firstName: 'IT', lastName: 'Coordinator' },
    { username: 'entc.coord@iqac.edu', password: 'entc123', deptCode: 'ENTC', firstName: 'ENTC', lastName: 'Coordinator' },
    { username: 'eee.coord@iqac.edu', password: 'eee123', deptCode: 'EEE', firstName: 'EEE', lastName: 'Coordinator' },
    { username: 'mech.coord@iqac.edu', password: 'mech123', deptCode: 'ME', firstName: 'Mechanical', lastName: 'Coordinator' },
    { username: 'civil.coord@iqac.edu', password: 'civil123', deptCode: 'CE', firstName: 'Civil', lastName: 'Coordinator' }
];

async function seedCoordinators() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✓ Connected to MongoDB');

        // Create coordinators
        for (const coord of coordinators) {
            // Find department by code
            const department = await Department.findOne({ code: coord.deptCode });

            if (!department) {
                console.log(`✗ Department ${coord.deptCode} not found. Skipping ${coord.username}`);
                continue;
            }

            // Check if coordinator already exists
            const existingUser = await User.findOne({ username: coord.username });

            if (existingUser) {
                console.log(`  ${coord.username} already exists - skipping`);
                continue;
            }

            // Create coordinator user
            const user = new User({
                username: coord.username,
                password: coord.password,
                firstName: coord.firstName,
                lastName: coord.lastName,
                email: coord.username, // Email same as username
                role: 'coordinator',
                department: department._id,
                isApproved: true
            });

            await user.save();

            // Update department with coordinator
            department.coordinator = user._id;
            await department.save();

            console.log(`✓ Created coordinator: ${coord.username} for ${department.name}`);
        }

        console.log('\n✓ All coordinators created successfully!');
        console.log('\nCoordinator Login Credentials:');
        console.log('================================');
        coordinators.forEach(coord => {
            console.log(`${coord.deptCode.padEnd(6)} | Username: ${coord.username.padEnd(25)} | Password: ${coord.password}`);
        });

    } catch (error) {
        console.error('✗ Error seeding coordinators:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n✓ Disconnected from MongoDB');
    }
}

seedCoordinators();
