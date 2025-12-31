import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const checkDatabaseStatus = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✓ Connected to MongoDB\n');

        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();

        console.log('📊 Database Status Report');
        console.log('========================\n');

        for (const collection of collections) {
            const collectionName = collection.name;
            const count = await db.collection(collectionName).countDocuments();
            const status = count > 0 ? '✓' : '✗';
            console.log(`${status} ${collectionName.padEnd(30)} ${count} documents`);
        }

        console.log('\n========================');
        await mongoose.disconnect();
        console.log('\n✓ Disconnected from MongoDB');
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

checkDatabaseStatus();
