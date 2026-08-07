import { useEffect, useRef, useState } from 'react'
import { useInView, useMotionValue, useTransform, animate } from 'framer-motion'

export default function AnimatedCounter({ to, suffix = '', duration = 1.8, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [display, setDisplay] = useState(0)
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.floor(v))

  useEffect(() => {
    if (!inView) return
    const controls = animate(count, to, { duration, ease: [0.16, 1, 0.3, 1] })
    const unsub = rounded.on('change', (v) => setDisplay(v))
    return () => {
      controls.stop()
      unsub()
    }
  }, [inView, to])

  return (
    <span ref={ref} className={className}>
      {display.toLocaleString()}
      {suffix}
    </span>
  )
}
