import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Import models
import User from '../models/User.js';
import Department from '../models/Department.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/iqac-portal';

async function initializeDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✓ Connected to MongoDB successfully');

    // Create indexes for unique fields
    console.log('Creating database indexes...');
    await User.collection.createIndex({ email: 1 }, { unique: true, sparse: true });
    await User.collection.createIndex({ username: 1 }, { unique: true, sparse: true });
    await Department.collection.createIndex({ name: 1 }, { unique: true });
    console.log('✓ Indexes created successfully');

    // Create default admin user
    console.log('Setting up admin user...');
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      const admin = new User({
        firstName: 'System',
        lastName: 'Administrator',
        email: 'admin@iqac.edu',
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
        isApproved: true,
      });
      await admin.save();
      console.log('✓ Admin user created');
      console.log('  Username: admin');
      console.log('  Password: Admin@123');
    } else {
      console.log('✓ Admin user already exists');
    }

    // Create default departments
    console.log('Setting up departments...');
    const deptCount = await Department.countDocuments();
    
    if (deptCount === 0) {
      await Department.insertMany([
        { 
          name: 'Computer Science & Engineering', 
          code: 'CSE',
          description: 'Department of Computer Science and Engineering'
        },
        { 
          name: 'Information Technology', 
          code: 'IT',
          description: 'Department of Information Technology'
        },
        { 
          name: 'Electrical Engineering', 
          code: 'EEE',
          description: 'Department of Electrical and Electronics Engineering'
        },
        { 
          name: 'Mechanical Engineering', 
          code: 'ME',
          description: 'Department of Mechanical Engineering'
        },
        { 
          name: 'Civil Engineering', 
          code: 'CE',
          description: 'Department of Civil Engineering'
        },
      ]);
      console.log('✓ Default departments created');
    } else {
      console.log('✓ Departments already exist');
    }

    console.log('\n═══════════════════════════════════════');
    console.log('✓ Database initialization completed!');
    console.log('═══════════════════════════════════════\n');
    
    process.exit(0);
  } catch (error) {
    console.error('✗ Database initialization error:', error.message);
    process.exit(1);
  }
}

initializeDatabase();
