import React, { useState, useRef, useEffect } from 'react';
import { RecommendationItem } from '../../features/dashboard/types';
import { Linkedin } from 'lucide-react';
import { motion } from 'motion/react';

interface TestimonialCardProps {
  recommendation: RecommendationItem;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ recommendation }) => {
  const [imageError, setImageError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const [canExpand, setCanExpand] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Detect if recommendation text exceeds 6 lines
  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        const hasOverflow = textRef.current.scrollHeight > textRef.current.clientHeight + 2;
        setCanExpand(hasOverflow);
      } else if ((recommendation.quote?.length || 0) > 300) {
        setCanExpand(true);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [recommendation.quote]);

  // Clean up any pending expansion timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleToggle = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (!isExpanded) {
      // 1. Start container expansion immediately
      setIsExpanded(true);
      // 2. Unclamp text with a slight delay so the container has time to expand without overlapping the footer
      timerRef.current = setTimeout(() => {
        setShowFullText(true);
      }, 120);
    } else {
      setShowFullText(false);
      setIsExpanded(false);
    }
  };

  // Fallback monogram when image is loading, not yet available, or API url errors
  const getInitials = (name: string): string => {
    if (!name) return 'IN';
    const words = name.trim().split(/\s+/);
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  const hasAvatar = Boolean(recommendation.avatarUrl && !imageError);

  return (
    <motion.div
      layout
      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white/70 backdrop-blur-xs border border-border/80 p-5 sm:p-6 rounded-2xl shadow-2xs hover:shadow-xs transition-colors duration-200 flex flex-col justify-between h-full group overflow-hidden"
    >
      {/* Quote text with smooth height layout animation and overflow protection */}
      <motion.div layout="position" className="mb-6 flex-1 flex flex-col justify-start overflow-hidden">
        <div className="overflow-hidden">
          <motion.p
            ref={textRef}
            layout="position"
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => {
              if (!isExpanded && canExpand) {
                handleToggle();
              }
            }}
            className={`text-[14px] text-text-muted leading-relaxed font-normal transition-opacity duration-300 ${
              !showFullText ? 'line-clamp-6 cursor-pointer' : 'opacity-100'
            }`}
            title={!isExpanded && canExpand ? 'Click to read full recommendation' : undefined}
          >
            “{recommendation.quote}”
          </motion.p>
        </div>

        {canExpand && (
          <div className="mt-2.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleToggle();
              }}
              className="text-xs text-text-subtle hover:text-[#0A66C2] font-normal transition-colors cursor-pointer inline-flex items-center gap-1 group/btn"
              title={isExpanded ? 'Show less' : 'Show full recommendation'}
            >
              {!isExpanded ? (
                <>
                  <span className="font-mono text-text-muted text-xs group-hover/btn:text-[#0A66C2] transition-colors">...</span>
                  <span className="text-[11px] text-text-subtle group-hover/btn:text-[#0A66C2] underline underline-offset-4 decoration-border-hover group-hover/btn:decoration-[#0A66C2] transition-colors">
                    more
                  </span>
                </>
              ) : (
                <span className="text-[11px] text-text-subtle group-hover/btn:text-[#0A66C2] underline underline-offset-4 decoration-border-hover group-hover/btn:decoration-[#0A66C2] transition-colors">
                  show less
                </span>
              )}
            </button>
          </div>
        )}
      </motion.div>

      {/* Author Profile with LinkedIn-sourced Avatar (guaranteed solid layer that never gets overlapped) */}
      <motion.div
        layout="position"
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 bg-white/60 backdrop-blur-xs pt-4 border-t border-border/60 flex items-center justify-between gap-3 mt-auto"
      >
        <div className="flex items-center gap-3 min-w-0">
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
            <h5 className="font-semibold text-[14px] text-text truncate">
              {recommendation.author}
            </h5>
            <div className="text-[11px] text-text-muted truncate mt-0.5">
              {recommendation.role} · <span className="font-medium text-text">{recommendation.company}</span>
            </div>
          </div>
        </div>

        {recommendation.linkedInUrl && (
          <a
            href={recommendation.linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-subtle hover:text-[#0A66C2] rounded-lg hover:bg-[#0A66C2]/10 transition-colors shrink-0 cursor-pointer p-1"
            title="View on LinkedIn"
          >
            <Linkedin size={13} />
          </a>
        )}
      </motion.div>
    </motion.div>
  );
};

export default TestimonialCard;
