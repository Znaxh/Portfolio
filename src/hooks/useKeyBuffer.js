import { useEffect, useRef } from 'react'

/**
 * Rolling buffer of the last N global keypresses. When the buffer ends with
 * the given `needle` string, fires onMatch and clears the buffer.
 * Great for word-based easter eggs like "matrix".
 */
export function useKeyBuffer(needle, onMatch, opts = {}) {
  const { size = 16, caseSensitive = false } = opts
  const bufRef = useRef('')
  const needleRef = useRef(needle)
  const onMatchRef = useRef(onMatch)

  useEffect(() => { needleRef.current = needle }, [needle])
  useEffect(() => { onMatchRef.current = onMatch }, [onMatch])

  useEffect(() => {
    const handleKey = (e) => {
      const tag = (e.target && e.target.tagName) || ''
      if (['INPUT', 'TEXTAREA'].includes(tag) || e.isComposing) return
      if (e.key.length !== 1) return

      const ch = caseSensitive ? e.key : e.key.toLowerCase()
      const needle = caseSensitive ? needleRef.current : needleRef.current.toLowerCase()

      bufRef.current = (bufRef.current + ch).slice(-size)
      if (bufRef.current.endsWith(needle)) {
        bufRef.current = ''
        onMatchRef.current && onMatchRef.current()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [size, caseSensitive])
}
