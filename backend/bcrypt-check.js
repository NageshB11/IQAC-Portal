import mongoose from 'mongoose';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/iqac-portal';

(async () => {
    await mongoose.connect(MONGODB_URI);
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) { console.log('Admin not found'); process.exit(1); }
    const match = bcrypt.compareSync('admin123', admin.password);
    console.log('bcrypt compare sync result:', match);
    process.exit(0);
})();
