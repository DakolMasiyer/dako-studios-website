'use client'

import { useEffect, useRef } from 'react'

// Fixed accent colours — work on both light and dark backgrounds
const GOLD = { r: 201, g: 162, b: 39 }
const BLUE = { r: 74,  g: 124, b: 150 }

// Base particle colour flips with theme
const BASE_DARK  = { r: 250, g: 248, b: 244 } // warm white on carbon
const BASE_LIGHT = { r: 22,  g: 22,  b: 24  } // carbon on warm white

const PARTICLE_COUNT =
  typeof window !== 'undefined' && window.innerWidth < 768 ? 900 : 1800

interface Particle {
  phi:       number
  theta:     number
  colorKey:  'gold' | 'blue' | 'base'
  size:      number
  baseAlpha: number
}

interface ProjectedParticle extends Particle {
  x: number
  y: number
  z: number
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function buildParticles(): Particle[] {
  const pts: Particle[] = []
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const phi   = Math.acos(1 - (2 * (i + 0.5)) / PARTICLE_COUNT)
    const theta = Math.PI * (1 + Math.sqrt(5)) * i
    const roll  = Math.random()
    let colorKey: Particle['colorKey']
    let size: number

    if (roll < 0.04) {
      colorKey = 'gold'
      size = 1.4 + Math.random() * 0.8
    } else if (roll < 0.10) {
      colorKey = 'blue'
      size = 0.9 + Math.random() * 0.5
    } else {
      colorKey = 'base'
      size = 0.5 + Math.random() * 0.6
    }

    pts.push({ phi, theta, colorKey, size, baseAlpha: 0.15 + Math.random() * 0.55 })
  }
  return pts
}

function project(
  phi: number, theta: number, rotX: number, rotY: number,
): { x: number; y: number; z: number } {
  let x = Math.sin(phi) * Math.cos(theta)
  let y = Math.cos(phi)
  let z = Math.sin(phi) * Math.sin(theta)

  const cosY = Math.cos(rotY), sinY = Math.sin(rotY)
  const x1 = x * cosY - z * sinY, z1 = x * sinY + z * cosY
  x = x1; z = z1

  const cosX = Math.cos(rotX), sinX = Math.sin(rotX)
  const y1 = y * cosX - z * sinX, z2 = y * sinX + z * cosX
  y = y1; z = z2

  return { x, y, z }
}

export default function GlobeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvasEl = canvasRef.current
    if (!canvasEl) return
    const ctxEl = canvasEl.getContext('2d')
    if (!ctxEl) return
    // Assign narrowed (non-null) types so closures don't see HTMLCanvasElement | null
    const canvas = canvasEl
    const ctx = ctxEl

    let W = 0, H = 0, cx = 0, cy = 0, radius = 0
    let particles: Particle[] = []
    let animId: number

    const rotation       = { x: 0.3, y: 0 }
    const targetRotation = { x: 0.3, y: 0 }
    let isDragging = false
    let dragStart  = { x: 0, y: 0 }
    let rotStart   = { x: 0, y: 0 }

    function isDark() {
      return document.documentElement.classList.contains('dark')
    }

    function resolveColor(p: Particle) {
      if (p.colorKey === 'gold') return GOLD
      if (p.colorKey === 'blue') return BLUE
      return isDark() ? BASE_DARK : BASE_LIGHT
    }

    function resize() {
      W = canvas.width  = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
      cx = W / 2; cy = H / 2
      radius = Math.min(W, H) * 0.38
      particles = buildParticles()
    }

    function draw() {
      ctx.clearRect(0, 0, W, H)
      rotation.x = lerp(rotation.x, targetRotation.x, 0.06)
      rotation.y = lerp(rotation.y, targetRotation.y, 0.06)
      if (!isDragging) targetRotation.y += 0.003

      const projected: ProjectedParticle[] = particles.map((p) => {
        const pt = project(p.phi, p.theta + targetRotation.y, targetRotation.x, 0)
        return { ...p, ...pt }
      })
      projected.sort((a, b) => a.z - b.z)

      for (const p of projected) {
        const sx    = cx + p.x * radius
        const sy    = cy + p.y * radius
        const depth = (p.z + 1) / 2
        const alpha = p.baseAlpha * (0.2 + depth * 0.8)
        const size  = p.size * (0.4 + depth * 0.7)
        const { r, g, b } = resolveColor(p)
        ctx.beginPath()
        ctx.arc(sx, sy, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha.toFixed(2)})`
        ctx.fill()
      }

      animId = requestAnimationFrame(draw)
    }

    function drawStatic() {
      resize()
      const snapped = particles.map((p) => {
        const pt = project(p.phi, p.theta, 0.3, 0.4)
        return { ...p, ...pt }
      })
      snapped.sort((a, b) => a.z - b.z)
      for (const p of snapped) {
        const sx    = cx + p.x * radius
        const sy    = cy + p.y * radius
        const depth = (p.z + 1) / 2
        const alpha = p.baseAlpha * (0.2 + depth * 0.8)
        const { r, g, b } = resolveColor(p)
        ctx.beginPath()
        ctx.arc(sx, sy, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha.toFixed(2)})`
        ctx.fill()
      }
    }

    function onMouseMove(e: MouseEvent) {
      if (isDragging) {
        const dx = e.clientX - dragStart.x
        const dy = e.clientY - dragStart.y
        targetRotation.y = rotStart.y + dx * 0.005
        targetRotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, rotStart.x + dy * 0.005))
      } else {
        const ny = (e.clientY - cy) / (H / 2)
        targetRotation.x = 0.3 + ny * 0.15
      }
    }

    function onMouseDown(e: MouseEvent) {
      isDragging = true
      dragStart  = { x: e.clientX, y: e.clientY }
      rotStart   = { x: targetRotation.x, y: targetRotation.y }
      canvas.style.cursor = 'grabbing'
    }

    function onMouseUp() {
      isDragging = false
      canvas.style.cursor = 'default'
    }

    function onTouchMove(e: TouchEvent) {
      e.preventDefault()
      const t  = e.touches[0]
      const ny = (t.clientY - cy) / (H / 2)
      targetRotation.x  = 0.3 + ny * 0.15
      targetRotation.y += 0.01
    }

    function onResize() {
      cancelAnimationFrame(animId)
      resize()
      draw()
    }

    // Re-render on theme toggle so particle colours flip immediately
    const observer = new MutationObserver(() => {
      cancelAnimationFrame(animId)
      draw()
    })
    observer.observe(document.documentElement, {
      attributes: true, attributeFilter: ['class'],
    })

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      drawStatic()
    } else {
      resize()
      draw()
      canvas.addEventListener('mousemove', onMouseMove)
      canvas.addEventListener('mousedown', onMouseDown)
      window.addEventListener('mouseup',   onMouseUp)
      canvas.addEventListener('touchmove', onTouchMove, { passive: false })
      window.addEventListener('resize',    onResize)
    }

    return () => {
      cancelAnimationFrame(animId)
      observer.disconnect()
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup',   onMouseUp)
      canvas.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('resize',    onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      style={{ cursor: 'default' }}
    />
  )
}
