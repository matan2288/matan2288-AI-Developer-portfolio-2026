import React from 'react';

interface FooterContainerProps {
  developerName: string;
}

export const FooterContainer: React.FC<FooterContainerProps> = ({ developerName }) => {
  return (
    <footer className="bg-bg-alt border-t border-border py-12 text-center text-text-muted">
      <div className="max-w-6xl mx-auto px-6 text-[10px] font-mono tracking-widest uppercase space-y-2">
        <p>© 2026 {developerName.toUpperCase()}. POWERED BY TINACMS HEADLESS ARCHITECTURE.</p>
        <p className="font-sans text-[9px] text-text-subtle lowercase tracking-normal">
          built with React 19, TinaCMS Headless Content Schema, and Gemini RAG middleware
        </p>
      </div>
    </footer>
  );
};
