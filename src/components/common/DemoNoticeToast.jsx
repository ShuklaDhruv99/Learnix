import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../../contexts/AppContext'

export default function DemoNoticeToast() {
  const { demoNotice, dismissDemoNotice } = useApp()

  return (
    <AnimatePresence>
      {demoNotice && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[calc(100%-2rem)]"
        >
          <div className="glass-strong rounded-2xl p-4 flex items-start gap-3 border border-emerald/30 shadow-glow-emerald">
            <div className="w-8 h-8 rounded-lg bg-emerald/15 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-emerald-bright" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white/85 leading-snug">{demoNotice}</p>
              <Link to="/register" className="text-xs text-emerald-bright hover:underline mt-1.5 inline-block">
                Create a free account →
              </Link>
            </div>
            <button onClick={dismissDemoNotice} className="p-1 hover:bg-white/10 rounded-lg shrink-0">
              <X className="w-3.5 h-3.5 text-white/40" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
