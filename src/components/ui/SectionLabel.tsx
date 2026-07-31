import React from 'react';

interface SectionLabelProps {
  num: string;
  title: string;
}

export const SectionLabel: React.FC<SectionLabelProps> = ({ num, title }) => {
  return (
    <div className="font-mono text-[11px] uppercase tracking-widest text-text-muted mb-8 flex items-center gap-2">
      <span className="font-bold text-text">{num}</span>
      <span className="text-border">——</span>
      <span className="text-text-muted font-semibold">{title}</span>
    </div>
  );
};
