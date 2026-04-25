import { Coffee, Github, Linkedin, Mail } from 'lucide-react'
import portfolio from '../../data/portfolio.json'

const iconFor = {
  github: Github,
  linkedin: Linkedin,
  email: Mail,
}

export default function Footer() {
  const { socials } = portfolio
  const year = new Date().getFullYear()

  return (
    <footer className="relative mt-16 border-t" style={{ borderColor: 'rgba(91,240,255,0.08)' }}>
        <div className="container-edge py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs" style={{ color: '#9aa2bd' }}>
            Built with <span style={{ color: '#5bf0ff' }}>React</span> +{' '}
            <Coffee size={12} className="inline -mt-0.5" style={{ color: '#ffb547' }} /> by{' '}
            <span style={{ color: '#fff' }}>Anurag</span>
            <span className="mx-2" style={{ color: '#6e78a0' }}>·</span>
            © {year}
          </p>

          <div className="flex items-center gap-1">
            {socials
              .filter((s) => iconFor[s.id])
              .map((s) => {
                const Icon = iconFor[s.id]
                return (
                  <a
                    key={s.id}
                    href={s.url}
                    target={s.id === 'email' ? '_self' : '_blank'}
                    rel={s.id === 'email' ? undefined : 'noopener noreferrer'}
                    aria-label={s.label}
                    className="p-2 rounded-md transition-colors hover:text-cyan-400"
                    style={{ color: '#9aa2bd' }}
                  >
                    <Icon size={16} />
                  </a>
                )
              })}
          </div>
        </div>

        <div className="container-edge pb-6 font-mono text-[10px]" style={{ color: '#6e78a0' }}>
          <span style={{ color: '#00ff88' }}>$</span> exit 0
        </div>
    </footer>
  )
}
