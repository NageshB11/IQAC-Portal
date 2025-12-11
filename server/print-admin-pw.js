import mongoose from 'mongoose';
import User from './models/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/iqac-portal';

(async () => {
    await mongoose.connect(MONGODB_URI);
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) { console.log('Admin not found'); process.exit(1); }
    console.log('Password length:', admin.password.length);
    console.log('Password value:', admin.password);
    process.exit(0);
})();
