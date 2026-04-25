import { useEffect, useRef } from 'react'

/**
 * Listens globally for a specific sequence of keys and fires onMatch when hit.
 *
 * @param {string[]} sequence Array of keyboard `event.key` values, in order.
 * @param {() => void} onMatch Called when the full sequence is typed.
 * @param {object} [opts]
 * @param {boolean} [opts.caseSensitive=false]
 * @param {number}  [opts.resetMs=2000] How long without a matching key before buffer resets.
 */
export function useKeySequence(sequence, onMatch, opts = {}) {
  const { caseSensitive = false, resetMs = 2000 } = opts
  const bufferRef = useRef([])
  const timerRef = useRef(null)
  const targetRef = useRef(sequence)
  const onMatchRef = useRef(onMatch)

  useEffect(() => {
    targetRef.current = sequence
  }, [sequence])

  useEffect(() => {
    onMatchRef.current = onMatch
  }, [onMatch])

  useEffect(() => {
    const handleKey = (e) => {
      const tag = (e.target && e.target.tagName) || ''
      if (['INPUT', 'TEXTAREA'].includes(tag) || e.isComposing) return

      const raw = e.key
      const key = caseSensitive ? raw : raw.toLowerCase()
      const target = targetRef.current.map((k) => (caseSensitive ? k : k.toLowerCase()))

      bufferRef.current.push(key)
      if (bufferRef.current.length > target.length) {
        bufferRef.current.shift()
      }

      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        bufferRef.current = []
      }, resetMs)

      if (bufferRef.current.length === target.length) {
        const match = bufferRef.current.every((k, i) => k === target[i])
        if (match) {
          bufferRef.current = []
          onMatchRef.current && onMatchRef.current()
        }
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('keydown', handleKey)
      clearTimeout(timerRef.current)
    }
  }, [caseSensitive, resetMs])
}
