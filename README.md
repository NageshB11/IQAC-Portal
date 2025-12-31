# 🎓 IQAC Portal - Faculty Activity Management System

A comprehensive web-based portal for managing and tracking faculty activities, student records, and institutional events for Internal Quality Assurance Cell (IQAC) at MGM's College of Engineering, Nanded.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [Default Credentials](#-default-credentials)
- [Deployment](#-deployment)
- [Database Management](#-database-management)
- [Contributing](#-contributing)

---

## ✨ Features

### 👨‍💼 **Admin Features**
- ✅ Manage all departments and coordinators
- ✅ View and approve faculty activities
- ✅ Generate comprehensive reports (PDF & Excel)
- ✅ Monitor system-wide statistics
- ✅ Activity logs and audit trails
- ✅ User management (Faculty, Coordinators, Students)

### 👥 **Coordinator Features**
- ✅ Manage department faculty members
- ✅ View department-specific activities
- ✅ Generate department reports
- ✅ Monitor student feedback
- ✅ Approve/reject faculty submissions

### 👨‍🏫 **Faculty Features**
- ✅ Submit research publications
- ✅ Record professional development activities (FDP/STTP)
- ✅ Log courses taught
- ✅ Submit events organized
- ✅ Track personal activity history

### 👨‍🎓 **Student Features**
- ✅ View academic information
- ✅ Submit feedback
- ✅ Track achievements
- ✅ View timetables

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** Next.js 16.0 (React 19.2)
- **Language:** TypeScript 5.0
- **Styling:** Tailwind CSS 4.1
- **UI Components:** Radix UI, Shadcn/ui
- **Forms:** React Hook Form + Zod validation
- **Charts:** Recharts
- **HTTP Client:** Axios

### **Backend**
- **Runtime:** Node.js 18+
- **Framework:** Express.js 4.18
- **Database:** MongoDB 7.0 with Mongoose ODM
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Report Generation:** PDFKit, ExcelJS

---

## 📁 Project Structure

```
iqacportalproject1/
├── frontend/                     # Next.js frontend
│   ├── app/                      # Next.js app directory
│   ├── components/               # React components
│   ├── public/                   # Static assets
│   └── package.json              # Frontend dependencies
│
├── backend/                      # Express backend
│   ├── models/                   # Mongoose models
│   ├── routes/                   # API routes
│   ├── server.js                 # Main server file
│   └── package.json              # Backend dependencies
│
├── README.md                     # This file
├── netlify.toml                  # Netlify deployment config
└── render.yaml                   # Render deployment config
```

---

## 🚀 Installation

### **Prerequisites**
- Node.js 18+ ([Download](https://nodejs.org/))
- MongoDB 7.0+ ([Download](https://www.mongodb.com/try/download/community)) or MongoDB Atlas account
- Git ([Download](https://git-scm.com/))

### **Step 1: Clone Repository**
```bash
git clone https://github.com/NageshB11/IQAC-Portal.git
cd iqacportalproject1
```

### **Step 2: Install Backend Dependencies**
```bash
cd backend
npm install
cd ..
```

### **Step 3: Install Frontend Dependencies**
```bash
cd frontend
npm install
cd ..
```

### **Step 4: Set Up Environment Variables**

**Frontend (frontend/.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Backend (backend/.env):**
```env
MONGODB_URI=mongodb://localhost:27017/iqac-portal
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
PORT=5000
NODE_ENV=development
```

---

## 🗄️ Database Setup

### **Option 1: Local MongoDB**

1. **Install MongoDB** on your system
2. **Start MongoDB service:**
   ```bash
   # Windows
   net start MongoDB
   
   # Linux/Mac
   sudo systemctl start mongod
   ```

3. **Initialize Database:**
   ```bash
   cd backend
   
   # Create departments and coordinators
   node seed-departments-coordinators.js
   
   # Create admin account
   node create-admin.js
   
   # Seed institutional events
   node seed-institutional-events.js
   
   # Seed professional development data
   node seed-professional-development.js
   ```

4. **Verify Database:**
   ```bash
   node verify-database.js
   ```

### **Option 2: MongoDB Atlas (Cloud)**

1. **Create Account:** Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Create Free Cluster (M0)**
3. **Create Database User:**
   - Go to "Database Access"
   - Add new user with password
   - Role: "Read and write to any database"
4. **Allow Network Access:**
   - Go to "Network Access"
   - Add IP Address → "Allow Access from Anywhere" (0.0.0.0/0)
5. **Get Connection String:**
   - Go to "Database" → "Connect" → "Drivers"
   - Copy connection string
   - Replace `<password>` with your actual password
6. **Update backend/.env:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/iqac-portal
   ```
7. **Run seed scripts** (same as Option 1)

---

## 💻 Running the Application

### **Development Mode**

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

## 🔑 Default Credentials

After running seed scripts, use these credentials to login:

### **Admin:**
```
Email:    admin@mgmcen.ac.in
Password: Admin@123
```

### **Coordinators:**
```
CSE:   cse.coord@iqac.edu    / cse123
IT:    it.coord@iqac.edu     / it123
ENTC:  entc.coord@iqac.edu   / entc123
EEE:   eee.coord@iqac.edu    / eee123
ME:    mech.coord@iqac.edu   / mech123
CE:    civil.coord@iqac.edu  / civil123
```

**⚠️ IMPORTANT:** Change all default passwords after first login!

---

## 🌐 Deployment

### **Quick Deployment (Free Tier)**

#### **1. Database - MongoDB Atlas (Free)**
- Sign up at https://www.mongodb.com/cloud/atlas
- Create M0 free cluster
- Get connection string
- Run seed scripts to populate data

#### **2. Backend - Render.com (Free)**

1. Login to [Render.com](https://render.com)
2. Click **"New"** → **"Web Service"**
3. Connect your GitHub repository
4. **Root Directory:** `backend`
5. **Build Command:** `npm install`
6. **Start Command:** `npm start`
7. **Environment Variables:**
   ```
   MONGODB_URI=<your-mongodb-atlas-connection-string>
   JWT_SECRET=<your-secret-key-min-32-chars>
   NODE_ENV=production
   ```
8. Click **"Create Web Service"**
9. Copy your Service URL (e.g., `https://iqac-backend.onrender.com`)

#### **3. Frontend - Netlify (Free)**

1. Login to [Netlify](https://www.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect with GitHub and select your repository
4. **Base directory:** `frontend`
5. **Build command:** `npm run build`
6. **Publish directory:** `.next`
7. **Environment Variables:**
   ```
   NEXT_PUBLIC_API_URL=<your-render-backend-url>
   ```
   (Example: `https://iqac-backend.onrender.com` - NO trailing slash)
8. Click **"Deploy"**

### **Seed Cloud Database**

After deployment, seed your cloud database:

1. Update your local `backend/.env` with Atlas connection string
2. Run seed scripts locally:
   ```bash
   cd backend
   node seed-departments-coordinators.js
   node create-admin.js
   node seed-institutional-events.js
   node seed-professional-development.js
   ```
3. Data will be added to your cloud database
4. Now you can login to your deployed application!

---

## 📊 Database Management

### **View Database (MongoDB Compass)**

1. **Download:** https://www.mongodb.com/try/download/compass
2. **Connect:** `mongodb://localhost:27017/iqac-portal`
3. **Browse Collections:**
   - users
   - departments
   - institutionalevents
   - professionaldevelopments
   - feedbacks
   - timetables
   - announcements
   - documents

### **Backup Database**

**Windows:**
```bash
# Double-click backup-database.bat
# Or run manually:
mongodump --db iqac-portal --out C:\backup\iqac-portal
```

**Linux/Mac:**
```bash
mongodump --db iqac-portal --out ~/backup/iqac-portal
```

### **Restore Database**

```bash
mongorestore --db iqac-portal /path/to/backup/iqac-portal
```

### **Export to JSON**

**Windows:**
```bash
# Double-click export-database.bat
# Or run manually:
mongoexport --db iqac-portal --collection users --out users.json
```

---

## 🔧 Useful Scripts

### **Backend Scripts**

```bash
cd backend

# Verify database status
node verify-database.js

# Check admin account
node check-admin.js

# Create new coordinator
node addCoordinator.js

# Reset database
node reset-database.js
```

### **Database Utilities**

- **`initialize-database.bat`** - Initialize complete database
- **`backup-database.bat`** - Create database backup
- **`export-database.bat`** - Export all collections to JSON

---

## 👥 User Roles

### **1. Admin**
- Full system access
- Manage all users and departments
- Generate system-wide reports
- View all activities

### **2. Coordinator**
- Department-level access
- Manage department faculty
- Approve faculty activities
- Generate department reports

### **3. Faculty**
- Personal activity management
- Submit research publications
- Record professional development
- Log courses taught

### **4. Student**
- View academic information
- Submit feedback
- Track achievements

---

## 📊 Data Models

### **Key Collections**

**Users:**
- Admin, Coordinator, Faculty, Student accounts
- Role-based access control
- Department associations

**Departments:**
- 6 Engineering departments (CSE, IT, ENTC, EEE, ME, CE)
- Coordinator assignments
- Faculty listings

**Faculty Activities:**
- Research Publications
- Professional Development (FDP/STTP)
- Courses Taught
- Events Organized

**Institutional Events:**
- Workshops/Seminars/Conferences
- Department-wise categorization
- Participant tracking

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Nagesh B**
- GitHub: [@NageshB11](https://github.com/NageshB11)
- Project: IQAC Portal

---

## 🙏 Acknowledgments

- MGM's College of Engineering, Nanded
- Next.js and React teams
- MongoDB team
- All contributors and testers

---

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: admin@mgmcen.ac.in

---

## 🔄 Version History

**v1.0.0** (December 2024)
- Initial release
- Complete IQAC portal with all features
- 31 institutional events pre-loaded
- Multi-role support
- Report generation (PDF/Excel)
- Activity logging and audit trails

---

**⭐ If you find this project useful, please consider giving it a star!**

---

**Made with ❤️ for MGM's College of Engineering, Nanded**
