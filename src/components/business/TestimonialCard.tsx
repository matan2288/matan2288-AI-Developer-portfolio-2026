import React from 'react';
import { RecommendationItem } from '../../features/dashboard/types';

interface TestimonialCardProps {
  recommendation: RecommendationItem;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ recommendation }) => {
  return (
    <div className="bg-white border border-border/80 p-5 sm:p-6 rounded-2xl shadow-2xs hover:border-neutral-300 transition-all flex flex-col justify-between h-full">
      <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed italic mb-5 sm:mb-6 break-words">
        "{recommendation.quote}"
      </p>
      <div className="pt-3 border-t border-border/40">
        <h5 className="font-bold text-xs sm:text-sm text-text uppercase break-words">
          {recommendation.author}
        </h5>
        <div className="text-xs text-text-muted break-words mt-0.5">
          {recommendation.role} · <span className="font-semibold text-accent">{recommendation.company}</span>
        </div>
      </div>
    </div>
  );
};
