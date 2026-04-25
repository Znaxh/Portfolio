import AnimatedCounter from '../AnimatedCounter';
import portfolioData from '../../data/portfolio.json';

export default function MetricsStrip() {
  return (
    <div className="w-full theme-section border-y py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 divide-x-0 md:divide-x" style={{ '--tw-divide-opacity': 1, borderColor: 'var(--theme-border)' }}>
          {portfolioData.metrics.map((metric, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center text-center p-4"
            >
              <div className="text-4xl md:text-5xl font-bold theme-heading mb-2 font-mono tracking-tight flex items-baseline">
                {metric.prefix && (
                  <span className="text-xl md:text-2xl theme-accent mr-1">{metric.prefix}</span>
                )}
                <AnimatedCounter
                  value={metric.value}
                  suffix={metric.suffix || ''}
                  prefix=""
                  duration={2500}
                />
              </div>
              <div className="text-sm md:text-base theme-muted font-sans tracking-wide uppercase">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

