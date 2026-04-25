import { useEffect, useRef } from 'react';

export default function CursorTrail() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Resize canvas
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();

    const dots = [];
    const maxDots = 20;

    const addDot = (x, y) => {
      dots.push({ x, y, age: 0, maxAge: 60 }); // 60 frames ~ 1 second at 60fps, let's say 36 frames for 600ms
    };

    const handleMouseMove = (e) => {
      addDot(e.clientX, e.clientY);
      if (dots.length > maxDots) {
        dots.shift();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        dot.age++;

        // 600ms fade roughly equals 36 frames at 60fps
        const life = 1 - (dot.age / 36);
        
        if (life > 0) {
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, 4 * life, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(139, 92, 246, ${life * 0.6})`; // Purple #8b5cf6
          ctx.fill();
        }
      }

      // Remove dead dots
      while (dots.length > 0 && dots[0].age >= 36) {
        dots.shift();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999]"
    />
  );
}
