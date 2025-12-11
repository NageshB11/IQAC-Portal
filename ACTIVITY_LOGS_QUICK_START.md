# Quick Start Guide: Activity Logs for Admin

## Accessing Activity Logs

### Step 1: Login as Admin
- Go to the IQAC Portal
- Login with admin credentials

### Step 2: Navigate to Activity Logs
- Look at the left sidebar
- Click on **"📋 Activity Logs"** menu item

## What You'll See

### Statistics Dashboard (Top Section)
```
┌─────────────────────────────────────────────────────────────┐
│  Total Activities    Creates         Updates        Deletes │
│       150              45              85             20     │
└─────────────────────────────────────────────────────────────┘
```

### Filters Section
```
┌─────────────────────────────────────────────────────────────┐
│  Filters                                                     │
│  ┌──────────┐  ┌──────────────┐  ┌──────────┐  ┌─────────┐ │
│  │ Action   │  │ Entity Type  │  │ User Role│  │ Dates   │ │
│  └──────────┘  └──────────────┘  └──────────┘  └─────────┘ │
│  [Reset Filters]                                            │
└─────────────────────────────────────────────────────────────┘
```

### Activity History Table
```
┌────────────────────────────────────────────────────────────────────────────┐
│ Timestamp          Action   User              Role        Entity Type      │
├────────────────────────────────────────────────────────────────────────────┤
│ Dec 10, 1:30 PM   CREATE   Dr. Kumar         coordinator InstitutionalEvent│
│ Dec 10, 1:15 PM   UPDATE   Admin User        admin       User              │
│ Dec 10, 12:45 PM  DELETE   Admin User        admin       ResearchPublication│
│ Dec 10, 11:30 AM  CREATE   Prof. Sharma      faculty     ResearchPublication│
└────────────────────────────────────────────────────────────────────────────┘
```

## Common Use Cases

### 1. Find When a Coordinator Added an Event

**Question:** "When did the CSE coordinator add the AI workshop?"

**Steps:**
1. Go to Activity Logs
2. Set filters:
   - Action: **CREATE**
   - Entity Type: **InstitutionalEvent**
   - User Role: **coordinator**
3. Look through the results for the specific event

**Result:** You'll see:
```
Timestamp: Dec 10, 2024, 1:30 PM
Action: CREATE
User: Dr. Kumar (CSE Coordinator)
Entity: InstitutionalEvent
Details: "Workshop on AI"
```

### 2. Track Who Modified User Data

**Question:** "Who changed Prof. Sharma's details?"

**Steps:**
1. Go to Activity Logs
2. Set filters:
   - Action: **UPDATE**
   - Entity Type: **User**
3. Search for "Sharma" in the results

**Result:** You'll see:
```
Timestamp: Dec 10, 2024, 1:15 PM
Action: UPDATE
User: Admin User
Entity: User
Details: Prof. Sharma
```

### 3. Monitor Deletions

**Question:** "What data was deleted this week?"

**Steps:**
1. Go to Activity Logs
2. Set filters:
   - Action: **DELETE**
   - Start Date: [7 days ago]
   - End Date: [today]

**Result:** You'll see all deletions with:
- Who deleted it
- When it was deleted
- What was deleted

## Understanding the Color Codes

### Actions
- 🟢 **Green Badge** = CREATE (something was added)
- 🔵 **Blue Badge** = UPDATE (something was modified)
- 🔴 **Red Badge** = DELETE (something was removed)

### User Roles
- 🟣 **Purple Badge** = Admin
- 🟠 **Orange Badge** = Coordinator
- 🔵 **Cyan Badge** = Faculty

## Filtering Tips

### By Date Range
- Use **Start Date** and **End Date** to find activities in a specific period
- Example: Find all activities from last month

### By User Role
- **Admin**: See what admins have done
- **Coordinator**: See what coordinators have added/modified
- **Faculty**: See what faculty members have submitted

### By Entity Type
- **User**: Track user account changes
- **ResearchPublication**: Track research paper submissions
- **InstitutionalEvent**: Track workshop/seminar additions
- **ProfessionalDevelopment**: Track FDP/STTP entries

### By Action
- **CREATE**: See what was added
- **UPDATE**: See what was modified
- **DELETE**: See what was removed

## Example Scenarios

### Scenario 1: Audit Coordinator Activities
**Goal:** Review all activities by coordinators this month

**Filter Settings:**
- User Role: **coordinator**
- Start Date: **Dec 1, 2024**
- End Date: **Dec 31, 2024**

**What You'll See:**
- All events added by coordinators
- All modifications made by coordinators
- Timestamps for each activity

### Scenario 2: Track Research Publications
**Goal:** See all research publications added this year

**Filter Settings:**
- Entity Type: **ResearchPublication**
- Action: **CREATE**
- Start Date: **Jan 1, 2024**
- End Date: **Dec 31, 2024**

**What You'll See:**
- Who submitted each publication
- When it was submitted
- Publication titles

### Scenario 3: Monitor System Changes
**Goal:** See all modifications in the last 24 hours

**Filter Settings:**
- Action: **UPDATE**
- Start Date: **[yesterday]**
- End Date: **[today]**

**What You'll See:**
- All recent changes
- Who made each change
- What was changed

## Pagination

When there are many records:
- **Bottom of table** shows: "Page 1 of 5"
- Click **"Next"** to see more records
- Click **"Previous"** to go back
- Each page shows 50 records

## Exporting Data (Future Feature)

Coming soon:
- Export to Excel
- Export to PDF
- Email reports

## Troubleshooting

### No Data Showing?
- Check your filters - try clicking "Reset Filters"
- Make sure the date range is correct
- Verify you're logged in as admin

### Can't See Recent Activities?
- Click "Reset Filters" to clear all filters
- The most recent activities appear at the top

### Need More Details?
- Each row shows basic information
- Click on a row (future feature) to see full details

## Security Note

⚠️ **Important:**
- Only **Admins** can view activity logs
- Activity logs **cannot be modified or deleted**
- All actions are **automatically logged**
- Logs are **permanent** for audit purposes

## Quick Reference

| What You Want | Filter Settings |
|---------------|----------------|
| Coordinator additions | Action: CREATE, Role: coordinator |
| Admin changes | Role: admin, Action: UPDATE |
| Deleted items | Action: DELETE |
| This week's activities | Start Date: [7 days ago] |
| Research papers | Entity Type: ResearchPublication |
| User account changes | Entity Type: User |

## Need Help?

Refer to:
- **ACTIVITY_LOGS_DOCUMENTATION.md** - Full documentation
- **AUDIT_TRAIL_SUMMARY.md** - Technical summary
- Contact system administrator for support
