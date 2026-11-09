import React from 'react';
import { Timeline } from '../features/dashboard';
import { ExperienceItem } from '../features/dashboard/types';
import { useTinaExperiences } from '../services/tinaContent';

interface ExperienceContainerProps {
  experiences?: ExperienceItem[];
}

export const ExperienceContainer: React.FC<ExperienceContainerProps> = ({ experiences: customExperiences }) => {
  const hookExperiences = useTinaExperiences();
  const experiences = customExperiences || hookExperiences;
  const firstExp = experiences && experiences[0];
  const isAmdocs = firstExp ? (firstExp.id?.includes('amdocs') || firstExp.company?.toLowerCase().includes('amdocs')) : true;
  const location = firstExp?.location || 'Raanana, IL';

  return (
    <section id="experience" className="py-14 md:py-20 bg-white border-t border-border">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <div className="mb-8 sm:mb-12 md:mb-16">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-700 leading-tight font-heading">
              Industry Experience
            </h2>
          </div>
          {/* Mobile view: Amdocs logo and location aligned below Industry Experience header and above the bullets */}
          {isAmdocs && (
            <div className="md:hidden mt-4 flex items-center justify-between gap-4 pt-1">
              <img
                src="/amdocs-logo.png"
                alt="Amdocs"
                title="Amdocs"
                className="h-8 sm:h-9 w-auto max-w-[120px] object-contain select-none grayscale opacity-85 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
              <span className="text-[11px] font-mono text-text-subtle/80 tracking-wider select-none shrink-0">
                {location}
              </span>
            </div>
          )}
        </div>
        <Timeline experiences={experiences} />
      </div>
    </section>
  );
};

