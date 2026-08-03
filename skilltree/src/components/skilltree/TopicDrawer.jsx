import { useMemo, useState } from 'react'
import { Clock, Zap, BarChart3, CheckCircle2, Bookmark, ListChecks, Link2 } from 'lucide-react'
import Drawer from '../ui/Drawer'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import ResourceCard from '../cards/ResourceCard'
import { getIcon } from '../../utils/iconMap'
import { difficultyColor } from '../../utils/xp'
import topics from '../../data/topics.json'
import resources from '../../data/resources.json'

export default function TopicDrawer({ topicId, open, onClose }) {
  const [bookmarked, setBookmarked] = useState(false)
  const [markedLearned, setMarkedLearned] = useState(false)
  const [note, setNote] = useState('')

  const topic = useMemo(() => topics.find((t) => t.id === topicId), [topicId])
  const prereqTopics = useMemo(
    () => (topic ? topic.prerequisites.map((id) => topics.find((t) => t.id === id)).filter(Boolean) : []),
    [topic]
  )
  const topicResources = useMemo(() => resources.filter((r) => r.topicId === topicId), [topicId])

  if (!topic) return <Drawer open={open} onClose={onClose} title="Topic" />

  const Icon = getIcon(topic.icon)
  const isCompleted = topic.status === 'completed' || markedLearned

  return (
    <Drawer open={open} onClose={onClose} title="Topic Details">
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
            <Icon className="w-6 h-6 text-emerald-bright" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl leading-tight">{topic.name}</h2>
            <span className={`inline-block mt-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full border ${difficultyColor(topic.difficulty)}`}>
              {topic.difficulty}
            </span>
          </div>
        </div>

        <p className="text-sm text-white/60 leading-relaxed">{topic.description}</p>

        <div className="grid grid-cols-3 gap-2">
          <div className="glass rounded-xl p-3 text-center">
            <Clock className="w-4 h-4 mx-auto mb-1 text-blue-bright" />
            <p className="text-sm font-semibold font-mono">{topic.estimatedHours}h</p>
            <p className="text-[9px] text-white/40 uppercase">Estimate</p>
          </div>
          <div className="glass rounded-xl p-3 text-center">
            <Zap className="w-4 h-4 mx-auto mb-1 text-gold-bright" />
            <p className="text-sm font-semibold font-mono">{topic.xp}</p>
            <p className="text-[9px] text-white/40 uppercase">XP Reward</p>
          </div>
          <div className="glass rounded-xl p-3 text-center">
            <BarChart3 className="w-4 h-4 mx-auto mb-1 text-purple-bright" />
            <p className="text-sm font-semibold font-mono">{isCompleted ? 100 : topic.completion}%</p>
            <p className="text-[9px] text-white/40 uppercase">Complete</p>
          </div>
        </div>

        {prereqTopics.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5" /> Prerequisites
            </h4>
            <div className="flex flex-wrap gap-2">
              {prereqTopics.map((p) => (
                <Badge key={p.id} accent={p.status === 'completed' ? 'gold' : 'emerald'}>
                  {p.status === 'completed' && <CheckCircle2 className="w-3 h-3" />} {p.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant={markedLearned || topic.status === 'completed' ? 'secondary' : 'primary'}
            className="flex-1"
            icon={CheckCircle2}
            onClick={() => setMarkedLearned(true)}
            disabled={topic.status === 'completed' || markedLearned}
          >
            {topic.status === 'completed' || markedLearned ? 'Learned' : 'Mark Learned'}
          </Button>
          <Button variant="outline" size="md" onClick={() => setBookmarked((b) => !b)}>
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-gold-bright text-gold-bright' : ''}`} />
          </Button>
        </div>

        {topicResources.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-3">Recommended Resources</h4>
            <div className="grid grid-cols-1 gap-3">
              {topicResources.map((r) => (
                <ResourceCard key={r.id} resource={r} />
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <ListChecks className="w-3.5 h-3.5" /> Practice Questions
          </h4>
          <div className="glass rounded-xl p-3.5 text-sm text-white/50">
            12 practice questions available · {topic.difficulty} difficulty
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-2">Your Notes</h4>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Jot down anything worth remembering about this topic..."
            rows={4}
            className="w-full rounded-xl glass p-3 text-sm placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-emerald/50 resize-none"
          />
        </div>
      </div>
    </Drawer>
  )
}
