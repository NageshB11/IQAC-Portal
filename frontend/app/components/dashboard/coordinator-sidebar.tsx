'use client'

interface CoordinatorSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function CoordinatorSidebar({ activeTab, setActiveTab }: CoordinatorSidebarProps) {
  const menuItems = [
    { id: 'overview', icon: '📊', label: 'Overview' },
    { id: 'faculty', icon: '👥', label: 'Faculty' },
    { id: 'faculty-activities', icon: '📝', label: 'Faculty Activities' },
    { id: 'students', icon: '🎓', label: 'Students' },
    { id: 'student-activities', icon: '🏆', label: 'Student Activities' },
    { id: 'documents', icon: '📄', label: 'Documents' },
    { id: 'student-feedback', icon: '💬', label: 'Student Feedback' },
    { id: 'notices', icon: '📢', label: 'Notices' },
    { id: 'feedback', icon: '📊', label: 'Feedback Report' },
    { id: 'reports', icon: '📈', label: 'Generate Report' },
  ]

  return (
    <div className="w-64 bg-gray-900 text-white p-6 overflow-y-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">IQ</span>
        </div>
        <div>
          <h1 className="text-xl font-bold">IQAC Portal</h1>
          <p className="text-xs text-gray-400">Coordinator</p>
        </div>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === item.id
              ? 'bg-green-600 text-white'
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
