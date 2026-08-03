import { motion } from 'framer-motion'
import { Clock3, BookOpen, Flame, Award } from 'lucide-react'
import ProfileCard from '../components/cards/ProfileCard'
import Card from '../components/ui/Card'
import AchievementCard from '../components/cards/AchievementCard'
import { useApp } from '../contexts/AppContext'
import { stagger, fadeUp } from '../animations/variants'
import achievements from '../data/achievements.json'

export default function Profile() {
  const { student } = useApp()
  const unlocked = achievements.filter((a) => a.unlocked).slice(0, 4)

  const stats = [
    { icon: Clock3, label: 'Total Study Hours', value: `${student.totalStudyHours}h`, accent: 'text-blue-bright' },
    { icon: BookOpen, label: 'Subjects Completed', value: student.subjectsCompleted, accent: 'text-emerald-bright' },
    { icon: Flame, label: 'Longest Streak', value: `${student.streakDays} days`, accent: 'text-gold-bright' },
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
          <ProfileCard student={student} />
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {unlocked.map((a) => (
                <AchievementCard key={a.id} achievement={a} />
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
