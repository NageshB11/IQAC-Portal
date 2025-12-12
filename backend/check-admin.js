import mongoose from 'mongoose';
import User from './models/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/iqac-portal';

async function checkAdmin() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✓ Connected to MongoDB\n');

        const admin = await User.findOne({ username: 'admin' });

        if (admin) {
            console.log('✓ Admin account exists!');
            console.log('\nAdmin Details:');
            console.log('  Username:', admin.username);
            console.log('  Email:', admin.email);
            console.log('  Role:', admin.role);
            console.log('  Approved:', admin.isApproved);
            console.log('\nLogin with:');
            console.log('  Username: admin');
            console.log('  Password: admin123');
        } else {
            console.log('✗ Admin account NOT found!');
            console.log('\nRun this command to create admin:');
            console.log('  node server/create-admin.js');
        }

        // Check all users
        const allUsers = await User.find().select('username role');
        console.log(`\nTotal users in database: ${allUsers.length}`);
        allUsers.forEach(user => {
            console.log(`  - ${user.username} (${user.role})`);
        });

        process.exit(0);
    } catch (error) {
        console.error('\n✗ Error:', error.message);
        process.exit(1);
    }
}

checkAdmin();
