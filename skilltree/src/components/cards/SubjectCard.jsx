import { Clock, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import ProgressRing from '../ui/ProgressRing'
import { getIcon } from '../../utils/iconMap'
import { accentMap } from '../../utils/xp'

export default function SubjectCard({ subject }) {
  const Icon = getIcon(subject.icon)
  const a = accentMap[subject.accent] || accentMap.emerald

  return (
    <Link to={`/app/skill-tree?subject=${subject.id}`}>
      <Card hover glow={subject.accent} className="p-5 group h-full">
        <div
          className={`absolute -top-10 -right-10 w-32 h-32 rounded-full ${a.bgSoft} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        />
        <div className="relative flex items-start justify-between mb-4">
          <div className={`w-11 h-11 rounded-xl ${a.bgSoft} border ${a.border} flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${a.text}`} />
          </div>
          <ProgressRing value={subject.completion} size={56} strokeWidth={5} accent={subject.accent} />
        </div>

        <h3 className="font-display font-semibold text-lg mb-1 relative">{subject.name}</h3>
        <p className="text-xs text-white/40 mb-4 relative">
          {subject.topicsCompleted} / {subject.topicsTotal} topics
        </p>

        <div className="flex items-center gap-2 flex-wrap relative">
          <Badge accent={subject.accent}>{subject.difficulty}</Badge>
          <span className="inline-flex items-center gap-1 text-xs text-white/40">
            <Clock className="w-3.5 h-3.5" /> {subject.estimatedHours}h
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-white/40 ml-auto font-mono">
            <Zap className="w-3.5 h-3.5 text-gold-bright" /> {subject.xpEarned.toLocaleString()}
          </span>
        </div>
      </Card>
    </Link>
  )
}
