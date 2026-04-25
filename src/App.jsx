import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import CursorTrail from './components/effects/CursorTrail';
import useEasterEggs from './hooks/useEasterEggs';
import ScrollToTop from './components/util/ScrollToTop';
import LoadingScreen from './components/effects/LoadingScreen';

const AskAnurag = lazy(() => import('./components/ui/AskAnurag'));

export default function App() {
  const { EasterEggComponents } = useEasterEggs();

  return (
    <Router>
      <CursorTrail />
      {EasterEggComponents}
      <LoadingScreen />
      <Suspense fallback={null}>
        <AskAnurag />
      </Suspense>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}
