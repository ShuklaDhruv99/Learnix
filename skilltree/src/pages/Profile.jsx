import { motion } from 'framer-motion'
import { Clock3, BookOpen, Flame, Award } from 'lucide-react'
import Card from '../components/ui/Card'
import AchievementCard from '../components/cards/AchievementCard'
import { useApp } from '../contexts/AppContext'
import { stagger, fadeUp } from '../animations/variants'

export default function Profile() {
  const { currentUser, dashboard, achievements, subjects } = useApp()
  const profile = dashboard?.profile
  const unlocked = achievements.filter((a) => a.unlocked).slice(0, 4)
  const subjectsCompleted = subjects.filter((s) => s.completion === 100).length

  const stats = [
    { icon: Clock3, label: 'Current Level', value: profile?.level ?? 1, accent: 'text-blue-bright' },
    { icon: BookOpen, label: 'Subjects Completed', value: subjectsCompleted, accent: 'text-emerald-bright' },
    { icon: Flame, label: 'Study Streak', value: `${profile?.streak_days ?? 0} days`, accent: 'text-gold-bright' },
    { icon: Award, label: 'Achievements', value: `${unlocked.length}/${achievements.length}`, accent: 'text-purple-bright' },
  ]

  return (
    <motion.div variants={stagger(0.06)} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp}>
        <h1 className="font-display font-bold text-2xl sm:text-3xl">Profile</h1>
        <p className="text-white/40 text-sm mt-1">Your learning identity, at a glance.</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-5">
        <motion.div variants={fadeUp}>
          <Card className="p-6 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-bright to-blue mx-auto flex items-center justify-center font-display font-bold text-2xl text-base-950 mb-4">
              {currentUser?.username?.[0]?.toUpperCase() || '?'}
            </div>
            <h3 className="font-display font-bold text-lg">{currentUser?.username || 'Learner'}</h3>
            <p className="text-xs text-white/40 mt-1">Level {profile?.level ?? 1} · {profile?.xp ?? 0} XP</p>
          </Card>
        </motion.div>

        <motion.div variants={fadeUp} className="lg:col-span-2 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s) => (
              <Card key={s.label} className="p-5">
                <s.icon className={`w-5 h-5 mb-2.5 ${s.accent}`} />
                <p className="font-display font-bold text-xl">{s.value}</p>
                <p className="text-xs text-white/40 mt-1">{s.label}</p>
              </Card>
            ))}
          </div>

          <Card className="p-5">
            <h3 className="font-display font-semibold mb-4">Recent Achievements</h3>
            {unlocked.length === 0 ? (
              <p className="text-sm text-white/40">No achievements unlocked yet.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {unlocked.map((a) => (
                  <AchievementCard key={a.id} achievement={a} />
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}