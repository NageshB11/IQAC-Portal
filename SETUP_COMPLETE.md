# IQAC Portal - Complete Setup Guide

## 🚀 Quick Start (5 minutes)

### 1. MongoDB Setup (Choose One)

**Option A: Docker (Easiest)**
\`\`\`bash
docker run -d -p 27017:27017 --name iqac-mongodb mongo:latest
\`\`\`

**Option B: Local Installation**
- **Windows**: Download from https://www.mongodb.com/try/download/community
- **macOS**: `brew install mongodb-community && brew services start mongodb-community`
- **Linux**: `sudo apt-get install -y mongodb && sudo systemctl start mongod`

**Option C: MongoDB Atlas (Cloud - No Installation)**
- Go to https://www.mongodb.com/cloud/atlas
- Sign up → Create cluster → Get connection string

### 2. Backend Setup

\`\`\`bash
cd server

# Create .env file
cat > .env << EOF
MONGODB_URI=mongodb://localhost:27017/iqac-portal
JWT_SECRET=your-secret-key-change-in-production
PORT=5000
NODE_ENV=development
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Admin@123
EOF

# Install dependencies
npm install

# Initialize database
npm run init-db

# Start server
npm start
\`\`\`

**Expected Output:**
\`\`\`
✓ MongoDB connected successfully
✓ Server running on http://localhost:5000
\`\`\`

### 3. Frontend Setup (New Terminal)

\`\`\`bash
cd client

npm install
npm run dev
\`\`\`

**Open:** http://localhost:3000

### 4. Login

\`\`\`
Username: admin
Password: Admin@123
\`\`\`

---

## 📋 Detailed Setup by Environment

### Windows Setup

**Step 1: Install MongoDB**
\`\`\`bash
# Option A: Using Chocolatey
choco install mongodb-community

# Option B: Manual
# 1. Download from https://www.mongodb.com/try/download/community
# 2. Run installer
# 3. Choose "Install as a Service"
\`\`\`

**Step 2: Start MongoDB**
\`\`\`bash
# Check Services app → MongoDB Community Server → Status = Running
# Or in terminal:
net start MongoDB
\`\`\`

**Step 3: Verify**
\`\`\`bash
mongosh
# Should show: test>
\`\`\`

**Step 4: Backend Setup**
\`\`\`bash
cd server
npm install
npm run init-db
npm start
\`\`\`

### macOS Setup

**Step 1: Install MongoDB**
\`\`\`bash
brew tap mongodb/brew
brew install mongodb-community
\`\`\`

**Step 2: Start MongoDB**
\`\`\`bash
brew services start mongodb-community
\`\`\`

**Step 3: Verify**
\`\`\`bash
mongosh
# Should show: test>
\`\`\`

**Step 4: Backend Setup**
\`\`\`bash
cd server
npm install
npm run init-db
npm start
\`\`\`

### Linux Setup

**Step 1: Install MongoDB**
\`\`\`bash
# Ubuntu/Debian
curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-6.0.gpg

echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] http://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

sudo apt-get update
sudo apt-get install -y mongodb-org

sudo systemctl start mongod
sudo systemctl enable mongod
\`\`\`

**Step 2: Verify**
\`\`\`bash
mongosh
# Should show: test>
\`\`\`

**Step 3: Backend Setup**
\`\`\`bash
cd server
npm install
npm run init-db
npm start
\`\`\`

---

## 🔧 Troubleshooting

### MongoDB Connection Failed

**Error:** `connect ECONNREFUSED 127.0.0.1:27017`

**Solution:**
\`\`\`bash
# Check if MongoDB is running
mongosh

# If error, start MongoDB:
# Windows: net start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
# Docker: docker start iqac-mongodb
\`\`\`

### MongoDB Atlas Authentication Failed

**Error:** `Authentication failed`

**Solution:**
1. Go to MongoDB Atlas dashboard
2. Check username/password in Database Access
3. Add your IP address in Network Access
4. Update connection string in .env

### Server won't start

**Error:** `MONGODB_URI not set`

**Solution:**
\`\`\`bash
# Create .env file with:
echo MONGODB_URI=mongodb://localhost:27017/iqac-portal > .env
\`\`\`

### Port already in use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
\`\`\`bash
# Windows: netstat -ano | findstr :5000
# macOS/Linux: lsof -i :5000
# Kill process or use different port: PORT=5001 npm start
\`\`\`

---

## 📁 Project Structure

\`\`\`
iqac-portal/
├── server/                    # Backend
│   ├── models/               # MongoDB schemas
│   │   ├── User.js
│   │   ├── Department.js
│   │   ├── Document.js
│   │   ├── Feedback.js
│   │   └── Announcement.js
│   ├── routes/               # API routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── documents.js
│   │   ├── feedback.js
│   │   ├── announcements.js
│   │   └── departments.js
│   ├── middleware/
│   │   └── auth.js          # JWT verification
│   ├── scripts/
│   │   └── init-db.js       # Database initialization
│   ├── .env                 # Environment variables
│   ├── package.json
│   └── server.js            # Express app
│
├── client/                   # Frontend
│   ├── app/
│   │   ├── page.tsx         # Landing page
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── dashboard/
│   │       ├── admin/
│   │       ├── coordinator/
│   │       ├── faculty/
│   │       └── student/
│   ├── components/
│   │   ├── auth/
│   │   └── dashboard/
│   ├── package.json
│   └── .env.local
│
└── README.md
\`\`\`

---

## 🔐 Default Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | Admin@123 |

**Change these after first login!**

---

## ✅ Verification Checklist

- [ ] MongoDB installed and running
- [ ] .env file created in server folder
- [ ] Backend dependencies installed (`npm install`)
- [ ] Database initialized (`npm run init-db`)
- [ ] Backend server running (`npm start`)
- [ ] Frontend server running (`npm run dev`)
- [ ] Can access http://localhost:3000
- [ ] Can login with admin credentials
- [ ] Can access admin dashboard

---

## 📚 Next Steps

1. Create departments in admin panel
2. Create coordinator accounts
3. Test faculty login and document upload
4. Test student feedback submission
5. Review approval workflows

---

## 🆘 Need Help?

1. Check [MONGODB_SETUP.md](./MONGODB_SETUP.md) for detailed MongoDB setup
2. Check [QUICK_START_MONGODB.md](./QUICK_START_MONGODB.md) for quick troubleshooting
3. Review logs in terminal for error messages
4. Check if MongoDB is running: `mongosh`

---

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment guide.

Happy coding!
