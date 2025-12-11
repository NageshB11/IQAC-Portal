import mongoose from 'mongoose';
import User from './models/User.js';
import Department from './models/Department.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/iqac-portal';

const coordinators = [
    { username: 'cse.coord@iqac.edu', password: 'cse123', deptCode: 'CSE', firstName: 'CSE', lastName: 'Coordinator' },
    { username: 'it.coord@iqac.edu', password: 'it123', deptCode: 'IT', firstName: 'IT', lastName: 'Coordinator' },
    { username: 'entc.coord@iqac.edu', password: 'entc123', deptCode: 'ENTC', firstName: 'ENTC', lastName: 'Coordinator' },
    { username: 'eee.coord@iqac.edu', password: 'eee123', deptCode: 'EEE', firstName: 'EEE', lastName: 'Coordinator' },
    { username: 'mech.coord@iqac.edu', password: 'mech123', deptCode: 'ME', firstName: 'Mechanical', lastName: 'Coordinator' },
    { username: 'civil.coord@iqac.edu', password: 'civil123', deptCode: 'CE', firstName: 'Civil', lastName: 'Coordinator' }
];

async function createAllCoordinators() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✓ Connected to MongoDB\n');

        for (const coord of coordinators) {
            // Find department
            const department = await Department.findOne({ code: coord.deptCode });

            if (!department) {
                console.log(`✗ ${coord.deptCode} - Department not found`);
                continue;
            }

            // Check if coordinator exists
            const existing = await User.findOne({ username: coord.username });

            if (existing) {
                console.log(`  ${coord.deptCode} - Coordinator already exists`);
                continue;
            }

            // Create coordinator
            const user = new User({
                username: coord.username,
                password: coord.password,
                firstName: coord.firstName,
                lastName: coord.lastName,
                email: coord.username,
                role: 'coordinator',
                department: department._id,
                isApproved: true
            });

            await user.save();

            // Update department
            department.coordinator = user._id;
            await department.save();

            console.log(`✓ ${coord.deptCode} - Created coordinator: ${coord.username}`);
        }

        console.log('\n✓✓✓ All coordinators processed! ✓✓✓');
        console.log('\n=================================');
        console.log('Coordinator Login Credentials:');
        console.log('=================================');
        coordinators.forEach(coord => {
            console.log(`${coord.deptCode.padEnd(6)} | ${coord.username.padEnd(25)} | ${coord.password}`);
        });
        console.log('=================================\n');

        process.exit(0);
    } catch (error) {
        console.error('\n✗ Error:', error.message);
        console.error(error);
        process.exit(1);
    }
}

createAllCoordinators();
