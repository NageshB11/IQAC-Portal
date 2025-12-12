'use client'

import { useState } from 'react'

interface CreateAnnouncementProps {
  userDepartment: string
  onAnnouncementCreated: () => void
}

export default function CreateAnnouncement({ userDepartment, onAnnouncementCreated }: CreateAnnouncementProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    visibilityType: 'department'
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      const userData = user ? JSON.parse(user) : null

      const response = await fetch('/api/announcements/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          department: userData?.department
        })
      })

      if (response.ok) {
        setMessage('Announcement created successfully!')
        setFormData({ title: '', content: '', visibilityType: 'department' })
        setTimeout(() => {
          setIsOpen(false)
          onAnnouncementCreated()
        }, 1500)
      } else {
        setMessage('Failed to create announcement')
      }
    } catch (error) {
      setMessage('Error creating announcement')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium"
      >
        + Create Announcement
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center border-b p-6">
              <h2 className="text-xl font-bold text-gray-900">Create New Announcement</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Announcement title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Write your announcement here..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Announce To</label>
                <select
                  value={formData.visibilityType}
                  onChange={(e) => setFormData({ ...formData, visibilityType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="department">Faculty in My Department</option>
                  <option value="student">All Students</option>
                  <option value="faculty">All Faculty</option>
                  <option value="all">Everyone</option>
                </select>
              </div>

              {message && (
                <div className={`p-4 rounded-lg text-sm ${
                  message.includes('success') 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {message}
                </div>
              )}

              <div className="flex gap-3 justify-end pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 font-medium"
                >
                  {loading ? 'Creating...' : 'Create Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
