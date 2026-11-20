import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PillarItem } from '../../features/dashboard/types';

interface PillarsTabViewerProps {
	pillars: PillarItem[];
}

export const PillarsTabViewer: React.FC<PillarsTabViewerProps> = ({ pillars }) => {
	const [selectedPillarId, setSelectedPillarId] = useState(pillars[0]?.id || '');

	const selectedPillar = pillars.find((p) => p.id === selectedPillarId) ||
		pillars[0] || {
			id: 'Architecture Pillar',
			num: '01.1A',
			title: 'Core System Capability',
			subtitle: 'Domain Specialization',
			desc: 'Technical architecture capabilities and system performance optimizations.',
		};

	return (
		<div className="border-border mb-12 rounded-2xl border bg-white/70 p-4 shadow-xs backdrop-blur-xs sm:mb-16 sm:p-6">
			<div className="border-border/70 flex scrollbar-none gap-2 overflow-x-auto border-b pb-4">
				{pillars.map((p) => {
					const isActive = selectedPillarId === p.id || (!selectedPillarId && p === pillars[0]);
					return (
						<button
							key={p.id}
							onClick={() => setSelectedPillarId(p.id)}
							className={`relative shrink-0 cursor-pointer rounded-lg border px-3.5 py-2 text-xs font-medium tracking-wider whitespace-nowrap uppercase transition-all outline-none ${
								isActive
									? 'text-text border-border/80 bg-white font-semibold shadow-2xs'
									: 'text-text-muted hover:text-text border-transparent bg-transparent hover:bg-neutral-50'
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
					<span className="text-text-muted mb-1 block text-xs font-semibold tracking-wider uppercase">
						{selectedPillar.subtitle}
					</span>
					<h4 className="font-heading mb-2 text-base font-bold break-words text-neutral-700 uppercase">
						{selectedPillar.title}
					</h4>
					<p className="max-w-3xl text-xs leading-relaxed break-words text-[#4B5563] sm:text-sm">
						{selectedPillar.desc}
					</p>
				</motion.div>
			</AnimatePresence>
		</div>
	);
};
