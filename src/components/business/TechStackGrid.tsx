import React from 'react';
import { SkillCategory } from '../../features/dashboard/types';

interface TechStackGridProps {
  skills: SkillCategory[];
}

export const TechStackGrid: React.FC<TechStackGridProps> = ({ skills }) => {
  return (
    <div className="pt-10 sm:pt-12 border-t border-border/60">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        <div className="lg:col-span-4">
          <span className="text-xs uppercase tracking-wider text-text-muted block mb-1 font-semibold">
            Technical Toolsets
          </span>
          <h3 className="text-xl font-bold uppercase text-text tracking-tight mb-2 sm:mb-3 break-words">
            Core Tech Stack
          </h3>
          <p className="text-xs text-text-muted leading-relaxed">
            Technologies, frameworks, and tools used across production environments.
          </p>
        </div>
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {skills.map((cat, idx) => (
            <div key={idx} className="bg-white border border-border rounded-xl p-4 sm:p-5 hover:shadow-2xs transition-all">
              <span className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2.5 sm:mb-3 break-words">
                {cat.title}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {cat.items.map((skill) => (
                  <span 
                    key={skill}
                    className="px-2.5 py-1 rounded-md text-[11px] font-medium text-text bg-white border border-border/80 hover:border-neutral-300 transition-colors cursor-default select-none break-words shadow-2xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
