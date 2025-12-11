# MongoDB Setup Guide for IQAC Portal

## Table of Contents
1. [Local MongoDB Setup](#local-mongodb-setup)
2. [MongoDB Atlas (Cloud) Setup](#mongodb-atlas-cloud-setup)
3. [Database Initialization](#database-initialization)
4. [Connection Troubleshooting](#connection-troubleshooting)

---

## Local MongoDB Setup

### Windows

#### Option 1: Using MongoDB Installer (Recommended)
1. Download MongoDB Community Edition from https://www.mongodb.com/try/download/community
2. Run the installer and follow the setup wizard
3. Choose "Install as a Service" for automatic startup
4. MongoDB will be installed at `C:\Program Files\MongoDB\Server\[version]`

#### Option 2: Using Chocolatey
\`\`\`bash
choco install mongodb-community
\`\`\`

#### Option 3: Manual Installation
1. Download the MSI installer
2. Extract to `C:\Program Files\MongoDB\Server\[version]`
3. Create data directories:
\`\`\`bash
mkdir C:\data\db
mkdir C:\data\log
\`\`\`
4. Start MongoDB:
\`\`\`bash
cd "C:\Program Files\MongoDB\Server\[version]\bin"
mongod.exe --dbpath C:\data\db --logpath C:\data\log\mongod.log
\`\`\`

#### Verify Windows Installation
\`\`\`bash
# Test MongoDB connection
mongo --version
mongo  # Should connect to local server
\`\`\`

---

### macOS

#### Option 1: Using Homebrew (Recommended)
\`\`\`bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Add MongoDB tap
brew tap mongodb/brew

# Install MongoDB
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Verify installation
mongosh  # MongoDB shell (or mongo for older versions)
\`\`\`

#### Option 2: Using Docker
\`\`\`bash
docker pull mongo
docker run -d -p 27017:27017 --name mongodb mongo
\`\`\`

#### Verify macOS Installation
\`\`\`bash
mongosh --version
mongosh  # Connect to local server
\`\`\`

---

### Linux (Ubuntu/Debian)

\`\`\`bash
# Import MongoDB GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-6.0.gpg

# Add MongoDB repository
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] http://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update package list
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod  # Enable on startup

# Verify installation
mongosh --version
mongosh  # Connect to local server
\`\`\`

---

## MongoDB Atlas (Cloud) Setup

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Sign up with email/Google/GitHub

### Step 2: Create Cluster
1. Click "Create" on the Deployment page
2. Select "Shared" (Free Tier)
3. Select your preferred cloud provider (AWS, Google Cloud, Azure)
4. Select region closest to you
5. Name your cluster (e.g., "iqac-portal-cluster")
6. Click "Create Deployment"

### Step 3: Setup Security
1. Create a Database User:
   - Username: `iqac_user` (or preferred)
   - Password: Generate secure password (copy it!)
   - Click "Create User"

2. Add IP Address:
   - Click "Add My Current IP Address" (or)
   - Add `0.0.0.0/0` to allow all connections (less secure)
   - Click "Confirm"

### Step 4: Get Connection String
1. Click "Connect" button on your cluster
2. Select "Drivers"
3. Choose Node.js driver
4. Copy the connection string
5. Replace `<password>` with your database user password

Connection String Example:
\`\`\`
mongodb+srv://iqac_user:YOUR_PASSWORD@iqac-portal-cluster.xxxxx.mongodb.net/iqac-portal?retryWrites=true&w=majority
\`\`\`

### Step 5: Update .env File
\`\`\`env
MONGODB_URI=mongodb+srv://iqac_user:YOUR_PASSWORD@iqac-portal-cluster.xxxxx.mongodb.net/iqac-portal?retryWrites=true&w=majority
\`\`\`

---

## Database Initialization

### Create Admin User & Initial Data

Create a new file `server/scripts/init-db.js`:

\`\`\`javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/iqac-portal';

async function initializeDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Create indexes
    const User = require('../models/User');
    const Department = require('../models/Department');

    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ username: 1 }, { unique: true, sparse: true });
    await Department.collection.createIndex({ name: 1 }, { unique: true });

    console.log('Indexes created successfully');

    // Create default admin (if not exists)
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      const admin = new User({
        fullName: 'System Administrator',
        email: 'admin@iqac.edu',
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
        isApproved: true,
      });
      await admin.save();
      console.log('Default admin user created');
      console.log('Username: admin');
      console.log('Password: Admin@123');
    }

    // Create default departments
    const dept1 = await Department.findOne({ code: 'CSE' });
    if (!dept1) {
      await Department.create([
        { name: 'Computer Science & Engineering', code: 'CSE' },
        { name: 'Information Technology', code: 'IT' },
        { name: 'Electrical Engineering', code: 'EEE' },
        { name: 'Mechanical Engineering', code: 'ME' },
      ]);
      console.log('Default departments created');
    }

    console.log('Database initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization error:', error);
    process.exit(1);
  }
}

initializeDatabase();
\`\`\`

### Run Initialization Script

\`\`\`bash
# Navigate to server directory
cd server

# Install dependencies (if not done)
npm install

# Create .env file with MongoDB URI
# Edit server/.env and add MONGODB_URI

# Run initialization
node scripts/init-db.js
\`\`\`

Expected output:
\`\`\`
Connected to MongoDB
Indexes created successfully
Default admin user created
Username: admin
Password: Admin@123
Default departments created
Database initialization completed successfully!
\`\`\`

---

## Connection Troubleshooting

### Local MongoDB Connection Issues

#### Problem: "connect ECONNREFUSED 127.0.0.1:27017"
**Solution:**
\`\`\`bash
# Windows
net start MongoDB  # or check Services app

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
\`\`\`

#### Problem: "MongooseError: Cannot connect to MongoDB"
**Solution:**
1. Verify MongoDB is running:
   \`\`\`bash
   # Windows: Services app or "net start MongoDB"
   # macOS: brew services list
   # Linux: sudo systemctl status mongod
   \`\`\`

2. Check default port:
   \`\`\`bash
   mongosh  # Should connect to localhost:27017
   \`\`\`

3. Verify .env file:
   \`\`\`env
   MONGODB_URI=mongodb://localhost:27017/iqac-portal
   \`\`\`

### MongoDB Atlas Connection Issues

#### Problem: "Authentication failed"
**Solution:**
1. Verify username and password are correct
2. Check password doesn't have special characters that need URL encoding
3. If password has special chars, URL encode it:
   - `@` → `%40`
   - `#` → `%23`
   - `:` → `%3A`

#### Problem: "getaddrinfo ENOTFOUND cluster.xxxxx.mongodb.net"
**Solution:**
1. Check internet connection
2. Verify connection string is correct
3. Ensure IP address is whitelisted in MongoDB Atlas

#### Problem: "connection refused"
**Solution:**
1. Add your IP address in MongoDB Atlas Network Access
2. Or add `0.0.0.0/0` to allow all IPs (test only)
3. Wait 5 minutes for whitelist to take effect

---

## Verify MongoDB Connection

### Using MongoDB Shell

#### Local:
\`\`\`bash
mongosh  # or mongo
use iqac-portal
db.users.find()
\`\`\`

#### MongoDB Atlas:
\`\`\`bash
mongosh "mongodb+srv://iqac_user:PASSWORD@cluster.xxxxx.mongodb.net/iqac-portal"
\`\`\`

### Using Node.js Script

Create `verify-connection.js`:

\`\`\`javascript
const mongoose = require('mongoose');

async function verifyConnection() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/iqac-portal';
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Successfully connected to MongoDB');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    process.exit(0);
  } catch (error) {
    console.error('Connection error:', error.message);
    process.exit(1);
  }
}

verifyConnection();
\`\`\`

Run:
\`\`\`bash
node verify-connection.js
\`\`\`

---

## MongoDB Best Practices

1. **Use Connection Pools**: Always use connection pooling in production
2. **Enable Authentication**: Use strong passwords for database users
3. **Use IP Whitelist**: Only allow trusted IPs in MongoDB Atlas
4. **Regular Backups**: Enable automated backups in MongoDB Atlas
5. **Monitor Performance**: Use MongoDB Atlas monitoring tools
6. **Use Indexes**: Create indexes on frequently queried fields
7. **Encrypt Connections**: Always use SSL/TLS for Atlas connections

---

## Useful MongoDB Commands

\`\`\`bash
# Connect to local MongoDB
mongosh

# List all databases
show databases

# Switch to database
use iqac-portal

# List collections
show collections

# Count documents
db.users.countDocuments()

# Find all users
db.users.find()

# Find specific user
db.users.findOne({ email: "user@example.com" })

# Delete all data (careful!)
db.users.deleteMany({})

# Drop database
db.dropDatabase()
\`\`\`

---

## Next Steps

After MongoDB setup:
1. Run the initialization script: `node scripts/init-db.js`
2. Start the backend server: `npm start`
3. Start the frontend: `npm run dev`
4. Login with admin credentials

Happy coding!
