import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import portfolio from '../../data/portfolio.json'
import { useIsMobile } from '../../hooks/useIsMobile'
import { useReducedMotion } from '../../hooks/useReducedMotion'

function buildGraph(groups, width, height) {
  const nodes = []
  const links = []
  const cx = width / 2
  const cy = height / 2
  const ringR = Math.min(width, height) * 0.32

  groups.forEach((g, gi) => {
    const gAngle = (gi / groups.length) * Math.PI * 2 - Math.PI / 2
    const gx = cx + Math.cos(gAngle) * ringR
    const gy = cy + Math.sin(gAngle) * ringR
    const anchorId = `anchor-${g.id}`
    nodes.push({
      id: anchorId,
      label: g.name,
      isAnchor: true,
      groupId: g.id,
      color: g.color,
      x: gx, y: gy,
      homeX: gx, homeY: gy,
      vx: 0, vy: 0,
      r: 7,
      level: 100,
    })

    const skillR = Math.min(width, height) * 0.13
    g.skills.forEach((s, si) => {
      const sAngle = gAngle + (si - (g.skills.length - 1) / 2) * 0.55
      const sx = gx + Math.cos(sAngle) * skillR
      const sy = gy + Math.sin(sAngle) * skillR
      const id = `${g.id}-${s.name}`
      nodes.push({
        id,
        label: s.name,
        isAnchor: false,
        groupId: g.id,
        color: g.color,
        x: sx, y: sy,
        homeX: sx, homeY: sy,
        vx: 0, vy: 0,
        r: 3 + (s.level / 100) * 5,
        level: s.level,
      })
      links.push({ source: anchorId, target: id, strength: s.level })
    })
  })

  // Connect group anchors together
  for (let i = 0; i < groups.length; i++) {
    const a = `anchor-${groups[i].id}`
    const b = `anchor-${groups[(i + 1) % groups.length].id}`
    links.push({ source: a, target: b, strength: 60, isAnchorLink: true })
  }

  return { nodes, links }
}

export default function SkillsConstellation() {
  const { skills } = portfolio
  const groups = skills.groups
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true })

  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const stateRef = useRef({ nodes: [], links: [], hoverId: null, pointer: null })
  const [activeGroup, setActiveGroup] = useState('all')
  const [hover, setHover] = useState(null)
  const isMobile = useIsMobile()
  const reduced = useReducedMotion()

  const layout = useCallback((w, h) => buildGraph(groups, w, h), [groups])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let rafId = 0
    let width = 0
    let height = 0
    let dpr = 1

    const resize = () => {
      const rect = container.getBoundingClientRect()
      width = rect.width
      height = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const graph = layout(width, height)
      stateRef.current.nodes = graph.nodes
      stateRef.current.links = graph.links
    }

    const lookup = (id) => stateRef.current.nodes.find((n) => n.id === id)

    const step = () => {
      const { nodes, links, pointer } = stateRef.current
      const dim = activeGroup !== 'all'

      ctx.clearRect(0, 0, width, height)

      // Light floaty motion + restoring force toward home
      for (const n of nodes) {
        if (!reduced) {
          n.vx += (n.homeX - n.x) * 0.02
          n.vy += (n.homeY - n.y) * 0.02
          n.vx += (Math.random() - 0.5) * 0.02
          n.vy += (Math.random() - 0.5) * 0.02
          n.vx *= 0.94
          n.vy *= 0.94
          n.x += n.vx
          n.y += n.vy
        }
        if (pointer && !reduced) {
          const dx = n.x - pointer.x
          const dy = n.y - pointer.y
          const dist = Math.hypot(dx, dy)
          if (dist < 60) {
            const f = (60 - dist) / 60 * 0.15
            n.vx += (dx / dist) * f
            n.vy += (dy / dist) * f
          }
        }
      }

      // Draw links
      for (const l of links) {
        const a = lookup(l.source)
        const b = lookup(l.target)
        if (!a || !b) continue
        const inactive = dim && a.groupId !== activeGroup && b.groupId !== activeGroup
        ctx.save()
        ctx.globalAlpha = inactive ? 0.08 : (l.isAnchorLink ? 0.25 : 0.35)
        const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y)
        grad.addColorStop(0, a.color)
        grad.addColorStop(1, b.color)
        ctx.strokeStyle = grad
        ctx.lineWidth = l.isAnchorLink ? 1.1 : 0.7
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
        ctx.restore()
      }

      // Draw nodes
      for (const n of nodes) {
        const inactive = dim && n.groupId !== activeGroup
        const isHovered = stateRef.current.hoverId === n.id
        ctx.save()
        ctx.globalAlpha = inactive ? 0.25 : 1

        const glowR = (n.r + (isHovered ? 8 : 3)) * 2.4
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR)
        grad.addColorStop(0, `${n.color}aa`)
        grad.addColorStop(1, `${n.color}00`)
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = n.color
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r + (isHovered ? 2 : 0), 0, Math.PI * 2)
        ctx.fill()

        if (n.isAnchor) {
          ctx.fillStyle = '#fff'
          ctx.font = '600 12px "Space Grotesk", system-ui, sans-serif'
          ctx.textAlign = 'center'
          ctx.fillText(n.label, n.x, n.y - n.r - 12)
        } else if (isHovered) {
          ctx.fillStyle = '#fff'
          ctx.font = '500 11px "JetBrains Mono", monospace'
          ctx.textAlign = 'center'
          ctx.fillText(`${n.label} · ${n.level}%`, n.x, n.y - n.r - 10)
        }

        ctx.restore()
      }

      rafId = requestAnimationFrame(step)
    }

    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect()
      return {
        x: (e.touches ? e.touches[0].clientX : e.clientX) - rect.left,
        y: (e.touches ? e.touches[0].clientY : e.clientY) - rect.top,
      }
    }

    const onMove = (e) => {
      const pos = getPos(e)
      stateRef.current.pointer = pos
      const nearest = stateRef.current.nodes.reduce((best, n) => {
        const d = Math.hypot(n.x - pos.x, n.y - pos.y)
        if (d < n.r + 24 && (!best || d < best.d)) return { n, d }
        return best
      }, null)
      const id = nearest ? nearest.n.id : null
      stateRef.current.hoverId = id
      if (id) {
        setHover({ label: nearest.n.label, level: nearest.n.level, group: nearest.n.groupId, isAnchor: nearest.n.isAnchor, color: nearest.n.color })
      } else {
        setHover(null)
      }
    }

    const onLeave = () => {
      stateRef.current.pointer = null
      stateRef.current.hoverId = null
      setHover(null)
    }

    resize()
    window.addEventListener('resize', resize)
    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('mouseleave', onLeave)
    canvas.addEventListener('touchmove', onMove, { passive: true })
    canvas.addEventListener('touchend', onLeave)

    rafId = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('mouseleave', onLeave)
      canvas.removeEventListener('touchmove', onMove)
      canvas.removeEventListener('touchend', onLeave)
    }
  }, [layout, activeGroup, reduced])

  const tabs = useMemo(() => ['all', ...groups.map((g) => g.id)], [groups])
  const groupLabels = useMemo(() => {
    const m = { all: 'All' }
    groups.forEach((g) => { m[g.id] = g.name })
    return m
  }, [groups])

  return (
    <section id="skills" ref={ref} className="relative py-24 md:py-32 px-4">
      <div className="container-edge">
        <div className="mb-12 flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="font-mono text-xs tracking-[0.3em] uppercase mb-3" style={{ color: '#a855f7' }}>
              // 02 — skills
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold">
              <span className="text-gradient">model.weights</span>
            </h2>
            <p className="mt-3 max-w-xl" style={{ color: '#9aa2bd' }}>
              A rough map of what I reach for. Hover any node to see the weight.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setActiveGroup(t)}
                className="px-3 py-1.5 rounded-full font-mono text-[11px] transition-all border"
                style={{
                  color: activeGroup === t ? '#fff' : '#9aa2bd',
                  background: activeGroup === t ? 'rgba(0, 245, 255, 0.12)' : 'transparent',
                  borderColor: activeGroup === t ? 'rgba(0, 245, 255, 0.4)' : 'rgba(91, 240, 255, 0.15)',
                }}
              >
                {groupLabels[t]}
              </button>
            ))}
          </div>
        </div>

        <div
          ref={containerRef}
          className="relative w-full rounded-2xl glass hairline overflow-hidden"
          style={{ height: isMobile ? 520 : 640 }}
        >
          <canvas ref={canvasRef} className="block w-full h-full" aria-label="Skills constellation" />

          {hover && (
            <div
              className="absolute top-4 left-4 p-3 rounded-lg glass-strong font-mono text-xs pointer-events-none"
              style={{ borderColor: `${hover.color}55`, borderWidth: 1, borderStyle: 'solid', color: '#c7ccde' }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full" style={{ background: hover.color }} />
                <span className="font-semibold" style={{ color: '#fff' }}>{hover.label}</span>
              </div>
              {!hover.isAnchor && (
                <div className="flex items-center gap-2">
                  <span style={{ color: '#6e78a0' }}>weight</span>
                  <span className="tabular-nums" style={{ color: hover.color }}>
                    {hover.level}%
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="absolute bottom-4 right-4 font-mono text-[10px]" style={{ color: '#6e78a0' }}>
            {inView ? `${groups.reduce((a, g) => a + g.skills.length, 0)} nodes · ${groups.length} clusters` : ''}
          </div>
        </div>

        {/* Compact grid fallback / companion */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {groups.map((g) => (
            <div
              key={g.id}
              className="p-5 rounded-xl glass hairline"
              onMouseEnter={() => setActiveGroup(g.id)}
              onMouseLeave={() => setActiveGroup('all')}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full" style={{ background: g.color }} />
                <h4 className="font-display font-semibold text-sm" style={{ color: '#fff' }}>{g.name}</h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {g.skills.map((s) => (
                  <span
                    key={s.name}
                    className="font-mono text-[10px] px-2 py-0.5 rounded"
                    style={{
                      color: g.color,
                      background: `${g.color}18`,
                      border: `1px solid ${g.color}33`,
                    }}
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
