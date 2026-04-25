import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import portfolioData from '../../data/portfolio.json';

export default function ProjectCard({ project }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      layout
      style={{ willChange: 'transform' }}
      className="bg-[#111] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors"
    >
      <div className="p-6 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <motion.h3 layout="position" className="text-2xl font-bold text-white mb-1">{project.title}</motion.h3>
            <motion.p layout="position" className="text-[#00ff88] font-mono text-sm">{project.subtitle}</motion.p>
          </div>
          <a 
            href={project.github} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          </a>
        </div>
        
        <motion.p layout="position" className="text-gray-400 text-sm mb-4 line-clamp-2">
          {project.description}
        </motion.p>
        
        <motion.div layout="position" className="flex flex-wrap gap-2 mb-4">
          {project.tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-[#1a1a1a] text-gray-300 text-xs rounded-md border border-gray-800">
              {tag}
            </span>
          ))}
        </motion.div>

        <motion.div layout="position" className="text-[#00ff88] text-sm font-mono flex items-center mt-2 group">
          See Pipeline 
          <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
        </motion.div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{ willChange: 'transform, opacity, height' }}
            className="border-t border-gray-800 bg-[#0a0a0a]"
          >
            <div className="p-6">
              <h4 className="text-white font-mono text-sm mb-4 border-b border-gray-800 pb-2">ARCHITECTURE PIPELINE</h4>
              
              <div className="flex overflow-x-auto pb-4 hide-scrollbar snap-x">
                {project.pipeline.map((step, idx) => (
                  <div key={idx} className="flex items-center flex-shrink-0 snap-start group relative">
                    <div className="w-48 bg-[#111] border border-gray-800 p-4 rounded-lg hover:border-[#00ff88] transition-colors cursor-help">
                      <div className="text-[#00ff88] font-mono text-xs mb-1">STEP {idx + 1}</div>
                      <div className="text-white font-bold text-sm mb-2">{step.step}</div>
                      <div className="text-gray-400 text-xs line-clamp-2">{step.detail}</div>
                      
                      {/* Tooltip */}
                      <div className="absolute top-full left-0 mt-2 w-64 p-3 bg-black border border-gray-700 rounded-md text-sm text-gray-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 shadow-xl pointer-events-none">
                        {step.detail}
                      </div>
                    </div>
                    {idx < project.pipeline.length - 1 && (
                      <div className="w-8 flex justify-center text-gray-600 px-2">→</div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {project.metrics.map((metric, idx) => (
                  <div key={idx} className="flex items-center text-xs text-[#00ff88] bg-[#00ff88]/10 px-3 py-1.5 rounded-full border border-[#00ff88]/20">
                    <span className="mr-1">⚡</span> {metric}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
