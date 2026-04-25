import { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import portfolioData from '../../data/portfolio.json';

const GROUP_COLORS = {
  language: '#3b82f6',
  ai: '#8b5cf6',
  backend: '#10b981',
  frontend: '#06b6d4',
  tools: '#f59e0b',
  data: '#f97316'
};

const GROUP_LABELS = {
  language: 'Languages',
  ai: 'AI & ML',
  backend: 'Backend',
  frontend: 'Frontend',
  tools: 'Tools',
  data: 'Databases'
};

export default function SkillsGraph() {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div id="skills" className="w-full bg-black py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-8 font-mono">
          <span className="text-[#00ff88]">~/</span>skills
        </h2>
        
        {isMobile ? (
          <MobileTagCloud />
        ) : (
          <div className="relative w-full h-[500px] border border-gray-800 rounded-lg bg-[#050505] overflow-hidden" ref={containerRef}>
            <D3Graph containerRef={containerRef} />
          </div>
        )}
        
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          {Object.entries(GROUP_COLORS).map(([group, color]) => (
            <div key={group} className="flex items-center text-xs font-mono text-gray-400">
              <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color }}></span>
              {GROUP_LABELS[group]}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileTagCloud() {
  return (
    <div className="flex flex-wrap gap-3 p-4 border border-gray-800 rounded-lg bg-[#050505]">
      {portfolioData.skills.map(skill => (
        <span 
          key={skill.id} 
          className="px-3 py-1.5 rounded-full text-sm font-mono text-white border"
          style={{ 
            backgroundColor: `${GROUP_COLORS[skill.group]}20`,
            borderColor: GROUP_COLORS[skill.group],
            color: GROUP_COLORS[skill.group]
          }}
        >
          {skill.label}
        </span>
      ))}
    </div>
  );
}

function D3Graph({ containerRef }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = 500;
    
    // Copy data so D3 doesn't mutate original JSON
    const nodes = portfolioData.skills.map(d => ({ ...d }));
    const links = portfolioData.skillLinks.map(d => ({ ...d }));

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    // Defs for glow filter
    const defs = svg.append("defs");
    const filter = defs.append("filter")
      .attr("id", "glow")
      .attr("x", "-20%")
      .attr("y", "-20%")
      .attr("width", "140%")
      .attr("height", "140%");
    filter.append("feGaussianBlur")
      .attr("stdDeviation", "3")
      .attr("result", "blur");
    filter.append("feComposite")
      .attr("in", "SourceGraphic")
      .attr("in2", "blur")
      .attr("operator", "over");

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(32).iterations(2));

    const link = svg.append("g")
      .attr("stroke-opacity", 0.2)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", d => GROUP_COLORS[d.source.group])
      .attr("stroke-width", 1.5);

    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(drag(simulation));

    const circles = node.append("circle")
      .attr("r", 28)
      .attr("fill", d => GROUP_COLORS[d.group])
      .attr("stroke", "#fff")
      .attr("stroke-width", 1)
      .style("transition", "all 0.3s ease")
      .style("cursor", "grab");

    const labels = node.append("text")
      .text(d => d.label)
      .attr("text-anchor", "middle")
      .attr("dy", ".3em")
      .style("fill", "#fff")
      .style("font-size", "10px")
      .style("font-family", "monospace")
      .style("pointer-events", "none");

    // Interactivity
    node.on("mouseover", function(event, d) {
      // Dim all
      node.style("opacity", 0.3);
      link.style("stroke-opacity", 0.05);

      // Highlight hovered
      d3.select(this)
        .style("opacity", 1)
        .select("circle")
        .attr("r", 32)
        .style("filter", "url(#glow)");

      // Find connected
      const connectedNodes = new Set([d.id]);
      link.each(function(l) {
        if (l.source.id === d.id || l.target.id === d.id) {
          d3.select(this)
            .style("stroke-opacity", 1)
            .attr("stroke", GROUP_COLORS[d.group])
            .attr("stroke-width", 2)
            .style("filter", "url(#glow)");
          
          connectedNodes.add(l.source.id);
          connectedNodes.add(l.target.id);
        }
      });

      node.filter(n => connectedNodes.has(n.id) && n.id !== d.id)
        .style("opacity", 1)
        .select("circle")
        .style("filter", "url(#glow)");
    })
    .on("mouseout", function() {
      node.style("opacity", 1)
        .select("circle")
        .attr("r", 28)
        .style("filter", null);
      
      link.style("stroke-opacity", 0.2)
        .attr("stroke", l => GROUP_COLORS[l.source.group])
        .attr("stroke-width", 1.5)
        .style("filter", null);
    });

    simulation.on("tick", () => {
      // Keep nodes within bounds
      nodes.forEach(d => {
        d.x = Math.max(28, Math.min(width - 28, d.x));
        d.y = Math.max(28, Math.min(height - 28, d.y));
      });

      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    // Handle resize
    const resizeObserver = new ResizeObserver(entries => {
      if (!entries || !entries.length) return;
      const { width: newWidth } = entries[0].contentRect;
      svg.attr("width", newWidth);
      simulation.force("center", d3.forceCenter(newWidth / 2, height / 2));
      simulation.alpha(0.3).restart();
    });
    
    resizeObserver.observe(containerRef.current);

    return () => {
      simulation.stop();
      resizeObserver.disconnect();
    };
  }, []);

  function drag(simulation) {
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
      d3.select(this).select("circle").style("cursor", "grabbing");
    }
    
    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }
    
    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
      d3.select(this).select("circle").style("cursor", "grab");
    }
    
    return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }

  return <svg ref={svgRef} className="w-full h-full" />;
}
