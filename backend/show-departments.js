import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Department from './models/Department.js';

dotenv.config();

async function showDepartments() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const departments = await Department.find();
        console.log('📋 Departments in database:\n');
        departments.forEach(dept => {
            console.log(`Name: "${dept.name}"`);
            console.log(`Code: ${dept.code}`);
            console.log(`ID: ${dept._id}`);
            console.log('---');
        });

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

showDepartments();
