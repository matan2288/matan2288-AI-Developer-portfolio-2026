import React from 'react';
import { useTinaExperiences } from '../../../services/tinaContent';
import { ExperienceItem } from '../types';

interface TimelineItemProps {
  id: string;
  role: string;
  company: string;
  location?: string;
  period: string;
  bullets: string[];
  isLatest?: boolean;
}

const TimelineCard: React.FC<TimelineItemProps> = ({
  role,
  company,
  location,
  period,
  bullets,
  isLatest
}) => {
  return (
    <div className="relative pl-7 sm:pl-9 pb-10 sm:pb-12 last:pb-0 group">
      {/* Timeline line connecting items */}
      <div className="absolute left-[7px] sm:left-[8px] top-3.5 bottom-0 w-px bg-border group-last:hidden" />
      
      {/* Clean minimalist dot */}
      <div className={`absolute left-0 top-2 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border flex items-center justify-center z-10 transition-colors duration-300 ${
        isLatest 
          ? 'bg-white border-neutral-400' 
          : 'bg-white border-border/80 group-hover:border-neutral-300'
      }`}>
        <div className={`w-1.5 h-1.5 rounded-full ${isLatest ? 'bg-neutral-800' : 'bg-neutral-300 group-hover:bg-neutral-500'}`} />
      </div>

      {/* Content wrapper */}
      <div className="bg-bg-alt rounded-2xl p-4 sm:p-6 border border-border/80 hover:border-neutral-300 transition-all duration-300 relative shadow-2xs">
        {/* Timestamp header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-4 pb-3 border-b border-border/60">
          <div className="min-w-0 flex-1">
            <span className="text-xs font-bold text-accent uppercase tracking-wider block mb-1 truncate">
              {company} {location && `· ${location}`}
            </span>
            <h4 className="text-base sm:text-lg font-bold text-text uppercase break-words leading-tight">
              {role}
            </h4>
          </div>
          <span className="text-xs text-text-muted shrink-0 self-start sm:self-auto font-medium">
            {period}
          </span>
        </div>

        {/* Detailed achievements bullets */}
        <ul className="space-y-2.5 sm:space-y-3">
          {bullets.map((bullet, idx) => (
            <li key={idx} className="text-xs sm:text-sm text-text-muted leading-relaxed flex items-start gap-2.5">
              <span className="text-text-subtle select-none text-xs mt-0.5">•</span>
              <span className="break-words">{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

interface TimelineProps {
  experiences?: ExperienceItem[];
}

export const Timeline: React.FC<TimelineProps> = ({ experiences: customExperiences }) => {
  const hookExperiences = useTinaExperiences();
  const experiences = customExperiences || hookExperiences;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-1.5 mb-8">
        <h3 className="text-xl sm:text-2xl font-bold uppercase text-text tracking-tight">
          Work History & Roles
        </h3>
        <p className="text-xs sm:text-sm text-text-muted">
          Software engineering roles and technical milestones.
        </p>
      </div>
      
      <div className="relative">
        {experiences.map((exp) => (
          <TimelineCard
            key={exp.id || exp.company}
            {...exp}
          />
        ))}
      </div>
    </div>
  );
};

