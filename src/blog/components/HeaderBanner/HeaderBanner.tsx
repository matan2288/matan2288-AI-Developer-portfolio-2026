import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { HeaderBannerProps } from './HeaderBanner.types';

export const HeaderBanner: React.FC<HeaderBannerProps> = ({
  onBackToPortfolio,
  title = 'Engineering Blog',
  subtitle = 'Technical Insights & Architecture',
  description = 'In-depth articles on telecom e-commerce buyflows, GTM dataLayer architectures, React state optimization, and lessons in engineering discipline.'
}) => {
  return (
    <div className="border-b border-border pb-8 mb-8 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-accent font-bold block mb-1">
            {subtitle}
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-text uppercase font-sans">
            {title.split(' ')[0]} <span className="text-text-muted">{title.split(' ').slice(1).join(' ')}</span>
          </h1>
        </div>

        <button
          onClick={onBackToPortfolio}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-white hover:border-text text-xs font-mono uppercase tracking-wider text-text transition-all cursor-pointer self-start sm:self-auto shadow-2xs"
        >
          <ArrowLeft size={14} />
          <span>Return to Portfolio</span>
        </button>
      </div>

      <p className="text-base text-text-muted max-w-2xl leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default HeaderBanner;
