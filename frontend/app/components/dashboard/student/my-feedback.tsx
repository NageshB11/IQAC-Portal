'use client'

import { useState, useEffect } from 'react'

interface FeedbackItem {
  _id: string
  type: string
  subject: string
  rating: number
  comments: string
  createdAt: string
  studentId: string
}

export default function MyFeedback() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([])
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [feedbackStatus, setFeedbackStatus] = useState<{
    [key: string]: { status: string; reviewedAt?: string; notes?: string }
  }>({})

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const token = localStorage.getItem('token')
        const user = JSON.parse(localStorage.getItem('user') || '{}')

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/feedback/student/${user._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )

        if (response.ok) {
          const data = await response.json()
          setFeedback(data.feedback || [])
          const statusMap: { [key: string]: { status: string; reviewedAt?: string; notes?: string } } = {}
          data.feedback?.forEach((f: FeedbackItem) => {
            statusMap[f._id] = { status: 'received', reviewedAt: f.createdAt }
          })
          setFeedbackStatus(statusMap)
        }

        setLoading(false)
      } catch (error) {
        console.log('[v0] Error fetching feedback:', error)
        setLoading(false)
      }
    }

    fetchFeedback()
  }, [])

  const getFeedbackItem = (id: string) => feedback.find((f) => f._id === id)

  if (loading) {
    return <div className="text-center py-8">Loading your feedback...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">My Feedback Submissions</h2>
        <p className="text-gray-600 text-sm">All feedback submissions and responses</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {feedback.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600">No feedback submitted yet.</p>
              <p className="text-sm text-gray-500 mt-2">
                Start by submitting your first feedback to see it here.
              </p>
            </div>
          ) : (
            feedback.map((item: any) => (
              <div
                key={item._id}
                onClick={() => setSelectedFeedback(item._id)}
                className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-600 cursor-pointer hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{item.subject || 'General'}</h3>
                    <p className="text-sm text-gray-600">
                      {item.type} • Submitted{' '}
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                      {feedbackStatus[item._id]?.status || 'Received'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={i < item.rating ? 'text-orange-500' : 'text-gray-300'}
                    >
                      ★
                    </span>
                  ))}
                  <span className="text-sm text-gray-600 ml-2">({item.rating}/5)</span>
                </div>

                <p className="text-gray-700 text-sm">{item.comments}</p>
              </div>
            ))
          )}
        </div>

        {selectedFeedback && (
          <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Details</h3>
              <button
                onClick={() => setSelectedFeedback(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {selectedFeedback && (
              <div className="space-y-4">
                {(() => {
                  const item = getFeedbackItem(selectedFeedback)
                  const status = item ? feedbackStatus[item._id] : undefined
                  return item ? (
                    <>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Type</p>
                        <p className="text-gray-900 font-medium">{item.type}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Subject</p>
                        <p className="text-gray-900 font-medium">{item.subject || 'General'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Rating</p>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={i < item.rating ? 'text-orange-500' : 'text-gray-300'}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Submitted</p>
                        <p className="text-gray-900 font-medium">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Status</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded">
                            {status?.status || 'Received'}
                          </span>
                        </div>
                        {status?.reviewedAt && (
                          <p className="text-xs text-gray-500 mt-2">
                            Received on{' '}
                            {new Date(status.reviewedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </>
                  ) : null
                })()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
