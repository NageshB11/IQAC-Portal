'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function StudentOverview() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    feedbackSubmitted: 0,
    achievementsUploaded: 0,
    careerRecords: 0,
    totalDocuments: 0,
    approvedDocuments: 0,
    pendingDocuments: 0,
    announcements: 0,
  })
  const [recentFeedback, setRecentFeedback] = useState<any[]>([])
  const [recentAchievements, setRecentAchievements] = useState<any[]>([])
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      const userData = JSON.parse(localStorage.getItem('user') || '{}')

      // Fetch student's feedback
      const feedbackRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/feedback/student/${userData._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      // Fetch student's documents
      const docsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/documents/user/${userData._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      // Fetch announcements
      const announcementsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/announcements/my-announcements`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (feedbackRes.ok) {
        const feedbackData = await feedbackRes.json()
        setStats((prev) => ({
          ...prev,
          feedbackSubmitted: feedbackData.count || 0,
        }))
        setRecentFeedback(feedbackData.feedback?.slice(0, 3) || [])
      }

      if (docsRes.ok) {
        const docs = await docsRes.json()
        const achievements = docs.filter((d: any) => d.documentType === 'achievement')
        const career = docs.filter((d: any) => d.documentType === 'career')

        setStats((prev) => ({
          ...prev,
          totalDocuments: docs.length,
          achievementsUploaded: achievements.length,
          careerRecords: career.length,
          approvedDocuments: docs.filter((d: any) => d.status === 'approved').length,
          pendingDocuments: docs.filter((d: any) => d.status === 'pending').length,
        }))
        setRecentAchievements(achievements.slice(-3).reverse())
      }

      if (announcementsRes.ok) {
        const announcementsData = await announcementsRes.json()
        setAnnouncements(announcementsData.slice(0, 5))
        setStats((prev) => ({
          ...prev,
          announcements: announcementsData.length,
        }))
      }

      setLoading(false)
    } catch (error) {
      console.log('Error fetching overview data:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-lg">Loading dashboard...</div></div>
  }

  const mainStats = [
    {
      label: 'Feedback Submitted',
      value: stats.feedbackSubmitted,
      icon: '✍️',
      gradient: 'from-blue-500 to-blue-600',
      onClick: () => router.push('/dashboard/student?tab=feedback')
    },
    {
      label: 'Achievements',
      value: stats.achievementsUploaded,
      icon: '🏆',
      gradient: 'from-green-500 to-green-600',
      onClick: () => router.push('/dashboard/student?tab=achievements')
    },
    {
      label: 'Career Records',
      value: stats.careerRecords,
      icon: '💼',
      gradient: 'from-purple-500 to-purple-600',
      onClick: () => router.push('/dashboard/student?tab=career')
    },
    {
      label: 'Announcements',
      value: stats.announcements,
      icon: '📢',
      gradient: 'from-orange-500 to-orange-600',
      onClick: () => router.push('/dashboard/student?tab=announcements')
    },
  ]

  const documentStats = [
    { label: 'Total Documents', value: stats.totalDocuments, icon: '📄', color: 'text-blue-600' },
    { label: 'Approved', value: stats.approvedDocuments, icon: '✅', color: 'text-green-600' },
    { label: 'Pending', value: stats.pendingDocuments, icon: '⏳', color: 'text-yellow-600' },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold">Welcome back, {user?.firstName}! 🎓</h2>
        <p className="mt-2 opacity-90">
          {user?.department && typeof user.department === 'object'
            ? `${user.department.name} Department`
            : 'Student Portal'}
        </p>
      </div>

      {/* Main Stats - Interactive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat, idx) => (
          <div
            key={idx}
            onClick={stat.onClick}
            className={`bg-gradient-to-br ${stat.gradient} rounded-lg shadow-lg p-6 text-white cursor-pointer transform transition hover:scale-105 hover:shadow-xl`}
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

      {/* Document Statistics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Document Statistics</h3>
        <div className="grid grid-cols-3 gap-4">
          {documentStats.map((stat, idx) => (
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
        {/* Recent Feedback */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Recent Feedback</h3>
            <button
              onClick={() => router.push('/dashboard/student?tab=feedback')}
              className="text-sm text-blue-600 hover:underline"
            >
              View All →
            </button>
          </div>
          {recentFeedback.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">✍️</div>
              <p className="text-gray-500 mb-3">No feedback submitted yet</p>
              <button
                onClick={() => router.push('/dashboard/student?tab=feedback')}
                className="text-sm text-blue-600 hover:underline"
              >
                Submit your first feedback
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentFeedback.map((activity: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 capitalize">
                        {activity.type} Feedback
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{activity.subject}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-yellow-500">
                      {'⭐'.repeat(activity.rating || 0)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Achievements */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Recent Achievements</h3>
            <button
              onClick={() => router.push('/dashboard/student?tab=achievements')}
              className="text-sm text-blue-600 hover:underline"
            >
              View All →
            </button>
          </div>
          {recentAchievements.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">🏆</div>
              <p className="text-gray-500 mb-3">No achievements uploaded yet</p>
              <button
                onClick={() => router.push('/dashboard/student?tab=achievements')}
                className="text-sm text-blue-600 hover:underline"
              >
                Upload your first achievement
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAchievements.map((achievement: any) => (
                <div
                  key={achievement._id}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{achievement.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(achievement.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ml-2 ${achievement.status === 'approved' ? 'bg-green-100 text-green-700' :
                        achievement.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                      }`}>
                      {achievement.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Announcements */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">📢 Latest Announcements</h3>
          <button
            onClick={() => router.push('/dashboard/student?tab=announcements')}
            className="text-sm text-blue-600 hover:underline"
          >
            View All →
          </button>
        </div>
        {announcements.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No announcements at this time</p>
        ) : (
          <div className="space-y-3">
            {announcements.map((announcement: any) => (
              <div
                key={announcement._id}
                className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg hover:bg-blue-100 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{announcement.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{announcement.message}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span>📅 {new Date(announcement.createdAt).toLocaleDateString()}</span>
                      {announcement.createdBy && (
                        <span>👤 {announcement.createdBy.firstName} {announcement.createdBy.lastName}</span>
                      )}
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ml-2 ${announcement.priority === 'high' ? 'bg-red-100 text-red-700' :
                      announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                    }`}>
                    {announcement.priority || 'normal'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => router.push('/dashboard/student?tab=feedback')}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition text-center"
          >
            <div className="text-3xl mb-2">✍️</div>
            <p className="text-sm font-medium">Submit Feedback</p>
          </button>
          <button
            onClick={() => router.push('/dashboard/student?tab=achievements')}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition text-center"
          >
            <div className="text-3xl mb-2">🏆</div>
            <p className="text-sm font-medium">Add Achievement</p>
          </button>
          <button
            onClick={() => router.push('/dashboard/student?tab=career')}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition text-center"
          >
            <div className="text-3xl mb-2">💼</div>
            <p className="text-sm font-medium">Career Progress</p>
          </button>
          <button
            onClick={() => router.push('/dashboard/student?tab=announcements')}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition text-center"
          >
            <div className="text-3xl mb-2">📢</div>
            <p className="text-sm font-medium">Announcements</p>
          </button>
        </div>
      </div>
    </div>
  )
}
