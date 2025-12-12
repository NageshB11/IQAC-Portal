'use client'

interface StudentSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function StudentSidebar({ activeTab, setActiveTab }: StudentSidebarProps) {
  const menuItems = [
    { id: 'overview', icon: '📊', label: 'Dashboard' },
    { id: 'academic', icon: '📅', label: 'Academic Info' },
    { id: 'achievements', icon: '🏆', label: 'Achievements' },
    { id: 'feedback', icon: '✍️', label: 'Feedback' },
    { id: 'my-feedback', icon: '📋', label: 'My Feedback' },
    { id: 'profile', icon: '👤', label: 'Profile' },
    { id: 'announcements', icon: '📢', label: 'Announcements' },
  ]

  return (
    <div className="w-64 bg-gray-900 text-white p-6 overflow-y-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">IQ</span>
        </div>
        <div>
          <h1 className="text-xl font-bold">IQAC Portal</h1>
          <p className="text-xs text-gray-400">Student</p>
        </div>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === item.id
                ? 'bg-orange-600 text-white'
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
