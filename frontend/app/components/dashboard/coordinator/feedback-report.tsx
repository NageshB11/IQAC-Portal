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
}

export default function FeedbackReport() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    avgRating: 0,
    courseCount: 0,
    facultyCount: 0,
  })

  useEffect(() => {
    fetchFeedback()
  }, [])

  const fetchFeedback = async () => {
    try {
      const token = localStorage.getItem('token')
      const user = JSON.parse(localStorage.getItem('user') || '{}')

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
    const courseCount = feedbackData.filter((f) => f.feedbackType === 'course').length
    const facultyCount = feedbackData.filter((f) => f.feedbackType === 'faculty').length

    setStats({
      total,
      avgRating: Math.round(avgRating * 10) / 10,
      courseCount,
      facultyCount,
    })
  }

  const getFilteredFeedback = () => {
    return feedback.filter((f) => {
      const searchLower = searchTerm.toLowerCase()
      return (
        f.subject.toLowerCase().includes(searchLower) ||
        f.comments.toLowerCase().includes(searchLower) ||
        f.studentId?.firstName.toLowerCase().includes(searchLower) ||
        f.studentId?.lastName.toLowerCase().includes(searchLower)
      )
    })
  }

  const downloadReport = () => {
    const csvContent = [
      ['Student Name', 'Email', 'Type', 'Subject', 'Rating', 'Comments', 'Date'],
      ...feedback.map((f) => [
        `${f.studentId?.firstName} ${f.studentId?.lastName}`,
        f.studentId?.email,
        f.feedbackType,
        f.subject,
        f.rating,
        f.comments,
        new Date(f.createdAt).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `feedback-report-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const exportToPDF = () => {
    // Create a printable version of the feedback report
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Feedback Report - ${new Date().toLocaleDateString()}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; border-bottom: 2px solid #16a34a; padding-bottom: 10px; }
            .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 20px 0; }
            .stat-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
            .stat-label { color: #666; font-size: 14px; }
            .stat-value { font-size: 24px; font-weight: bold; color: #333; margin-top: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background: #16a34a; color: white; padding: 12px; text-align: left; }
            td { padding: 10px; border-bottom: 1px solid #ddd; }
            tr:hover { background: #f9f9f9; }
            .rating { color: #f59e0b; }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>Feedback Report</h1>
          <p>Generated on: ${new Date().toLocaleString()}</p>
          
          <div class="stats">
            <div class="stat-card">
              <div class="stat-label">Total Feedback</div>
              <div class="stat-value">${stats.total}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Average Rating</div>
              <div class="stat-value">${stats.avgRating}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Course Feedback</div>
              <div class="stat-value">${stats.courseCount}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Faculty Feedback</div>
              <div class="stat-value">${stats.facultyCount}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Type</th>
                <th>Subject</th>
                <th>Rating</th>
                <th>Comments</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${feedback.map(f => `
                <tr>
                  <td>${f.studentId?.firstName} ${f.studentId?.lastName}</td>
                  <td>${f.feedbackType}</td>
                  <td>${f.subject || 'General'}</td>
                  <td class="rating">${'★'.repeat(f.rating)}${'☆'.repeat(5 - f.rating)} (${f.rating}/5)</td>
                  <td>${f.comments}</td>
                  <td>${new Date(f.createdAt).toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="no-print" style="margin-top: 20px;">
            <button onclick="window.print()" style="padding: 10px 20px; background: #16a34a; color: white; border: none; border-radius: 5px; cursor: pointer;">Print / Save as PDF</button>
            <button onclick="window.close()" style="padding: 10px 20px; background: #6b7280; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">Close</button>
          </div>
        </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()
  }

  const exportToExcel = () => {
    // Create Excel-compatible content (tab-separated values)
    const excelContent = [
      ['Student Name', 'Email', 'Type', 'Subject', 'Rating', 'Comments', 'Date'].join('\t'),
      ...feedback.map((f) => [
        `${f.studentId?.firstName} ${f.studentId?.lastName}`,
        f.studentId?.email,
        f.feedbackType,
        f.subject || 'General',
        f.rating,
        f.comments,
        new Date(f.createdAt).toLocaleDateString(),
      ].join('\t'))
    ].join('\n')

    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `feedback-report-${new Date().toISOString().split('T')[0]}.xls`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const filteredFeedback = getFilteredFeedback()

  if (loading) {
    return <div className="text-center py-8">Loading feedback report...</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm">Total Feedback</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm">Average Rating</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.avgRating}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm">Course Feedback</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.courseCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm">Faculty Feedback</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.facultyCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Feedback</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student, subject, or comments..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={downloadReport}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm"
            >
              📄 CSV
            </button>
            <button
              onClick={exportToExcel}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium text-sm"
            >
              📊 Excel
            </button>
            <button
              onClick={exportToPDF}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
            >
              📑 PDF
            </button>
          </div>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredFeedback.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              {searchTerm ? 'No feedback found matching your search' : 'No feedback available'}
            </p>
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
                        <span key={i} className={i < item.rating ? 'text-green-600' : 'text-gray-300'}>
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

      {/* Detail Modal */}
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
                      <p className="text-sm font-medium text-gray-700">Type</p>
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
                          <span key={i} className={i < item.rating ? 'text-green-600' : 'text-gray-300'}>
                            ★
                          </span>
                        ))}
                        <span className="ml-2 text-gray-900 font-medium">{item.rating}/5</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Date</p>
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
