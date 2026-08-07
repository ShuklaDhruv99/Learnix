import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

export default function Tabs({ tabs, active, onChange, className }) {
  return (
    <div className={cn('inline-flex items-center gap-1 p-1 rounded-xl glass', className)}>
      {tabs.map((tab) => {
        const isActive = tab.id === active
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative px-4 py-1.5 rounded-lg text-sm font-medium transition-colors',
              isActive ? 'text-base-950' : 'text-white/60 hover:text-white'
            )}
          >
            {isActive && (
              <motion.div
                layoutId="tab-pill"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                className="absolute inset-0 bg-gradient-to-r from-emerald-bright to-emerald rounded-lg"
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
