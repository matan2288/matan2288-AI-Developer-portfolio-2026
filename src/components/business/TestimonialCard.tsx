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
			className="border-border/80 group flex h-auto min-h-[310px] flex-col justify-between self-start rounded-2xl border bg-white/70 px-[30px] py-[25px] shadow-2xs backdrop-blur-xs transition-colors duration-200 hover:shadow-xs"
		>
			{/* Quote text with smooth height layout animation and overflow protection */}
			<motion.div layout="position" className="mb-6 flex flex-1 flex-col justify-start">
				<div>
					<motion.p
						ref={textRef}
						layout="position"
						transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
						onClick={() => {
							if (!isExpanded && canExpand) {
								handleToggle();
							}
						}}
						className={`text-text-muted text-[15px] leading-[24px] font-normal tracking-[0.2px] transition-opacity duration-300 [word-spacing:0.1px] ${
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
							className="group/btn inline-flex cursor-pointer items-center gap-1 text-xs font-normal text-neutral-400 transition-colors hover:text-neutral-800"
							title={isExpanded ? 'Show less' : 'Show full recommendation'}
						>
							{!isExpanded ? (
								<>
									<span className="font-mono text-xs text-neutral-400 transition-colors group-hover/btn:text-neutral-800">
										...
									</span>
									<span className="text-[11px] text-neutral-400 underline decoration-neutral-200 underline-offset-4 transition-colors group-hover/btn:text-neutral-800 group-hover/btn:decoration-neutral-400">
										more
									</span>
								</>
							) : (
								<span className="text-[11px] text-neutral-400 underline decoration-neutral-200 underline-offset-4 transition-colors group-hover/btn:text-neutral-800 group-hover/btn:decoration-neutral-400">
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
				className="border-border/60 relative z-10 mt-auto flex items-center justify-between gap-3 border-t bg-white/60 pt-4 backdrop-blur-xs"
			>
				<div className="flex min-w-0 items-center gap-3">
					<div className="relative shrink-0">
						{hasAvatar ? (
							<img
								src={recommendation.avatarUrl}
								alt={recommendation.author}
								onError={() => setImageError(true)}
								className="border-border/80 h-10 w-10 rounded-full border bg-neutral-100 object-cover shadow-2xs"
								referrerPolicy="no-referrer"
							/>
						) : (
							<div className="border-border/80 text-text flex h-10 w-10 items-center justify-center rounded-full border bg-neutral-100 text-xs font-semibold tracking-tight shadow-2xs">
								{getInitials(recommendation.author)}
							</div>
						)}
					</div>

					<div className="min-w-0">
						<h5 className="text-text truncate text-[14px] font-semibold">{recommendation.author}</h5>
						<div className="text-text-muted mt-0.5 truncate text-[11px]">
							{recommendation.role} ·{' '}
							<span className="text-text font-medium">{recommendation.company}</span>
						</div>
					</div>
				</div>

				{recommendation.linkedInUrl && (
					<a
						href={recommendation.linkedInUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="text-text-subtle shrink-0 cursor-pointer rounded-lg p-1 transition-colors hover:bg-[#0A66C2]/10 hover:text-[#0A66C2]"
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
