import React, { useState } from 'react';
import { RecommendationItem } from '../../features/dashboard/types';
import { Linkedin } from 'lucide-react';
interface TestimonialCardProps {
  recommendation: RecommendationItem;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ recommendation }) => {
  const [imageError, setImageError] = useState(false);

  // Fallback monogram when image is loading, not yet available, or API url errors
  const getInitials = (name: string): string => {
    if (!name) return 'IN';
    const words = name.trim().split(/\s+/);
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  const hasAvatar = Boolean(recommendation.avatarUrl && !imageError);

  return (
    <div className="bg-white border border-border/80 hover:border-neutral-300 p-5 sm:p-6 rounded-2xl shadow-2xs hover:shadow-xs transition-all duration-200 flex flex-col justify-between h-full group">
      {/* Quote text */}
      <div className="mb-6">
        <p className="text-xs sm:text-[13px] text-text-muted leading-relaxed font-normal">
          “{recommendation.quote}”
        </p>
      </div>

      {/* Author Profile with LinkedIn-sourced Avatar */}
      <div className="pt-4 border-t border-border/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar frame with verified LinkedIn source badge */}
          <div className="relative shrink-0">
            {hasAvatar ? (
              <img
                src={recommendation.avatarUrl}
                alt={recommendation.author}
                onError={() => setImageError(true)}
                className="w-10 h-10 rounded-full object-cover border border-border/80 bg-neutral-100 shadow-2xs"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-neutral-100 border border-border/80 flex items-center justify-center text-text font-semibold text-xs tracking-tight shadow-2xs">
                {getInitials(recommendation.author)}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h5 className="font-semibold text-xs sm:text-[13px] text-text truncate">
              {recommendation.author}
            </h5>
            <div className="text-[11px] text-text-muted truncate mt-0.5">
              {recommendation.role} · <span className="font-medium text-text">{recommendation.company}</span>
            </div>
          </div>
        </div>

        {/* Optional LinkedIn reference link */}
        {recommendation.linkedInUrl && (
          <a
            href={recommendation.linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-subtle hover:text-[#000000] rounded-lg hover:bg-neutral-50 border border-transparent hover:border-border/80 transition-all shrink-0 cursor-pointer"
            title="View on LinkedIn"
          >
            <Linkedin size={13} />
          </a>
        )}
      </div>
    </div>
  );
};

export default TestimonialCard;
