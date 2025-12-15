import React from 'react';

interface SectionTitleProps {
  subtitle: string;
  title: string;
  center?: boolean;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ subtitle, title, center = true }) => {
  return (
    <div className={`mb-12 ${center ? 'text-center' : 'text-left'}`}>
      <span className="text-brand-accent font-bold tracking-[0.2em] uppercase text-sm mb-2 block">
        {subtitle}
      </span>
      <h2 className="font-display text-4xl md:text-5xl font-bold text-white uppercase leading-tight">
        {title}
      </h2>
      <div className={`h-1 w-20 bg-brand-accent mt-4 ${center ? 'mx-auto' : ''}`}></div>
    </div>
  );
};
