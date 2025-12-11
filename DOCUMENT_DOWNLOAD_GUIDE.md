# Document Download Feature Documentation

## Overview
The IQAC Portal now includes a comprehensive document download system that allows **Admins** and **Department Coordinators** to download certificates and documents uploaded by faculty and students.

## Features

### 1. **Document Types Supported**
The system supports downloading the following types of documents:

#### Faculty Activity Documents:
- **Research Publication Documents**: PDF documents attached to research publications
- **Professional Development Certificates**: Certificates from FDP/STTP/Workshops/Seminars
- **Event Reports**: Reports from events organized by faculty
- **Institutional Event Reports**: Reports from department-level workshops/seminars/conferences

#### General Documents:
- **Student Achievements**: Achievement certificates uploaded by students
- **Faculty Certificates**: Various certificates uploaded by faculty
- **Research Documents**: Research-related documents
- **Other Documents**: Any other documents uploaded to the system

### 2. **Access Control**

#### Admin Access:
- ✅ Can download **ALL** documents from **ALL** departments
- ✅ Can download documents uploaded by any faculty or student
- ✅ Full access to all certificates and reports

#### Coordinator Access:
- ✅ Can download documents from **their department only**
- ✅ Can download certificates of faculty in their department
- ✅ Can download institutional events from their department
- ❌ Cannot download documents from other departments

#### Faculty Access:
- ✅ Can download **their own** documents and certificates
- ❌ Cannot download other faculty members' documents

## How to Download Documents

### For Admins

#### Option 1: Documents Management Tab
1. **Login as Admin**
2. Click on **"📄 Documents"** in the sidebar
3. You'll see a comprehensive list of all uploaded documents
4. **Filter documents** by:
   - All Documents
   - Pending
   - Approved
   - Rejected
5. **Click "Download"** button next to any document

#### Option 2: Faculty Activities Tab
1. Go to **"Faculty Activities"** tab
2. View faculty submissions (Research, Professional Development, etc.)
3. Click **"Download"** button for certificates or documents

### For Coordinators

#### Documents from Your Department
1. **Login as Coordinator**
2. Click on **"📄 Documents"** in the sidebar
3. You'll see documents from **your department only**
4. Click **"Download"** button to download any document

#### Faculty Certificates
1. Go to **"Faculty Activities"** tab
2. View activities from faculty in your department
3. Download certificates and documents

## API Endpoints

### Download Research Publication Document
```
GET /api/downloads/research/:id/download
```
- **Access**: Faculty (own), Coordinator (department), Admin (all)
- **Returns**: PDF/DOC file

### Download Professional Development Certificate
```
GET /api/downloads/professional-development/:id/download
```
- **Access**: Faculty (own), Coordinator (department), Admin (all)
- **Returns**: Certificate file

### Download Event Report
```
GET /api/downloads/events/:id/download-report
```
- **Access**: Faculty (own), Coordinator (department), Admin (all)
- **Returns**: Report file

### Download Institutional Event Report
```
GET /api/downloads/institutional-events/:id/download
```
- **Access**: Coordinator (department), Admin (all)
- **Returns**: Activity report file

### Download General Document
```
GET /api/documents/:id/download
```
- **Access**: Owner, Coordinator (department), Admin (all)
- **Returns**: Uploaded document file

## Documents Management Interface

### Statistics Dashboard
The Documents tab shows:
- **Total Documents**: Total number of uploaded documents
- **Pending**: Documents awaiting approval
- **Approved**: Approved documents
- **Rejected**: Rejected documents

### Document Information Displayed
For each document, you can see:
- **Title**: Document title
- **Type**: Document type (achievement, research, certificate, etc.)
- **Uploaded By**: Name and role of the person who uploaded
- **Department**: Which department the document belongs to
- **Date**: When the document was uploaded
- **Status**: Approval status
- **Download Button**: Click to download the file

### Filtering Options
- Click on statistics cards to filter by status
- Use filter buttons to show:
  - All Documents
  - Pending only
  - Approved only
  - Rejected only

## File Naming Convention

When you download a file, it will be automatically named:
- **Research Documents**: `[Publication Title]_document.pdf`
- **Certificates**: `[Activity Title]_certificate.pdf`
- **Event Reports**: `[Event Name]_report.pdf`
- **General Documents**: `[Document Title]_document.pdf`

Filenames are truncated to 50 characters for compatibility.

## Technical Implementation

### Backend
- **Static File Serving**: Server configured to serve files from `uploads/` directory
- **Download Routes**: `server/routes/downloads.js` - Dedicated download endpoints
- **Permission Checks**: Each download request validates user permissions
- **File Existence Check**: Verifies file exists before attempting download

### Frontend
- **Download Helpers**: `app/utils/downloadHelpers.ts` - Utility functions for downloads
- **Download Button Component**: `app/components/ui/download-button.tsx` - Reusable button
- **Documents Management**: `app/components/dashboard/admin/documents-management.tsx` - Main interface

### Security Features
1. **Authentication Required**: All downloads require valid JWT token
2. **Role-Based Access**: Downloads restricted based on user role
3. **Department Verification**: Coordinators can only access their department
4. **Ownership Check**: Faculty can only download their own documents
5. **File Path Validation**: Prevents directory traversal attacks

## Usage Examples

### Example 1: Admin Downloads All Certificates
```
Scenario: Admin wants to download all FDP certificates

Steps:
1. Login as Admin
2. Go to "Faculty Activities" tab
3. Select "Professional Development" category
4. Click "Download" on any certificate
5. File downloads automatically
```

### Example 2: Coordinator Downloads Department Documents
```
Scenario: CSE Coordinator wants to download CSE faculty certificates

Steps:
1. Login as CSE Coordinator
2. Go to "Documents" tab
3. See only CSE department documents
4. Click "Download" on desired documents
5. Files download automatically
```

### Example 3: Admin Downloads Student Achievements
```
Scenario: Admin wants to download student achievement certificates

Steps:
1. Login as Admin
2. Go to "Documents" tab
3. Filter by "Approved" status
4. Look for documents uploaded by students
5. Click "Download" on achievement certificates
```

## Error Handling

### Common Errors and Solutions

#### "File not found on server"
- **Cause**: File was deleted or moved from uploads directory
- **Solution**: Ask the user to re-upload the document

#### "Unauthorized to download this document"
- **Cause**: User doesn't have permission to access this document
- **Solution**: Verify user role and department

#### "Not authenticated"
- **Cause**: User session expired
- **Solution**: Logout and login again

#### "Download failed"
- **Cause**: Network error or server issue
- **Solution**: Try again or check server logs

## Download Button States

The download button shows different states:
- **Normal**: Shows "Download" with download icon
- **Downloading**: Shows "Downloading..." with spinner
- **Error**: Shows error message below button (auto-hides after 3 seconds)

## Files Modified/Created

### Backend
- ✅ `server/server.js` - Added static file serving
- ✅ `server/routes/downloads.js` - NEW: Download endpoints
- ✅ `server/routes/documents.js` - Already had download endpoint

### Frontend
- ✅ `app/utils/downloadHelpers.ts` - NEW: Download utility functions
- ✅ `app/components/ui/download-button.tsx` - NEW: Reusable download button
- ✅ `app/components/dashboard/admin/documents-management.tsx` - NEW: Documents interface
- ✅ `app/dashboard/admin/page.tsx` - Added documents tab
- ✅ `app/components/dashboard/admin-sidebar.tsx` - Added documents menu

## Benefits

1. ✅ **Easy Access**: Admins and coordinators can easily download all documents
2. ✅ **Centralized View**: All documents in one place
3. ✅ **Filtered Access**: Coordinators see only their department's documents
4. ✅ **Secure**: Proper authentication and authorization
5. ✅ **User-Friendly**: Simple click-to-download interface
6. ✅ **Status Tracking**: See approval status of documents
7. ✅ **Organized**: Filter by status and type

## Future Enhancements

Potential improvements:
1. Bulk download (download multiple documents at once)
2. Download as ZIP file
3. Preview documents before downloading
4. Download history/logs
5. Email documents directly
6. Share documents with other users
7. Document versioning

## Support

For issues with downloading documents:
1. Check user permissions (role and department)
2. Verify file exists in uploads directory
3. Check server logs for errors
4. Ensure proper authentication
5. Test with different browsers

## Quick Reference

| User Role | Can Download |
|-----------|-------------|
| **Admin** | All documents from all departments |
| **Coordinator** | Documents from their department only |
| **Faculty** | Their own documents only |
| **Student** | Their own documents only |

| Document Type | Location | Who Can Download |
|---------------|----------|------------------|
| Research Publications | Faculty Activities → Research | Faculty (own), Coordinator (dept), Admin |
| FDP/STTP Certificates | Faculty Activities → Professional Development | Faculty (own), Coordinator (dept), Admin |
| Event Reports | Faculty Activities → Events | Faculty (own), Coordinator (dept), Admin |
| Institutional Events | Faculty Activities → Institutional Events | Coordinator (dept), Admin |
| Student Documents | Documents Tab | Student (own), Coordinator (dept), Admin |
| Faculty Documents | Documents Tab | Faculty (own), Coordinator (dept), Admin |
