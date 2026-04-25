import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ArrowUpRight, ExternalLink, Github } from 'lucide-react'
import portfolio from '../../data/portfolio.json'
import MagneticButton from '../ui/MagneticButton'
import { useReducedMotion } from '../../hooks/useReducedMotion'

function ProjectCard({ project, index, inView }) {
  const cardRef = useRef(null)
  const reduced = useReducedMotion()
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50 })

  const onMove = (e) => {
    if (reduced || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    const rx = (0.5 - py) * 6
    const ry = (px - 0.5) * 6
    setTilt({ rx, ry, gx: px * 100, gy: py * 100 })
  }
  const onLeave = () => setTilt({ rx: 0, ry: 0, gx: 50, gy: 50 })

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative group rounded-2xl overflow-hidden"
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: 'transform 200ms ease-out',
        background: 'linear-gradient(160deg, rgba(13,16,32,0.8), rgba(8,10,20,0.9))',
        border: `1px solid ${project.accent}33`,
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${tilt.gx}% ${tilt.gy}%, ${project.accent}22, transparent 40%)`,
        }}
      />

      <div className="relative p-6 md:p-7 flex flex-col h-full min-h-[360px]">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2 font-mono text-[11px]" style={{ color: project.accent }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: project.accent, boxShadow: `0 0 10px ${project.accent}` }} />
            project_{String(index + 1).padStart(2, '0')} · {project.year}
          </div>
          {project.featured && (
            <span className="font-mono text-[10px] px-2 py-0.5 rounded border"
                  style={{ color: project.accent, borderColor: `${project.accent}55` }}>
              FEATURED
            </span>
          )}
        </div>

        <h3 className="font-display text-2xl font-semibold mb-1.5" style={{ color: '#fff' }}>
          {project.name}
        </h3>
        <p className="text-sm mb-4 font-mono" style={{ color: project.accent }}>
          {project.tagline}
        </p>
        <p className="text-sm leading-relaxed mb-5 line-clamp-3" style={{ color: '#9aa2bd' }}>
          {project.description}
        </p>

        <ul className="space-y-1.5 mb-5">
          {project.highlights.map((h) => (
            <li key={h} className="text-xs flex items-start gap-2" style={{ color: '#c7ccde' }}>
              <span style={{ color: project.accent }}>▸</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.stack.map((t) => (
            <span
              key={t}
              className="font-mono text-[10px] px-2 py-0.5 rounded"
              style={{
                color: '#c7ccde',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(91,240,255,0.12)',
              }}
            >
              {t}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 mt-auto">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-md border hover:bg-white/5 transition-colors"
              style={{ color: '#c7ccde', borderColor: 'rgba(91,240,255,0.2)' }}
            >
              <Github size={13} /> code
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-md"
              style={{ color: '#05060d', background: project.accent }}
            >
              <ExternalLink size={13} /> live
            </a>
          )}
          <div className="ml-auto text-[10px] font-mono flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity"
               style={{ color: project.accent }}>
            <span>explore</span>
            <ArrowUpRight size={12} />
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export default function ProjectsSection() {
  const { projects } = portfolio
  const [filter, setFilter] = useState('featured')
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })

  const years = useMemo(
    () => Array.from(new Set(projects.map((p) => p.year))).sort((a, b) => b - a),
    [projects]
  )

  const filters = useMemo(() => ([
    { id: 'featured', label: 'Featured' },
    { id: 'all', label: 'All' },
    ...years.map((y) => ({ id: String(y), label: String(y) })),
  ]), [years])

  const visible = useMemo(() => {
    if (filter === 'featured') return projects.filter((p) => p.featured)
    if (filter === 'all') return projects
    return projects.filter((p) => String(p.year) === filter)
  }, [projects, filter])

  return (
    <section id="projects" ref={ref} className="relative py-24 md:py-32 px-4">
      <div className="container-edge">
        <div className="mb-10 flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="font-mono text-xs tracking-[0.3em] uppercase mb-3" style={{ color: '#00ff88' }}>
              // 03 — projects
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold">
              <span className="text-gradient">./shipped/</span>
            </h2>
            <p className="mt-3 max-w-xl" style={{ color: '#9aa2bd' }}>
              Selected work. Most of these started as "can I actually build this?" and lived long enough to be refactored.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className="relative px-3 py-1.5 rounded-full font-mono text-[11px] transition-all border"
                style={{
                  color: filter === f.id ? '#fff' : '#9aa2bd',
                  background: filter === f.id ? 'rgba(0, 255, 136, 0.12)' : 'transparent',
                  borderColor: filter === f.id ? 'rgba(0, 255, 136, 0.4)' : 'rgba(91, 240, 255, 0.15)',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {visible.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} inView={inView} />
          ))}
        </div>

        <div className="mt-14 text-center">
          <MagneticButton
            as="a"
            href="https://github.com/Znaxh"
            target="_blank"
            rel="noopener noreferrer"
            glowColor="#00ff88"
            className="px-6 py-3 rounded-full font-medium text-sm border"
            style={{ borderColor: 'rgba(0,255,136,0.4)', color: '#00ff88' }}
          >
            <Github size={15} />
            <span>more on github</span>
            <ArrowUpRight size={15} />
          </MagneticButton>
        </div>
      </div>
    </section>
  )
}
