# Faculty Role Features - Complete Guide

## Overview
The Faculty role in the IQAC Portal has been enhanced with comprehensive activity tracking and management features. Faculty members can now update and maintain records for all their academic and professional activities.

## Features Implemented

### 1. Research Publications 📚
Faculty can add, edit, and track their research publications including:
- **Publication Details:**
  - Title and authors
  - Journal/Conference name
  - Publication type (Journal, Conference, Book, Chapter, Patent)
  - Publication date
  - DOI, ISSN/ISBN
  - Impact factor
  - Indexing (Scopus, SCI, Web of Science, UGC-CARE, etc.)
  - Citation count
  - Document upload (PDF)

- **Features:**
  - Full CRUD operations (Create, Read, Update, Delete)
  - Status tracking (Pending, Approved, Rejected)
  - Sortable table view
  - Edit and delete functionality

### 2. FDP/STTP/Workshops Attended 🎓
Track professional development activities:
- **Activity Details:**
  - Title and type (FDP, STTP, Workshop, Seminar, Conference, Training)
  - Organizer name
  - Duration in days
  - Start and end dates
  - Mode (Online, Offline, Hybrid)
  - Description
  - Certificate upload (PDF)

- **Features:**
  - Card-based display layout
  - Status tracking
  - Certificate management
  - Duration calculation

### 3. Courses Taught 📖
Manage teaching assignments and syllabus completion:
- **Course Details:**
  - Academic year and semester
  - Course code and name
  - Course type (Theory, Practical, Project, Elective)
  - Credits
  - Total students enrolled
  - Hours per week
  - Syllabus completion percentage (0-100%)
  - Status (Ongoing, Completed)

- **Features:**
  - Visual progress bars for syllabus completion
  - Table view with all course details
  - Track multiple courses per semester
  - Academic year filtering

### 4. Events Organized in Department 🎪
Document departmental events and activities:
- **Event Details:**
  - Event name and type (Workshop, Seminar, Webinar, Competition, Cultural, Technical, Other)
  - Event date and duration (hours)
  - Participant count
  - Your role (Organizer, Coordinator, Volunteer)
  - Description
  - Photo uploads (up to 5 images)

- **Features:**
  - Card-based layout with event details
  - Photo gallery support
  - Department-specific tracking
  - Role-based contribution tracking

### 5. Student Mentoring Reports 👨‍🏫
Maintain detailed mentoring records:
- **Mentoring Details:**
  - Academic year and semester
  - Student name and enrollment number
  - Mentorship type (Academic, Project, Career, Personal)
  - Meeting date
  - Discussion topics
  - Action items
  - Follow-up required (Yes/No)
  - Follow-up date (if applicable)

- **Features:**
  - Comprehensive mentoring history
  - Follow-up tracking
  - Student-wise records
  - Type-based categorization

### 6. Document Upload ⬆️
Upload general documents (existing feature):
- Research papers
- Attendance reports
- Curriculum plans
- Annual reports
- Achievements
- Other documents

### 7. My Documents 📄
View and manage all uploaded documents with filtering and status tracking.

### 8. Department Members 👥
View faculty and staff in your department.

### 9. Announcements 📢
View department and institution-wide announcements.

## Dashboard Overview

The Faculty Dashboard provides a comprehensive overview with:

### Activity Statistics Cards
- **Research Publications:** Total count of publications added
- **FDP/STTP/Workshops:** Total professional development activities
- **Courses Taught:** Total courses being taught
- **Events Organized:** Total events organized
- **Students Mentored:** Total mentoring sessions recorded

### Document Statistics
- Total documents uploaded
- Approved documents
- Pending documents
- Rejected documents
- Approval rate percentage

### Quick Actions
- Upload new documents
- View guidelines
- Performance metrics

## API Endpoints

All faculty activity endpoints are available at: `http://localhost:5000/api/faculty-activities/`

### Research Publications
- `POST /research` - Add new publication
- `GET /research` - Get all publications
- `PUT /research/:id` - Update publication
- `DELETE /research/:id` - Delete publication

### Professional Development
- `POST /professional-development` - Add new activity
- `GET /professional-development` - Get all activities
- `PUT /professional-development/:id` - Update activity
- `DELETE /professional-development/:id` - Delete activity

### Courses Taught
- `POST /courses` - Add new course
- `GET /courses` - Get all courses
- `PUT /courses/:id` - Update course
- `DELETE /courses/:id` - Delete course

### Events Organized
- `POST /events` - Add new event
- `GET /events` - Get all events
- `PUT /events/:id` - Update event
- `DELETE /events/:id` - Delete event

### Student Mentoring
- `POST /mentoring` - Add new mentoring record
- `GET /mentoring` - Get all mentoring records
- `PUT /mentoring/:id` - Update mentoring record
- `DELETE /mentoring/:id` - Delete mentoring record

### Statistics
- `GET /statistics` - Get all activity statistics

## Database Models

### ResearchPublication
- faculty (ref: User)
- title, authors, journalConference
- publicationType, publicationDate
- doi, issn, isbn, impactFactor
- indexing[], citationCount
- documentUrl, status

### ProfessionalDevelopment
- faculty (ref: User)
- title, type, organizer
- duration, startDate, endDate
- mode, certificateUrl
- description, status

### CourseTaught
- faculty (ref: User)
- academicYear, semester
- courseCode, courseName, courseType
- credits, totalStudents, hoursPerWeek
- syllabusCompletion, status

### EventOrganized
- faculty (ref: User)
- department (ref: Department)
- eventName, eventType, eventDate
- duration, participantCount, role
- description, reportUrl, photosUrl[]
- status

### StudentMentoring
- faculty (ref: User)
- academicYear, semester
- studentName, enrollmentNumber
- mentorshipType, meetingDate
- discussionTopics, actionItems
- followUpRequired, followUpDate
- status

## File Upload Support

### Supported File Types
- **Documents:** PDF, DOC, DOCX
- **Images:** JPG, JPEG, PNG
- **Maximum Size:** 10MB per file

### Upload Locations
- Documents: `/uploads/faculty-activities/`
- Photos: `/uploads/faculty-activities/`

## Access Control

### Faculty Role
- Can view, add, edit, and delete their own records
- Cannot modify approved/rejected items (only pending)
- Can view department members

### Coordinator Role
- Can view all faculty activities in their department
- Can approve/reject submissions
- Can generate reports

### Admin Role
- Can view all faculty activities across all departments
- Full access to all records
- Can generate institution-wide reports

## Navigation

Faculty can access all features through the sidebar menu:
1. 📊 Dashboard - Overview with statistics
2. 📚 Research Publications - Manage publications
3. 🎓 FDP/STTP/Workshops - Professional development
4. 📖 Courses Taught - Teaching assignments
5. 🎪 Events Organized - Departmental events
6. 👨‍🏫 Student Mentoring - Mentoring records
7. ⬆️ Upload Documents - General document upload
8. 📄 My Documents - View all documents
9. 👥 Department Members - View colleagues
10. 📢 Announcements - View announcements

## Usage Instructions

### Adding a Research Publication
1. Click on "Research Publications" in the sidebar
2. Click "+ Add Publication" button
3. Fill in all required fields (marked with *)
4. Optionally upload the publication PDF
5. Click "Add Publication"
6. The publication will be added with "Pending" status

### Updating Syllabus Completion
1. Go to "Courses Taught"
2. Click "Edit" on the course you want to update
3. Update the "Syllabus Completion (%)" field
4. Click "Update Course"
5. The progress bar will reflect the new percentage

### Recording a Mentoring Session
1. Navigate to "Student Mentoring"
2. Click "+ Add Mentoring Record"
3. Enter student details and meeting information
4. Add discussion topics and action items
5. Check "Follow-up Required" if needed
6. Set follow-up date if applicable
7. Click "Add Record"

## Benefits

### For Faculty
- Centralized record keeping
- Easy tracking of all activities
- Professional portfolio building
- Performance metrics visibility
- Simplified reporting

### For Coordinators
- Department-wide activity monitoring
- Easy approval workflow
- Performance analytics
- Report generation

### For Administration
- Institution-wide visibility
- Data-driven decision making
- Accreditation support
- Quality assurance

## Future Enhancements

Potential features for future versions:
- Export to PDF/Excel
- Advanced filtering and search
- Graphical analytics and charts
- Bulk upload functionality
- Integration with external databases (Scopus, Google Scholar)
- Automated citation tracking
- Collaborative research tracking
- Student feedback integration

## Support

For issues or questions:
1. Check the guidelines in each section
2. Contact your department coordinator
3. Reach out to the IQAC Portal administrator

---

**Last Updated:** December 1, 2025
**Version:** 2.0
**Developed for:** IQAC Portal - Faculty Management System
