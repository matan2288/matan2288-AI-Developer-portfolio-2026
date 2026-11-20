import React, { useState } from 'react';
import { Check, ArrowRight, Mail, RotateCcw, ArrowUpRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Input, Textarea } from '../ui/input';

interface ContactFormProps {
	contactEmail?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({ contactEmail = 'matan2288@gmail.com' }) => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [msg, setMsg] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [mailtoUrl, setMailtoUrl] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!email.trim() || !msg.trim()) return;

		setIsSubmitting(true);

		const subject = encodeURIComponent(`Portfolio Inquiry from ${name.trim() || email.trim()}`);
		const bodyText = encodeURIComponent(
			`Name: ${name.trim() || 'N/A'}\nEmail: ${email.trim()}\n\nMessage:\n${msg.trim()}`
		);
		const link = `mailto:${contactEmail}?subject=${subject}&body=${bodyText}`;
		setMailtoUrl(link);

		// Save to local storage for persistent inquiry log
		try {
			const existing = JSON.parse(localStorage.getItem('portfolio_contact_inquiries') || '[]');
			existing.unshift({
				id: Date.now().toString(),
				name: name.trim(),
				email: email.trim(),
				message: msg.trim(),
				timestamp: new Date().toISOString(),
			});
			localStorage.setItem('portfolio_contact_inquiries', JSON.stringify(existing.slice(0, 50)));
		} catch {
			// Ignore storage errors
		}

		setTimeout(() => {
			setIsSubmitting(false);
			setSubmitted(true);

			// Trigger mailto intent
			try {
				const linkElem = document.createElement('a');
				linkElem.href = link;
				linkElem.style.display = 'none';
				document.body.appendChild(linkElem);
				linkElem.click();
				document.body.removeChild(linkElem);
			} catch {
				// Fallback handled by direct button in success state
			}
		}, 400);
	};

	const handleReset = () => {
		setSubmitted(false);
		setMsg('');
	};

	return (
		<div className="rounded-2xl bg-neutral-50/70 p-5 sm:p-6">
			{submitted ? (
				<div className="space-y-4 px-4 py-8 text-center">
					<div className="text-text mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100">
						<Check size={18} strokeWidth={2.2} />
					</div>

					<div className="space-y-1.5">
						<h5 className="text-text text-base font-semibold">Message Prepared</h5>
						<p className="text-text-muted mx-auto max-w-sm text-xs leading-relaxed sm:text-sm">
							Your inquiry has been opened in your email app. If it didn't open automatically, send
							directly to <span className="text-text font-semibold">{contactEmail}</span>.
						</p>
					</div>

					<div className="flex flex-wrap items-center justify-center gap-3 pt-2">
						<a
							href={mailtoUrl}
							className="text-text-muted hover:text-text inline-flex cursor-pointer items-center gap-1.5 rounded-lg border-none bg-neutral-100/70 px-3 py-1.5 text-[11px] font-medium transition-colors outline-none hover:bg-neutral-200/60"
						>
							<Mail size={12} className="text-text-muted" />
							<span>Open in Email App</span>
							<ArrowUpRight size={12} className="text-neutral-400" />
						</a>

						<button
							type="button"
							onClick={handleReset}
							className="text-text-muted hover:text-text inline-flex cursor-pointer items-center gap-1.5 rounded-lg border-none bg-neutral-100/70 px-3 py-1.5 text-[11px] font-medium transition-colors outline-none hover:bg-neutral-200/60"
						>
							<RotateCcw size={11} className="text-neutral-400" />
							<span>Send another</span>
						</button>
					</div>
				</div>
			) : (
				<form onSubmit={handleSubmit} className="space-y-3">
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						<Input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Name (Optional)"
						/>

						<Input
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Email address *"
						/>
					</div>

					<Textarea
						required
						rows={3}
						value={msg}
						onChange={(e) => setMsg(e.target.value)}
						placeholder="Write your message or inquiry..."
					/>

					<div className="flex justify-end pt-1">
						<button
							type="submit"
							disabled={isSubmitting}
							className="text-text-muted hover:text-text inline-flex cursor-pointer items-center gap-1.5 rounded-lg border-none bg-transparent px-2 py-1.5 text-[11px] font-medium transition-colors outline-none hover:bg-transparent"
						>
							{isSubmitting ? (
								<span>Preparing message...</span>
							) : (
								<>
									<span>Send Message</span>
									<ArrowRight size={11} />
								</>
							)}
						</button>
					</div>
				</form>
			)}
		</div>
	);
};
