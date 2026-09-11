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
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-text leading-tight">
              Recommendations & Feedback
            </h2>
            <p className="text-xs sm:text-sm text-text-muted font-normal mt-1.5">
              Endorsements from engineering leads, architects & product owners
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
