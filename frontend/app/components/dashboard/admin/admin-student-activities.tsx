'use client'

import { useState, useEffect } from 'react'


export default function AdminStudentActivities() {
    const [stats, setStats] = useState({
        achievements: 0,
        pending: 0,
        approved: 0
    })
    const [activities, setActivities] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')

    useEffect(() => {
        fetchActivities()
    }, [])

    const fetchActivities = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/documents/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })

            if (response.ok) {
                const data = await response.json()
                // Filter for student achievements
                const studentDocs = data.filter((doc: any) =>
                    doc.documentType === 'achievement' &&
                    doc.uploadedBy?.role === 'student'
                )

                setActivities(studentDocs)
                setStats({
                    achievements: studentDocs.length,
                    pending: studentDocs.filter((d: any) => d.status === 'pending').length,
                    approved: studentDocs.filter((d: any) => d.status === 'approved').length
                })
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
                headers: { 'Authorization': `Bearer ${token}` }
            })

            if (response.ok) {
                const blob = await response.blob()
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = title
                document.body.appendChild(a)
                a.click()
                window.URL.revokeObjectURL(url)
                document.body.removeChild(a)
            }
        } catch (error) {
            console.error('Download error:', error)
        }
    }
    const filteredActivities = activities.filter(doc => {
        const matchesStatus = filterStatus === 'all' || doc.status === filterStatus
        const searchLower = searchQuery.toLowerCase()
        const matchesSearch = (
            doc.title?.toLowerCase().includes(searchLower) ||
            doc.uploadedBy?.firstName?.toLowerCase().includes(searchLower) ||
            doc.uploadedBy?.lastName?.toLowerCase().includes(searchLower)
        )
        return matchesStatus && matchesSearch
    })
    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Student Achievements</h2>
                    <p className="text-gray-500 text-sm mt-1">Review and manage student certifications and awards</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                        <input
                            type="text"
                            placeholder="Search students..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none w-full sm:w-64 transition-all"
                        />
                    </div>

                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Total Achievements</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.achievements}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl">🏆</div>
                </div>

            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-500">Loading...</div>
                ) : filteredActivities.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <div className="text-4xl mb-3">📂</div>
                        No achievements found matching your criteria.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Student</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Achievement</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Description</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>

                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredActivities.map((doc, idx) => (
                                    <tr key={doc._id || idx} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs">
                                                    {doc.uploadedBy?.firstName?.[0]}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900 text-sm">
                                                        {doc.uploadedBy?.firstName} {doc.uploadedBy?.lastName}
                                                    </div>
                                                    <div className="text-xs text-gray-500">{doc.uploadedBy?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900 text-sm">{doc.title}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                                            {doc.description}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(doc.createdAt).toLocaleDateString()}
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDownload(doc._id, doc.title)}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline inline-flex items-center gap-1"
                                            >
                                                <span>Download</span>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
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
