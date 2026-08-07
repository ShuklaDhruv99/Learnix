import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LayoutGrid, Compass, UploadCloud } from 'lucide-react'
import SubjectCard from '../components/cards/SubjectCard'
import Tabs from '../components/ui/Tabs'
import Button from '../components/ui/Button'
import { stagger, fadeUp } from '../animations/variants'
import { useApp } from '../contexts/AppContext'

const viewTabs = [
  { id: 'mine', label: 'My Subjects' },
  { id: 'discover', label: 'Discover' },
]

export default function Subjects() {
  const { subjects, subjectsLoading, enrollInSubject } = useApp()
  const [view, setView] = useState('mine')

  const mySubjects = subjects.filter((s) => s.is_enrolled)
  const discoverSubjects = subjects.filter((s) => !s.is_enrolled)
  const visible = view === 'mine' ? mySubjects : discoverSubjects

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
          <p className="text-white/40 text-sm mt-1">
            {view === 'mine' ? `${mySubjects.length} subjects you're enrolled in.` : `${discoverSubjects.length} subjects available to join.`}
          </p>
        </div>
        <Tabs tabs={viewTabs} active={view} onChange={setView} />
      </motion.div>

      {view === 'mine' && mySubjects.length === 0 && (
        <motion.div variants={fadeUp} className="text-center py-16 space-y-4">
          <Compass className="w-10 h-10 mx-auto text-white/20" />
          <p className="text-white/40 text-sm">You haven't enrolled in any subjects yet.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="secondary" onClick={() => setView('discover')}>Browse Existing Subjects</Button>
            <Link to="/app/syllabus-upload">
              <Button iconRight={UploadCloud}>Generate From Syllabus</Button>
            </Link>
          </div>
        </motion.div>
      )}

      {view === 'discover' && discoverSubjects.length === 0 && (
        <motion.div variants={fadeUp} className="text-center py-16">
          <p className="text-white/40 text-sm">No other subjects available right now — you're enrolled in everything!</p>
        </motion.div>
      )}

      {visible.length > 0 && (
        <motion.div variants={stagger(0.05)} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map((s) => (
            <motion.div key={s.id} variants={fadeUp}>
              <SubjectCard subject={s} onEnroll={() => enrollInSubject(s.id)} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}