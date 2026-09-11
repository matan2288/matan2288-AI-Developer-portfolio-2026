import React from 'react';
import { SectionLabel } from '../components/ui/SectionLabel';
import { Timeline } from '../features/dashboard';
import { ExperienceItem } from '../features/dashboard/types';

interface ExperienceContainerProps {
  experiences?: ExperienceItem[];
}

export const ExperienceContainer: React.FC<ExperienceContainerProps> = ({ experiences }) => {
  return (
    <section id="experience" className="py-14 md:py-20 bg-white border-t border-border">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <div className="mb-8 sm:mb-12">
          <SectionLabel num="01" title="Career & Roles" />
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-text leading-tight">
              Work Experience
            </h2>
            <p className="text-xs sm:text-sm text-text-muted font-normal mt-1.5">
              Production architectures, high-scale checkouts & fullstack delivery
            </p>
          </div>
        </div>
        <Timeline experiences={experiences} />
      </div>
    </section>
  );
};
