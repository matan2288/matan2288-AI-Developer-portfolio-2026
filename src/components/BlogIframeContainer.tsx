import React, { useState, useEffect, useRef } from 'react';
import {
	ArrowLeft,
	ExternalLink,
	RefreshCw,
	ShieldAlert,
	Globe,
	ArrowUpRight,
	ChevronUp,
	ChevronDown,
} from 'lucide-react';
import { useTinaPortfolio } from '../services/tinaContent';

interface BlogIframeContainerProps {
	onBackToPortfolio: () => void;
}

export const BlogIframeContainer: React.FC<BlogIframeContainerProps> = ({ onBackToPortfolio }) => {
	const [isLoaded, setIsLoaded] = useState<boolean>(false);
	const [hasTimedOut, setHasTimedOut] = useState<boolean>(false);
	const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
	const iframeRef = useRef<HTMLIFrameElement>(null);
	const portfolio = useTinaPortfolio();

	const DEFAULT_BLOG_URL = 'https://blog.google/technology/ai/';
	const rawUrl = portfolio.blogUrl?.trim() || DEFAULT_BLOG_URL;
	// Ensure valid HTTPS protocol
	const iframeUrl = rawUrl.startsWith('http://') || rawUrl.startsWith('https://') ? rawUrl : `https://${rawUrl}`;

	let displayHost = 'blog.google';
	try {
		displayHost = new URL(iframeUrl).hostname;
	} catch {
		displayHost = iframeUrl;
	}

	// Auto-detect iframes that fail or get blocked by X-Frame-Options / SAMEORIGIN
	useEffect(() => {
		setIsLoaded(false);
		setHasTimedOut(false);

		const timer = setTimeout(() => {
			setHasTimedOut(true);
		}, 2800);

		return () => clearTimeout(timer);
	}, [iframeUrl]);

	const handleRefresh = () => {
		setIsLoaded(false);
		setHasTimedOut(false);
		if (iframeRef.current) {
			iframeRef.current.src = iframeUrl;
		}
	};

	return (
		<div className="relative flex w-full flex-1 flex-col overflow-hidden bg-white">
			{/* Sleek Utility Bar (Collapsible) */}
			<div
				className={`border-border z-20 flex shrink-0 items-center justify-between gap-2 border-b bg-white transition-all duration-300 ease-in-out sm:gap-3 ${isCollapsed
						? 'pointer-events-none h-0 -translate-y-full overflow-hidden border-transparent px-3 py-0 opacity-0 sm:px-6'
						: 'h-12 translate-y-0 scrollbar-none overflow-x-auto px-3 opacity-100 sm:px-6'
					}`}
			>
				<div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
					<button
						onClick={onBackToPortfolio}
						className="hover:text-text-muted inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border-0 bg-transparent px-2 py-1 text-[11px] font-normal whitespace-nowrap text-neutral-400 transition-all outline-none hover:bg-neutral-100/70 sm:px-2.5"
					>
						<ArrowLeft size={13} className="shrink-0" />
						<span className="hidden sm:inline">Back to Portfolio</span>
						<span className="sm:hidden">Back</span>
					</button>

					<span className="text-border hidden text-xs sm:inline">|</span>

					{/* Current Blog URL Destination */}
					<div className="hidden max-w-sm items-center gap-1.5 truncate text-[11px] text-neutral-400 md:flex">
						<Globe size={12} className="shrink-0 text-neutral-400" />
						<span className="truncate font-mono text-[11px]">{displayHost}</span>
					</div>
				</div>

				<div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
					<button
						onClick={handleRefresh}
						title="Reload Blog"
						className="hover:text-text-muted shrink-0 cursor-pointer rounded-lg border-0 bg-transparent p-1.5 text-neutral-400 transition-all outline-none hover:bg-neutral-100/70"
					>
						<RefreshCw size={13} className={!isLoaded && !hasTimedOut ? 'animate-spin' : ''} />
					</button>

					<a
						href={iframeUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-text-muted group inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-lg border-0 bg-transparent px-2 py-1 text-[11px] font-normal whitespace-nowrap text-neutral-400 transition-all outline-none hover:bg-neutral-100/70 sm:px-2.5"
						title="Open blog in new window"
					>
						<span className="hidden sm:inline">Open Blog in Tab</span>
						<span className="sm:hidden">Open Tab</span>
						<ArrowUpRight
							size={13}
							className="group-hover:text-text-muted shrink-0 text-neutral-400 transition-colors"
						/>
					</a>

					<div className="bg-border/80 mx-0.5 h-4 w-px shrink-0" />

					{/* Collapse / Hide in one click */}
					<button
						onClick={() => setIsCollapsed(true)}
						title="Hide toolbar for full-screen reading"
						aria-label="Hide toolbar"
						className="hover:text-text-muted inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg border-0 bg-transparent p-1.5 text-[11px] font-normal whitespace-nowrap text-neutral-400 transition-all outline-none hover:bg-neutral-100/70 sm:px-2.5 sm:py-1"
					>
						<ChevronUp size={14} className="shrink-0" />
						<span className="hidden sm:inline">Hide Toolbar</span>
					</button>
				</div>
			</div>

			{/* Main Content Area */}
				<div className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden bg-neutral-50">
					{/* Show Toolbar Arrow attached to bottom-middle of navbar */}
					{isCollapsed && (
						<div className="animate-in fade-in absolute top-0 left-1/2 z-30 -translate-x-1/2 duration-200">
							<button
								onClick={() => setIsCollapsed(false)}
								title="Show toolbar"
								aria-label="Show toolbar"
								className="inline-flex cursor-pointer items-center justify-center border-0 bg-transparent px-4 pt-1 pb-1.5 text-neutral-400 opacity-55 shadow-none transition-all duration-200 outline-none hover:translate-y-0.5 hover:text-neutral-600 hover:opacity-100"
							>
								<ChevronDown size={18} />
							</button>
						</div>
					)}

					{/* Loading Spinner with early hint */}
					{!isLoaded && !hasTimedOut && (
							<div
								className={`absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-white/95 p-6 text-center backdrop-blur-xs ${isCollapsed ? 'pb-16' : 'pb-24'
									}`}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="32"
									height="32"
									viewBox="0 0 24 24"
									style={{ color: '#ededed' }}
									aria-hidden="true"
								>
									<rect width="10" height="10" x="1" y="1" fill="currentColor" rx="1">
										<animate
											id="SVG7WybndBt"
											fill="freeze"
											attributeName="x"
											begin="0;SVGo3aOUHlJ.end"
											dur="0.2s"
											values="1;13"
										/>
										<animate
											id="SVGVoKldbWM"
											fill="freeze"
											attributeName="y"
											begin="SVGFpk9ncYc.end"
											dur="0.2s"
											values="1;13"
										/>
										<animate
											id="SVGKsXgPbui"
											fill="freeze"
											attributeName="x"
											begin="SVGaI8owdNK.end"
											dur="0.2s"
											values="13;1"
										/>
										<animate
											id="SVG7JzAfdGT"
											fill="freeze"
											attributeName="y"
											begin="SVG28A4To9L.end"
											dur="0.2s"
											values="13;1"
										/>
									</rect>
									<rect width="10" height="10" x="1" y="13" fill="currentColor" rx="1">
										<animate
											id="SVGUiS2jeZq"
											fill="freeze"
											attributeName="y"
											begin="SVG7WybndBt.end"
											dur="0.2s"
											values="13;1"
										/>
										<animate
											id="SVGU0vu2GEM"
											fill="freeze"
											attributeName="x"
											begin="SVGVoKldbWM.end"
											dur="0.2s"
											values="1;13"
										/>
										<animate
											id="SVGOIboFeLf"
											fill="freeze"
											attributeName="y"
											begin="SVGKsXgPbui.end"
											dur="0.2s"
											values="1;13"
										/>
										<animate
											id="SVG14lAaeuv"
											fill="freeze"
											attributeName="x"
											begin="SVG7JzAfdGT.end"
											dur="0.2s"
											values="13;1"
										/>
									</rect>
									<rect width="10" height="10" x="13" y="13" fill="currentColor" rx="1">
										<animate
											id="SVGFpk9ncYc"
											fill="freeze"
											attributeName="x"
											begin="SVGUiS2jeZq.end"
											dur="0.2s"
											values="13;1"
										/>
										<animate
											id="SVGaI8owdNK"
											fill="freeze"
											attributeName="y"
											begin="SVGU0vu2GEM.end"
											dur="0.2s"
											values="13;1"
										/>
										<animate
											id="SVG28A4To9L"
											fill="freeze"
											attributeName="x"
											begin="SVGOIboFeLf.end"
											dur="0.2s"
											values="1;13"
										/>
										<animate
											id="SVGo3aOUHlJ"
											fill="freeze"
											attributeName="y"
											begin="SVG14lAaeuv.end"
											dur="0.2s"
											values="1;13"
										/>
									</rect>
								</svg>
								<p className="text-text-muted text-xs font-medium">Loading blog...</p>
								<a
									href={iframeUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="hover:text-text-muted inline-flex items-center gap-1.5 rounded-lg border-0 bg-transparent px-3 py-1 text-[11px] font-normal text-neutral-400 transition-all outline-none hover:bg-neutral-100/70"
								>
									<span>Open in New Window</span>
									<ExternalLink size={12} className="text-neutral-400" />
								</a>
							</div>
				)}

							{/* Fallback Banner for blocked iframe security policies (X-Frame-Options: SAMEORIGIN) */}
							{hasTimedOut && !isLoaded && (
									<div
										className={`animate-fadeIn absolute inset-0 z-20 flex flex-col items-center justify-center bg-white p-6 text-center ${isCollapsed ? 'pb-16' : 'pb-24'
											}`}
									>
										<div className="w-full max-w-md space-y-4 border-0 bg-transparent p-6 text-center shadow-none sm:p-8">
											<div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border-0 bg-transparent text-neutral-300">
												<Globe size={22} />
											</div>

											<div className="space-y-1">
												<h3 className="text-sm font-semibold tracking-tight text-neutral-700">
													External Engineering Blog
												</h3>
												<p className="font-mono text-[11px] leading-relaxed break-all text-neutral-400">
													{iframeUrl}
												</p>
											</div>

											<div className="space-y-1 rounded-xl border-0 bg-neutral-50/50 p-3 text-left text-[11px] text-neutral-500">
												<div className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-700">
													<ShieldAlert size={12} className="shrink-0 text-neutral-400" />
													<span>External Host Protection</span>
												</div>
												<p className="text-[11px] leading-relaxed text-neutral-400">
													External platforms restrict direct iframe embedding through security headers (
													<code className="rounded bg-neutral-100 px-1 py-0.5 text-[10px] text-neutral-600">
														X-Frame-Options
													</code>
													).
												</p>
											</div>

											<div className="flex flex-col items-center justify-center gap-2.5 pt-2 sm:flex-row">
												<a
													href={iframeUrl}
													target="_blank"
													rel="noopener noreferrer"
													className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-0 bg-neutral-100/70 px-3.5 py-2 text-xs font-medium text-neutral-700 transition-colors outline-none hover:bg-neutral-200/60 sm:w-auto"
												>
													<span>Open Blog in New Tab</span>
													<ExternalLink size={12} className="text-neutral-500" />
												</a>

												<button
													type="button"
													onClick={onBackToPortfolio}
													className="w-full cursor-pointer rounded-xl border-0 bg-transparent px-3.5 py-2 text-[11px] font-normal text-neutral-400 transition-colors outline-none hover:bg-neutral-100/70 hover:text-neutral-700 sm:w-auto"
												>
													Back to Portfolio
												</button>
											</div>
										</div>
									</div>
				)}

									{/* The Embedded Frame */}
									<iframe
										ref={iframeRef}
										src={iframeUrl}
										title="Engineering Blog"
										className="block h-full w-full flex-1 border-0"
										onLoad={() => setIsLoaded(true)}
									/>
								</div>
		</div>
					);
};

					export default BlogIframeContainer;
