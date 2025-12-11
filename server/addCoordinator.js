// Simple script to create CSE coordinator
// Run with: node server/addCoordinator.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection string - update if needed
const MONGODB_URI = 'mongodb://localhost:27017/iqac-portal';

async function createCoordinator() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('✓ Connected to MongoDB');

        // Define schemas inline
        const userSchema = new mongoose.Schema({
            username: String,
            password: String,
            firstName: String,
            lastName: String,
            email: String,
            role: String,
            department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
            isApproved: Boolean,
            createdAt: { type: Date, default: Date.now },
            updatedAt: { type: Date, default: Date.now }
        });

        // Hash password before saving
        userSchema.pre('save', async function (next) {
            if (!this.isModified('password')) return next();
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
            next();
        });

        const User = mongoose.models.User || mongoose.model('User', userSchema);
        const Department = mongoose.models.Department || mongoose.model('Department', new mongoose.Schema({
            name: String,
            code: String,
            coordinator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        }));

        // Find CSE department
        const cseDept = await Department.findOne({ code: 'CSE' });

        if (!cseDept) {
            console.log('✗ CSE Department not found!');
            console.log('Please create the CSE department first:');
            console.log('1. Login as admin');
            console.log('2. Go to Departments');
            console.log('3. Add department with Name: "Computer Science & Engineering" and Code: "CSE"');
            process.exit(1);
        }

        console.log(`✓ Found department: ${cseDept.name} (${cseDept.code})`);

        // Check if coordinator exists
        const existing = await User.findOne({ username: 'cse.coord@iqac.edu' });

        if (existing) {
            console.log('\n✓ CSE Coordinator already exists!');
            console.log('\nLogin Credentials:');
            console.log('==================');
            console.log('Username: cse.coord@iqac.edu');
            console.log('Password: cse123');
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

        // Update department
        cseDept.coordinator = coordinator._id;
        await cseDept.save();

        console.log('\n✓ CSE Coordinator created successfully!');
        console.log('\nLogin Credentials:');
        console.log('==================');
        console.log('Username: cse.coord@iqac.edu');
        console.log('Password: cse123');
        console.log('\nYou can now login with these credentials.');

    } catch (error) {
        console.error('\n✗ Error:', error.message);
        console.error('\nFull error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n✓ Disconnected from MongoDB');
        process.exit(0);
    }
}

createCoordinator();
