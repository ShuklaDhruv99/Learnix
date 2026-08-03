import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { goalModes } from '../../data/onboardingOptions'
import { accentMap } from '../../utils/xp'
import { stagger, fadeUp } from '../../animations/variants'

export default function GoalSelection({ value, onSelect }) {
  return (
    <div>
      <h2 className="font-display font-bold text-2xl sm:text-3xl mb-2">What is your goal?</h2>
      <p className="text-white/40 text-sm mb-8">This decides which resources we surface for every topic.</p>
      <motion.div variants={stagger(0.08)} initial="hidden" animate="show" className="grid sm:grid-cols-3 gap-4">
        {goalModes.map((mode) => {
          const active = value === mode.id
          const a = accentMap[mode.accent]
          return (
            <motion.button
              key={mode.id}
              variants={fadeUp}
              onClick={() => onSelect(mode.id)}
              className={`relative text-left p-5 rounded-2xl glass border transition-all ${
                active ? `${a.border} ${a.glow} bg-white/[0.04]` : 'border-white/[0.06] hover:border-white/20'
              }`}
            >
              {active && (
                <div className={`absolute top-4 right-4 w-5 h-5 rounded-full ${a.bg} flex items-center justify-center`}>
                  <Check className="w-3 h-3 text-base-950" strokeWidth={3} />
                </div>
              )}
              <span className="text-2xl">{mode.emoji}</span>
              <h3 className="font-display font-semibold text-lg mt-2">{mode.label}</h3>
              <p className={`text-sm mt-1 ${a.text}`}>{mode.tagline}</p>
              <ul className="mt-4 space-y-1.5">
                {mode.resources.map((r) => (
                  <li key={r} className="text-xs text-white/40 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-white/30" /> {r}
                  </li>
                ))}
              </ul>
            </motion.button>
          )
        })}
      </motion.div>
    </div>
  )
}
