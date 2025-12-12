'use client'

import { useState, useEffect } from 'react'

interface TimeSlot {
    subject: string
    faculty: string
    room: string
    type: string
}

interface Timetable {
    _id: string
    semester: string
    academicYear: string
    schedule: {
        Monday: TimeSlot[]
        Tuesday: TimeSlot[]
        Wednesday: TimeSlot[]
        Thursday: TimeSlot[]
        Friday: TimeSlot[]
        Saturday: TimeSlot[]
    }
    timeSlots: { startTime: string; endTime: string }[]
}

export default function AcademicInfo() {
    const [activeTab, setActiveTab] = useState('timetable')
    const [timetable, setTimetable] = useState<Timetable | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchTimetable()
    }, [])

    const fetchTimetable = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('http://localhost:5000/api/timetable', {
                headers: { 'Authorization': `Bearer ${token}` }
            })

            if (response.ok) {
                const data = await response.json()
                if (data.length > 0) {
                    setTimetable(data[0]) // Get the first (most recent) timetable
                }
            }
        } catch (error) {
            console.error('Error fetching timetable:', error)
        } finally {
            setLoading(false)
        }
    }

    const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex space-x-4 border-b border-gray-200 mb-6">
                    <button
                        onClick={() => setActiveTab('timetable')}
                        className={`pb-2 px-4 font-medium transition ${activeTab === 'timetable'
                            ? 'border-b-2 border-orange-600 text-orange-600'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Timetable
                    </button>
                    <button
                        onClick={() => setActiveTab('calendar')}
                        className={`pb-2 px-4 font-medium transition ${activeTab === 'calendar'
                            ? 'border-b-2 border-orange-600 text-orange-600'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Academic Calendar
                    </button>
                </div>

                {activeTab === 'timetable' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900">Weekly Timetable</h3>
                            {timetable && (
                                <div className="text-sm text-gray-600">
                                    {timetable.semester} - {timetable.academicYear}
                                </div>
                            )}
                        </div>

                        {loading ? (
                            <div className="text-center py-8 text-gray-500">Loading timetable...</div>
                        ) : !timetable ? (
                            <div className="text-center py-8 text-gray-500">
                                No timetable available. Please contact your coordinator.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                                            {timetable.timeSlots.map((slot, idx) => (
                                                <th key={idx} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    {slot.startTime} - {slot.endTime}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {DAYS.map((day) => {
                                            const daySchedule = timetable.schedule[day as keyof typeof timetable.schedule]
                                            return (
                                                <tr key={day}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{day}</td>
                                                    {daySchedule && daySchedule.map((slot, idx) => (
                                                        <td key={idx} className="px-6 py-4 text-sm text-gray-500">
                                                            {slot.subject ? (
                                                                <div className="space-y-1">
                                                                    <div className="font-medium text-gray-900">{slot.subject}</div>
                                                                    {slot.faculty && <div className="text-xs text-gray-600">{slot.faculty}</div>}
                                                                    {slot.room && <div className="text-xs text-gray-500">Room: {slot.room}</div>}
                                                                    <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${slot.type === 'Lab' ? 'bg-purple-100 text-purple-700' :
                                                                            slot.type === 'Break' ? 'bg-yellow-100 text-yellow-700' :
                                                                                slot.type === 'Tutorial' ? 'bg-blue-100 text-blue-700' :
                                                                                    'bg-green-100 text-green-700'
                                                                        }`}>
                                                                        {slot.type}
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-400">-</span>
                                                            )}
                                                        </td>
                                                    ))}
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'calendar' && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-900">Academic Calendar</h3>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {[
                                { date: 'Aug 15', event: 'Independence Day', type: 'Holiday' },
                                { date: 'Sep 5', event: 'Teachers Day', type: 'Event' },
                                { date: 'Oct 2', event: 'Gandhi Jayanti', type: 'Holiday' },
                                { date: 'Nov 14', event: 'Childrens Day', type: 'Event' },
                                { date: 'Dec 25', event: 'Christmas', type: 'Holiday' },
                                { date: 'Jan 26', event: 'Republic Day', type: 'Holiday' },
                            ].map((item, index) => (
                                <div key={index} className="p-4 border rounded-lg hover:shadow-md transition bg-gray-50">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-lg text-gray-900">{item.date}</p>
                                            <p className="text-gray-600">{item.event}</p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs rounded-full ${item.type === 'Holiday' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {item.type}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
