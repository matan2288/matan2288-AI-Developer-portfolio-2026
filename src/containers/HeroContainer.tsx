import React from 'react';
import { ArrowRight, Edit3 } from 'lucide-react';
import { AIPersonaChat } from '../features/dashboard';
import { PortfolioContent } from '../features/dashboard/types';

interface HeroContainerProps {
  portfolio: PortfolioContent;
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
  onOpenTinaAdmin: () => void;
}

export const HeroContainer: React.FC<HeroContainerProps> = ({
  portfolio,
  onNavClick,
  onOpenTinaAdmin,
}) => {
  const firstName = portfolio.developerName.split(' ')[0] || '';
  const restName = portfolio.developerName.split(' ').slice(1).join(' ') || '';

  return (
    <section id="home" className="min-h-[calc(100vh-4rem)] flex items-center bg-white py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-6 md:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 lg:items-start items-center">
          
          {/* Left Column: Developer Profile */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <div className="relative shrink-0 group">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-white shadow-2xs">
                  <img
                    src={portfolio.avatarUrl}
                    alt={portfolio.developerName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 ease-in-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-neutral-200/50 rounded-2xl pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted font-bold block">
                    00 — {portfolio.title}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-neutral-100 text-[9px] font-mono text-neutral-600 border border-neutral-200">
                    TinaCMS Content
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text uppercase font-sans leading-tight">
                  {firstName} <span className="text-text-muted">{restName}</span>
                </h1>
                <p className="text-xs font-mono text-accent uppercase tracking-wider font-semibold">
                  {portfolio.location}
                </p>
              </div>
            </div>

            <p className="text-base text-text-muted leading-relaxed">
              {portfolio.heroBio}
            </p>

            {/* Quantitative Highlights List */}
            <div className="grid grid-cols-2 gap-4 py-2 border-y border-border">
              {portfolio.stats.map((stat, idx) => (
                <div key={idx}>
                  <span className="block text-xl font-bold text-text">{stat.value}</span>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-text-muted">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4">
              <a 
                href="#experience"
                onClick={(e) => onNavClick(e, '#experience')}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-accent hover:bg-accent-hover text-white text-xs font-mono uppercase tracking-wider rounded-lg shadow-sm transition-all"
              >
                View Timeline <ArrowRight size={13} />
              </a>
              <button
                onClick={onOpenTinaAdmin}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border border-border hover:border-text text-text hover:bg-neutral-50 text-xs font-mono uppercase tracking-wider rounded-lg transition-all cursor-pointer font-bold"
              >
                <Edit3 size={13} className="text-emerald-500" />
                <span>Edit Content in TinaCMS</span>
              </button>
            </div>
          </div>

          {/* Right Column: AI Sandbox */}
          <div className="lg:col-span-6">
            <div className="bg-bg-alt rounded-2xl p-4 md:p-6 border border-border/80">
              <div className="mb-2 pl-1">
                <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider block font-bold">
                  00 — Interactive Assistant Route
                </span>
                <p className="text-xs text-text-muted">
                  Query the guide regarding core accomplishments:
                </p>
              </div>
              <AIPersonaChat />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
