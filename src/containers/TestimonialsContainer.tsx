import React, { useState, useEffect } from 'react';
import { TestimonialCard } from '../components/business/TestimonialCard';
import { RecommendationItem } from '../features/dashboard/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TestimonialsContainerProps {
  recommendations: RecommendationItem[];
}

const CARDS_PER_PAGE = 4; // 2 cards per row x 2 rows max

export const TestimonialsContainer: React.FC<TestimonialsContainerProps> = ({
  recommendations,
}) => {
  const [items, setItems] = useState<RecommendationItem[]>(() =>
    recommendations && recommendations.length > 0 ? recommendations : []
  );
  const [isLoadedFromApi, setIsLoadedFromApi] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(1);

  // Fetch verified recommendations via API call
  useEffect(() => {
    let isMounted = true;

    async function fetchRecommendations() {
      try {
        const res = await fetch('/api/recommendations');
        if (!res.ok) return;
        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          // Response is not JSON (e.g. static host served index.html SPA fallback)
          return;
        }
        const json = await res.json();
        const apiData = json.data || json.recommendations || [];
        if (isMounted && Array.isArray(apiData) && apiData.length > 0) {
          setItems(apiData);
          setIsLoadedFromApi(true);
        }
      } catch (err) {
        console.warn('Could not fetch recommendations from /api/recommendations, using fallback:', err);
      }
    }

    fetchRecommendations();

    return () => {
      isMounted = false;
    };
  }, []);

  // Keep in sync with CMS live updates
  useEffect(() => {
    if (!isLoadedFromApi && recommendations && recommendations.length > 0) {
      setItems(recommendations);
    }
  }, [recommendations, isLoadedFromApi]);

  const activeRecommendations = items.length > 0 ? items : recommendations;
  const totalPages = Math.ceil(activeRecommendations.length / CARDS_PER_PAGE);

  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(totalPages - 1);
    }
  }, [totalPages, currentPage]);

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setDirection(1);
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleDotClick = (pageIdx: number) => {
    setDirection(pageIdx > currentPage ? 1 : -1);
    setCurrentPage(pageIdx);
  };

  const startIndex = currentPage * CARDS_PER_PAGE;
  const pageItems = activeRecommendations.slice(startIndex, startIndex + CARDS_PER_PAGE);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 24 : -24,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -24 : 24,
      opacity: 0,
    }),
  };

  return (
    <section id="testimonials" className="py-14 md:py-20 bg-[#FBFCFD] border-t border-border">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        {/* Section Header with Slider Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 sm:mb-16">
          <div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-700 leading-tight font-heading">
                What Colleagues has to say about me?
              </h2>
            </div>
          </div>

          {/* Slider Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              <span className="font-mono text-[10px] text-text-subtle/70 tracking-widest">
                {String(currentPage + 1).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentPage === 0}
                  className="p-1.5 rounded-lg text-text-subtle hover:text-text hover:bg-neutral-200/60 transition-colors disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                  title="Previous Page"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={currentPage === totalPages - 1}
                  className="p-1.5 rounded-lg text-text-subtle hover:text-text hover:bg-neutral-200/60 transition-colors disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                  title="Next Page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 2 cards per row, 2 rows max (4 items per page) */}
        <div className="overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentPage}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-start"
            >
              {pageItems.map((rec, idx) => (
                <TestimonialCard key={rec.id || `${currentPage}-${idx}`} recommendation={rec} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Pagination Indicator Dots */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-8">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleDotClick(idx)}
                className={`h-1 rounded-full transition-all duration-200 cursor-pointer ${currentPage === idx
                  ? 'w-5 bg-neutral-600'
                  : 'w-1.5 bg-neutral-300 hover:bg-neutral-400'
                  }`}
                title={`Go to page ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Sourced from LinkedIn link matching design */}
        <div className={`flex items-center justify-center ${totalPages > 1 ? 'mt-9 sm:mt-11' : 'mt-12 sm:mt-14'} pt-1`}>
          <a
            href="https://www.linkedin.com/in/matan-elmaliach/details/recommendations/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 font-mono text-[11px] sm:text-xs font-normal text-neutral-400 hover:text-neutral-700 transition-colors duration-200 select-none py-1"
            title="View recommendations on LinkedIn"
          >
            <svg
              className="w-3.5 h-3.5 text-[#0A66C2] shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.778-.773 1.778-1.729V1.73C24 .774 23.205 0 22.225 0z" />
            </svg>
            <span className="relative inline-block pb-0.5">
              Sourced from LinkedIn
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-neutral-400 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out pointer-events-none" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};
