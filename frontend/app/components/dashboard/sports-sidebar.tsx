'use client'

import {
    LayoutDashboard,
    Award,
    User,
    Calendar,
    Trophy,
    Users
} from 'lucide-react'

interface SportsSidebarProps {
    activeTab: string
    setActiveTab: (tab: string) => void
}

export default function SportsSidebar({ activeTab, setActiveTab }: SportsSidebarProps) {
    const menuGroups = [
        {
            label: 'Core',
            items: [
                { id: 'overview', icon: LayoutDashboard, label: 'Dashboard' }
            ]
        },
        {
            label: 'Management',
            items: [
                { id: 'schedule', icon: Calendar, label: 'Schedule Event' },
                { id: 'achievements', icon: Award, label: 'Record Achievement' }
            ]
        },
        {
            label: 'Account',
            items: [
                { id: 'profile', icon: User, label: 'My Profile' }
            ]
        }
    ]

    return (
        <div className="w-64 bg-slate-900 h-screen flex flex-col text-slate-100 shadow-xl border-r border-slate-800">
            <div className="p-6 border-b border-slate-800 flex items-center gap-3 bg-slate-950/50">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-900/20">
                    <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-lg font-bold tracking-tight text-white">IQAC Portal</h1>
                    <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">Sports Dept</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {menuGroups.map((group, groupIndex) => (
                    <div key={groupIndex}>
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">
                            {group.label}
                        </h3>
                        <div className="space-y-1">
                            {group.items.map((item) => {
                                const Icon = item.icon
                                const isActive = activeTab === item.id
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative
                      ${isActive
                                                ? 'bg-orange-600 text-white shadow-md shadow-orange-900/20'
                                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                            }`}
                                    >
                                        <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
                                        <span>{item.label}</span>
                                        {isActive && (
                                            <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950/30">
                <div className="flex items-center gap-3 px-2 py-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <p className="text-xs text-slate-400">System Online</p>
                </div>
            </div>
        </div>
    )
}
