import { useMemo, useState, useEffect } from 'react'
import { Clock, Zap, BarChart3, CheckCircle2, Bookmark, ListChecks, Link2 } from 'lucide-react'
import Drawer from '../ui/Drawer'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { getIcon } from '../../utils/iconMap'
import { difficultyColor } from '../../utils/xp'
import { useApp } from '../../contexts/AppContext'

export default function TopicDrawer({ topicId, open, onClose, topicsData, onTopicCompleted }) {
  const { completeTopic } = useApp()
  const [completing, setCompleting] = useState(false)
  const [justCompleted, setJustCompleted] = useState(false)
  const [note, setNote] = useState('')

  useEffect(() => {
    setJustCompleted(false)
    setCompleting(false)
  }, [topicId])

  const topic = useMemo(() => topicsData?.find((t) => t.id === topicId), [topicId, topicsData])
  const prereqTopics = useMemo(
    () => (topic ? topic.prerequisites.map((id) => topicsData.find((t) => t.id === id)).filter(Boolean) : []),
    [topic, topicsData]
  )

  if (!topic) return <Drawer open={open} onClose={onClose} title="Topic" />

  const Icon = getIcon(topic.icon || 'BookOpen')
  const isCompleted = topic.status === 'completed' || justCompleted

  async function handleMarkLearned() {
    setCompleting(true)
    try {
      await completeTopic(topic.id)
      setJustCompleted(true)
      await onTopicCompleted?.()
    } catch (err) {
      console.error('Failed to complete topic', err)
    } finally {
      setCompleting(false)
    }
  }

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
            <p className="text-sm font-semibold font-mono">{topic.estimated_hours}h</p>
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
            variant={isCompleted ? 'secondary' : 'primary'}
            className="flex-1"
            icon={CheckCircle2}
            onClick={handleMarkLearned}
            disabled={isCompleted || completing || topic.status === 'locked'}
          >
            {completing ? 'Saving...' : isCompleted ? 'Learned' : 'Mark Learned'}
          </Button>
        </div>

        {topic.status === 'locked' && (
          <p className="text-xs text-white/40 -mt-4">Complete the prerequisites above to unlock this topic.</p>
        )}

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