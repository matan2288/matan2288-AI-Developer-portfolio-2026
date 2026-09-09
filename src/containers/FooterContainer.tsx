import React from 'react';
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';

interface FooterContainerProps {
  developerName: string;
}

export const FooterContainer: React.FC<FooterContainerProps> = ({ developerName }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-bg-alt border-t border-border py-8 text-text-muted">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="text-center sm:text-left space-y-1">
          <p className="text-text font-semibold uppercase tracking-wider">
            © 2026 {developerName}
          </p>
          <p className="text-[11px] text-text-muted tracking-normal">
            AI-Driven Software Developer · Fullstack & Frontend Specialist
          </p>
        </div>

        {/* 3 Icons & Top Button */}
        <div className="flex items-center gap-4 text-text-muted">
          <a
            href="https://github.com/matan2288"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted hover:text-text p-1.5 transition-colors"
            aria-label="GitHub Profile"
          >
            <Github size={15} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted hover:text-text p-1.5 transition-colors"
            aria-label="LinkedIn Profile"
          >
            <Linkedin size={15} />
          </a>
          <a
            href="mailto:MaTaN2288@gmail.com"
            className="text-text-muted hover:text-text p-1.5 transition-colors"
            aria-label="Send Email"
          >
            <Mail size={15} />
          </a>
          <div className="h-4 w-[1px] bg-border mx-1" />
          <button
            onClick={scrollToTop}
            type="button"
            className="inline-flex items-center gap-1 text-[11px] font-mono text-text-muted hover:text-text cursor-pointer"
            aria-label="Back to top"
          >
            <span>Top</span>
            <ArrowUp size={12} />
          </button>
        </div>
      </div>
    </footer>
  );
};
