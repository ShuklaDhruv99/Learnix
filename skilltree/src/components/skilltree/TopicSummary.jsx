import { useState } from 'react'
import { BookOpenText, Sparkles, Code2, Terminal, Loader2 } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { useApp } from '../../contexts/AppContext'

function CodeBlock({ code, output, isCode, label }) {
  if (!code) return null

  if (!isCode) {
    return (
      <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3 mt-2">
        {label && <p className="text-[10px] text-white/40 uppercase mb-1">{label}</p>}
        <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">{code}</p>
      </div>
    )
  }

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
  const [status, setStatus] = useState('idle') // idle | loading | loaded | error
  const [tutorial, setTutorial] = useState(null)
  const [error, setError] = useState(null)

  async function handleLoad() {
    setStatus('loading')
    setError(null)
    try {
      const data = await getTopicSummary(topicId)
      setTutorial(data)
      setStatus('loaded')
    } catch (err) {
      setError(err?.data?.error || 'Failed to load tutorial.')
      setStatus('error')
    }
  }

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold flex items-center gap-2">
          <BookOpenText className="w-4.5 h-4.5 text-emerald-bright" /> Tutorial
        </h3>
        {status === 'idle' && (
          <Button size="sm" onClick={handleLoad} icon={Sparkles}>View Tutorial</Button>
        )}
        {status === 'error' && (
          <Button size="sm" variant="secondary" onClick={handleLoad}>Try Again</Button>
        )}
      </div>

      {status === 'idle' && (
        <p className="text-sm text-white/40">Get a full breakdown of this topic — concept, key points, and worked code examples.</p>
      )}

      {status === 'loading' && (
        <div className="flex items-center gap-2 text-white/50 text-sm py-8 justify-center">
          <Loader2 className="w-4 h-4 animate-spin" /> Generating your tutorial...
        </div>
      )}

      {status === 'error' && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      {status === 'loaded' && tutorial && (
        <div className="space-y-8">
          {tutorial.concept && (
            <div>
              <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-2">Concept</h4>
              <p className="text-sm text-white/70 leading-relaxed">{tutorial.concept}</p>
            </div>
          )}

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
                    <CodeBlock code={kp.code} isCode={kp.is_code} />
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
                    <CodeBlock code={ex.code} isCode={ex.is_code} label={ex.is_code ? 'Code' : 'Answer'} />
                    {ex.output && <CodeBlock code={ex.output} isCode={ex.is_code} label={ex.is_code ? 'Output' : 'Result'} />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}