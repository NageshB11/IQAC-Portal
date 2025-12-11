// Quick script to create CSE coordinator for testing
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Department from './models/Department.js';

dotenv.config();

async function createCSECoordinator() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✓ Connected to MongoDB');

        // Find CSE department
        const cseDept = await Department.findOne({ code: 'CSE' });

        if (!cseDept) {
            console.log('✗ CSE Department not found!');
            console.log('Please create the CSE department first in the admin panel');
            return;
        }

        console.log(`✓ Found department: ${cseDept.name}`);

        // Check if coordinator exists
        const existing = await User.findOne({ username: 'cse.coord@iqac.edu' });

        if (existing) {
            console.log('✓ CSE Coordinator already exists');
            console.log(`   Username: cse.coord@iqac.edu`);
            console.log(`   Password: cse123`);
            return;
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

        // Update department
        cseDept.coordinator = coordinator._id;
        await cseDept.save();

        console.log('✓ CSE Coordinator created successfully!');
        console.log('\nLogin Credentials:');
        console.log('==================');
        console.log('Username: cse.coord@iqac.edu');
        console.log('Password: cse123');

    } catch (error) {
        console.error('✗ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\n✓ Disconnected');
    }
}

createCSECoordinator();
