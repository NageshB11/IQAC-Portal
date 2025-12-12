'use client'

import { useState, useEffect } from 'react'

export default function StudentActivitiesView() {
    const [activities, setActivities] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('achievement') // 'achievement' or 'career'

    useEffect(() => {
        fetchActivities()
    }, [])

    const fetchActivities = async () => {
        try {
            const token = localStorage.getItem('token')
            const userRole = localStorage.getItem('userRole')

            let endpoint = ''
            if (userRole === 'coordinator') {
                endpoint = 'http://localhost:5000/api/documents/department'
            } else if (userRole === 'admin') {
                endpoint = 'http://localhost:5000/api/documents/all'
            } else {
                return // Should not happen
            }

            const response = await fetch(endpoint, {
                headers: { 'Authorization': `Bearer ${token}` }
            })

            if (response.ok) {
                const data = await response.json()
                // Filter for student activities only
                const studentDocs = data.filter((doc: any) =>
                    (doc.documentType === 'achievement' || doc.documentType === 'career') &&
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
            const response = await fetch(`http://localhost:5000/api/documents/${docId}/download`, {
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

    const filteredActivities = activities.filter(doc => doc.documentType === activeTab)

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Student Activities Overview</h2>

            {/* Tabs */}
            <div className="flex space-x-4 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('achievement')}
                    className={`pb-2 px-4 font-medium transition ${activeTab === 'achievement'
                        ? 'border-b-2 border-green-600 text-green-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Achievements
                </button>
                <button
                    onClick={() => setActiveTab('career')}
                    className={`pb-2 px-4 font-medium transition ${activeTab === 'career'
                        ? 'border-b-2 border-green-600 text-green-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Career Progression
                </button>
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg shadow-md p-6">
                {loading ? (
                    <div className="text-center py-8">Loading...</div>
                ) : filteredActivities.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No {activeTab === 'achievement' ? 'achievements' : 'career records'} found
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
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Document</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredActivities.map((doc: any) => (
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
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 text-xs rounded-full ${doc.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                doc.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                {doc.status}
                                            </span>
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
