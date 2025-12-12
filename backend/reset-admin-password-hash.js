import mongoose from 'mongoose';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/iqac-portal';

(async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✓ Connected to MongoDB');
        const hash = bcrypt.hashSync('admin123', 10);
        const result = await User.updateOne({ role: 'admin' }, { $set: { password: hash } });
        console.log('Update result:', result);
        console.log('✓ Admin password hash set directly');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
})();
