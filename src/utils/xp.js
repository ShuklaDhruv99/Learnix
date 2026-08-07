export function formatXP(xp) {
  if (xp >= 1000) return `${(xp / 1000).toFixed(xp % 1000 === 0 ? 0 : 1)}k`
  return `${xp}`
}

export function formatCompact(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return `${n}`
}

// Accent -> tailwind token maps used across cards/nodes so every component
// stays consistent with the emerald / blue / purple / gold system.
export const accentMap = {
  emerald: {
    text: 'text-emerald-bright',
    bg: 'bg-emerald',
    bgSoft: 'bg-emerald/10',
    border: 'border-emerald/30',
    glow: 'shadow-glow-emerald',
    ring: 'stroke-emerald-bright',
    gradient: 'from-emerald-bright to-emerald',
    dot: 'bg-emerald-bright',
  },
  blue: {
    text: 'text-blue-bright',
    bg: 'bg-blue',
    bgSoft: 'bg-blue/10',
    border: 'border-blue/30',
    glow: 'shadow-glow-blue',
    ring: 'stroke-blue-bright',
    gradient: 'from-blue-bright to-blue',
    dot: 'bg-blue-bright',
  },
  purple: {
    text: 'text-purple-bright',
    bg: 'bg-purple',
    bgSoft: 'bg-purple/10',
    border: 'border-purple/30',
    glow: 'shadow-glow-purple',
    ring: 'stroke-purple-bright',
    gradient: 'from-purple-bright to-purple',
    dot: 'bg-purple-bright',
  },
  gold: {
    text: 'text-gold-bright',
    bg: 'bg-gold',
    bgSoft: 'bg-gold/10',
    border: 'border-gold/30',
    glow: 'shadow-glow-gold',
    ring: 'stroke-gold-bright',
    gradient: 'from-gold-bright to-gold',
    dot: 'bg-gold-bright',
  },
}

export function difficultyColor(difficulty) {
  switch (difficulty) {
    case 'Easy':
      return 'text-emerald-bright bg-emerald/10 border-emerald/30'
    case 'Medium':
      return 'text-gold-bright bg-gold/10 border-gold/30'
    case 'Hard':
      return 'text-purple-bright bg-purple/10 border-purple/30'
    case 'Boss':
      return 'text-red-400 bg-red-500/10 border-red-500/30'
    default:
      return 'text-white/60 bg-white/5 border-white/10'
  }
}
