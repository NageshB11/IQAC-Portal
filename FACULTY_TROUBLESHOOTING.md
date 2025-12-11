# Faculty Features - Troubleshooting & Fixes

## Issue: "Add" Button Not Working

### Problem Description
When clicking the "Add Publication" (or other "Add" buttons), the form may not submit properly or show no feedback.

### Root Causes
1. **Missing Error Handling** - No visual feedback when submission fails
2. **Network Issues** - Backend server not running or not accessible
3. **Authentication Issues** - Token expired or invalid
4. **CORS Issues** - Cross-origin request blocked
5. **Missing Required Fields** - Form validation not showing errors

### Solutions

#### 1. Check Backend Server
```bash
# Make sure server is running
cd server
npm start

# Should see:
# ✓ Server running on http://localhost:5000
# ✓ MongoDB connected successfully
```

#### 2. Check Browser Console
Open browser DevTools (F12) and check Console tab for errors:
- Network errors
- CORS errors
- Authentication errors
- Validation errors

#### 3. Verify Authentication
```javascript
// In browser console, check if token exists:
localStorage.getItem('token')
localStorage.getItem('userRole')

// Should return a valid JWT token and 'faculty'
```

#### 4. Test API Directly
Use the test script:
```bash
cd server
# First, get a faculty token by logging in
# Then update test-faculty-api.js with the token
node test-faculty-api.js
```

#### 5. Add Better Error Handling to Components

The components need better user feedback. Here's what to add:

**Add to each component:**
```typescript
const [error, setError] = useState('')
const [success, setSuccess] = useState('')
const [submitting, setSubmitting] = useState(false)
```

**Update handleSubmit:**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setError('')
  setSuccess('')
  setSubmitting(true)
  
  try {
    // ... existing code ...
    
    const responseData = await response.json()
    
    if (response.ok) {
      setSuccess('Added successfully!')
      fetchData() // Refresh list
      resetForm()
      setTimeout(() => setSuccess(''), 3000)
    } else {
      setError(responseData.message || 'Failed to save')
    }
  } catch (error) {
    setError('Network error. Please try again.')
  } finally {
    setSubmitting(false)
  }
}
```

**Add to form UI:**
```tsx
{error && (
  <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
    {error}
  </div>
)}

{success && (
  <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
    {success}
  </div>
)}
```

**Update submit button:**
```tsx
<button
  type="submit"
  disabled={submitting}
  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
>
  {submitting ? 'Saving...' : (editingId ? 'Update' : 'Add')}
</button>
```

## Issue: Data Not Showing in Coordinator/Admin Dashboard

### Problem
Faculty activities are not visible to coordinators or admins.

### Solution

#### 1. Create Coordinator View Components

Create: `app/components/dashboard/coordinator/faculty-activities.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'

export default function FacultyActivities() {
  const [activities, setActivities] = useState({
    research: [],
    professionalDevelopment: [],
    courses: [],
    events: [],
    mentoring: []
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('research')

  useEffect(() => {
    fetchAllActivities()
  }, [])

  const fetchAllActivities = async () => {
    const token = localStorage.getItem('token')
    
    try {
      const [research, pd, courses, events, mentoring] = await Promise.all([
        fetch('http://localhost:5000/api/faculty-activities/research', {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(r => r.json()),
        fetch('http://localhost:5000/api/faculty-activities/professional-development', {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(r => r.json()),
        fetch('http://localhost:5000/api/faculty-activities/courses', {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(r => r.json()),
        fetch('http://localhost:5000/api/faculty-activities/events', {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(r => r.json()),
        fetch('http://localhost:5000/api/faculty-activities/mentoring', {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(r => r.json())
      ])

      setActivities({
        research,
        professionalDevelopment: pd,
        courses,
        events,
        mentoring
      })
    } catch (error) {
      console.error('Error fetching activities:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-8">Loading...</div>

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Faculty Activities</h2>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {[
          { id: 'research', label: 'Research', count: activities.research.length },
          { id: 'pd', label: 'Professional Dev', count: activities.professionalDevelopment.length },
          { id: 'courses', label: 'Courses', count: activities.courses.length },
          { id: 'events', label: 'Events', count: activities.events.length },
          { id: 'mentoring', label: 'Mentoring', count: activities.mentoring.length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium ${
              activeTab === tab.id
                ? 'border-b-2 border-purple-600 text-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {activeTab === 'research' && (
          <div>
            <h3 className="text-lg font-bold mb-4">Research Publications</h3>
            {activities.research.length === 0 ? (
              <p className="text-gray-500">No publications yet</p>
            ) : (
              <div className="space-y-4">
                {activities.research.map((pub: any) => (
                  <div key={pub._id} className="border-b pb-4">
                    <h4 className="font-bold">{pub.title}</h4>
                    <p className="text-sm text-gray-600">{pub.authors}</p>
                    <p className="text-sm text-gray-600">{pub.journalConference}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded">{pub.publicationType}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        pub.status === 'approved' ? 'bg-green-100 text-green-700' :
                        pub.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {pub.status}
                      </span>
                      {pub.faculty && (
                        <span className="text-xs text-gray-500">
                          by {pub.faculty.firstName} {pub.faculty.lastName}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add similar sections for other tabs */}
      </div>
    </div>
  )
}
```

#### 2. Add to Coordinator Sidebar

Update `app/components/dashboard/coordinator-sidebar.tsx`:

```typescript
const menuItems = [
  // ... existing items ...
  { id: 'faculty-activities', icon: '📊', label: 'Faculty Activities' },
]
```

#### 3. Add to Coordinator Dashboard

Update `app/dashboard/coordinator/page.tsx`:

```typescript
import FacultyActivities from '@/app/components/dashboard/coordinator/faculty-activities'

// In the content section:
{activeTab === 'faculty-activities' && <FacultyActivities />}
```

## Quick Fixes Checklist

### For Faculty Users
- [ ] Backend server is running
- [ ] Logged in with faculty credentials
- [ ] Token is valid (check localStorage)
- [ ] All required fields are filled
- [ ] File size is under 10MB
- [ ] Check browser console for errors

### For Coordinators/Admins
- [ ] Backend routes allow coordinator/admin access
- [ ] Components created for viewing faculty data
- [ ] Sidebar updated with new menu items
- [ ] Dashboard page includes new components

### For Developers
- [ ] All models exported correctly
- [ ] Routes registered in server.js
- [ ] Middleware checks roles properly
- [ ] CORS configured correctly
- [ ] File upload directory exists
- [ ] Error handling in place

## Testing Steps

### 1. Test as Faculty
1. Login as faculty
2. Go to "Research Publications"
3. Click "+ Add Publication"
4. Fill all required fields
5. Click "Add Publication"
6. Check for success message
7. Verify publication appears in list

### 2. Test as Coordinator
1. Login as coordinator
2. Go to "Faculty Activities" (if implemented)
3. Should see all faculty activities from your department
4. Can approve/reject submissions

### 3. Test as Admin
1. Login as admin
2. Go to "Faculty Activities" (if implemented)
3. Should see all faculty activities from all departments

## Common Error Messages

### "Failed to fetch"
- **Cause**: Backend server not running
- **Fix**: Start server with `npm start` in server directory

### "Unauthorized" / 401
- **Cause**: Token invalid or expired
- **Fix**: Logout and login again

### "Forbidden" / 403
- **Cause**: User doesn't have permission
- **Fix**: Check user role is 'faculty'

### "Network Error"
- **Cause**: CORS or connection issue
- **Fix**: Check server CORS configuration

### "Validation Error"
- **Cause**: Missing required fields
- **Fix**: Fill all fields marked with *

## Need More Help?

1. Check browser console (F12)
2. Check server logs
3. Test API with Postman or test script
4. Verify database connection
5. Check user role and permissions

---

**Last Updated**: December 1, 2025
**Status**: Troubleshooting Guide
