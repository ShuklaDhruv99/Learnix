import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Sparkles, Loader2 } from 'lucide-react'
import AccountStep from './onboarding/AccountStep'
import WhoAreYou from './onboarding/WhoAreYou'
import SchoolFlow from './onboarding/SchoolFlow'
import CollegeFlow from './onboarding/CollegeFlow'
import GoalSelection from './onboarding/GoalSelection'
import Button from '../components/ui/Button'
import BackgroundGrid from '../components/common/BackgroundGrid'
import { useApp } from '../contexts/AppContext'
import { pageTransition } from '../animations/variants'

const SPECCED_TYPES = ['school', 'college']

export default function Onboarding() {
  const navigate = useNavigate()
  const { onboarding, setOnboarding, isAuthenticated, register, authLoading, authError, submitOnboarding } = useApp()
  const [step, setStep] = useState(0)
  const [generating, setGenerating] = useState(false)

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const data = onboarding
  const update = (patch) => setOnboarding((prev) => ({ ...prev, ...patch }))

  useEffect(() => {
    if (isAuthenticated && data.completed) {
      navigate('/app')
    }
  }, [])

  const detailStepNeeded = SPECCED_TYPES.includes(data.learnerType)

  const steps = isAuthenticated
    ? (detailStepNeeded ? ['who', 'detail', 'goal'] : ['who', 'goal'])
    : (detailStepNeeded ? ['account', 'who', 'detail', 'goal'] : ['account', 'who', 'goal'])

  const stepKey = steps[step] ?? steps[steps.length - 1]
  const stepIndex = step

  const canProceed = () => {
    if (stepKey === 'account') return username && email && password.length >= 8
    if (stepKey === 'who') return !!data.learnerType
    if (stepKey === 'detail') {
      if (data.learnerType === 'school') {
        const base = data.board && data.medium && data.className
        const streamOk = data.className === '11' || data.className === '12' ? !!data.stream : true
        return base && streamOk
      }
      if (data.learnerType === 'college') {
        return data.university && data.branch && data.semester
      }
      return true
    }
    if (stepKey === 'goal') return !!data.goalMode
    return false
  }

  const goNext = async () => {
    if (stepKey === 'account') {
      const ok = await register(username, email, password)
      if (ok) setStep((s) => s + 1)
      return
    }

    if (stepKey === 'goal') {
      setGenerating(true)
      try {
        await submitOnboarding({
          education_type: data.learnerType,
          board: data.board,
          medium: data.medium,
          class_name: data.className,
          stream: data.stream,
          university: data.university,
          branch: data.branch,
          semester: data.semester ? parseInt(data.semester, 10) : null,
          goal_mode: data.goalMode,
          onboarding_completed: true,
        })
      } catch (err) {
        console.error('Failed to save onboarding data', err)
      }
      update({ completed: true })
      setTimeout(() => navigate('/app'), 1900)
      return
    }

    setStep((s) => s + 1)
  }

  const goBack = () => {
    setStep((s) => Math.max(0, s - 1))
  }

  if (generating) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative">
        <BackgroundGrid />
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-bright to-blue flex items-center justify-center mx-auto shadow-glow-emerald"
          >
            <Loader2 className="w-7 h-7 text-base-950" />
          </motion.div>
          <h2 className="font-display font-bold text-2xl mt-6">Setting things up...</h2>
          <p className="text-white/40 text-sm mt-2">Saving your preferences.</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative flex flex-col">
      <BackgroundGrid />
      <header className="relative flex items-center justify-between px-6 sm:px-10 h-16">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-bright to-blue flex items-center justify-center">
            <Sparkles className="w-4.5 h-4.5 text-base-950" />
          </div>
          <span className="font-display font-bold">Learnix</span>
        </div>
        <div className="flex items-center gap-1.5">
          {steps.map((s, i) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= stepIndex ? 'w-8 bg-emerald-bright' : 'w-4 bg-white/10'
              }`}
            />
          ))}
        </div>
      </header>

      <main className="relative flex-1 flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div key={stepKey} {...pageTransition}>
              {stepKey === 'account' && (
                <AccountStep
                  username={username} setUsername={setUsername}
                  email={email} setEmail={setEmail}
                  password={password} setPassword={setPassword}
                  error={authError}
                />
              )}
              {stepKey === 'who' && <WhoAreYou value={data.learnerType} onSelect={(v) => update({ learnerType: v })} />}
              {stepKey === 'detail' && data.learnerType === 'school' && <SchoolFlow data={data} onChange={update} />}
              {stepKey === 'detail' && data.learnerType === 'college' && <CollegeFlow data={data} onChange={update} />}
              {stepKey === 'goal' && <GoalSelection value={data.goalMode} onSelect={(v) => update({ goalMode: v })} />}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between mt-10">
            <Button variant="ghost" icon={ArrowLeft} onClick={goBack} className={step === 0 ? 'invisible' : ''}>
              Back
            </Button>
            <Button
              variant="primary"
              iconRight={ArrowRight}
              onClick={goNext}
              disabled={!canProceed() || authLoading}
              className={!canProceed() ? 'opacity-40 pointer-events-none' : ''}
            >
              {authLoading ? 'Please wait...' : stepKey === 'goal' ? 'Generate My Skill Tree' : 'Continue'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}