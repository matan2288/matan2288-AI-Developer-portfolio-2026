import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { SectionLabel } from '../components/ui/SectionLabel';
import { ContactForm } from '../components/business/ContactForm';
import { PortfolioContent } from '../features/dashboard/types';

interface ContactContainerProps {
  portfolio: PortfolioContent;
}

export const ContactContainer: React.FC<ContactContainerProps> = ({ portfolio }) => {
  return (
    <section id="contact" className="py-14 md:py-20 bg-white border-t border-border">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <div className="mb-8 sm:mb-12">
          <SectionLabel num="03" title="Inquiries & Network" />
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-text leading-tight">
              Get in Touch
            </h2>
            <p className="text-xs sm:text-sm text-text-muted font-normal mt-1.5">
              Available for software engineering contracts, frontend leadership, and full-stack positions
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Direct Coordinates */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-xs uppercase text-text-muted tracking-wider font-semibold block mb-1">
                  Email
                </span>
                <a 
                  href={`mailto:${portfolio.contactEmail}`} 
                  className="text-sm sm:text-base text-text font-semibold hover:text-text-muted hover:underline inline-flex items-center gap-1.5 break-all sm:break-normal"
                >
                  {portfolio.contactEmail} <ArrowUpRight size={16} className="shrink-0 text-text-muted" />
                </a>
              </div>

              <div>
                <span className="text-xs uppercase text-text-muted tracking-wider font-semibold block mb-1">
                  LinkedIn
                </span>
                <a 
                  href={portfolio.linkedInUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-sm sm:text-base text-text hover:text-text-muted font-semibold hover:underline inline-flex items-center gap-1.5"
                >
                  Connect on LinkedIn <ArrowUpRight size={16} className="shrink-0 text-text-muted" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiries Form Component */}
          <div className="lg:col-span-7">
            <ContactForm contactEmail={portfolio.contactEmail} />
          </div>

        </div>
      </div>
    </section>
  );
};
