'use client'

import { useState, useEffect } from 'react'

interface CourseTaught {
    _id: string
    academicYear: string
    semester: string
    courseCode: string
    courseName: string
    courseType: string
    credits: number
    totalStudents: number
    hoursPerWeek: number
    syllabusCompletion: number
    status: string
    createdAt: string
}

export default function CoursesTaught() {
    const [courses, setCourses] = useState<CourseTaught[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        academicYear: '',
        semester: '1',
        courseCode: '',
        courseName: '',
        courseType: 'theory',
        credits: '',
        totalStudents: '',
        hoursPerWeek: '',
        syllabusCompletion: '0',
        status: 'ongoing'
    })

    useEffect(() => {
        fetchCourses()
    }, [])

    const fetchCourses = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('http://localhost:5000/api/faculty-activities/courses', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (response.ok) {
                const data = await response.json()
                setCourses(data)
            }
        } catch (error) {
            console.error('Error fetching courses:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const token = localStorage.getItem('token')

        try {
            const url = editingId
                ? `http://localhost:5000/api/faculty-activities/courses/${editingId}`
                : 'http://localhost:5000/api/faculty-activities/courses'

            const response = await fetch(url, {
                method: editingId ? 'PUT' : 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            if (response.ok) {
                fetchCourses()
                resetForm()
            }
        } catch (error) {
            console.error('Error saving course:', error)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this course?')) return

        const token = localStorage.getItem('token')
        try {
            const response = await fetch(`http://localhost:5000/api/faculty-activities/courses/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (response.ok) {
                fetchCourses()
            }
        } catch (error) {
            console.error('Error deleting course:', error)
        }
    }

    const handleEdit = (course: CourseTaught) => {
        setEditingId(course._id)
        setFormData({
            academicYear: course.academicYear,
            semester: course.semester,
            courseCode: course.courseCode,
            courseName: course.courseName,
            courseType: course.courseType,
            credits: course.credits.toString(),
            totalStudents: course.totalStudents.toString(),
            hoursPerWeek: course.hoursPerWeek.toString(),
            syllabusCompletion: course.syllabusCompletion.toString(),
            status: course.status
        })
        setShowForm(true)
    }

    const resetForm = () => {
        setFormData({
            academicYear: '',
            semester: '1',
            courseCode: '',
            courseName: '',
            courseType: 'theory',
            credits: '',
            totalStudents: '',
            hoursPerWeek: '',
            syllabusCompletion: '0',
            status: 'ongoing'
        })
        setEditingId(null)
        setShowForm(false)
    }

    if (loading) return <div className="text-center py-8">Loading...</div>

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Courses Taught</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                    {showForm ? 'Cancel' : '+ Add Course'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-bold mb-4">{editingId ? 'Edit' : 'Add'} Course</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year *</label>
                                <select
                                    value={formData.academicYear}
                                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                >
                                    <option value="">Select Academic Year</option>
                                    {Array.from({ length: 10 }, (_, i) => {
                                        const year = new Date().getFullYear() - i
                                        return `${year}-${year + 1}`
                                    }).map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Semester *</label>
                                <select
                                    value={formData.semester}
                                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                                        <option key={sem} value={sem}>{sem}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Course Code *</label>
                                <input
                                    type="text"
                                    value={formData.courseCode}
                                    onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Course Name *</label>
                                <input
                                    type="text"
                                    value={formData.courseName}
                                    onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Course Type *</label>
                                <select
                                    value={formData.courseType}
                                    onChange={(e) => setFormData({ ...formData, courseType: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                >
                                    <option value="theory">Theory</option>
                                    <option value="practical">Practical</option>
                                    <option value="project">Project</option>
                                    <option value="elective">Elective</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Credits *</label>
                                <input
                                    type="number"
                                    value={formData.credits}
                                    onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Total Students *</label>
                                <input
                                    type="number"
                                    value={formData.totalStudents}
                                    onChange={(e) => setFormData({ ...formData, totalStudents: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Hours Per Week *</label>
                                <input
                                    type="number"
                                    value={formData.hoursPerWeek}
                                    onChange={(e) => setFormData({ ...formData, hoursPerWeek: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Syllabus Completion (%) *</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={formData.syllabusCompletion}
                                    onChange={(e) => setFormData({ ...formData, syllabusCompletion: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                >
                                    <option value="ongoing">Ongoing</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                            >
                                {editingId ? 'Update' : 'Add'} Course
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

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Academic Year</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Semester</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Students</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Syllabus</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {courses.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                                        No courses added yet. Click "Add Course" to get started.
                                    </td>
                                </tr>
                            ) : (
                                courses.map((course) => (
                                    <tr key={course._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{course.courseName}</div>
                                            <div className="text-xs text-gray-500">{course.courseCode}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{course.academicYear}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">Sem {course.semester}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 capitalize">{course.courseType}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{course.totalStudents}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                                                    <div
                                                        className="bg-green-600 h-2 rounded-full"
                                                        style={{ width: `${course.syllabusCompletion}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm text-gray-900">{course.syllabusCompletion}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs rounded-full ${course.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {course.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(course)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(course._id)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
