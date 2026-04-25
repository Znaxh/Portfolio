import { useRef } from 'react'
import { animated, useSpring } from '@react-spring/web'
import { useIsTouch } from '../../hooks/useIsTouch'
import { useReducedMotion } from '../../hooks/useReducedMotion'

/**
 * MagneticButton — springs toward the cursor within a radius.
 * Disabled on touch devices and when prefers-reduced-motion is on.
 */
export default function MagneticButton({
  as: Tag = 'button',
  radius = 80,
  maxDisplace = 12,
  innerParallax = 1.7,
  glowColor = '#00f5ff',
  className = '',
  style,
  children,
  onClick,
  ...rest
}) {
  const ref = useRef(null)
  const isTouch = useIsTouch()
  const reduced = useReducedMotion()
  const disabled = isTouch || reduced

  const [{ x, y, scale }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
    config: { mass: 1.4, tension: 180, friction: 18 },
  }))

  const [{ ix, iy }, innerApi] = useSpring(() => ({
    ix: 0,
    iy: 0,
    config: { mass: 1.2, tension: 200, friction: 16 },
  }))

  const handleMove = (e) => {
    if (disabled || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const dist = Math.hypot(dx, dy)
    if (dist > radius + Math.max(rect.width, rect.height) / 2) {
      api.start({ x: 0, y: 0, scale: 1 })
      innerApi.start({ ix: 0, iy: 0 })
      return
    }
    const strength = Math.min(1, 1 - dist / (radius + 60))
    const tx = (dx / radius) * maxDisplace * strength
    const ty = (dy / radius) * maxDisplace * strength
    api.start({ x: tx, y: ty, scale: 1.03 })
    innerApi.start({ ix: tx * innerParallax, iy: ty * innerParallax })
  }

  const handleLeave = () => {
    api.start({ x: 0, y: 0, scale: 1 })
    innerApi.start({ ix: 0, iy: 0 })
  }

  const handleEnter = () => {
    if (disabled) return
    api.start({ scale: 1.03 })
  }

  const AnimatedTag = animated(Tag)

  return (
    <AnimatedTag
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        x,
        y,
        scale,
        ['--magnetic-glow']: glowColor,
        ...style,
      }}
      className={`magnetic-btn relative inline-flex items-center justify-center gap-2 transition-shadow duration-300 hover:shadow-[0_0_32px_-4px_var(--magnetic-glow)] ${className}`}
      {...rest}
    >
      <animated.span
        style={{ x: ix, y: iy }}
        className="inline-flex items-center gap-2 pointer-events-none"
      >
        {children}
      </animated.span>
    </AnimatedTag>
  )
}
