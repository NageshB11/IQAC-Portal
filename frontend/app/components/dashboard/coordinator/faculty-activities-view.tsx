'use client'

import { useState, useEffect } from 'react'

export default function FacultyActivitiesView() {
    const [statistics, setStatistics] = useState({
        research: 0,
        courses: 0,
        events: 0,
        institutionalEvents: 0
    })
    const [activities, setActivities] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [activeCategory, setActiveCategory] = useState('research')

    useEffect(() => {
        fetchStatistics()
        fetchActivities(activeCategory)
    }, [activeCategory])

    const fetchStatistics = async () => {
        try {
            const token = localStorage.getItem('token')
            // Add timestamp to prevent caching
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/faculty-activities/statistics?t=${new Date().getTime()}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            })
            if (response.ok) {
                const data = await response.json()
                setStatistics(data)
            }
        } catch (error) {
            console.error('Error fetching statistics:', error)
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

            const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/faculty-activities${endpoints[category]}`;
            console.log('🔍 Fetching activities:', category);
            console.log('  URL:', url);
            console.log('  Has token:', !!token);

            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            })

            console.log('  Response status:', response.status);

            if (response.ok) {
                const data = await response.json()
                console.log('  Data received:', data.length, 'items');
                if (category === 'workshops') {
                    console.log('  Sample workshop:', data[0]);
                }
                setActivities(data)
            } else {
                console.error('  API error:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error fetching activities:', error)
        } finally {
            setLoading(false)
        }
    }

    const categories = [
        { id: 'research', label: 'Research Publications', count: statistics.research, icon: '📚' },
        { id: 'courses', label: 'Courses Taught', count: statistics.courses, icon: '📖' },
        { id: 'events', label: 'Events Organized', count: statistics.events, icon: '🎪' },
        { id: 'workshops', label: 'Workshops/Seminars/Conferences', count: statistics.institutionalEvents, icon: '🎯' }
    ]

    const [selectedActivity, setSelectedActivity] = useState<any>(null)

    // Helper to format date
    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A'
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    // Modal Component
    const ActivityDetailsModal = ({ activity, onClose }: { activity: any, onClose: () => void }) => {
        if (!activity) return null

        const renderField = (label: string, value: any) => (
            <div className="mb-4">
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="text-base text-gray-900">{value || 'N/A'}</p>
            </div>
        )

        const renderContent = () => {
            switch (activeCategory) {
                case 'research':
                    return (
                        <>
                            {renderField('Title', activity.title)}
                            {renderField('Authors', activity.authors)}
                            {renderField('Journal/Conference', activity.journalConference)}
                            {renderField('Type', activity.publicationType)}
                            {renderField('Publication Date', formatDate(activity.publicationDate))}
                            {renderField('DOI', activity.doi)}
                            {renderField('ISSN', activity.issn)}
                            {renderField('ISBN', activity.isbn)}
                            {renderField('Impact Factor', activity.impactFactor)}
                            {renderField('Indexing', activity.indexing?.join(', '))}
                            {renderField('Citation Count', activity.citationCount)}
                            {renderField('Document URL', activity.documentUrl && <a href={activity.documentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Document</a>)}
                        </>
                    )

                case 'courses':
                    return (
                        <>
                            {renderField('Course Name', activity.courseName)}
                            {renderField('Course Code', activity.courseCode)}
                            {renderField('Academic Year', activity.academicYear)}
                            {renderField('Semester', activity.semester)}
                            {renderField('Course Type', activity.courseType)}
                            {renderField('Credits', activity.credits)}
                            {renderField('Total Students', activity.totalStudents)}
                            {renderField('Hours Per Week', activity.hoursPerWeek)}
                            {renderField('Syllabus Completion', `${activity.syllabusCompletion}%`)}
                        </>
                    )
                case 'events':
                    return (
                        <>
                            {renderField('Event Name', activity.eventName)}
                            {renderField('Event Type', activity.eventType)}
                            {renderField('Date', formatDate(activity.eventDate))}
                            {renderField('Duration (Hours)', activity.duration)}
                            {renderField('Participant Count', activity.participantCount)}
                            {renderField('Role', activity.role)}
                            {renderField('Description', activity.description)}
                            {renderField('Report URL', activity.reportUrl && <a href={activity.reportUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Report</a>)}
                        </>
                    )
                case 'workshops':
                    return (
                        <>
                            {renderField('Event Name', activity.eventName)}
                            {renderField('Event Type', activity.eventType?.toUpperCase())}
                            {renderField('Academic Year', activity.academicYear)}
                            {renderField('Start Date', formatDate(activity.startDate))}
                            {renderField('End Date', formatDate(activity.endDate))}
                            {renderField('Participant Count', activity.participantCount)}
                            {renderField('Department', activity.department?.name)}
                            {renderField('Description', activity.description)}
                            {renderField('Activity Report', activity.activityReportUrl && <a href={activity.activityReportUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Report</a>)}
                        </>
                    )

                default:
                    return null
            }
        }

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
                        <h3 className="text-xl font-bold text-gray-900">Activity Details</h3>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {renderField('Faculty', `${activity.faculty?.firstName} ${activity.faculty?.lastName}`)}
                            {renderField('Status', (
                                <span className={`px-2 py-1 text-xs rounded-full uppercase ${activity.status === 'approved' ? 'bg-green-100 text-green-700' :
                                    activity.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                    {activity.status}
                                </span>
                            ))}
                        </div>
                        <hr className="my-4" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {renderContent()}
                        </div>
                    </div>
                    <div className="p-6 border-t bg-gray-50 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Faculty Activities Overview</h2>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {categories.map(cat => (
                    <div
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`cursor-pointer rounded-lg shadow-md p-6 transition ${activeCategory === cat.id
                            ? 'bg-purple-600 text-white'
                            : 'bg-white text-gray-900 hover:shadow-lg'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm ${activeCategory === cat.id ? 'opacity-90' : 'text-gray-600'}`}>
                                    {cat.label}
                                </p>
                                <p className="text-3xl font-bold mt-2">{cat.count}</p>
                            </div>
                            <div className="text-4xl opacity-80">{cat.icon}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Activity List */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-4">
                    {categories.find(c => c.id === activeCategory)?.label}
                </h3>

                {loading ? (
                    <div className="text-center py-8">Loading...</div>
                ) : activities.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No {categories.find(c => c.id === activeCategory)?.label.toLowerCase()} found
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        {activeCategory === 'research' && (
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Faculty</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Journal/Conference</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {activities.map((item: any) => (
                                        <tr
                                            key={item._id}
                                            onClick={() => setSelectedActivity(item)}
                                            className="hover:bg-gray-50 cursor-pointer transition"
                                        >
                                            <td className="px-4 py-3 text-sm">
                                                {item.faculty?.firstName} {item.faculty?.lastName}
                                            </td>
                                            <td className="px-4 py-3 text-sm font-medium">{item.title}</td>
                                            <td className="px-4 py-3 text-sm capitalize">{item.publicationType}</td>
                                            <td className="px-4 py-3 text-sm">{item.journalConference}</td>
                                            <td className="px-4 py-3 text-sm">
                                                {new Date(item.publicationDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 text-xs rounded-full ${item.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                    item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}



                        {activeCategory === 'courses' && (
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Faculty</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Academic Year</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Semester</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Students</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Syllabus</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {activities.map((item: any) => (
                                        <tr
                                            key={item._id}
                                            onClick={() => setSelectedActivity(item)}
                                            className="hover:bg-gray-50 cursor-pointer transition"
                                        >
                                            <td className="px-4 py-3 text-sm">
                                                {item.faculty?.firstName} {item.faculty?.lastName}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <div className="font-medium">{item.courseName}</div>
                                                <div className="text-xs text-gray-500">{item.courseCode}</div>
                                            </td>
                                            <td className="px-4 py-3 text-sm">{item.academicYear}</td>
                                            <td className="px-4 py-3 text-sm">Sem {item.semester}</td>
                                            <td className="px-4 py-3 text-sm">{item.totalStudents}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[80px]">
                                                        <div
                                                            className="bg-green-600 h-2 rounded-full"
                                                            style={{ width: `${item.syllabusCompletion}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm">{item.syllabusCompletion}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {activeCategory === 'events' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {activities.map((item: any) => (
                                    <div
                                        key={item._id}
                                        onClick={() => setSelectedActivity(item)}
                                        className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`px-2 py-1 text-xs rounded-full ${item.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                {item.status}
                                            </span>
                                            <span className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full capitalize">
                                                {item.eventType}
                                            </span>
                                        </div>
                                        <h4 className="font-bold mb-1">{item.eventName}</h4>
                                        <p className="text-xs text-gray-500 mb-2">
                                            {item.faculty?.firstName} {item.faculty?.lastName} - {item.role}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {new Date(item.eventDate).toLocaleDateString()} • {item.duration} hours • {item.participantCount} participants
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeCategory === 'workshops' && (
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Event Name</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Participants</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {activities.map((item: any) => (
                                        <tr
                                            key={item._id}
                                            onClick={() => setSelectedActivity(item)}
                                            className="hover:bg-gray-50 cursor-pointer transition"
                                        >
                                            <td className="px-4 py-3 text-sm font-medium">{item.eventName}</td>
                                            <td className="px-4 py-3">
                                                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full uppercase">
                                                    {item.eventType}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm">{item.academicYear}</td>
                                            <td className="px-4 py-3 text-sm">
                                                {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3 text-sm">{item.participantCount}</td>
                                            <td className="px-4 py-3 text-sm">{item.department?.name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}


                    </div>
                )}
            </div>

            {/* Details Modal */}
            {selectedActivity && (
                <ActivityDetailsModal
                    activity={selectedActivity}
                    onClose={() => setSelectedActivity(null)}
                />
            )}
        </div>
    )
}
