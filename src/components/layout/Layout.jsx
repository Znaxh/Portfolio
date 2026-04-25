import { useState } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import BinaryFloat from '../effects/BinaryFloat'

const LOGO_CLICK_THRESHOLD = 5
const RESET_AFTER_MS = 2500

export default function Layout({ children }) {
  const [logoClicks, setLogoClicks] = useState(0)
  const [binaryTrigger, setBinaryTrigger] = useState(0)
  const [resetTimer, setResetTimer] = useState(null)

  const handleLogoClick = () => {
    const next = logoClicks + 1
    if (next >= LOGO_CLICK_THRESHOLD) {
      setBinaryTrigger((n) => n + 1)
      setLogoClicks(0)
      if (resetTimer) clearTimeout(resetTimer)
    } else {
      setLogoClicks(next)
      if (resetTimer) clearTimeout(resetTimer)
      setResetTimer(setTimeout(() => setLogoClicks(0), RESET_AFTER_MS))
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onLogoClick={handleLogoClick} />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
      <BinaryFloat trigger={binaryTrigger} />
    </div>
  )
}
