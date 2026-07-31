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
        <SectionLabel num="04" title="Get in Touch" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Coordinates */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h2 className="text-3xl font-bold uppercase tracking-tight text-text leading-tight mb-4">
                Ready to build together?
              </h2>
              <p className="text-sm text-text-muted leading-relaxed">
                Discuss professional engineering contracts or hybrid roles.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <div>
                <span className="text-[9px] font-mono uppercase text-text-muted tracking-widest block mb-1">
                  Direct Coordinates
                </span>
                <a 
                  href={`mailto:${portfolio.contactEmail}`} 
                  className="text-base text-accent font-semibold hover:text-accent-hover hover:underline inline-flex items-center gap-1.5"
                >
                  {portfolio.contactEmail} <ArrowUpRight size={16} />
                </a>
              </div>

              <div>
                <span className="text-[9px] font-mono uppercase text-text-muted tracking-widest block mb-1">
                  Professional Directory
                </span>
                <a 
                  href={portfolio.linkedInUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-base text-text hover:text-accent font-semibold hover:underline inline-flex items-center gap-1.5"
                >
                  Connect on LinkedIn <ArrowUpRight size={16} />
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
