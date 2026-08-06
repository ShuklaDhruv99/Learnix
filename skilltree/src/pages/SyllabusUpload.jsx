import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { UploadCloud, FileText, Sparkles, ArrowRight, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import BackgroundGrid from '../components/common/BackgroundGrid'
import { stagger, fadeUp } from '../animations/variants'
import { useApp } from '../contexts/AppContext'

const STAGES = [
    { label: 'Reading your syllabus...', at: 0 },
    { label: 'Identifying course structure...', at: 0.2 },
    { label: 'Mapping topics and prerequisites...', at: 0.45 },
    { label: 'Estimating difficulty and XP...', at: 0.7 },
    { label: 'Finalizing your skill tree...', at: 0.9 },
  ]
  
  const ESTIMATED_DURATION_MS = 40000

export default function SyllabusUpload() {
  const navigate = useNavigate()
  const { generateSyllabus } = useApp()
  const fileInputRef = useRef(null)

  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('idle') // idle | uploading | success | error
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [progress, setProgress] = useState(0)

  function handleFileSelect(e) {
    const selected = e.target.files?.[0]
    if (selected) {
      setFile(selected)
      setStatus('idle')
      setError(null)
    }
  }

  function handleDrop(e) {
    e.preventDefault()
    const dropped = e.dataTransfer.files?.[0]
    if (dropped && dropped.type === 'application/pdf') {
      setFile(dropped)
      setStatus('idle')
      setError(null)
    }
  }

  async function handleUpload() {
    if (!file) return
    setStatus('uploading')
    setError(null)
    setProgress(0)

    const startTime = Date.now()
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime
      // Ease toward 92% over the estimated duration, never claiming 100% until actually done
      const fraction = Math.min(elapsed / ESTIMATED_DURATION_MS, 1) * 0.92
      setProgress(fraction)
    }, 300)

    try {
      const data = await generateSyllabus(file)
      clearInterval(progressInterval)
      setProgress(1)
      setResult(data)
      setStatus('success')
    } catch (err) {
      clearInterval(progressInterval)
      setError(err?.data?.error || 'Something went wrong generating your skill tree.')
      setStatus('error')
    }
  }

  return (
    <div className="relative max-w-2xl mx-auto space-y-6">
      <motion.div variants={fadeUp} initial="hidden" animate="show">
        <h1 className="font-display font-bold text-2xl sm:text-3xl flex items-center gap-2.5">
          <Sparkles className="w-6 h-6 text-emerald-bright" /> Generate a Skill Tree from Your Syllabus
        </h1>
        <p className="text-white/40 text-sm mt-1">
          Upload a syllabus PDF and let AI turn it into an interactive learning path, structured by topic and prerequisite.
        </p>
      </motion.div>

      {status !== 'success' && (
        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <Card className="p-8">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => status !== 'uploading' && fileInputRef.current?.click()}
              className={`relative rounded-2xl border-2 border-dashed transition-colors p-10 text-center ${
                status === 'uploading' ? 'border-white/10 cursor-not-allowed' : 'border-white/15 hover:border-emerald/50 cursor-pointer'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileSelect}
                className="hidden"
                disabled={status === 'uploading'}
              />

                {status === 'uploading' ? (
                    <div className="space-y-4">
                    <Loader2 className="w-10 h-10 mx-auto text-emerald-bright animate-spin" />
                    <p className="text-sm text-white/70">
                        {STAGES.slice().reverse().find((s) => progress >= s.at)?.label || STAGES[0].label}
                    </p>
                    <div className="w-full max-w-xs mx-auto h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-emerald-bright to-blue rounded-full"
                            initial={{ width: '0%' }}
                            animate={{ width: `${Math.round(progress * 100)}%` }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                        />
                    </div>
                    <p className="text-xs text-white/35">Good syllabi take real thought — usually under a minute.</p>
                    </div>
                ) : file ? (
                <div className="space-y-3">
                  <FileText className="w-10 h-10 mx-auto text-emerald-bright" />
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-white/40">{(file.size / 1024).toFixed(0)} KB — click to choose a different file</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <UploadCloud className="w-10 h-10 mx-auto text-white/30" />
                  <p className="text-sm text-white/60">Drag & drop a PDF here, or click to browse</p>
                  <p className="text-xs text-white/30">Only .pdf files are supported</p>
                </div>
              )}
            </div>

            {status === 'error' && (
              <div className="mt-4 flex items-start gap-2 text-sm text-red-400">
                <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              className="w-full mt-6"
              iconRight={ArrowRight}
              onClick={handleUpload}
              disabled={!file || status === 'uploading'}
            >
              {status === 'uploading' ? 'Generating...' : 'Generate Skill Tree'}
            </Button>
          </Card>
        </motion.div>
      )}

      {status === 'success' && result && (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="p-8 text-center" glow="emerald">
            <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-bright mb-4" />
            <h2 className="font-display font-bold text-xl mb-1">{result.subject_name}</h2>
            <p className="text-sm text-white/50 mb-6">
              {result.topic_count} topics generated and you're already enrolled.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button iconRight={ArrowRight} onClick={() => navigate(`/app/skill-tree?subject=${result.subject_id}`)}>
                View Skill Tree
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setStatus('idle')
                  setFile(null)
                  setResult(null)
                }}
              >
                Upload Another
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}