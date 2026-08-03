import { useState } from 'react'
import { Moon, SunMedium } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ThemeToggle() {
  const [dim, setDim] = useState(false)
  return (
    <button
      onClick={() => setDim((d) => !d)}
      aria-label="Toggle theme intensity"
      className="relative w-14 h-8 rounded-full glass flex items-center px-1 transition-colors"
    >
      <motion.div
        animate={{ x: dim ? 24 : 0 }}
        transition={{ type: 'spring', bounce: 0.35, duration: 0.4 }}
        className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-bright to-emerald flex items-center justify-center shadow-glow-emerald"
      >
        {dim ? <Moon className="w-3.5 h-3.5 text-base-950" /> : <SunMedium className="w-3.5 h-3.5 text-base-950" />}
      </motion.div>
    </button>
  )
}
