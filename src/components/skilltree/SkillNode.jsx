import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import { motion } from 'framer-motion'
import { Lock, Check, Crown } from 'lucide-react'
import { getIcon } from '../../utils/iconMap'

const STATUS_STYLE = {
  completed: {
    ring: 'border-gold shadow-glow-gold',
    bg: 'bg-gradient-to-br from-gold-bright/20 to-gold/5',
    iconColor: 'text-gold-bright',
    pulse: false,
  },
  unlocked: {
    ring: 'border-blue shadow-glow-blue',
    bg: 'bg-gradient-to-br from-blue-bright/15 to-blue/5',
    iconColor: 'text-blue-bright',
    pulse: false,
  },
  current: {
    ring: 'border-purple shadow-glow-purple',
    bg: 'bg-gradient-to-br from-purple-bright/20 to-purple/5',
    iconColor: 'text-purple-bright',
    pulse: true,
  },
  locked: {
    ring: 'border-white/10',
    bg: 'bg-white/[0.02]',
    iconColor: 'text-white/25',
    pulse: false,
  },
}

function SkillNode({ data }) {
  const Icon = getIcon(data.icon)
  const style = STATUS_STYLE[data.status] || STATUS_STYLE.locked
  const isBoss = data.isBoss

  return (
    <motion.div
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => data.onOpen?.(data.id)}
      className="relative cursor-pointer select-none"
      style={{ width: isBoss ? 140 : 116 }}
    >
      <Handle type="target" position={Position.Top} className="!bg-white/20 !border-0 !w-2 !h-2" />
      <Handle type="source" position={Position.Bottom} className="!bg-white/20 !border-0 !w-2 !h-2" />

      {isBoss && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <Crown className="w-5 h-5 text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.7)]" />
        </div>
      )}

      <div
        className={`relative rounded-2xl border-2 ${style.ring} ${style.bg} backdrop-blur-md p-3 flex flex-col items-center text-center ${
          style.pulse ? 'animate-pulse-glow' : ''
        } ${isBoss ? 'border-4' : ''}`}
      >
        <div
          className={`rounded-full flex items-center justify-center mb-2 ${
            isBoss ? 'w-14 h-14 bg-red-500/10 border border-red-500/30' : 'w-10 h-10 bg-white/5'
          }`}
        >
          {data.status === 'locked' ? (
            <Lock className="w-4 h-4 text-white/25" />
          ) : (
            <Icon className={`${isBoss ? 'w-7 h-7 text-red-400' : `w-5 h-5 ${style.iconColor}`}`} />
          )}
        </div>
        <p className={`text-[11px] font-semibold leading-tight ${data.status === 'locked' ? 'text-white/30' : 'text-white'}`}>
          {data.name}
        </p>
        {data.status !== 'locked' && (
          <p className="text-[9px] font-mono text-white/40 mt-0.5">{data.xp} XP</p>
        )}
        {data.status === 'completed' && (
          <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gold flex items-center justify-center shadow-glow-gold">
            <Check className="w-3 h-3 text-base-950" strokeWidth={3} />
          </div>
        )}
        {data.status === 'current' && data.completion > 0 && (
          <div className="w-full h-1 rounded-full bg-white/10 mt-2 overflow-hidden">
            <div className="h-full bg-purple-bright rounded-full" style={{ width: `${data.completion}%` }} />
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default memo(SkillNode)
