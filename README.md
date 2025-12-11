# 🎓 IQAC Portal - Faculty Activity Management System

A comprehensive web-based portal for managing and tracking faculty activities, student records, and institutional events for Internal Quality Assurance Cell (IQAC) at MGM's College of Engineering, Nanded.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Deployment](#-deployment)
- [User Roles](#-user-roles)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

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
- ✅ View timetables and schedules

### 👨‍🏫 **Faculty Features**
- ✅ Submit research publications
- ✅ Record professional development activities (FDP/STTP)
- ✅ Log courses taught
- ✅ Submit events organized
- ✅ Track personal activity history
- ✅ Download activity reports

### 👨‍🎓 **Student Features**
- ✅ View academic information
- ✅ Submit feedback
- ✅ Track achievements
- ✅ View timetables
- ✅ Access course materials

### 📊 **Reporting & Analytics**
- ✅ Multi-format reports (PDF, Excel)
- ✅ Year-wise activity filtering
- ✅ Department-wise statistics
- ✅ Activity type categorization
- ✅ Professional headers with college branding
- ✅ Downloadable documents

### 🏛️ **Institutional Events**
- ✅ 31 pre-loaded workshops/seminars/conferences (2023-24)
- ✅ Department-wise event tracking
- ✅ Participant count management
- ✅ Activity report links
- ✅ Event categorization

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** Next.js 16.0 (React 19.2)
- **Language:** TypeScript 5.0
- **Styling:** Tailwind CSS 4.1
- **UI Components:** Radix UI, Shadcn/ui
- **Forms:** React Hook Form + Zod validation
- **Charts:** Recharts
- **Icons:** Lucide React
- **HTTP Client:** Axios

### **Backend**
- **Runtime:** Node.js 18+
- **Framework:** Express.js 4.18
- **Language:** JavaScript (ES6 Modules)
- **Database:** MongoDB 7.0 with Mongoose ODM
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **File Upload:** Multer
- **Validation:** Express Validator
- **Report Generation:** PDFKit, ExcelJS

### **Database**
- **Primary DB:** MongoDB
- **ODM:** Mongoose
- **Models:** User, Department, FacultyActivity, ResearchPublication, ProfessionalDevelopment, InstitutionalEvent, CourseTaught, EventOrganized, StudentFeedback, Timetable

---

## 📁 Project Structure

```
iqacportalproject1/
├── app/                          # Next.js frontend
│   ├── components/              # React components
│   │   ├── auth/               # Authentication components
│   │   ├── dashboard/          # Dashboard components
│   │   │   ├── admin/         # Admin-specific components
│   │   │   ├── coordinator/   # Coordinator-specific components
│   │   │   ├── faculty/       # Faculty-specific components
│   │   │   └── student/       # Student-specific components
│   │   ├── navbar.tsx         # Navigation bar
│   │   └── theme-provider.tsx # Theme management
│   ├── utils/                  # Utility functions
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   └── globals.css             # Global styles
│
├── server/                      # Backend server
│   ├── models/                 # Mongoose models
│   │   ├── User.js
│   │   ├── Department.js
│   │   ├── FacultyActivity.js
│   │   ├── StudentFeedback.js
│   │   └── Timetable.js
│   ├── routes/                 # API routes
│   │   ├── auth.js            # Authentication routes
│   │   ├── faculty-activities.js
│   │   ├── reports.js         # PDF reports
│   │   ├── excel-reports.js   # Excel reports
│   │   ├── downloads.js       # File downloads
│   │   └── admin.js           # Admin routes
│   ├── middleware/             # Custom middleware
│   │   └── auth.js            # JWT authentication
│   ├── utils/                  # Utility functions
│   │   └── activityLogger.js  # Activity logging
│   ├── scripts/                # Database scripts
│   │   └── init-db.js         # Database initialization
│   ├── seed-*.js              # Data seeding scripts
│   ├── server.js              # Main server file
│   └── package.json           # Backend dependencies
│
├── lib/                        # Shared libraries
│   └── utils.ts               # Utility functions
│
├── hooks/                      # Custom React hooks
│   ├── use-toast.ts
│   └── use-mobile.ts
│
├── styles/                     # Additional styles
│   └── globals.css
│
├── public/                     # Static assets
│
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
├── package.json               # Frontend dependencies
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── next.config.js             # Next.js configuration
└── README.md                  # This file
```

---

## 🚀 Installation

### **Prerequisites**
- Node.js 18+ ([Download](https://nodejs.org/))
- MongoDB 7.0+ ([Download](https://www.mongodb.com/try/download/community)) or MongoDB Atlas account
- Git ([Download](https://git-scm.com/))

### **Step 1: Clone Repository**
```bash
git clone https://github.com/YOUR_USERNAME/iqac-portal.git
cd iqac-portal
```

### **Step 2: Install Frontend Dependencies**
```bash
npm install
```

### **Step 3: Install Backend Dependencies**
```bash
cd server
npm install
cd ..
```

### **Step 4: Set Up Environment Variables**

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Backend (server/.env):**
```env
MONGODB_URI=mongodb://localhost:27017/iqac-portal
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
PORT=5000
NODE_ENV=development
```

### **Step 5: Initialize Database**
```bash
cd server

# Create departments and coordinators
node seed-departments-coordinators.js

# Seed institutional events (workshops/seminars)
node seed-institutional-events.js

# Seed professional development data
node seed-professional-development.js

# Create admin account
node create-admin.js
```

### **Step 6: Start Development Servers**

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

## ⚙️ Configuration

### **Environment Variables**

#### **Frontend (.env.local)**
| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:5000` |

#### **Backend (server/.env)**
| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/iqac-portal` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-secret-key-min-32-chars` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` or `production` |

---

## 💻 Usage

### **Default Credentials**

After running seed scripts, you'll have:

**Admin:**
- Email: `admin@mgmcen.ac.in`
- Password: `Admin@123`

**Coordinators (6 departments):**
- Email: `cse.coord@mgmcen.ac.in` (Password: `CSE@2024`)
- Email: `it.coord@mgmcen.ac.in` (Password: `IT@2024`)
- Email: `mech.coord@mgmcen.ac.in` (Password: `MECH@2024`)
- Email: `civil.coord@mgmcen.ac.in` (Password: `CIVIL@2024`)
- Email: `ece.coord@mgmcen.ac.in` (Password: `ECE@2024`)
- Email: `eee.coord@mgmcen.ac.in` (Password: `EEE@2024`)

**⚠️ IMPORTANT:** Change all default passwords after first login!

### **Common Tasks**

#### **Generate Reports**
1. Login as Admin or Coordinator
2. Navigate to "Generate Report"
3. Select academic year, activity type, and format
4. Click "Generate Report"
5. Download PDF or Excel file

#### **Add Faculty Activity**
1. Login as Faculty
2. Navigate to respective section (Research, Professional Development, etc.)
3. Click "Add New"
4. Fill in the form
5. Submit for approval

#### **Approve Activities (Coordinator/Admin)**
1. Login as Coordinator or Admin
2. Navigate to "Faculty Activities" or "Document Approval"
3. Review submissions
4. Approve or reject with comments

---

## 🌐 Deployment

### **Quick Deployment (Free Tier)**

**1. Database - MongoDB Atlas (Free)**
- Sign up at https://www.mongodb.com/cloud/atlas
- Create M0 free cluster
- Get connection string

**2. Backend - Render.com (Free)**
- Sign up at https://render.com
- Create new Web Service
- Connect GitHub repository
- Set environment variables
- Deploy

**3. Frontend - Vercel (Free)**
- Sign up at https://vercel.com
- Import GitHub repository
- Set environment variables
- Deploy

**📖 Detailed Guide:** See [DEPLOYMENT_GUIDE_COMPLETE.md](./DEPLOYMENT_GUIDE_COMPLETE.md)

---

## 👥 User Roles

### **1. Admin**
- Full system access
- Manage all users and departments
- Generate system-wide reports
- View all activities
- Access activity logs

### **2. Coordinator**
- Department-level access
- Manage department faculty
- Approve faculty activities
- Generate department reports
- View student feedback

### **3. Faculty**
- Personal activity management
- Submit research publications
- Record professional development
- Log courses taught
- Submit events organized

### **4. Student**
- View academic information
- Submit feedback
- Track achievements
- Access timetables

---

## 📊 Data Models

### **Key Collections**

**Users:**
- Admin, Coordinator, Faculty, Student accounts
- Role-based access control
- Department associations

**Departments:**
- 6 Engineering departments
- Coordinator assignments
- Faculty listings

**Faculty Activities:**
- Research Publications
- Professional Development (FDP/STTP)
- Courses Taught
- Events Organized

**Institutional Events:**
- 31 workshops/seminars/conferences (2023-24)
- Department-wise categorization
- Participant tracking

**Student Data:**
- Academic information
- Feedback submissions
- Achievements

---

## 🎨 Screenshots

### **Login Page**
Modern authentication interface with role-based login

### **Admin Dashboard**
Comprehensive overview with statistics and quick actions

### **Report Generation**
Multi-format report generation with filtering options

### **Faculty Activities**
Easy-to-use forms for activity submission

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

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Nagesh B**
- GitHub: [@NageshB11](https://github.com/NageshB11)
- Project: Quiz Website / IQAC Portal

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

**v1.0.0** (December 2025)
- Initial release
- Complete IQAC portal with all features
- 31 institutional events pre-loaded
- Multi-role support
- Report generation (PDF/Excel)
- Activity logging and audit trails

---

## 🚧 Roadmap

- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] Advanced analytics dashboard
- [ ] Document version control
- [ ] Automated backup system
- [ ] Multi-language support
- [ ] API documentation (Swagger)

---

**⭐ If you find this project useful, please consider giving it a star!**

---

**Made with ❤️ for MGM's College of Engineering, Nanded**
