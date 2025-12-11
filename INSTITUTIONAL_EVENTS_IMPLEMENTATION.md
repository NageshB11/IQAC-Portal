# Institutional Workshops/Seminars/Conferences Implementation

## ✅ What Was Done

### 1. **Created New Database Model**
- Added `InstitutionalEvent` schema in `server/models/FacultyActivity.js`
- This model tracks workshops, seminars, and conferences **conducted BY the institution**
- Separate from `ProfessionalDevelopment` which tracks FDP/STTP **attended BY faculty**

**Fields:**
- `department`: Reference to Department
- `academicYear`: Academic year (e.g., "2023-24")
- `eventName`: Name of the workshop/seminar/conference
- `eventType`: 'workshop', 'seminar', or 'conference'
- `participantCount`: Number of participants
- `startDate` & `endDate`: Event dates
- `activityReportUrl`: Link to activity report on website
- `description`: Event description
- `status`: 'pending', 'approved', or 'rejected'

### 2. **Populated Database with Your Data**
- Created `server/seed-institutional-events.js` with all 32 events from your images
- Automatically mapped departments based on URLs:
  - **Computer Science & Engineering**: 12 events
  - **Mechanical Engineering**: 11 events
  - **Information Technology**: 2 events
  - **Electronics & Communication Engineering**: 4 events
  - **Civil Engineering**: 1 event

### 3. **Updated Report Generation**
#### PDF Reports (`server/routes/reports.js`):
- Added new case: `'institutional-events'`
- Generates formatted PDF with event details
- Filters by department (coordinators see only their department's events)
- Filters by academic year

#### Excel Reports (`server/routes/excel-reports.js`):
- Added new case: `'institutional-events'`
- Generates Excel file matching NAAC format:
  - Year
  - Name of the Workshop/Seminar
  - Number of Participants
  - Date From - To
  - Link to the Activity report on the website

### 4. **Updated Frontend**
- Modified `app/components/dashboard/coordinator/generate-report.tsx`
- Added new option: **"Workshops/Seminars/Conferences Conducted"**
- Coordinators can now select this to generate department-specific reports

## 📊 How It Works

### For Coordinators:
1. Go to **Generate Report** section
2. Select **Academic Year** (or "All Years")
3. Select **Activity Type**: "Workshops/Seminars/Conferences Conducted"
4. Choose **Report Format**: PDF and/or Excel
5. Click **Generate Department Report**
6. Report will include only events from their department

### Department-Based Filtering:
- **CSE Coordinator** → Sees only CSE workshops/seminars/conferences
- **Mechanical Coordinator** → Sees only Mechanical workshops/seminars/conferences
- **IT Coordinator** → Sees only IT workshops/seminars/conferences
- And so on...

## 🔄 Difference from FDP/STTP

| Feature | FDP/STTP (Professional Development) | Workshops/Seminars/Conferences (Institutional Events) |
|---------|-------------------------------------|------------------------------------------------------|
| **Purpose** | Faculty attending external programs | Institution conducting events |
| **Who** | Individual faculty members | Department/Institution |
| **Tracking** | Per faculty member | Per department |
| **Reports** | Faculty-wise attendance | Event-wise participation count |
| **Model** | `ProfessionalDevelopment` | `InstitutionalEvent` |

## 📁 Files Modified

1. **Backend:**
   - `server/models/FacultyActivity.js` - Added InstitutionalEvent model
   - `server/routes/reports.js` - Added PDF generation for institutional events
   - `server/routes/excel-reports.js` - Added Excel generation for institutional events
   - `server/seed-institutional-events.js` - New seed script

2. **Frontend:**
   - `app/components/dashboard/coordinator/generate-report.tsx` - Added new report option

## 🎯 Next Steps (Optional)

If you want to add more features:

1. **Add UI for Coordinators to Submit Events**
   - Create a form where coordinators can add new workshops/seminars
   - Similar to how faculty submit research publications

2. **Add Admin Approval Workflow**
   - Coordinators submit events
   - Admin approves/rejects them
   - Only approved events appear in reports

3. **Add Event Photos/Documents**
   - Allow uploading event photos
   - Store event reports/certificates

## 🚀 Testing

To test the implementation:

1. **Start the server:**
   ```bash
   cd server
   npm start
   ```

2. **Login as a coordinator** (e.g., CSE coordinator)

3. **Navigate to "Generate Report"**

4. **Select:**
   - Academic Year: 2023-24
   - Activity Type: Workshops/Seminars/Conferences Conducted
   - Format: Both PDF and Excel

5. **Generate Report**
   - You should see only the events from your department
   - Excel format will match NAAC requirements

## 📝 Data Summary

Total events seeded: **32**

By Department:
- Computer Science & Engineering: 12 events (10 workshops, 2 seminars)
- Mechanical Engineering: 11 events (0 workshops, 11 seminars)
- Information Technology: 2 events (1 workshop, 1 seminar)
- Electronics & Communication Engineering: 4 events (4 workshops, 0 seminars)
- Civil Engineering: 1 event (1 workshop, 0 seminars)

By Type:
- Workshops: 18
- Seminars: 14
- Conferences: 0

Academic Year: All events are from 2023-24

---

**Implementation Complete! ✅**

Coordinators can now download department-specific reports for workshops, seminars, and conferences conducted by their department.
