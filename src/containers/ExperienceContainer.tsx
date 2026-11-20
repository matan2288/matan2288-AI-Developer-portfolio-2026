import React from 'react';
import { Timeline } from '../features/dashboard';
import { ExperienceItem } from '../features/dashboard/types';
import { useTinaExperiences } from '../services/tinaContent';

interface ExperienceContainerProps {
	experiences?: ExperienceItem[];
}

export const ExperienceContainer: React.FC<ExperienceContainerProps> = ({ experiences: customExperiences }) => {
	const hookExperiences = useTinaExperiences();
	const experiences = customExperiences || hookExperiences;
	const firstExp = experiences && experiences[0];
	const isAmdocs = firstExp
		? firstExp.id?.includes('amdocs') || firstExp.company?.toLowerCase().includes('amdocs')
		: true;
	const location = firstExp?.location || 'Raanana, IL';

	return (
		<section id="experience" className="border-border border-t bg-white py-14 md:py-20">
			<div className="mx-auto max-w-6xl px-6 md:px-8">
				<div className="mb-8 sm:mb-12 md:mb-16">
					<div>
						<h2 className="font-heading text-2xl leading-tight font-bold tracking-tight text-neutral-700 sm:text-3xl">
							Industry Experience
						</h2>
					</div>
					{/* Mobile view: Amdocs logo and location aligned below Industry Experience header and above the bullets */}
					{isAmdocs && (
						<div className="mt-4 flex items-center justify-between gap-4 pt-1 md:hidden">
							<img
								src="/amdocs-logo.png"
								alt="Amdocs"
								title="Amdocs"
								className="h-8 w-auto max-w-[120px] object-contain opacity-85 grayscale transition-all duration-300 select-none hover:opacity-100 hover:grayscale-0 sm:h-9"
							/>
							<span className="text-text-subtle/80 shrink-0 font-mono text-[11px] tracking-wider select-none">
								{location}
							</span>
						</div>
					)}
				</div>
				<Timeline experiences={experiences} />
			</div>
		</section>
	);
};
