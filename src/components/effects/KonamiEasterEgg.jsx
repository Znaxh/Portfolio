import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'
import { useKeySequence } from '../../hooks/useKeySequence'

const KONAMI = [
  'ArrowUp','ArrowUp',
  'ArrowDown','ArrowDown',
  'ArrowLeft','ArrowRight',
  'ArrowLeft','ArrowRight',
  'b','a',
]

const CLASSIFIED_STATS = [
  { label: 'Coffee consumed while coding',              value: '847 cups',  icon: '☕' },
  { label: 'Bugs introduced · bugs fixed',              value: '2,341 · 2,339', icon: '🐛' },
  { label: 'Stack Overflow visits',                     value: '10,482',    icon: '📚' },
  { label: 'Times said "it works on my machine"',       value: '156',       icon: '💻' },
  { label: 'Models trained at 3am',                     value: '23',        icon: '🌙' },
  { label: 'Accuracy before realizing labels were flipped', value: '3.2%',  icon: '📉' },
]

const SESSION_KEY = 'aps_konami_shown_v1'

export default function KonamiEasterEgg() {
  const [show, setShow] = useState(false)
  const [shownThisSession, setShownThisSession] = useState(() => {
    try { return sessionStorage.getItem(SESSION_KEY) === '1' } catch { return false }
  })

  useKeySequence(KONAMI, () => {
    if (shownThisSession) return
    const el = document.getElementById('root')
    if (el) {
      el.style.animation = 'glitch 0.8s steps(12, end)'
      setTimeout(() => { el.style.animation = '' }, 900)
    }
    setTimeout(() => {
      setShow(true)
      setShownThisSession(true)
      try { sessionStorage.setItem(SESSION_KEY, '1') } catch { /* noop */ }
    }, 800)
  })

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setShow(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10001] flex items-center justify-center p-4"
          style={{ background: 'rgba(5, 6, 13, 0.85)', backdropFilter: 'blur(10px)' }}
          onClick={() => setShow(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-2xl p-7 md:p-9 overflow-hidden"
            style={{
              background: 'linear-gradient(160deg, #1a0818, #0a0d1a)',
              border: '1px solid rgba(255, 94, 132, 0.4)',
              boxShadow: '0 0 60px -12px rgba(255, 94, 132, 0.5), 0 0 120px -24px rgba(168, 85, 247, 0.3)',
            }}
          >
            <button
              onClick={() => setShow(false)}
              aria-label="Close"
              className="absolute top-4 right-4 p-1.5 rounded hover:bg-white/10 transition-colors"
              style={{ color: '#9aa2bd' }}
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-4 font-mono text-xs tracking-widest uppercase" style={{ color: '#ff5e84' }}>
              <AlertTriangle size={14} className="animate-pulse" />
              SYSTEM BREACH DETECTED
              <AlertTriangle size={14} className="animate-pulse" />
            </div>

            <h3 className="font-display text-2xl md:text-3xl font-bold mb-2" style={{ color: '#fff' }}>
              <span className="text-gradient">Classified Dev Stats</span>
            </h3>
            <p className="text-xs font-mono mb-6" style={{ color: '#9aa2bd' }}>
              You weren't supposed to see this.
            </p>

            <ul className="space-y-3">
              {CLASSIFIED_STATS.map((s, i) => (
                <motion.li
                  key={s.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                  className="flex items-center justify-between gap-3 py-2 border-b"
                  style={{ borderColor: 'rgba(91, 240, 255, 0.08)' }}
                >
                  <span className="text-sm flex items-center gap-2" style={{ color: '#c7ccde' }}>
                    <span className="text-base">{s.icon}</span>
                    {s.label}
                  </span>
                  <span className="font-mono text-sm font-semibold" style={{ color: '#5bf0ff' }}>
                    {s.value}
                  </span>
                </motion.li>
              ))}
            </ul>

            <div className="mt-6 pt-4 border-t font-mono text-[10px] text-center" style={{ borderColor: 'rgba(91,240,255,0.1)', color: '#6e78a0' }}>
              press <span style={{ color: '#5bf0ff' }}>esc</span> or click anywhere to dismiss
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
