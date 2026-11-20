import React from 'react';

interface AboutContainerProps {
	title?: string;
	content?: string;
}

export const AboutContainer: React.FC<AboutContainerProps> = ({
	title = 'Where Software Engineering Meets AI',
	content = 'I’m a AI-Driven Software Engineer with about ~5 years of experience building digital products, scalable applications, and user-focused experiences. My background spans frontend engineering, backend development, and enterprise digital platforms. Today, I’m expanding that foundation into AI engineering exploring LLMs, intelligent systems, and agent-based workflows to build smarter, more capable software.',
}) => {
	return (
		<section id="about" className="border-border border-t bg-[#FBFCFD] py-16 md:py-24">
			<div className="mx-auto max-w-6xl px-6 md:px-8">
				<div className="grid grid-cols-1 items-start gap-10 sm:gap-12 lg:grid-cols-12 lg:gap-16">
					{/* Title Aside */}
					<div className="lg:col-span-5">
						<h2 className="font-heading text-2xl leading-tight font-bold tracking-tight text-neutral-700 sm:text-3xl">
							{title}
						</h2>
					</div>

					{/* Description with smaller, dimmed minimalist font */}
					<div className="lg:col-span-7">
						<p className="text-sm leading-relaxed font-normal tracking-normal text-neutral-500 sm:text-base">
							{content}
						</p>
					</div>
				</div>
			</div>
		</section>
	);
};
