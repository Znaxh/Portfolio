import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Github, Linkedin, Mail, Terminal as TerminalIcon } from 'lucide-react'
import portfolio from '../../data/portfolio.json'
import MagneticButton from '../ui/MagneticButton'
import { useIsTouch } from '../../hooks/useIsTouch'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const LINES = {
  USER: 'user',
  SYSTEM: 'system',
  OUTPUT: 'output',
  ERROR: 'error',
}

function useTypedTitle(strings, enabled) {
  const [text, setText] = useState('')
  const [index, setIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!enabled) { setText(strings[0]); return }
    const current = strings[index % strings.length]
    const speed = deleting ? 35 : 55
    const timeout = setTimeout(() => {
      if (!deleting) {
        const next = current.slice(0, text.length + 1)
        setText(next)
        if (next === current) {
          setTimeout(() => setDeleting(true), 1400)
        }
      } else {
        const next = current.slice(0, Math.max(0, text.length - 1))
        setText(next)
        if (next === '') {
          setDeleting(false)
          setIndex((i) => i + 1)
        }
      }
    }, speed)
    return () => clearTimeout(timeout)
  }, [text, deleting, index, strings, enabled])

  return text
}

export default function TerminalHero() {
  const navigate = useNavigate()
  const isTouch = useIsTouch()
  const reduced = useReducedMotion()

  const { personal, terminal, socials } = portfolio
  const prompt = terminal.prompt
  const github = socials.find((s) => s.id === 'github')?.url
  const linkedin = socials.find((s) => s.id === 'linkedin')?.url

  const commandsByName = useMemo(() => {
    const map = new Map()
    for (const c of terminal.commands) map.set(c.name, c)
    return map
  }, [terminal.commands])

  const [lines, setLines] = useState(() =>
    terminal.welcome.map((t) => ({ type: LINES.SYSTEM, text: t }))
  )
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const [booting, setBooting] = useState(true)
  const inputRef = useRef(null)
  const scrollRef = useRef(null)

  const typed = useTypedTitle(
    ['AI/ML Engineer.', 'Neural Net Tinkerer.', 'Data Science Student.', 'Model Shipper.'],
    !reduced
  )

  // Boot sequence — "training done" flourish
  useEffect(() => {
    const t = setTimeout(() => setBooting(false), reduced ? 100 : 900)
    return () => clearTimeout(t)
  }, [reduced])

  // Focus input when section is clicked
  const focusInput = () => {
    if (!isTouch && inputRef.current) inputRef.current.focus()
  }

  // Auto-scroll to latest line
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [lines])

  const runCommand = (raw) => {
    const cmd = raw.trim()
    if (!cmd) return

    setHistory((h) => [...h, cmd])
    setHistoryIdx(-1)

    setLines((L) => [...L, { type: LINES.USER, text: `${prompt} ${cmd}` }])

    const match =
      commandsByName.get(cmd) ||
      commandsByName.get(cmd.toLowerCase()) ||
      [...commandsByName.keys()].find((k) => k.toLowerCase() === cmd.toLowerCase())
        ? commandsByName.get([...commandsByName.keys()].find((k) => k.toLowerCase() === cmd.toLowerCase()))
        : null

    if (!match) {
      setLines((L) => [
        ...L,
        { type: LINES.ERROR, text: `command not found: ${cmd}` },
        { type: LINES.OUTPUT, text: `try 'help' for available commands.` },
      ])
      return
    }

    if (match.action) {
      if (match.action === 'help') {
        setLines((L) => [
          ...L,
          { type: LINES.OUTPUT, text: 'Available commands:' },
          ...terminal.commands.map((c) => ({
            type: LINES.OUTPUT,
            text: `  ${c.name.padEnd(16, ' ')}  ${c.description}`,
          })),
        ])
        return
      }
      if (match.action === 'clear') {
        setLines([])
        return
      }
      if (match.action.startsWith('scrollTo:')) {
        const id = match.action.slice('scrollTo:'.length)
        const el = document.querySelector(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
        setLines((L) => [...L, { type: LINES.OUTPUT, text: `navigating to ${id}...` }])
        return
      }
      if (match.action.startsWith('navigate:')) {
        const path = match.action.slice('navigate:'.length)
        setLines((L) => [...L, { type: LINES.OUTPUT, text: `opening ${path}...` }])
        setTimeout(() => navigate(path), 400)
        return
      }
      if (match.action.startsWith('openUrl:')) {
        const url = match.action.slice('openUrl:'.length)
        setLines((L) => [...L, { type: LINES.OUTPUT, text: `opening ${url}` }])
        window.open(url, '_blank', 'noopener,noreferrer')
        return
      }
    }

    if (match.output) {
      setLines((L) => [...L, ...match.output.map((t) => ({ type: LINES.OUTPUT, text: t }))])
    }
  }

  const onKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      runCommand(input)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length === 0) return
      const newIdx = historyIdx < 0 ? history.length - 1 : Math.max(0, historyIdx - 1)
      setHistoryIdx(newIdx)
      setInput(history[newIdx])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIdx < 0) return
      const newIdx = historyIdx + 1
      if (newIdx >= history.length) {
        setHistoryIdx(-1)
        setInput('')
      } else {
        setHistoryIdx(newIdx)
        setInput(history[newIdx])
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const matches = terminal.commands
        .map((c) => c.name)
        .filter((n) => n.startsWith(input))
      if (matches.length === 1) setInput(matches[0])
    } else if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      setLines([])
    }
  }

  const suggestionChips = terminal.commands
    .filter((c) => !c.name.startsWith('sudo'))
    .slice(0, 6)

  return (
    <section
      id="home"
      className="relative min-h-[100svh] flex items-center justify-center px-4 pt-20 pb-16"
    >
      <div className="container-edge w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left — identity + headline */}
        <div className="lg:col-span-5 order-2 lg:order-1">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-glow" style={{ background: '#00ff88' }} />
            <span className="font-mono text-xs tracking-[0.2em] uppercase" style={{ color: '#9aa2bd' }}>
              Available for 2026 internships
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] mb-5">
            {personal.name.split(' ').slice(0, -1).join(' ')}
            <br />
            <span className="text-gradient">{personal.name.split(' ').slice(-1)[0]}</span>
          </h1>

          <p className="font-mono text-base md:text-lg mb-3" style={{ color: '#9aa2bd' }}>
            <span className="text-cyan-400" style={{ color: '#5bf0ff' }}>&gt;</span>{' '}
            <span>{typed}</span>
            <span className="caret" />
          </p>

          <p className="text-base md:text-lg leading-relaxed mb-8 max-w-lg" style={{ color: '#9aa2bd' }}>
            {personal.tagline}
          </p>

          <div className="flex flex-wrap gap-3 mb-6">
            <MagneticButton
              as="a"
              href={personal.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              glowColor="#00f5ff"
              className="px-6 py-3 rounded-full font-medium text-sm bg-gradient-to-r from-cyan-500 to-violet-500 text-ink-950"
              style={{ background: 'linear-gradient(90deg, #00f5ff, #a855f7)', color: '#05060d' }}
            >
              <TerminalIcon size={16} />
              <span>View Resume</span>
            </MagneticButton>
            <MagneticButton
              as="a"
              href="#contact"
              glowColor="#a855f7"
              className="px-6 py-3 rounded-full font-medium text-sm border border-cyan-500/30"
              style={{ color: '#fff' }}
            >
              <Mail size={16} />
              <span>Get in touch</span>
            </MagneticButton>
          </div>

          <div className="flex items-center gap-4 text-fog-400" style={{ color: '#6e78a0' }}>
            <a href={github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"
               className="hover:text-cyan-400 transition-colors">
              <Github size={18} />
            </a>
            <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
               className="hover:text-cyan-400 transition-colors">
              <Linkedin size={18} />
            </a>
            <a href={`mailto:${personal.email}`} aria-label="Email"
               className="hover:text-cyan-400 transition-colors">
              <Mail size={18} />
            </a>
            <span className="font-mono text-xs">{personal.location}</span>
          </div>
        </div>

        {/* Right — interactive terminal */}
        <div className="lg:col-span-7 order-1 lg:order-2">
          <div
            className="rounded-xl overflow-hidden glass-strong ring-glow"
            onClick={focusInput}
          >
            {/* Title bar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-cyan-500/10 bg-ink-900/60"
                 style={{ background: 'rgba(8,10,20,0.6)' }}>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full" style={{ background: '#ff5577' }} />
                <span className="w-3 h-3 rounded-full" style={{ background: '#ffb547' }} />
                <span className="w-3 h-3 rounded-full" style={{ background: '#00ff88' }} />
              </div>
              <div className="font-mono text-[11px]" style={{ color: '#6e78a0' }}>
                anurag@neural-net — -zsh — 96×24
              </div>
              <TerminalIcon size={14} style={{ color: '#6e78a0' }} />
            </div>

            {/* Body */}
            <div
              ref={scrollRef}
              className="font-mono text-[13px] leading-[1.55] p-5 h-[420px] overflow-y-auto"
              style={{ background: 'rgba(5, 6, 13, 0.85)' }}
              aria-label="Terminal output"
            >
              {booting && (
                <div style={{ color: '#6e78a0' }}>
                  [<span style={{ color: '#00ff88' }}>ok</span>] loading weights from ./anurag.ckpt
                  <br />
                  [<span style={{ color: '#00ff88' }}>ok</span>] activating inference runtime
                </div>
              )}

              {!booting && lines.map((line, i) => {
                const color =
                  line.type === LINES.USER    ? '#fff' :
                  line.type === LINES.ERROR   ? '#ff7a9a' :
                  line.type === LINES.SYSTEM  ? '#9aa2bd' :
                                                '#c7ccde'
                return (
                  <div key={i} style={{ color }} className="whitespace-pre-wrap break-words">
                    {line.text}
                  </div>
                )
              })}

              {!booting && (
                <div className="flex items-center gap-2">
                  <span style={{ color: '#00ff88' }}>{prompt}</span>
                  <input
                    ref={inputRef}
                    aria-label="Terminal input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKey}
                    className="flex-1 bg-transparent outline-none border-none font-mono text-white caret-cyan-400"
                    spellCheck={false}
                    autoComplete="off"
                    autoCapitalize="none"
                    autoFocus={!isTouch}
                  />
                </div>
              )}
            </div>

            {/* Suggestion chips */}
            <div className="flex flex-wrap gap-2 px-4 py-3 border-t border-cyan-500/10 bg-ink-900/60"
                 style={{ background: 'rgba(8,10,20,0.6)' }}>
              {suggestionChips.map((c) => (
                <button
                  key={c.name}
                  onClick={() => runCommand(c.name)}
                  className="font-mono text-[11px] px-2.5 py-1 rounded-md border border-cyan-500/20 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-colors"
                  style={{ color: '#9aa2bd' }}
                  aria-label={`Run ${c.name} command`}
                >
                  <span style={{ color: '#5bf0ff' }}>$</span> {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 font-mono text-[11px] text-center lg:text-right" style={{ color: '#6e78a0' }}>
            tip: try <span style={{ color: '#5bf0ff' }}>help</span>, <span style={{ color: '#5bf0ff' }}>whoami</span>, or <span style={{ color: '#5bf0ff' }}>sudo hire-me</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        aria-label="Scroll to About"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 font-mono text-[10px] tracking-widest uppercase hover:text-cyan-400 transition-colors"
        style={{ color: '#6e78a0' }}
      >
        <span>scroll</span>
        <ChevronDown size={18} className="animate-float" />
      </a>
    </section>
  )
}
