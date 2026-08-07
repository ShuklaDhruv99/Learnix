import { motion, AnimatePresence } from 'framer-motion'
import ChipSelect from '../../components/ui/ChipSelect'
import { boards, mediums, classes, streams } from '../../data/onboardingOptions'
import { getIcon } from '../../utils/iconMap'

export default function SchoolFlow({ data, onChange }) {
  const needsStream = data.className === '11' || data.className === '12'

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display font-bold text-2xl sm:text-3xl mb-2">Tell us about school</h2>
        <p className="text-white/40 text-sm">We'll match your board's exact syllabus.</p>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-white/40 mb-3 block">Board</label>
        <ChipSelect options={boards} value={data.board} onChange={(v) => onChange({ board: v })} />
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-white/40 mb-3 block">Medium</label>
        <ChipSelect options={mediums} value={data.medium} onChange={(v) => onChange({ medium: v })} />
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-white/40 mb-3 block">Class</label>
        <ChipSelect options={classes} value={data.className} onChange={(v) => onChange({ className: v, stream: null })} />
      </div>

      <AnimatePresence>
        {needsStream && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <label className="text-xs font-semibold uppercase tracking-wide text-white/40 mb-3 block">Stream</label>
            <div className="grid grid-cols-3 gap-3">
              {streams.map((s) => {
                const Icon = getIcon(s.icon)
                const active = data.stream === s.id
                return (
                  <button
                    key={s.id}
                    onClick={() => onChange({ stream: s.id })}
                    className={`p-4 rounded-xl glass border text-center transition-all ${
                      active ? 'border-emerald/50 shadow-glow-emerald bg-emerald/[0.06]' : 'border-white/[0.06] hover:border-white/20'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mx-auto mb-2 ${active ? 'text-emerald-bright' : 'text-white/50'}`} />
                    <span className="text-sm font-medium">{s.label}</span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}