'use client'

import { useState, useEffect } from 'react'

export default function AnnouncementManagement() {
    const [announcements, setAnnouncements] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [showForm, setShowForm] = useState(false)

    // Form state
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [visibilityType, setVisibilityType] = useState('all')
    const [department, setDepartment] = useState('')

    const fetchAnnouncements = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('http://localhost:5000/api/announcements/all', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!response.ok) throw new Error('Failed to fetch announcements')

            const data = await response.json()
            setAnnouncements(data)
        } catch (err) {
            setError('Failed to load announcements')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAnnouncements()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const token = localStorage.getItem('token')
            const payload: any = { title, content, visibilityType }
            if (visibilityType === 'department') {
                payload.department = department
            }

            const response = await fetch('http://localhost:5000/api/announcements/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            })

            if (!response.ok) throw new Error('Failed to create announcement')

            const newAnnouncement = await response.json()

            // Refresh list
            fetchAnnouncements()

            // Reset form
            setShowForm(false)
            setTitle('')
            setContent('')
            setVisibilityType('all')
            setDepartment('')
        } catch (err) {
            console.error(err)
            alert('Failed to create announcement')
        }
    }

    if (loading) return <div>Loading announcements...</div>

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Announcements</h2>
                    <p className="text-gray-600 text-sm">Manage institutional announcements</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    {showForm ? 'Cancel' : 'Create Announcement'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-lg shadow-md p-6 border border-blue-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">New Announcement</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={4}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
                                <select
                                    value={visibilityType}
                                    onChange={(e) => setVisibilityType(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">All Users</option>
                                    <option value="faculty">Faculty Only</option>
                                    <option value="student">Students Only</option>
                                    <option value="department">Specific Department</option>
                                </select>
                            </div>

                            {visibilityType === 'department' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Department ID</label>
                                    <input
                                        type="text"
                                        value={department}
                                        onChange={(e) => setDepartment(e.target.value)}
                                        placeholder="Enter Department ID"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                            >
                                Post Announcement
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="space-y-4">
                {announcements.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No announcements found.</p>
                ) : (
                    announcements.map((announcement: any) => (
                        <div key={announcement._id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-gray-900">{announcement.title}</h3>
                                <span className="text-xs text-gray-500">
                                    {new Date(announcement.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-gray-600 mb-3">{announcement.content}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="bg-gray-100 px-2 py-1 rounded">
                                    Visibility: {announcement.visibilityType}
                                </span>
                                <span>By: {announcement.createdBy?.firstName} {announcement.createdBy?.lastName}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
