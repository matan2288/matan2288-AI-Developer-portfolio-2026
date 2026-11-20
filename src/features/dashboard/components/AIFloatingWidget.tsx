import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Minimize2, Send, RotateCcw, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePersonaChat } from '../context/PersonaChatContext';

interface AIFloatingWidgetProps {
	avatarUrl?: string;
	developerName?: string;
}

export const AIFloatingWidget: React.FC<AIFloatingWidgetProps> = ({
	avatarUrl = '/profile.png',
	developerName = "Hi I'm Matan",
}) => {
	const {
		messages,
		loading,
		isWidgetOpen,
		setIsWidgetOpen,
		isBlinking,
		hasEverOpened,
		handleSend,
		clearChat,
		suggestedQuestions,
		renderFormattedContent,
	} = usePersonaChat();

	const [inputText, setInputText] = useState('');
	const [showInquiries, setShowInquiries] = useState(false);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const prevMessagesCountRef = useRef(messages.length);

	// Blinking rule: stop permanently after opening for the first time, never blink if already open
	const shouldBlink = isBlinking && !isWidgetOpen && !hasEverOpened;

	// Ensure scroll is at the top when chat opens
	useEffect(() => {
		if (isWidgetOpen) {
			if (scrollContainerRef.current) {
				scrollContainerRef.current.scrollTop = 0;
			}
			const timer = setTimeout(() => {
				if (scrollContainerRef.current) {
					scrollContainerRef.current.scrollTop = 0;
				}
				inputRef.current?.focus();
			}, 50);
			return () => clearTimeout(timer);
		}
	}, [isWidgetOpen]);

	// Auto scroll to latest message only when a new message arrives or during loading
	useEffect(() => {
		if (isWidgetOpen) {
			if (messages.length > prevMessagesCountRef.current && prevMessagesCountRef.current > 0) {
				messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
			} else if (loading) {
				messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
			}
		}
		prevMessagesCountRef.current = messages.length;
	}, [messages, loading, isWidgetOpen]);

	const onSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!inputText.trim() || loading) return;
		const text = inputText;
		setInputText('');
		setShowInquiries(false);
		await handleSend(text);
	};

	const handleQuickQuestion = async (qText: string) => {
		if (loading) return;
		setInputText('');
		setShowInquiries(false);
		await handleSend(qText);
	};

	const toggleChat = () => {
		setIsWidgetOpen(!isWidgetOpen);
	};

	return (
		<div className="pointer-events-none fixed right-5 bottom-5 z-50 flex flex-col items-end sm:right-6 sm:bottom-6">
			{/* Floating Chat Modal Box with smooth spring transition and exit animation */}
			<AnimatePresence mode="wait">
				{isWidgetOpen && (
					<motion.div
						key="ai-floating-chat"
						initial={{ opacity: 0, scale: 0.92, y: 20, transformOrigin: 'bottom right' }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.93, y: 16, transition: { duration: 0.18, ease: 'easeInOut' } }}
						transition={{
							type: 'spring',
							stiffness: 360,
							damping: 27,
							mass: 0.8,
						}}
						className="border-border/80 pointer-events-auto mb-3.5 flex h-[520px] max-h-[80vh] w-[calc(100vw-2.5rem)] origin-bottom-right flex-col overflow-hidden rounded-2xl border bg-white shadow-xl sm:w-[380px] md:w-[400px]"
					>
						{/* Header */}
						<div className="border-border/80 flex shrink-0 items-center justify-between border-b bg-neutral-50/90 px-4 py-3">
							<div className="flex min-w-0 items-center gap-2.5">
								<div className="border-border relative h-8 w-8 shrink-0 overflow-hidden rounded-full border bg-neutral-200">
									<img
										src={avatarUrl}
										alt={developerName}
										referrerPolicy="no-referrer"
										onError={(e) => {
											const target = e.currentTarget;
											if (!target.src.includes('githubusercontent.com')) {
												target.src = 'https://avatars.githubusercontent.com/u/60103076?v=4';
											}
										}}
										className="h-full w-full object-cover"
									/>
									<span className="absolute right-0 bottom-0 h-2 w-2 rounded-full bg-emerald-500 ring-1 ring-white" />
								</div>
								<div className="min-w-0">
									<div className="text-text truncate text-xs font-semibold">{developerName}</div>
									<div className="text-text-muted text-[11px]">AI Digital Twin</div>
								</div>
							</div>

							<div className="flex items-center gap-1">
								<button
									type="button"
									onClick={clearChat}
									className="text-text-muted hover:text-text cursor-pointer rounded-lg p-1.5 transition-colors hover:bg-neutral-100"
									title="Reset conversation"
								>
									<RotateCcw size={13} />
								</button>
								<button
									type="button"
									onClick={() => setIsWidgetOpen(false)}
									className="text-text-muted hover:text-text cursor-pointer rounded-lg p-1.5 transition-colors hover:bg-neutral-100"
									title="Minimize chat"
								>
									<Minimize2 size={13} />
								</button>
								<button
									type="button"
									onClick={() => setIsWidgetOpen(false)}
									className="text-text-muted hover:text-text cursor-pointer rounded-lg p-1.5 transition-colors hover:bg-neutral-100"
									title="Close chat"
								>
									<X size={15} />
								</button>
							</div>
						</div>

						{/* Messages Feed */}
						<div
							ref={scrollContainerRef}
							className="flex-1 space-y-3.5 overflow-y-auto bg-white p-4 text-xs"
						>
							{messages.map((m, idx) => {
								const isModel = m.role === 'model';
								return (
									<React.Fragment key={m.id}>
										<motion.div
											initial={{ opacity: 0, y: 6 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.2 }}
											className={`flex flex-col ${isModel ? 'items-start' : 'items-end'} w-full space-y-1`}
										>
											<div
												className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed break-words ${
													isModel
														? 'text-text border-border rounded-tl-xs border bg-neutral-50'
														: 'bg-text rounded-tr-xs font-normal text-white shadow-2xs'
												}`}
											>
												<div className="whitespace-pre-wrap">
													{renderFormattedContent(m.text)}
												</div>
											</div>
											<span className="font-mono text-[10px] text-neutral-400 select-none">
												{m.timestamp}
											</span>
										</motion.div>

										{/* Inquiries Section - associated directly with the welcome greeting at idx 0 */}
										{idx === 0 && (
											<div className="space-y-2 pt-1 pb-1">
												{messages.length > 1 ? (
													<div className="flex items-center justify-between">
														<button
															type="button"
															onClick={() => setShowInquiries((prev) => !prev)}
															className="text-text-muted hover:text-text border-border/80 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border bg-neutral-50 px-2.5 py-1 text-[11px] font-medium transition-colors select-none hover:bg-neutral-100"
														>
															<span>
																{showInquiries
																	? 'Hide Inquiries'
																	: 'Suggested Inquiries (8)'}
															</span>
															<ChevronDown
																size={12}
																className={`transition-transform duration-200 ${showInquiries ? 'rotate-180' : ''}`}
															/>
														</button>
													</div>
												) : (
													<span className="text-text-muted block text-[10px] font-semibold tracking-wider uppercase">
														Quick Inquiries
													</span>
												)}

												<AnimatePresence initial={false}>
													{(messages.length <= 1 || showInquiries) && (
														<motion.div
															initial={
																messages.length > 1 ? { opacity: 0, height: 0 } : false
															}
															animate={{ opacity: 1, height: 'auto' }}
															exit={{ opacity: 0, height: 0 }}
															transition={{ duration: 0.2 }}
															className="overflow-hidden"
														>
															<div className="flex flex-wrap gap-1.5 pt-0.5">
																{suggestedQuestions.map((sq, sqIdx) => (
																	<button
																		key={sqIdx}
																		type="button"
																		onClick={() => handleQuickQuestion(sq.text)}
																		className="border-border/80 text-text cursor-pointer rounded-lg border bg-neutral-50 px-2.5 py-1 text-left text-[11px] transition-colors hover:border-neutral-300 hover:bg-neutral-100 active:scale-95"
																	>
																		{sq.label}
																	</button>
																))}
															</div>
														</motion.div>
													)}
												</AnimatePresence>
											</div>
										)}
									</React.Fragment>
								);
							})}

							{/* Loader: appears directly below the user's message */}
							{loading && (
								<div className="flex flex-col items-start space-y-1">
									<div className="text-text border-border flex items-center gap-1.5 rounded-2xl rounded-tl-xs border bg-neutral-50 px-4 py-2.5 text-xs">
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
								</div>
							)}
							<div ref={messagesEndRef} />
						</div>

						{/* Input Form */}
						<form
							onSubmit={onSendMessage}
							className="border-border flex shrink-0 items-center gap-2 border-t bg-white p-3"
						>
							<input
								ref={inputRef}
								type="text"
								value={inputText}
								onChange={(e) => setInputText(e.target.value)}
								disabled={loading}
								placeholder="Ask a question about Matan..."
								className="border-border focus:border-text text-text flex-1 rounded-xl border bg-neutral-50 px-3 py-2 font-sans text-xs transition-all outline-none focus:bg-white"
							/>
							<button
								type="submit"
								disabled={!inputText.trim() || loading}
								className="text-text border-border/80 shrink-0 cursor-pointer rounded-xl border bg-white p-2 shadow-2xs transition-all hover:border-neutral-300 hover:bg-neutral-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400"
								aria-label="Send query"
							>
								<Send size={13} />
							</button>
						</form>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Floating Trigger Button with Clear, UX-Friendly Sizing */}
			<motion.button
				type="button"
				whileHover={{ scale: 1.02 }}
				whileTap={{ scale: 0.98 }}
				transition={{ type: 'spring', stiffness: 400, damping: 25 }}
				onClick={toggleChat}
				className={`text-text pointer-events-auto relative inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full border bg-white px-4 transition-all sm:h-10.5 sm:px-4.5 ${
					shouldBlink
						? 'animate-minimal-blink border-neutral-300 font-medium'
						: 'border-border/80 font-medium shadow-sm hover:border-neutral-300 hover:bg-neutral-50 hover:shadow-md'
				}`}
				aria-label="Toggle AI Assistant"
			>
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
					<Bot size={15} className="text-text-muted bg-transparent" />
				</motion.div>
				<span className="text-text text-xs font-medium whitespace-nowrap select-none sm:text-[13px]">
					Ask AI Matan
				</span>
				{shouldBlink && (
					<span className="relative flex h-2 w-2 shrink-0 items-center justify-center">
						<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neutral-300 opacity-40" />
						<span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-neutral-400" />
					</span>
				)}
			</motion.button>
		</div>
	);
};
