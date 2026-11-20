import React from 'react';
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';

interface FooterContainerProps {
	developerName?: string;
	contactEmail?: string;
	linkedInUrl?: string;
}

export const FooterContainer: React.FC<FooterContainerProps> = ({
	contactEmail = 'matan2288@gmail.com',
	linkedInUrl = 'https://www.linkedin.com/in/matan-elmaliach/',
}) => {
	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<footer className="border-t border-neutral-200/80 bg-white py-8 sm:py-10">
			<div className="mx-auto flex max-w-6xl items-center justify-center px-6">
				<div className="flex items-center gap-5 text-neutral-500 sm:gap-6">
					<a
						href="https://github.com/matan2288"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex cursor-pointer items-center justify-center p-1 text-neutral-500 transition-colors hover:text-neutral-900"
						aria-label="GitHub Profile"
					>
						<Github size={16} />
					</a>
					<a
						href={linkedInUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex cursor-pointer items-center justify-center p-1 text-neutral-500 transition-colors hover:text-neutral-900"
						aria-label="LinkedIn Profile"
					>
						<Linkedin size={16} />
					</a>
					<a
						href={`mailto:${contactEmail}`}
						className="inline-flex cursor-pointer items-center justify-center p-1 text-neutral-500 transition-colors hover:text-neutral-900"
						aria-label="Send Email"
					>
						<Mail size={16} />
					</a>

					{/* Vertical divider */}
					<div className="mx-1 h-4 w-px bg-neutral-300 sm:mx-1.5" />

					{/* Back to top */}
					<button
						onClick={scrollToTop}
						type="button"
						className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-neutral-500 transition-colors hover:text-neutral-900 sm:text-sm"
						aria-label="Back to top"
					>
						<span>Top</span>
						<ArrowUp size={13} className="stroke-[2.2]" />
					</button>
				</div>
			</div>
		</footer>
	);
};
