import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const EPOCHS = [
  { label: 'Initializing neural network', total: 100 },
  { label: 'Loading training data',       total: 100 },
  { label: 'Warming up CUDA cores',       total: 100 },
  { label: 'Training model weights',      total: 100 },
  { label: 'Validating accuracy',         total: 100 },
  { label: 'Optimizing inference graph',  total: 100 },
]

const TARGET_ACCURACY = 98.7
const SESSION_KEY = 'aps_portfolio_loaded_v1'

function useSequentialProgress(active, count, epochMs = 520) {
  const [values, setValues] = useState(() => Array(count).fill(0))
  const [current, setCurrent] = useState(0)
  const [done, setDone] = useState(false)
  const rafRef = useRef(0)
  const startRef = useRef(0)

  useEffect(() => {
    if (!active) return
    let cancelled = false
    startRef.current = performance.now()

    const tick = (t) => {
      if (cancelled) return
      const elapsed = t - startRef.current
      const idx = Math.min(Math.floor(elapsed / epochMs), count - 1)
      const localFrac = Math.min(1, (elapsed - idx * epochMs) / epochMs)

      setCurrent(idx)
      setValues((prev) => {
        const next = prev.slice()
        for (let i = 0; i < count; i++) {
          if (i < idx) next[i] = 100
          else if (i === idx) next[i] = Math.round(localFrac * 100)
          else next[i] = 0
        }
        return next
      })

      if (idx >= count - 1 && localFrac >= 1) {
        setDone(true)
        return
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      cancelled = true
      cancelAnimationFrame(rafRef.current)
    }
  }, [active, count, epochMs])

  return { values, current, done }
}

export default function LoadingScreen({ onComplete }) {
  const reduced = useReducedMotion()

  const [show, setShow] = useState(() => {
    if (typeof window === 'undefined') return false
    try { return sessionStorage.getItem(SESSION_KEY) !== '1' } catch { return true }
  })

  const { values, current, done } = useSequentialProgress(show, EPOCHS.length, reduced ? 150 : 520)
  const [accuracy, setAccuracy] = useState(0)
  const [phase, setPhase] = useState('train') // 'train' | 'ready' | 'fade'

  // Animate accuracy counter during training
  useEffect(() => {
    if (!show || phase !== 'train') return
    let raf = 0
    const start = performance.now()
    const duration = reduced ? 500 : EPOCHS.length * 520
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setAccuracy(eased * TARGET_ACCURACY)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [show, phase, reduced])

  // Transition to ready state once done
  useEffect(() => {
    if (done) {
      setAccuracy(TARGET_ACCURACY)
      setPhase('ready')
      const t1 = setTimeout(() => setPhase('fade'), reduced ? 300 : 900)
      const t2 = setTimeout(() => {
        try { sessionStorage.setItem(SESSION_KEY, '1') } catch { /* noop */ }
        setShow(false)
        onComplete && onComplete()
      }, reduced ? 600 : 1500)
      return () => { clearTimeout(t1); clearTimeout(t2) }
    }
  }, [done, reduced, onComplete])

  // Lock body scroll while visible
  useEffect(() => {
    if (!show) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === 'fade' ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center"
          style={{ background: 'radial-gradient(ellipse at center, #0a0d1a 0%, #05060d 70%)' }}
          aria-label="Loading portfolio"
          role="status"
        >
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
          <div className="absolute inset-0 scanlines opacity-50 pointer-events-none" />

          <div className="relative w-[min(92vw,640px)] p-8 rounded-2xl glass-strong">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="relative w-3 h-3">
                  <span className="absolute inset-0 rounded-full bg-emerald-500 animate-pulse-glow" style={{ background: '#00ff88' }} />
                </div>
                <span className="font-mono text-xs tracking-widest text-fog-300 uppercase" style={{ color: '#9aa2bd' }}>
                  anurag.model / v1.2026
                </span>
              </div>
              <span className="font-mono text-xs text-fog-400" style={{ color: '#6e78a0' }}>
                epoch {Math.min(current + 1, EPOCHS.length)} / {EPOCHS.length}
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-1">
              <span className="font-mono text-sm text-fog-300" style={{ color: '#9aa2bd' }}>
                Training accuracy:
              </span>
              <span className="font-mono text-3xl md:text-4xl font-semibold text-gradient-emerald tabular-nums">
                {accuracy.toFixed(1)}%
              </span>
            </div>
            <div className="mb-8 font-mono text-xs text-fog-400" style={{ color: '#6e78a0' }}>
              loss: {(1 - accuracy / 100).toFixed(4)} &nbsp;·&nbsp; lr: 3e-4 &nbsp;·&nbsp; batch: 128
            </div>

            <div className="space-y-3">
              {EPOCHS.map((ep, i) => {
                const v = values[i] || 0
                const active = i === current && phase === 'train'
                const complete = v >= 100
                return (
                  <div key={ep.label}>
                    <div className="flex items-center justify-between mb-1.5 font-mono text-[11px]">
                      <span className={complete ? 'text-emerald-400' : active ? 'text-cyan-400' : 'text-fog-400'}
                            style={{ color: complete ? '#34f5a5' : active ? '#5bf0ff' : '#6e78a0' }}>
                        <span className="mr-2">{complete ? '✓' : active ? '▸' : '·'}</span>
                        {ep.label}
                      </span>
                      <span className="tabular-nums text-fog-400" style={{ color: '#6e78a0' }}>{v}%</span>
                    </div>
                    <div className="h-[3px] rounded-full overflow-hidden bg-ink-700" style={{ background: '#12162a' }}>
                      <div
                        className="h-full"
                        style={{
                          width: `${v}%`,
                          transition: 'width 120ms linear',
                          background: complete
                            ? 'linear-gradient(90deg, #00ff88, #00f5ff)'
                            : 'linear-gradient(90deg, #00f5ff, #a855f7)',
                          boxShadow: complete ? '0 0 12px rgba(0,255,136,0.5)' : '0 0 10px rgba(0,245,255,0.4)',
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            <AnimatePresence>
              {phase !== 'train' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 text-center font-mono text-sm"
                >
                  <span className="text-emerald-500" style={{ color: '#00ff88' }}>✓ Model ready.</span>
                  <span className="text-fog-300 ml-2" style={{ color: '#9aa2bd' }}>Launching interface...</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
