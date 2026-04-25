import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

if (typeof window !== 'undefined') {
  console.log(
    '%c👀 Inspecting my code?',
    'color: #00f5ff; font-size: 20px; font-weight: bold; text-shadow: 0 0 8px #00f5ff;'
  )
  console.log(
    '%cI see you snooping. That curiosity is exactly what I look for too.',
    'color: #a855f7; font-size: 14px;'
  )
  console.log(
    '%c→ znaxxh@gmail.com | github.com/Znaxh',
    'color: #00ff88; font-size: 12px; font-family: monospace;'
  )
  console.log(
    '%cPro tip: try the Konami code on the homepage. Or type "matrix".',
    'color: #6e78a0; font-size: 11px; font-style: italic;'
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
