import React from 'react';
import { Briefcase, GraduationCap, Anchor, CheckCircle } from 'lucide-react';
import { useTinaExperiences } from '../../../services/tinaContent';

interface TimelineItemProps {
  id: string;
  role: string;
  company: string;
  location?: string;
  period: string;
  icon: React.ReactNode;
  bullets: string[];
  skills?: string[];
  isLatest?: boolean;
}

const getExperienceIcon = (id: string) => {
  switch (id) {
    case 'amdocs':
      return <Briefcase size={14} />;
    case 'bootcamp':
      return <GraduationCap size={14} />;
    case 'navy':
      return <Anchor size={14} />;
    default:
      return <Briefcase size={14} />;
  }
};

const TimelineCard: React.FC<TimelineItemProps> = ({
  role,
  company,
  location,
  period,
  icon,
  bullets,
  skills,
  isLatest
}) => {
  return (
    <div className="relative pl-8 sm:pl-10 pb-12 last:pb-0 group">
      {/* Timeline line connecting items */}
      <div className="absolute left-[15px] top-2 bottom-0 w-[2px] bg-border group-last:hidden" />
      
      {/* Node icon */}
      <div className={`absolute left-0 top-1.5 w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 transition-colors duration-300 ${
        isLatest 
          ? 'bg-accent border-accent text-white shadow-xs' 
          : 'bg-white border-border text-text-muted group-hover:border-text group-hover:text-text'
      }`}>
        {icon}
      </div>

      {/* Content wrapper */}
      <div className="bg-bg-alt rounded-2xl p-6 border border-border/80 hover:border-text transition-all duration-300 relative">
        {/* Timestamp header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-border/60">
          <div>
            <span className="text-[10px] font-bold text-accent uppercase tracking-wider block font-mono mb-1">
              {company} {location && `· ${location}`}
            </span>
            <h4 className="text-base sm:text-lg font-bold text-text uppercase">
              {role}
            </h4>
          </div>
          <span className="text-xs font-mono text-text-muted bg-white border border-border px-3 py-1 rounded-lg shrink-0 self-start sm:self-auto">
            {period}
          </span>
        </div>

        {/* Detailed achievements bullets */}
        <ul className="space-y-3">
          {bullets.map((bullet, idx) => (
            <li key={idx} className="text-xs sm:text-sm text-[#4B5563] leading-relaxed flex items-start gap-2.5">
              <CheckCircle className="text-text-subtle shrink-0 mt-0.5 group-hover:text-text transition-colors" size={14} />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        {/* Dynamic skills tagged */}
        {skills && skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-6 pt-4 border-t border-border/40">
            {skills.map((skill) => (
              <span
                key={skill}
                className="text-[10px] text-text font-medium bg-white border border-border hover:border-text px-2.5 py-1 rounded-md transition-all cursor-default"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const Timeline: React.FC = () => {
  const experiences = useTinaExperiences();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-2 mb-8">
        <span className="font-mono text-[9px] uppercase tracking-widest text-text-subtle font-bold block">
          Chronological Lifecycle · TinaCMS Managed
        </span>
        <h3 className="text-xl font-bold uppercase text-text tracking-tight">
          Professional Timestamp Timeline
        </h3>
      </div>
      
      <div className="relative">
        {experiences.map((exp) => (
          <TimelineCard
            key={exp.id || exp.company}
            {...exp}
            icon={getExperienceIcon(exp.id)}
          />
        ))}
      </div>
    </div>
  );
};

