import { useEffect, useRef, useState } from 'react';

const PIPELINE_STEPS = [
  {
    id: 'input',
    label: 'User Query',
    sublabel: '"What is Section 302 of IPC?"',
    icon: '👤',
    color: '#00f5ff',
  },
  {
    id: 'embed',
    label: 'Embedding Model',
    sublabel: 'sentence-transformers/all-MiniLM-L6-v2 · 384 dims',
    icon: '🔢',
    color: '#7c3aed',
  },
  {
    id: 'faiss',
    label: 'FAISS Index',
    sublabel: 'IndexFlatIP · 189 chunks · cosine similarity',
    icon: '🗄️',
    color: '#f59e0b',
  },
  {
    id: 'retrieve',
    label: 'Retrieved Chunks',
    sublabel: 'Top-3 relevant IPC sections',
    icon: '📄',
    color: '#10b981',
  },
  {
    id: 'llm',
    label: 'LLM (Groq/Gemini)',
    sublabel: 'Prompt: context + query → cited answer',
    icon: '🤖',
    color: '#ef4444',
  },
  {
    id: 'output',
    label: 'Cited Response',
    sublabel: 'Answer with source citations · <2s latency',
    icon: '✅',
    color: '#00f5ff',
  },
];

export default function PipelineVisualizer() {
  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const isReducedMotion = useRef(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  useEffect(() => {
    isReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isReducedMotion.current) {
      setProgress(1);
      return;
    }

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      const sectionHeight = sectionRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrollProgress = (window.scrollY - sectionTop) / (sectionHeight - viewportHeight);
      setProgress(Math.max(0, Math.min(1, scrollProgress)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const numSteps = PIPELINE_STEPS.length;

  const getStepState = (index) => {
    if (isReducedMotion.current) return 'active';
    const stepProgress = index / (numSteps - 1);
    if (progress >= stepProgress + 0.02) return 'completed';
    if (progress >= stepProgress - 0.08) return 'active';
    return 'inactive';
  };

  const getLineProgress = (index) => {
    if (isReducedMotion.current) return 1;
    const startP = index / (numSteps - 1);
    const endP = (index + 1) / (numSteps - 1);
    if (progress <= startP) return 0;
    if (progress >= endP) return 1;
    return (progress - startP) / (endP - startP);
  };

  return (
    <section
      ref={sectionRef}
      id="pipeline"
      className="relative border-b border-gray-800"
      style={{ minHeight: '300vh' }}
    >
      <div
        className="sticky top-0 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8"
      >
        <h2 className="text-3xl font-bold text-white mb-2 font-mono text-center">
          <span className="text-[#00ff88]">~/</span>How It Works
        </h2>
        <p className="text-gray-400 text-sm mb-10 text-center">A RAG Pipeline</p>

        {/* Pipeline steps */}
        <div
          className={`flex ${
            isMobile ? 'flex-col items-center gap-2' : 'flex-row items-start justify-center gap-0'
          } max-w-6xl w-full`}
        >
          {PIPELINE_STEPS.map((step, index) => {
            const state = getStepState(index);
            const isActive = state === 'active';
            const isCompleted = state === 'completed';
            const isInactive = state === 'inactive';

            return (
              <div
                key={step.id}
                className={`flex ${isMobile ? 'flex-col items-center' : 'flex-row items-center'}`}
              >
                {/* Step card */}
                <div
                  className={`relative flex flex-col items-center text-center p-4 rounded-xl border transition-all duration-500 ${
                    isMobile ? 'w-56' : 'w-40'
                  }`}
                  style={{
                    borderColor: isInactive ? '#333' : isCompleted ? '#fff' : step.color,
                    opacity: isInactive ? 0.2 : isCompleted ? 0.6 : 1,
                    backgroundColor: isActive ? step.color + '10' : 'transparent',
                    boxShadow: isActive ? `0 0 20px ${step.color}33` : 'none',
                  }}
                >
                  {/* Pulsing glow for active step */}
                  {isActive && (
                    <div
                      className="absolute inset-0 rounded-xl animate-pulse"
                      style={{
                        boxShadow: `0 0 15px ${step.color}40`,
                        pointerEvents: 'none',
                      }}
                    />
                  )}

                  <div className="text-2xl mb-2">{step.icon}</div>
                  <div className="text-white text-xs font-bold font-mono mb-1">{step.label}</div>

                  {/* Sublabel fades in for active/completed */}
                  <div
                    className="text-gray-400 text-[10px] leading-tight transition-opacity duration-500"
                    style={{ opacity: isInactive ? 0 : 1 }}
                  >
                    {step.sublabel}
                  </div>

                  {/* Checkmark for completed */}
                  {isCompleted && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center text-black text-xs font-bold">
                      ✓
                    </div>
                  )}
                </div>

                {/* Connecting line */}
                {index < numSteps - 1 && (
                  <div className={`${isMobile ? 'h-8 w-0.5' : 'w-8 h-0.5 mx-1'} relative`}>
                    {/* Background line */}
                    <div
                      className={`absolute ${isMobile ? 'top-0 left-0 w-0.5 h-full' : 'top-0 left-0 w-full h-0.5'}`}
                      style={{ backgroundColor: '#333' }}
                    />
                    {/* Progress line */}
                    <div
                      className={`absolute ${isMobile ? 'top-0 left-0 w-0.5' : 'top-0 left-0 h-0.5'}`}
                      style={{
                        backgroundColor: PIPELINE_STEPS[index + 1].color,
                        transition: 'all 0.3s ease',
                        ...(isMobile
                          ? { height: `${getLineProgress(index) * 100}%` }
                          : { width: `${getLineProgress(index) * 100}%` }),
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Scroll hint */}
        {progress < 0.1 && !isReducedMotion.current && (
          <div className="mt-8 text-gray-600 text-xs font-mono animate-bounce">
            ↓ Scroll to animate pipeline
          </div>
        )}
      </div>
    </section>
  );
}
