'use client'

import { useState } from 'react'

export default function SendNotice() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    visibilityType: 'faculty',
  })
  const [notices, setNotices] = useState([
    { id: 1, title: 'IQAC Meeting Schedule', date: '2024-01-15', visibility: 'Faculty' },
    { id: 2, title: 'Document Submission Deadline', date: '2024-01-10', visibility: 'Faculty' },
  ])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newNotice = {
      id: notices.length + 1,
      title: formData.title,
      date: new Date().toISOString().split('T')[0],
      visibility: formData.visibilityType.charAt(0).toUpperCase() + formData.visibilityType.slice(1),
    }
    setNotices([newNotice, ...notices])
    setFormData({ title: '', content: '', visibilityType: 'faculty' })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Send Notice</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Notice title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={6}
                  placeholder="Notice content"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Send To</label>
                <select
                  name="visibilityType"
                  value={formData.visibilityType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="faculty">Faculty</option>
                  <option value="all">All Staff & Faculty</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
              >
                Send Notice
              </button>
            </form>
          </div>
        </div>

        {/* Recent Notices */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Notices</h2>
          <div className="space-y-3">
            {notices.map((notice) => (
              <div key={notice.id} className="border-l-4 border-green-600 pl-4 py-2">
                <p className="font-medium text-gray-900 text-sm">{notice.title}</p>
                <p className="text-xs text-gray-600">{notice.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
