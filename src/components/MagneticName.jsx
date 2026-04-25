import { useEffect, useRef } from 'react';
import { useSprings, animated } from '@react-spring/web';

const NAME = "Anurag Pratap Singh";
const LETTERS = NAME.split('');

export default function MagneticName() {
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const [springs, api] = useSprings(LETTERS.length, () => ({
    x: 0,
    y: 0,
    scale: 1,
    color: '#ffffff',
    config: { tension: 300, friction: 20 }
  }));

  useEffect(() => {
    if (isReducedMotion) return;

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };

      if (!containerRef.current) return;
      const spans = containerRef.current.children;
      
      api.start((index) => {
        const span = spans[index];
        if (!span) return {};
        const rect = span.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const dx = mouseRef.current.x - centerX;
        const dy = mouseRef.current.y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 80) {
          // Pulled towards cursor
          const pullX = (dx / distance) * ((80 - distance) / 80) * 12;
          const pullY = (dy / distance) * ((80 - distance) / 80) * 12;
          
          return {
            x: pullX,
            y: pullY,
            scale: 1.15,
            color: '#00f5ff'
          };
        } else {
          return {
            x: 0,
            y: 0,
            scale: 1,
            color: '#ffffff'
          };
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [api, isReducedMotion]);

  return (
    <span 
      ref={containerRef} 
      aria-label={NAME} 
      role="text"
      className="cursor-hover inline-block"
    >
      {springs.map((props, index) => (
        <animated.span
          key={index}
          style={{
            ...props,
            display: 'inline-block',
            whiteSpace: 'pre',
            willChange: 'transform'
          }}
          aria-hidden="true"
        >
          {LETTERS[index] === ' ' ? '\u00A0' : LETTERS[index]}
        </animated.span>
      ))}
    </span>
  );
}
