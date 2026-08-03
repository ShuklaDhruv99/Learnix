import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Flame, Clock3, Target, TrendingUp, Zap, ArrowRight, Sparkles } from 'lucide-react'
import Card from '../components/ui/Card'
import XPBar from '../components/ui/XPBar'
import ProgressRing from '../components/ui/ProgressRing'
import Button from '../components/ui/Button'
import SubjectCard from '../components/cards/SubjectCard'
import { useApp } from '../contexts/AppContext'
import { stagger, fadeUp } from '../animations/variants'
import { getIcon } from '../utils/iconMap'
import { accentMap } from '../utils/xp'
import subjects from '../data/subjects.json'
import progress from '../data/progress.json'
import topics from '../data/topics.json'

export default function Dashboard() {
  const { student } = useApp()
  const missionTopic = topics.find((t) => t.id === progress.todaysMission.topicId)
  const MissionIcon = getIcon(missionTopic?.icon || 'Target')

  const statCards = [
    { label: 'Current Level', value: student.level, icon: Sparkles, accent: 'emerald', suffix: '' },
    { label: 'Study Streak', value: student.streakDays, icon: Flame, accent: 'gold', suffix: ' days' },
    { label: 'Hours Today', value: student.hoursStudiedToday, icon: Clock3, accent: 'blue', suffix: 'h' },
    { label: 'Daily Goal', value: Math.round((student.dailyGoalProgressMinutes / student.dailyGoalMinutes) * 100), icon: Target, accent: 'purple', suffix: '%' },
  ]

  return (
    <motion.div variants={stagger(0.06)} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl">Welcome back, {student.name.split(' ')[0]} 👋</h1>
          <p className="text-white/40 text-sm mt-1">Here's where your journey stands today.</p>
        </div>
        <Link to="/app/skill-tree">
          <Button iconRight={ArrowRight}>Continue Learning</Button>
        </Link>
      </motion.div>

      {/* Stat cards */}
      <motion.div variants={stagger(0.05)} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => {
          const a = accentMap[s.accent]
          return (
            <motion.div key={s.label} variants={fadeUp}>
              <Card className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${a.bgSoft}`}>
                    <s.icon className={`w-4.5 h-4.5 ${a.text}`} />
                  </div>
                </div>
                <p className="font-display font-bold text-2xl">
                  {s.value}
                  <span className="text-sm text-white/40 font-body">{s.suffix}</span>
                </p>
                <p className="text-xs text-white/40 mt-1">{s.label}</p>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Today's mission */}
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <Card className="p-6 h-full relative overflow-hidden" glow="purple">
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-purple/10 blur-[100px]" />
            <div className="relative flex items-center justify-between mb-5">
              <div>
                <span className="text-xs font-mono text-purple-bright uppercase tracking-widest">Today's Mission</span>
                <h2 className="font-display font-bold text-xl mt-1">{progress.todaysMission.topicName}</h2>
                <p className="text-xs text-white/40 mt-0.5">{progress.todaysMission.subjectName}</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-purple/10 border border-purple/30 flex items-center justify-center shrink-0">
                <MissionIcon className="w-6 h-6 text-purple-bright" />
              </div>
            </div>

            <div className="relative space-y-3">
              <div className="flex justify-between text-xs text-white/50">
                <span>{progress.todaysMission.completedMinutes} / {progress.todaysMission.targetMinutes} min today</span>
                <span className="inline-flex items-center gap-1 text-gold-bright font-mono">
                  <Zap className="w-3.5 h-3.5" /> +{progress.todaysMission.xpReward} XP
                </span>
              </div>
              <XPBar current={progress.todaysMission.completedMinutes} max={progress.todaysMission.targetMinutes} accent="purple" />
            </div>

            <Link to="/app/skill-tree" className="relative block mt-6">
              <Button variant="purple" className="w-full sm:w-auto">Resume Mission</Button>
            </Link>
          </Card>
        </motion.div>

        {/* Overall progress ring */}
        <motion.div variants={fadeUp}>
          <Card className="p-6 h-full flex flex-col items-center justify-center text-center">
            <span className="text-xs font-mono text-emerald-bright uppercase tracking-widest mb-4">Overall Progress</span>
            <ProgressRing value={progress.overallProgress} size={128} strokeWidth={10} accent="emerald" />
            <p className="text-xs text-white/40 mt-4 leading-relaxed">
              Across all {subjects.length} enrolled subjects
            </p>
          </Card>
        </motion.div>
      </div>

      {/* Subjects preview */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-lg flex items-center gap-2">
            <TrendingUp className="w-4.5 h-4.5 text-emerald-bright" /> Your Subjects
          </h2>
          <Link to="/app/subjects" className="text-sm text-emerald-bright hover:text-emerald-bright/80 inline-flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.slice(0, 3).map((s) => (
            <SubjectCard key={s.id} subject={s} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
