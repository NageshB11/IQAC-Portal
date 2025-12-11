import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Department from './models/Department.js';

dotenv.config();

async function listDepartments() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const departments = await Department.find();
        console.log('\n📋 Departments in database:');
        departments.forEach(dept => {
            console.log(`  - ${dept.name} (${dept.code})`);
        });

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

listDepartments();
