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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-text leading-tight">
                Recommendations &amp; Feedback
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
                className={`h-1 rounded-full transition-all duration-200 cursor-pointer ${
                  currentPage === idx
                    ? 'w-5 bg-neutral-600'
                    : 'w-1.5 bg-neutral-300 hover:bg-neutral-400'
                }`}
                title={`Go to page ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
