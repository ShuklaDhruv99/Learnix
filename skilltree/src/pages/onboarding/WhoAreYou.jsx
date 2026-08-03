import { motion } from 'framer-motion'
import { getIcon } from '../../utils/iconMap'
import { learnerTypes } from '../../data/onboardingOptions'
import { stagger, fadeUp } from '../../animations/variants'

export default function WhoAreYou({ value, onSelect }) {
  return (
    <div>
      <h2 className="font-display font-bold text-2xl sm:text-3xl mb-2">Who are you?</h2>
      <p className="text-white/40 text-sm mb-8">This shapes the entire journey we build for you.</p>
      <motion.div variants={stagger(0.06)} initial="hidden" animate="show" className="grid sm:grid-cols-2 gap-4">
        {learnerTypes.map((t) => {
          const Icon = getIcon(t.icon)
          const active = value === t.id
          return (
            <motion.button
              key={t.id}
              variants={fadeUp}
              onClick={() => onSelect(t.id)}
              className={`text-left p-5 rounded-2xl glass transition-all duration-200 border ${
                active ? 'border-emerald/50 shadow-glow-emerald bg-emerald/[0.06]' : 'border-white/[0.06] hover:border-white/20'
              }`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${active ? 'bg-emerald/20' : 'bg-white/5'}`}>
                <Icon className={`w-5 h-5 ${active ? 'text-emerald-bright' : 'text-white/60'}`} />
              </div>
              <h3 className="font-display font-semibold">{t.label}</h3>
              <p className="text-xs text-white/40 mt-1">{t.desc}</p>
            </motion.button>
          )
        })}
      </motion.div>
    </div>
  )
}
