'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import SportsSidebar from '@/app/components/dashboard/sports-sidebar'
import SportsOverview from '@/app/components/dashboard/sports/overview'
import ScheduleEvent from '@/app/components/dashboard/sports/schedule-event'
import RecordAchievement from '@/app/components/dashboard/sports/achievements'
import SportsProfile from '@/app/components/dashboard/sports/profile'

export default function SportsDashboard() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center bg-slate-950 text-white">Loading Dashboard...</div>}>
            <SportsDashboardContent />
        </Suspense>
    )
}

function SportsDashboardContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [activeTab, setActiveTab] = useState('overview')
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        const token = localStorage.getItem('token')
        const userRole = localStorage.getItem('userRole')

        if (!token || userRole !== 'sports') {
            router.push('/')
        }

        const userData = localStorage.getItem('user')
        if (userData) {
            setUser(JSON.parse(userData))
        }

        // Check for tab parameter in URL
        const tabParam = searchParams.get('tab')
        if (tabParam) {
            setActiveTab(tabParam)
        }
    }, [router, searchParams])

    const getTitle = () => {
        switch (activeTab) {
            case 'overview': return 'Sports Dashboard'
            case 'schedule': return 'Schedule Event'
            case 'achievements': return 'Record Achievement'
            case 'profile': return 'My Profile'
            default: return 'Sports Dashboard'
        }
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <SportsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {getTitle()}
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-700">Welcome, {user?.firstName}</span>
                        <button
                            onClick={() => {
                                localStorage.clear()
                                router.push('/')
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-8">
                    {activeTab === 'overview' && <SportsOverview />}
                    {activeTab === 'schedule' && <ScheduleEvent />}
                    {activeTab === 'achievements' && <RecordAchievement />}
                    {activeTab === 'profile' && <SportsProfile />}
                </div>
            </div>
        </div>
    )
}
