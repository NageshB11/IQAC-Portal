'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import CoordinatorSidebar from '@/app/components/dashboard/coordinator-sidebar'
import CoordinatorOverview from '@/app/components/dashboard/coordinator/overview'
import FacultyManagement from '@/app/components/dashboard/coordinator/faculty-management'
import DocumentReview from '@/app/components/dashboard/coordinator/document-review'
import SendNotice from '@/app/components/dashboard/coordinator/send-notice'
import FeedbackReport from '@/app/components/dashboard/coordinator/feedback-report'
import StudentManagement from '@/app/components/dashboard/coordinator/student-management'
import StudentFeedbackView from '@/app/components/dashboard/coordinator/student-feedback-view'
import FacultyActivitiesView from '@/app/components/dashboard/coordinator/faculty-activities-view'
import StudentActivitiesView from '@/app/components/dashboard/coordinator/student-activities-view'
import GenerateReport from '@/app/components/dashboard/coordinator/generate-report'

export default function CoordinatorDashboard() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <CoordinatorDashboardContent />
    </Suspense>
  )
}

function CoordinatorDashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState('overview')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userRole = localStorage.getItem('userRole')

    if (!token || userRole !== 'coordinator') {
      router.push('/')
      return
    }

    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Fetch fresh user data with populated department
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const profileData = await response.json()
          setUser(profileData)
          // Update localStorage with populated data
          localStorage.setItem('user', JSON.stringify(profileData))
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error)
      }
    }

    fetchUserProfile()

    // Check for tab parameter in URL
    const tabParam = searchParams.get('tab')
    if (tabParam) {
      setActiveTab(tabParam)
    }
  }, [router, searchParams])

  return (
    <div className="flex h-screen bg-gray-50">
      <CoordinatorSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {activeTab === 'overview' && 'Department Overview'}
              {activeTab === 'faculty' && 'Faculty Management'}
              {activeTab === 'students' && 'Student Management'}
              {activeTab === 'documents' && 'Document Review'}
              {activeTab === 'student-feedback' && 'Student Feedback'}
              {activeTab === 'notices' && 'Send Notice'}
              {activeTab === 'feedback' && 'Feedback Report'}
              {activeTab === 'faculty-activities' && 'Faculty Activities'}
              {activeTab === 'student-activities' && 'Student Activities'}
              {activeTab === 'reports' && 'Generate Report'}
            </h1>
            {user?.department && (
              <p className="text-sm text-gray-600 mt-1">
                Department: <span className="font-semibold text-green-700">
                  {typeof user.department === 'object' ? user.department.name : user.department}
                </span>
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-gray-700 font-medium">Welcome, {user?.firstName}</span>
              {user?.department && (
                <p className="text-xs text-gray-500">
                  {typeof user.department === 'object' ? user.department.name : ''} Coordinator
                </p>
              )}
            </div>
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
          {activeTab === 'overview' && <CoordinatorOverview />}
          {activeTab === 'faculty' && <FacultyManagement />}
          {activeTab === 'students' && <StudentManagement />}
          {activeTab === 'documents' && <DocumentReview />}
          {activeTab === 'student-feedback' && <StudentFeedbackView />}
          {activeTab === 'notices' && <SendNotice />}
          {activeTab === 'feedback' && <FeedbackReport />}
          {activeTab === 'faculty-activities' && <FacultyActivitiesView />}
          {activeTab === 'student-activities' && <StudentActivitiesView />}
          {activeTab === 'reports' && <GenerateReport />}
        </div>
      </div>
    </div>
  )
}
