'use client'

import { useState, useEffect } from 'react'


export default function AdminFacultyActivities() {
    const [statistics, setStatistics] = useState({
        research: 0,
        courses: 0,
        events: 0,
        institutionalEvents: 0
    })
    const [activities, setActivities] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [activeCategory, setActiveCategory] = useState<'research' | 'courses' | 'events' | 'workshops'>('research')
    const [departments, setDepartments] = useState<any[]>([])
    const [selectedDept, setSelectedDept] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedActivity, setSelectedActivity] = useState<any>(null)

    useEffect(() => {
        fetchInitialData()
    }, [])

    useEffect(() => {
        fetchActivities(activeCategory)
    }, [activeCategory])

    const fetchInitialData = async () => {
        try {
            const token = localStorage.getItem('token')
            const [statsRes, deptRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/faculty-activities/statistics?t=${Date.now()}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/departments/all`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ])

            if (statsRes.ok) setStatistics(await statsRes.json())
            if (deptRes.ok) setDepartments(await deptRes.json())

        } catch (error) {
            console.error('Error fetching initial data:', error)
        }
    }

    const fetchActivities = async (category: string) => {
        setLoading(true)
        try {
            const token = localStorage.getItem('token')
            const endpoints: Record<string, string> = {
                research: '/research',
                courses: '/courses',
                events: '/events',
                workshops: '/institutional-events'
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/faculty-activities${endpoints[category]}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })

            if (response.ok) {
                setActivities(await response.json())
            }
        } catch (error) {
            console.error('Error fetching activities:', error)
        } finally {
            setLoading(false)
        }
    }
    const categories = [
        { id: 'research', label: 'Research', fullLabel: 'Research Publications', count: statistics.research, icon: '📚', color: 'bg-blue-500' },
        { id: 'courses', label: 'Courses', fullLabel: 'Courses Taught', count: statistics.courses, icon: '📖', color: 'bg-green-500' },
        { id: 'events', label: 'Events', fullLabel: 'Events Organized', count: statistics.events, icon: '🎪', color: 'bg-orange-500' },
        { id: 'workshops', label: 'Workshops', fullLabel: 'Conferences & Seminars', count: statistics.institutionalEvents, icon: '🎯', color: 'bg-purple-500' }
    ] as const

    const filteredActivities = activities.filter(item => {
        const matchesDept = selectedDept === 'all' || item.faculty?.department === selectedDept || item.faculty?.department?._id === selectedDept
        const searchLower = searchQuery.toLowerCase()
        const matchesSearch = (
            item.title?.toLowerCase().includes(searchLower) ||
            item.eventName?.toLowerCase().includes(searchLower) ||
            item.courseName?.toLowerCase().includes(searchLower) ||
            item.faculty?.firstName?.toLowerCase().includes(searchLower) ||
            item.faculty?.lastName?.toLowerCase().includes(searchLower)
        )
        return matchesDept && matchesSearch
    })
    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A'
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric', month: 'short', day: 'numeric'
        })
    }

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Faculty Activities</h2>
                    <p className="text-gray-500 text-sm mt-1">Monitor and manage academic contributions across departments</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                        <input
                            type="text"
                            placeholder="Search activities..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full sm:w-64 transition-all"
                        />
                    </div>
                    <select
                        value={selectedDept}
                        onChange={(e) => setSelectedDept(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all cursor-pointer hover:border-gray-300"
                    >
                        <option value="all">All Departments</option>
                        {departments.map(dept => (
                            <option key={dept._id} value={dept._id}>{dept.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Category Pills */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`relative overflow-hidden p-4 rounded-xl text-left transition-all duration-200 ${activeCategory === cat.id
                            ? 'bg-white shadow-lg ring-2 ring-blue-500 ring-offset-2'
                            : 'bg-white shadow hover:shadow-md hover:bg-gray-50'
                            }`}
                    >
                        <div className={`absolute top-0 right-0 p-3 opacity-10`}>
                            <span className="text-4xl">{cat.icon}</span>
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{cat.icon}</span>
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-opacity-10 ${activeCategory === cat.id ? 'text-blue-700 bg-blue-100' : 'text-gray-600 bg-gray-100'
                                }`}>
                                {cat.label}
                            </span>
                        </div>
                        <div className="space-y-1 relative z-10">
                            <p className="text-2xl font-bold text-gray-900">{cat.count}</p>
                            <p className="text-xs text-gray-500 font-medium truncate">{cat.fullLabel}</p>
                        </div>
                        {activeCategory === cat.id && (
                            <div
                                className={`absolute bottom-0 left-0 right-0 h-1 ${cat.color} transition-all duration-300`}
                            />
                        )}
                    </button>
                ))}
            </div>
            {/* Content Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-500">
                        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
                        Loading data...
                    </div>
                ) : filteredActivities.length === 0 ? (
                    <div className="p-16 text-center">
                        <div className="text-4xl mb-4">📭</div>
                        <h3 className="text-lg font-medium text-gray-900">No records found</h3>
                        <p className="text-gray-500 mt-1">Try adjusting your filters or search query</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Faculty</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        {activeCategory === 'courses' ? 'Course Details' : activeCategory === 'events' ? 'Event Name' : 'Title'}
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Details</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date/Year</th>

                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredActivities.map((item, idx) => (
                                    <tr
                                        key={item._id || idx}
                                        className="hover:bg-blue-50/50 transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs">
                                                    {item.faculty?.firstName?.[0]}{item.faculty?.lastName?.[0]}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900 text-sm">
                                                        {item.faculty?.firstName} {item.faculty?.lastName}
                                                    </div>
                                                    <div className="text-xs text-gray-500">{item.faculty?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900 text-sm line-clamp-1">
                                                {item.title || item.eventName || item.courseName}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-0.5">
                                                {item.courseCode || item.eventType || item.publicationType || 'Activity'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {activeCategory === 'research' && (
                                                <span className="truncate max-w-[150px] block" title={item.journalConference}>
                                                    {item.journalConference}
                                                </span>
                                            )}
                                            {activeCategory === 'courses' && (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-green-500" style={{ width: `${item.syllabusCompletion}%` }} />
                                                    </div>
                                                    <span className="text-xs">{item.syllabusCompletion}%</span>
                                                </div>
                                            )}
                                            {(activeCategory === 'events' || activeCategory === 'workshops') && (
                                                <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                                                    {item.participantCount} Participants
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                            {item.publicationDate ? formatDate(item.publicationDate) :
                                                item.eventDate ? formatDate(item.eventDate) :
                                                    item.startDate ? `${formatDate(item.startDate)}` :
                                                        item.academicYear}
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => setSelectedActivity(item)}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal - Simplified for brevity in this view */}
            {/* Modal */}
            {selectedActivity && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div
                        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col transform transition-all duration-300 scale-100 opacity-100"
                    >
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900">Activity Details</h3>
                            <button onClick={() => setSelectedActivity(null)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                                <div className="col-span-2 p-4 bg-gray-50 rounded-lg border border-gray-200 mb-2">
                                    <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Title</div>
                                    <div className="text-gray-900 font-medium text-lg leading-relaxed">{selectedActivity.title || selectedActivity.eventName || selectedActivity.courseName}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 mb-1">Faculty Name</div>
                                    <div className="font-medium">{selectedActivity.faculty?.firstName} {selectedActivity.faculty?.lastName}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 mb-1">Department</div>
                                    <div className="font-medium">{selectedActivity.faculty?.department?.name || selectedActivity.department?.name || 'N/A'}</div>
                                </div>
                                {/* Dynamic Fields based on Category */}
                                {Object.entries(selectedActivity).map(([key, value]) => {
                                    if (['title', 'eventName', 'courseName', 'faculty', '_id', '__v', 'createdAt', 'updatedAt', 'department'].includes(key)) return null;
                                    if (typeof value === 'object' && value !== null) return null; // simplistic filter
                                    return (
                                        <div key={key}>
                                            <div className="text-xs text-gray-500 capitalize mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                                            <div className="font-medium truncate" title={String(value)}>{String(value)}</div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                            <button onClick={() => setSelectedActivity(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition">Close</button>
                            {/* Future: Add Approve/Reject here if API supports it */}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}