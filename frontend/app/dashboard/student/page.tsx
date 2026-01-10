'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import StudentSidebar from '@/app/components/dashboard/student-sidebar'
import StudentOverview from '@/app/components/dashboard/student/overview'
import FeedbackForm from '@/app/components/dashboard/student/feedback-form'
import MyFeedback from '@/app/components/dashboard/student/my-feedback'
import StudentAnnouncements from '@/app/components/dashboard/student/announcements'
import Achievements from '@/app/components/dashboard/student/achievements'
import StudentProfile from '@/app/components/dashboard/student/profile'

export default function StudentDashboard() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <StudentDashboardContent />
    </Suspense>
  )
}

function StudentDashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState('overview')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userRole = localStorage.getItem('userRole')

    console.log('[v0] Student Dashboard - Token:', !!token, 'UserRole:', userRole)

    if (!token || userRole !== 'student') {
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

  return (
    <div className="flex h-screen bg-gray-50">
      <StudentSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {activeTab === 'overview' && 'My Dashboard'}
            {activeTab === 'achievements' && 'Achievement Submission'}
            {activeTab === 'feedback' && 'Submit Feedback'}
            {activeTab === 'my-feedback' && 'My Feedback'}
            {activeTab === 'profile' && 'My Profile'}
            {activeTab === 'announcements' && 'Announcements'}
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
          {activeTab === 'overview' && <StudentOverview />}
          {activeTab === 'achievements' && <Achievements />}
          {activeTab === 'feedback' && <FeedbackForm />}
          {activeTab === 'my-feedback' && <MyFeedback />}
          {activeTab === 'profile' && <StudentProfile />}
          {activeTab === 'announcements' && <StudentAnnouncements />}
        </div>
      </div>
    </div>
  )
}
