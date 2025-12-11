# Detailed Installation Guide

## System Requirements

- **Operating System**: Windows 10+, macOS 10.12+, Linux
- **Node.js**: v16.0.0 or higher
- **npm**: v7.0.0 or higher
- **MongoDB**: v4.4 or higher (Local or Cloud)
- **RAM**: Minimum 2GB
- **Storage**: Minimum 500MB

## Step-by-Step Installation

### 1. Install Node.js

#### Windows:
1. Download from https://nodejs.org/
2. Run installer (choose LTS version)
3. Check installation: Open Command Prompt and type:
   \`\`\`
   node --version
   npm --version
   \`\`\`

#### macOS:
\`\`\`bash
brew install node
\`\`\`

#### Linux (Ubuntu/Debian):
\`\`\`bash
sudo apt-get update
sudo apt-get install nodejs npm
\`\`\`

### 2. Install MongoDB

#### Option A: Local MongoDB

**Windows:**
1. Download from https://www.mongodb.com/try/download/community
2. Run installer and follow setup wizard
3. MongoDB runs on `localhost:27017` by default

**macOS:**
\`\`\`bash
brew install mongodb-community
brew services start mongodb-community
\`\`\`

**Linux:**
\`\`\`bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
\`\`\`

#### Option B: MongoDB Atlas (Cloud) - Recommended

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create new project
4. Create cluster (choose free tier)
5. Add user with authentication
6. Get connection string
7. Copy connection string to `.env`

### 3. Download/Clone Project

\`\`\`bash
# Navigate to your projects folder
cd Projects

# Clone or extract project
git clone <repository-url>
# OR extract downloaded ZIP file
\`\`\`

### 4. Setup Backend

\`\`\`bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file with configuration
# On Windows:
copy .env.example .env
# On macOS/Linux:
cp .env.example .env

# Edit .env and update:
# - MONGODB_URI (if using Atlas)
# - JWT_SECRET (create strong random string)
\`\`\`

### 5. Setup Frontend

\`\`\`bash
# Navigate to client directory (from server parent)
cd ../client

# Install dependencies
npm install

# Create .env.local file
# On Windows:
copy .env.local.example .env.local
# On macOS/Linux:
cp .env.local.example .env.local
\`\`\`

### 6. Run Application

#### Terminal 1 - Start Backend:
\`\`\`bash
cd server
npm start
# You should see: "Server running on port 5000"
\`\`\`

#### Terminal 2 - Start Frontend:
\`\`\`bash
cd client
npm run dev
# You should see: "Ready in X.XXs"
\`\`\`

#### Open in Browser:
\`\`\`
http://localhost:3000
\`\`\`

## Verification Checklist

- [ ] Node.js installed (`node -v` shows version)
- [ ] npm installed (`npm -v` shows version)
- [ ] MongoDB running (check connection)
- [ ] Backend started on port 5000
- [ ] Frontend started on port 3000
- [ ] Can access http://localhost:3000
- [ ] Can see login page
- [ ] Can admin login (admin/admin@123)

## Troubleshooting Installation

### Issue: "MongoDB is not recognized"
**Solution**: Reinstall MongoDB and add to system PATH

### Issue: "Port 5000 already in use"
**Solution**: 
\`\`\`bash
# Kill process on port 5000
# Windows: netstat -ano | findstr :5000
# macOS/Linux: lsof -ti:5000 | xargs kill -9
# OR change PORT in server/.env to 5001
\`\`\`

### Issue: "npm install fails"
**Solution**: 
\`\`\`bash
# Clear npm cache
npm cache clean --force
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json
# Reinstall
npm install
\`\`\`

### Issue: "MongoDB connection refused"
**Solution**: 
- Ensure MongoDB service is running
- Check MONGODB_URI in .env
- For Atlas, check whitelist IP and password

### Issue: "Cannot find module"
**Solution**: 
\`\`\`bash
# Ensure you're in correct directory
# Run npm install again
npm install
\`\`\`

## Next Steps After Installation

1. **Change Admin Password**: Update `ADMIN_PASSWORD` in `server/.env`
2. **Change JWT_SECRET**: Generate strong random string
3. **Setup Email**: Configure SMTP in `.env` for notifications
4. **Create Departments**: Use admin panel to create departments
5. **Add Coordinators**: Register first coordinators manually

## Production Deployment

See DEPLOYMENT.md for detailed deployment instructions.
