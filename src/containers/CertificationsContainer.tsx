import React, { useState } from 'react';
import { ExternalLink, ArrowLeft, ArrowUpRight, X, Maximize2, Minimize2 } from 'lucide-react';
import { CertificationItem } from '../features/dashboard/types';

interface CertificationsContainerProps {
	certifications: CertificationItem[];
	onBackToPortfolio: () => void;
	developerName: string;
}

export const CertificationsContainer: React.FC<CertificationsContainerProps> = ({
	certifications,
	onBackToPortfolio,
}) => {
	const [selectedCert, setSelectedCert] = useState<CertificationItem | null>(null);
	const [isFullscreen, setIsFullscreen] = useState(false);

	// Convert Google Drive view or open URL to view-only preview URL for embed, or return static PDF url
	const getPreviewUrl = (url: string) => {
		if (!url) return '';
		if (url.startsWith('/certifications/')) {
			return url;
		}
		if (url.includes('/preview')) return url;
		const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
		if (fileIdMatch && fileIdMatch[1]) {
			return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
		}
		const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
		if (idMatch && idMatch[1]) {
			return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
		}
		return url;
	};

	// Helper to extract clean category label (e.g. AI, Security, Full Stack)
	const getCategoryLabel = (cert: CertificationItem) => {
		if (cert.category) return cert.category;
		if (cert.topic) {
			const topicLower = cert.topic.toLowerCase();
			if (topicLower.includes('genai') || topicLower.includes('ai')) return 'AI';
			if (topicLower.includes('security')) return 'Security';
			if (topicLower.includes('web') || topicLower.includes('full-stack')) return 'Full Stack';
			return cert.topic;
		}
		const titleLower = cert.title.toLowerCase();
		if (titleLower.includes('cursor') || titleLower.includes('genai') || titleLower.includes('ai')) return 'AI';
		if (titleLower.includes('security') || titleLower.includes('secure')) return 'Security';
		if (titleLower.includes('web') || titleLower.includes('bootcamp') || titleLower.includes('full-stack'))
			return 'Full Stack';
		return 'Engineering';
	};

	return (
		<div className="text-text min-h-screen bg-white pt-28 pb-24 font-sans antialiased sm:pt-32">
			<div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
				{/* Minimalist Header */}
				<div className="mb-12 sm:mb-16">
					<div>
						<h1 className="font-heading text-2xl leading-tight font-bold tracking-tight text-neutral-700 uppercase sm:text-3xl">
							Certifications
						</h1>
						<p className="text-text-muted mt-2 text-xs font-normal sm:text-sm">
							Official credentials & verified engineering documentation
						</p>
						<p className="text-text-muted/65 mt-2 text-[10px] font-normal tracking-wider select-none sm:text-[11px]">
							{certifications.length} {certifications.length === 1 ? 'certification' : 'certifications'}
						</p>
					</div>
				</div>

				{/* Full-width Certification Rows with Dividers */}
				<div className="divide-border/60 border-border/60 divide-y border-t border-b">
					{certifications.map((cert) => (
						<div
							key={cert.id}
							onClick={() => setSelectedCert(cert)}
							className="group flex w-full cursor-pointer items-center justify-between gap-6 px-1 py-3.5 transition-colors hover:bg-neutral-50/60 sm:gap-10 sm:px-2 sm:py-4"
						>
							{/* Category Label on the Left (Screenshot style) */}
							<div className="w-20 shrink-0 font-mono text-[11px] font-normal tracking-wider text-neutral-400 select-none sm:w-28 sm:text-xs">
								{getCategoryLabel(cert)}
							</div>

							{/* Certification Title & Issuer */}
							<div className="min-w-0 flex-1">
								<h3 className="text-text truncate text-sm font-semibold transition-colors group-hover:text-neutral-600 sm:text-base">
									{cert.title}
								</h3>
								<div className="text-text-muted mt-0.5 flex items-center gap-2 text-xs">
									<span>{cert.issuer}</span>
									{cert.issueDate && (
										<>
											<span className="text-neutral-300">•</span>
											<span>{cert.issueDate}</span>
										</>
									)}
								</div>
							</div>

							{/* View PDF Action Indicator */}
							<div className="text-text-muted group-hover:text-text flex shrink-0 items-center gap-1.5 text-xs font-medium transition-colors">
								<span className="hidden sm:inline">View PDF</span>
								<ArrowUpRight
									size={15}
									className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
								/>
							</div>
						</div>
					))}
				</div>

				{/* Bottom Back Navigation */}
				<div className="mt-12 flex items-center justify-start sm:mt-16">
					<button
						type="button"
						onClick={onBackToPortfolio}
						className="text-text-muted hover:text-text group inline-flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-xs transition-colors select-none"
					>
						<ArrowLeft
							size={13}
							className="group-hover:text-text text-neutral-400 transition-all group-hover:-translate-x-0.5"
						/>
						<span className="font-normal tracking-wide">Back to Portfolio</span>
					</button>
				</div>
			</div>

			{/* Show Google Drive & Local PDF Modal Viewer */}
			{selectedCert && (
				<div
					onClick={() => {
						setSelectedCert(null);
						setIsFullscreen(false);
					}}
					className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs duration-200 sm:p-8"
				>
					<div
						onClick={(e) => e.stopPropagation()}
						className={`border-border/60 flex flex-col overflow-hidden rounded-xl border bg-white shadow-2xl transition-all duration-300 ${
							isFullscreen
								? 'h-full max-h-none w-full max-w-none rounded-none'
								: 'max-h-[90vh] w-full max-w-3xl'
						}`}
					>
						{/* Modal Header */}
						<div className="border-border/60 flex shrink-0 items-center justify-between gap-4 border-b bg-white px-4 py-2">
							<div className="min-w-0">
								<h3 className="truncate text-xs font-medium text-neutral-400">{selectedCert.title}</h3>
							</div>

							<div className="flex shrink-0 items-center gap-0.5">
								<a
									href={getPreviewUrl(selectedCert.driveUrl)}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
									title="Open PDF in new tab"
								>
									<ExternalLink size={14} />
								</a>

								<button
									type="button"
									onClick={() => setIsFullscreen(!isFullscreen)}
									className="hidden cursor-pointer items-center rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 sm:inline-flex"
									title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
								>
									{isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
								</button>

								<button
									type="button"
									onClick={() => {
										setSelectedCert(null);
										setIsFullscreen(false);
									}}
									className="inline-flex cursor-pointer items-center rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
									title="Close Preview"
								>
									<X size={15} />
								</button>
							</div>
						</div>

						{/* Embedded PDF Viewer */}
						<div
							className={`relative flex flex-col overflow-hidden bg-neutral-100 ${
								isFullscreen ? 'flex-1' : 'aspect-[4/3] max-h-[calc(90vh-2.5rem)] w-full'
							}`}
						>
							<iframe
								src={getPreviewUrl(selectedCert.driveUrl)}
								title={`${selectedCert.title} - PDF Document`}
								className="h-full w-full border-0 bg-white"
								allow="autoplay"
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
