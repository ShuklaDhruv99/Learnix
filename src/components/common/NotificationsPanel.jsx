import { AnimatePresence, motion } from 'framer-motion'
import { Trophy, Flame, Sparkles, BookOpenCheck } from 'lucide-react'

const notifications = [
  { id: 1, icon: Trophy, accent: 'gold', title: 'Congratulations!', body: 'You unlocked React Fundamentals.', time: '2h ago' },
  { id: 2, icon: Flame, accent: 'emerald', title: 'Daily goal completed', body: "You've hit your 90-minute target today.", time: '5h ago' },
  { id: 3, icon: Sparkles, accent: 'purple', title: 'New resources available', body: '3 new videos added to Hooks.', time: '1d ago' },
  { id: 4, icon: BookOpenCheck, accent: 'blue', title: 'Streak milestone', body: "You're on a 12 day study streak.", time: '2d ago' },
]

const accentText = { gold: 'text-gold-bright bg-gold/10', emerald: 'text-emerald-bright bg-emerald/10', purple: 'text-purple-bright bg-purple/10', blue: 'text-blue-bright bg-blue/10' }

export default function NotificationsPanel({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-full mt-2 w-80 glass-strong rounded-2xl shadow-card z-50 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <span className="font-display font-semibold text-sm">Notifications</span>
              <span className="text-[11px] text-emerald-bright font-mono">4 new</span>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((n) => {
                const Icon = n.icon
                return (
                  <div key={n.id} className="flex gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${accentText[n.accent]}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="text-xs text-white/50 mt-0.5">{n.body}</p>
                      <p className="text-[10px] text-white/30 mt-1 font-mono">{n.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
