import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Flame, Target, TrendingUp, Zap, ArrowRight, Sparkles, Clock3 } from 'lucide-react'
import Card from '../components/ui/Card'
import XPBar from '../components/ui/XPBar'
import ProgressRing from '../components/ui/ProgressRing'
import Button from '../components/ui/Button'
import { useApp } from '../contexts/AppContext'
import { stagger, fadeUp } from '../animations/variants'

export default function Dashboard() {
  const { dashboard, dashboardLoading, currentUser } = useApp()

  if (dashboardLoading || !dashboard) {
    return (
      <div className="flex items-center justify-center h-96 text-white/40 text-sm">
        Loading your dashboard...
      </div>
    )
  }

  const { profile, todays_mission, overall_progress, weekly_goal_minutes, weekly_progress_minutes, recently_completed } = dashboard

  const statCards = [
    { label: 'Current Level', value: profile.level, icon: Sparkles, accent: 'emerald', suffix: '' },
    { label: 'Study Streak', value: profile.streak_days, icon: Flame, accent: 'gold', suffix: ' days' },
    { label: 'Total XP', value: profile.xp, icon: Zap, accent: 'blue', suffix: '' },
    { label: 'Weekly Goal', value: weekly_goal_minutes ? Math.round((weekly_progress_minutes / weekly_goal_minutes) * 100) : 0, icon: Target, accent: 'purple', suffix: '%' },
  ]

  const accentClasses = {
    emerald: { bgSoft: 'bg-emerald/10', text: 'text-emerald-bright' },
    gold: { bgSoft: 'bg-gold/10', text: 'text-gold-bright' },
    blue: { bgSoft: 'bg-blue/10', text: 'text-blue-bright' },
    purple: { bgSoft: 'bg-purple/10', text: 'text-purple-bright' },
  }

  return (
    <motion.div variants={stagger(0.06)} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl">Welcome back, {currentUser?.username || 'Learner'}</h1>
          <p className="text-white/40 text-sm mt-1">Here's where your journey stands today.</p>
        </div>
        <Link to="/app/skill-tree">
          <Button iconRight={ArrowRight}>Continue Learning</Button>
        </Link>
      </motion.div>

      <motion.div variants={stagger(0.05)} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => {
          const a = accentClasses[s.accent]
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
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <Card className="p-6 h-full relative overflow-hidden" glow="purple">
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-purple/10 blur-[100px]" />
            {todays_mission ? (
              <>
                <div className="relative flex items-center justify-between mb-5">
                  <div>
                    <span className="text-xs font-mono text-purple-bright uppercase tracking-widest">Today's Mission</span>
                    <h2 className="font-display font-bold text-xl mt-1">{todays_mission.topic_name}</h2>
                    <p className="text-xs text-white/40 mt-0.5">{todays_mission.subject_name}</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-purple/10 border border-purple/30 flex items-center justify-center shrink-0">
                    <Target className="w-6 h-6 text-purple-bright" />
                  </div>
                </div>
                <div className="relative space-y-3">
                  <span className="inline-flex items-center gap-1 text-gold-bright font-mono text-xs">
                    <Zap className="w-3.5 h-3.5" /> +{todays_mission.xp_reward} XP on completion
                  </span>
                </div>
                <Link to="/app/skill-tree" className="relative block mt-6">
                  <Button variant="purple" className="w-full sm:w-auto">Resume Mission</Button>
                </Link>
              </>
            ) : (
              <p className="text-white/50 text-sm relative">No active mission — head to the Skill Tree to pick a topic.</p>
            )}
          </Card>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Card className="p-6 h-full flex flex-col items-center justify-center text-center">
            <span className="text-xs font-mono text-emerald-bright uppercase tracking-widest mb-4">Overall Progress</span>
            <ProgressRing value={overall_progress} size={128} strokeWidth={10} accent="emerald" />
            <p className="text-xs text-white/40 mt-4 leading-relaxed">
              Across all your enrolled subjects
            </p>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={fadeUp}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-lg flex items-center gap-2">
            <Clock3 className="w-4.5 h-4.5 text-emerald-bright" /> Recently Completed
          </h2>
        </div>
        {recently_completed.length === 0 ? (
          <p className="text-sm text-white/40">Nothing completed yet — start your first topic!</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recently_completed.map((r) => (
              <Card key={r.topic_id} className="p-4">
                <p className="font-display font-semibold text-sm">{r.topic_name}</p>
                <p className="text-xs text-white/40 mt-1">{r.subject_name}</p>
                <p className="text-xs text-gold-bright mt-2 flex items-center gap-1">
                  <Zap className="w-3 h-3" /> +{r.xp} XP
                </p>
              </Card>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}