import mongoose from 'mongoose';
import User from './models/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/iqac-portal';

async function resetAdminPassword() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✓ Connected to MongoDB');
        const admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            console.log('✗ Admin not found');
            process.exit(1);
        }
        // Set plain password; pre-save hook will hash it
        admin.password = 'admin123';
        await admin.save();
        console.log('✓ Admin password reset to plain password (hashed by middleware)');
        process.exit(0);
    } catch (err) {
        console.error('Error resetting admin password:', err);
        process.exit(1);
    }
}

resetAdminPassword();
