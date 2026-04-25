import { motion } from 'framer-motion';
import { ArrowDown, Bot, Download, Mail, Sparkles } from 'lucide-react';
import portfolioData from '../../data/portfolio.json';

export default function HeroTerminal() {
  const { meta, metrics, personal } = portfolioData;

  const scrollToWork = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const openAskAnurag = () => {
    const btn = document.getElementById('ask-anurag-trigger');
    if (btn) btn.click();
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden px-4 py-24 theme-hero" id="hero">
      <div className="absolute inset-0 pointer-events-none">
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />
        <div className="hero-grid" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-7 theme-chip">
            <Sparkles size={15} />
            <span>AI Engineer · RAG · LLM evals · vector search</span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.98] mb-6 theme-heading">
            Building calm,
            <span className="block text-gradient">usable AI systems.</span>
          </h1>

          <p className="max-w-2xl text-lg sm:text-xl leading-relaxed mb-8 theme-muted">
            {meta.tagline}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <a href={personal.resumeUrl} target="_blank" rel="noreferrer" className="theme-primary-btn inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold">
              <Download size={17} />
              View resume
            </a>
            <button onClick={scrollToWork} className="theme-ghost-btn inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold">
              Explore projects
              <ArrowDown size={17} />
            </button>
            <button onClick={openAskAnurag} className="theme-soft-btn inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold">
              <Bot size={17} />
              Ask Anurag
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl">
            {metrics.slice(0, 6).map((metric) => (
              <div key={metric.label} className="theme-card rounded-2xl p-4">
                <div className="font-mono text-xl font-bold theme-heading">
                  {metric.prefix}{metric.value}{metric.suffix}
                </div>
                <div className="text-xs theme-muted">{metric.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative"
        >
          <div className="resume-glass rounded-[2rem] p-5 sm:p-7">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="font-mono text-xs uppercase tracking-[0.25em] theme-accent">Resume Snapshot</div>
                <h2 className="font-display text-2xl font-bold theme-heading mt-1">{meta.name}</h2>
              </div>
              <a href={`mailto:${meta.email}`} className="theme-icon-btn" aria-label="Email Anurag">
                <Mail size={18} />
              </a>
            </div>

            <div className="space-y-4">
              {[
                ['Current focus', 'Production RAG, LLM evaluation, retrieval systems'],
                ['Experience', 'AI Engineer Intern at Lejit.AI'],
                ['Education', 'B.Tech in DS & AI, IIIT Raipur'],
                ['Recognition', 'IEEE ACROSET author · Amazon ML Summer School'],
              ].map(([label, value], index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, delay: 0.35 + index * 0.08 }}
                  className="rounded-2xl p-4 theme-card"
                >
                  <div className="font-mono text-[11px] uppercase tracking-[0.18em] theme-accent mb-1">{label}</div>
                  <div className="theme-body">{value}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
