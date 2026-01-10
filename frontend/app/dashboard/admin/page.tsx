'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import AdminSidebar from '@/components/dashboard/admin-sidebar'
import DashboardOverview from '@/components/dashboard/admin/dashboard-overview'
import UserManagement from '@/components/dashboard/admin/user-management'
import DepartmentManagement from '@/components/dashboard/admin/department-management'

import AnnouncementManagement from '@/components/dashboard/admin/announcement-management'
import FeedbackAnalytics from '@/components/dashboard/admin/feedback-analytics'
import FacultyActivitiesView from '@/app/components/dashboard/admin/admin-faculty-activities'
import StudentActivitiesView from '@/app/components/dashboard/admin/admin-student-activities'
import AdminSportsActivities from '@/app/components/dashboard/admin/admin-sports-activities'
import GenerateReport from '@/components/dashboard/admin/generate-report'
import ActivityLogsManagement from '@/components/dashboard/admin/activity-logs'
import DocumentsManagement from '@/components/dashboard/admin/documents-management'

export default function AdminDashboard() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <AdminDashboardContent />
    </Suspense>
  )
}

function AdminDashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState('overview')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userRole = localStorage.getItem('userRole')

    console.log('[v0] Admin Dashboard - Token:', !!token, 'UserRole:', userRole)

    if (!token || userRole !== 'admin') {
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
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {activeTab === 'overview' && 'Dashboard Overview'}
            {activeTab === 'users' && 'User Management'}
            {activeTab === 'departments' && 'Department Management'}

            {activeTab === 'announcements' && 'Announcements'}
            {activeTab === 'feedback' && 'Feedback Analytics'}
            {activeTab === 'faculty-activities' && 'Faculty Activities'}
            {activeTab === 'student-activities' && 'Student Activities'}
            {activeTab === 'sports' && 'Sports Activities'}
            {activeTab === 'reports' && 'Generate Report'}
            {activeTab === 'activity-logs' && 'Activity Logs'}
            {activeTab === 'documents' && 'Documents Management'}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, {user?.username}</span>
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
          {activeTab === 'overview' && <DashboardOverview />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'departments' && <DepartmentManagement />}

          {activeTab === 'announcements' && <AnnouncementManagement />}
          {activeTab === 'feedback' && <FeedbackAnalytics />}
          {activeTab === 'faculty-activities' && <FacultyActivitiesView />}
          {activeTab === 'student-activities' && <StudentActivitiesView />}
          {activeTab === 'sports' && <AdminSportsActivities />}
          {activeTab === 'reports' && <GenerateReport />}
          {activeTab === 'activity-logs' && <ActivityLogsManagement />}
          {activeTab === 'documents' && <DocumentsManagement />}
        </div>
      </div>
    </div>
  )
}
