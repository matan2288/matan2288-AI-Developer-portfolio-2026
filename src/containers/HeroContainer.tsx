import React from 'react';
import { ArrowRight, Mail, MessageSquare, Github, Linkedin, MapPin } from 'lucide-react';
import { AICommandBar } from '../features/dashboard';
import { PortfolioContent } from '../features/dashboard/types';

interface HeroContainerProps {
	portfolio: PortfolioContent;
	onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
	onOpenTinaAdmin: () => void;
}

export const HeroContainer: React.FC<HeroContainerProps> = ({ portfolio, onNavClick }) => {
	return (
		<section id="home" className="bg-white pt-24 pb-12 sm:pt-28 sm:pb-16">
			<div className="mx-auto w-full max-w-4xl px-4 sm:px-6 md:px-8 lg:max-w-5xl">
				{/* Centered Structured Hero Content */}
				<div className="flex flex-col items-center space-y-5 text-center sm:space-y-6">
					{/* Centered Profile Avatar (Editable only from Admin Platform) */}
					<div className="relative shrink-0">
						<div className="relative h-[12em] w-[12em] shrink-0 overflow-hidden rounded-3xl bg-neutral-100 shadow-2xs">
							<img
								src={portfolio.avatarUrl}
								alt={portfolio.developerName}
								referrerPolicy="no-referrer"
								onError={(e) => {
									const target = e.currentTarget;
									if (!target.src.includes('githubusercontent.com')) {
										target.src = 'https://avatars.githubusercontent.com/u/60103076?v=4';
									}
								}}
								className="h-full w-full object-cover object-top"
							/>
						</div>
					</div>

					{/* Name & Title & Location Stack */}
					<div className="mx-auto mb-0 max-w-xl space-y-1">
						<h1 className="font-heading text-2xl font-bold tracking-tight text-neutral-700 sm:text-3xl md:text-4xl">
							{portfolio.developerName}
						</h1>

						<p className="pt-0.5 text-base font-medium tracking-tight text-neutral-500 sm:text-lg">
							{portfolio.title}
						</p>

						<p className="flex items-center justify-center gap-1 pt-0.5 text-xs font-normal tracking-normal text-neutral-400 sm:text-[13px]">
							<MapPin className="h-3 w-3 shrink-0 text-neutral-400/80" />
							<span>{portfolio.location}</span>
						</p>
					</div>

					{/* Quantitative Stats Strip */}
					{portfolio.stats && portfolio.stats.length > 0 && (
						<div className="mx-auto my-1 flex w-full max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-3.5 py-3.5 text-center sm:gap-x-12 sm:py-4.5 md:gap-x-14">
							{portfolio.stats.map((stat, idx) => (
								<div key={idx} className="min-w-[80px] space-y-1 px-2 sm:min-w-[100px]">
									<span className="block text-base font-medium tracking-tight text-neutral-500 sm:text-lg">
										{stat.value}
									</span>
									<span className="block text-xs font-normal whitespace-nowrap text-neutral-400">
										{stat.label}
									</span>
								</div>
							))}
						</div>
					)}

					{/* Centered AI Command Bar / Chat */}
					<div className="mx-auto w-full max-w-2xl pt-1">
						<AICommandBar />
					</div>

					{/* Action Links (Below Chat) */}
					<div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-sm sm:gap-8">
						<a
							href="#experience"
							onClick={(e) => onNavClick(e, '#experience')}
							className="group inline-flex cursor-pointer items-center gap-1.5 font-medium text-neutral-900 transition-colors outline-none hover:text-neutral-600 focus:outline-none"
						>
							<span>View Experience</span>
							<ArrowRight
								size={14}
								className="text-neutral-500 transition-transform group-hover:translate-x-0.5"
							/>
						</a>

						<a
							href="#contact"
							onClick={(e) => onNavClick(e, '#contact')}
							className="inline-flex cursor-pointer items-center gap-1.5 font-medium text-neutral-600 transition-colors outline-none hover:text-neutral-900 focus:outline-none"
						>
							<MessageSquare size={15} className="text-neutral-500" />
							<span>Get in Touch</span>
						</a>
					</div>

					{/* Social Icons (Centered below action links) */}
					<div className="flex items-center justify-center gap-3 pt-1 text-neutral-500">
						<a
							href="https://github.com/matan2288"
							target="_blank"
							rel="noopener noreferrer"
							className="cursor-pointer p-1 text-neutral-500 transition-colors hover:text-neutral-900"
							aria-label="GitHub Profile"
						>
							<Github size={17} />
						</a>
						<a
							href={portfolio.linkedInUrl || 'https://www.linkedin.com/in/matan-elmaliach/'}
							target="_blank"
							rel="noopener noreferrer"
							className="cursor-pointer p-1 text-neutral-500 transition-colors hover:text-neutral-900"
							aria-label="LinkedIn Profile"
						>
							<Linkedin size={17} />
						</a>
						<a
							href={`mailto:${portfolio.contactEmail || 'matan2288@gmail.com'}`}
							className="cursor-pointer p-1 text-neutral-500 transition-colors hover:text-neutral-900"
							aria-label="Send Email"
						>
							<Mail size={17} />
						</a>
					</div>
				</div>
			</div>
		</section>
	);
};
