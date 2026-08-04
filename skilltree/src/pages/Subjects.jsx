import { motion } from 'framer-motion'
import { useState } from 'react'
import { LayoutGrid } from 'lucide-react'
import SubjectCard from '../components/cards/SubjectCard'
import Tabs from '../components/ui/Tabs'
import { stagger, fadeUp } from '../animations/variants'
import { useApp } from '../contexts/AppContext'

const filters = [
  { id: 'all', label: 'All' },
  { id: 'progress', label: 'In Progress' },
  { id: 'done', label: 'Near Done' },
]

export default function Subjects() {
  const { subjects, subjectsLoading, enrollInSubject } = useApp()
  const [filter, setFilter] = useState('all')

  const filtered = subjects.filter((s) => {
    if (filter === 'progress') return s.completion > 0 && s.completion < 90
    if (filter === 'done') return s.completion >= 90
    return true
  })

  if (subjectsLoading) {
    return <div className="flex items-center justify-center h-96 text-white/40 text-sm">Loading subjects...</div>
  }

  return (
    <motion.div variants={stagger(0.06)} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl flex items-center gap-2.5">
            <LayoutGrid className="w-6 h-6 text-emerald-bright" /> Subjects
          </h1>
          <p className="text-white/40 text-sm mt-1">{subjects.length} subjects available.</p>
        </div>
        <Tabs tabs={filters} active={filter} onChange={setFilter} />
      </motion.div>
      <motion.div variants={stagger(0.05)} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((s) => (
          <motion.div key={s.id} variants={fadeUp}>
            <SubjectCard subject={s} onEnroll={() => enrollInSubject(s.id)} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}