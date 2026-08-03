import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'
import Card from '../components/ui/Card'
import Tabs from '../components/ui/Tabs'
import LeaderboardCard from '../components/cards/LeaderboardCard'
import { stagger, fadeUp } from '../animations/variants'
import leaderboard from '../data/leaderboard.json'

const tabs = [
  { id: 'friends', label: 'Friends' },
  { id: 'college', label: 'College' },
  { id: 'global', label: 'Global' },
]

export default function Leaderboard() {
  const [tab, setTab] = useState('college')
  const entries = leaderboard[tab]
  const podium = entries.slice(0, 3)

  return (
    <motion.div variants={stagger(0.06)} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-gold-bright" /> Leaderboard
          </h1>
          <p className="text-white/40 text-sm mt-1">See how you stack up.</p>
        </div>
        <Tabs tabs={tabs} active={tab} onChange={setTab} />
      </motion.div>

      {podium.length === 3 && (
        <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3 items-end">
          {[podium[1], podium[0], podium[2]].map((p, i) => (
            <Card key={p.name} className={`p-4 text-center ${i === 1 ? 'py-7 shadow-glow-gold border-gold/30' : ''}`}>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-bright to-blue mx-auto flex items-center justify-center font-display font-bold text-base-950 mb-2">
                {p.avatar}
              </div>
              <p className="text-sm font-semibold truncate">{p.name}</p>
              <p className="text-xs text-gold-bright font-mono mt-1">{p.xp.toLocaleString()} XP</p>
              <p className="text-[10px] text-white/30 mt-1">#{p.rank}</p>
            </Card>
          ))}
        </motion.div>
      )}

      <motion.div variants={fadeUp}>
        <Card className="p-3">
          <div className="space-y-1">
            {entries.map((entry, i) => (
              <LeaderboardCard key={entry.name + entry.rank} entry={entry} index={i} />
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}
