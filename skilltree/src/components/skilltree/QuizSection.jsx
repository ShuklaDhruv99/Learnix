import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ListChecks, CheckCircle2, XCircle, RefreshCw, Trophy } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { useApp } from '../../contexts/AppContext'

export default function QuizSection({ topicId }) {
  const { generateQuiz, submitQuizAttempt, refreshAnalytics } = useApp()
  const [status, setStatus] = useState('idle') // idle | loading | active | submitted | error
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answers, setAnswers] = useState([])
  const [error, setError] = useState(null)

  async function handleStart() {
    setStatus('loading')
    setError(null)
    try {
      const data = await generateQuiz(topicId)
      setQuestions(data.questions)
      setCurrent(0)
      setSelected(null)
      setAnswers([])
      setStatus('active')
    } catch (err) {
      setError(err?.data?.error || 'Failed to generate quiz.')
      setStatus('error')
    }
  }

  function handleSelect(optionIndex) {
    if (selected !== null) return
    setSelected(optionIndex)
  }

  async function handleNext() {
    const isCorrect = selected === questions[current].correct_index
    const newAnswers = [...answers, isCorrect]
    setAnswers(newAnswers)

    if (current + 1 < questions.length) {
      setCurrent((c) => c + 1)
      setSelected(null)
    } else {
      const score = newAnswers.filter(Boolean).length
      try {
        await submitQuizAttempt(topicId, score, questions.length)
        await refreshAnalytics()
      } catch (err) {
        console.error('Failed to save quiz attempt', err)
      }
      setStatus('submitted')
    }
  }

  const score = answers.filter(Boolean).length

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold flex items-center gap-2">
          <ListChecks className="w-4.5 h-4.5 text-purple-bright" /> Practice Quiz
        </h3>
        {(status === 'idle' || status === 'error' || status === 'submitted') && (
          <button
            onClick={handleStart}
            className="text-xs text-emerald-bright hover:text-emerald-bright/80 inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-3 h-3" />
            {status === 'submitted' ? 'Try again' : 'Generate Quiz'}
          </button>
        )}
      </div>

      {status === 'idle' && (
        <p className="text-xs text-white/30">Test your understanding with a 5-question quiz tailored to this topic.</p>
      )}

      {status === 'loading' && (
        <p className="text-xs text-white/40">Generating your quiz...</p>
      )}

      {status === 'error' && (
        <p className="text-xs text-red-400">{error}</p>
      )}

      {status === 'active' && questions.length > 0 && (
        <AnimatePresence mode="wait">
          <motion.div key={current} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
            <p className="text-xs text-white/40 mb-2">Question {current + 1} of {questions.length}</p>
            <p className="text-sm font-medium mb-4">{questions[current].question}</p>
            <div className="space-y-2 mb-4">
              {questions[current].options.map((opt, i) => {
                const isSelected = selected === i
                const isCorrectOption = i === questions[current].correct_index
                const revealed = selected !== null

                let containerStyles = 'border-white/[0.08] hover:border-white/20 hover:bg-white/[0.02]'
                let icon = null
                let label = null

                if (revealed && isCorrectOption) {
                  containerStyles = 'border-emerald/60 bg-emerald/[0.12] shadow-glow-emerald'
                  icon = <CheckCircle2 className="w-5 h-5 text-emerald-bright shrink-0" />
                  label = <span className="text-[10px] font-mono uppercase tracking-wide text-emerald-bright">Correct</span>
                } else if (revealed && isSelected && !isCorrectOption) {
                  containerStyles = 'border-red-500/60 bg-red-500/[0.12]'
                  icon = <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                  label = <span className="text-[10px] font-mono uppercase tracking-wide text-red-400">Your answer</span>
                } else if (revealed) {
                  containerStyles = 'border-white/[0.06] opacity-50'
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    disabled={selected !== null}
                    className={`w-full text-left px-4 py-3.5 rounded-xl glass border text-sm transition-all flex items-center justify-between gap-3 ${containerStyles}`}
                  >
                    <span className="flex-1">{opt}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      {label}
                      {icon}
                    </div>
                  </button>
                )
              })}
            </div>

            {selected !== null && (
              <div className={`rounded-xl p-4 mb-4 border ${selected === questions[current].correct_index ? 'border-emerald/30 bg-emerald/[0.06]' : 'border-red-500/30 bg-red-500/[0.06]'}`}>
                <p className={`text-xs font-semibold mb-1.5 ${selected === questions[current].correct_index ? 'text-emerald-bright' : 'text-red-400'}`}>
                  {selected === questions[current].correct_index ? '✓ Correct!' : '✗ Not quite'}
                </p>
                <p className="text-xs text-white/60 leading-relaxed">{questions[current].explanation}</p>
              </div>
            )}
            <Button onClick={handleNext} disabled={selected === null} size="sm">
              {current + 1 < questions.length ? 'Next Question' : 'Finish Quiz'}
            </Button>
          </motion.div>
        </AnimatePresence>
      )}

      {status === 'submitted' && (
        <div className="text-center py-6">
          <Trophy className="w-10 h-10 mx-auto text-gold-bright mb-3" />
          <p className="font-display font-bold text-2xl">{score} / {questions.length}</p>
          <p className="text-xs text-white/40 mt-1">
            {score === questions.length ? 'Perfect score!' : score >= questions.length / 2 ? 'Good job!' : 'Keep practicing!'}
          </p>
        </div>
      )}
    </Card>
  )
}