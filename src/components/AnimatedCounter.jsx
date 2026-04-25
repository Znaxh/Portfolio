import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export default function AnimatedCounter({ value, prefix = '', suffix = '', duration = 2000 }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const nodeRef = useRef(null);
  const rafId = useRef(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    setIsReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (!inView || !nodeRef.current) return;
    
    const endValue = typeof value === 'number' ? value : parseFloat(value.toString().replace(/,/g, ''));
    const hasDecimals = endValue % 1 !== 0;

    if (isReducedMotion) {
      nodeRef.current.textContent = `${prefix}${endValue.toLocaleString('en-US', { minimumFractionDigits: hasDecimals ? 2 : 0, maximumFractionDigits: hasDecimals ? 2 : 0 })}${suffix}`;
      return;
    }

    const start = performance.now();
    
    const animate = (time) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = easeOutCubic(progress);
      
      const current = endValue * easeProgress;
      
      const formatted = hasDecimals 
        ? current.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : Math.floor(current).toLocaleString('en-US');

      if (nodeRef.current) {
        nodeRef.current.textContent = `${prefix}${formatted}${suffix}`;
      }

      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate);
      } else {
        if (nodeRef.current) {
          nodeRef.current.textContent = `${prefix}${endValue.toLocaleString('en-US', { minimumFractionDigits: hasDecimals ? 2 : 0, maximumFractionDigits: hasDecimals ? 2 : 0 })}${suffix}`;
        }
      }
    };

    rafId.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafId.current);
  }, [inView, value, prefix, suffix, duration, isReducedMotion]);

  return (
    <span ref={(node) => {
      ref(node);
      nodeRef.current = node;
    }} className="tabular-nums">
      {prefix}0{suffix}
    </span>
  );
}
