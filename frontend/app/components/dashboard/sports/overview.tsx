'use client'

import { Trophy, Calendar, Users, Award, TrendingUp } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SportsOverview() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [stats, setStats] = useState({
        upcomingEvents: 0,
        activeAthletes: 0,
        achievements: 0,
        tournaments: 0
    })

    useEffect(() => {
        const userData = localStorage.getItem('user')
        if (userData) {
            setUser(JSON.parse(userData))
        }
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/sports/stats`, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (response.ok) {
                const data = await response.json()
                setStats(data)
            }
        } catch (error) {
            console.error('Error fetching stats:', error)
        }
    }

    const mainStats = [
        {
            label: 'Upcoming Events',
            value: stats.upcomingEvents,
            icon: '📅',
            gradient: 'from-blue-500 to-blue-600',
            onClick: () => router.push('/dashboard/sports?tab=schedule')
        },
        {
            label: 'Active Athletes',
            value: stats.activeAthletes,
            icon: '🏃',
            gradient: 'from-green-500 to-green-600',
        },
        {
            label: 'Achievements',
            value: stats.achievements,
            icon: '🏆',
            gradient: 'from-orange-500 to-orange-600',
            onClick: () => router.push('/dashboard/sports?tab=achievements')
        },
        {
            label: 'Tournaments',
            value: stats.tournaments,
            icon: '🎯',
            gradient: 'from-purple-500 to-purple-600',
        },
    ]

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-lg shadow-lg p-6 text-white">
                <h2 className="text-2xl font-bold">Welcome back, {user?.firstName}! 🏆</h2>
                <p className="mt-2 opacity-90">
                    Sports Department - Manage all sports activities and achievements
                </p>
            </div>

            {/* Main Stats - Interactive Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mainStats.map((stat, idx) => (
                    <div
                        key={idx}
                        onClick={stat.onClick}
                        className={`bg-gradient-to-br ${stat.gradient} rounded-lg shadow-lg p-6 text-white ${stat.onClick ? 'cursor-pointer transform transition hover:scale-105 hover:shadow-xl' : ''}`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90">{stat.label}</p>
                                <p className="text-4xl font-bold mt-2">{stat.value}</p>
                            </div>
                            <div className="text-5xl opacity-80">{stat.icon}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Recent Sports Activities</h3>
                <div className="text-center py-8">
                    <div className="text-5xl mb-3">🏃</div>
                    <p className="text-gray-500 mb-3">No recent activities yet</p>
                    <p className="text-sm text-gray-400">Start by scheduling an event or recording an achievement</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
                <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => router.push('/dashboard/sports?tab=schedule')}
                        className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition text-center"
                    >
                        <div className="text-3xl mb-2">📅</div>
                        <p className="text-sm font-medium">Schedule Event</p>
                    </button>
                    <button
                        onClick={() => router.push('/dashboard/sports?tab=achievements')}
                        className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition text-center"
                    >
                        <div className="text-3xl mb-2">🏆</div>
                        <p className="text-sm font-medium">Record Achievement</p>
                    </button>
                    <button
                        onClick={() => router.push('/dashboard/sports?tab=profile')}
                        className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition text-center"
                    >
                        <div className="text-3xl mb-2">👤</div>
                        <p className="text-sm font-medium">My Profile</p>
                    </button>
                </div>
            </div>
        </div>
    )
}
