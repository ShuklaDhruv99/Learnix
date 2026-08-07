import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { getIcon } from '../../utils/iconMap'
import Card from '../ui/Card'

const tierStyles = {
  bronze: { text: 'text-orange-300', glow: 'shadow-[0_0_24px_rgba(251,146,60,0.25)]', ring: 'border-orange-400/30', grad: 'from-orange-300 to-orange-500' },
  silver: { text: 'text-slate-200', glow: 'shadow-[0_0_24px_rgba(203,213,225,0.25)]', ring: 'border-slate-300/30', grad: 'from-slate-100 to-slate-400' },
  gold: { text: 'text-gold-bright', glow: 'shadow-glow-gold', ring: 'border-gold/30', grad: 'from-gold-bright to-gold' },
  platinum: { text: 'text-purple-bright', glow: 'shadow-glow-purple', ring: 'border-purple/30', grad: 'from-purple-bright to-blue-bright' },
}

export default function AchievementCard({ achievement }) {
  const Icon = getIcon(achievement.icon)
  const t = tierStyles[achievement.tier] || tierStyles.bronze
  const unlocked = achievement.unlocked

  return (
    <Card className="p-5 text-center flex flex-col items-center" hover>
      <motion.div
        whileHover={unlocked ? { rotate: [0, -6, 6, 0] } : undefined}
        transition={{ duration: 0.5 }}
        className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 border ${
          unlocked ? `bg-gradient-to-br ${t.grad} ${t.glow}` : 'bg-white/[0.03] border-white/10'
        }`}
      >
        {unlocked ? <Icon className="w-7 h-7 text-base-950" /> : <Lock className="w-6 h-6 text-white/25" />}
      </motion.div>

      <h4 className={`font-display font-semibold text-sm mb-1 ${unlocked ? 'text-white' : 'text-white/40'}`}>
        {unlocked ? achievement.name : '???'}
      </h4>
      <p className="text-[11px] text-white/40 leading-relaxed mb-3 min-h-[32px]">
        {unlocked ? achievement.description : 'Keep progressing to reveal this achievement.'}
      </p>

      {unlocked ? (
        <span className={`text-[10px] font-mono uppercase tracking-wider ${t.text}`}>
          Unlocked · +{achievement.xp_reward} XP
        </span>
      ) : (
        <div className="w-full">
          <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <div className="h-full bg-white/20 rounded-full" style={{ width: `${achievement.progress_pct || 0}%` }} />
          </div>
          <span className="text-[10px] text-white/30 font-mono mt-1 block">{achievement.progress_pct || 0}%</span>
        </div>
      )}
    </Card>
  )
}