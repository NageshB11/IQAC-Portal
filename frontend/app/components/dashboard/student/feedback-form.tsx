'use client'

import { useState } from 'react'

export default function FeedbackForm() {
  const [feedbackType, setFeedbackType] = useState('course')
  const [formData, setFormData] = useState({
    subject: '',
    rating: 5,
    comments: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const user = JSON.parse(localStorage.getItem('user') || '{}')

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentId: user._id,
          type: feedbackType,
          subject: formData.subject,
          rating: parseInt(formData.rating.toString()),
          comments: formData.comments,
        }),
      })

      if (response.ok) {
        setSubmitted(true)
        setFormData({ subject: '', rating: 5, comments: '' })
        setTimeout(() => setSubmitted(false), 3000)
      } else {
        setError('Failed to submit feedback. Please try again.')
      }
    } catch (err) {
      console.log('[v0] Error submitting feedback:', err)
      setError('Error submitting feedback')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feedback Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit Your Feedback</h2>

            {submitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                ✓ Thank you! Your feedback has been submitted successfully.
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Feedback Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Feedback Type
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: 'course', label: 'Course', icon: '📚' },
                    { id: 'faculty', label: 'Faculty', icon: '👨‍🏫' },
                    { id: 'institution', label: 'Institution', icon: '🏢' },
                  ].map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFeedbackType(type.id)}
                      className={`p-4 rounded-lg border-2 transition ${feedbackType === type.id
                        ? 'border-orange-600 bg-orange-50'
                        : 'border-gray-300 hover:border-orange-400'
                        }`}
                    >
                      <div className="text-2xl mb-2">{type.icon}</div>
                      <p className="font-medium text-sm text-gray-900">{type.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject */}
              {feedbackType !== 'institution' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {feedbackType === 'course' ? 'Course Name' : 'Faculty Name'}
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder={
                      feedbackType === 'course'
                        ? 'e.g., Data Structures'
                        : 'e.g., John Smith'
                    }
                    required
                  />
                </div>
              )}

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Rating</label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className={`text-4xl transition ${star <= formData.rating ? 'text-orange-500' : 'text-gray-300'
                        }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {formData.rating === 5 && 'Excellent'}
                  {formData.rating === 4 && 'Very Good'}
                  {formData.rating === 3 && 'Good'}
                  {formData.rating === 2 && 'Fair'}
                  {formData.rating === 1 && 'Poor'}
                </p>
              </div>

              {/* Comments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
                <textarea
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows={6}
                  placeholder="Share your detailed feedback, suggestions, or concerns..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium disabled:bg-gray-400"
              >
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Feedback Tips</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-900">Be Honest</p>
              <p className="text-xs text-gray-600 mt-1">Provide honest and unbiased feedback</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Be Specific</p>
              <p className="text-xs text-gray-600 mt-1">Give specific examples and details</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Be Constructive</p>
              <p className="text-xs text-gray-600 mt-1">Suggest improvements when needed</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Be Respectful</p>
              <p className="text-xs text-gray-600 mt-1">Maintain professionalism</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
