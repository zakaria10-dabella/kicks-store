import { useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

export default function Magnetic({ children, strength = 0.3, className = '' }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 15, mass: 0.4 })
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 15, mass: 0.4 })
  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      className={`inline-block ${className}`}
      onPointerMove={(e) => {
        if (reduce || !ref.current) return
        const r = ref.current.getBoundingClientRect()
        x.set((e.clientX - r.left - r.width / 2) * strength)
        y.set((e.clientY - r.top - r.height / 2) * strength)
      }}
      onPointerLeave={() => { x.set(0); y.set(0) }}
    >
      {children}
    </motion.div>
  )
}
