import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

export default function ChipSelect({ options, value, onChange, columns = 'flex flex-wrap' }) {
  return (
    <div className={cn('gap-2.5', columns)}>
      {options.map((opt) => {
        const active = value === opt
        return (
          <motion.button
            key={opt}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(opt)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium border transition-all',
              active
                ? 'bg-emerald/15 border-emerald/50 text-emerald-bright shadow-glow-emerald'
                : 'glass border-white/[0.06] text-white/60 hover:border-white/20 hover:text-white'
            )}
          >
            {opt}
          </motion.button>
        )
      })}
    </div>
  )
}
