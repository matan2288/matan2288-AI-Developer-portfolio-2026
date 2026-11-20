import React, { useState, useRef } from 'react';
import { Bot, ArrowRight, X, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePersonaChat } from '../context/PersonaChatContext';

export const AICommandBar: React.FC = () => {
	const { loading, lastQuestion, lastAnswer, handleSend, renderFormattedContent, clearChat } = usePersonaChat();

	const [inputQuery, setInputQuery] = useState('');
	const [copied, setCopied] = useState(false);
	const [showResponse, setShowResponse] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!inputQuery.trim() || loading) return;
		const query = inputQuery;
		setInputQuery('');
		setShowResponse(true);
		await handleSend(query);
	};

	const handleCopy = () => {
		if (!lastAnswer) return;
		navigator.clipboard.writeText(lastAnswer);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="w-full space-y-3">
			{/* Clean, Understated Command Bar */}
			<form
				onSubmit={onSubmit}
				className="border-border focus-within:border-text relative flex items-center rounded-xl border bg-white p-1.5 shadow-2xs transition-colors hover:border-neutral-400"
			>
				<div className="group text-text-muted relative flex shrink-0 cursor-help items-center bg-transparent pr-2 pl-3 select-none">
					<motion.div
						animate={
							loading
								? {
										scale: [1, 1.08, 1],
										opacity: [0.7, 1, 0.7],
									}
								: { scale: 1, opacity: 1 }
						}
						transition={
							loading
								? {
										duration: 1.2,
										repeat: Infinity,
										ease: 'easeInOut',
									}
								: { duration: 0.2 }
						}
						className="flex shrink-0 origin-center items-center justify-center bg-transparent"
					>
						<Bot
							size={16}
							className={`${
								loading ? 'text-text' : 'text-text-muted group-hover:text-text'
							} bg-transparent transition-colors`}
						/>
					</motion.div>
					{/* Tooltip: hovers from left on desktop so it doesn't cover input; floats above on mobile */}
					<div
						role="tooltip"
						className="pointer-events-none invisible absolute bottom-full left-0 z-50 mb-2.5 flex flex-col items-start opacity-0 transition-all duration-200 ease-out group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100 sm:top-1/2 sm:right-full sm:bottom-auto sm:left-auto sm:mr-3 sm:mb-0 sm:-translate-y-1/2"
					>
						<div className="text-text border-border relative w-64 max-w-[calc(100vw-3rem)] scale-95 rounded-xl border bg-white p-3 text-left shadow-md transition-all duration-200 ease-out group-focus-within:scale-100 group-hover:scale-100">
							<p className="text-text-muted m-0 text-left text-[11.5px] leading-relaxed font-normal">
								RAG Knowledge Base indexes public portfolio projects and professional experience. No
								Confidential data.
							</p>
							{/* Pointer Arrow on Desktop (pointing right) */}
							<div className="border-border absolute top-1/2 -right-1 hidden h-2 w-2 -translate-y-1/2 rotate-45 transform border-t border-r bg-white sm:block" />
							{/* Pointer Arrow on Mobile (pointing down) */}
							<div className="border-border absolute top-full left-4 -mt-1 block h-2 w-2 rotate-45 transform border-r border-b bg-white sm:hidden" />
						</div>
					</div>
				</div>

				<input
					ref={inputRef}
					type="text"
					value={inputQuery}
					onChange={(e) => setInputQuery(e.target.value)}
					disabled={loading}
					placeholder="Ask me anything about my experience, stack, or projects..."
					className="text-text placeholder:text-text-muted/70 w-full bg-transparent px-1 py-1.5 font-sans text-sm focus:outline-none"
				/>

				<button
					type="submit"
					disabled={!inputQuery.trim() || loading}
					className="text-text inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-white px-3.5 py-1.5 text-xs font-medium shadow-2xs transition-all outline-none hover:bg-neutral-50 focus:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400 disabled:active:scale-100"
				>
					<span>Ask</span>
					<ArrowRight size={12} />
				</button>
			</form>

			{/* Response Box with smooth height glide and balanced whitespace */}
			<AnimatePresence initial={false}>
				{(lastAnswer || loading) && showResponse && (
					<motion.div
						key="ai-command-response"
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
						className="flex flex-col items-center justify-center overflow-hidden text-center"
					>
						<div className="flex w-full flex-col items-center justify-center border-0 bg-transparent p-3.5 text-center text-xs text-neutral-400 shadow-none sm:p-4 sm:text-[13px]">
							<div className="border-border/40 flex w-full items-center justify-between gap-2 border-b pb-2">
								<span className="truncate text-[11px] font-medium text-neutral-400">
									{lastQuestion ? `"${lastQuestion}"` : 'AI Response'}
								</span>

								<div className="flex shrink-0 items-center gap-1">
									{lastAnswer && !loading && (
										<button
											type="button"
											onClick={handleCopy}
											className="cursor-pointer rounded p-1 text-neutral-400 transition-colors hover:text-neutral-600"
											title="Copy response"
										>
											{copied ? (
												<Check size={12} className="text-emerald-600" />
											) : (
												<Copy size={12} />
											)}
										</button>
									)}
									<button
										type="button"
										onClick={() => setShowResponse(false)}
										className="cursor-pointer rounded p-1 text-neutral-400 transition-colors hover:text-neutral-600"
										title="Dismiss"
									>
										<X size={13} />
									</button>
								</div>
							</div>

							<div className="w-full pt-2.5 text-center leading-relaxed text-neutral-400">
								{loading ? (
									<div className="flex items-center justify-center gap-2 py-1 text-xs text-neutral-400">
										<div className="flex items-center gap-1.5 px-0.5 py-0.5">
											<span
												className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400"
												style={{ animationDelay: '0ms' }}
											/>
											<span
												className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400"
												style={{ animationDelay: '150ms' }}
											/>
											<span
												className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400"
												style={{ animationDelay: '300ms' }}
											/>
										</div>
										<span className="font-sans text-[11px] text-neutral-400 select-none">
											Thinking...
										</span>
									</div>
								) : (
									<div className="w-full space-y-2 text-center">
										<div className="text-center leading-relaxed whitespace-pre-wrap text-neutral-400">
											{renderFormattedContent(lastAnswer || '')}
										</div>
										<div className="flex items-center justify-center pt-0.5">
											<button
												type="button"
												onClick={clearChat}
												className="cursor-pointer text-[11px] text-neutral-400 underline hover:text-neutral-600"
											>
												Clear
											</button>
										</div>
									</div>
								)}
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
