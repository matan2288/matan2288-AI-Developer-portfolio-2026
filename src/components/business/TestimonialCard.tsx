import React from 'react';
import { RecommendationItem } from '../../features/dashboard/types';

interface TestimonialCardProps {
  recommendation: RecommendationItem;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ recommendation }) => {
  return (
    <div className="bg-white border border-border p-6 rounded-2xl shadow-xs hover:border-accent hover:shadow-sm transition-all flex flex-col justify-between">
      <p className="text-sm text-[#4B5563] leading-relaxed italic mb-6">
        "{recommendation.quote}"
      </p>
      <div>
        <h5 className="font-bold text-sm text-text uppercase">
          {recommendation.author}
        </h5>
        <div className="text-[11px] font-mono text-text-muted">
          {recommendation.role} · <span className="font-semibold text-accent">{recommendation.company}</span>
        </div>
      </div>
    </div>
  );
};
