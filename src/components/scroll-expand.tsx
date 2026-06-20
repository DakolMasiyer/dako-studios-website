"use client"

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'

interface ScrollExpandProps {
  children: React.ReactNode
  className?: string
  /** Scale at the moment the card first enters the viewport. */
  fromScale?: number
  /** Border radius (px) while inset, eased back to `toRadius` as it centers. */
  fromRadius?: number
  toRadius?: number
}

// Humaans-style: a card sits slightly inset/rounded as it enters the viewport
// and scales up toward full-bleed as it reaches center, then holds. Respects
// reduced-motion (renders a plain, static container).
export function ScrollExpand({
  children,
  className,
  fromScale = 0.88,
  fromRadius = 24,
  toRadius = 8,
}: ScrollExpandProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  })

  const scale = useTransform(scrollYProgress, [0, 1], [fromScale, 1])
  const borderRadius = useTransform(scrollYProgress, [0, 1], [fromRadius, toRadius])

  if (reduceMotion) {
    return (
      <div ref={ref} className={className} style={{ borderRadius: toRadius }}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ scale, borderRadius, transformOrigin: 'center center' }}
    >
      {children}
    </motion.div>
  )
}
