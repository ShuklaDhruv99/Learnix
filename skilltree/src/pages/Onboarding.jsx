import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Sparkles, Loader2 } from 'lucide-react'
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
  const { onboarding, setOnboarding } = useApp()
  const [step, setStep] = useState(0)
  const [generating, setGenerating] = useState(false)

  const data = onboarding
  const update = (patch) => setOnboarding((prev) => ({ ...prev, ...patch }))

  const detailStepNeeded = SPECCED_TYPES.includes(data.learnerType)
  // steps: 0 = who are you, 1 = detail (school/college) [skipped for other types], 2 = goal
  const steps = detailStepNeeded ? [0, 1, 2] : [0, 2]
  const stepIndex = steps.indexOf(step === 1 && !detailStepNeeded ? 2 : step)

  const canProceed = () => {
    if (step === 0) return !!data.learnerType
    if (step === 1) {
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
    if (step === 2) return !!data.goalMode
    return false
  }

  const goNext = () => {
    if (step === 0) {
      setStep(detailStepNeeded ? 1 : 2)
    } else if (step === 1) {
      setStep(2)
    } else if (step === 2) {
      setGenerating(true)
      update({ completed: true })
      setTimeout(() => navigate('/app'), 1900)
    }
  }

  const goBack = () => {
    if (step === 2) setStep(detailStepNeeded ? 1 : 0)
    else if (step === 1) setStep(0)
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
          <h2 className="font-display font-bold text-2xl mt-6">Generating your Skill Tree...</h2>
          <p className="text-white/40 text-sm mt-2">Mapping topics, XP, and unlock order.</p>
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
            <motion.div key={step} {...pageTransition}>
              {step === 0 && <WhoAreYou value={data.learnerType} onSelect={(v) => update({ learnerType: v })} />}
              {step === 1 && data.learnerType === 'school' && <SchoolFlow data={data} onChange={update} />}
              {step === 1 && data.learnerType === 'college' && <CollegeFlow data={data} onChange={update} />}
              {step === 2 && <GoalSelection value={data.goalMode} onSelect={(v) => update({ goalMode: v })} />}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between mt-10">
            <Button variant="ghost" icon={ArrowLeft} onClick={goBack} className={step === 0 ? 'invisible' : ''}>
              Back
            </Button>
            <Button variant="primary" iconRight={ArrowRight} onClick={goNext} disabled={!canProceed()} className={!canProceed() ? 'opacity-40 pointer-events-none' : ''}>
              {step === 2 ? 'Generate My Skill Tree' : 'Continue'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
