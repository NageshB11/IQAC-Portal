import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

async function createAdmin() {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;

        if (!MONGODB_URI) {
            console.error('✗ MONGODB_URI not set in .env file');
            process.exit(1);
        }

        await mongoose.connect(MONGODB_URI);
        console.log('✓ Connected to MongoDB');
        console.log(`  Host: ${mongoose.connection.host}`);
        console.log(`  Database: ${mongoose.connection.name}\n`);

        // Check if admin already exists
        const existingAdmin = await User.findOne({ username: 'admin' });

        if (existingAdmin) {
            console.log('⚠️  Admin user already exists!');
            console.log('  Username:', existingAdmin.username);
            console.log('  Role:', existingAdmin.role);

            // Reset password to ensure it works
            console.log('\n🔄 Resetting password to "admin123"...');
            existingAdmin.password = 'admin123';
            await existingAdmin.save();
            console.log('✓ Password reset successfully!');
        } else {
            console.log('📝 Creating new admin user...');

            const admin = new User({
                username: 'admin',
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@iqac.edu',
                password: 'admin123',
                role: 'admin',
                isApproved: true
            });

            await admin.save();
            console.log('✓ Admin user created successfully!');
        }

        console.log('\n=================================');
        console.log('Admin Credentials:');
        console.log('  Username: admin');
        console.log('  Password: admin123');
        console.log('  Login URL: http://localhost:3000/admin-login');
        console.log('=================================');

        // Verify the admin can be found
        const verifyAdmin = await User.findOne({ username: 'admin', role: 'admin' });
        console.log('\n✓ Verification:', verifyAdmin ? 'Admin can be found in database' : '✗ Admin NOT found');

        if (verifyAdmin) {
            const passwordTest = await verifyAdmin.comparePassword('admin123');
            console.log('✓ Password test:', passwordTest ? 'PASSED' : 'FAILED');
        }

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('\n✗ Error:', error.message);
        console.error(error);
        process.exit(1);
    }
}

createAdmin();
