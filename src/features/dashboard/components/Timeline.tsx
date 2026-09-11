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
  isFirst?: boolean;
  isLast?: boolean;
}

const TimelineCard: React.FC<TimelineItemProps> = ({
  id,
  role,
  company,
  location,
  period,
  bullets,
  isLatest,
  isFirst,
  isLast
}) => {
  const isAmdocs = id === 'amdocs' || company.toLowerCase().includes('amdocs');

  return (
    <div className="relative pl-7 sm:pl-9 md:pl-0 pb-8 sm:pb-10 last:pb-0 group">
      {/* Mobile timeline connecting line */}
      <div className="md:hidden absolute left-[7px] sm:left-[8px] top-0 bottom-0 pointer-events-none">
        {!isFirst && (
          <div className="absolute top-0 h-6 w-px bg-neutral-200" />
        )}
        {!isLast && (
          <div className="absolute top-6 bottom-0 w-px bg-neutral-200" />
        )}
      </div>

      {/* Mobile Dot */}
      <div className="md:hidden absolute left-0 top-5 sm:top-6 z-10 flex items-center justify-center">
        {isLatest ? (
          <div className="w-4 h-4 rounded-full border border-neutral-700 bg-white flex items-center justify-center shadow-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
          </div>
        ) : (
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-400 ring-4 ring-white ml-[3px]" />
        )}
      </div>

      {/* Desktop connecting line: continuous between dots */}
      <div className="hidden md:block absolute left-[210px] -translate-x-1/2 top-0 bottom-0 pointer-events-none">
        {!isFirst && (
          <div className="absolute top-0 h-6 w-px bg-neutral-200" />
        )}
        {!isLast && (
          <div className="absolute top-6 bottom-0 w-px bg-neutral-200" />
        )}
      </div>

      {/* Desktop Layout: Left Logo/Space + Center Line/Dot + Right Card */}
      <div className="md:grid md:grid-cols-[180px_28px_1fr] md:gap-x-4 items-start">
        {/* Left Column: Logo if available */}
        <div className="hidden md:flex justify-center items-start pt-1.5">
          {isAmdocs && (
            <img
              src="/amdocs-logo.png"
              alt="Amdocs Logo PNG Vector"
              title="Amdocs Logo PNG Vector"
              className="w-24 sm:w-28 object-contain select-none grayscale opacity-75 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.seeklogo.com/logo-png/35/1/amdocs-logo-png_seeklogo-355947.png";
              }}
            />
          )}
        </div>

        {/* Center Column: Dot aligned horizontally with card header */}
        <div className="hidden md:flex justify-center items-center pt-5 sm:pt-6">
          {isLatest ? (
            <div className="relative z-10 w-4 h-4 rounded-full border border-neutral-700 bg-white flex items-center justify-center shadow-xs transition-all duration-200 group-hover:ring-2 group-hover:ring-neutral-200">
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
            </div>
          ) : (
            <div className="relative z-10 w-2.5 h-2.5 rounded-full bg-neutral-400 ring-4 ring-white shadow-2xs transition-all duration-200 group-hover:bg-neutral-600" />
          )}
        </div>

        {/* Right Column: Experience Card */}
        <div className="bg-bg-alt rounded-2xl p-5 sm:p-6 md:p-7 border border-border/80 hover:border-neutral-400 transition-colors duration-200 relative shadow-2xs">
          {/* Mobile-only Amdocs logo */}
          {isAmdocs && (
            <div className="md:hidden mb-3.5">
              <img
                src="/amdocs-logo.png"
                alt="Amdocs Logo PNG Vector"
                title="Amdocs Logo PNG Vector"
                className="h-8 object-contain grayscale opacity-75 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.seeklogo.com/logo-png/35/1/amdocs-logo-png_seeklogo-355947.png";
                }}
              />
            </div>
          )}

          {/* Card Header matching image.png */}
          <div className="mb-4 sm:mb-5">
            <div className="flex items-baseline justify-between gap-4 mb-1">
              <span className="text-xs font-bold text-text-muted uppercase tracking-wider truncate">
                {company} {location && `· ${location}`}
              </span>
              <span className="text-xs text-text-muted shrink-0 font-medium tracking-wide">
                {period}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-text uppercase break-words leading-tight">
              {role}
            </h3>
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
    <div className="w-full max-w-5xl mx-auto">
      <div className="relative">
        {experiences.map((exp, idx) => (
          <TimelineCard
            key={exp.id || exp.company}
            {...exp}
            isFirst={idx === 0}
            isLast={idx === experiences.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

