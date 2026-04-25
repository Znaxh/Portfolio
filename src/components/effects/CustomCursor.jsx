import { useEffect, useRef, useState } from 'react'
import { useIsTouch } from '../../hooks/useIsTouch'
import { useReducedMotion } from '../../hooks/useReducedMotion'

/**
 * Custom dual-layer cursor:
 *   - Inner dot: follows the pointer 1:1
 *   - Outer ring: lags behind and grows over interactive elements
 */
export default function CustomCursor() {
  const isTouch = useIsTouch()
  const reduced = useReducedMotion()
  const enabled = !isTouch && !reduced
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const [variant, setVariant] = useState('default')

  useEffect(() => {
    if (!enabled) {
      document.body.classList.remove('custom-cursor-active')
      return
    }
    document.body.classList.add('custom-cursor-active')

    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let rx = mx
    let ry = my
    let rafId = 0

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`
      }
    }

    const tick = () => {
      rx += (mx - rx) * 0.18
      ry += (my - ry) * 0.18
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
      }
      rafId = requestAnimationFrame(tick)
    }

    const hoverTargets = 'a, button, [role="button"], .magnetic-btn, input, textarea, [data-cursor="hover"]'
    const onOver = (e) => {
      if (e.target.closest && e.target.closest(hoverTargets)) setVariant('hover')
      if (e.target.closest && e.target.closest('[data-cursor="text"]')) setVariant('text')
    }
    const onOut = (e) => {
      if (!e.relatedTarget || !e.relatedTarget.closest) { setVariant('default'); return }
      if (!e.relatedTarget.closest(hoverTargets)) setVariant('default')
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      document.body.classList.remove('custom-cursor-active')
    }
  }, [enabled])

  if (!enabled) return null

  const ringSize =
    variant === 'hover' ? 56 : variant === 'text' ? 4 : 28
  const ringOpacity = variant === 'text' ? 0 : 1
  const dotSize = variant === 'text' ? 20 : 5

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] transition-[width,height,opacity,border-color] duration-200 ease-out"
        style={{
          width: ringSize,
          height: ringSize,
          borderRadius: '50%',
          marginLeft: -ringSize / 2,
          marginTop: -ringSize / 2,
          border: '1.5px solid rgba(0, 245, 255, 0.8)',
          background: variant === 'hover' ? 'rgba(0, 245, 255, 0.12)' : 'transparent',
          boxShadow: variant === 'hover' ? '0 0 24px rgba(0, 245, 255, 0.4)' : 'none',
          opacity: ringOpacity,
          mixBlendMode: 'screen',
        }}
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] transition-[width,height,border-radius] duration-150 ease-out"
        style={{
          width: dotSize,
          height: dotSize,
          marginLeft: -dotSize / 2,
          marginTop: -dotSize / 2,
          borderRadius: variant === 'text' ? 2 : '50%',
          background: variant === 'text' ? 'rgba(0, 245, 255, 0.9)' : '#00f5ff',
          boxShadow: '0 0 8px rgba(0, 245, 255, 0.6)',
        }}
      />
    </>
  )
}
