'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardOverview() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFaculty: 0,
    totalStudents: 0,
    totalCoordinators: 0,
    totalDepartments: 0,
    pendingApprovals: 0,
    totalDocuments: 0,
    pendingDocuments: 0,
    approvedDocuments: 0,
    rejectedDocuments: 0,
    totalFeedback: 0,
    totalActivities: 0,
    totalEvents: 0,
    totalInstitutionalEvents: 0
  })
  const [recentUsers, setRecentUsers] = useState<any[]>([])
  const [recentDocuments, setRecentDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')

      // Fetch users
      const usersRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      // Fetch departments
      const deptsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/departments/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      // Fetch documents
      const docsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/documents/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      // Fetch feedback
      const feedbackRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/feedback/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      // Fetch activity stats
      const activitiesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/faculty-activities/statistics`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })


      if (usersRes.ok && deptsRes.ok && docsRes.ok) {
        const users = await usersRes.json()
        const depts = await deptsRes.json()
        const docs = await docsRes.json()
        const feedback = feedbackRes.ok ? await feedbackRes.json() : []
        const activities = activitiesRes.ok ? await activitiesRes.json() : { events: 0, institutionalEvents: 0, research: 0, professionalDevelopment: 0, courses: 0 }

        // Calculate statistics
        const facultyCount = users.filter((u: any) => u.role === 'faculty').length
        const studentCount = users.filter((u: any) => u.role === 'student').length
        const coordinatorCount = users.filter((u: any) => u.role === 'coordinator').length
        const pendingUsers = users.filter((u: any) => !u.isApproved).length
        const pendingDocs = docs.filter((d: any) => d.status === 'pending').length
        const approvedDocs = docs.filter((d: any) => d.status === 'approved').length
        const rejectedDocs = docs.filter((d: any) => d.status === 'rejected').length

        const totalActivityCount = (activities.events || 0) + (activities.institutionalEvents || 0) + (activities.research || 0) + (activities.professionalDevelopment || 0) + (activities.courses || 0);

        setStats({
          totalUsers: users.length,
          totalFaculty: facultyCount,
          totalStudents: studentCount,
          totalCoordinators: coordinatorCount,
          totalDepartments: depts.length,
          pendingApprovals: pendingUsers,
          totalDocuments: docs.length,
          pendingDocuments: pendingDocs,
          approvedDocuments: approvedDocs,
          rejectedDocuments: rejectedDocs,
          totalFeedback: feedback.length || 0,
          totalActivities: totalActivityCount,
          totalEvents: activities.events || 0,
          totalInstitutionalEvents: activities.institutionalEvents || 0
        })

        // Get recent users (last 5)
        setRecentUsers(users.slice(-5).reverse())

        // Get recent documents (last 5)
        setRecentDocuments(docs.slice(-5).reverse())
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-lg">Loading dashboard...</div></div>

  const mainStats = [
    { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: 'bg-blue-500', onClick: () => router.push('/dashboard/admin?tab=users') },
    { label: 'Departments', value: stats.totalDepartments, icon: '🏢', color: 'bg-green-500', onClick: () => router.push('/dashboard/admin?tab=departments') },
    { label: 'Pending Approvals', value: stats.pendingApprovals, icon: '⏳', color: 'bg-orange-500', onClick: () => router.push('/dashboard/admin?tab=users') },
    { label: 'Total Activities', value: stats.totalActivities, icon: '📊', color: 'bg-purple-500', onClick: () => router.push('/dashboard/admin?tab=faculty-activities') },
  ]

  const detailedStats = [
    { label: 'Faculty Members', value: stats.totalFaculty, icon: '👨‍🏫', color: 'text-blue-600' },
    { label: 'Students', value: stats.totalStudents, icon: '🎓', color: 'text-green-600' },
    { label: 'Coordinators', value: stats.totalCoordinators, icon: '👔', color: 'text-purple-600' },
    { label: 'Events Organized', value: stats.totalEvents, icon: '📅', color: 'text-orange-600' },
    { label: 'Total Feedback', value: stats.totalFeedback, icon: '💬', color: 'text-indigo-600' },
    { label: 'Approved Documents', value: stats.approvedDocuments, icon: '✅', color: 'text-green-600' },
    { label: 'Pending Documents', value: stats.pendingDocuments, icon: '📋', color: 'text-yellow-600' },
  ]

  return (
    <div className="space-y-6">
      {/* Main Stats Grid - Interactive Cards */}
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

      {/* Detailed Statistics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Detailed Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {detailedStats.map((stat, idx) => (
            <div key={idx} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={`text-3xl mb-2 ${stat.color}`}>{stat.icon}</div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-600 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Recent Users</h3>
            <button
              onClick={() => router.push('/dashboard/admin?tab=users')}
              className="text-sm text-blue-600 hover:underline"
            >
              View All →
            </button>
          </div>
          {recentUsers.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No users found</p>
          ) : (
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div key={user._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full capitalize ${user.role === 'admin' ? 'bg-red-100 text-red-700' :
                      user.role === 'coordinator' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'faculty' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                      }`}>
                      {user.role}
                    </span>
                    {!user.isApproved && (
                      <p className="text-xs text-orange-600 mt-1">Pending</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Documents */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Recent Documents</h3>
            <button
              onClick={() => router.push('/dashboard/admin?tab=documents')}
              className="text-sm text-blue-600 hover:underline"
            >
              View All →
            </button>
          </div>
          {recentDocuments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No documents found</p>
          ) : (
            <div className="space-y-3">
              {recentDocuments.map((doc) => (
                <div key={doc._id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{doc.title}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {doc.uploadedBy ? `${doc.uploadedBy.firstName} ${doc.uploadedBy.lastName}` : 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(doc.createdAt).toLocaleDateString()} • {doc.documentType}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ml-2 ${doc.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      doc.status === 'approved' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                      {doc.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => router.push('/dashboard/admin?tab=users')}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition text-center"
          >
            <div className="text-3xl mb-2">👥</div>
            <p className="text-sm font-medium">Manage Users</p>
          </button>
          <button
            onClick={() => router.push('/dashboard/admin?tab=departments')}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition text-center"
          >
            <div className="text-3xl mb-2">🏢</div>
            <p className="text-sm font-medium">Departments</p>
          </button>
          <button
            onClick={() => router.push('/dashboard/admin?tab=documents')}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition text-center"
          >
            <div className="text-3xl mb-2">📄</div>
            <p className="text-sm font-medium">Documents</p>
          </button>
          <button
            onClick={() => router.push('/dashboard/admin?tab=feedback')}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition text-center"
          >
            <div className="text-3xl mb-2">💬</div>
            <p className="text-sm font-medium">Feedback</p>
          </button>
        </div>
      </div>
    </div>
  )
}
