import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PillarItem } from '../../features/dashboard/types';

interface PillarsTabViewerProps {
  pillars: PillarItem[];
}

export const PillarsTabViewer: React.FC<PillarsTabViewerProps> = ({ pillars }) => {
  const [selectedPillarId, setSelectedPillarId] = useState(pillars[0]?.id || '');

  const selectedPillar = pillars.find(p => p.id === selectedPillarId) || pillars[0] || {
    id: 'Architecture Pillar',
    num: '01.1A',
    title: 'Core System Capability',
    subtitle: 'Domain Specialization',
    desc: 'Technical architecture capabilities and system performance optimizations.'
  };

  return (
    <div className="border border-border rounded-2xl p-4 sm:p-6 bg-white shadow-xs mb-12 sm:mb-16">
      <div className="flex gap-2 overflow-x-auto pb-4 border-b border-border/70 scrollbar-none">
        {pillars.map((p) => {
          const isActive = selectedPillarId === p.id || (!selectedPillarId && p === pillars[0]);
          return (
            <button
              key={p.id}
              onClick={() => setSelectedPillarId(p.id)}
              className={`relative shrink-0 px-3.5 py-2 text-xs uppercase tracking-wider rounded-lg border transition-all cursor-pointer whitespace-nowrap outline-none font-medium ${
                isActive 
                  ? 'bg-white text-text font-semibold border-border/80 shadow-2xs' 
                  : 'bg-transparent text-text-muted hover:text-text hover:bg-neutral-50 border-transparent'
              }`}
            >
              <span>
                {p.num} / {p.title}
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedPillar.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="mt-5 sm:mt-6"
        >
          <span className="text-xs text-text-muted uppercase tracking-wider block mb-1 font-semibold">
            {selectedPillar.subtitle}
          </span>
          <h4 className="text-base font-bold text-text uppercase mb-2 break-words">
            {selectedPillar.title}
          </h4>
          <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed max-w-3xl break-words">
            {selectedPillar.desc}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
