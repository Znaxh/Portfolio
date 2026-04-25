import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, X } from 'lucide-react';
import ArchDiagram from '../ArchDiagram';

const skillMap = {
  'justice-guide': ['langchain', 'llamaindex', 'faiss', 'ragas', 'arize', 'fastapi', 'python'],
  loglens: ['sklearn', 'sentence_transformers', 'langchain', 'fastapi', 'react', 'prometheus'],
  'resume-screener': ['bert', 'xgboost', 'sklearn', 'spacy', 'sentence_transformers', 'redis', 'fastapi', 'react'],
};

export default function ProjectCard({ project }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!isOpen) return undefined;
    const interval = window.setInterval(() => {
      setActiveStep((step) => (step + 1) % project.pipeline.length);
    }, 1600);
    return () => window.clearInterval(interval);
  }, [isOpen, project.pipeline.length]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  const handleMouseEnter = () => {
    const skills = skillMap[project.id];
    if (skills) {
      window.dispatchEvent(new CustomEvent('skill-highlight', { detail: { skills } }));
    }
  };

  const handleMouseLeave = () => {
    window.dispatchEvent(new CustomEvent('skill-highlight', { detail: { skills: null } }));
  };

  const architectureOverlay = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="architecture-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            className="architecture-app-window"
            initial={{ opacity: 0, scale: 0.14, y: 280, borderRadius: 36, filter: 'blur(12px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, borderRadius: 28, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.18, y: 260, borderRadius: 36, filter: 'blur(10px)' }}
            transition={{ type: 'spring', stiffness: 135, damping: 20, mass: 0.9 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="architecture-titlebar">
              <div className="project-window-bar !border-0 !p-0 !bg-transparent">
                <span />
                <span />
                <span />
                <p>{project.id}.architecture</p>
              </div>
              <button type="button" className="theme-icon-btn" onClick={() => setIsOpen(false)} aria-label="Close architecture">
                <X size={18} />
              </button>
            </div>

            <div className="architecture-content">
              <div className="mb-6">
                <div className="font-mono text-xs uppercase tracking-[0.25em] theme-accent mb-2">Project architecture</div>
                <h3 className="theme-heading font-display text-3xl md:text-5xl font-bold">{project.title}</h3>
                <p className="theme-muted mt-3 max-w-3xl">{project.description}</p>
              </div>

              <div className="grid xl:grid-cols-[1.35fr_0.9fr] gap-6">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <h4 className="theme-heading font-mono text-sm">LIVE SYSTEM MAP</h4>
                    <div className="font-mono text-[10px] theme-muted">auto-playing pipeline</div>
                  </div>
                  <div className="project-window architecture-diagram-stage">
                    <ArchDiagram projectId={project.id} activeStep={activeStep} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="theme-card rounded-2xl p-4">
                    <div className="theme-accent font-mono text-[11px] uppercase mb-1">Problem</div>
                    <p className="theme-body text-sm">{project.problem}</p>
                  </div>
                  <div className="theme-card rounded-2xl p-4">
                    <div className="theme-accent font-mono text-[11px] uppercase mb-1">Impact</div>
                    <p className="theme-body text-sm">{project.impact}</p>
                  </div>
                  <div className="grid gap-2">
                    {project.pipeline.map((step, idx) => (
                      <button
                        key={step.step}
                        type="button"
                        onClick={() => setActiveStep(idx)}
                        className={`pipeline-row text-left ${activeStep === idx ? 'is-active' : ''}`}
                      >
                        <span className="font-mono text-[11px]">0{idx + 1}</span>
                        <span>
                          <strong>{step.step}</strong>
                          <small>{step.detail}</small>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="theme-heading font-mono text-sm mb-4">PROJECT SIGNALS</h4>
                <div className="flex flex-wrap gap-3">
                  {project.metrics.map((metric, idx) => (
                    <div key={idx} className="flex items-center text-xs theme-pill px-3 py-1.5 rounded-full">
                      <span className="mr-1">•</span> {metric}
                    </div>
                  ))}
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noreferrer" className="theme-pill inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full">
                      Code <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
    <motion.div
      layout
      style={{ willChange: 'transform' }}
      className="theme-card rounded-2xl overflow-hidden transition-colors"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="p-6 cursor-pointer" onClick={() => setIsOpen(true)}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <motion.h3 layout="position" className="text-2xl font-bold theme-heading mb-1">{project.title}</motion.h3>
            <motion.p layout="position" className="theme-accent font-mono text-sm">{project.subtitle}</motion.p>
          </div>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="theme-muted hover:opacity-80 transition-opacity"
            aria-label={`${project.title} GitHub`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          </a>
        </div>

        <motion.p layout="position" className="theme-muted text-sm mb-4 line-clamp-2">
          {project.description}
        </motion.p>

        <motion.div layout="position" className="flex flex-wrap gap-2 mb-4">
          {project.tags.map(tag => (
            <span key={tag} className="px-2 py-1 theme-tag text-xs rounded-md">
              {tag}
            </span>
          ))}
        </motion.div>

        <motion.div layout="position" className="theme-accent text-sm font-mono flex items-center mt-2 group">
          Open architecture
          <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
        </motion.div>
      </div>

    </motion.div>
    {typeof document !== 'undefined' ? createPortal(architectureOverlay, document.body) : null}
    </>
  );
}
