import mongoose from 'mongoose';
import User from './models/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/iqac-portal';

async function testAdminLogin() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✓ Connected to MongoDB\n');

        const admin = await User.findOne({ username: 'admin' });

        if (!admin) {
            console.log('✗ Admin not found!');
            process.exit(1);
        }

        console.log('✓ Admin found!');
        console.log('  Username:', admin.username);
        console.log('  Role:', admin.role);

        // Test password
        const testPassword = 'admin123';
        const isValid = await admin.comparePassword(testPassword);

        console.log(`\nPassword test for "${testPassword}":`, isValid ? '✓ VALID' : '✗ INVALID');

        if (!isValid) {
            console.log('\n⚠️  Password mismatch! Resetting password to admin123...');
            admin.password = 'admin123';
            await admin.save();
            console.log('✓ Password reset successfully!');

            // Test again
            const admin2 = await User.findOne({ username: 'admin' });
            const isValid2 = await admin2.comparePassword('admin123');
            console.log('Password test after reset:', isValid2 ? '✓ VALID' : '✗ INVALID');
        }

        console.log('\n=================================');
        console.log('You can now login with:');
        console.log('  Username: admin');
        console.log('  Password: admin123');
        console.log('=================================');

        process.exit(0);
    } catch (error) {
        console.error('\n✗ Error:', error.message);
        console.error(error);
        process.exit(1);
    }
}

testAdminLogin();