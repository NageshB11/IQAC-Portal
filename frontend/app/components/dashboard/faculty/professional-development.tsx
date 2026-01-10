'use client'

import { useState, useEffect } from 'react'

interface ProfessionalDevelopment {
    _id: string
    title: string
    type: string
    organizer: string
    duration: number
    startDate: string
    endDate: string
    mode: string
    certificateUrl?: string
    description?: string
    status: string
    createdAt: string
}

export default function ProfessionalDevelopment() {
    const [activities, setActivities] = useState<ProfessionalDevelopment[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        title: '',
        type: 'fdp',
        organizer: '',
        duration: '',
        startDate: '',
        endDate: '',
        mode: 'online',
        description: '',
        file: null as File | null
    })

    useEffect(() => {
        fetchActivities()
    }, [])

    const fetchActivities = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/faculty-activities/professional-development`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (response.ok) {
                const data = await response.json()
                setActivities(data)
            }
        } catch (error) {
            console.error('Error fetching activities:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const token = localStorage.getItem('token')
        const data = new FormData()

        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'file' && value) {
                data.append('certificate', value as File)
            } else if (value !== null && value !== '') {
                data.append(key, value.toString())
            }
        })

        try {
            const url = editingId
                ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/faculty-activities/professional-development/${editingId}`
                : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/faculty-activities/professional-development`

            const response = await fetch(url, {
                method: editingId ? 'PUT' : 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: data
            })

            if (response.ok) {
                fetchActivities()
                resetForm()
            }
        } catch (error) {
            console.error('Error saving activity:', error)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this activity?')) return

        const token = localStorage.getItem('token')
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/faculty-activities/professional-development/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (response.ok) {
                fetchActivities()
            }
        } catch (error) {
            console.error('Error deleting activity:', error)
        }
    }

    const handleEdit = (activity: ProfessionalDevelopment) => {
        setEditingId(activity._id)
        setFormData({
            title: activity.title,
            type: activity.type,
            organizer: activity.organizer,
            duration: activity.duration.toString(),
            startDate: activity.startDate.split('T')[0],
            endDate: activity.endDate.split('T')[0],
            mode: activity.mode,
            description: activity.description || '',
            file: null
        })
        setShowForm(true)
    }

    const resetForm = () => {
        setFormData({
            title: '',
            type: 'fdp',
            organizer: '',
            duration: '',
            startDate: '',
            endDate: '',
            mode: 'online',
            description: '',
            file: null
        })
        setEditingId(null)
        setShowForm(false)
    }

    if (loading) return <div className="text-center py-8">Loading...</div>

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Professional Development (FDP/STTP/Training)</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                    {showForm ? 'Cancel' : '+ Add Activity'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-bold mb-4">{editingId ? 'Edit' : 'Add'} Activity</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                >
                                    <option value="fdp">FDP (Faculty Development Program)</option>
                                    <option value="sttp">STTP (Short Term Training Program)</option>
                                    <option value="training">Training</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Mode *</label>
                                <select
                                    value={formData.mode}
                                    onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                >
                                    <option value="online">Online</option>
                                    <option value="offline">Offline</option>
                                    <option value="hybrid">Hybrid</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Organizer *</label>
                                <input
                                    type="text"
                                    value={formData.organizer}
                                    onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                                <input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                                <input
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (days) *</label>
                                <input
                                    type="number"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    rows={3}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Certificate (PDF)</label>
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                            >
                                {editingId ? 'Update' : 'Add'} Activity
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activities.length === 0 ? (
                    <div className="col-span-full bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
                        No activities added yet. Click "Add Activity" to get started.
                    </div>
                ) : (
                    activities.map((activity) => (
                        <div key={activity._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                            <div className="flex justify-between items-start mb-3">

                                <span className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full uppercase">
                                    {activity.type}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-2">{activity.title}</h3>
                            <p className="text-sm text-gray-600 mb-3">{activity.organizer}</p>

                            <div className="space-y-2 text-sm text-gray-700">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">Duration:</span>
                                    <span>{activity.duration} days</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">Mode:</span>
                                    <span className="capitalize">{activity.mode}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">Date:</span>
                                    <span>
                                        {new Date(activity.startDate).toLocaleDateString()} - {new Date(activity.endDate).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            {activity.description && (
                                <p className="mt-3 text-sm text-gray-600 line-clamp-2">{activity.description}</p>
                            )}

                            <div className="mt-4 flex gap-2">
                                <button
                                    onClick={() => handleEdit(activity)}
                                    className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(activity._id)}
                                    className="flex-1 px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
