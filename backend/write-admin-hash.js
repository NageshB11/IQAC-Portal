import mongoose from 'mongoose';
import User from './models/User.js';
import fs from 'fs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/iqac-portal';

(async () => {
    await mongoose.connect(MONGODB_URI);
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) { console.log('Admin not found'); process.exit(1); }
    const hash = admin.password;
    fs.writeFileSync('admin-hash.txt', hash);
    console.log('Hash written to admin-hash.txt');
    process.exit(0);
})();
