import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { drawerVariants } from '../../animations/variants'

export default function Drawer({ open, onClose, children, title }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div
            key="panel"
            variants={drawerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="fixed right-0 top-0 h-full w-full sm:w-[440px] glass-strong z-50 overflow-y-auto"
          >
            <div className="sticky top-0 glass-strong flex items-center justify-between px-6 py-4 border-b border-white/10 z-10">
              <h3 className="font-display font-semibold text-lg">{title}</h3>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Close panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
