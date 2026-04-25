import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import useEasterEggs from './hooks/useEasterEggs';
import ScrollToTop from './components/util/ScrollToTop';
import LoadingScreen from './components/effects/LoadingScreen';
import CustomCursor from './components/CustomCursor';
import NeuralBackground from './components/NeuralBackground';
import IdleChatbot from './components/IdleChatbot';

const AskAnurag = lazy(() => import('./components/ui/AskAnurag'));
const Resume = lazy(() => import('./pages/Resume'));

export default function App() {
  const { EasterEggComponents } = useEasterEggs();

  return (
    <Router>
      <NeuralBackground />
      <CustomCursor />
      {EasterEggComponents}
      <LoadingScreen />
      <Suspense fallback={null}>
        <AskAnurag />
      </Suspense>
      <ScrollToTop />
      <IdleChatbot />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resume" element={
            <Suspense fallback={<div className="min-h-screen bg-[#05060d]" />}>
              <Resume />
            </Suspense>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}
