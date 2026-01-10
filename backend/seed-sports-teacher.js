import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const SPORTS_TEACHER = {
    firstName: 'Sports',
    lastName: 'Teacher',
    email: 'sports@iqac.edu',
    password: 'sports123',
    role: 'sports',
    designation: 'Sports Coordinator'
};

async function seedSportsTeacher() {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/iqac-portal';

        await mongoose.connect(MONGODB_URI);
        console.log('✓ Connected to MongoDB');

        // Check if sports teacher already exists
        let sportsTeacher = await User.findOne({
            $or: [
                { email: SPORTS_TEACHER.email },
                { role: 'sports' }
            ]
        });

        if (!sportsTeacher) {
            // Create new sports teacher
            sportsTeacher = new User({
                firstName: SPORTS_TEACHER.firstName,
                lastName: SPORTS_TEACHER.lastName,
                email: SPORTS_TEACHER.email,
                password: SPORTS_TEACHER.password,
                role: SPORTS_TEACHER.role,
                designation: SPORTS_TEACHER.designation,
                isApproved: true
            });
            await sportsTeacher.save();
            console.log(`✓ Created Sports Teacher: ${SPORTS_TEACHER.email}`);
        } else {
            // Update existing sports teacher
            sportsTeacher.firstName = SPORTS_TEACHER.firstName;
            sportsTeacher.lastName = SPORTS_TEACHER.lastName;
            sportsTeacher.email = SPORTS_TEACHER.email;
            sportsTeacher.password = SPORTS_TEACHER.password;
            sportsTeacher.role = SPORTS_TEACHER.role;
            sportsTeacher.designation = SPORTS_TEACHER.designation;
            sportsTeacher.isApproved = true;

            await sportsTeacher.save();
            console.log(`✓ Updated Sports Teacher: ${SPORTS_TEACHER.email}`);
        }

        console.log('\n=================================');
        console.log('Sports Teacher Setup Complete!');
        console.log('=================================');
        console.log('Login Credentials:');
        console.log(`Email: ${SPORTS_TEACHER.email}`);
        console.log(`Password: ${SPORTS_TEACHER.password}`);
        console.log(`Role: ${SPORTS_TEACHER.role}`);
        console.log('=================================\n');

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

seedSportsTeacher();
