import React from 'react';
import { SkillCategory } from '../../features/dashboard/types';

interface TechStackGridProps {
	skills: SkillCategory[];
}

export const TechStackGrid: React.FC<TechStackGridProps> = ({ skills }) => {
	return (
		<div className="border-border/60 border-t pt-10 sm:pt-12">
			<div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
				<div className="lg:col-span-4">
					<span className="text-text-muted mb-1 block text-xs font-semibold tracking-wider uppercase">
						Technical Toolsets
					</span>
					<h3 className="font-heading mb-2 text-xl font-bold tracking-tight break-words text-neutral-700 uppercase sm:mb-3">
						Core Tech Stack
					</h3>
					<p className="text-text-muted text-xs leading-relaxed">
						Technologies, frameworks, and tools used across production environments.
					</p>
				</div>
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:col-span-8">
					{skills.map((cat, idx) => (
						<div
							key={idx}
							className="border-border rounded-xl border bg-white p-4 transition-all hover:shadow-2xs sm:p-5"
						>
							<span className="text-text-muted mb-2.5 block text-xs font-bold tracking-wider break-words uppercase sm:mb-3">
								{cat.title}
							</span>
							<div className="flex flex-wrap gap-1.5">
								{cat.items.map((skill) => (
									<span
										key={skill}
										className="text-text border-border/80 cursor-default rounded-md border bg-white px-2.5 py-1 text-[11px] font-medium break-words shadow-2xs transition-colors select-none hover:border-neutral-300"
									>
										{skill}
									</span>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
