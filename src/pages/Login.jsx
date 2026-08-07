import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'
import BackgroundGrid from '../components/common/BackgroundGrid'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useApp } from '../contexts/AppContext'

export default function Login() {
  const navigate = useNavigate()
  const { login, authLoading, authError } = useApp()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    const ok = await login(username, password)
    if (ok) navigate('/app')
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-5">
      <BackgroundGrid />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-sm"
      >
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-bright to-blue flex items-center justify-center shadow-glow-emerald">
            <Sparkles className="w-4.5 h-4.5 text-base-950" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">Learnix</span>
        </div>

        <Card className="p-8">
          <h1 className="font-display font-bold text-2xl mb-1">Welcome back</h1>
          <p className="text-sm text-white/45 mb-6">Log in to continue your journey.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-white/50 uppercase tracking-wide">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full mt-1.5 rounded-xl glass p-3 text-sm placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-emerald/50"
                placeholder="your_username"
                required
              />
            </div>
            <div>
              <label className="text-xs text-white/50 uppercase tracking-wide">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1.5 rounded-xl glass p-3 text-sm placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-emerald/50"
                placeholder="••••••••"
                required
              />
            </div>

            {authError && <p className="text-xs text-red-400">{authError}</p>}

            <Button type="submit" className="w-full" iconRight={ArrowRight} disabled={authLoading}>
              {authLoading ? 'Logging in...' : 'Log In'}
            </Button>
          </form>

          <p className="text-xs text-white/40 mt-6 text-center">
            Don't have an account?{' '}
            <Link to="/register" className="text-emerald-bright hover:underline">Sign up</Link>
          </p>
        </Card>
      </motion.div>
    </div>
  )
}