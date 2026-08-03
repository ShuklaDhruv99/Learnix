import { useMemo, useRef, useState } from 'react'
import { Search, BookOpen, Target as TargetIcon, Library, Award, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import subjects from '../../data/subjects.json'
import topics from '../../data/topics.json'
import resources from '../../data/resources.json'
import achievements from '../../data/achievements.json'

const TYPE_META = {
  subject: { icon: BookOpen, label: 'Subject', to: '/app/subjects' },
  topic: { icon: TargetIcon, label: 'Topic', to: '/app/skill-tree' },
  resource: { icon: Library, label: 'Resource', to: '/app/resources' },
  achievement: { icon: Award, label: 'Achievement', to: '/app/achievements' },
}

export default function SearchBar({ compact = false }) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const navigate = useNavigate()
  const inputRef = useRef(null)

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    const s = subjects.filter((x) => x.name.toLowerCase().includes(q)).map((x) => ({ type: 'subject', id: x.id, title: x.name }))
    const t = topics.filter((x) => x.name.toLowerCase().includes(q)).map((x) => ({ type: 'topic', id: x.id, title: x.name }))
    const r = resources.filter((x) => x.title.toLowerCase().includes(q)).map((x) => ({ type: 'resource', id: x.id, title: x.title }))
    const a = achievements.filter((x) => x.name.toLowerCase().includes(q)).map((x) => ({ type: 'achievement', id: x.id, title: x.name }))
    return [...s, ...t, ...r, ...a].slice(0, 8)
  }, [query])

  return (
    <div className={`relative ${compact ? 'w-full' : 'w-full max-w-md'}`}>
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Search subjects, topics, resources..."
          className="w-full pl-10 pr-9 py-2.5 rounded-xl glass text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-emerald/50"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <AnimatePresence>
        {focused && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 left-0 right-0 glass-strong rounded-xl overflow-hidden shadow-card z-50"
          >
            {results.map((res) => {
              const meta = TYPE_META[res.type]
              const Icon = meta.icon
              return (
                <button
                  key={`${res.type}-${res.id}`}
                  onClick={() => {
                    navigate(meta.to)
                    setQuery('')
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-left transition-colors"
                >
                  <Icon className="w-4 h-4 text-emerald-bright shrink-0" />
                  <span className="text-sm truncate">{res.title}</span>
                  <span className="ml-auto text-[10px] uppercase tracking-wide text-white/30 font-mono shrink-0">
                    {meta.label}
                  </span>
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
