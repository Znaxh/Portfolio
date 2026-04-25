import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Console easter egg — runs once on page load
const ASCII_ART = `
 █████╗ ███╗   ██╗██╗   ██╗██████╗  █████╗  ██████╗ 
██╔══██╗████╗  ██║██║   ██║██╔══██╗██╔══██╗██╔════╝ 
███████║██╔██╗ ██║██║   ██║██████╔╝███████║██║  ███╗
██╔══██║██║╚██╗██║██║   ██║██╔══██╗██╔══██║██║   ██║
██║  ██║██║ ╚████║╚██████╔╝██║  ██║██║  ██║╚██████╔╝
╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ 
`

console.log(
  `%c${ASCII_ART}`,
  'color: #00f5ff; font-family: monospace; font-size: 10px;'
)
console.log(
  '%c👀 You found the console. You are exactly the kind of developer we want.',
  'color: #7c3aed; font-size: 14px; font-weight: bold;'
)
console.log(
  '%c📧 anurag.ps.contact@gmail.com  |  🐙 github.com/Znaxh',
  'color: #f59e0b; font-size: 12px;'
)
console.log(
  '%c🤖 Built with: React 19 + Vite + TailwindCSS v4 + Framer Motion + Love',
  'color: rgba(255,255,255,0.5); font-size: 11px;'
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
