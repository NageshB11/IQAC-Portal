'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function FacultyOverview() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [activityStats, setActivityStats] = useState({
    research: 0,
    professionalDevelopment: 0,
    courses: 0,
    events: 0,
    institutionalEvents: 0
  })
  const [documentStats, setDocumentStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  })
  const [recentActivities, setRecentActivities] = useState<any[]>([])
  const [departmentMembers, setDepartmentMembers] = useState<any[]>([])
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

      // Fetch faculty activity statistics
      const activityResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/faculty-activities/statistics`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      // Fetch user's documents
      const docsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/documents/user/${userData._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      // Fetch department members
      const membersResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/department-members`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      // Fetch recent research publications
      const researchResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/faculty-activities/research`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (activityResponse.ok) {
        const activityData = await activityResponse.json()
        setActivityStats(activityData)
      }

      if (docsResponse.ok) {
        const docs = await docsResponse.json()
        setDocumentStats({
          total: docs.length,
          pending: docs.filter((d: any) => d.status === 'pending').length,
          approved: docs.filter((d: any) => d.status === 'approved').length,
          rejected: docs.filter((d: any) => d.status === 'rejected').length
        })
      }

      if (membersResponse.ok) {
        const members = await membersResponse.json()
        setDepartmentMembers(members.filter((m: any) => m.role === 'faculty').slice(0, 5))
      }

      if (researchResponse.ok) {
        const research = await researchResponse.json()
        setRecentActivities(research.slice(0, 5))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-lg">Loading dashboard...</div></div>

  const mainActivityCards = [
    {
      label: 'Research Publications',
      value: activityStats.research,
      icon: '📚',
      gradient: 'from-blue-500 to-blue-600',
      onClick: () => router.push('/dashboard/faculty?tab=research')
    },
    {
      label: 'Professional Development',
      value: activityStats.professionalDevelopment,
      icon: '🎓',
      gradient: 'from-purple-500 to-purple-600',
      onClick: () => router.push('/dashboard/faculty?tab=professional-dev')
    },
    {
      label: 'Courses Taught',
      value: activityStats.courses,
      icon: '📖',
      gradient: 'from-green-500 to-green-600',
      onClick: () => router.push('/dashboard/faculty?tab=courses')
    },
    {
      label: 'Events Organized',
      value: activityStats.events,
      icon: '🎪',
      gradient: 'from-orange-500 to-orange-600',
      onClick: () => router.push('/dashboard/faculty?tab=events')
    },
  ]



  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold">Welcome back, {user?.firstName}! 👋</h2>
        <p className="mt-2 opacity-90">
          {user?.department && typeof user.department === 'object'
            ? `${user.department.name} Department`
            : 'Faculty Member'}
        </p>
      </div>

      {/* Activity Statistics - Interactive Cards */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Your Activity Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mainActivityCards.map((card, idx) => (
            <div
              key={idx}
              onClick={card.onClick}
              className={`bg-gradient-to-br ${card.gradient} rounded-lg shadow-lg p-6 text-white cursor-pointer transform transition hover:scale-105 hover:shadow-xl`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">{card.label}</p>
                  <p className="text-4xl font-bold mt-2">{card.value}</p>
                </div>
                <div className="text-5xl opacity-80">{card.icon}</div>
              </div>
            </div>
          ))}
        </div>
      </div>



      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Research Publications */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Recent Research</h3>
            <button
              onClick={() => router.push('/dashboard/faculty?tab=research')}
              className="text-sm text-blue-600 hover:underline"
            >
              View All →
            </button>
          </div>
          {recentActivities.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">📚</div>
              <p className="text-gray-500">No research publications yet</p>
              <button
                onClick={() => router.push('/dashboard/faculty?tab=research')}
                className="mt-3 text-sm text-blue-600 hover:underline"
              >
                Add your first publication
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div
                  key={activity._id}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{activity.journalConference}</p>
                  <span className="text-xs text-gray-500">
                    {new Date(activity.publicationDate).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Department Colleagues */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Department Colleagues</h3>
            <button
              onClick={() => router.push('/dashboard/faculty?tab=members')}
              className="text-sm text-blue-600 hover:underline"
            >
              View All →
            </button>
          </div>
          {departmentMembers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No colleagues found</p>
          ) : (
            <div className="space-y-3">
              {departmentMembers.map((member) => (
                <div key={member._id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {member.firstName?.[0]}{member.lastName?.[0]}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{member.firstName} {member.lastName}</p>
                    <p className="text-sm text-gray-600">{member.email}</p>
                    {member.designation && (
                      <p className="text-xs text-gray-500 mt-1">{member.designation}</p>
                    )}
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
            onClick={() => router.push('/dashboard/faculty?tab=research')}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition text-center"
          >
            <div className="text-3xl mb-2">📚</div>
            <p className="text-sm font-medium">Add Research</p>
          </button>
          <button
            onClick={() => router.push('/dashboard/faculty?tab=professional-dev')}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition text-center"
          >
            <div className="text-3xl mb-2">🎓</div>
            <p className="text-sm font-medium">Add FDP/STTP</p>
          </button>
          <button
            onClick={() => router.push('/dashboard/faculty?tab=courses')}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition text-center"
          >
            <div className="text-3xl mb-2">📖</div>
            <p className="text-sm font-medium">Add Course</p>
          </button>
          <button
            onClick={() => router.push('/dashboard/faculty?tab=events')}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition text-center"
          >
            <div className="text-3xl mb-2">🎪</div>
            <p className="text-sm font-medium">Add Event</p>
          </button>
          <button
            onClick={() => router.push('/dashboard/faculty?tab=documents')}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition text-center"
          >
            <div className="text-3xl mb-2">📄</div>
            <p className="text-sm font-medium">Documents</p>
          </button>
        </div>
      </div>
    </div>
  )
}
