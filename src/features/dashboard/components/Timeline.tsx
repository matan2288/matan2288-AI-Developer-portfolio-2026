import React from 'react';
import { useTinaExperiences } from '../../../services/tinaContent';
import { ExperienceItem } from '../types';

interface TimelineItemProps {
	id: string;
	role: string;
	company: string;
	location?: string;
	period: string;
	bullets: string[];
	isLatest?: boolean;
	isFirst?: boolean;
	isLast?: boolean;
}

const TimelineCard: React.FC<TimelineItemProps> = ({
	id,
	role,
	company,
	location,
	period,
	bullets,
	isLatest,
	isFirst,
	isLast,
}) => {
	const isAmdocs = id.includes('amdocs') || company.toLowerCase().includes('amdocs');

	return (
		<div className="group relative pb-8 pl-7 last:pb-0 sm:pb-10 sm:pl-9 md:pl-0 lg:pb-12">
			{/* Mobile timeline connecting line */}
			<div className="pointer-events-none absolute top-0 bottom-0 left-[7px] sm:left-[8px] md:hidden">
				{!isFirst && <div className="absolute top-0 h-5 w-px bg-neutral-200 sm:h-6" />}
				{!isLast && <div className="absolute top-5 bottom-0 w-px bg-neutral-200 sm:top-6" />}
			</div>

			{/* Mobile Dot */}
			<div className="absolute top-5 left-0 z-10 flex items-center justify-center sm:top-6 md:hidden">
				{isLatest ? (
					<div className="flex h-4 w-4 items-center justify-center rounded-full border border-neutral-700 bg-white shadow-xs">
						<div className="h-1.5 w-1.5 rounded-full bg-neutral-900" />
					</div>
				) : (
					<div className="ml-[3px] h-2.5 w-2.5 rounded-full bg-neutral-400 ring-4 ring-white" />
				)}
			</div>

			{/* Desktop connecting line: continuous between dots */}
			<div className="pointer-events-none absolute top-0 bottom-0 left-[210px] hidden -translate-x-1/2 md:block">
				{!isFirst && <div className="absolute top-0 h-[36px] w-px bg-neutral-200 lg:h-[40px]" />}
				{!isLast && <div className="absolute top-[36px] bottom-0 w-px bg-neutral-200 lg:top-[40px]" />}
			</div>

			{/* Desktop Layout: Left Logo/Space + Center Line/Dot + Right Card */}
			<div className="items-start md:grid md:grid-cols-[180px_28px_1fr] md:gap-x-4">
				{/* Left Column: Logo and Location if available */}
				<div className="hidden flex-col items-center justify-start pt-2 md:flex">
					{isAmdocs && isFirst && (
						<div className="flex flex-col items-center">
							<img
								src="/amdocs-logo.png"
								alt="Amdocs"
								title="Amdocs"
								className="h-auto w-14 object-contain opacity-80 grayscale transition-all duration-300 select-none hover:opacity-100 hover:grayscale-0 sm:w-24"
							/>
							<span className="text-text-subtle/70 mt-2 text-center font-mono text-[10px] tracking-wider select-none">
								{location || 'Raanana, IL'}
							</span>
						</div>
					)}
				</div>

				{/* Center Column: Dot aligned horizontally with card header */}
				<div className="hidden items-start justify-center pt-[28px] md:flex lg:pt-[32px]">
					{isLatest ? (
						<div className="relative z-10 flex h-4 w-4 items-center justify-center rounded-full border border-neutral-700 bg-white shadow-xs transition-all duration-200 group-hover:ring-2 group-hover:ring-neutral-200">
							<div className="h-1.5 w-1.5 rounded-full bg-neutral-900" />
						</div>
					) : (
						<div className="relative z-10 mt-[3px] h-2.5 w-2.5 rounded-full bg-neutral-400 shadow-2xs ring-4 ring-white transition-all duration-200 group-hover:bg-neutral-600" />
					)}
				</div>

				{/* Right Column: Experience Card */}
				<div className="w-full">
					<div className="border-border/80 relative rounded-2xl border bg-[#FBFCFD]/65 p-5 shadow-2xs backdrop-blur-xs transition-colors duration-200 hover:border-neutral-400 sm:p-6 md:p-7 lg:p-8 xl:p-9">
						{/* Card Header */}
						<div className="mb-5 flex flex-col justify-between gap-2 sm:mb-6 sm:flex-row sm:items-baseline sm:gap-4 lg:mb-7">
							<div className="min-w-0 pr-2">
								<h3 className="text-sm leading-snug font-bold tracking-tight text-neutral-800 sm:text-base lg:text-[17px]">
									{role || company}
								</h3>
							</div>
							<span className="shrink-0 font-mono text-[11px] font-normal tracking-normal text-neutral-400 select-none sm:text-xs lg:text-[13px]">
								{period}
							</span>
						</div>

						{/* Detailed achievements bullets */}
						<ul className="space-y-2.5 sm:space-y-3 lg:space-y-3.5">
							{bullets.map((bullet, idx) => (
								<li
									key={idx}
									className="text-text-muted flex items-start gap-2.5 text-xs leading-relaxed sm:text-sm lg:gap-3 lg:text-[15px] lg:leading-normal"
								>
									<span className="text-text-subtle mt-0.5 text-xs select-none lg:mt-1 lg:text-sm">
										•
									</span>
									<span className="break-words">{bullet}</span>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

interface TimelineProps {
	experiences?: ExperienceItem[];
}

export const Timeline: React.FC<TimelineProps> = ({ experiences: customExperiences }) => {
	const hookExperiences = useTinaExperiences();
	const experiences = customExperiences || hookExperiences;

	return (
		<div className="mx-auto w-full max-w-5xl lg:max-w-6xl">
			<div className="relative">
				{experiences.map((exp, idx) => (
					<TimelineCard
						key={exp.id || exp.company}
						{...exp}
						isFirst={idx === 0}
						isLast={idx === experiences.length - 1}
					/>
				))}
			</div>
		</div>
	);
};
