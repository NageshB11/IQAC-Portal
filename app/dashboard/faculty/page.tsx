'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import FacultySidebar from '@/app/components/dashboard/faculty-sidebar'
import FacultyOverview from '@/app/components/dashboard/faculty/overview'
import ResearchPublications from '@/app/components/dashboard/faculty/research-publications'
import ProfessionalDevelopment from '@/app/components/dashboard/faculty/professional-development'
import CoursesTaught from '@/app/components/dashboard/faculty/courses-taught'
import EventsOrganized from '@/app/components/dashboard/faculty/events-organized'
import MyDocuments from '@/app/components/dashboard/faculty/my-documents'
import DepartmentMembers from '@/app/components/dashboard/faculty/department-members'
import Announcements from '@/app/components/dashboard/faculty/announcements'

export default function FacultyDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState('overview')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userRole = localStorage.getItem('userRole')

    if (!token || userRole !== 'faculty') {
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
      <FacultySidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {activeTab === 'overview' && 'My Dashboard'}
            {activeTab === 'research' && 'Research Publications'}
            {activeTab === 'professional-dev' && 'FDP/STTP/Workshops Attended'}
            {activeTab === 'courses' && 'Courses Taught'}
            {activeTab === 'events' && 'Events Organized'}
            {activeTab === 'documents' && 'My Documents'}
            {activeTab === 'members' && 'Department Members'}
            {activeTab === 'announcements' && 'Announcements'}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, Dr. {user?.lastName}</span>
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
          {activeTab === 'overview' && <FacultyOverview />}
          {activeTab === 'research' && <ResearchPublications />}
          {activeTab === 'professional-dev' && <ProfessionalDevelopment />}
          {activeTab === 'courses' && <CoursesTaught />}
          {activeTab === 'events' && <EventsOrganized />}
          {activeTab === 'documents' && <MyDocuments />}
          {activeTab === 'members' && <DepartmentMembers />}
          {activeTab === 'announcements' && <Announcements />}
        </div>
      </div>
    </div>
  )
}
