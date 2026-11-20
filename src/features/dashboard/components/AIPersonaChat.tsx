import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, RotateCcw } from 'lucide-react';
import { usePersonaChat } from '../context/PersonaChatContext';

export const AIPersonaChat: React.FC = () => {
	const { messages, loading, handleSend, clearChat, suggestedQuestions, renderFormattedContent } = usePersonaChat();

	const [input, setInput] = useState('');
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.scrollTo({
				top: containerRef.current.scrollHeight,
				behavior: 'smooth',
			});
		}
	}, [messages, loading]);

	const onFormSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim() || loading) return;
		const text = input;
		setInput('');
		await handleSend(text);
	};

	return (
		<div className="border-border/80 flex flex-col overflow-hidden rounded-2xl border bg-white shadow-2xs">
			{/* Sandbox Header */}
			<div className="border-border/80 flex items-center justify-between border-b bg-neutral-50/70 px-4 py-2.5">
				<div className="flex items-center gap-2">
					<div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
					<span className="text-text text-xs font-bold tracking-wider uppercase">
						Interactive Assistant Twin
					</span>
				</div>
				<div className="flex items-center gap-1.5">
					<button
						type="button"
						onClick={clearChat}
						className="text-text-muted hover:text-text cursor-pointer rounded p-1 transition-colors"
						title="Reset Chat"
					>
						<RotateCcw size={12} />
					</button>
					<Sparkles size={12} className="text-text-muted" />
				</div>
			</div>

			{/* Message Feed */}
			<div
				ref={containerRef}
				className="border-border h-[230px] space-y-3.5 overflow-y-auto border-b bg-white p-3.5 sm:h-[270px] sm:space-y-4 sm:p-5"
			>
				{messages.map((m) => {
					const isModel = m.role === 'model';
					return (
						<div
							key={m.id}
							className={`flex flex-col ${isModel ? 'items-start' : 'items-end'} w-full space-y-1`}
						>
							<div
								className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed break-words sm:max-w-[85%] sm:px-4 ${
									isModel
										? 'text-text border-border/80 rounded-tl-none border bg-neutral-50/80'
										: 'text-text border-border/80 rounded-tr-none border bg-white font-medium shadow-2xs'
								}`}
							>
								<div className="break-words whitespace-pre-wrap">{renderFormattedContent(m.text)}</div>
							</div>
							<span className="font-mono text-[10px] text-neutral-400 select-none">{m.timestamp}</span>
						</div>
					);
				})}
				{loading && (
					<div className="flex flex-col items-start space-y-1">
						<div className="text-text border-border/80 flex items-center gap-1.5 rounded-2xl rounded-tl-none border bg-neutral-50/80 px-4 py-2.5 text-xs">
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
			</div>

			{/* Suggested Questions Quick Grid */}
			<div className="border-border/80 grid grid-cols-1 gap-1.5 border-b bg-neutral-50/50 p-2.5 sm:grid-cols-2 sm:gap-2 sm:p-3">
				{suggestedQuestions.map((q, idx) => (
					<button
						key={idx}
						type="button"
						onClick={() => handleSend(q.text)}
						disabled={loading}
						className="border-border/80 text-text-muted hover:text-text cursor-pointer truncate rounded-lg border bg-white px-2.5 py-1.5 text-left text-[10px] leading-tight font-medium shadow-2xs transition-all hover:border-neutral-300 hover:bg-neutral-50 disabled:opacity-50 sm:text-[11px]"
						title={q.text}
					>
						{q.label}
					</button>
				))}
			</div>

			{/* Input Form */}
			<form onSubmit={onFormSubmit} className="flex items-center gap-2 bg-white p-3">
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					disabled={loading}
					placeholder="Ask a question..."
					className="border-border/80 text-text flex-1 rounded-lg border bg-white px-3.5 py-2 font-sans text-xs transition-all outline-none focus:border-neutral-400 disabled:opacity-50"
				/>
				<button
					type="submit"
					disabled={!input.trim() || loading}
					className="text-text border-border/80 cursor-pointer rounded-lg border bg-white p-2 shadow-2xs transition-all hover:border-neutral-300 hover:bg-neutral-50 disabled:opacity-40"
					aria-label="Send message"
				>
					<Send size={13} className="text-text-muted" />
				</button>
			</form>
		</div>
	);
};
