import HeroTerminal from '../components/sections/HeroTerminal'
import MetricsStrip from '../components/sections/MetricsStrip'
import { lazy, Suspense } from 'react'
const SkillsGraph = lazy(() => import('../components/sections/SkillsGraph'))
import ProjectCard from '../components/sections/ProjectCard'
import portfolioData from '../data/portfolio.json'

export default function Home() {
  return (
    <>
      <HeroTerminal />
      <MetricsStrip />
      
      {/* About */}
      <section id="about" className="py-20 bg-black border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6 font-mono"><span className="text-[#00ff88]">~/</span>about</h2>
          <p className="text-xl text-gray-400 font-sans leading-relaxed">
            {portfolioData.meta.tagline}
          </p>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-20 bg-[#050505] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10 font-mono"><span className="text-[#00ff88]">~/</span>Work I've Built</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioData.projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="h-[500px] w-full bg-black flex items-center justify-center text-[#00ff88] font-mono">Loading SkillsGraph...</div>}>
        <SkillsGraph />
      </Suspense>

      {/* Experience */}
      <section id="experience" className="py-20 bg-[#050505] border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10 font-mono"><span className="text-[#00ff88]">~/</span>experience</h2>
          <div className="space-y-12">
            {portfolioData.experience.map((exp, idx) => (
              <div key={idx} className="relative pl-8 border-l border-gray-800">
                <div className="absolute w-4 h-4 bg-[#00ff88] rounded-full -left-[9px] top-1"></div>
                <h3 className="text-2xl font-bold text-white">{exp.company}</h3>
                <p className="text-[#00ff88] font-mono mb-4">{exp.role} • {exp.period}</p>
                <ul className="list-disc list-inside text-gray-400 space-y-2">
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
      <section id="achievements" className="py-20 bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10 font-mono"><span className="text-[#00ff88]">~/</span>achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {portfolioData.achievements.map((ach, idx) => (
              <div key={idx} className="bg-[#111] border border-gray-800 p-6 rounded-xl hover:border-[#00ff88] transition-colors">
                <div className="text-xs text-[#00ff88] font-mono mb-2 uppercase">{ach.type}</div>
                <h3 className="text-xl font-bold text-white mb-1">{ach.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{ach.subtitle}</p>
                <p className="text-sm text-gray-300">{ach.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 bg-[#050505]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-10 font-mono"><span className="text-[#00ff88]">~/</span>contact</h2>
          <p className="text-gray-400 mb-8">Reach out for opportunities or just to say hi.</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <a href={`mailto:${portfolioData.meta.email}`} className="px-6 py-3 bg-[#00ff88] text-black font-mono font-bold hover:bg-[#00cc66] transition-colors rounded">
              Email Me
            </a>
            <a href={portfolioData.meta.github} target="_blank" rel="noreferrer" className="px-6 py-3 border border-[#00ff88] text-[#00ff88] font-mono hover:bg-[#00ff88] hover:text-black transition-colors rounded">
              GitHub
            </a>
            <a href={portfolioData.meta.linkedin} target="_blank" rel="noreferrer" className="px-6 py-3 border border-[#00ff88] text-[#00ff88] font-mono hover:bg-[#00ff88] hover:text-black transition-colors rounded">
              LinkedIn
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
