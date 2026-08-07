import { motion } from 'framer-motion'
import { Award, Trophy } from 'lucide-react'
import AchievementCard from '../components/cards/AchievementCard'
import Card from '../components/ui/Card'
import { stagger, fadeUp } from '../animations/variants'
import { useApp } from '../contexts/AppContext'

export default function Achievements() {
  const { achievements } = useApp()
  const unlockedCount = achievements.filter((a) => a.unlocked).length

  return (
    <motion.div variants={stagger(0.06)} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl flex items-center gap-2.5">
            <Award className="w-6 h-6 text-gold-bright" /> Achievements
          </h1>
          <p className="text-white/40 text-sm mt-1">{unlockedCount} of {achievements.length} badges unlocked.</p>
        </div>
        <Card className="px-5 py-3 flex items-center gap-3">
          <Trophy className="w-5 h-5 text-gold-bright" />
          <div>
            <p className="font-display font-bold text-lg leading-none">{unlockedCount}/{achievements.length}</p>
            <p className="text-[10px] text-white/40 uppercase tracking-wide">Unlocked</p>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={stagger(0.04)} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {achievements.map((a) => (
          <motion.div key={a.id} variants={fadeUp}>
            <AchievementCard achievement={a} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}