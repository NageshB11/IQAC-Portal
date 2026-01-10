'use client'

import { Award, Plus, Search, Filter, X } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function RecordAchievement() {
    const [showForm, setShowForm] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [achievements, setAchievements] = useState<any[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [formData, setFormData] = useState({
        year: '',
        awardName: '',
        teamOrIndividual: '',
        level: '',
        sportsOrCultural: '',
        activityName: '',
        studentName: ''
    })

    const fetchAchievements = async () => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/sports/achievements`, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (response.ok) {
                const data = await response.json()
                setAchievements(data)
            }
        } catch (error) {
            console.error('Error fetching achievements:', error)
        }
    }

    // Fetch achievements on load
    useEffect(() => {
        fetchAchievements()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        try {
            const token = localStorage.getItem('token')
            if (!token) {
                setMessage('❌ You must be logged in to record achievements')
                setLoading(false)
                return
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/sports/achievements`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (response.ok) {
                setMessage('✅ Achievement recorded successfully!')
                setFormData({
                    year: '',
                    awardName: '',
                    teamOrIndividual: '',
                    level: '',
                    sportsOrCultural: '',
                    activityName: '',
                    studentName: ''
                })
                setShowForm(false)
                fetchAchievements() // Refresh list
                setTimeout(() => setMessage(''), 3000)
            } else {
                setMessage(`❌ ${data.message || 'Failed to record achievement.'}`)
            }
        } catch (error) {
            console.error('❌ Error recording achievement:', error)
            setMessage('⚠️ Network error. Please check server.')
        } finally {
            setLoading(false)
        }
    }

    // Filter achievements based on search query
    const filteredAchievements = achievements.filter(item =>
        item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.awardName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.year.includes(searchQuery)
    )

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Record Achievements</h2>
                    <p className="text-gray-600">Log sports and cultural achievements for reporting</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-lg transition-all shadow-lg font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Log Achievement
                </button>
            </div>

            {message && (
                <div className={`p-4 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message}
                </div>
            )}

            {/* Achievement Form Modal - Same as before */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Record New Achievement</h3>
                                <p className="text-sm text-gray-500 mt-1">This data will be used for admin reports</p>
                            </div>
                            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Form fields same as before... re-using logic */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                                <input type="text" name="year" value={formData.year} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g., 2024 or 2023-24" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Name of the Award / Medal *</label>
                                <input type="text" name="awardName" value={formData.awardName} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g., Gold Medal" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Team / Individual *</label>
                                <select name="teamOrIndividual" value={formData.teamOrIndividual} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                                    <option value="">Select type</option>
                                    <option value="Individual">Individual</option>
                                    <option value="Team">Team</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">University / State / National / International *</label>
                                <select name="level" value={formData.level} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                                    <option value="">Select level</option>
                                    <option value="University">University</option>
                                    <option value="State">State</option>
                                    <option value="National">National</option>
                                    <option value="International">International</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Activity Name *</label>
                                <input type="text" name="activityName" value={formData.activityName} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g., Football, Cricket, Dance, Singing" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Sports / Cultural *</label>
                                <select name="sportsOrCultural" value={formData.sportsOrCultural} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                                    <option value="">Select category</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Cultural">Cultural</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Name of the Student *</label>
                                <input type="text" name="studentName" value={formData.studentName} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g., Rahul Sharma" />
                            </div>
                            <div className="flex gap-3 pt-4 border-t">
                                <button type="submit" disabled={loading} className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-lg transition font-medium disabled:bg-gray-400">{loading ? 'Recording...' : 'Record Achievement'}</button>
                                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by student name, award, or year..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>
            </div>

            {/* List View */}
            {filteredAchievements.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12">
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="text-5xl mb-3">🏆</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Achievements Found</h3>
                        <p className="text-gray-500 max-w-md mb-2">Start recording achievements or adjust your search.</p>
                        <button onClick={() => setShowForm(true)} className="mt-4 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-lg transition-all shadow-lg font-medium">
                            <Plus className="w-5 h-5" /> Record Achievement
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b-2 border-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Year</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Award / Medal</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Level</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Student Name</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredAchievements.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">{item.year}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{item.awardName}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{item.teamOrIndividual}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                                ${item.level === 'International' ? 'bg-purple-100 text-purple-700' :
                                                    item.level === 'National' ? 'bg-blue-100 text-blue-700' :
                                                        item.level === 'State' ? 'bg-green-100 text-green-700' :
                                                            'bg-gray-100 text-gray-700'}`}>
                                                {item.level}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900">{item.activityName}</span>
                                                <span className={`text-xs ${item.sportsOrCultural === 'Sports' ? 'text-orange-600' : 'text-pink-600'}`}>
                                                    ({item.sportsOrCultural})
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{item.studentName}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}
