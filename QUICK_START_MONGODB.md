# MongoDB Quick Start Guide - IQAC Portal

## 30-Second Setup (Choose One)

### Option 1: Local MongoDB (5 minutes)

**Windows:**
\`\`\`bash
# Download installer: https://www.mongodb.com/try/download/community
# Run installer → Next → Next → Install
# MongoDB auto-starts as service
\`\`\`

**macOS (using Homebrew):**
\`\`\`bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
\`\`\`

**Linux (Ubuntu/Debian):**
\`\`\`bash
sudo apt-get update
sudo apt-get install -y mongodb
sudo systemctl start mongod
\`\`\`

### Option 2: Docker (2 minutes - Recommended for beginners)
\`\`\`bash
# Install Docker from https://www.docker.com/products/docker-desktop

# Run MongoDB in Docker
docker run -d -p 27017:27017 --name iqac-mongodb mongo:latest

# That's it! MongoDB is running
\`\`\`

### Option 3: MongoDB Atlas Cloud (3 minutes - No installation needed)
\`\`\`bash
# 1. Go to https://www.mongodb.com/cloud/atlas
# 2. Sign up (free)
# 3. Create a cluster (click "Create" → choose "Free" → wait 10 mins)
# 4. Get connection string and save it
# 5. Come back to Step 3 below
\`\`\`

---

## Step-by-Step Setup

### Step 1: Verify MongoDB is Running

\`\`\`bash
# Test connection
mongosh

# You should see: test>
# If you see this, MongoDB is working!
# Type 'exit' to quit
\`\`\`

**Not working?** See [Troubleshooting](#troubleshooting) below.

### Step 2: Update .env File

**For Local MongoDB:**
\`\`\`env
MONGODB_URI=mongodb://localhost:27017/iqac-portal
JWT_SECRET=your-secret-key-change-in-production
PORT=5000
NODE_ENV=development
\`\`\`

**For MongoDB Atlas:**
\`\`\`env
MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/iqac-portal?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-change-in-production
PORT=5000
NODE_ENV=development
\`\`\`

### Step 3: Initialize Database

\`\`\`bash
# Navigate to server folder
cd server

# Install dependencies (first time only)
npm install

# Initialize database with admin user
npm run init-db

# You should see:
# ✓ Connected to MongoDB successfully
# ✓ Indexes created successfully
# ✓ Admin user created
# ✓ Default departments created
\`\`\`

### Step 4: Start Backend Server

\`\`\`bash
npm start

# You should see:
# Server running on port 5000
# MongoDB connected
# ✓ Database ready
\`\`\`

### Step 5: Start Frontend (New Terminal)

\`\`\`bash
cd client
npm install
npm run dev

# Open http://localhost:3000
\`\`\`

---

## Login with Default Admin

\`\`\`
Username: admin
Password: Admin@123
\`\`\`

Change these credentials after first login!

---

## Troubleshooting

### Error: "connect ECONNREFUSED 127.0.0.1:27017"

**Solution:** MongoDB isn't running
\`\`\`bash
# Windows: Open Services app and start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
# Docker: docker start iqac-mongodb
\`\`\`

### Error: "Authentication failed"

**Solution:** Wrong MongoDB Atlas password
1. Go to MongoDB Atlas → Database Access
2. Verify username and password
3. Ensure IP is whitelisted (Add your IP)
4. Update .env with correct credentials

### Error: "MongooseError: Cannot connect"

**Solution:** Wrong connection string
\`\`\`bash
# Test your connection string:
mongosh "your-connection-string-here"

# Should show: test>
\`\`\`

### MongoDB not installed?

**Quick fix - Use Docker:**
\`\`\`bash
docker run -d -p 27017:27017 --name iqac-mongodb mongo:latest
\`\`\`

---

## Docker Alternative Setup

If you prefer Docker, use this:

\`\`\`bash
# Create a docker-compose.yml in project root
cat > docker-compose.yml << EOF
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: iqac-portal

volumes:
  mongo_data:
EOF

# Start MongoDB
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f mongodb

# Stop MongoDB
docker-compose down
\`\`\`

---

## Useful Commands

\`\`\`bash
# Connect to MongoDB
mongosh

# Inside MongoDB shell:
show databases              # List all databases
use iqac-portal             # Switch to database
show collections            # List collections
db.users.find()             # See all users
db.users.findOne()          # See first user
db.users.countDocuments()   # Count users
\`\`\`

---

## Next Steps

1. Login to admin dashboard
2. Create departments
3. Create coordinator accounts
4. Test faculty and student portals

For detailed setup, see [MONGODB_SETUP.md](./MONGODB_SETUP.md)

Happy coding!
