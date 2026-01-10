'use client'

import { useState, useEffect } from 'react'
import { Trophy, Calendar, Award, Download } from 'lucide-react'

export default function AdminSportsActivities() {
    const [achievements, setAchievements] = useState<any[]>([])
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [activeView, setActiveView] = useState('achievements')

    useEffect(() => {
        fetchSportsData()
    }, [])

    const fetchSportsData = async () => {
        try {
            const token = localStorage.getItem('token')

            // Fetch achievements
            const achievementsRes = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/sports/achievements`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )

            // Fetch events
            const eventsRes = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/sports/events`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )

            if (achievementsRes.ok) {
                const data = await achievementsRes.json()
                setAchievements(data)
            }

            if (eventsRes.ok) {
                const data = await eventsRes.json()
                setEvents(data)
            }

            setLoading(false)
        } catch (error) {
            console.error('Error fetching sports data:', error)
            setLoading(false)
        }
    }

    if (loading) {
        return <div className="flex items-center justify-center h-64"><div className="text-lg">Loading sports data...</div></div>
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">Total Achievements</p>
                            <p className="text-4xl font-bold mt-2">{achievements.length}</p>
                        </div>
                        <Trophy className="w-12 h-12 opacity-80" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">Scheduled Events</p>
                            <p className="text-4xl font-bold mt-2">{events.length}</p>
                        </div>
                        <Calendar className="w-12 h-12 opacity-80" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">Sports Categories</p>
                            <p className="text-4xl font-bold mt-2">
                                {new Set(achievements.map(a => a.sportsOrCultural)).size}
                            </p>
                        </div>
                        <Award className="w-12 h-12 opacity-80" />
                    </div>
                </div>
            </div>

            {/* View Toggle */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveView('achievements')}
                        className={`px-4 py-2 rounded-lg font-medium transition ${activeView === 'achievements'
                                ? 'bg-orange-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        🏆 Achievements ({achievements.length})
                    </button>
                    <button
                        onClick={() => setActiveView('events')}
                        className={`px-4 py-2 rounded-lg font-medium transition ${activeView === 'events'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        📅 Events ({events.length})
                    </button>
                </div>

                {/* Achievements View */}
                {activeView === 'achievements' && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Sports Achievements</h3>
                            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                                <Download className="w-4 h-4" />
                                Export to Excel
                            </button>
                        </div>

                        {achievements.length === 0 ? (
                            <div className="text-center py-12">
                                <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">No achievements recorded yet</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                                        <tr>
                                            <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Year</th>
                                            <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Award/Medal</th>
                                            <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Team/Individual</th>
                                            <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Level</th>
                                            <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Category</th>
                                            <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Student Name</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {achievements.map((achievement, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900">{achievement.year}</td>
                                                <td className="px-4 py-3 text-sm text-gray-900">{achievement.awardName}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{achievement.teamOrIndividual}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${achievement.level === 'International' ? 'bg-purple-100 text-purple-700' :
                                                            achievement.level === 'National' ? 'bg-blue-100 text-blue-700' :
                                                                achievement.level === 'State' ? 'bg-green-100 text-green-700' :
                                                                    'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {achievement.level}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${achievement.sportsOrCultural === 'Sports'
                                                            ? 'bg-orange-100 text-orange-700'
                                                            : 'bg-pink-100 text-pink-700'
                                                        }`}>
                                                        {achievement.sportsOrCultural}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900">{achievement.studentName}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Events View */}
                {activeView === 'events' && (
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Scheduled Sports Events</h3>

                        {events.length === 0 ? (
                            <div className="text-center py-12">
                                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">No events scheduled yet</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {events.map((event, idx) => (
                                    <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                        <h4 className="font-semibold text-gray-900 mb-2">{event.eventName}</h4>
                                        <div className="space-y-1 text-sm text-gray-600">
                                            <p>📅 {event.date} at {event.time}</p>
                                            <p>📍 {event.venue}</p>
                                            <p>🏷️ {event.eventType}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
