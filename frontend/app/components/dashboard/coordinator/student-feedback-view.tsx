'use client'

import { useState, useEffect } from 'react'

export default function StudentFeedbackView() {
    const [feedbackList, setFeedbackList] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [filterType, setFilterType] = useState('all')

    useEffect(() => {
        fetchFeedback()
    }, [])

    const fetchFeedback = async () => {
        try {
            const token = localStorage.getItem('token')
            const user = JSON.parse(localStorage.getItem('user') || '{}')

            if (!user.department) {
                setError('Department information not found')
                setLoading(false)
                return
            }

            const departmentId = typeof user.department === 'object' ? user.department._id : user.department

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/departments/${departmentId}/student-feedback`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
                throw new Error(errorData.message || `Failed to fetch student feedback (${response.status})`)
            }

            const data = await response.json()
            setFeedbackList(data)
        } catch (err: any) {
            setError(err.message || 'Failed to load student feedback')
            console.error('Fetch feedback error:', err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div>Loading student feedback...</div>
    if (error) return <div className="text-red-600">{error}</div>

    const filteredFeedback = filterType === 'all'
        ? feedbackList
        : feedbackList.filter(f => f.feedbackType === filterType)

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Student Feedback</h2>
                    <p className="text-gray-600 text-sm">View all feedback submitted by students in your department</p>
                </div>
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <option value="all">All Types</option>
                    <option value="course">Course Feedback</option>
                    <option value="faculty">Faculty Feedback</option>
                    <option value="institution">Institution Feedback</option>
                </select>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                {filteredFeedback.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No student feedback found.</p>
                ) : (
                    <div className="space-y-4">
                        {filteredFeedback.map((feedback) => (
                            <div key={feedback._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h4 className="font-semibold text-gray-900">
                                            {feedback.studentId?.firstName} {feedback.studentId?.lastName}
                                        </h4>
                                        <p className="text-sm text-gray-600">{feedback.studentId?.email}</p>
                                        {feedback.studentId?.enrollmentNumber && (
                                            <p className="text-sm text-gray-600">Enrollment: {feedback.studentId.enrollmentNumber}</p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium capitalize">
                                            {feedback.feedbackType}
                                        </span>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(feedback.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                {feedback.subject && (
                                    <div className="mb-2">
                                        <p className="text-sm font-medium text-gray-700">Subject: {feedback.subject}</p>
                                    </div>
                                )}

                                {feedback.rating && (
                                    <div className="mb-2">
                                        <p className="text-sm text-gray-700">
                                            Rating:
                                            <span className="ml-2">
                                                {'★'.repeat(feedback.rating)}
                                                {'☆'.repeat(5 - feedback.rating)}
                                            </span>
                                            <span className="ml-2 text-orange-600 font-medium">
                                                ({feedback.rating}/5)
                                            </span>
                                        </p>
                                    </div>
                                )}

                                <div className="mt-3 p-3 bg-gray-50 rounded">
                                    <p className="text-sm text-gray-700">{feedback.comments || 'No comments provided'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">📊 Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                        <p className="text-blue-600">Total Feedback</p>
                        <p className="text-2xl font-bold text-blue-900">{feedbackList.length}</p>
                    </div>
                    <div>
                        <p className="text-blue-600">Course Feedback</p>
                        <p className="text-2xl font-bold text-blue-900">
                            {feedbackList.filter(f => f.feedbackType === 'course').length}
                        </p>
                    </div>
                    <div>
                        <p className="text-blue-600">Faculty Feedback</p>
                        <p className="text-2xl font-bold text-blue-900">
                            {feedbackList.filter(f => f.feedbackType === 'faculty').length}
                        </p>
                    </div>
                    <div>
                        <p className="text-blue-600">Institution Feedback</p>
                        <p className="text-2xl font-bold text-blue-900">
                            {feedbackList.filter(f => f.feedbackType === 'institution').length}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
