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
    <div className="border border-border rounded-2xl p-6 bg-white shadow-xs mb-16">
      <div className="flex gap-2 overflow-x-auto pb-4 border-b border-border scrollbar-none">
        {pillars.map((p) => {
          const isActive = selectedPillarId === p.id || (!selectedPillarId && p === pillars[0]);
          return (
            <button
              key={p.id}
              onClick={() => setSelectedPillarId(p.id)}
              className="relative px-3.5 py-2 font-mono text-[10px] uppercase tracking-wide rounded-lg border border-border/80 transition-colors cursor-pointer whitespace-nowrap outline-none bg-bg-alt/50 text-text-muted hover:text-text overflow-hidden"
            >
              {isActive && (
                <motion.div
                  layoutId="activePillarTab"
                  className="absolute inset-0 bg-accent"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className={`relative z-10 transition-colors ${isActive ? 'text-white font-bold' : ''}`}>
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
          className="mt-6"
        >
          <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider block mb-1">
            {selectedPillar.subtitle}
          </span>
          <h4 className="text-base font-bold text-text uppercase mb-2">
            {selectedPillar.title}
          </h4>
          <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed max-w-3xl">
            {selectedPillar.desc}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
