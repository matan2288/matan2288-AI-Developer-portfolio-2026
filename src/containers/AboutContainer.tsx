import React from 'react';
import { SectionLabel } from '../components/ui/SectionLabel';
import { PillarsTabViewer } from '../components/business/PillarsTabViewer';
import { TechStackGrid } from '../components/business/TechStackGrid';
import { PortfolioContent, PillarItem, SkillCategory } from '../features/dashboard/types';

interface AboutContainerProps {
  portfolio: PortfolioContent;
  pillars: PillarItem[];
  skills: SkillCategory[];
}

export const AboutContainer: React.FC<AboutContainerProps> = ({
  portfolio,
  pillars,
  skills,
}) => {
  return (
    <section id="about" className="py-20 md:py-28 bg-bg-alt border-t border-border">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <SectionLabel num="01" title="About" />
        
        <div className="max-w-3xl space-y-4 mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text uppercase leading-tight">
            {portfolio.aboutTitle}
          </h2>
          <div className="text-text-muted text-sm sm:text-base leading-relaxed space-y-4">
            <p>{portfolio.aboutBio1}</p>
            <p className="text-xs sm:text-sm text-text font-medium uppercase tracking-wider">
              {portfolio.aboutBio2}
            </p>
          </div>
        </div>

        {/* Pillars Tab Viewer Component */}
        <PillarsTabViewer pillars={pillars} />

        {/* Tech Stack Grid Component */}
        <TechStackGrid skills={skills} />

      </div>
    </section>
  );
};
