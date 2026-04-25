import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Brain, Coffee, ShieldCheck, Zap } from 'lucide-react'
import portfolio from '../../data/portfolio.json'
import profileImg from '../../assets/images/profile.webp'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const ICONS = { Brain, Coffee, ShieldCheck, Zap }

function AnimatedNumber({ target, inView, suffix = '' }) {
  const [value, setValue] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!inView) return
    if (reduced) { setValue(target); return }
    const duration = 1600
    const start = performance.now()
    let raf = 0
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.round(eased * target))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, target, reduced])

  return <span className="tabular-nums">{value}{suffix}</span>
}

function TypingReveal({ text, inView }) {
  const reduced = useReducedMotion()
  const words = text.split(/(\s+)/)
  if (reduced || !inView) {
    return <p className="text-base md:text-lg leading-relaxed" style={{ color: '#c7ccde' }}>{text}</p>
  }
  return (
    <p className="text-base md:text-lg leading-relaxed" style={{ color: '#c7ccde' }}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: i * 0.02, duration: 0.32 }}
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
        >
          {w}
        </motion.span>
      ))}
    </p>
  )
}

export default function About() {
  const { about, personal } = portfolio
  const [ref, inView] = useInView({ threshold: 0.15, triggerOnce: true })
  const [imgLoaded, setImgLoaded] = useState(false)
  const reduced = useReducedMotion()

  const badgeCount = about.badges.length
  const orbitBase = 190 // px

  return (
    <section id="about" ref={ref} className="relative py-24 md:py-32 px-4">
      <div className="container-edge">
        {/* Section header */}
        <div className="mb-16 flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="font-mono text-xs tracking-[0.3em] uppercase mb-3" style={{ color: '#00f5ff' }}>
              // 01 — about
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold">
              <span className="text-gradient">whoami</span>
            </h2>
          </div>
          <div className="font-mono text-xs max-w-xs" style={{ color: '#6e78a0' }}>
            <span style={{ color: '#5bf0ff' }}>$</span> cat ./bio.md
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
          {/* Left: Image + orbits */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative" style={{ width: 'min(380px, 80vw)', height: 'min(380px, 80vw)' }}>
              {/* Rotating hex border */}
              <div
                className="absolute inset-0 hex-clip"
                style={{
                  background: 'conic-gradient(from 0deg, #00f5ff, #a855f7, #00ff88, #00f5ff)',
                  animation: reduced ? 'none' : 'rotate360 22s linear infinite',
                  padding: '2px',
                }}
              >
                <div className="w-full h-full hex-clip" style={{ background: '#05060d' }} />
              </div>

              {/* Image clipped hex */}
              <div
                className="absolute hex-clip overflow-hidden"
                style={{ top: 10, left: 10, right: 10, bottom: 10 }}
              >
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #0d1020, #12162a)' }}
                >
                  {!imgLoaded && (
                    <span className="font-display text-6xl text-gradient">{personal.initials}</span>
                  )}
                  <img
                    src={profileImg}
                    alt={personal.name}
                    onLoad={() => setImgLoaded(true)}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Orbit ring */}
              <div
                className="absolute inset-[-30px] rounded-full border"
                style={{ borderColor: 'rgba(91, 240, 255, 0.15)', borderStyle: 'dashed' }}
              />

              {/* Orbiting tech badges */}
              {about.badges.map((badge, i) => {
                const angle = (i / badgeCount) * Math.PI * 2
                const x = Math.cos(angle) * orbitBase
                const y = Math.sin(angle) * orbitBase
                const delay = (i / badgeCount) * (reduced ? 0 : 20)
                return (
                  <div
                    key={badge.label}
                    aria-hidden="true"
                    className="absolute left-1/2 top-1/2"
                    style={{
                      marginLeft: -40,
                      marginTop: -12,
                      transform: reduced
                        ? `translate(${x}px, ${y}px)`
                        : undefined,
                      animation: reduced
                        ? 'none'
                        : `orbit 20s linear infinite`,
                      animationDelay: `-${delay}s`,
                      ['--orbit-r']: `${orbitBase}px`,
                    }}
                  >
                    <div
                      className="px-2.5 py-1 rounded-full font-mono text-[10px] font-medium border whitespace-nowrap"
                      style={{
                        background: 'rgba(13, 16, 32, 0.88)',
                        borderColor: `${badge.color}55`,
                        color: badge.color,
                        boxShadow: `0 0 14px -4px ${badge.color}66`,
                      }}
                    >
                      {badge.label}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right: Bio */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="font-display text-2xl md:text-3xl font-semibold" style={{ color: '#fff' }}>
              {about.greeting}
            </h3>

            <div className="space-y-4">
              {about.paragraphs.map((p, i) => (
                <TypingReveal key={i} text={p} inView={inView} />
              ))}
            </div>

            {/* Trait rows */}
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 pt-2">
              {about.traits.map((t, i) => {
                const Icon = ICONS[t.icon] || Zap
                return (
                  <motion.div
                    key={t.text}
                    initial={{ opacity: 0, x: -12 }}
                    animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
                    transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                    className="flex items-start gap-3"
                  >
                    <div
                      className="mt-0.5 w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
                      style={{
                        background: 'rgba(0, 245, 255, 0.08)',
                        border: '1px solid rgba(0, 245, 255, 0.2)',
                      }}
                    >
                      <Icon size={15} style={{ color: '#5bf0ff' }} />
                    </div>
                    <span className="text-sm pt-1.5" style={{ color: '#c7ccde' }}>
                      {t.text}
                    </span>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
          {about.stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.45 }}
              className="p-5 rounded-xl glass hairline text-center"
            >
              <div className="font-display text-3xl md:text-4xl font-bold text-gradient-emerald mb-1.5">
                <AnimatedNumber target={s.value} inView={inView} suffix={s.suffix} />
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: '#9aa2bd' }}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
