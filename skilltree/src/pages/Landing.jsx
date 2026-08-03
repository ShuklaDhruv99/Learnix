import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  ArrowRight,
  PlayCircle,
  Gamepad2,
  GitBranch,
  BookOpenCheck,
  LineChart,
  Target,
  Trophy,
  ChevronRight,
  Star,
  Menu,
} from 'lucide-react'
import { useState } from 'react'
import BackgroundGrid from '../components/common/BackgroundGrid'
import FloatingParticles from '../components/common/FloatingParticles'
import HeroTreeIllustration from '../components/common/HeroTreeIllustration'
import AnimatedCounter from '../components/common/AnimatedCounter'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { fadeUp, stagger } from '../animations/variants'
import { accentMap } from '../utils/xp'

const features = [
  { icon: Gamepad2, title: 'Gamified Learning', desc: 'XP, levels, and coins turn every topic into a mission worth finishing.', accent: 'emerald' },
  { icon: GitBranch, title: 'Interactive Skill Tree', desc: 'Your entire syllabus laid out as a branching tree you unlock node by node.', accent: 'blue' },
  { icon: BookOpenCheck, title: 'Personalized Resources', desc: 'Videos, notes, and PDFs curated to your goal — pass, average, or topper.', accent: 'gold' },
  { icon: LineChart, title: 'Progress Analytics', desc: 'Study time, XP timelines, and subject comparisons at a glance.', accent: 'purple' },
  { icon: Target, title: 'Daily Goals', desc: 'Bite-sized daily targets that keep your streak — and your grades — alive.', accent: 'emerald' },
  { icon: Trophy, title: 'Achievements', desc: 'Unlock badges for streaks, mastery, and milestones worth bragging about.', accent: 'gold' },
]

const steps = [
  { n: 1, title: 'Choose Education', desc: 'School, college, competitive exam, or self-paced skill.' },
  { n: 2, title: 'Choose Board or University', desc: 'CBSE, GSEB, GTU, SPPU — tell us where you study.' },
  { n: 3, title: 'Select Class or Semester', desc: 'We narrow your syllabus down to exactly what you need.' },
  { n: 4, title: 'Skill Tree is Generated', desc: 'Your full syllabus, organized into an interactive tree.' },
  { n: 5, title: 'Complete Topics → Earn XP → Unlock More', desc: 'Learn, level up, and watch new branches open.' },
]

const stats = [
  { value: 5000, suffix: '+', label: 'Topics' },
  { value: 250, suffix: '+', label: 'Subjects' },
  { value: 100, suffix: '+', label: 'Courses' },
]

const testimonials = [
  { name: 'Priya Nair', role: 'GTU, Computer Engineering', quote: 'I stopped dreading DBMS once it became a tree I could actually see myself finishing.', rating: 5 },
  { name: 'Rohan Desai', role: 'Class 12, GSEB Science', quote: 'The daily goal streak is the only reason I opened my notes every single day before boards.', rating: 5 },
  { name: 'Ananya Iyer', role: 'Placement Prep', quote: 'DSA finally feels like leveling up a character instead of an endless PDF.', rating: 4 },
]

export default function Landing() {
  const [mobileMenu, setMobileMenu] = useState(false)

  return (
    <div className="relative">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-base-950/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-bright to-blue flex items-center justify-center shadow-glow-emerald">
              <Sparkles className="w-4.5 h-4.5 text-base-950" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">Learnix</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-white/60">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Reviews</a>
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <Link to="/app" className="text-sm text-white/60 hover:text-white transition-colors px-3">Explore Demo</Link>
            <Link to="/onboarding">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
          <button className="md:hidden p-2" onClick={() => setMobileMenu((m) => !m)} aria-label="Menu">
            <Menu className="w-5 h-5" />
          </button>
        </div>
        {mobileMenu && (
          <div className="md:hidden px-5 pb-4 flex flex-col gap-3 border-t border-white/10 pt-4">
            <a href="#features" className="text-sm text-white/60">Features</a>
            <a href="#how-it-works" className="text-sm text-white/60">How it Works</a>
            <Link to="/app" className="text-sm text-white/60">Explore Demo</Link>
            <Link to="/onboarding"><Button size="sm" className="w-full">Get Started</Button></Link>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <BackgroundGrid />
        <FloatingParticles count={16} />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-20 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={stagger(0.1)} initial="hidden" animate="show">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-emerald-bright mb-6 font-mono">
              <Sparkles className="w-3.5 h-3.5" /> Your syllabus, gamified
            </motion.div>
            <motion.h1 variants={fadeUp} className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
              Turn Your Learning Into <span className="text-gradient-emerald">An Adventure</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-6 text-base sm:text-lg text-white/50 max-w-lg leading-relaxed">
              Stop memorizing boring syllabi. Level up your knowledge through an interactive Skill Tree built from your actual coursework.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-9 flex flex-wrap gap-4">
              <Link to="/onboarding">
                <Button size="lg" iconRight={ArrowRight}>Get Started</Button>
              </Link>
              <Link to="/app">
                <Button size="lg" variant="secondary" icon={PlayCircle}>Explore Demo</Button>
              </Link>
            </motion.div>
            <motion.div variants={fadeUp} className="mt-10 flex items-center gap-6 text-xs text-white/30 font-mono">
              <span>No credit card</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>Free to start</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>Works on any syllabus</span>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <HeroTreeIllustration />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="max-w-xl mb-14">
          <span className="text-xs font-mono text-emerald-bright uppercase tracking-widest">Why Learnix</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl mt-3">Everything a syllabus should have been.</h2>
        </motion.div>
        <motion.div
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((f) => {
            const a = accentMap[f.accent]
            return (
              <motion.div key={f.title} variants={fadeUp}>
                <Card hover glow={f.accent} className="p-6 h-full">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${a.bgSoft} border ${a.border}`}>
                    <f.icon className={`w-5 h-5 ${a.text}`} />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-white/45 leading-relaxed">{f.desc}</p>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="relative max-w-5xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-16">
          <span className="text-xs font-mono text-blue-bright uppercase tracking-widest">The path</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl mt-3">How It Works</h2>
        </motion.div>
        <div className="relative">
          <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-emerald/40 via-blue/40 to-purple/40 sm:-translate-x-1/2" />
          <div className="space-y-10">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className={`relative flex items-start gap-6 sm:w-1/2 ${i % 2 === 1 ? 'sm:ml-auto sm:flex-row-reverse sm:text-right' : ''}`}
              >
                <div className="w-12 h-12 rounded-2xl glass border border-emerald/30 flex items-center justify-center font-display font-bold text-emerald-bright shrink-0 z-10 shadow-glow-emerald">
                  {s.n}
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg">{s.title}</h3>
                  <p className="text-sm text-white/45 mt-1">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative py-16 border-y border-white/[0.06] bg-white/[0.015]">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 grid grid-cols-3 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-display font-bold text-4xl sm:text-5xl text-gradient-emerald">
                <AnimatedCounter to={s.value} suffix={s.suffix} />
              </p>
              <p className="text-xs sm:text-sm text-white/40 mt-2 uppercase tracking-widest font-mono">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="max-w-xl mb-14">
          <span className="text-xs font-mono text-gold-bright uppercase tracking-widest">Students say</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl mt-3">Learning that people actually stick with.</h2>
        </motion.div>
        <motion.div variants={stagger(0.1)} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid sm:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <motion.div key={t.name} variants={fadeUp}>
              <Card className="p-6 h-full">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < t.rating ? 'fill-gold-bright text-gold-bright' : 'text-white/15'}`} />
                  ))}
                </div>
                <p className="text-sm text-white/70 leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-white/40">{t.role}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="relative max-w-5xl mx-auto px-5 sm:px-8 pb-24">
        <Card className="p-10 sm:p-16 text-center relative overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-emerald/15 blur-[120px]" />
          <h2 className="font-display font-bold text-3xl sm:text-4xl relative">Ready to level up your syllabus?</h2>
          <p className="text-white/45 mt-3 relative">Set up your skill tree in under two minutes.</p>
          <div className="relative mt-8 flex justify-center">
            <Link to="/onboarding">
              <Button size="lg" iconRight={ChevronRight}>Start Your Journey</Button>
            </Link>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 grid sm:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-bright to-blue flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-base-950" />
              </div>
              <span className="font-display font-bold">Learnix</span>
            </div>
            <p className="text-xs text-white/35 leading-relaxed">Your syllabus, turned into a game worth finishing.</p>
          </div>
          {[
            { title: 'Product', links: ['Features', 'Skill Tree', 'Analytics', 'Pricing'] },
            { title: 'Learn', links: ['School', 'College', 'Competitive Exams', 'Skill Learning'] },
            { title: 'Company', links: ['About', 'Blog', 'Contact', 'Careers'] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-white/50 mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-xs text-white/35 hover:text-white/70 transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/[0.06] py-5 text-center text-xs text-white/25">
          © 2026 Learnix. Built for students who'd rather level up than burn out.
        </div>
      </footer>
    </div>
  )
}
