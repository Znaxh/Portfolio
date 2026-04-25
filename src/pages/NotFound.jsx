import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Home } from 'lucide-react'
import MagneticButton from '../components/ui/MagneticButton'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <div className="text-center max-w-lg">
        <div className="font-mono text-xs tracking-[0.3em] uppercase mb-6" style={{ color: '#ff5e84' }}>
          // stack trace
        </div>

        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="font-display text-[clamp(6rem,18vw,12rem)] font-bold leading-none mb-4"
        >
          <span className="text-gradient">404</span>
        </motion.h1>

        <motion.pre
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-mono text-left text-[11px] md:text-xs p-4 md:p-5 rounded-lg glass hairline overflow-x-auto mb-8"
          style={{ color: '#c7ccde' }}
        >
<span style={{ color: '#ff7a9a' }}>Traceback</span> (most recent call last):{'\n'}
  File <span style={{ color: '#5bf0ff' }}>"/browser/router.jsx"</span>, line <span style={{ color: '#a855f7' }}>42</span>, in <span style={{ color: '#00ff88' }}>resolveRoute</span>{'\n'}
    return routes[<span style={{ color: '#5bf0ff' }}>request.path</span>]{'\n'}
<span style={{ color: '#ff7a9a' }}>RouteNotFound</span>: the page you asked for doesn't exist (yet).
        </motion.pre>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm md:text-base mb-8"
          style={{ color: '#9aa2bd' }}
        >
          Either the URL is wrong, or I broke something and haven't noticed yet. Let's get you somewhere useful.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3"
        >
          <MagneticButton
            as={Link}
            to="/"
            glowColor="#00f5ff"
            className="px-5 py-2.5 rounded-full font-medium text-sm"
            style={{ background: 'linear-gradient(90deg, #00f5ff, #a855f7)', color: '#05060d' }}
          >
            <Home size={15} />
            <span>home</span>
          </MagneticButton>
          <MagneticButton
            as="button"
            onClick={() => window.history.back()}
            glowColor="#a855f7"
            className="px-5 py-2.5 rounded-full font-medium text-sm border"
            style={{ borderColor: 'rgba(91,240,255,0.25)', color: '#fff' }}
          >
            <ArrowLeft size={15} />
            <span>back</span>
          </MagneticButton>
        </motion.div>
      </div>
    </div>
  )
}
