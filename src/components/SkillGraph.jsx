import { useEffect, useRef, useCallback } from 'react';

const SKILLS = [
  { id: 'langchain', label: 'LangChain', cluster: 'ai', weight: 5 },
  { id: 'llamaindex', label: 'LlamaIndex', cluster: 'ai', weight: 4 },
  { id: 'faiss', label: 'FAISS', cluster: 'ai', weight: 4 },
  { id: 'ragas', label: 'Ragas', cluster: 'ai', weight: 3 },
  { id: 'huggingface', label: 'HuggingFace', cluster: 'ai', weight: 4 },
  { id: 'bert', label: 'BERT', cluster: 'ai', weight: 3 },
  { id: 'xgboost', label: 'XGBoost', cluster: 'ai', weight: 3 },
  { id: 'sklearn', label: 'Scikit-learn', cluster: 'ai', weight: 3 },
  { id: 'spacy', label: 'SpaCy', cluster: 'ai', weight: 3 },
  { id: 'sentence_transformers', label: 'Sentence-Transformers', cluster: 'ai', weight: 4 },
  { id: 'fastapi', label: 'FastAPI', cluster: 'backend', weight: 5 },
  { id: 'python', label: 'Python', cluster: 'backend', weight: 5 },
  { id: 'nodejs', label: 'Node.js', cluster: 'backend', weight: 3 },
  { id: 'postgresql', label: 'PostgreSQL', cluster: 'backend', weight: 3 },
  { id: 'redis', label: 'Redis', cluster: 'backend', weight: 3 },
  { id: 'docker', label: 'Docker', cluster: 'backend', weight: 3 },
  { id: 'mongodb', label: 'MongoDB', cluster: 'backend', weight: 2 },
  { id: 'react', label: 'React', cluster: 'frontend', weight: 4 },
  { id: 'nextjs', label: 'Next.js', cluster: 'frontend', weight: 3 },
  { id: 'typescript', label: 'TypeScript', cluster: 'frontend', weight: 3 },
  { id: 'tailwind', label: 'Tailwind', cluster: 'frontend', weight: 4 },
  { id: 'prometheus', label: 'Prometheus', cluster: 'tools', weight: 2 },
  { id: 'arize', label: 'Arize Phoenix', cluster: 'tools', weight: 2 },
  { id: 'git', label: 'Git', cluster: 'tools', weight: 3 },
];

const EDGES = [
  ['langchain', 'fastapi'], ['langchain', 'llamaindex'], ['langchain', 'faiss'],
  ['llamaindex', 'faiss'], ['llamaindex', 'ragas'], ['ragas', 'arize'],
  ['fastapi', 'python'], ['fastapi', 'redis'], ['fastapi', 'postgresql'],
  ['bert', 'huggingface'], ['bert', 'sentence_transformers'],
  ['xgboost', 'sklearn'], ['spacy', 'bert'],
  ['react', 'nextjs'], ['react', 'typescript'], ['react', 'tailwind'],
  ['nodejs', 'postgresql'], ['docker', 'fastapi'],
  ['prometheus', 'fastapi'], ['arize', 'langchain'],
];

const PROJECT_SKILLS = {
  'JusticeGuide': ['langchain', 'llamaindex', 'faiss', 'ragas', 'arize', 'fastapi', 'python'],
  'LogLens': ['sklearn', 'sentence_transformers', 'langchain', 'fastapi', 'react', 'prometheus'],
  'AI Resume Screening': ['bert', 'xgboost', 'sklearn', 'spacy', 'sentence_transformers', 'redis', 'fastapi', 'react'],
};

const CLUSTER_COLORS = {
  ai: '#8bd3ff',
  backend: '#c7a7ff',
  frontend: '#ffd6a5',
  tools: '#a7f3d0',
};

const CLUSTER_LABELS = {
  ai: 'AI / ML',
  backend: 'Backend',
  frontend: 'Frontend',
  tools: 'Tools',
};

const PHYSICS = {
  clusterStrength: 0.0018,
  repulsion: 680,
  restLength: 88,
  springStrength: 0.038,
  damping: 0.88,
  maxVelocity: 9,
};

const lerp = (from, to, amount) => from + (to - from) * amount;

export default function SkillGraph() {
  const canvasRef = useRef(null);
  const nodesRef = useRef([]);
  const hoveredNodeRef = useRef(null);
  const draggingNodeRef = useRef(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const highlightedSkillsRef = useRef(null);
  const rafRef = useRef(null);
  const frameRef = useRef(0);
  const lastFrameTimeRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const tooltipRef = useRef(null);
  const containerRef = useRef(null);

  const initNodes = useCallback((width, height) => {
    const clusterCenters = {
      ai: { x: width * 0.25, y: height * 0.35 },
      backend: { x: width * 0.75, y: height * 0.35 },
      frontend: { x: width * 0.25, y: height * 0.7 },
      tools: { x: width * 0.75, y: height * 0.7 },
    };

    const groupedSkills = SKILLS.reduce((groups, skill) => {
      groups[skill.cluster] = [...(groups[skill.cluster] || []), skill.id];
      return groups;
    }, {});

    nodesRef.current = SKILLS.map((skill) => {
      const center = clusterCenters[skill.cluster];
      const clusterSkills = groupedSkills[skill.cluster];
      const clusterIndex = clusterSkills.indexOf(skill.id);
      const angle = (clusterIndex / clusterSkills.length) * Math.PI * 2 + skill.weight * 0.22;
      const spread = Math.min(width, height) * (clusterIndex % 2 === 0 ? 0.105 : 0.075);
      const radius = skill.weight * 4 + 8;

      return {
        ...skill,
        x: center.x + Math.cos(angle) * spread,
        y: center.y + Math.sin(angle) * spread * 0.75,
        vx: 0,
        vy: 0,
        radius,
        drawRadius: radius,
        opacity: 1,
        glow: 0,
        clusterCenter: center,
      };
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    let width, height;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const container = containerRef.current;
      if (!container) return;
      width = container.clientWidth;
      height = isMobile ? 380 : 560;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initNodes(width, height);
      frameRef.current = 0;
      lastFrameTimeRef.current = null;
    };

    resize();

    const idMap = {};
    nodesRef.current.forEach((n, i) => { idMap[n.id] = i; });

    const edgeIndices = EDGES.map(([a, b]) => [idMap[a], idMap[b]]).filter(
      ([a, b]) => a !== undefined && b !== undefined
    );

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;

      // Hit detection
      const nodes = nodesRef.current;
      let found = null;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const dx = mouseRef.current.x - n.x;
        const dy = mouseRef.current.y - n.y;
        if (Math.sqrt(dx * dx + dy * dy) < n.radius + 4) {
          found = i;
          break;
        }
      }
      hoveredNodeRef.current = found;
      if (draggingNodeRef.current !== null) {
        const node = nodes[draggingNodeRef.current];
        node.x = mouseRef.current.x - dragOffsetRef.current.x;
        node.y = mouseRef.current.y - dragOffsetRef.current.y;
        node.vx = 0;
        node.vy = 0;
        canvas.style.cursor = 'grabbing';
      } else {
        canvas.style.cursor = found !== null ? 'grab' : 'default';
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
      hoveredNodeRef.current = null;
    };

    const handleMouseDown = () => {
      if (hoveredNodeRef.current === null) return;
      const node = nodesRef.current[hoveredNodeRef.current];
      draggingNodeRef.current = hoveredNodeRef.current;
      dragOffsetRef.current = {
        x: mouseRef.current.x - node.x,
        y: mouseRef.current.y - node.y,
      };
      node.vx = 0;
      node.vy = 0;
      canvas.style.cursor = 'grabbing';
    };

    const handleMouseUp = () => {
      if (draggingNodeRef.current !== null) {
        draggingNodeRef.current = null;
        canvas.style.cursor = hoveredNodeRef.current !== null ? 'grab' : 'default';
      }
    };

    const handleClick = () => {
      if (hoveredNodeRef.current !== null) {
        const node = nodesRef.current[hoveredNodeRef.current];
        const projects = [];
        for (const [pName, skills] of Object.entries(PROJECT_SKILLS)) {
          if (skills.includes(node.id)) projects.push(pName);
        }
        if (tooltipRef.current) {
          if (projects.length > 0) {
            tooltipRef.current.innerHTML = `<strong>${node.label}</strong><br/><span>Used in:</span> ${projects.join(', ')}`;
          } else {
            tooltipRef.current.innerHTML = `<strong>${node.label}</strong><br/><span>Core skill</span>`;
          }
          tooltipRef.current.style.display = 'block';
        }
      } else {
        if (tooltipRef.current) tooltipRef.current.style.display = 'none';
      }
    };

    // Listen for skill-highlight custom events (from project cards)
    const handleSkillHighlight = (e) => {
      highlightedSkillsRef.current = e.detail?.skills || null;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('click', handleClick);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('skill-highlight', handleSkillHighlight);

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    };
    window.addEventListener('resize', handleResize);

    // Build adjacency for quick lookup
    const adjacency = new Set();
    const neighbors = {};
    edgeIndices.forEach(([a, b]) => {
      adjacency.add(`${a}-${b}`);
      adjacency.add(`${b}-${a}`);
      if (!neighbors[a]) neighbors[a] = [];
      if (!neighbors[b]) neighbors[b] = [];
      neighbors[a].push(b);
      neighbors[b].push(a);
    });

    const isConnected = (a, b) => adjacency.has(`${a}-${b}`);

    const render = () => {
      if (document.visibilityState !== 'visible') {
        lastFrameTimeRef.current = null;
        rafRef.current = requestAnimationFrame(render);
        return;
      }

      const now = performance.now();
      const delta = lastFrameTimeRef.current
        ? Math.min((now - lastFrameTimeRef.current) / 16.67, 2)
        : 1;
      lastFrameTimeRef.current = now;

      const nodes = nodesRef.current;
      const numNodes = nodes.length;
      const dragged = draggingNodeRef.current;
      frameRef.current++;
      const settle = Math.max(0.34, Math.exp(-frameRef.current / 260));
      const forceScale = settle * delta;

      if (!isReducedMotion) {
        // Cluster attraction
        for (let i = 0; i < numNodes; i++) {
          if (i === dragged) continue;
          const n = nodes[i];
          const dx = n.clusterCenter.x - n.x;
          const dy = n.clusterCenter.y - n.y;
          n.vx += dx * PHYSICS.clusterStrength * forceScale;
          n.vy += dy * PHYSICS.clusterStrength * forceScale;
        }

        // Repulsion
        for (let i = 0; i < numNodes; i++) {
          for (let j = i + 1; j < numNodes; j++) {
            const a = nodes[i];
            const b = nodes[j];
            let dx = a.x - b.x;
            let dy = a.y - b.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < 1) continue;
            const force = PHYSICS.repulsion / distSq;
            const dist = Math.sqrt(distSq);
            const fx = (dx / dist) * force * forceScale;
            const fy = (dy / dist) * force * forceScale;
            if (i !== dragged) {
              a.vx += fx;
              a.vy += fy;
            }
            if (j !== dragged) {
              b.vx -= fx;
              b.vy -= fy;
            }
          }
        }

        // Spring (edges)
        for (const [ai, bi] of edgeIndices) {
          const a = nodes[ai];
          const b = nodes[bi];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = (dist - PHYSICS.restLength) * PHYSICS.springStrength * forceScale;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          if (ai !== dragged) {
            a.vx += fx;
            a.vy += fy;
          }
          if (bi !== dragged) {
            b.vx -= fx;
            b.vy -= fy;
          }
        }

        // Damping + position update
        for (let i = 0; i < numNodes; i++) {
          if (i === dragged) {
            const n = nodes[i];
            n.x = Math.max(n.radius, Math.min(width - n.radius, n.x));
            n.y = Math.max(n.radius, Math.min(height - n.radius, n.y));
            continue;
          }
          const n = nodes[i];
          const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
          if (speed > PHYSICS.maxVelocity) {
            const limit = PHYSICS.maxVelocity / speed;
            n.vx *= limit;
            n.vy *= limit;
          }

          const damping = Math.pow(PHYSICS.damping, delta);
          n.vx *= damping;
          n.vy *= damping;
          n.x += n.vx * delta;
          n.y += n.vy * delta;
          // Keep in bounds
          n.x = Math.max(n.radius, Math.min(width - n.radius, n.x));
          n.y = Math.max(n.radius, Math.min(height - n.radius, n.y));
        }
      }

      // Draw
      ctx.clearRect(0, 0, width, height);

      const hovered = hoveredNodeRef.current;
      const highlighted = highlightedSkillsRef.current;
      const highlightSet = highlighted ? new Set(highlighted.map(s => idMap[s]).filter(x => x !== undefined)) : null;
      const rootStyles = getComputedStyle(document.documentElement);
      const edgeColor = rootStyles.getPropertyValue('--theme-graph-edge') || 'rgba(255,255,255,0.12)';
      const headingColor = rootStyles.getPropertyValue('--theme-heading') || '#ffffff';

      // Edges
      for (const [ai, bi] of edgeIndices) {
        const a = nodes[ai];
        const b = nodes[bi];
        const isActive = hovered !== null && (ai === hovered || bi === hovered);
        const isHighlighted = highlightSet && highlightSet.has(ai) && highlightSet.has(bi);

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        if (isActive || isHighlighted) {
          ctx.strokeStyle = 'rgba(139,211,255,0.65)';
          ctx.lineWidth = 1.5;
        } else {
          ctx.strokeStyle = edgeColor;
          ctx.lineWidth = 1;
        }
        ctx.stroke();
      }

      // Nodes
      for (let i = 0; i < numNodes; i++) {
        const n = nodes[i];
        const isHovered = hovered === i;
        const isDragged = dragged === i;
        const isNeighbor = hovered !== null && neighbors[hovered]?.includes(i);
        const isDimmed = hovered !== null && !isHovered && !isNeighbor;
        const isHighlightedNode = highlightSet?.has(i);
        const isDimmedByHighlight = highlightSet && !isHighlightedNode;

        let opacity = 1;
        if (isDimmed) opacity = 0.3;
        if (isDimmedByHighlight) opacity = 0.3;

        const targetRadius = isHovered || isDragged ? n.radius * 1.38 : n.radius;
        const targetGlow = isHovered || isDragged || (isHighlightedNode && !isDimmedByHighlight) ? 1 : 0;
        const visualEase = Math.min(1, 0.16 * delta);

        n.drawRadius = lerp(n.drawRadius ?? n.radius, targetRadius, visualEase);
        n.opacity = lerp(n.opacity ?? 1, opacity, visualEase);
        n.glow = lerp(n.glow ?? 0, targetGlow, visualEase);

        const radius = n.drawRadius;
        const color = CLUSTER_COLORS[n.cluster];

        ctx.globalAlpha = n.opacity;

        // Node circle
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = color + '26'; // 15% opacity fill
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = isHovered || isDragged || isHighlightedNode ? 2 : 1;
        ctx.stroke();

        // Glow for hovered/highlighted
        if (n.glow > 0.01) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, radius + 4 + n.glow * 4, 0, Math.PI * 2);
          ctx.strokeStyle = color + '40';
          ctx.lineWidth = 1 + n.glow * 1.5;
          ctx.stroke();
        }

        // Label
        ctx.fillStyle = headingColor;
        ctx.font = `${11 + n.glow}px 'JetBrains Mono', monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Truncate label if too long for node
        let label = n.label;
        const maxWidth = radius * 2 - 6;
        if (ctx.measureText(label).width > maxWidth && !isHovered && !isDragged) {
          while (label.length > 3 && ctx.measureText(label + '…').width > maxWidth) {
            label = label.slice(0, -1);
          }
          label += '…';
        }
        ctx.fillText(label, n.x, n.y);

        ctx.globalAlpha = 1;
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('click', handleClick);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('skill-highlight', handleSkillHighlight);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [initNodes]);

  return (
    <section id="skills" className="py-20 border-b theme-section">
      <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-8">
          <div>
            <h2 className="text-3xl font-bold theme-heading mb-4 font-mono">
              <span className="theme-accent">~/</span>Skills
            </h2>
            <p className="theme-muted text-sm max-w-2xl">
              A live skill map instead of a static chart. Drag individual nodes, hover to trace connections, click a node to see where it appears in projects, and hover project cards to highlight their stack.
            </p>
          </div>
          <div className="theme-card rounded-2xl p-4 min-w-[220px]">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] theme-accent mb-2">Interaction</div>
            <p className="theme-body text-sm">Grab any node, move it around, inspect connections, and use project hover to focus the related stack.</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6">
          {Object.entries(CLUSTER_COLORS).map(([key, color]) => (
            <div key={key} className="flex items-center gap-2 text-xs theme-muted">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              {CLUSTER_LABELS[key]}
            </div>
          ))}
        </div>

        <div className="relative graph-shell">
          <canvas
            ref={canvasRef}
            aria-label="Interactive skill graph showing Anurag's technical skills"
            className="w-full rounded-2xl"
          />
          <div
            ref={tooltipRef}
            className="skill-tooltip absolute bottom-4 left-4 rounded-lg px-4 py-3 text-sm font-mono shadow-xl"
            style={{ display: 'none', maxWidth: 300 }}
          />
        </div>

        {/* Fallback tag cloud (hidden, for accessibility / no-canvas) */}
        <noscript>
          <div className="flex flex-wrap gap-2 mt-4">
            {SKILLS.map((s) => (
              <span
                key={s.id}
                className="px-3 py-1 rounded-full text-sm border"
                style={{ borderColor: CLUSTER_COLORS[s.cluster], color: CLUSTER_COLORS[s.cluster] }}
              >
                {s.label}
              </span>
            ))}
          </div>
        </noscript>

        {/* Hidden text description for screen readers */}
        <div className="sr-only">
          Technical skills: {SKILLS.map(s => s.label).join(', ')}. Skills are grouped by category:
          AI/ML, Backend, Frontend, and Tools.
        </div>
      </div>
    </section>
  );
}
