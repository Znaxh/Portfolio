import TerminalHero from '../components/sections/TerminalHero'
import About from '../components/sections/About'
import SkillsConstellation from '../components/sections/SkillsConstellation'
import ProjectsSection from '../components/sections/ProjectsSection'
import Contact from '../components/sections/Contact'

export default function Home() {
  return (
    <>
      <TerminalHero />
      <About />
      <SkillsConstellation />
      <ProjectsSection />
      <Contact />
    </>
  )
}
