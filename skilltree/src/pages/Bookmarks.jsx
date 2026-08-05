import { motion } from 'framer-motion'
import { Bookmark } from 'lucide-react'
import ResourceCard from '../components/cards/ResourceCard'
import { stagger, fadeUp } from '../animations/variants'
import { useApp } from '../contexts/AppContext'

export default function Bookmarks() {
  const { bookmarks, toggleBookmark } = useApp()

  return (
    <motion.div variants={stagger(0.06)} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={fadeUp}>
        <h1 className="font-display font-bold text-2xl sm:text-3xl flex items-center gap-2.5">
          <Bookmark className="w-6 h-6 text-gold-bright" /> Bookmarks
        </h1>
        <p className="text-white/40 text-sm mt-1">Everything you've saved for later.</p>
      </motion.div>

      <motion.div variants={fadeUp}>
        <h2 className="font-display font-semibold text-lg mb-4">Saved Resources</h2>
        {bookmarks.length === 0 ? (
          <p className="text-sm text-white/40">No bookmarks yet — save resources from the Resources page.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {bookmarks.map((b) => (
              <ResourceCard key={b.id} resource={b.resource_detail} bookmarked onToggleBookmark={() => toggleBookmark(b.resource_detail.id)} />
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}