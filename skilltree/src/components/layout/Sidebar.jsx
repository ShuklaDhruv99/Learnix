import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  BookOpen,
  GitBranch,
  Library,
  Award,
  BarChart3,
  Trophy,
  Bookmark,
  Settings,
  Sparkles,
  X,
  UploadCloud
} from 'lucide-react'
import { useApp } from '../../contexts/AppContext'
import { cn } from '../../utils/cn'

const navItems = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/subjects', label: 'Subjects', icon: BookOpen },
  { to: '/app/syllabus-upload', label: 'Generate Tree', icon: UploadCloud },
  { to: '/app/skill-tree', label: 'Skill Tree', icon: GitBranch },
  { to: '/app/resources', label: 'Resources', icon: Library },
  { to: '/app/achievements', label: 'Achievements', icon: Award },
  { to: '/app/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/app/leaderboard', label: 'Leaderboard', icon: Trophy },
  { to: '/app/bookmarks', label: 'Bookmarks', icon: Bookmark },
  { to: '/app/settings', label: 'Settings', icon: Settings },
]

function SidebarContent({ onNavigate }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-5 h-16 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-bright to-blue flex items-center justify-center shadow-glow-emerald">
          <Sparkles className="w-4.5 h-4.5 text-base-950" />
        </div>
        <span className="font-display font-bold text-lg tracking-tight">Learnix</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors relative group',
                isActive ? 'text-white' : 'text-white/50 hover:text-white/90 hover:bg-white/5'
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    className="absolute inset-0 bg-white/[0.07] border border-white/10 rounded-xl"
                  />
                )}
                <item.icon className={cn('w-4.5 h-4.5 relative z-10 shrink-0', isActive && 'text-emerald-bright')} />
                <span className="relative z-10">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-3">
        <div className="glass rounded-xl p-3.5">
          <p className="text-xs text-white/50 leading-relaxed">
            Keep your streak alive — <span className="text-emerald-bright font-medium">20 minutes today</span> keeps you on track.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Sidebar() {
  const { mobileNavOpen, setMobileNavOpen } = useApp()

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex w-64 shrink-0 border-r border-white/[0.06] bg-base-900/60 backdrop-blur-xl h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {mobileNavOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileNavOpen(false)} />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-0 top-0 h-full w-72 bg-base-900 z-50 lg:hidden"
          >
            <button
              onClick={() => setMobileNavOpen(false)}
              className="absolute top-5 right-4 p-1.5 rounded-lg hover:bg-white/10"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent onNavigate={() => setMobileNavOpen(false)} />
          </motion.aside>
        </>
      )}
    </>
  )
}
