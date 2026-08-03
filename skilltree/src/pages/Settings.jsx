import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings as SettingsIcon, Bell, Globe, Moon, User, Shield } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useApp } from '../contexts/AppContext'
import { stagger, fadeUp } from '../animations/variants'

function ToggleRow({ icon: Icon, title, desc, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-white/[0.06] last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
          <Icon className="w-4.5 h-4.5 text-white/60" />
        </div>
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-white/40">{desc}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors shrink-0 ${checked ? 'bg-emerald' : 'bg-white/10'}`}
      >
        <motion.div layout className="w-5 h-5 rounded-full bg-white" animate={{ x: checked ? 20 : 0 }} transition={{ type: 'spring', bounce: 0.3, duration: 0.3 }} />
      </button>
    </div>
  )
}

export default function SettingsPage() {
  const { student } = useApp()
  const [notifications, setNotifications] = useState(true)
  const [dailyReminders, setDailyReminders] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [language, setLanguage] = useState('English')

  return (
    <motion.div variants={stagger(0.06)} initial="hidden" animate="show" className="space-y-6 max-w-3xl">
      <motion.div variants={fadeUp}>
        <h1 className="font-display font-bold text-2xl sm:text-3xl flex items-center gap-2.5">
          <SettingsIcon className="w-6 h-6 text-emerald-bright" /> Settings
        </h1>
        <p className="text-white/40 text-sm mt-1">Manage your account and preferences.</p>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Card className="p-5">
          <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
            <User className="w-4.5 h-4.5 text-emerald-bright" /> Profile
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">Display Name</label>
              <input defaultValue={student.name} className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm focus:outline-none focus:ring-1 focus:ring-emerald/50" />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">Username</label>
              <input defaultValue={`@${student.username}`} className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm focus:outline-none focus:ring-1 focus:ring-emerald/50" />
            </div>
          </div>
          <div className="mt-4">
            <label className="text-xs text-white/40 mb-1.5 block">Bio</label>
            <textarea defaultValue={student.bio} rows={3} className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm focus:outline-none focus:ring-1 focus:ring-emerald/50 resize-none" />
          </div>
          <Button size="sm" className="mt-4">Save Changes</Button>
        </Card>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Card className="p-5">
          <h3 className="font-display font-semibold mb-1 flex items-center gap-2">
            <Bell className="w-4.5 h-4.5 text-purple-bright" /> Notifications
          </h3>
          <ToggleRow icon={Bell} title="Push Notifications" desc="Get notified about achievements and streaks." checked={notifications} onChange={setNotifications} />
          <ToggleRow icon={Shield} title="Daily Reminders" desc="A nudge if you haven't studied yet today." checked={dailyReminders} onChange={setDailyReminders} />
        </Card>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Card className="p-5">
          <h3 className="font-display font-semibold mb-1 flex items-center gap-2">
            <Moon className="w-4.5 h-4.5 text-blue-bright" /> Appearance
          </h3>
          <ToggleRow icon={Moon} title="Dark Mode" desc="SkillTree is designed dark-first." checked={darkMode} onChange={setDarkMode} />
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                <Globe className="w-4.5 h-4.5 text-white/60" />
              </div>
              <div>
                <p className="text-sm font-medium">Language</p>
                <p className="text-xs text-white/40">Interface display language</p>
              </div>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-1.5 text-sm focus:outline-none"
            >
              {['English', 'Gujarati', 'Hindi'].map((l) => (
                <option key={l} value={l} className="bg-base-900">{l}</option>
              ))}
            </select>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}
