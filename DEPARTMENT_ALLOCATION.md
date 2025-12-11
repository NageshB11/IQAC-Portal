# 📋 Workshop/Seminar Department Allocation

## How It Works

### For Department Coordinators:
Each coordinator sees **ONLY** the workshops/seminars/conferences conducted by **THEIR department**.

### For Admin:
Admin sees **ALL** workshops/seminars/conferences from **ALL departments**.

---

## Department-wise Allocation

Based on the data from the images you provided:

### 1. **Computer Science & Engineering (CSE)**
**Coordinator sees: 12 events**

- Two Days Hands-on Workshop on Front-end Development (70 participants)
- Two-Days Hands-on Workshop on Machine Learning using Python (64 participants)
- One-Day Hands-on Workshop on Git and GitHub (70 participants)
- A Live Online Session on "Getting Jobs and Internship in the Domain of AI Development" (232 participants)
- Two-days Hands-on Workshop on Data nAnalytics with Python (68 participants)
- An Online Workshop on "Intellectual Property Rights" (80 participants)
- Network Programming using Python by Mr. Malhar Lathkar (130 participants)
- Two days workshop on Internet of Things conducted by Innovians Technologies in association with IIT, Varanasi (57 participants)
- Webinar on Hanshake with NLP (115 participants)
- Insights on CLoud Security: Intel Corporation Workshop (90 participants)
- Two days workshop on Advanced Internet of Things conducted by Innovians Technologies in association with IIT, Varanasi (51 participants)
- Hands-On Generative AI Workshop (312 participants)

### 2. **Mechanical Engineering (MECH)**
**Coordinator sees: 11 events**

- Seminar on "Composite Materials" by Dr. Sachin Waigaonkar, Professor in Department of Mechanical Engineering at BITS Pilani K. K. Birla (55 participants)
- Seminar on "IIOT Application" by Dr. Santosh Choudhary, HOD Mechanical engineering Department, Govt. polytechnic, Nanded (75 participants)
- Introduction for Automotive Steel in Industry by Mr. Atul Bhalerao, Divisional Mager, JCAPCPL Jamshedpur (70 participants)
- Workshop on "Internet of Things" (74 participants)
- Two day workshop on Machine Learning Concepts using Python programming (74 participants)
- Workshop on "How to start a Start-up" (178 participants)
- Seminar on "PLM-Product Life Cycle Management" by Mr.Siraj Khan (45 participants)
- Seminar on "Robotics and Digitalization in manufacturing" by Mr.Ashish Kamble from L&T Edu (53 participants)
- Seminar on "Green Energy System" by Mr.Ashish Kamble from L&T Edu (48 participants)
- "Metal forming and analysis" by Dr. Sachin Waigaonkar, Professor in Department of Mechanical Engineering at BITS Pilani K. K. Birla (65 participants)
- Seminar on "Career Opportunities for Mechanical, Computer and Electronic Engineer in Software, Electronics oil refinery's companies" by Mr. Santosh Kulkarni, Sr. Engineer & Data Scientist, ABB Bangalore (85 participants)
- Seminar on on "MPSC Preparation" Dy. Director, Directorate of Account and Treasuries, Finance Depatment, Government of Maharashtra (65 participants)
- Seminar on "Advance Manufacturing" by Mr.Rohit Vadgaonkar, The managing Director, Urvi Steels, Nanded (80 participants)
- Seminar on on GATE Exam Preparation by Mr. Modh. Shahab from ACE Engineering Academy Hyderabad (35 participants)

### 3. **Information Technology (IT)**
**Coordinator sees: 4 events**

- Seminar on Women Empowerment (240 participants) - appears twice
- Workshop on Employability skills (60 participants) - appears twice

### 4. **Civil Engineering (CIVIL)**
**Coordinator sees: 1 event**

- Concrete Mix Design Workshop (107 participants)

### 5. **Electronics & Communication (ECE)**
**Coordinator sees: 4 events**

- One week Workshop on Applications of Arduino Board (66 participants)
- Online webinar on "importance of Millets" by Food and Agriculture Organisation, Government of India (95 participants)

---

## Access Control Summary

| User Role | What They See |
|-----------|---------------|
| **CSE Coordinator** | Only CSE department's 12 workshops |
| **MECH Coordinator** | Only Mechanical department's 11 workshops |
| **IT Coordinator** | Only IT department's 4 workshops |
| **CIVIL Coordinator** | Only Civil department's 1 workshop |
| **ECE Coordinator** | Only ECE department's 4 workshops |
| **Admin** | ALL 31 workshops from all departments |

---

## How to View

### As Department Coordinator:
1. Login with your coordinator credentials
2. Go to **Faculty Activities**
3. Click on **"Workshops/Seminars/Conferences"** card
4. You will see ONLY your department's events

### As Admin:
1. Login as admin
2. Go to **Faculty Activities**
3. Click on **"Workshops/Seminars/Conferences"** card
4. You will see ALL events from ALL departments

---

## Backend Implementation

The filtering is done automatically in the backend:

```javascript
// In server/routes/faculty-activities.js
router.get('/institutional-events', verifyToken, checkRole(['faculty', 'coordinator', 'admin']), async (req, res) => {
    const user = await User.findById(req.userId);
    
    let query = {};
    if (user.role === 'coordinator') {
        query.department = user.department;  // ← Only their department
    }
    // Admin gets all (empty query)
    
    const events = await InstitutionalEvent.find(query)
        .populate('department', 'name code')
        .sort({ startDate: -1 });
    res.json(events);
});
```

✅ **The system is already configured correctly!** Each coordinator will automatically see only their department's workshops.
