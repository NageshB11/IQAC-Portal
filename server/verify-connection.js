require('dotenv').config();
const mongoose = require('mongoose');

async function verifyConnection() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/iqac-portal';
    console.log('Attempting to connect to:', uri.replace(/\/\/.*:.*@/, '//***:***@'));
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log('✓ Successfully connected to MongoDB');
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('✓ Collections in database:');
    collections.forEach(col => console.log(`  - ${col.name}`));
    
    const stats = await mongoose.connection.db.stats();
    console.log(`✓ Database size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    
    await mongoose.disconnect();
    console.log('✓ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('✗ Connection error:', error.message);
    process.exit(1);
  }
}

verifyConnection();
