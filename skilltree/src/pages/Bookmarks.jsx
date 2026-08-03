import { motion } from 'framer-motion'
import { Bookmark } from 'lucide-react'
import ResourceCard from '../components/cards/ResourceCard'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import { getIcon } from '../utils/iconMap'
import { stagger, fadeUp } from '../animations/variants'
import bookmarksData from '../data/bookmarks.json'
import resources from '../data/resources.json'
import topics from '../data/topics.json'

export default function Bookmarks() {
  const savedResources = resources.filter((r) => bookmarksData.resources.includes(r.id))
  const savedTopics = topics.filter((t) => bookmarksData.topics.includes(t.id))

  return (
    <motion.div variants={stagger(0.06)} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={fadeUp}>
        <h1 className="font-display font-bold text-2xl sm:text-3xl flex items-center gap-2.5">
          <Bookmark className="w-6 h-6 text-gold-bright" /> Bookmarks
        </h1>
        <p className="text-white/40 text-sm mt-1">Everything you've saved for later.</p>
      </motion.div>

      <motion.div variants={fadeUp}>
        <h2 className="font-display font-semibold text-lg mb-4">Saved Topics</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {savedTopics.map((t) => {
            const Icon = getIcon(t.icon)
            return (
              <Card key={t.id} className="p-4 flex items-center gap-3" hover>
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <Icon className="w-4.5 h-4.5 text-emerald-bright" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{t.name}</p>
                  <Badge accent="purple" className="mt-1">{t.difficulty}</Badge>
                </div>
              </Card>
            )
          })}
        </div>
      </motion.div>

      <motion.div variants={fadeUp}>
        <h2 className="font-display font-semibold text-lg mb-4">Saved Resources</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {savedResources.map((r) => (
            <ResourceCard key={r.id} resource={r} bookmarked />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
