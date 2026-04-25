import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useKeyBuffer } from '../../hooks/useKeyBuffer'

/**
 * When user types "matrix" anywhere, flash a fullscreen canvas Matrix rain
 * for ~5 seconds, then fade out.
 */
export default function MatrixEasterEgg() {
  const [active, setActive] = useState(false)
  const canvasRef = useRef(null)

  useKeyBuffer('matrix', () => setActive(true))

  useEffect(() => {
    if (!active) return
    const t = setTimeout(() => setActive(false), 5200)
    return () => clearTimeout(t)
  }, [active])

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let rafId = 0
    let w = canvas.width = window.innerWidth
    let h = canvas.height = window.innerHeight
    const glyphs = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$#@!%&*▓░·'
    const fontSize = 16
    const cols = Math.floor(w / fontSize)
    const drops = new Array(cols).fill(0).map(() => Math.random() * -h / fontSize)

    const resize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', resize)

    const step = () => {
      ctx.fillStyle = 'rgba(5, 6, 13, 0.12)'
      ctx.fillRect(0, 0, w, h)

      ctx.font = `${fontSize}px "JetBrains Mono", monospace`

      for (let i = 0; i < drops.length; i++) {
        const ch = glyphs[Math.floor(Math.random() * glyphs.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        if (Math.random() < 0.015) {
          ctx.fillStyle = '#d4fff3'
        } else {
          ctx.fillStyle = `rgba(0, 255, 136, ${0.5 + Math.random() * 0.4})`
        }
        ctx.fillText(ch, x, y)

        if (y > h && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      }
      rafId = requestAnimationFrame(step)
    }
    rafId = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [active])

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-[9998] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.0 } }}
          transition={{ duration: 0.2 }}
          style={{ background: '#05060d' }}
        >
          <canvas ref={canvasRef} className="block w-full h-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="font-mono text-lg md:text-2xl px-6 py-3 rounded-lg"
              style={{
                color: '#00ff88',
                background: 'rgba(5, 6, 13, 0.6)',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                textShadow: '0 0 12px #00ff88',
              }}
            >
              wake up, Anurag...
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
