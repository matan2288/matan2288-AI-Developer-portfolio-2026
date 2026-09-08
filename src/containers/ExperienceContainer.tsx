import React from 'react';
import { SectionLabel } from '../components/ui/SectionLabel';
import { Timeline } from '../features/dashboard';
import { ExperienceItem } from '../features/dashboard/types';

interface ExperienceContainerProps {
  experiences?: ExperienceItem[];
}

export const ExperienceContainer: React.FC<ExperienceContainerProps> = ({ experiences }) => {
  return (
    <section id="experience" className="py-20 md:py-28 bg-white border-t border-border">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <SectionLabel num="01" title="Experience" />
        <Timeline experiences={experiences} />
      </div>
    </section>
  );
};
