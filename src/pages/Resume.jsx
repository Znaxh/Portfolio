import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Award,
  Briefcase,
  Calendar,
  Download,
  ExternalLink,
  Filter,
  GraduationCap,
  MapPin,
} from 'lucide-react'
import portfolio from '../data/portfolio.json'
import MagneticButton from '../components/ui/MagneticButton'

const typeConfig = {
  experience:    { icon: Briefcase,     label: 'Experience',    color: '#00f5ff' },
  education:     { icon: GraduationCap, label: 'Education',     color: '#a855f7' },
  certification: { icon: Award,         label: 'Certifications', color: '#00ff88' },
}

const filters = [
  { id: 'all', label: 'All' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'certification', label: 'Certifications' },
]

function TimelineItem({ item, side, index }) {
  const cfg = typeConfig[item.type] || typeConfig.experience
  const Icon = cfg.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: index * 0.04 }}
      className="relative grid grid-cols-[24px_1fr] md:grid-cols-[1fr_56px_1fr] gap-4 md:gap-0"
    >
      {/* Desktop left column */}
      <div className={`hidden md:block ${side === 'left' ? '' : 'opacity-0'}`}>
        {side === 'left' && <Card item={item} align="right" />}
      </div>

      {/* Node column (center on desktop, left on mobile) */}
      <div className="relative flex items-start justify-center">
        <div className="sticky top-24">
          <div
            className="relative w-6 h-6 rounded-full flex items-center justify-center"
            style={{
              background: '#05060d',
              border: `2px solid ${cfg.color}`,
              boxShadow: `0 0 16px ${cfg.color}66`,
            }}
          >
            <span
              className="absolute inset-0 rounded-full animate-pulse-glow"
              style={{ background: `${cfg.color}33` }}
            />
            <Icon size={10} style={{ color: cfg.color }} />
          </div>
        </div>
      </div>

      {/* Content column */}
      <div className={`md:hidden`}>
        <Card item={item} align="left" />
      </div>
      <div className="hidden md:block">
        {side === 'right' ? <Card item={item} align="left" /> : null}
      </div>
    </motion.div>
  )
}

function Card({ item, align }) {
  const cfg = typeConfig[item.type] || typeConfig.experience
  return (
    <div
      className={`relative p-5 md:p-6 rounded-xl glass hairline ${align === 'right' ? 'md:text-right' : ''}`}
      style={{ borderColor: `${cfg.color}33` }}
    >
      <div className={`flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] mb-2 ${align === 'right' ? 'md:justify-end' : ''}`} style={{ color: cfg.color }}>
        <span>{cfg.label}</span>
        <span style={{ color: '#6e78a0' }}>·</span>
        <span style={{ color: '#9aa2bd' }}>{item.startDate}{item.endDate && item.endDate !== item.startDate ? ` — ${item.endDate}` : ''}</span>
      </div>

      <h3 className="font-display text-lg font-semibold mb-0.5" style={{ color: '#fff' }}>
        {item.role}
      </h3>
      <div className="font-mono text-sm mb-3" style={{ color: cfg.color }}>
        {item.org}
      </div>

      {item.location && (
        <div className={`flex items-center gap-1.5 text-[11px] font-mono mb-3 ${align === 'right' ? 'md:justify-end' : ''}`} style={{ color: '#6e78a0' }}>
          <MapPin size={11} />
          <span>{item.location}</span>
        </div>
      )}

      <ul className={`space-y-1.5 mb-3 ${align === 'right' ? 'md:list-none' : ''}`}>
        {item.description.map((d, i) => (
          <li key={i} className={`text-sm flex items-start gap-2 ${align === 'right' ? 'md:flex-row-reverse md:text-right' : ''}`} style={{ color: '#c7ccde' }}>
            <span style={{ color: cfg.color }}>▸</span>
            <span>{d}</span>
          </li>
        ))}
      </ul>

      {item.technologies && item.technologies.length > 0 && (
        <div className={`flex flex-wrap gap-1.5 ${align === 'right' ? 'md:justify-end' : ''}`}>
          {item.technologies.map((t) => (
            <span
              key={t}
              className="font-mono text-[10px] px-1.5 py-0.5 rounded"
              style={{
                color: '#c7ccde',
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${cfg.color}2a`,
              }}
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {item.credentialUrl && item.credentialUrl !== '#' && (
        <a
          href={item.credentialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] px-2.5 py-1 rounded border hover:bg-white/5 transition-colors"
          style={{ color: cfg.color, borderColor: `${cfg.color}55` }}
        >
          verify <ExternalLink size={11} />
        </a>
      )}
    </div>
  )
}

export default function Resume() {
  const { experience, education, certifications, personal } = portfolio
  const all = useMemo(
    () => [...experience, ...education, ...certifications].sort((a, b) => b.year - a.year),
    [experience, education, certifications]
  )

  const [active, setActive] = useState('all')
  const filtered = useMemo(
    () => (active === 'all' ? all : all.filter((i) => i.type === active)),
    [all, active]
  )

  return (
    <div className="min-h-screen pt-20 pb-24 px-4">
      <div className="container-edge">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="font-mono text-xs tracking-[0.3em] uppercase mb-3" style={{ color: '#5bf0ff' }}>
            /resume
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-5">
            <span className="text-gradient">career.log</span>
          </h1>
          <p className="max-w-2xl mx-auto mb-8" style={{ color: '#9aa2bd' }}>
            A filterable timeline of what I've built, studied, and certified. Prefer the paper version? Download it.
          </p>
          <MagneticButton
            as="a"
            href={personal.resumeDownloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            glowColor="#00f5ff"
            className="px-6 py-3 rounded-full font-medium text-sm"
            style={{ background: 'linear-gradient(90deg, #00f5ff, #a855f7)', color: '#05060d' }}
          >
            <Download size={15} />
            <span>download pdf</span>
          </MagneticButton>
        </div>

        {/* Filters */}
        <div className="mb-10 flex items-center gap-3 justify-center flex-wrap">
          <Filter size={14} style={{ color: '#6e78a0' }} />
          {filters.map((f) => (
            <motion.button
              key={f.id}
              onClick={() => setActive(f.id)}
              whileTap={{ scale: 0.95 }}
              className="relative px-4 py-1.5 rounded-full font-mono text-xs transition-colors border"
              style={{
                color: active === f.id ? '#05060d' : '#c7ccde',
                background: active === f.id ? '#00f5ff' : 'transparent',
                borderColor: active === f.id ? '#00f5ff' : 'rgba(91, 240, 255, 0.2)',
              }}
            >
              {f.label}
            </motion.button>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div
            aria-hidden="true"
            className="absolute left-3 md:left-1/2 top-0 bottom-0 w-px"
            style={{
              background: 'linear-gradient(180deg, transparent 0%, rgba(91,240,255,0.4) 12%, rgba(168,85,247,0.35) 50%, rgba(0,255,136,0.35) 88%, transparent 100%)',
              transform: 'translateX(-0.5px)',
            }}
          />

          <div className="space-y-10">
            {filtered.map((item, i) => (
              <TimelineItem
                key={item.id}
                item={item}
                side={i % 2 === 0 ? 'right' : 'left'}
                index={i}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 font-mono text-sm" style={{ color: '#6e78a0' }}>
              no entries for that filter. try another.
            </div>
          )}
        </div>

        {/* Footer stat */}
        <div className="mt-20 text-center font-mono text-xs" style={{ color: '#6e78a0' }}>
          <Calendar size={12} className="inline -mt-0.5 mr-1" />
          last updated — {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
      </div>
    </div>
  )
}
