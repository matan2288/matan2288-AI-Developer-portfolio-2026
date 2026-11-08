import React from 'react';
import { Timeline } from '../features/dashboard';
import { ExperienceItem } from '../features/dashboard/types';

interface ExperienceContainerProps {
  experiences?: ExperienceItem[];
}

export const ExperienceContainer: React.FC<ExperienceContainerProps> = ({ experiences }) => {
  return (
    <section id="experience" className="py-14 md:py-20 bg-white border-t border-border">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="mb-12 sm:mb-16">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-text leading-tight font-heading">
                Work Experience
              </h2>
            </div>
          </div>
          <Timeline experiences={experiences} />
        </div>
    </section>
  );
};
