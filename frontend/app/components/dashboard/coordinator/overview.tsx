'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CreateAnnouncement from './create-announcement'

export default function CoordinatorOverview() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [stats, setStats] = useState({
    totalFaculty: 0,
    totalStudents: 0,
    totalDocuments: 0,
    pendingReviews: 0,
    approvedDocuments: 0,
    rejectedDocuments: 0,
    totalFeedback: 0,
    researchPublications: 0,
    courses: 0,
    events: 0,
    workshops: 0
  })
  const [recentDocs, setRecentDocs] = useState<any[]>([])
  const [recentFeedback, setRecentFeedback] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    fetchData()
  }, [refreshKey])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')

      // Fetch department members (faculty and students)
      const membersRes = await fetch('http://localhost:5000/api/users/department-members', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      // Fetch students
      const studentsRes = await fetch('http://localhost:5000/api/users/department-students', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      // Fetch department documents
      const docsRes = await fetch('http://localhost:5000/api/documents/department', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      // Fetch feedback
      const feedbackRes = await fetch('http://localhost:5000/api/feedback/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      // Fetch faculty activities statistics
      const activitiesRes = await fetch('http://localhost:5000/api/faculty-activities/statistics', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (membersRes.ok && docsRes.ok) {
        const members = await membersRes.json()
        const students = studentsRes.ok ? await studentsRes.json() : []
        const docs = await docsRes.json()
        const feedback = feedbackRes.ok ? await feedbackRes.json() : []
        const activities = activitiesRes.ok ? await activitiesRes.json() : {}

        // Count faculty
        const facultyCount = members.filter((u: any) => u.role === 'faculty').length

        // Document statistics
        const pendingDocs = docs.filter((d: any) => d.status === 'pending')
        const approvedDocs = docs.filter((d: any) => d.status === 'approved')
        const rejectedDocs = docs.filter((d: any) => d.status === 'rejected')

        setStats({
          totalFaculty: facultyCount,
          totalStudents: students.length,
          totalDocuments: docs.length,
          pendingReviews: pendingDocs.length,
          approvedDocuments: approvedDocs.length,
          rejectedDocuments: rejectedDocs.length,
          totalFeedback: feedback.length,
          researchPublications: activities.research || 0,
          courses: activities.courses || 0,
          events: activities.events || 0,
          workshops: activities.institutionalEvents || 0
        })

        // Show recent pending documents
        setRecentDocs(pendingDocs.slice(0, 5))

        // Show recent feedback
        setRecentFeedback(feedback.slice(-5).reverse())
      }
    } catch (err) {
      console.error('Error fetching overview data:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-lg">Loading dashboard...</div></div>

  const mainStats = [
    { label: 'Faculty Members', value: stats.totalFaculty, icon: '👨‍🏫', color: 'bg-blue-500', onClick: () => router.push('/dashboard/coordinator?tab=faculty') },
    { label: 'Students', value: stats.totalStudents, icon: '🎓', color: 'bg-green-500', onClick: () => router.push('/dashboard/coordinator?tab=students') },
    { label: 'Pending Reviews', value: stats.pendingReviews, icon: '⏳', color: 'bg-orange-500', onClick: () => router.push('/dashboard/coordinator?tab=documents') },
    { label: 'Total Documents', value: stats.totalDocuments, icon: '📄', color: 'bg-purple-500', onClick: () => router.push('/dashboard/coordinator?tab=documents') },
  ]

  const activityStats = [
    { label: 'Research', value: stats.researchPublications, icon: '📚', color: 'text-blue-600' },
    { label: 'Courses', value: stats.courses, icon: '📖', color: 'text-green-600' },
    { label: 'Events', value: stats.events, icon: '🎪', color: 'text-purple-600' },
    { label: 'Workshops', value: stats.workshops, icon: '🎯', color: 'text-orange-600' },
    { label: 'Approved', value: stats.approvedDocuments, icon: '✅', color: 'text-green-600' },
    { label: 'Rejected', value: stats.rejectedDocuments, icon: '❌', color: 'text-red-600' },
    { label: 'Feedback', value: stats.totalFeedback, icon: '💬', color: 'text-indigo-600' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Department Overview</h2>
          <p className="text-gray-600">
            {user?.department && typeof user.department === 'object'
              ? user.department.name
              : 'Your Department'} Dashboard
          </p>
        </div>
        <CreateAnnouncement
          userDepartment={user?.department}
          onAnnouncementCreated={() => setRefreshKey(prev => prev + 1)}
        />
      </div>

      {/* Main Stats - Interactive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat, idx) => (
          <div
            key={idx}
            onClick={stat.onClick}
            className={`${stat.color} text-white rounded-lg shadow-lg p-6 cursor-pointer transform transition hover:scale-105 hover:shadow-xl`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">{stat.label}</p>
                <p className="text-4xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className="text-5xl opacity-80">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Statistics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Department Activity Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {activityStats.map((stat, idx) => (
            <div key={idx} className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className={`text-3xl mb-2 ${stat.color}`}>{stat.icon}</div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-600 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Documents */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Pending Reviews</h3>
            <button
              onClick={() => router.push('/dashboard/coordinator?tab=documents')}
              className="text-sm text-blue-600 hover:underline"
            >
              View All →
            </button>
          </div>
          {recentDocs.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">✅</div>
              <p className="text-gray-500">All caught up! No pending reviews.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentDocs.map((doc) => (
                <div
                  key={doc._id}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => router.push('/dashboard/coordinator?tab=documents')}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{doc.title}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {doc.uploadedBy ? `${doc.uploadedBy.firstName} ${doc.uploadedBy.lastName}` : 'Unknown'}
                        {doc.uploadedBy?.role && (
                          <span className="ml-2 text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded capitalize">
                            {doc.uploadedBy.role}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(doc.createdAt).toLocaleDateString()} • {doc.documentType}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 ml-2">
                      Pending
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Feedback */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Recent Feedback</h3>
            <button
              onClick={() => router.push('/dashboard/coordinator?tab=student-feedback')}
              className="text-sm text-blue-600 hover:underline"
            >
              View All →
            </button>
          </div>
          {recentFeedback.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">💬</div>
              <p className="text-gray-500">No feedback submitted yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentFeedback.map((fb, idx) => (
                <div key={idx} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 capitalize">{fb.type} Feedback</p>
                      <p className="text-sm text-gray-600 mt-1">{fb.subject}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(fb.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`text-2xl ${fb.rating >= 4 ? 'text-green-500' :
                        fb.rating >= 3 ? 'text-yellow-500' :
                          'text-red-500'
                      }`}>
                      {'⭐'.repeat(fb.rating || 0)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-lg shadow-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <button
            onClick={() => router.push('/dashboard/coordinator?tab=faculty')}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition text-center"
          >
            <div className="text-3xl mb-2">👨‍🏫</div>
            <p className="text-sm font-medium">Faculty</p>
          </button>
          <button
            onClick={() => router.push('/dashboard/coordinator?tab=students')}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition text-center"
          >
            <div className="text-3xl mb-2">🎓</div>
            <p className="text-sm font-medium">Students</p>
          </button>
          <button
            onClick={() => router.push('/dashboard/coordinator?tab=documents')}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition text-center"
          >
            <div className="text-3xl mb-2">📄</div>
            <p className="text-sm font-medium">Documents</p>
          </button>
          <button
            onClick={() => router.push('/dashboard/coordinator?tab=faculty-activities')}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition text-center"
          >
            <div className="text-3xl mb-2">📊</div>
            <p className="text-sm font-medium">Activities</p>
          </button>
          <button
            onClick={() => router.push('/dashboard/coordinator?tab=reports')}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition text-center"
          >
            <div className="text-3xl mb-2">📈</div>
            <p className="text-sm font-medium">Reports</p>
          </button>
        </div>
      </div>
    </div>
  )
}
