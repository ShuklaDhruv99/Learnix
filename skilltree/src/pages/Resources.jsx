import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Library, Search } from 'lucide-react'
import ResourceCard from '../components/cards/ResourceCard'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { stagger, fadeUp } from '../animations/variants'
import { useApp } from '../contexts/AppContext'

export default function Resources() {
  const { resources, toggleBookmark } = useApp()
  const [query, setQuery] = useState('')

  const filtered = useMemo(
    () => resources.filter((r) => r.title.toLowerCase().includes(query.toLowerCase())),
    [resources, query]
  )

  return (
    <motion.div variants={stagger(0.06)} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp}>
        <h1 className="font-display font-bold text-2xl sm:text-3xl flex items-center gap-2.5">
          <Library className="w-6 h-6 text-emerald-bright" /> Resources
        </h1>
        <p className="text-white/40 text-sm mt-1">YouTube videos fetched for your enrolled topics.</p>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Card className="p-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search resources..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-emerald/50"
            />
          </div>
        </Card>
      </motion.div>

      <motion.div variants={stagger(0.04)} className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((r) => (
          <motion.div key={r.id} variants={fadeUp}>
            <ResourceCard resource={r} bookmarked={r.is_bookmarked} onToggleBookmark={toggleBookmark} />
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 space-y-4">
            <p className="text-white/40 text-sm">
              {resources.length === 0
                ? 'No resources yet — visit a topic in your Skill Tree and click "Find videos" to fetch some.'
                : 'No resources match your search.'}
            </p>
            {resources.length === 0 && (
              <Link to="/app/subjects">
                <Button variant="secondary">Go to Subjects</Button>
              </Link>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}