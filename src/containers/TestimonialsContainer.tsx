import React from 'react';
import { SectionLabel } from '../components/ui/SectionLabel';
import { TestimonialCard } from '../components/business/TestimonialCard';
import { RecommendationItem } from '../features/dashboard/types';

interface TestimonialsContainerProps {
  recommendations: RecommendationItem[];
}

export const TestimonialsContainer: React.FC<TestimonialsContainerProps> = ({
  recommendations,
}) => {
  return (
    <section id="testimonials" className="py-20 md:py-28 bg-bg-alt border-t border-border">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <SectionLabel num="02" title="Testimonials" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text uppercase leading-tight mb-2">
              Recommendations & Feedback
            </h2>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              Endorsements from team leaders, architects, and product owners.
            </p>
          </div>
        </div>

        {/* Dynamic Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {recommendations.map((rec, idx) => (
            <TestimonialCard key={idx} recommendation={rec} />
          ))}
        </div>
      </div>
    </section>
  );
};
