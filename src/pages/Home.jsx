import HeroTerminal from '../components/sections/HeroTerminal'
import MetricsStrip from '../components/sections/MetricsStrip'
import { lazy, Suspense } from 'react'
const SkillGraph = lazy(() => import('../components/SkillGraph'))
import ProjectCard from '../components/sections/ProjectCard'
import TiltCard from '../components/TiltCard'
import portfolioData from '../data/portfolio.json'

export default function Home() {
  return (
    <>
      <HeroTerminal />
      <MetricsStrip />
      
      {/* About */}
      <section id="about" className="py-20 border-b theme-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6 font-mono theme-heading"><span className="theme-accent">~/</span>about</h2>
          <p className="text-xl font-sans leading-relaxed theme-muted">
            {portfolioData.meta.tagline}
          </p>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-20 border-b theme-section-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <h2 className="text-3xl font-bold mb-3 font-mono theme-heading"><span className="theme-accent">~/</span>Work I've Built</h2>
            <p className="theme-muted">Open any project to see a larger animated architecture window, pipeline states, impact, and build details.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioData.projects.map(project => (
              <TiltCard key={project.id}>
                <ProjectCard project={project} />
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="h-[500px] w-full bg-[#05060d] flex items-center justify-center text-[#00ff88] font-mono">Loading SkillGraph...</div>}>
        <SkillGraph />
      </Suspense>

      {/* Experience */}
      <section id="experience" className="py-20 border-b theme-section-alt">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-10 font-mono theme-heading"><span className="theme-accent">~/</span>experience</h2>
          <div className="space-y-12">
            {portfolioData.experience.map((exp, idx) => (
              <div key={idx} className="relative pl-8 border-l theme-border">
                <div className="absolute w-4 h-4 rounded-full -left-[9px] top-1 theme-dot"></div>
                <h3 className="text-2xl font-bold theme-heading">{exp.company}</h3>
                <p className="theme-accent font-mono mb-4">{exp.role} • {exp.period}</p>
                <ul className="list-disc list-inside theme-muted space-y-2">
                  {exp.bullets.map((bullet, bIdx) => (
                    <li key={bIdx}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section id="achievements" className="py-20 border-b theme-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-10 font-mono theme-heading"><span className="theme-accent">~/</span>achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {portfolioData.achievements.map((ach, idx) => (
              <div key={idx} className="theme-card p-6 rounded-xl transition-colors">
                <div className="text-xs theme-accent font-mono mb-2 uppercase">{ach.type}</div>
                <h3 className="text-xl font-bold theme-heading mb-1">{ach.title}</h3>
                <p className="text-sm theme-muted mb-4">{ach.subtitle}</p>
                <p className="text-sm theme-body">{ach.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 theme-section-alt">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-10 font-mono theme-heading"><span className="theme-accent">~/</span>contact</h2>
          <p className="theme-muted mb-8">Reach out for opportunities or just to say hi.</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <a href={`mailto:${portfolioData.meta.email}`} className="px-6 py-3 theme-primary-btn font-mono font-bold transition-colors rounded">
              Email Me
            </a>
            <a href={portfolioData.meta.github} target="_blank" rel="noreferrer" className="px-6 py-3 theme-ghost-btn font-mono transition-colors rounded">
              GitHub
            </a>
            <a href={portfolioData.meta.linkedin} target="_blank" rel="noreferrer" className="px-6 py-3 theme-ghost-btn font-mono transition-colors rounded">
              LinkedIn
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
