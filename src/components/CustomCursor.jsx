import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const rafId = useRef(null);
  const isHovered = useRef(false);

  useEffect(() => {
    // 1. Check for touch device — bail early if touch
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    // 2. Set cursor: none on body
    document.body.style.cursor = 'none';

    // 3. mousemove -> update target.current
    const handleMouseMove = (e) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      
      // Instantly update inner dot
      if (innerRef.current) {
        innerRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        innerRef.current.style.opacity = '1';
      }
    };

    const handleMouseLeave = () => {
      if (innerRef.current) innerRef.current.style.opacity = '0';
      if (outerRef.current) outerRef.current.style.opacity = '0';
    };

    const handleMouseEnter = () => {
      if (innerRef.current) innerRef.current.style.opacity = '1';
      if (outerRef.current) outerRef.current.style.opacity = '1';
    };

    const handleMouseDown = () => {
      if (innerRef.current) innerRef.current.style.transform = `translate3d(${target.current.x}px, ${target.current.y}px, 0) scale(0.8)`;
      if (outerRef.current) outerRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) scale(${isHovered.current ? 1.25 * 0.8 : 0.8})`;
    };

    const handleMouseUp = () => {
      if (innerRef.current) innerRef.current.style.transform = `translate3d(${target.current.x}px, ${target.current.y}px, 0) scale(1)`;
      if (outerRef.current) outerRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) scale(${isHovered.current ? 1.25 : 1})`;
    };

    const handleHoverElementsEnter = () => {
      isHovered.current = true;
      if (outerRef.current) {
        outerRef.current.style.backgroundColor = 'rgba(139, 211, 255, 0.08)';
      }
    };

    const handleHoverElementsLeave = () => {
      isHovered.current = false;
      if (outerRef.current) {
        outerRef.current.style.backgroundColor = 'transparent';
      }
    };

    const setupInteractiveListeners = () => {
      const interactives = document.querySelectorAll('a, button, .cursor-hover');
      interactives.forEach(el => {
        el.removeEventListener('mouseenter', handleHoverElementsEnter);
        el.removeEventListener('mouseleave', handleHoverElementsLeave);
        el.addEventListener('mouseenter', handleHoverElementsEnter);
        el.addEventListener('mouseleave', handleHoverElementsLeave);
      });
    };

    // Use MutationObserver to re-attach listeners if DOM changes
    const observer = new MutationObserver(() => {
      setupInteractiveListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    setupInteractiveListeners();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // 4. RAF loop -> lerp pos toward target
    const render = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.12;
      pos.current.y += (target.current.y - pos.current.y) * 0.12;

      if (outerRef.current) {
        const scale = isHovered.current ? 1.25 : 1;
        // Don't override scale from mousedown if it is currently scaled down
        if (!outerRef.current.style.transform.includes('scale(0.')) {
           outerRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) scale(${scale})`;
        } else {
           outerRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) scale(${scale * 0.8})`;
        }
      }

      rafId.current = requestAnimationFrame(render);
    };
    rafId.current = requestAnimationFrame(render);

    // 6. Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      
      const interactives = document.querySelectorAll('a, button, .cursor-hover');
      interactives.forEach(el => {
        el.removeEventListener('mouseenter', handleHoverElementsEnter);
        el.removeEventListener('mouseleave', handleHoverElementsLeave);
      });
      observer.disconnect();

      cancelAnimationFrame(rafId.current);
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <>
      <div 
        ref={outerRef} 
        style={{
          position: 'fixed',
          top: -9,
          left: -9,
          width: 18,
          height: 18,
          border: '1px solid rgba(139, 211, 255, 0.7)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          willChange: 'transform',
          transition: 'background-color 0.2s, opacity 0.2s'
        }}
      />
      <div 
        ref={innerRef} 
        style={{
          position: 'fixed',
          top: -3,
          left: -3,
          width: 6,
          height: 6,
          backgroundColor: 'rgba(139, 211, 255, 0.8)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          willChange: 'transform',
          transition: 'opacity 0.2s'
        }}
      />
    </>
  );
}
