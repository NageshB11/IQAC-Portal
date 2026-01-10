# Sports Teacher Login Credentials

## 🏆 Sports Teacher Login (Separate Role)

**Email:** sports@iqac.edu  
**Password:** sports123  
**Role:** Sports (Dedicated Sports Role)

---

## Login Instructions

1. Go to your IQAC Portal login page
2. Select **"Sports"** from the role dropdown
3. Enter email: `sports@iqac.edu`
4. Enter password: `sports123`
5. Click Login

You will be redirected to the **Sports Dashboard** with dedicated sports management features.

---

## What's Different?

The sports teacher now has a **separate role** called "sports" instead of being a coordinator. This means:

- ✅ Dedicated sports dashboard with sports-specific features
- ✅ No department association required
- ✅ Separate login flow from coordinators
- ✅ Custom sports management interface

---

## All Available Roles

| Role | Description | Example Login |
|------|-------------|---------------|
| **Admin** | System administrator | admin / admin123 |
| **Coordinator** | Department coordinator | cse.coord@iqac.edu / cse123 |
| **Faculty** | Teaching staff | faculty@iqac.edu / password |
| **Student** | Students | student@iqac.edu / password |
| **Sports** | Sports teacher/coordinator | sports@iqac.edu / sports123 |

---

## Database Setup

The sports teacher account was created by running:
```bash
node backend/seed-sports-teacher.js
```

This script creates/updates a sports teacher user with the sports role.

---

## Technical Changes Made

### Backend:
1. ✅ Added 'sports' to User model role enum
2. ✅ Updated auth routes to support sports role
3. ✅ Made department optional for sports role
4. ✅ Created seed script for sports teacher

### Frontend:
1. ✅ Added 'sports' to login page role dropdown
2. ✅ Added 'sports' to signup page role dropdown
3. ✅ Created dedicated sports dashboard at `/dashboard/sports`
4. ✅ Made department field optional for sports signup

---

## Sports Dashboard Features

The sports dashboard includes:
- 📊 Sports statistics overview
- 📅 Event management
- 👥 Athlete management
- 🏆 Achievement tracking
- 📈 Performance reports
- 🥇 Hall of fame

---

**Note:** The sports role is completely separate from the coordinator role, providing a dedicated experience for sports management.
