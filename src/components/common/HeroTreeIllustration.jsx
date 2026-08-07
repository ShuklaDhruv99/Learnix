import { motion } from 'framer-motion'

const nodes = [
  { id: 1, x: 260, y: 40, r: 16, color: '#34D399', delay: 0 },
  { id: 2, x: 150, y: 140, r: 13, color: '#60A5FA', delay: 0.2 },
  { id: 3, x: 260, y: 150, r: 13, color: '#34D399', delay: 0.35 },
  { id: 4, x: 370, y: 140, r: 13, color: '#FBCB6B', delay: 0.5 },
  { id: 5, x: 100, y: 250, r: 11, color: '#C084FC', delay: 0.65 },
  { id: 6, x: 205, y: 260, r: 11, color: '#60A5FA', delay: 0.8 },
  { id: 7, x: 320, y: 260, r: 11, color: '#C084FC', delay: 0.95 },
  { id: 8, x: 420, y: 250, r: 11, color: '#FBCB6B', delay: 1.1 },
  { id: 9, x: 260, y: 355, r: 20, color: '#F5B942', delay: 1.3 },
]

const edges = [
  [1, 2], [1, 3], [1, 4],
  [2, 5], [2, 6], [3, 6], [4, 7], [4, 8],
  [6, 9], [7, 9],
]

const byId = Object.fromEntries(nodes.map((n) => [n.id, n]))

export default function HeroTreeIllustration() {
  return (
    <div className="relative w-full max-w-[520px] mx-auto aspect-square">
      <svg viewBox="0 0 520 420" className="w-full h-full overflow-visible">
        <defs>
          <radialGradient id="nodeGlowGreen" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#34D399" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#34D399" stopOpacity="0" />
          </radialGradient>
        </defs>

        {edges.map(([a, b], i) => {
          const n1 = byId[a]
          const n2 = byId[b]
          return (
            <motion.line
              key={i}
              x1={n1.x + 30}
              y1={n1.y + 30}
              x2={n2.x + 30}
              y2={n2.y + 30}
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="2"
              strokeDasharray="6 8"
              className="animate-dash"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.05, duration: 0.6 }}
            />
          )
        })}

        {nodes.map((n) => (
          <g key={n.id} transform={`translate(${n.x + 30}, ${n.y + 30})`}>
            <motion.circle
              r={n.r * 2.2}
              fill={n.color}
              opacity={0.15}
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ delay: n.delay, duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.circle
              r={n.r}
              fill={n.color}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: n.delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ filter: `drop-shadow(0 0 8px ${n.color})` }}
            />
            <motion.circle
              r={n.r - 4}
              fill="rgba(9,9,11,0.55)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: n.delay + 0.15, duration: 0.4 }}
            />
          </g>
        ))}
      </svg>

      {/* floating XP particles */}
      {[...Array(10)].map((_, i) => (
        <motion.span
          key={i}
          className="absolute text-[10px] font-mono font-semibold text-gold-bright"
          style={{ left: `${10 + ((i * 37) % 80)}%`, top: `${5 + ((i * 53) % 85)}%` }}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 1, 0], y: -30 }}
          transition={{ delay: i * 0.6, duration: 3.5, repeat: Infinity, ease: 'easeOut' }}
        >
          +{10 + (i % 4) * 5} XP
        </motion.span>
      ))}
    </div>
  )
}
