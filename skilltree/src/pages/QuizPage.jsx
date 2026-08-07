import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ListChecks, CheckCircle2, XCircle, ArrowLeft, Trophy, Loader2, Timer, Sparkles } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useApp } from '../contexts/AppContext'
import { stagger, fadeUp } from '../animations/variants'

const COUNT_OPTIONS = [5, 10, 15, 20]
const SECONDS_PER_QUESTION = 60

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function QuizPage() {
  const { topicId } = useParams()
  const navigate = useNavigate()
  const { generateQuiz, submitQuizAttempt } = useApp()

  const [status, setStatus] = useState('setup') // setup | loading | active | submitted | error
  const [numQuestions, setNumQuestions] = useState(5)
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState([]) // index per question, null if unanswered
  const [error, setError] = useState(null)
  const [revealedExplanations, setRevealedExplanations] = useState({})

  const [timeLeft, setTimeLeft] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    return () => clearInterval(timerRef.current)
  }, [])

  async function handleStart() {
    setStatus('loading')
    setError(null)
    try {
      const data = await generateQuiz(topicId, numQuestions)
      setQuestions(data.questions)
      setSelectedAnswers(new Array(data.questions.length).fill(null))
      setCurrent(0)
      setRevealedExplanations({})
      setTimeLeft(data.questions.length * SECONDS_PER_QUESTION)
      setStatus('active')

      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current)
            return 0
          }
          return t - 1
        })
      }, 1000)
    } catch (err) {
      setError(err?.data?.error || 'Failed to generate quiz.')
      setStatus('error')
    }
  }

  useEffect(() => {
    if (status === 'active' && timeLeft === 0) {
      handleSubmit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, status])

  function handleSelect(optionIndex) {
    setSelectedAnswers((prev) => {
      const next = [...prev]
      next[current] = optionIndex
      return next
    })
  }

  function goNext() {
    if (current + 1 < questions.length) {
      setCurrent((c) => c + 1)
    }
  }

  function goPrev() {
    if (current > 0) setCurrent((c) => c - 1)
  }

  async function handleSubmit() {
    clearInterval(timerRef.current)
    const finalScore = questions.reduce(
      (acc, q, i) => acc + (selectedAnswers[i] === q.correct_index ? 1 : 0),
      0
    )
    try {
      await submitQuizAttempt(topicId, finalScore, questions.length)
    } catch (err) {
      console.error('Failed to save quiz attempt', err)
    }
    setStatus('submitted')
  }

  function toggleExplanation(i) {
    setRevealedExplanations((prev) => ({ ...prev, [i]: !prev[i] }))
  }

  const score = useMemo(
    () => questions.reduce((acc, q, i) => acc + (selectedAnswers[i] === q.correct_index ? 1 : 0), 0),
    [questions, selectedAnswers]
  )

  const answeredCount = selectedAnswers.filter((a) => a !== null).length

  return (
    <motion.div variants={stagger(0.06)} initial="hidden" animate="show" className="max-w-6xl mx-auto space-y-6">
      <motion.button
        variants={fadeUp}
        onClick={() => navigate(-1)}
        className="text-sm text-white/50 hover:text-white inline-flex items-center gap-1.5"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Topic
      </motion.button>

      {status === 'active' && (
        <motion.div variants={fadeUp}>
          <div className={`rounded-xl px-5 py-4 flex items-center justify-between ${timeLeft <= 30 ? 'bg-red-500/15 border border-red-500/40' : 'bg-purple/10 border border-purple/30'}`}>
            <div>
              <p className="text-xs text-white/50 uppercase tracking-wide">Time Remaining</p>
              <p className="text-[10px] text-white/30 mt-0.5">Question {current + 1} of {questions.length} · {answeredCount} answered</p>
            </div>
            <span className={`text-3xl font-mono font-bold ${timeLeft <= 30 ? 'text-red-400' : 'text-white'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </motion.div>
      )}

      <motion.div variants={fadeUp}>
        <Card className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-purple/10 border border-purple/30 flex items-center justify-center shrink-0">
              <ListChecks className="w-5 h-5 text-purple-bright" />
            </div>
            <h1 className="font-display font-bold text-xl">Practice Quiz</h1>
          </div>

          {status === 'setup' && (
            <div className="space-y-4">
              <p className="text-sm text-white/50">Test your understanding with a timed quiz on this topic.</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/40">Questions:</span>
                {COUNT_OPTIONS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setNumQuestions(n)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      numQuestions === n ? 'bg-purple/15 border-purple/40 text-purple-bright' : 'border-white/[0.06] text-white/50 hover:text-white'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <p className="text-xs text-white/30">Time limit: {numQuestions} minute{numQuestions !== 1 ? 's' : ''} ({SECONDS_PER_QUESTION}s per question)</p>
              <Button onClick={handleStart}>Start Quiz</Button>
            </div>
          )}

          {status === 'loading' && (
            <div className="flex items-center gap-2 text-white/50 text-sm py-8 justify-center">
              <Loader2 className="w-4 h-4 animate-spin" /> Generating your quiz...
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <p className="text-sm text-red-400">{error}</p>
              <Button variant="secondary" onClick={() => setStatus('setup')}>Try Again</Button>
            </div>
          )}

          {status === 'active' && questions.length > 0 && (
            <div key={current}>
              <p className="text-base font-medium mb-4">{questions[current].question}</p>
              <div className="space-y-2 mb-5">
                {questions[current].options.map((opt, i) => {
                  const isSelected = selectedAnswers[current] === i
                  const letter = String.fromCharCode(65 + i)
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelect(i)}
                      className={`w-full text-left px-4 py-4 rounded-xl glass border text-base transition-all flex items-center gap-3 ${
                        isSelected ? 'border-purple/60 bg-purple/[0.12]' : 'border-white/[0.08] hover:border-white/20 hover:bg-white/[0.02]'
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-mono font-semibold shrink-0 ${
                        isSelected ? 'border-purple-bright bg-purple-bright text-base-950' : 'border-white/20 text-white/50'
                      }`}>
                        {letter}
                      </span>
                      <span className="flex-1">{opt}</span>
                    </button>
                  )
                })}
              </div>
              <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={goPrev} disabled={current === 0}>Previous</Button>
                {current + 1 < questions.length ? (
                  <Button onClick={goNext}>Next Question</Button>
                ) : (
                  <Button onClick={handleSubmit}>Finish Quiz</Button>
                )}
              </div>
            </div>
          )}

          {status === 'submitted' && (
            <div className="space-y-6">
              <div className="text-center py-4">
                <Trophy className="w-12 h-12 mx-auto text-gold-bright mb-3" />
                <p className="font-display font-bold text-3xl">{score} / {questions.length}</p>
                <p className="text-sm text-white/40 mt-1">{Math.round((score / questions.length) * 100)}% overall</p>
              </div>

              <div className="space-y-3">
                {questions.map((q, i) => {
                  const userAnswer = selectedAnswers[i]
                  const isCorrect = userAnswer === q.correct_index
                  const isRevealed = revealedExplanations[i]
                  return (
                    <div key={i} className={`rounded-xl border p-4 ${isCorrect ? 'border-emerald/30 bg-emerald/[0.04]' : 'border-red-500/30 bg-red-500/[0.04]'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-white/40">Question {i + 1}</span>
                        <span className={`text-xs font-medium inline-flex items-center gap-1 ${isCorrect ? 'text-emerald-bright' : 'text-red-400'}`}>
                          {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>
                      <p className="text-sm text-white/80 mb-3">{q.question}</p>
                      <div className="grid sm:grid-cols-2 gap-2 mb-3">
                        <div className={`rounded-lg p-2.5 text-xs ${isCorrect ? 'bg-emerald/10' : 'bg-red-500/10'}`}>
                          <p className="text-white/40 mb-0.5">Your Answer{!isCorrect ? ' (Wrong)' : ''}:</p>
                          <p className="text-white/80">{userAnswer !== null ? q.options[userAnswer] : 'Not answered'}</p>
                        </div>
                        {!isCorrect && (
                          <div className="rounded-lg p-2.5 text-xs bg-emerald/10">
                            <p className="text-white/40 mb-0.5">Correct Answer:</p>
                            <p className="text-white/80">{q.options[q.correct_index]}</p>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => toggleExplanation(i)}
                        className="text-xs text-blue-bright hover:text-blue-bright/80 inline-flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3 h-3" /> {isRevealed ? 'Hide' : 'Understand'} Solution
                      </button>
                      <AnimatePresence>
                        {isRevealed && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 overflow-hidden"
                          >
                            <div className="rounded-xl bg-blue/5 border border-blue/20 p-5 space-y-5">
                              {q.solution_steps?.length > 0 && (
                                <div>
                                  <p className="text-xs font-semibold text-blue-bright uppercase tracking-wide mb-2.5">Solution Steps</p>
                                  <ol className="space-y-2 list-none">
                                    {q.solution_steps.map((step, si) => (
                                      <li key={si} className="text-[15px] text-white/75 leading-relaxed flex items-start gap-3">
                                        <span className="text-blue-bright/70 font-mono text-sm mt-0.5 shrink-0">{si + 1}.</span>
                                        <span>{step}</span>
                                      </li>
                                    ))}
                                  </ol>
                                </div>
                              )}

                              {q.worked_solution?.length > 0 && (
                                <div className="border-t border-white/[0.06] pt-5">
                                  <p className="text-xs font-semibold text-blue-bright uppercase tracking-wide mb-2.5">Worked Through</p>
                                  <div className="space-y-2">
                                    {q.worked_solution.map((step, si) => (
                                      <div key={si} className="text-sm font-mono text-emerald-bright/90 bg-black/25 rounded-lg px-3.5 py-2.5 leading-relaxed">
                                        {step}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {q.why_correct && (
                                <div className="border-t border-white/[0.06] pt-5">
                                  <p className="text-xs font-semibold text-emerald-bright uppercase tracking-wide mb-2.5">Why This Is Correct</p>
                                  <p className="text-[15px] text-white/85 leading-relaxed">{q.why_correct}</p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>

              <Button variant="secondary" onClick={() => setStatus('setup')}>Take Another Quiz</Button>
            </div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  )
}