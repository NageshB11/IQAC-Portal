import mongoose from 'mongoose';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/iqac-portal';

async function debugAdmin() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✓ Connected to MongoDB\n');

        // Find admin
        const admin = await User.findOne({ username: 'admin' });
        if (!admin) {
            console.log('✗ Admin not found!');
            process.exit(1);
        }

        console.log('Admin found:');
        console.log('  Username:', admin.username);
        console.log('  Role:', admin.role);
        console.log('  Password hash:', admin.password);
        console.log('  Hash length:', admin.password.length);
        console.log('  Hash starts with $2a or $2b:', admin.password.startsWith('$2'));
        console.log('');

        // Test password with schema method
        console.log('Testing password with schema method:');
        const isValid1 = await admin.comparePassword('admin123');
        console.log('  comparePassword("admin123"):', isValid1);
        console.log('');

        // Test password with bcrypt directly
        console.log('Testing password with bcrypt directly:');
        const isValid2 = await bcrypt.compare('admin123', admin.password);
        console.log('  bcrypt.compare("admin123", hash):', isValid2);
        console.log('');

        // Test with wrong password
        console.log('Testing with wrong password:');
        const isValid3 = await admin.comparePassword('wrongpassword');
        console.log('  comparePassword("wrongpassword"):', isValid3);
        console.log('');

        // Check if password was double-hashed
        console.log('Checking for double-hashing issue:');
        const testPlain = await bcrypt.compare('admin123', admin.password);
        const testHash = await bcrypt.compare(admin.password, admin.password);
        console.log('  Plain password match:', testPlain);
        console.log('  Hash-as-password match:', testHash);
        console.log('');

        process.exit(0);
    } catch (error) {
        console.error('✗ Error:', error);
        process.exit(1);
    }
}

debugAdmin();
