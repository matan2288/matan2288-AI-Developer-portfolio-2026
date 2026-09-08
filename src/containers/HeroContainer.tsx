import React from 'react';
import { ArrowRight, Mail } from 'lucide-react';
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
}) => {
  const firstName = portfolio.developerName.split(' ')[0] || '';
  const restName = portfolio.developerName.split(' ').slice(1).join(' ') || '';

  return (
    <section id="home" className="min-h-[calc(100vh-4rem)] flex items-center bg-white pt-20 pb-12 sm:pt-24 sm:pb-16 md:py-20 lg:py-0">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 lg:items-start items-center">
          
          {/* Left Column: Developer Profile */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
              <div className="relative shrink-0 group">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-neutral-100 shadow-2xs border border-border">
                  <img
                    src={portfolio.avatarUrl}
                    alt={portfolio.developerName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 ease-in-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5 min-w-0 flex-1">
                <span className="text-xs uppercase tracking-wider text-accent font-semibold block truncate max-w-full">
                  {portfolio.title}
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text uppercase font-sans leading-tight break-words">
                  {firstName} <span className="text-text-muted font-normal">{restName}</span>
                </h1>
                <p className="text-xs text-text-muted uppercase tracking-wider font-medium">
                  {portfolio.location}
                </p>
              </div>
            </div>

            <p className="text-sm sm:text-base text-text-muted leading-relaxed break-words">
              {portfolio.heroBio}
            </p>

            {/* Quantitative Highlights List */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 sm:gap-4 py-3.5 border-y border-border">
              {portfolio.stats.map((stat, idx) => (
                <div key={idx} className="min-w-0">
                  <span className="block text-lg sm:text-xl font-bold text-text truncate">{stat.value}</span>
                  <span className="text-xs uppercase tracking-wider text-text-muted block truncate font-medium">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Clean Actions */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
              <a 
                href="#experience"
                onClick={(e) => onNavClick(e, '#experience')}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-neutral-50 text-text border border-border/80 hover:border-neutral-300 text-xs font-medium rounded-xl shadow-2xs transition-all shrink-0 cursor-pointer"
              >
                <span>View Experience</span>
                <ArrowRight size={13} className="text-text-muted" />
              </a>
              <a 
                href="#contact"
                onClick={(e) => onNavClick(e, '#contact')}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-neutral-50 text-text border border-border/80 hover:border-neutral-300 text-xs font-medium rounded-xl shadow-2xs transition-all cursor-pointer shrink-0"
              >
                <Mail size={13} className="text-text-muted" />
                <span>Get in Touch</span>
              </a>
            </div>
          </div>

          {/* Right Column: AI Assistant */}
          <div className="lg:col-span-6 w-full">
            <AIPersonaChat />
          </div>

        </div>
      </div>
    </section>
  );
};
