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
    <section id="testimonials" className="py-14 md:py-20 bg-bg-alt border-t border-border">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <div className="mb-8 sm:mb-12">
          <SectionLabel num="02" title="Endorsements" />
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2.5">
            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-text leading-tight">
              Recommendations & Feedback
            </h2>
            <span className="text-xs sm:text-sm text-text-muted font-normal">
              Endorsements from engineering leads, architects & product owners
            </span>
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
