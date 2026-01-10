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
    totalActivities: 0,
    totalEvents: 0,
    totalResearch: 0
  })

  const [recentUsers, setRecentUsers] = useState<any[]>([])
  const [recentActivities, setRecentActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')

      const get = async (url: string) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api${url}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        return res.ok ? res.json() : (Array.isArray(JSON.parse(JSON.stringify([]))) ? [] : {})
      }

      // Parallel data fetching for efficiency
      const [users, depts, docs, activitiesStats] = await Promise.all([
        get('/users/all'),
        get('/departments/all'),
        get('/documents/all'),
        get('/faculty-activities/statistics')
      ])

      const facultyCount = Array.isArray(users) ? users.filter((u: any) => u.role === 'faculty').length : 0
      const studentCount = Array.isArray(users) ? users.filter((u: any) => u.role === 'student').length : 0
      const totalActs = (activitiesStats.research || 0) + (activitiesStats.events || 0) + (activitiesStats.courses || 0)

      setStats({
        totalUsers: Array.isArray(users) ? users.length : 0,
        totalFaculty: facultyCount,
        totalStudents: studentCount,
        totalCoordinators: Array.isArray(users) ? users.filter((u: any) => u.role === 'coordinator').length : 0,
        totalDepartments: Array.isArray(depts) ? depts.length : 0,
        pendingApprovals: Array.isArray(users) ? users.filter((u: any) => !u.isApproved).length : 0,
        totalDocuments: Array.isArray(docs) ? docs.length : 0,
        totalActivities: totalActs,
        totalEvents: activitiesStats.events || 0,
        totalResearch: activitiesStats.research || 0
      })

      if (Array.isArray(users)) setRecentUsers(users.slice(-5).reverse())
      // For recent activities, we'd need a dedicated endpoint, but we can reuse users for now or fetch logs

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const sections = [
    {
      title: 'Faculty Activities',
      desc: 'Research, Events, Courses',
      icon: '👨‍🏫',
      color: 'from-blue-500 to-blue-600',
      action: () => router.push('/dashboard/admin?tab=faculty-activities'),
      stats: [
        { label: 'Research', value: stats.totalResearch },
        { label: 'Events', value: stats.totalEvents }
      ]
    },
    {
      title: 'Student Activities',
      desc: 'Achievements & Awards',
      icon: '🎓',
      color: 'from-green-500 to-green-600',
      action: () => router.push('/dashboard/admin?tab=student-activities'),
      stats: [
        { label: 'Total Students', value: stats.totalStudents },
        { label: 'Activities', value: 'View' } // Placeholder
      ]
    },
    {
      title: 'User Management',
      desc: 'Faculty, Students, Staff',
      icon: '👥',
      color: 'from-purple-500 to-purple-600',
      action: () => router.push('/dashboard/admin?tab=users'),
      stats: [
        { label: 'Total Users', value: stats.totalUsers },
        { label: 'Pending', value: stats.pendingApprovals }
      ]
    },
    {
      title: 'Reports & Analytics',
      desc: 'Generate Insights',
      icon: '📊',
      color: 'from-orange-500 to-orange-600',
      action: () => router.push('/dashboard/admin?tab=reports'),
      stats: [
        { label: 'Documents', value: stats.totalDocuments },
        { label: 'Depts', value: stats.totalDepartments }
      ]
    }
  ]

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
      </div>
    </div>
  )

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Admin Control Center</h2>
          <p className="text-gray-500 mt-1">Overview of institutional activities and performance</p>
        </div>
      </div>

      {/* Section Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {sections.map((section, idx) => (
          <div
            key={idx}
            onClick={section.action}
            className="group bg-white rounded-xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className={`h-2 bg-gradient-to-r ${section.color}`} />
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${section.color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  <span className="text-2xl">{section.icon}</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{section.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{section.desc}</p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                {section.stats.map((stat, sIdx) => (
                  <div key={sIdx} className="text-center">
                    <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">{stat.label}</div>
                    <div className="text-lg font-bold text-gray-800">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Recent Users</h3>
            <button onClick={() => router.push('/dashboard/admin?tab=users')} className="text-sm text-blue-600 hover:text-blue-800 font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {recentUsers.map((user, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-lg shadow-sm">
                    {user.firstName?.[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{user.firstName} {user.lastName}</div>
                    <div className="text-xs text-gray-500 capitalize">{user.role} • {user.email}</div>
                  </div>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.isApproved ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                    {user.isApproved ? 'Active' : 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-lg font-bold mb-6">Quick Tools</h3>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/dashboard/admin?tab=announcements')}
              className="w-full text-left p-3 rounded-lg bg-white/10 hover:bg-white/20 transition flex items-center gap-3 backdrop-blur-sm"
            >
              <span>📢</span> Make Announcement
            </button>
            <button
              onClick={() => router.push('/dashboard/admin?tab=documents')}
              className="w-full text-left p-3 rounded-lg bg-white/10 hover:bg-white/20 transition flex items-center gap-3 backdrop-blur-sm"
            >
              <span>📄</span> Upload Document
            </button>
            <button
              onClick={() => router.push('/dashboard/admin?tab=reports')}
              className="w-full text-left p-3 rounded-lg bg-white/10 hover:bg-white/20 transition flex items-center gap-3 backdrop-blur-sm"
            >
              <span>📊</span> Generate Reports
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10">
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">System Status</h4>
            <div className="flex items-center gap-2 text-sm text-green-400 mb-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              All Systems Operational
            </div>
            <div className="text-xs text-gray-500">
              Last synced: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
