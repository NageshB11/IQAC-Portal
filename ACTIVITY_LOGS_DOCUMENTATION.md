# Activity Logs & Audit Trail System

## Overview
The IQAC Portal now includes a comprehensive audit trail system that tracks all user activities including data creation, modification, and deletion. This allows administrators to monitor who made changes, when they were made, and what was changed.

## Features

### 1. **Audit Trail Fields in Database**
All faculty activity schemas now include:
- `createdBy`: Reference to the user who created the record
- `updatedBy`: Reference to the user who last updated the record
- `createdAt`: Timestamp when the record was created
- `updatedAt`: Timestamp when the record was last updated

### 2. **Activity Logs Collection**
A dedicated `ActivityLog` collection stores detailed information about every action:
- **User Information**: Who performed the action (user ID, name, role)
- **Action Type**: CREATE, UPDATE, or DELETE
- **Entity Type**: What type of data was affected (e.g., ResearchPublication, User, etc.)
- **Entity ID**: The specific record that was affected
- **Details**: Additional context about the change
- **Timestamp**: When the action occurred

### 3. **Admin Dashboard - Activity Logs Tab**
Administrators can now access a dedicated "Activity Logs" section with:

#### **Statistics Dashboard**
- Total number of activities
- Breakdown by action type (Creates, Updates, Deletes)
- Visual representation of activity patterns

#### **Advanced Filtering**
Filter logs by:
- **Action Type**: CREATE, UPDATE, or DELETE
- **Entity Type**: Specific data types (Users, Publications, Events, etc.)
- **User Role**: Admin, Coordinator, or Faculty
- **Date Range**: Start and end dates for targeted searches

#### **Detailed Activity Table**
View comprehensive information for each activity:
- Timestamp (date and time)
- Action performed
- User who performed the action
- User's role
- Type of entity affected
- Brief details about the change

#### **Pagination**
- Navigate through large sets of activity logs
- 50 records per page
- Easy navigation with Previous/Next buttons

## How It Works

### For Coordinators
When a coordinator adds institutional events (workshops, seminars, conferences):
- The system automatically records:
  - Who added the event (`createdBy`)
  - When it was added (`createdAt`)
- This information is visible to administrators in the Activity Logs

### For Admins
When an admin modifies or deletes data:
- The system automatically records:
  - Who made the change (`updatedBy`)
  - What was changed (stored in activity log details)
  - When the change occurred (`updatedAt`)
- All actions are logged and can be reviewed in the Activity Logs tab

### For Faculty
When faculty members add or update their activities:
- The system tracks:
  - Who created the record
  - Who last updated it
  - All changes are logged for audit purposes

## API Endpoints

### Get Activity Logs
```
GET /api/activity-logs
```
Query Parameters:
- `action`: Filter by action type (CREATE, UPDATE, DELETE)
- `entityType`: Filter by entity type
- `userRole`: Filter by user role
- `startDate`: Filter by start date
- `endDate`: Filter by end date
- `page`: Page number for pagination
- `limit`: Number of records per page

### Get Activity Statistics
```
GET /api/activity-logs/stats
```
Returns aggregated statistics about activities.

### Get Recent Activities
```
GET /api/activity-logs/recent
```
Returns the last 20 activities from the past 24 hours.

### Get Entity-Specific Logs
```
GET /api/activity-logs/entity/:entityType/:entityId
```
Returns all activities related to a specific entity.

## Database Schema Updates

### Faculty Activity Models
All schemas now include:
```javascript
createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
},
updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
},
createdAt: {
    type: Date,
    default: Date.now
},
updatedAt: {
    type: Date,
    default: Date.now
}
```

### Activity Log Model
```javascript
{
    user: ObjectId (ref: 'User'),
    userName: String,
    userRole: String,
    action: String (CREATE, UPDATE, DELETE),
    entityType: String,
    entityId: ObjectId,
    details: Mixed,
    timestamp: Date
}
```

## Usage Examples

### Viewing Who Added an Event
1. Navigate to Admin Dashboard
2. Click on "Activity Logs" in the sidebar
3. Filter by:
   - Entity Type: "InstitutionalEvent"
   - Action: "CREATE"
   - User Role: "coordinator"
4. View the timestamp and coordinator details

### Viewing Who Modified Data
1. Go to Activity Logs
2. Filter by:
   - Action: "UPDATE"
   - Select date range
3. See all modifications made during that period

### Viewing Who Deleted Data
1. Go to Activity Logs
2. Filter by:
   - Action: "DELETE"
3. View all deletion activities with user details

## Benefits

1. **Accountability**: Track who made changes to the system
2. **Transparency**: Full visibility into all system activities
3. **Compliance**: Meet audit and compliance requirements
4. **Troubleshooting**: Identify when and how data was changed
5. **Security**: Monitor for unauthorized or suspicious activities

## Access Control

- **Admin Only**: Only administrators can view activity logs
- **Automatic Logging**: All actions are logged automatically
- **Cannot be Modified**: Activity logs are read-only for integrity

## Technical Implementation

### Backend
- `server/models/ActivityLog.js`: Activity log schema
- `server/routes/activity-logs.js`: API routes for activity logs
- `server/utils/activityLogger.js`: Utility function for logging activities
- Updated all faculty activity routes to track createdBy and updatedBy

### Frontend
- `app/components/dashboard/admin/activity-logs.tsx`: Activity logs management component
- Updated admin dashboard to include Activity Logs tab
- Updated admin sidebar to include Activity Logs menu item

## Future Enhancements

Potential improvements for the audit trail system:
1. Export activity logs to CSV/Excel
2. Email notifications for critical actions
3. More detailed change tracking (before/after values)
4. Activity log retention policies
5. Advanced analytics and reporting
6. Real-time activity monitoring dashboard
