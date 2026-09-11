import React from 'react';
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';

interface FooterContainerProps {
  developerName?: string;
  contactEmail?: string;
  linkedInUrl?: string;
}

export const FooterContainer: React.FC<FooterContainerProps> = ({
  contactEmail = "MaTaN2288@gmail.com",
  linkedInUrl = "https://www.linkedin.com/in/matan2288"
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-neutral-200/80 py-8 sm:py-10">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-center">
        <div className="flex items-center gap-5 sm:gap-6 text-neutral-500">
          <a
            href="https://github.com/matan2288"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 hover:text-neutral-900 p-1 transition-colors cursor-pointer inline-flex items-center justify-center"
            aria-label="GitHub Profile"
          >
            <Github size={16} />
          </a>
          <a
            href={linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 hover:text-neutral-900 p-1 transition-colors cursor-pointer inline-flex items-center justify-center"
            aria-label="LinkedIn Profile"
          >
            <Linkedin size={16} />
          </a>
          <a
            href={`mailto:${contactEmail}`}
            className="text-neutral-500 hover:text-neutral-900 p-1 transition-colors cursor-pointer inline-flex items-center justify-center"
            aria-label="Send Email"
          >
            <Mail size={16} />
          </a>

          {/* Vertical divider */}
          <div className="h-4 w-px bg-neutral-300 mx-1 sm:mx-1.5" />

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            type="button"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
            aria-label="Back to top"
          >
            <span>Top</span>
            <ArrowUp size={13} className="stroke-[2.2]" />
          </button>
        </div>
      </div>
    </footer>
  );
};

