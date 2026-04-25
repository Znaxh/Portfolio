import { useEffect, useState } from 'react'

/**
 * Observes sections on the page and returns the id of the one
 * currently most visible in the viewport.
 */
export function useActiveSection(sectionIds) {
  const [active, setActive] = useState(sectionIds[0] || '')

  useEffect(() => {
    if (!sectionIds || sectionIds.length === 0) return

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    if (elements.length === 0) return

    const visibility = new Map()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibility.set(entry.target.id, entry.intersectionRatio)
        }
        let topId = sectionIds[0]
        let topRatio = 0
        for (const [id, ratio] of visibility.entries()) {
          if (ratio > topRatio) {
            topRatio = ratio
            topId = id
          }
        }
        setActive(topId)
      },
      {
        rootMargin: '-40% 0px -40% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [sectionIds])

  return active
}
