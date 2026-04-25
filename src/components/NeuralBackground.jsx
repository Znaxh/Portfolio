import { useEffect, useRef } from 'react';

export default function NeuralBackground() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const rafIdRef = useRef(null);
  const firingParticleRef = useRef({ index: -1, startTime: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false }); // false for performance

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = window.devicePixelRatio || 1;

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const initCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = window.devicePixelRatio || 1;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    const initParticles = () => {
      const numParticles = width < 768 ? 30 : 80;
      particlesRef.current = Array.from({ length: numParticles }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6, // -0.3 to 0.3
        vy: (Math.random() - 0.5) * 0.6,
        baseRadius: 1.5,
        radius: 1.5,
        baseOpacity: 0.6,
        opacity: 0.6
      }));
    };

    initCanvas();
    initParticles();

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const oldWidth = width;
        const oldHeight = height;
        initCanvas();
        
        // Reposition proportionally
        particlesRef.current.forEach(p => {
          p.x = (p.x / oldWidth) * width;
          p.y = (p.y / oldHeight) * height;
        });
      }, 150);
    };

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Firing particle logic
    const fireInterval = setInterval(() => {
      if (document.visibilityState !== 'visible' || isReducedMotion) return;
      if (particlesRef.current.length > 0) {
        const idx = Math.floor(Math.random() * particlesRef.current.length);
        firingParticleRef.current = { index: idx, startTime: performance.now() };
      }
    }, 4000);

    const render = (time) => {
      if (document.visibilityState !== 'visible') {
        rafIdRef.current = requestAnimationFrame(render);
        return;
      }

      // Draw background
      ctx.fillStyle = '#05060d';
      ctx.fillRect(0, 0, width, height);

      const particles = particlesRef.current;
      const num = particles.length;
      
      const fireIndex = firingParticleRef.current.index;
      const fireStart = firingParticleRef.current.startTime;
      let fireProgress = 0;
      if (fireIndex !== -1) {
        const elapsed = time - fireStart;
        if (elapsed > 500) {
          firingParticleRef.current.index = -1; // reset
        } else {
          // Pulse: up to 1 at 250ms, down to 0 at 500ms
          fireProgress = 1 - Math.abs((elapsed - 250) / 250);
        }
      }

      // Update and draw nodes
      ctx.fillStyle = 'rgba(0, 245, 255, 1)';
      for (let i = 0; i < num; i++) {
        const p = particles[i];

        if (!isReducedMotion) {
          // Move
          p.x += p.vx;
          p.y += p.vy;

          // Bounce edges
          if (p.x < 0 || p.x > width) { p.vx *= -1; p.x = Math.max(0, Math.min(width, p.x)); }
          if (p.y < 0 || p.y > height) { p.vy *= -1; p.y = Math.max(0, Math.min(height, p.y)); }

          // Repel mouse
          const dx = p.x - mouseRef.current.x;
          const dy = p.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const force = (120 - dist) * 0.003;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }

          // Damping
          p.vx = Math.max(-1.5, Math.min(1.5, p.vx));
          p.vy = Math.max(-1.5, Math.min(1.5, p.vy));
        }

        // Firing state
        if (i === fireIndex) {
          p.radius = p.baseRadius + (4 - p.baseRadius) * fireProgress;
          p.opacity = p.baseOpacity + (1 - p.baseOpacity) * fireProgress;
        } else {
          p.radius = p.baseRadius;
          p.opacity = p.baseOpacity;
        }

        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw lines
      ctx.lineWidth = 1;
      for (let i = 0; i < num; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < num; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          // Use distSquared for fast cull
          const distSq = dx * dx + dy * dy;
          if (distSq < 19600) { // 140 * 140
            const dist = Math.sqrt(distSq);
            let baseLineOp = (1 - dist / 140) * 0.15;
            
            // Brighten if connected to firing particle
            if (fireIndex !== -1 && (i === fireIndex || j === fireIndex)) {
              baseLineOp += 0.25 * fireProgress; // max 0.4
            }

            ctx.globalAlpha = baseLineOp;
            ctx.strokeStyle = '#00f5ff';
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      rafIdRef.current = requestAnimationFrame(render);
    };

    rafIdRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      clearInterval(fireInterval);
      cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  );
}
