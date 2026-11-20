import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ContactForm } from '../components/business/ContactForm';
import { PortfolioContent } from '../features/dashboard/types';

interface ContactContainerProps {
	portfolio: PortfolioContent;
}

export const ContactContainer: React.FC<ContactContainerProps> = ({ portfolio }) => {
	return (
		<section id="contact" className="border-border border-t bg-white py-14 md:py-20">
			<div className="mx-auto max-w-6xl px-6 md:px-8">
				<div className="mb-12 sm:mb-14">
					<h2 className="font-heading text-2xl leading-tight font-bold tracking-tight text-neutral-700 sm:text-3xl">
						Let's Talk
					</h2>
				</div>

				<div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
					{/* Left Column: Direct Coordinates */}
					<div className="space-y-6 lg:col-span-5">
						<div className="space-y-4">
							<div>
								<span className="text-text-muted mb-1 block text-xs font-semibold tracking-wider uppercase">
									Email
								</span>
								<a
									href={`mailto:${portfolio.contactEmail}`}
									className="text-text hover:text-text-muted inline-flex items-center gap-1.5 text-sm font-semibold break-all hover:underline sm:text-base sm:break-normal"
								>
									{portfolio.contactEmail}{' '}
									<ArrowUpRight size={16} className="text-text-muted shrink-0" />
								</a>
							</div>

							<div>
								<span className="text-text-muted mb-1 block text-xs font-semibold tracking-wider uppercase">
									LinkedIn
								</span>
								<a
									href={portfolio.linkedInUrl}
									target="_blank"
									rel="noreferrer"
									className="text-text hover:text-text-muted inline-flex items-center gap-1.5 text-sm font-semibold hover:underline sm:text-base"
								>
									Connect on LinkedIn <ArrowUpRight size={16} className="text-text-muted shrink-0" />
								</a>
							</div>
						</div>
					</div>

					{/* Right Column: Inquiries Form Component */}
					<div className="lg:col-span-7">
						<ContactForm contactEmail={portfolio.contactEmail} />
					</div>
				</div>
			</div>
		</section>
	);
};
