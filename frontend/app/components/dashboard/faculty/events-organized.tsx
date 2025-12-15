'use client'

import { useState, useEffect } from 'react'

interface EventOrganized {
    _id: string
    eventName: string
    eventType: string
    eventDate: string
    duration: number
    participantCount: number
    role: string
    description?: string
    reportUrl?: string
    photosUrl?: string[]
    status: string
    department: {
        name: string
        code: string
    }
    createdAt: string
}

export default function EventsOrganized() {
    const [events, setEvents] = useState<EventOrganized[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        eventName: '',
        eventType: 'workshop',
        eventDate: '',
        duration: '',
        participantCount: '',
        role: 'organizer',
        description: '',
        files: [] as File[]
    })

    useEffect(() => {
        fetchEvents()
    }, [])

    const fetchEvents = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/faculty-activities/events`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (response.ok) {
                const data = await response.json()
                setEvents(data)
            }
        } catch (error) {
            console.error('Error fetching events:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const token = localStorage.getItem('token')
        const data = new FormData()

        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'files' && value) {
                (value as File[]).forEach(file => data.append('photos', file))
            } else if (value !== null && value !== '') {
                data.append(key, value.toString())
            }
        })

        try {
            const url = editingId
                ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/faculty-activities/events/${editingId}`
                : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/faculty-activities/events`

            const response = await fetch(url, {
                method: editingId ? 'PUT' : 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: data
            })

            if (response.ok) {
                fetchEvents()
                resetForm()
            }
        } catch (error) {
            console.error('Error saving event:', error)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this event?')) return

        const token = localStorage.getItem('token')
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/faculty-activities/events/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (response.ok) {
                fetchEvents()
            }
        } catch (error) {
            console.error('Error deleting event:', error)
        }
    }

    const handleEdit = (event: EventOrganized) => {
        setEditingId(event._id)
        setFormData({
            eventName: event.eventName,
            eventType: event.eventType,
            eventDate: event.eventDate.split('T')[0],
            duration: event.duration.toString(),
            participantCount: event.participantCount.toString(),
            role: event.role,
            description: event.description || '',
            files: []
        })
        setShowForm(true)
    }

    const resetForm = () => {
        setFormData({
            eventName: '',
            eventType: 'workshop',
            eventDate: '',
            duration: '',
            participantCount: '',
            role: 'organizer',
            description: '',
            files: []
        })
        setEditingId(null)
        setShowForm(false)
    }

    if (loading) return <div className="text-center py-8">Loading...</div>

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Events Organized in Department</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                    {showForm ? 'Cancel' : '+ Add Event'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-bold mb-4">{editingId ? 'Edit' : 'Add'} Event</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Event Name *</label>
                                <input
                                    type="text"
                                    value={formData.eventName}
                                    onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Event Type *</label>
                                <select
                                    value={formData.eventType}
                                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                >
                                    <option value="workshop">Workshop</option>
                                    <option value="seminar">Seminar</option>
                                    <option value="webinar">Webinar</option>
                                    <option value="competition">Competition</option>
                                    <option value="cultural">Cultural Event</option>
                                    <option value="technical">Technical Event</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Your Role *</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                >
                                    <option value="organizer">Organizer</option>
                                    <option value="coordinator">Coordinator</option>
                                    <option value="volunteer">Volunteer</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Event Date *</label>
                                <input
                                    type="date"
                                    value={formData.eventDate}
                                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (hours) *</label>
                                <input
                                    type="number"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Participant Count *</label>
                                <input
                                    type="number"
                                    value={formData.participantCount}
                                    onChange={(e) => setFormData({ ...formData, participantCount: e.target.value })}
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photos (Max 5)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => setFormData({ ...formData, files: Array.from(e.target.files || []) })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                            >
                                {editingId ? 'Update' : 'Add'} Event
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.length === 0 ? (
                    <div className="col-span-full bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
                        No events added yet. Click "Add Event" to get started.
                    </div>
                ) : (
                    events.map((event) => (
                        <div key={event._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                            <div className="flex justify-between items-start mb-3">
                                <span className={`px-3 py-1 text-xs rounded-full ${event.status === 'approved' ? 'bg-green-100 text-green-700' :
                                        event.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                    }`}>
                                    {event.status}
                                </span>
                                <span className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full capitalize">
                                    {event.eventType}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-2">{event.eventName}</h3>

                            <div className="space-y-2 text-sm text-gray-700 mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">Date:</span>
                                    <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">Duration:</span>
                                    <span>{event.duration} hours</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">Participants:</span>
                                    <span>{event.participantCount}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">Role:</span>
                                    <span className="capitalize">{event.role}</span>
                                </div>
                            </div>

                            {event.description && (
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                            )}

                            <div className="mt-4 flex gap-2">
                                <button
                                    onClick={() => handleEdit(event)}
                                    className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(event._id)}
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
