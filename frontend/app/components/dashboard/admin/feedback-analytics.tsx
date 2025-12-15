'use client'

import { useState, useEffect } from 'react'

interface FeedbackItem {
  _id: string
  studentId: { firstName: string; lastName: string; email: string }
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

    feedbackData.forEach((f) => {
      if (f.feedbackType in typeCount) {
        typeCount[f.feedbackType as keyof typeof typeCount]++
      }
      if (f.rating >= 1 && f.rating <= 5) {
        ratingDist[f.rating - 1]++
      }
    })

    setStats({
      totalFeedback: total,
      avgRating: Math.round(avgRating * 10) / 10,
      byType: typeCount,
      ratingDistribution: ratingDist,
    })
  }

  const getFilteredFeedback = () => {
    if (filterType === 'all') return feedback
    return feedback.filter((f) => f.feedbackType === filterType)
  }

  const filteredFeedback = getFilteredFeedback()

  if (loading) {
    return <div className="text-center py-8">Loading feedback analytics...</div>
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm">Total Feedback</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalFeedback}</p>
          <p className="text-xs text-gray-500 mt-2">Submissions received</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm">Average Rating</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.avgRating}</p>
          <p className="text-xs text-gray-500 mt-2">Out of 5.0</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm">Course Feedback</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.byType.course}</p>
          <p className="text-xs text-gray-500 mt-2">Feedback submissions</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm">Faculty Feedback</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.byType.faculty}</p>
          <p className="text-xs text-gray-500 mt-2">Feedback submissions</p>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Rating Distribution</h3>
        <div className="space-y-4">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-4">
              <div className="w-16 text-sm font-medium text-gray-700">{rating} Stars</div>
              <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
                <div
                  className="bg-blue-600 h-full flex items-center justify-end pr-2"
                  style={{
                    width: `${stats.totalFeedback > 0
                      ? (stats.ratingDistribution[rating - 1] / stats.totalFeedback) * 100
                      : 0
                      }%`,
                  }}
                >
                  {stats.ratingDistribution[rating - 1] > 0 && (
                    <span className="text-xs font-bold text-white">
                      {stats.ratingDistribution[rating - 1]}
                    </span>
                  )}
                </div>
              </div>
              <div className="w-12 text-right text-sm text-gray-600">
                {stats.ratingDistribution[rating - 1]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">All Feedback Submissions</h3>
          <div className="flex gap-2">
            {['all', 'course', 'faculty', 'institution'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filterType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredFeedback.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No feedback found</p>
          ) : (
            filteredFeedback.map((item) => (
              <div
                key={item._id}
                onClick={() => setSelectedFeedback(item._id)}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-gray-900">
                      {item.studentId?.firstName} {item.studentId?.lastName}
                    </h4>
                    <p className="text-sm text-gray-600">{item.subject || 'General'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < item.rating ? 'text-blue-600' : 'text-gray-300'}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{item.rating}/5</span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 line-clamp-2">{item.comments}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(item.createdAt).toLocaleDateString()} | {item.feedbackType}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detail View */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-96 overflow-y-auto">
            {(() => {
              const item = feedback.find((f) => f._id === selectedFeedback)
              return item ? (
                <>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Feedback Details</h3>
                    <button
                      onClick={() => setSelectedFeedback(null)}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Student</p>
                      <p className="text-gray-900 font-medium">
                        {item.studentId?.firstName} {item.studentId?.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Email</p>
                      <p className="text-gray-900 font-medium">{item.studentId?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Feedback Type</p>
                      <p className="text-gray-900 font-medium">
                        {item.feedbackType.charAt(0).toUpperCase() + item.feedbackType.slice(1)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Subject</p>
                      <p className="text-gray-900 font-medium">{item.subject || 'General'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Rating</p>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < item.rating ? 'text-blue-600' : 'text-gray-300'}>
                            ★
                          </span>
                        ))}
                        <span className="ml-2 text-gray-900 font-medium">{item.rating}/5</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Submitted Date</p>
                      <p className="text-gray-900 font-medium">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="text-sm font-medium text-gray-700 mb-2">Comments</p>
                    <p className="text-gray-700 whitespace-pre-wrap">{item.comments}</p>
                  </div>
                </>
              ) : null
            })()}
          </div>
        </div>
      )}
    </div>
  )
}
