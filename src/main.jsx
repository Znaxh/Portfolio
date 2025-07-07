import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Global error handler for cookie-related issues
window.addEventListener('error', (event) => {
  // Suppress Cloudflare cookie errors
  if (event.message && event.message.includes('__cf_bm')) {
    event.preventDefault()
    return false
  }
})

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  // Suppress cookie-related promise rejections
  if (event.reason && event.reason.toString().includes('cookie')) {
    event.preventDefault()
    return false
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
