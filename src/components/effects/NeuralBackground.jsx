import { useEffect, useRef } from 'react'
import { useIsMobile } from '../../hooks/useIsMobile'
import { useReducedMotion } from '../../hooks/useReducedMotion'

/**
 * NeuralBackground — a fixed, full-viewport canvas rendering a living neural
 * network. Nodes drift, connect to neighbours within a radius, and occasionally
 * emit a "signal" that pulses along an edge. Attracts toward the cursor.
 *
 * Performance-aware:
 *   - Scales node count by viewport + device
 *   - Mobile drops to ~10 nodes
 *   - Respects prefers-reduced-motion (renders a single still frame)
 *   - Cancels RAF + resize listener on unmount
 */
export default function NeuralBackground() {
  const canvasRef = useRef(null)
  const isMobile = useIsMobile()
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let rafId = 0
    let width = 0
    let height = 0
    let dpr = 1
    const pointer = { x: -9999, y: -9999, active: false }

    const targetNodes = isMobile ? 10 : Math.min(72, Math.floor((window.innerWidth * window.innerHeight) / 22000))
    const nodes = []
    const signals = []

    const rand = (min, max) => Math.random() * (max - min) + min

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const init = () => {
      nodes.length = 0
      for (let i = 0; i < targetNodes; i++) {
        nodes.push({
          x: rand(0, width),
          y: rand(0, height),
          vx: rand(-0.18, 0.18),
          vy: rand(-0.18, 0.18),
          r: rand(1.2, 2.6),
          hue: Math.random() < 0.5 ? 'cyan' : (Math.random() < 0.5 ? 'violet' : 'emerald'),
        })
      }
    }

    const hueToRgba = (hue, a = 1) => {
      switch (hue) {
        case 'violet':  return `rgba(168, 85, 247, ${a})`
        case 'emerald': return `rgba(0, 255, 136, ${a})`
        case 'cyan':
        default:        return `rgba(0, 245, 255, ${a})`
      }
    }

    const step = () => {
      ctx.clearRect(0, 0, width, height)

      // Optional subtle vignette
      const grad = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) / 1.1)
      grad.addColorStop(0, 'rgba(5, 6, 13, 0)')
      grad.addColorStop(1, 'rgba(5, 6, 13, 0.6)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, width, height)

      // Move nodes
      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy

        // Pointer attraction
        if (pointer.active) {
          const dx = pointer.x - n.x
          const dy = pointer.y - n.y
          const d2 = dx * dx + dy * dy
          if (d2 < 240 * 240) {
            const f = 0.0009
            n.vx += dx * f
            n.vy += dy * f
          }
        }

        // Soft speed clamp
        const speed = Math.hypot(n.vx, n.vy)
        const max = 0.55
        if (speed > max) {
          n.vx = (n.vx / speed) * max
          n.vy = (n.vy / speed) * max
        }

        // Bounce
        if (n.x < -20) { n.x = -20; n.vx = Math.abs(n.vx) }
        if (n.x > width + 20) { n.x = width + 20; n.vx = -Math.abs(n.vx) }
        if (n.y < -20) { n.y = -20; n.vy = Math.abs(n.vy) }
        if (n.y > height + 20) { n.y = height + 20; n.vy = -Math.abs(n.vy) }
      }

      // Connections
      const connectR = isMobile ? 180 : 170
      const connectR2 = connectR * connectR
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 < connectR2) {
            const alpha = 0.18 * (1 - d2 / connectR2)
            ctx.strokeStyle = hueToRgba('cyan', alpha)
            ctx.lineWidth = 0.6
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      // Spawn signals sparingly
      if (!reduced && Math.random() < (isMobile ? 0.012 : 0.035) && nodes.length > 1) {
        const from = nodes[(Math.random() * nodes.length) | 0]
        const candidates = nodes.filter((n) => {
          if (n === from) return false
          const dx = n.x - from.x
          const dy = n.y - from.y
          return dx * dx + dy * dy < connectR2
        })
        if (candidates.length) {
          const to = candidates[(Math.random() * candidates.length) | 0]
          signals.push({ from, to, t: 0, hue: to.hue, life: 1 })
        }
      }

      // Draw signals
      for (let i = signals.length - 1; i >= 0; i--) {
        const s = signals[i]
        s.t += 0.018
        if (s.t >= 1) {
          signals.splice(i, 1)
          continue
        }
        const x = s.from.x + (s.to.x - s.from.x) * s.t
        const y = s.from.y + (s.to.y - s.from.y) * s.t
        ctx.beginPath()
        ctx.fillStyle = hueToRgba(s.hue, 0.9)
        ctx.arc(x, y, 2.2, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.strokeStyle = hueToRgba(s.hue, 0.18)
        ctx.lineWidth = 1
        ctx.moveTo(s.from.x, s.from.y)
        ctx.lineTo(x, y)
        ctx.stroke()
      }

      // Draw nodes
      for (const n of nodes) {
        ctx.beginPath()
        const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 6)
        glow.addColorStop(0, hueToRgba(n.hue, 0.55))
        glow.addColorStop(1, hueToRgba(n.hue, 0))
        ctx.fillStyle = glow
        ctx.arc(n.x, n.y, n.r * 6, 0, Math.PI * 2)
        ctx.fill()

        ctx.beginPath()
        ctx.fillStyle = hueToRgba(n.hue, 1)
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fill()
      }

      rafId = requestAnimationFrame(step)
    }

    const handlePointer = (e) => {
      pointer.x = e.clientX
      pointer.y = e.clientY
      pointer.active = true
    }
    const handlePointerLeave = () => {
      pointer.active = false
    }

    const handleResize = () => { resize(); init() }

    resize()
    init()
    window.addEventListener('resize', handleResize)
    window.addEventListener('pointermove', handlePointer, { passive: true })
    window.addEventListener('pointerleave', handlePointerLeave)

    if (reduced) {
      // Render one still frame and stop
      step()
      cancelAnimationFrame(rafId)
    } else {
      rafId = requestAnimationFrame(step)
    }

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('pointermove', handlePointer)
      window.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [isMobile, reduced])

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(168,85,247,0.12), transparent 55%), radial-gradient(ellipse at 90% 110%, rgba(0,245,255,0.08), transparent 55%), #05060d' }}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute inset-0 grid-bg opacity-[0.25]" />
      <div className="absolute inset-0 scanlines opacity-40" />
    </div>
  )
}
