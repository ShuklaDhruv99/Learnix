import { cn } from '../../utils/cn'
import { accentMap } from '../../utils/xp'

export default function Badge({ children, accent = 'emerald', className, variant = 'soft' }) {
  const a = accentMap[accent] || accentMap.emerald
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border font-mono tracking-wide',
        variant === 'soft' && `${a.bgSoft} ${a.text} ${a.border}`,
        variant === 'solid' && `${a.bg} text-base-950 border-transparent`,
        className
      )}
    >
      {children}
    </span>
  )
}
