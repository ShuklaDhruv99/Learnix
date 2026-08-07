import { motion } from 'framer-motion'
import { accentMap } from '../../utils/xp'

export default function ProgressRing({
  value = 0,
  size = 64,
  strokeWidth = 6,
  accent = 'emerald',
  label,
  showValue = true,
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.min(value, 100) / 100) * circumference
  const a = accentMap[accent] || accentMap.emerald

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={a.ring}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display font-bold" style={{ fontSize: size * 0.24 }}>
            {value}%
          </span>
          {label && <span className="text-[9px] text-white/40 uppercase tracking-wide">{label}</span>}
        </div>
      )}
    </div>
  )
}
