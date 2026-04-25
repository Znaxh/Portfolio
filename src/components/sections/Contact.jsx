import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react'
import portfolio from '../../data/portfolio.json'

const ICONS = { email: Mail, github: Github, linkedin: Linkedin }

const CARD_CONFIG = {
  email:    { label: 'Email',    hint: 'usually the fastest path',      accent: '#00f5ff' },
  github:   { label: 'GitHub',   hint: 'code, projects, and commit streaks', accent: '#a855f7' },
  linkedin: { label: 'LinkedIn', hint: 'for recruiters and the serious stuff', accent: '#00ff88' },
}

export default function Contact() {
  const { socials, personal, openTo } = portfolio
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true })

  const cards = socials
    .filter((s) => CARD_CONFIG[s.id])
    .map((s) => ({ ...s, ...CARD_CONFIG[s.id], Icon: ICONS[s.id] }))

  return (
    <section id="contact" ref={ref} className="relative py-24 md:py-32 px-4">
      <div className="container-edge">
        <div className="mb-10">
          <div className="font-mono text-xs tracking-[0.3em] uppercase mb-3" style={{ color: '#ff5e84' }}>
            // 04 — contact
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-bold leading-tight">
            Let's build<br />
            <span className="text-gradient">something weird</span>
          </h2>
          <p className="mt-5 max-w-2xl text-base md:text-lg" style={{ color: '#9aa2bd' }}>
            I'm finishing my degree and actively looking for the next thing. Research, internships, open source — if it's interesting and lets me ship models, I probably want in.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {cards.map((c, i) => {
            const Icon = c.Icon
            return (
              <motion.a
                key={c.id}
                href={c.url}
                target={c.id === 'email' ? '_self' : '_blank'}
                rel={c.id === 'email' ? undefined : 'noopener noreferrer'}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="conic-border group relative p-6 md:p-7 rounded-2xl overflow-hidden transition-transform duration-300 hover:-translate-y-1"
                style={{ color: '#fff' }}
              >
                <div className="flex items-start justify-between mb-8">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: `${c.accent}18`,
                      border: `1px solid ${c.accent}40`,
                      boxShadow: `0 0 24px -6px ${c.accent}66`,
                    }}
                  >
                    <Icon size={22} style={{ color: c.accent }} />
                  </div>
                  <ArrowUpRight
                    size={18}
                    className="opacity-40 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"
                    style={{ color: c.accent }}
                  />
                </div>

                <div className="font-mono text-[11px] uppercase tracking-widest mb-1" style={{ color: c.accent }}>
                  {c.label}
                </div>
                <div className="font-display text-lg md:text-xl font-semibold break-all mb-2" style={{ color: '#fff' }}>
                  {c.handle}
                </div>
                <div className="text-xs" style={{ color: '#9aa2bd' }}>
                  {c.hint}
                </div>
              </motion.a>
            )
          })}
        </div>

        <div className="rounded-2xl p-6 md:p-7 glass hairline">
          <div className="flex items-baseline gap-3 mb-4">
            <span className="font-mono text-[11px] uppercase tracking-widest" style={{ color: '#5bf0ff' }}>
              currently open to
            </span>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse-glow" style={{ background: '#00ff88' }} />
          </div>
          <div className="flex flex-wrap gap-2">
            {openTo.map((o, i) => (
              <motion.span
                key={o}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: 0.4 + i * 0.07 }}
                className="font-mono text-xs px-3 py-1.5 rounded-full"
                style={{
                  color: '#c7ccde',
                  background: 'rgba(0, 245, 255, 0.08)',
                  border: '1px solid rgba(0, 245, 255, 0.2)',
                }}
              >
                {o}
              </motion.span>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t font-mono text-xs" style={{ borderColor: 'rgba(91,240,255,0.1)', color: '#6e78a0' }}>
            <span style={{ color: '#00ff88' }}>$</span> response_time &lt; 24h · based in {personal.location.split(',')[0]} ({personal.timezone})
          </div>
        </div>
      </div>
    </section>
  )
}
