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
    <section id="contact" className="py-20 md:py-28 bg-white border-t border-border">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <SectionLabel num="03" title="Get in Touch" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Direct Coordinates */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-text leading-tight mb-3 sm:mb-4 break-words">
                Let's connect
              </h2>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                Available for engineering contracts, full-stack development, and remote or hybrid positions.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <div>
                <span className="text-xs uppercase text-text-muted tracking-wider font-semibold block mb-1">
                  Email
                </span>
                <a 
                  href={`mailto:${portfolio.contactEmail}`} 
                  className="text-sm sm:text-base text-accent font-semibold hover:text-accent-hover hover:underline inline-flex items-center gap-1.5 break-all sm:break-normal"
                >
                  {portfolio.contactEmail} <ArrowUpRight size={16} className="shrink-0" />
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
                  className="text-sm sm:text-base text-text hover:text-accent font-semibold hover:underline inline-flex items-center gap-1.5"
                >
                  Connect on LinkedIn <ArrowUpRight size={16} className="shrink-0" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiries Form Component */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

        </div>
      </div>
    </section>
  );
};
