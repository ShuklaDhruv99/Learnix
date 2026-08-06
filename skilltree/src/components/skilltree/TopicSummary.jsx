import { useEffect, useState } from 'react'
import { BookOpenText, Sparkles } from 'lucide-react'
import Card from '../ui/Card'
import { useApp } from '../../contexts/AppContext'

export default function TopicSummary({ topicId }) {
  const { getTopicSummary } = useApp()
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getTopicSummary(topicId)
      .then(setSummary)
      .catch((err) => setError(err?.data?.error || 'Failed to load overview.'))
      .finally(() => setLoading(false))
  }, [topicId])

  return (
    <Card className="p-6 sm:p-8">
      <h3 className="font-display font-semibold flex items-center gap-2 mb-4">
        <BookOpenText className="w-4.5 h-4.5 text-emerald-bright" /> Overview
      </h3>

      {loading ? (
        <p className="text-xs text-white/30">Loading overview...</p>
      ) : error ? (
        <p className="text-xs text-red-400">{error}</p>
      ) : summary ? (
        <div className="space-y-4">
          <p className="text-sm text-white/70 leading-relaxed">{summary.summary}</p>
          {summary.key_concepts?.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Key Concepts
              </h4>
              <ul className="space-y-2">
                {summary.key_concepts.map((concept, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-bright mt-1.5 shrink-0" />
                    <span>{concept}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : null}
    </Card>
  )
}