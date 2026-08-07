import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Code2, ArrowLeft, Loader2, Sparkles, Lightbulb, CheckCircle2 } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useApp } from '../contexts/AppContext'
import { stagger, fadeUp } from '../animations/variants'

const COUNT_OPTIONS = [3, 5, 8]

function looksLikeCode(text) {
  if (!text) return false
  return /[{};()<>=]|^\s*(def|function|class|import|const|let|var|for|if|return)\b/m.test(text)
}

export default function CodePracticePage() {
  const { topicId } = useParams()
  const navigate = useNavigate()
  const { generateCodePractice, reviewCodeAttempt } = useApp()

  const [status, setStatus] = useState('setup') // setup | loading | active | done | error
  const [numQuestions, setNumQuestions] = useState(5)
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [error, setError] = useState(null)

  const [userCode, setUserCode] = useState({})
  const [showSolution, setShowSolution] = useState({})
  const [feedback, setFeedback] = useState({})
  const [feedbackLoading, setFeedbackLoading] = useState(false)

  async function handleStart() {
    setStatus('loading')
    setError(null)
    try {
      const data = await generateCodePractice(topicId, numQuestions)
      setQuestions(data.questions)
      setCurrent(0)
      setUserCode({})
      setShowSolution({})
      setFeedback({})
      setStatus('active')
    } catch (err) {
      setError(err?.data?.error || 'Failed to generate code practice.')
      setStatus('error')
    }
  }

  async function handleGetFeedback() {
    const q = questions[current]
    const code = userCode[current] || ''
    if (!code.trim()) return
    setFeedbackLoading(true)
    try {
      const result = await reviewCodeAttempt(q.problem_statement, q.solution_code, code)
      setFeedback((prev) => ({ ...prev, [current]: result.feedback }))
    } catch (err) {
      setFeedback((prev) => ({ ...prev, [current]: 'Failed to get feedback — try again.' }))
    } finally {
      setFeedbackLoading(false)
    }
  }

  const q = questions[current]

  return (
    <motion.div variants={stagger(0.06)} initial="hidden" animate="show" className="max-w-4xl mx-auto space-y-6">
      <motion.button
        variants={fadeUp}
        onClick={() => navigate(-1)}
        className="text-sm text-white/50 hover:text-white inline-flex items-center gap-1.5"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Topic
      </motion.button>

      <motion.div variants={fadeUp}>
        <Card className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-blue/10 border border-blue/30 flex items-center justify-center shrink-0">
              <Code2 className="w-5 h-5 text-blue-bright" />
            </div>
            <h1 className="font-display font-bold text-xl">Applied Practice</h1>
          </div>

          {status === 'setup' && (
            <div className="space-y-4">
              <p className="text-sm text-white/50">Practice writing real code for this topic, with AI feedback and model solutions.</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/40">Problems:</span>
                {COUNT_OPTIONS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setNumQuestions(n)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      numQuestions === n ? 'bg-blue/15 border-blue/40 text-blue-bright' : 'border-white/[0.06] text-white/50 hover:text-white'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <Button onClick={handleStart}>Start Practice</Button>
            </div>
          )}

          {status === 'loading' && (
            <div className="flex items-center gap-2 text-white/50 text-sm py-8 justify-center">
              <Loader2 className="w-4 h-4 animate-spin" /> Generating practice problems...
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <p className="text-sm text-red-400">{error}</p>
              <Button variant="secondary" onClick={() => setStatus('setup')}>Try Again</Button>
            </div>
          )}

          {status === 'active' && q && (
            <div className="space-y-5">
              <span className="text-xs font-mono text-white/40">Problem {current + 1} of {questions.length}</span>

              <p className="text-base text-white/85 leading-relaxed">{q.problem_statement}</p>

              <div>
                <label className="text-xs text-white/40 mb-1.5 block">Your Attempt</label>
                <textarea
                  value={userCode[current] || q.starter_code || ''}
                  onChange={(e) => setUserCode((prev) => ({ ...prev, [current]: e.target.value }))}
                  rows={10}
                  placeholder="Write your answer or code here..."
                  className="w-full rounded-xl bg-black/40 border border-white/[0.08] p-4 text-sm font-mono text-emerald-bright/90 placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-blue/50 resize-y"
                  spellCheck={false}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Sparkles}
                  onClick={handleGetFeedback}
                  disabled={feedbackLoading}
                >
                  {feedbackLoading ? 'Getting feedback...' : 'Get AI Feedback'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Lightbulb}
                  onClick={() => setShowSolution((prev) => ({ ...prev, [current]: !prev[current] }))}
                >
                  {showSolution[current] ? 'Hide Solution' : 'Give Solution'}
                </Button>
              </div>

              {feedback[current] && (
                <div className="rounded-xl bg-blue/5 border border-blue/20 p-4">
                  <p className="text-xs font-semibold text-blue-bright uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> AI Feedback
                  </p>
                  <p className="text-sm text-white/75 leading-relaxed">{feedback[current]}</p>
                </div>
              )}
              {showSolution[current] && (
                <div className="rounded-xl bg-emerald/5 border border-emerald/20 p-4 space-y-3">
                  <p className="text-xs font-semibold text-emerald-bright uppercase tracking-wide flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Solution
                  </p>
                  {q.is_code ? (
                    <pre className="bg-black/40 rounded-lg p-3 overflow-x-auto">
                      <code className="text-sm font-mono text-emerald-bright/90 whitespace-pre">{q.solution_code}</code>
                    </pre>
                  ) : (
                    <p className="text-sm text-white/75 leading-relaxed bg-white/[0.03] rounded-lg p-3 whitespace-pre-wrap">{q.solution_code}</p>
                  )}
                  <p className="text-sm text-white/70 leading-relaxed">{q.solution_explanation}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <Button variant="secondary" size="sm" onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}>Prev</Button>
                {current === questions.length - 1 ? (
                  <Button size="sm" onClick={() => setStatus('done')}>Finish</Button>
                ) : (
                  <Button variant="secondary" size="sm" onClick={() => setCurrent((c) => c + 1)}>Next</Button>
                )}
              </div>
            </div>
          )}

          {status === 'done' && (
            <div className="text-center py-6 space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-emerald/10 border border-emerald/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7 text-emerald-bright" />
              </div>
              <div>
                <p className="font-display font-bold text-xl">Practice Complete</p>
                <p className="text-sm text-white/40 mt-1">You worked through {questions.length} problem{questions.length !== 1 ? 's' : ''}.</p>
              </div>

              <div className="flex justify-center gap-6 text-sm">
                <div>
                  <p className="font-display font-bold text-2xl text-blue-bright">{Object.keys(userCode).filter((k) => userCode[k]?.trim()).length}</p>
                  <p className="text-xs text-white/40 mt-0.5">Attempted</p>
                </div>
                <div>
                  <p className="font-display font-bold text-2xl text-purple-bright">{Object.values(feedback).filter(Boolean).length}</p>
                  <p className="text-xs text-white/40 mt-0.5">Got AI Feedback</p>
                </div>
                <div>
                  <p className="font-display font-bold text-2xl text-emerald-bright">{Object.values(showSolution).filter(Boolean).length}</p>
                  <p className="text-xs text-white/40 mt-0.5">Viewed Solutions</p>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <Button variant="secondary" onClick={() => setStatus('setup')}>Practice Again</Button>
                <Button onClick={() => navigate(-1)}>Back to Topic</Button>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  )
}