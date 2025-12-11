'use client'

interface AdminSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  const menuItems = [
    { id: 'overview', icon: '📊', label: 'Dashboard' },
    { id: 'users', icon: '👥', label: 'Users' },
    { id: 'faculty-activities', icon: '📝', label: 'Faculty Activities' },
    { id: 'student-activities', icon: '🏆', label: 'Student Activities' },
    { id: 'documents', icon: '📄', label: 'Documents' },
    { id: 'departments', icon: '🏢', label: 'Departments' },
    { id: 'approvals', icon: '✓', label: 'Approvals' },
    { id: 'announcements', icon: '📢', label: 'Announcements' },
    { id: 'feedback', icon: '💬', label: 'Feedback Analytics' },
    { id: 'reports', icon: '📊', label: 'Generate Report' },
    { id: 'activity-logs', icon: '📋', label: 'Activity Logs' },
  ]

  return (
    <div className="w-64 bg-gray-900 text-white p-6 overflow-y-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">IQ</span>
        </div>
        <div>
          <h1 className="text-xl font-bold">IQAC Portal</h1>
          <p className="text-xs text-gray-400">Admin Panel</p>
        </div>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === item.id
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-800'
              }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
