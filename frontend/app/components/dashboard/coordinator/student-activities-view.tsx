'use client'

import { useState, useEffect } from 'react'

export default function StudentActivitiesView() {
    const [activities, setActivities] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchActivities()
    }, [])

    const fetchActivities = async () => {
        try {
            const token = localStorage.getItem('token')
            const userRole = localStorage.getItem('userRole')

            let endpoint = ''
            if (userRole === 'coordinator') {
                endpoint = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/documents/department`
            } else if (userRole === 'admin') {
                endpoint = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/documents/all`
            } else {
                return // Should not happen
            }

            const response = await fetch(endpoint, {
                headers: { 'Authorization': `Bearer ${token}` }
            })

            if (response.ok) {
                const data = await response.json()
                // Filter for student activities only (achievements)
                const studentDocs = data.filter((doc: any) =>
                    doc.documentType === 'achievement' &&
                    doc.uploadedBy?.role === 'student'
                )
                setActivities(studentDocs)
            }
        } catch (error) {
            console.error('Error fetching student activities:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDownload = async (docId: string, title: string) => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/documents/${docId}/download`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!response.ok) throw new Error('Failed to download document')

            // Create blob from response
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = title || 'document'
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
        } catch (err) {
            console.error(err)
            alert('Failed to download document')
        }
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Student Activities Overview</h2>

            {/* Content */}
            <div className="bg-white rounded-lg shadow-md p-6">
                {loading ? (
                    <div className="text-center py-8">Loading...</div>
                ) : activities.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No achievements found
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>

                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Document</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {activities.map((doc: any) => (
                                    <tr key={doc._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm">
                                            <div className="font-medium">
                                                {doc.uploadedBy?.firstName} {doc.uploadedBy?.lastName}
                                            </div>
                                            <div className="text-xs text-gray-500">{doc.uploadedBy?.email}</div>
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium">{doc.title}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{doc.description}</td>
                                        <td className="px-4 py-3 text-sm">
                                            {new Date(doc.createdAt).toLocaleDateString()}
                                        </td>

                                        <td className="px-4 py-3 text-sm">
                                            <button
                                                onClick={() => handleDownload(doc._id, doc.title)}
                                                className="text-blue-600 hover:underline cursor-pointer"
                                            >
                                                Download
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
