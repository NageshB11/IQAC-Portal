import mongoose from 'mongoose';
import User from './models/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/iqac-portal';

async function showAdmin() {
    try {
        await mongoose.connect(MONGODB_URI);
        const admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            console.log('Admin not found');
        } else {
            console.log('Admin user:', {
                username: admin.username,
                passwordHash: admin.password,
                role: admin.role,
                isApproved: admin.isApproved,
            });
        }
        process.exit(0);
    } catch (e) {
        console.error('Error', e);
        process.exit(1);
    }
}

showAdmin();
