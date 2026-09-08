import React from 'react';

interface FooterContainerProps {
  developerName: string;
}

export const FooterContainer: React.FC<FooterContainerProps> = ({ developerName }) => {
  return (
    <footer className="bg-bg-alt border-t border-border py-10 text-center text-text-muted">
      <div className="max-w-6xl mx-auto px-6 text-xs tracking-wider space-y-1.5">
        <p className="text-text font-semibold uppercase">
          © 2026 {developerName}
        </p>
        <p className="text-[11px] text-text-muted tracking-normal">
          Software Developer · Fullstack & Frontend Specialist
        </p>
      </div>
    </footer>
  );
};
