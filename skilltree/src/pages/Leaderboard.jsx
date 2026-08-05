import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'
import Card from '../components/ui/Card'
import LeaderboardCard from '../components/cards/LeaderboardCard'
import { stagger, fadeUp } from '../animations/variants'
import { useApp } from '../contexts/AppContext'

export default function Leaderboard() {
  const { leaderboard, currentUser } = useApp()
  const podium = leaderboard.slice(0, 3)

  return (
    <motion.div variants={stagger(0.06)} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp}>
        <h1 className="font-display font-bold text-2xl sm:text-3xl flex items-center gap-2.5">
          <Trophy className="w-6 h-6 text-gold-bright" /> Leaderboard
        </h1>
        <p className="text-white/40 text-sm mt-1">See how you stack up.</p>
      </motion.div>

      {podium.length === 3 && (
        <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3 items-end">
          {[podium[1], podium[0], podium[2]].map((p, i) => (
            <Card key={p.username} className={`p-4 text-center ${i === 1 ? 'py-7 shadow-glow-gold border-gold/30' : ''}`}>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-bright to-blue mx-auto flex items-center justify-center font-display font-bold text-base-950 mb-2">
                {p.username[0].toUpperCase()}
              </div>
              <p className="text-sm font-semibold truncate">{p.username}</p>
              <p className="text-xs text-gold-bright font-mono mt-1">{p.total_xp.toLocaleString()} XP</p>
              <p className="text-[10px] text-white/30 mt-1">#{p.rank}</p>
            </Card>
          ))}
        </motion.div>
      )}

      <motion.div variants={fadeUp}>
        <Card className="p-3">
          <div className="space-y-1">
            {leaderboard.map((entry, i) => (
              <LeaderboardCard key={entry.username} entry={entry} index={i} isYou={entry.username === currentUser?.username} />
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}