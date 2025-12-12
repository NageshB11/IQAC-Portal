import mongoose from 'mongoose';
import User from './models/User.js';
import Department from './models/Department.js';

// Use default local MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/iqac-portal';

const createCSECoordinator = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✓ Connected to MongoDB');

        // Find CSE department
        const cseDept = await Department.findOne({ code: 'CSE' });

        if (!cseDept) {
            console.log('\n✗ CSE Department not found!');
            console.log('\nPlease create the CSE department first:');
            console.log('1. Login as admin (username: admin, password: admin123)');
            console.log('2. Go to Departments section');
            console.log('3. Click "Add Department"');
            console.log('4. Enter Name: "Computer Science & Engineering"');
            console.log('5. Enter Code: "CSE"');
            console.log('6. Click Save');
            console.log('7. Run this script again: node server/create-cse-coordinator.js');
            process.exit(1);
        }

        console.log(`✓ Found department: ${cseDept.name}`);

        // Check if coordinator exists
        const coordExists = await User.findOne({ username: 'cse.coord@iqac.edu' });

        if (coordExists) {
            console.log('\n✓ CSE Coordinator already exists!');
            console.log('\n=================================');
            console.log('Login Credentials:');
            console.log('=================================');
            console.log('Username: cse.coord@iqac.edu');
            console.log('Password: cse123');
            console.log('=================================');
            console.log('\nYou can now login with these credentials.');
            process.exit(0);
        }

        // Create coordinator
        const coordinator = new User({
            username: 'cse.coord@iqac.edu',
            password: 'cse123',
            firstName: 'CSE',
            lastName: 'Coordinator',
            email: 'cse.coord@iqac.edu',
            role: 'coordinator',
            department: cseDept._id,
            isApproved: true
        });

        await coordinator.save();

        // Update department with coordinator
        cseDept.coordinator = coordinator._id;
        await cseDept.save();

        console.log('\n✓✓✓ CSE Coordinator created successfully! ✓✓✓');
        console.log('\n=================================');
        console.log('Login Credentials:');
        console.log('=================================');
        console.log('Username: cse.coord@iqac.edu');
        console.log('Password: cse123');
        console.log('=================================');
        console.log('\nYou can now login with these credentials at http://localhost:3000/login');

        process.exit(0);
    } catch (error) {
        console.error('\n✗ Error:', error.message);
        console.error('\nFull error:', error);
        process.exit(1);
    }
};

createCSECoordinator();
