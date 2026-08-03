import { motion } from 'framer-motion'
import { Flame, Crown } from 'lucide-react'
import { cn } from '../../utils/cn'
import { accentMap } from '../../utils/xp'

const rankStyles = {
  1: 'text-gold-bright',
  2: 'text-slate-300',
  3: 'text-orange-300',
}

export default function LeaderboardCard({ entry, index = 0 }) {
  const a = accentMap[entry.avatarColor] || accentMap.emerald
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      className={cn(
        'flex items-center gap-4 px-4 py-3 rounded-xl transition-colors',
        entry.isYou ? 'glass border border-emerald/30 shadow-glow-emerald' : 'hover:bg-white/[0.03]'
      )}
    >
      <div className={cn('w-8 text-center font-mono font-bold text-sm shrink-0', rankStyles[entry.rank] || 'text-white/40')}>
        {entry.rank <= 3 ? <Crown className={cn('w-4 h-4 mx-auto', rankStyles[entry.rank])} /> : `#${entry.rank}`}
      </div>
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-xs shrink-0 bg-gradient-to-br', a.gradient)}>
        <span className="text-base-950">{entry.avatar}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate">
          {entry.name} {entry.isYou && <span className="text-emerald-bright text-xs">(You)</span>}
        </p>
        <p className="text-xs text-white/40">Level {entry.level}</p>
      </div>
      <div className="hidden sm:flex items-center gap-1 text-xs text-white/40 font-mono shrink-0">
        <Flame className="w-3.5 h-3.5 text-gold-bright" /> {entry.streak}
      </div>
      <div className="font-mono font-semibold text-sm text-emerald-bright shrink-0 w-16 text-right">
        {entry.xp.toLocaleString()}
      </div>
    </motion.div>
  )
}
