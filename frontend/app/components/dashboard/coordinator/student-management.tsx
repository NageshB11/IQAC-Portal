'use client'

import { useState, useEffect } from 'react'

export default function StudentManagement() {
    const [students, setStudents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [selectedStudent, setSelectedStudent] = useState<any>(null)

    const handleViewStudent = (student: any) => {
        setSelectedStudent(student)
    }

    useEffect(() => {
        fetchStudents()
    }, [])

    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem('token')

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/department-students`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to fetch students')
            }

            const data = await response.json()
            setStudents(data)
        } catch (err: any) {
            setError(err.message || 'Failed to load students')
            console.error('Fetch students error:', err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div>Loading students...</div>
    if (error) return <div className="text-red-600">{error}</div>

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Student Management</h2>
                    <p className="text-gray-600 text-sm">View students in your department</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-100 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Enrollment No.</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Contact</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {students.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                    No students found in your department
                                </td>
                            </tr>
                        ) : (
                            students.map((s) => (
                                <tr key={s._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                        {s.firstName} {s.lastName}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{s.enrollmentNumber || 'N/A'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{s.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{s.phoneNumber || 'N/A'}</td>
                                    <td className="px-6 py-4 text-sm space-x-2">
                                        <button
                                            onClick={() => handleViewStudent(s)}
                                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Student Details Modal */}
            {selectedStudent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-lg w-full">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Student Details</h3>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                                {selectedStudent.photo ? (
                                    <img src={selectedStudent.photo} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-2xl text-gray-400">👤</span>
                                )}
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-gray-900">{selectedStudent.firstName} {selectedStudent.lastName}</h4>
                                <p className="text-gray-500">{selectedStudent.email}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-600">Enrollment Number</p>
                                <p className="font-medium text-gray-900">{selectedStudent.enrollmentNumber || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Phone Number</p>
                                <p className="font-medium text-gray-900">{selectedStudent.phoneNumber || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Address</p>
                                <p className="font-medium text-gray-900">{selectedStudent.address || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setSelectedStudent(null)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
