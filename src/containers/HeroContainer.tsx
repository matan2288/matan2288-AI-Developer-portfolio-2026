import React from 'react';
import { ArrowRight, Mail, MessageSquare, Github, Linkedin, MapPin } from 'lucide-react';
import { AICommandBar } from '../features/dashboard';
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
  return (
    <section id="home" className="bg-white pt-24 sm:pt-28 pb-12 sm:pb-16">
      <div className="max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 md:px-8 w-full">
        {/* Centered Structured Hero Content */}
        <div className="flex flex-col items-center text-center space-y-5 sm:space-y-6">

          {/* Centered Profile Avatar (Editable only from Admin Platform) */}
          <div className="relative shrink-0">
            <div className="w-[12em] h-[12em] rounded-3xl overflow-hidden bg-neutral-100 shrink-0 shadow-2xs relative">
              <img
                src={portfolio.avatarUrl}
                alt={portfolio.developerName}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('githubusercontent.com')) {
                    target.src = 'https://avatars.githubusercontent.com/u/60103076?v=4';
                  }
                }}
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>

          {/* Name & Title & Location Stack */}
          <div className="space-y-1 max-w-xl mx-auto mb-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-neutral-700 font-heading">
              {portfolio.developerName}
            </h1>

            <p className="text-base sm:text-lg font-medium text-neutral-500 tracking-tight pt-0.5">
              {portfolio.title}
            </p>

            <p className="text-xs sm:text-[13px] text-neutral-400 font-normal tracking-normal flex items-center justify-center gap-1 pt-0.5">
              <MapPin className="w-3 h-3 text-neutral-400/80 shrink-0" />
              <span>{portfolio.location}</span>
            </p>
          </div>

          {/* Quantitative Stats Strip */}
          {portfolio.stats && portfolio.stats.length > 0 && (
            <div className="w-full max-w-3xl mx-auto py-3.5 sm:py-4.5 my-1 flex flex-wrap items-center justify-center gap-x-8 sm:gap-x-12 md:gap-x-14 gap-y-3.5 text-center">
              {portfolio.stats.map((stat, idx) => (
                <div key={idx} className="space-y-1 min-w-[80px] sm:min-w-[100px] px-2">
                  <span className="block text-base sm:text-lg font-medium text-neutral-500 tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-xs text-neutral-400 block font-normal whitespace-nowrap">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Centered AI Command Bar / Chat */}
          <div className="w-full max-w-2xl mx-auto pt-1">
            <AICommandBar />
          </div>

          {/* Action Links (Below Chat) */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm pt-2">
            <a
              href="#experience"
              onClick={(e) => onNavClick(e, '#experience')}
              className="inline-flex items-center gap-1.5 font-medium text-neutral-900 hover:text-neutral-600 transition-colors cursor-pointer group"
            >
              <span>View Experience</span>
              <ArrowRight size={14} className="text-neutral-500 transition-transform group-hover:translate-x-0.5" />
            </a>

            <a
              href="#contact"
              onClick={(e) => onNavClick(e, '#contact')}
              className="inline-flex items-center gap-1.5 font-medium text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
            >
              <MessageSquare size={15} className="text-neutral-500" />
              <span>Get in Touch</span>
            </a>
          </div>

          {/* Social Icons (Centered below action links) */}
          <div className="flex items-center justify-center gap-3 text-neutral-500 pt-1">
            <a
              href="https://github.com/matan2288"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-neutral-900 transition-colors p-1 cursor-pointer"
              aria-label="GitHub Profile"
            >
              <Github size={17} />
            </a>
            <a
              href={portfolio.linkedInUrl || "https://linkedin.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-neutral-900 transition-colors p-1 cursor-pointer"
              aria-label="LinkedIn Profile"
            >
              <Linkedin size={17} />
            </a>
            <a
              href={`mailto:${portfolio.contactEmail || "matan2288@gmail.com"}`}
              className="text-neutral-500 hover:text-neutral-900 transition-colors p-1 cursor-pointer"
              aria-label="Send Email"
            >
              <Mail size={17} />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};
