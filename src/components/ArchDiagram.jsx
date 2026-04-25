import { motion } from 'framer-motion';

const DIAGRAMS = {
  justiceguide: {
    nodes: [
      { id: 'query', label: 'User Query', x: 60, y: 100, color: '#00f5ff' },
      { id: 'embed', label: 'Embed', x: 180, y: 100, color: '#7c3aed' },
      { id: 'faiss', label: 'FAISS', x: 300, y: 100, color: '#f59e0b' },
      { id: 'llama', label: 'LlamaIndex', x: 300, y: 190, color: '#10b981' },
      { id: 'groq', label: 'Groq LLM', x: 420, y: 100, color: '#ef4444' },
      { id: 'ragas', label: 'Ragas Eval', x: 420, y: 190, color: '#8b5cf6' },
      { id: 'output', label: 'Cited Answer', x: 540, y: 100, color: '#00f5ff' },
    ],
    edges: [
      ['query', 'embed'], ['embed', 'faiss'], ['faiss', 'llama'],
      ['llama', 'groq'], ['groq', 'output'], ['groq', 'ragas'],
    ],
  },
  loglens: {
    nodes: [
      { id: 'logs', label: 'Raw Logs', x: 60, y: 145, color: '#00f5ff' },
      { id: 'zscore', label: 'Z-Score', x: 180, y: 90, color: '#f59e0b' },
      { id: 'dbscan', label: 'DBSCAN', x: 180, y: 200, color: '#7c3aed' },
      { id: 'lcel', label: 'LCEL Chain', x: 340, y: 145, color: '#10b981' },
      { id: 'report', label: 'P1–P4 Report', x: 480, y: 145, color: '#00f5ff' },
    ],
    edges: [
      ['logs', 'zscore'], ['logs', 'dbscan'],
      ['zscore', 'lcel'], ['dbscan', 'lcel'], ['lcel', 'report'],
    ],
  },
  resume_screening: {
    nodes: [
      { id: 'jd', label: 'Job Desc', x: 60, y: 90, color: '#00f5ff' },
      { id: 'resume', label: 'Resumes', x: 60, y: 200, color: '#00f5ff' },
      { id: 'expand', label: 'JD Expand', x: 200, y: 90, color: '#ef4444' },
      { id: 'ensemble', label: '9-algo', x: 350, y: 145, color: '#7c3aed' },
      { id: 'rank', label: 'Ranked', x: 500, y: 145, color: '#10b981' },
    ],
    edges: [
      ['jd', 'expand'], ['expand', 'ensemble'],
      ['resume', 'ensemble'], ['ensemble', 'rank'],
    ],
  },
};

// Map project IDs from portfolio.json to diagram keys
const PROJECT_ID_MAP = {
  'justice-guide': 'justiceguide',
  'loglens': 'loglens',
  'resume-screener': 'resume_screening',
};

export default function ArchDiagram({ projectId, activeStep = 0 }) {
  const diagramKey = PROJECT_ID_MAP[projectId] || projectId;
  const diagram = DIAGRAMS[diagramKey];
  if (!diagram) return null;

  const nodeMap = {};
  diagram.nodes.forEach((n) => { nodeMap[n.id] = n; });

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="w-full overflow-x-auto"
    >
      <svg
        viewBox="0 0 660 300"
        className="w-full h-auto"
        style={{ minWidth: 520 }}
      >
        {/* Arrow marker definition */}
        <defs>
          <filter id="soft-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <marker
            id={`arrow-${diagramKey}`}
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" fill="rgba(255,255,255,0.4)" />
          </marker>
        </defs>

        {/* Edges */}
        {diagram.edges.map(([fromId, toId], i) => {
          const from = nodeMap[fromId];
          const to = nodeMap[toId];
          if (!from || !to) return null;
          const active = i <= activeStep;

          // Calculate edge points from node borders
          const fromX = from.x + 90; // right edge of rect
          const fromY = from.y + 21;
          const toX = to.x;           // left edge of rect
          const toY = to.y + 21;

          return (
            <motion.line
              key={i}
              x1={fromX}
              y1={fromY}
              x2={toX}
              y2={toY}
              stroke={active ? 'var(--theme-accent)' : 'rgba(255,255,255,0.2)'}
              strokeWidth={active ? 2.5 : 1}
              markerEnd={`url(#arrow-${diagramKey})`}
              initial={{ pathLength: 0, opacity: 0.3 }}
              animate={{ pathLength: active ? 1 : 0.35, opacity: active ? 1 : 0.35 }}
              transition={{ duration: 0.45, delay: i * 0.04 }}
            />
          );
        })}

        {/* Nodes */}
        {diagram.nodes.map((node, index) => {
          const active = index <= activeStep;
          return (
          <motion.g
            key={node.id}
            animate={{ scale: active ? 1.05 : 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 18 }}
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          >
            {/* Node rect */}
            <motion.rect
              x={node.x}
              y={node.y}
              width={90}
              height={42}
              rx={12}
              fill={active ? node.color + '30' : 'rgba(255,255,255,0.035)'}
              stroke={active ? node.color : 'rgba(255,255,255,0.18)'}
              strokeWidth={active ? 2 : 1}
              filter={active ? 'url(#soft-glow)' : undefined}
            />
            {/* Node label */}
            <text
              x={node.x + 45}
              y={node.y + 25}
              textAnchor="middle"
              fill="var(--theme-heading)"
              fontSize="11.5"
              fontFamily="'JetBrains Mono', monospace"
            >
              {node.label}
            </text>
          </motion.g>
          );
        })}
      </svg>
    </motion.div>
  );
}
