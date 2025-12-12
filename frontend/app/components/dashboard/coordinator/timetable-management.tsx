'use client'

import { useState, useEffect } from 'react'

interface TimeSlot {
    subject: string
    faculty: string
    room: string
    type: 'Lecture' | 'Lab' | 'Tutorial' | 'Break' | 'Library' | 'Other'
}

interface Timetable {
    _id?: string
    department: any
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
    createdAt?: string
    updatedAt?: string
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const DEFAULT_TIME_SLOTS = [
    { startTime: '09:00', endTime: '10:00' },
    { startTime: '10:00', endTime: '11:00' },
    { startTime: '11:00', endTime: '12:00' },
    { startTime: '12:00', endTime: '13:00' },
    { startTime: '14:00', endTime: '15:00' },
    { startTime: '15:00', endTime: '16:00' }
]

export default function TimetableManagement() {
    const [timetables, setTimetables] = useState<Timetable[]>([])
    const [loading, setLoading] = useState(true)
    const [editMode, setEditMode] = useState(false)
    const [selectedTimetable, setSelectedTimetable] = useState<Timetable | null>(null)
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState<'success' | 'error'>('success')

    // Form state
    const [semester, setSemester] = useState('')
    const [academicYear, setAcademicYear] = useState('')
    const [schedule, setSchedule] = useState<Timetable['schedule']>({
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: []
    })
    const [timeSlots, setTimeSlots] = useState(DEFAULT_TIME_SLOTS)

    useEffect(() => {
        fetchTimetables()
    }, [])

    const fetchTimetables = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('http://localhost:5000/api/timetable', {
                headers: { 'Authorization': `Bearer ${token}` }
            })

            if (response.ok) {
                const data = await response.json()
                setTimetables(data)
            }
        } catch (error) {
            console.error('Error fetching timetables:', error)
            showMessage('Failed to fetch timetables', 'error')
        } finally {
            setLoading(false)
        }
    }

    const showMessage = (msg: string, type: 'success' | 'error') => {
        setMessage(msg)
        setMessageType(type)
        setTimeout(() => setMessage(''), 5000)
    }

    const initializeSchedule = () => {
        const newSchedule: Timetable['schedule'] = {
            Monday: [],
            Tuesday: [],
            Wednesday: [],
            Thursday: [],
            Friday: [],
            Saturday: []
        }

        DAYS.forEach(day => {
            newSchedule[day as keyof typeof newSchedule] = timeSlots.map(() => ({
                subject: '',
                faculty: '',
                room: '',
                type: 'Lecture' as const
            }))
        })

        setSchedule(newSchedule)
    }

    const handleCreateNew = () => {
        setEditMode(true)
        setSelectedTimetable(null)
        setSemester('')
        setAcademicYear('')
        initializeSchedule()
    }

    const handleEdit = (timetable: Timetable) => {
        setEditMode(true)
        setSelectedTimetable(timetable)
        setSemester(timetable.semester)
        setAcademicYear(timetable.academicYear)
        setSchedule(timetable.schedule)
        setTimeSlots(timetable.timeSlots)
    }

    const handleSlotChange = (day: string, slotIndex: number, field: keyof TimeSlot, value: string) => {
        setSchedule(prev => ({
            ...prev,
            [day]: prev[day as keyof typeof prev].map((slot, idx) =>
                idx === slotIndex ? { ...slot, [field]: value } : slot
            )
        }))
    }

    const handleSave = async () => {
        if (!semester || !academicYear) {
            showMessage('Please fill in semester and academic year', 'error')
            return
        }

        try {
            const token = localStorage.getItem('token')
            const url = selectedTimetable
                ? `http://localhost:5000/api/timetable/${selectedTimetable._id}`
                : 'http://localhost:5000/api/timetable/create'

            const method = selectedTimetable ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    semester,
                    academicYear,
                    schedule,
                    timeSlots
                })
            })

            const data = await response.json()

            if (response.ok) {
                showMessage(data.message || 'Timetable saved successfully', 'success')
                setEditMode(false)
                fetchTimetables()
            } else {
                showMessage(data.message || 'Failed to save timetable', 'error')
            }
        } catch (error) {
            console.error('Error saving timetable:', error)
            showMessage('Failed to save timetable', 'error')
        }
    }

    const handleCancel = () => {
        setEditMode(false)
        setSelectedTimetable(null)
    }

    if (loading) {
        return <div className="text-center py-8">Loading timetables...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Timetable Management</h2>
                {!editMode && (
                    <button
                        onClick={handleCreateNew}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                    >
                        + Create New Timetable
                    </button>
                )}
            </div>

            {message && (
                <div className={`p-4 rounded-lg ${messageType === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message}
                </div>
            )}

            {!editMode ? (
                <div className="space-y-4">
                    {timetables.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
                            No timetables found. Create one to get started.
                        </div>
                    ) : (
                        timetables.map(timetable => (
                            <div key={timetable._id} className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {timetable.semester} - {timetable.academicYear}
                                        </h3>
                                        <p className="text-gray-600">
                                            Department: {timetable.department?.name || 'N/A'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleEdit(timetable)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                                    >
                                        Edit
                                    </button>
                                </div>
                                <div className="text-sm text-gray-500">
                                    Last updated: {new Date(timetable.updatedAt || timetable.createdAt || Date.now()).toLocaleDateString()}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                        {selectedTimetable ? 'Edit Timetable' : 'Create New Timetable'}
                    </h3>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Semester <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={semester}
                                onChange={(e) => setSemester(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">Select Semester</option>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                                    <option key={sem} value={`Semester ${sem}`}>Semester {sem}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Academic Year <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={academicYear}
                                onChange={(e) => setAcademicYear(e.target.value)}
                                placeholder="e.g., 2024-2025"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2 bg-gray-50 text-left font-medium text-gray-700">
                                        Day / Time
                                    </th>
                                    {timeSlots.map((slot, idx) => (
                                        <th key={idx} className="border border-gray-300 px-4 py-2 bg-gray-50 text-center font-medium text-gray-700">
                                            {slot.startTime} - {slot.endTime}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {DAYS.map(day => (
                                    <tr key={day}>
                                        <td className="border border-gray-300 px-4 py-2 font-medium text-gray-900 bg-gray-50">
                                            {day}
                                        </td>
                                        {schedule[day as keyof typeof schedule].map((slot, slotIdx) => (
                                            <td key={slotIdx} className="border border-gray-300 p-2">
                                                <div className="space-y-1">
                                                    <input
                                                        type="text"
                                                        value={slot.subject}
                                                        onChange={(e) => handleSlotChange(day, slotIdx, 'subject', e.target.value)}
                                                        placeholder="Subject"
                                                        className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={slot.faculty}
                                                        onChange={(e) => handleSlotChange(day, slotIdx, 'faculty', e.target.value)}
                                                        placeholder="Faculty"
                                                        className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={slot.room}
                                                        onChange={(e) => handleSlotChange(day, slotIdx, 'room', e.target.value)}
                                                        placeholder="Room"
                                                        className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                                                    />
                                                    <select
                                                        value={slot.type}
                                                        onChange={(e) => handleSlotChange(day, slotIdx, 'type', e.target.value)}
                                                        className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                                                    >
                                                        <option value="Lecture">Lecture</option>
                                                        <option value="Lab">Lab</option>
                                                        <option value="Tutorial">Tutorial</option>
                                                        <option value="Break">Break</option>
                                                        <option value="Library">Library</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                        >
                            Save Timetable
                        </button>
                        <button
                            onClick={handleCancel}
                            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
