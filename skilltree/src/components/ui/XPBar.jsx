import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

export default function XPBar({ current, max, accent = 'emerald', height = 'h-2.5', showLabel = false }) {
  const pct = Math.min(100, Math.round((current / max) * 100))
  const gradients = {
    emerald: 'from-emerald-bright via-emerald to-emerald-bright',
    blue: 'from-blue-bright via-blue to-blue-bright',
    purple: 'from-purple-bright via-purple to-purple-bright',
    gold: 'from-gold-bright via-gold to-gold-bright',
  }
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-xs text-white/50 mb-1.5 font-mono">
          <span>{current.toLocaleString()} XP</span>
          <span>{max.toLocaleString()} XP</span>
        </div>
      )}
      <div className={cn('w-full rounded-full bg-white/[0.06] overflow-hidden relative', height)}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className={cn('h-full rounded-full bg-gradient-to-r relative overflow-hidden', gradients[accent])}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
        </motion.div>
      </div>
    </div>
  )
}
