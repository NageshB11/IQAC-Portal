import mongoose from 'mongoose';
import User from './models/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/iqac-portal';

async function recreateAdmin() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✓ Connected to MongoDB');

        // Delete existing admin
        await User.deleteOne({ role: 'admin' });
        console.log('✓ Deleted old admin account');

        // Create new admin
        const admin = new User({
            username: 'admin',
            password: 'admin123',
            role: 'admin',
            firstName: 'System',
            lastName: 'Admin',
            email: 'admin@iqac.com',
            isApproved: true
        });

        await admin.save();
        console.log('✓ New admin created successfully!');

        // Verify
        const savedAdmin = await User.findOne({ role: 'admin' });
        const isValid = await savedAdmin.comparePassword('admin123');
        console.log('Password verification:', isValid ? '✓ VALID' : '✗ INVALID');

        console.log('\n=================================');
        console.log('Admin Login Credentials:');
        console.log('=================================');
        console.log('Username: admin');
        console.log('Password: admin123');
        console.log('=================================\n');

        process.exit(0);
    } catch (error) {
        console.error('✗ Error:', error.message);
        process.exit(1);
    }
}

recreateAdmin();
