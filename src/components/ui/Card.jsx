import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

export default function Card({ children, className, hover = false, glow, ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : undefined}
      className={cn(
        'glass rounded-2xl shadow-card relative overflow-hidden',
        hover && 'transition-shadow duration-300 cursor-pointer hover:border-white/20',
        glow === 'emerald' && hover && 'hover:shadow-glow-emerald',
        glow === 'blue' && hover && 'hover:shadow-glow-blue',
        glow === 'purple' && hover && 'hover:shadow-glow-purple',
        glow === 'gold' && hover && 'hover:shadow-glow-gold',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}
