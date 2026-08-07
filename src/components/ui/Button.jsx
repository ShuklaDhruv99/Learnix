import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

const variants = {
  primary:
    'bg-gradient-to-r from-emerald-bright to-emerald text-base-950 font-semibold shadow-glow-emerald hover:brightness-110',
  gold: 'bg-gradient-to-r from-gold-bright to-gold text-base-950 font-semibold shadow-glow-gold hover:brightness-110',
  purple:
    'bg-gradient-to-r from-purple-bright to-purple text-white font-semibold shadow-glow-purple hover:brightness-110',
  secondary: 'glass text-white hover:bg-white/10',
  ghost: 'text-white/70 hover:text-white hover:bg-white/5',
  outline: 'border border-white/15 text-white hover:border-white/30 hover:bg-white/5',
  danger: 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20',
}

const sizes = {
  sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5',
  md: 'text-sm px-4 py-2.5 rounded-xl gap-2',
  lg: 'text-base px-6 py-3.5 rounded-2xl gap-2.5',
}

export default function Button({
  as: As = 'button',
  variant = 'primary',
  size = 'md',
  className,
  children,
  icon: Icon,
  iconRight: IconRight,
  ...props
}) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="inline-block">
      <As
        className={cn(
          'inline-flex items-center justify-center font-body transition-all duration-200 select-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {Icon && <Icon className="w-4 h-4" />}
        {children}
        {IconRight && <IconRight className="w-4 h-4" />}
      </As>
    </motion.div>
  )
}
