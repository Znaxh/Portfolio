import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

// ASCII codes for A, P, S as binary
const BINARY_APS = ['01000001', '01010000', '01010011']

/**
 * BinaryFloat — emits a stream of floating "APS" encoded as binary across
 * the screen for a few seconds when `trigger` changes.
 */
export default function BinaryFloat({ trigger }) {
  const [items, setItems] = useState([])
  const idRef = useRef(0)

  useEffect(() => {
    if (!trigger) return
    const batch = []
    for (let i = 0; i < 28; i++) {
      batch.push({
        id: ++idRef.current,
        x: Math.random() * 100,
        y: 100 + Math.random() * 20,
        delay: Math.random() * 0.6,
        duration: 3 + Math.random() * 2,
        text: BINARY_APS[i % 3],
        size: 10 + Math.random() * 8,
        color: ['#00f5ff', '#a855f7', '#00ff88'][i % 3],
        drift: (Math.random() - 0.5) * 20,
      })
    }
    setItems(batch)
    const t = setTimeout(() => setItems([]), 5800)
    return () => clearTimeout(t)
  }, [trigger])

  return (
    <div className="fixed inset-0 z-[9997] pointer-events-none">
      <AnimatePresence>
        {items.map((it) => (
          <motion.div
            key={it.id}
            initial={{ y: '100vh', x: `${it.x}vw`, opacity: 0 }}
            animate={{
              y: '-20vh',
              x: `calc(${it.x}vw + ${it.drift}vw)`,
              opacity: [0, 1, 1, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: it.duration,
              delay: it.delay,
              ease: 'linear',
              opacity: { times: [0, 0.1, 0.85, 1], duration: it.duration },
            }}
            className="absolute font-mono"
            style={{
              fontSize: it.size,
              color: it.color,
              textShadow: `0 0 8px ${it.color}`,
              letterSpacing: 2,
            }}
          >
            {it.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
