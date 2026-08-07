import { useEffect, useState } from 'react'
import { BookOpenText, Sparkles, Code2, Terminal } from 'lucide-react'
import Card from '../ui/Card'
import { useApp } from '../../contexts/AppContext'

function CodeBlock({ code, label }) {
  if (!code) return null
  return (
    <div className="rounded-lg bg-black/40 border border-white/[0.06] overflow-hidden mt-2">
      {label && (
        <div className="px-3 py-1.5 border-b border-white/[0.06] flex items-center gap-1.5">
          <Code2 className="w-3 h-3 text-white/30" />
          <span className="text-[10px] text-white/40 font-mono uppercase">{label}</span>
        </div>
      )}
      <pre className="p-3 overflow-x-auto">
        <code className="text-xs font-mono text-emerald-bright/90 whitespace-pre">{code}</code>
      </pre>
    </div>
  )
}

export default function TopicSummary({ topicId }) {
  const { getTopicSummary } = useApp()
  const [tutorial, setTutorial] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getTopicSummary(topicId)
      .then(setTutorial)
      .catch((err) => setError(err?.data?.error || 'Failed to load tutorial.'))
      .finally(() => setLoading(false))
  }, [topicId])

  return (
    <Card className="p-6 sm:p-8">
      <h3 className="font-display font-semibold flex items-center gap-2 mb-4">
        <BookOpenText className="w-4.5 h-4.5 text-emerald-bright" /> Tutorial
      </h3>

      {loading ? (
        <p className="text-xs text-white/30">Generating your tutorial...</p>
      ) : error ? (
        <p className="text-xs text-red-400">{error}</p>
      ) : tutorial ? (
        <div className="space-y-8">
          {/* Concept */}
          {tutorial.concept && (
            <div>
              <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-2">Concept</h4>
              <p className="text-sm text-white/70 leading-relaxed">{tutorial.concept}</p>
            </div>
          )}

          {/* Key Points */}
          {tutorial.key_points?.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Key Points
              </h4>
              <div className="space-y-4">
                {tutorial.key_points.map((kp, i) => (
                  <div key={i} className="glass rounded-xl p-4">
                    <p className="text-sm font-semibold text-white mb-1">{kp.title}</p>
                    <p className="text-xs text-white/60 leading-relaxed">{kp.explanation}</p>
                    <CodeBlock code={kp.code} />
                    {kp.details?.length > 0 && (
                      <ul className="mt-3 space-y-1.5">
                        {kp.details.map((d, j) => (
                          <li key={j} className="flex items-start gap-2 text-xs text-white/50">
                            <span className="w-1 h-1 rounded-full bg-emerald-bright mt-1.5 shrink-0" />
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Examples */}
          {tutorial.examples?.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" /> Examples
              </h4>
              <div className="space-y-4">
                {tutorial.examples.map((ex, i) => (
                  <div key={i} className="glass rounded-xl p-4">
                    <p className="text-sm font-semibold text-white mb-1">{ex.title}</p>
                    <p className="text-xs text-white/60 leading-relaxed mb-1">{ex.description}</p>
                    <CodeBlock code={ex.code} label="Code" />
                    {ex.output && <CodeBlock code={ex.output} label="Output" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </Card>
  )
}