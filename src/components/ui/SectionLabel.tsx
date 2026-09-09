import React from 'react';

interface SectionLabelProps {
  num: string;
  title: string;
  className?: string;
}

export const SectionLabel: React.FC<SectionLabelProps> = ({ num, title, className = '' }) => {
  return (
    <div className={`flex items-center gap-2 mb-2.5 select-none text-[11px] font-mono tracking-widest text-text-muted ${className}`}>
      <span className="font-semibold text-text">{num}</span>
      <span className="text-neutral-300 font-light">/</span>
      <span className="uppercase font-medium tracking-[0.16em] text-text-muted">{title}</span>
    </div>
  );
};
