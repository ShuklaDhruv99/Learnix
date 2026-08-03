import { motion } from 'framer-motion'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts'
import { BarChart3, Flame } from 'lucide-react'
import AnalyticsCard from '../components/cards/AnalyticsCard'
import ProgressRing from '../components/ui/ProgressRing'
import { stagger, fadeUp } from '../animations/variants'
import analytics from '../data/analytics.json'

const tooltipStyle = {
  background: 'rgba(20,20,24,0.92)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 12,
  fontSize: 12,
  color: 'white',
}

function HeatmapGrid({ data }) {
  const colors = ['rgba(255,255,255,0.05)', 'rgba(52,211,153,0.25)', 'rgba(52,211,153,0.45)', 'rgba(52,211,153,0.7)', 'rgba(52,211,153,0.95)']
  return (
    <div className="grid grid-cols-[repeat(14,minmax(0,1fr))] gap-1.5">
      {data.map((v, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.006 }}
          className="aspect-square rounded-[3px]"
          style={{ background: colors[v] }}
          title={`${v} activity`}
        />
      ))}
    </div>
  )
}

export default function Analytics() {
  return (
    <motion.div variants={stagger(0.06)} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp}>
        <h1 className="font-display font-bold text-2xl sm:text-3xl flex items-center gap-2.5">
          <BarChart3 className="w-6 h-6 text-emerald-bright" /> Analytics
        </h1>
        <p className="text-white/40 text-sm mt-1">Your learning patterns, visualized.</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-5">
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <AnalyticsCard title="Weekly Study Time" subtitle="Hours studied per day">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={analytics.weeklyStudyTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                <Bar dataKey="hours" fill="#34D399" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </AnalyticsCard>
        </motion.div>

        <motion.div variants={fadeUp}>
          <AnalyticsCard title="Completion Rate" subtitle="Across all subjects">
            <div className="flex flex-col items-center justify-center py-4">
              <ProgressRing value={analytics.completionRate} size={140} strokeWidth={11} accent="blue" />
              <p className="text-xs text-white/40 mt-4 text-center">You're ahead of last month's pace.</p>
            </div>
          </AnalyticsCard>
        </motion.div>

        <motion.div variants={fadeUp} className="lg:col-span-2">
          <AnalyticsCard title="XP Timeline" subtitle="Cumulative XP over the last 9 weeks">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={analytics.xpTimeline}>
                <defs>
                  <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60A5FA" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#60A5FA" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="xp" stroke="#60A5FA" strokeWidth={2.5} fill="url(#xpGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </AnalyticsCard>
        </motion.div>

        <motion.div variants={fadeUp}>
          <AnalyticsCard title="Subject Mastery" subtitle="Completion % radar">
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={analytics.completionRadar}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 10 }} />
                <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
                <Radar dataKey="value" stroke="#C084FC" fill="#C084FC" fillOpacity={0.35} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </AnalyticsCard>
        </motion.div>

        <motion.div variants={fadeUp} className="lg:col-span-2">
          <AnalyticsCard title="Hours by Subject" subtitle="Total time invested">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={analytics.subjectComparison} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="subject" type="category" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} axisLine={false} tickLine={false} width={70} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                <Bar dataKey="hours" fill="#F5B942" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </AnalyticsCard>
        </motion.div>

        <motion.div variants={fadeUp} className="lg:col-span-3">
          <AnalyticsCard
            title="Daily Activity"
            subtitle="Last 9 weeks"
            action={<Flame className="w-4 h-4 text-gold-bright" />}
          >
            <HeatmapGrid data={analytics.dailyActivityHeatmap} />
          </AnalyticsCard>
        </motion.div>
      </div>
    </motion.div>
  )
}
