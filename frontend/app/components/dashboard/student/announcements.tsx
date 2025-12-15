'use client'

import { useState, useEffect } from 'react'

interface Announcement {
  _id: string
  title: string
  content: string
  createdBy: {
    firstName: string
    lastName: string
  } | null
  createdAt: string
  visibilityType: string
}

export default function StudentAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/announcements/my-announcements`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setAnnouncements(data)
      }
    } catch (error) {
      console.error('Error fetching announcements:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading announcements...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Announcements</h2>
        <p className="text-gray-600 text-sm">Important updates and announcements for you</p>
      </div>

      {announcements.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-gray-600">No announcements available at this time</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div key={announcement._id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{announcement.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Posted by {announcement.createdBy ? `${announcement.createdBy.firstName} ${announcement.createdBy.lastName}` : 'Unknown User'}
                  </p>
                </div>
                <button
                  onClick={() => setExpandedId(expandedId === announcement._id ? null : announcement._id)}
                  className="text-orange-600 hover:text-orange-700 font-medium text-sm ml-4"
                >
                  {expandedId === announcement._id ? 'Hide' : 'Read'}
                </button>
              </div>

              {expandedId === announcement._id && (
                <div className="mt-4">
                  <p className="text-gray-700 mb-4 leading-relaxed">{announcement.content}</p>
                  <p className="text-gray-500 text-sm">
                    {new Date(announcement.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
