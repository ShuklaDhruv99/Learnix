import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Library, Search, SlidersHorizontal } from 'lucide-react'
import ResourceCard from '../components/cards/ResourceCard'
import Card from '../components/ui/Card'
import { stagger, fadeUp } from '../animations/variants'
import resourcesData from '../data/resources.json'
import bookmarksData from '../data/bookmarks.json'

const typeFilters = [
  { id: 'all', label: 'All' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'pdf', label: 'PDF' },
  { id: 'article', label: 'Articles' },
  { id: 'mcq', label: 'MCQs' },
  { id: 'coding', label: 'Coding' },
]

const sortOptions = [
  { id: 'popular', label: 'Most Popular' },
  { id: 'viewed', label: 'Most Viewed' },
  { id: 'rated', label: 'Highest Rated' },
  { id: 'newest', label: 'Newest' },
]

function parseViews(v) {
  const n = parseFloat(v)
  if (v.includes('M')) return n * 1_000_000
  if (v.includes('K')) return n * 1000
  return n
}

export default function Resources() {
  const [query, setQuery] = useState('')
  const [type, setType] = useState('all')
  const [sort, setSort] = useState('popular')

  const filtered = useMemo(() => {
    let list = resourcesData.filter((r) => (type === 'all' || r.type === type) && r.title.toLowerCase().includes(query.toLowerCase()))
    if (sort === 'viewed') list = [...list].sort((a, b) => parseViews(b.views) - parseViews(a.views))
    else if (sort === 'rated') list = [...list].sort((a, b) => b.rating - a.rating)
    else if (sort === 'newest') list = [...list].reverse()
    return list
  }, [query, type, sort])

  return (
    <motion.div variants={stagger(0.06)} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp}>
        <h1 className="font-display font-bold text-2xl sm:text-3xl flex items-center gap-2.5">
          <Library className="w-6 h-6 text-emerald-bright" /> Resources
        </h1>
        <p className="text-white/40 text-sm mt-1">Curated videos, notes, PDFs and practice for every topic.</p>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Card className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search resources..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-emerald/50"
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {typeFilters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setType(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    type === f.id ? 'bg-emerald/15 border-emerald/40 text-emerald-bright' : 'border-white/[0.06] text-white/50 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs text-white/40">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-transparent border border-white/[0.06] rounded-lg px-2.5 py-1.5 text-white/70 focus:outline-none"
              >
                {sortOptions.map((s) => (
                  <option key={s.id} value={s.id} className="bg-base-900">
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={stagger(0.04)} className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((r) => (
          <motion.div key={r.id} variants={fadeUp}>
            <ResourceCard resource={r} bookmarked={bookmarksData.resources.includes(r.id)} />
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <p className="text-white/30 text-sm col-span-full text-center py-12">No resources match your filters.</p>
        )}
      </motion.div>
    </motion.div>
  )
}
