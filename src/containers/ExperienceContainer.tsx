import React from 'react';
import { SectionLabel } from '../components/ui/SectionLabel';
import { Timeline } from '../features/dashboard';

export const ExperienceContainer: React.FC = () => {
  return (
    <section id="experience" className="py-20 md:py-28 bg-white border-t border-border">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <SectionLabel num="02" title="Experience & Case Timeline" />
        <Timeline />
      </div>
    </section>
  );
};
