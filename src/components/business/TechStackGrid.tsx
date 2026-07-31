import React from 'react';
import { SkillCategory } from '../../features/dashboard/types';

interface TechStackGridProps {
  skills: SkillCategory[];
}

export const TechStackGrid: React.FC<TechStackGridProps> = ({ skills }) => {
  return (
    <div className="pt-12 border-t border-border/60">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4">
          <span className="text-[10px] uppercase tracking-widest text-text-muted block mb-1">
            01.2 — Toolsets
          </span>
          <h3 className="text-xl font-bold uppercase text-text tracking-tight mb-3">
            Enterprise Tech Stack
          </h3>
          <p className="text-xs text-text-muted leading-relaxed">
            Managed via TinaCMS schema collections.
          </p>
        </div>
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {skills.map((cat, idx) => (
            <div key={idx} className="bg-white border border-border rounded-xl p-5 hover:shadow-2xs transition-all">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-3 font-mono">
                {cat.title}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {cat.items.map((skill) => (
                  <span 
                    key={skill}
                    className="px-2.5 py-1 rounded-md text-[11px] font-medium text-text bg-bg-alt border border-border hover:border-text transition-colors cursor-default select-none"
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
