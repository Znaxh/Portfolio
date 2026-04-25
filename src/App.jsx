import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Resume from './pages/Resume'
import NotFound from './pages/NotFound'
import NeuralBackground from './components/effects/NeuralBackground'
import CustomCursor from './components/effects/CustomCursor'
import LoadingScreen from './components/effects/LoadingScreen'
import KonamiEasterEgg from './components/effects/KonamiEasterEgg'
import MatrixEasterEgg from './components/effects/MatrixEasterEgg'
import ScrollToTop from './components/util/ScrollToTop'

export default function App() {
  return (
    <Router>
      <NeuralBackground />
      <CustomCursor />
      <LoadingScreen />
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
      <KonamiEasterEgg />
      <MatrixEasterEgg />
    </Router>
  )
}
