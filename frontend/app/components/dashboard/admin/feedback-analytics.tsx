'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface FeedbackItem {
  _id: string
  studentId: {
    firstName: string
    lastName: string
    email: string
    department?: {
      _id: string
      name: string
    }
  }
  feedbackType: string
  subject: string
  rating: number
  comments: string
  createdAt: string
  department?: string
}

export default function FeedbackAnalytics() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState('all')
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalFeedback: 0,
    avgRating: 0,
    byType: { course: 0, faculty: 0, institution: 0 },
    ratingDistribution: [0, 0, 0, 0, 0],
    byDepartment: {} as Record<string, { count: number; totalRating: number }>
  })

  useEffect(() => {
    fetchFeedback()
  }, [])

  const fetchFeedback = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/feedback/all`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setFeedback(data)
        calculateStats(data)
      }
      setLoading(false)
    } catch (error) {
      console.log('[v0] Error fetching feedback:', error)
      setLoading(false)
    }
  }

  const calculateStats = (feedbackData: FeedbackItem[]) => {
    const total = feedbackData.length
    const avgRating = total > 0 ? feedbackData.reduce((sum, f) => sum + f.rating, 0) / total : 0
    const typeCount = { course: 0, faculty: 0, institution: 0 }
    const ratingDist = [0, 0, 0, 0, 0]
    const deptStats: Record<string, { count: number; totalRating: number }> = {}

    feedbackData.forEach((f) => {
      // Type Stats
      if (f.feedbackType in typeCount) {
        typeCount[f.feedbackType as keyof typeof typeCount]++
      }

      // Rating Dist
      if (f.rating >= 1 && f.rating <= 5) {
        ratingDist[f.rating - 1]++
      }

      // Department Stats
      const deptName = f.studentId?.department?.name || 'Unknown Department'
      if (!deptStats[deptName]) {
        deptStats[deptName] = { count: 0, totalRating: 0 }
      }
      deptStats[deptName].count++
      deptStats[deptName].totalRating += f.rating
    })

    setStats({
      totalFeedback: total,
      avgRating: Math.round(avgRating * 10) / 10,
      byType: typeCount,
      ratingDistribution: ratingDist,
      byDepartment: deptStats
    })
  }

  const getFilteredFeedback = () => {
    if (filterType === 'all') return feedback
    return feedback.filter((f) => f.feedbackType === filterType)
  }

  const filteredFeedback = getFilteredFeedback()

  // Prepare chart data
  const departmentChartData = Object.entries(stats.byDepartment).map(([name, data]) => ({
    name: name.replace('Department', '').trim(), // Shorten name for chart if needed
    Feedback: data.count,
    'Avg Rating': Number((data.totalRating / data.count).toFixed(1))
  }))

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Detail Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform scale-100">
            {(() => {
              const item = feedback.find((f) => f._id === selectedFeedback)
              return item ? (
                <>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Feedback Details</h3>
                      <p className="text-sm text-gray-500 mt-1">ID: {item._id}</p>
                    </div>
                    <button
                      onClick={() => setSelectedFeedback(null)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Student</p>
                      <p className="text-gray-900 font-medium text-lg">
                        {item.studentId?.firstName} {item.studentId?.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{item.studentId?.email}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Department</p>
                      <p className="text-gray-900 font-medium text-lg">
                        {item.studentId?.department?.name || 'N/A'}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize
                        ${item.feedbackType === 'course' ? 'bg-blue-100 text-blue-800' :
                          item.feedbackType === 'faculty' ? 'bg-purple-100 text-purple-800' :
                            'bg-green-100 text-green-800'}`}>
                        {item.feedbackType}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Rating</p>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-xl ${i < item.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="font-bold text-gray-900 text-lg">{item.rating}/5</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 space-y-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Subject (Optional)</p>
                    <p className="text-gray-900 border-b border-gray-100 pb-2">{item.subject || 'General Feedback'}</p>
                  </div>

                  <div className="mt-6 space-y-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Comments</p>
                    <div className="bg-blue-50 p-4 rounded-xl text-gray-800 italic leading-relaxed border border-blue-100">
                      &quot;{item.comments}&quot;
                    </div>
                  </div>

                  <div className="mt-6 text-right text-sm text-gray-400">
                    Submitted on {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString()}
                  </div>
                </>
              ) : null
            })()}
          </div>
        </div>
      )}

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-500 font-medium">Total Feedback</h3>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">📊</span>
          </div>
          <p className="text-4xl font-bold text-gray-900">{stats.totalFeedback}</p>
          <p className="text-sm text-gray-400 mt-2">All time submissions</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-500 font-medium">Avg. Rating</h3>
            <span className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">⭐</span>
          </div>
          <p className="text-4xl font-bold text-gray-900">{stats.avgRating}</p>
          <p className="text-sm text-gray-400 mt-2">Overall satisfaction</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 col-span-1 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-500 font-medium">Feedback by Type</h3>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Course</p>
              <p className="text-2xl font-bold text-blue-600">{stats.byType.course}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Faculty</p>
              <p className="text-2xl font-bold text-purple-600">{stats.byType.faculty}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Institutional</p>
              <p className="text-2xl font-bold text-green-600">{stats.byType.institution}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Department Wise Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg text-lg">🏢</span>
            Department-wise Analytics
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-left">
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Department</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Total Feedback</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Avg Rating</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {Object.keys(stats.byDepartment).length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                      No enough data for department analysis
                    </td>
                  </tr>
                ) : (
                  Object.entries(stats.byDepartment).map(([dept, data], idx) => {
                    const avg = data.count > 0 ? (data.totalRating / data.count).toFixed(1) : '0'
                    return (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">{dept}</td>
                        <td className="px-6 py-4 text-gray-600">
                          <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-700">
                            {data.count}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900">{avg}</span>
                            <span className="text-yellow-400 text-sm">★</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${Number(avg) >= 4 ? 'bg-green-500' : Number(avg) >= 3 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                              style={{ width: `${(Number(avg) / 5) * 100}%` }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Rating Distribution</h3>
          <div className="space-y-6">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="relative">
                <div className="flex justify-between text-sm mb-1 px-1">
                  <span className="font-medium text-gray-700 flex items-center gap-1">
                    {rating} <span className="text-yellow-400">★</span>
                  </span>
                  <span className="text-gray-500 font-mono">
                    {stats.ratingDistribution[rating - 1]}
                  </span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full shadow-sm transition-all duration-500"
                    style={{
                      width: `${stats.totalFeedback > 0
                        ? (stats.ratingDistribution[rating - 1] / stats.totalFeedback) * 100
                        : 0
                        }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Feedback Overview</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend />
              <Bar dataKey="Feedback" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={40} />
              <Bar dataKey="Avg Rating" fill="#10B981" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Feedback List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h3 className="text-xl font-bold text-gray-900">Recent Feedback</h3>
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
            {['all', 'course', 'faculty', 'institution'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filterType === type
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeedback.length === 0 ? (
            <div className="col-span-full py-12 text-center text-gray-400 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
              No feedback submissions found
            </div>
          ) : (
            filteredFeedback.map((item) => (
              <div
                key={item._id}
                onClick={() => setSelectedFeedback(item._id)}
                className="group bg-white p-5 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 
                  ${item.feedbackType === 'course' ? 'bg-blue-500' :
                    item.feedbackType === 'faculty' ? 'bg-purple-500' :
                      'bg-green-500'}`}
                />

                <div className="flex justify-between items-start mb-3 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold">
                      {item.studentId?.firstName?.[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{item.studentId?.firstName} {item.studentId?.lastName}</h4>
                      <p className="text-xs text-gray-500">{item.studentId?.department?.name || 'Unknown'}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-3 relative z-10">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-sm ${i < item.rating ? 'text-yellow-400' : 'text-gray-200'}`}>
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                    &quot;{item.comments}&quot;
                  </p>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-100 text-xs text-gray-400">
                  <span className="capitalize bg-gray-50 px-2 py-1 rounded">{item.feedbackType}</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
