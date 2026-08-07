import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import Button from './Button'

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', onConfirm, onCancel, loading }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-5 pointer-events-none"
          >
            <div className="glass-strong rounded-2xl p-6 max-w-sm w-full pointer-events-auto border border-white/10">
              <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-1.5">{title}</h3>
              <p className="text-sm text-white/50 leading-relaxed mb-6">{message}</p>
              <div className="flex gap-2.5 justify-end">
                <Button variant="ghost" onClick={onCancel} disabled={loading}>
                  Cancel
                </Button>
                <Button
                  onClick={onConfirm}
                  disabled={loading}
                  className="!bg-red-500/15 !border-red-500/30 !text-red-400 hover:!bg-red-500/25"
                >
                  {loading ? 'Please wait...' : confirmLabel}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}