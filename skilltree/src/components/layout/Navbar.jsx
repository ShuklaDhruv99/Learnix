import { useState } from 'react'
import { Menu, Bell, Flame, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../../contexts/AppContext'
import SearchBar from '../common/SearchBar'
import NotificationsPanel from '../common/NotificationsPanel'
import ThemeToggle from '../common/ThemeToggle'

export default function Navbar() {
  const { dashboard, currentUser, setMobileNavOpen } = useApp()
  const [notifOpen, setNotifOpen] = useState(false)
  const profile = dashboard?.profile
  const avatarInitial = currentUser?.username?.[0]?.toUpperCase() || '?'

  return (
    <header className="sticky top-0 z-30 h-16 shrink-0 flex items-center gap-3 px-4 lg:px-6 border-b border-white/[0.06] bg-base-950/80 backdrop-blur-xl">
      <button
        onClick={() => setMobileNavOpen(true)}
        className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-white/5"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>
      <div className="hidden md:block flex-1 max-w-md">
        <SearchBar />
      </div>
      <div className="md:hidden flex-1" />
      <div className="flex items-center gap-2 sm:gap-3 ml-auto">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass text-sm">
          <Flame className="w-4 h-4 text-gold-bright" />
          <span className="font-mono font-medium">{profile?.streak_days ?? 0}</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass text-sm">
          <Zap className="w-4 h-4 text-emerald-bright" />
          <span className="font-mono font-medium">Lv {profile?.level ?? 1}</span>
        </div>
        <ThemeToggle />
        <div className="relative">
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative p-2.5 rounded-xl glass hover:bg-white/10 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-bright shadow-glow-emerald" />
          </button>
          <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>
        <Link to="/app/profile" className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-bright to-blue flex items-center justify-center font-display font-bold text-xs text-base-950 shrink-0">
          {avatarInitial}
        </Link>
      </div>
    </header>
  )
}