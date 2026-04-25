import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useScrollProgress } from '../../hooks/useScrollProgress'
import { useActiveSection } from '../../hooks/useActiveSection'

const navItems = [
  { name: 'work',    href: '/#projects',   section: 'projects' },
  { name: 'skills',  href: '/#skills',     section: 'skills'   },
  { name: 'about',   href: '/#about',      section: 'about'    },
  { name: 'contact', href: '/#contact',    section: 'contact'  },
  { name: 'resume',  href: '/resume.pdf',  section: null       },
]

function AnimatedLogo({ onLogoClick }) {
  const letters = ['A', 'P', 'S']
  return (
    <button
      onClick={onLogoClick}
      className="inline-flex items-center gap-0.5 font-display font-bold text-lg tracking-tight"
      aria-label="Home — APS"
    >
      <span className="font-mono text-xs mr-1" style={{ color: '#00ff88' }}>//</span>
      {letters.map((l, i) => (
        <motion.span
          key={l + i}
          whileHover={{ y: -4, scale: 1.1, color: '#00ff88' }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          className="inline-block"
          style={{
            color: '#fff',
            textShadow: '0 0 0px rgba(0,255,136,0)',
          }}
        >
          {l}
        </motion.span>
      ))}
    </button>
  )
}

function MorphingBurger({ open, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={open ? 'Close menu' : 'Open menu'}
      aria-expanded={open}
      className="md:hidden w-10 h-10 flex items-center justify-center rounded-md border"
      style={{
        borderColor: 'rgba(0, 255, 136, 0.2)',
        background: 'rgba(8, 10, 20, 0.6)',
      }}
    >
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <motion.path
          d="M 3 6 L 19 6"
          stroke="#00ff88"
          strokeWidth="1.5"
          strokeLinecap="round"
          animate={open ? { d: 'M 5 5 L 17 17' } : { d: 'M 3 6 L 19 6' }}
        />
        <motion.path
          d="M 3 11 L 19 11"
          stroke="#00ff88"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ opacity: 1 }}
          animate={open ? { opacity: 0 } : { opacity: 1 }}
        />
        <motion.path
          d="M 3 16 L 19 16"
          stroke="#00ff88"
          strokeWidth="1.5"
          strokeLinecap="round"
          animate={open ? { d: 'M 5 17 L 17 5' } : { d: 'M 3 16 L 19 16' }}
        />
      </svg>
    </button>
  )
}

export default function Navbar({ onLogoClick }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const progress = useScrollProgress()

  const sectionIds = navItems.filter((n) => n.section).map((n) => n.section)
  const currentSection = useActiveSection(sectionIds)

  const activeName = (() => {
    return currentSection || 'home'
  })()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const listRef = useRef(null)
  const [indicator, setIndicator] = useState({ left: 0, width: 0, visible: false })

  const measure = useCallback(() => {
    if (!listRef.current) return
    const target = listRef.current.querySelector(`[data-nav="${activeName}"]`)
    if (!target) {
      setIndicator((s) => ({ ...s, visible: false }))
      return
    }
    const parentRect = listRef.current.getBoundingClientRect()
    const rect = target.getBoundingClientRect()
    setIndicator({
      left: rect.left - parentRect.left,
      width: rect.width,
      visible: true,
    })
  }, [activeName])

  useLayoutEffect(() => { measure() }, [measure])
  useEffect(() => {
    const onResize = () => measure()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [measure])

  const handleNavClick = (item, e) => {
    setOpen(false)
    if (item.name === 'resume') return; // let the default a tag behavior handle the PDF

    if (item.href.startsWith('/#')) {
      e.preventDefault()
      const id = item.section
      if (location.pathname !== '/') {
        navigate('/')
        setTimeout(() => {
          const el = document.getElementById(id)
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      } else {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'rgba(0, 255, 136, 0.08)' }}>
        <div
          className="h-full origin-left"
          style={{
            width: '100%',
            transform: `scaleX(${progress})`,
            background: 'linear-gradient(90deg, #00ff88, #8b5cf6, #00ff88)',
            transition: 'transform 80ms linear',
            boxShadow: '0 0 10px rgba(0,255,136,0.5)',
          }}
        />
      </div>

      <div
        className={`transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'}`}
        style={{
          borderBottom: scrolled ? '1px solid rgba(0,255,136,0.08)' : '1px solid transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <AnimatedLogo onLogoClick={() => {
             navigate('/');
             window.scrollTo({ top: 0, behavior: 'smooth' });
          }} />

          <div ref={listRef} className="hidden md:flex items-center relative">
            {navItems.map((item) => {
              const isActive = activeName === item.name
              
              if(item.name === 'resume') {
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    data-nav={item.name}
                    className="relative px-3.5 py-2 font-mono text-[12px] tracking-wide transition-colors text-gray-400 hover:text-white"
                  >
                    {item.name}
                  </a>
                )
              }

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  data-nav={item.name}
                  onClick={(e) => handleNavClick(item, e)}
                  className="relative px-3.5 py-2 font-mono text-[12px] tracking-wide transition-colors"
                  style={{ color: isActive ? '#fff' : '#9aa2bd' }}
                >
                  {item.name}
                </Link>
              )
            })}
            {indicator.visible && (
              <motion.span
                aria-hidden="true"
                className="absolute bottom-1 h-[2px] rounded-full"
                animate={{ left: indicator.left, width: indicator.width }}
                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                style={{
                  background: 'linear-gradient(90deg, #00ff88, #8b5cf6)',
                  boxShadow: '0 0 12px rgba(0,255,136,0.6)',
                }}
              />
            )}
          </div>

          <MorphingBurger open={open} onClick={() => setOpen((v) => !v)} />
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="md:hidden bg-black/95 backdrop-blur-lg border-t"
            style={{ borderColor: 'rgba(0,255,136,0.1)' }}
          >
            <div className="px-4 py-4 flex flex-col max-w-7xl mx-auto">
              {navItems.map((item, i) => {
                 if (item.name === 'resume') {
                    return (
                      <a
                        key={item.name}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="py-3 font-mono text-sm border-b last:border-b-0 flex items-center justify-between"
                        style={{
                          borderColor: 'rgba(0,255,136,0.08)',
                          color: '#c7ccde',
                        }}
                      >
                        <span><span style={{ color: '#6e78a0' }}>0{i + 1}.</span> {item.name}</span>
                      </a>
                    )
                 }
                 
                 return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={(e) => handleNavClick(item, e)}
                    className="py-3 font-mono text-sm border-b last:border-b-0 flex items-center justify-between"
                    style={{
                      borderColor: 'rgba(0,255,136,0.08)',
                      color: activeName === item.name ? '#00ff88' : '#c7ccde',
                    }}
                  >
                    <span>
                      <span style={{ color: '#6e78a0' }}>0{i + 1}.</span>{' '}
                      {item.name}
                    </span>
                    {activeName === item.name && <span style={{ color: '#00ff88' }}>▸</span>}
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
