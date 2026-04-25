import { useEffect, useRef, useState } from 'react';
import { CountUp } from 'countup.js';
import portfolioData from '../../data/portfolio.json';

export default function MetricsStrip() {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full bg-[#0a0a0a] border-y border-gray-800 py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 divide-x-0 md:divide-x md:divide-gray-800">
          {portfolioData.metrics.map((metric, idx) => (
            <MetricItem 
              key={idx} 
              metric={metric} 
              isVisible={isVisible} 
              idx={idx}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricItem({ metric, isVisible, idx }) {
  const numberRef = useRef(null);
  const countUpRef = useRef(null);

  useEffect(() => {
    if (isVisible && numberRef.current && !countUpRef.current) {
      const isDecimal = metric.value % 1 !== 0;
      const decimals = isDecimal ? 2 : 0;
      
      countUpRef.current = new CountUp(numberRef.current, metric.value, {
        decimalPlaces: decimals,
        duration: 2.5,
        separator: ',',
      });
      
      if (!countUpRef.current.error) {
        countUpRef.current.start();
      } else {
        console.error(countUpRef.current.error);
      }
    }
  }, [isVisible, metric.value]);

  return (
    <div className={`flex flex-col items-center justify-center text-center p-4 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: `${idx * 100}ms` }}>
      <div className="text-4xl md:text-5xl font-bold text-white mb-2 font-mono tracking-tight flex items-baseline">
        {metric.prefix && <span className="text-xl md:text-2xl text-[#00ff88] mr-1">{metric.prefix}</span>}
        <span ref={numberRef}>0</span>
        {metric.suffix && <span className="text-xl md:text-2xl text-[#00ff88] ml-1">{metric.suffix}</span>}
      </div>
      <div className="text-sm md:text-base text-gray-400 font-sans tracking-wide uppercase">
        {metric.label}
      </div>
    </div>
  );
}
