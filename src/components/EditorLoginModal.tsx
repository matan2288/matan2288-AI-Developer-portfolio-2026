import React, { useState, useEffect, useRef } from 'react';
import { Lock, X, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { verifyEditorCredentials, setEditorAuthenticated } from '../services/editorAuth';

interface EditorLoginModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

export const EditorLoginModal: React.FC<EditorLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const usernameInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (isOpen) {
			setUsername('');
			setPassword('');
			setError(null);
			setShowPassword(false);
			setTimeout(() => usernameInputRef.current?.focus(), 80);
		}
	}, [isOpen]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!isOpen) return;
			if (e.key === 'Escape') {
				onClose();
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setIsSubmitting(true);

		try {
			const isValid = await verifyEditorCredentials(username, password);
			if (isValid) {
				setEditorAuthenticated(true);
				setIsSubmitting(false);
				onSuccess();
			} else {
				setError('Invalid username or password. Check your environment configuration.');
				setIsSubmitting(false);
			}
		} catch {
			setError('Authentication request failed. Please try again.');
			setIsSubmitting(false);
		}
	};

	return (
		<div className="fixed inset-0 z-100 flex items-center justify-center p-4">
			{/* Backdrop */}
			<div className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

			{/* Modal Dialog */}
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby="editor-login-title"
				className="border-border animate-in fade-in zoom-in-95 relative z-10 w-full max-w-sm rounded-2xl border bg-white p-6 shadow-xl duration-150"
			>
				{/* Close Button */}
				<button
					onClick={onClose}
					className="text-text-subtle hover:text-text absolute top-4 right-4 cursor-pointer rounded-lg p-1 transition-colors hover:bg-neutral-100"
					aria-label="Close dialog"
				>
					<X size={18} />
				</button>

				{/* Header */}
				<div className="mb-5 flex flex-col items-center text-center">
					<div className="text-text mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100">
						<Lock size={18} />
					</div>
					<h2 id="editor-login-title" className="text-text text-base font-bold">
						Editor Authentication
					</h2>
					<p className="text-text-muted mt-1 text-xs leading-relaxed">
						Content management studio is password-protected. Enter your credentials to continue.
					</p>
				</div>

				{/* Error Alert */}
				{error && (
					<div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200/80 bg-red-50 p-2.5 text-xs text-red-700">
						<AlertCircle size={14} className="mt-0.5 shrink-0" />
						<span className="leading-snug">{error}</span>
					</div>
				)}

				{/* Form */}
				<form onSubmit={handleSubmit} className="space-y-3.5">
					<div>
						<label className="text-text mb-1 block text-[11px] font-semibold tracking-wider uppercase">
							Username
						</label>
						<input
							ref={usernameInputRef}
							type="text"
							required
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							placeholder="e.g. admin"
							autoComplete="username"
							className="border-border focus:ring-text focus:border-text w-full rounded-xl border bg-white px-3 py-2 text-xs transition-all focus:ring-1 focus:outline-none"
						/>
					</div>

					<div>
						<label className="text-text mb-1 block text-[11px] font-semibold tracking-wider uppercase">
							Password
						</label>
						<div className="relative">
							<input
								type={showPassword ? 'text' : 'password'}
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Enter password"
								autoComplete="current-password"
								className="border-border focus:ring-text focus:border-text w-full rounded-xl border bg-white px-3 py-2 pr-9 text-xs transition-all focus:ring-1 focus:outline-none"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="text-text-subtle hover:text-text absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer p-0.5"
								tabIndex={-1}
								aria-label={showPassword ? 'Hide password' : 'Show password'}
							>
								{showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
							</button>
						</div>
					</div>

					<div className="flex items-center justify-end gap-2 pt-2">
						<button
							type="button"
							onClick={onClose}
							className="text-text-muted hover:text-text cursor-pointer rounded-xl px-3.5 py-2 text-xs font-medium transition-colors hover:bg-neutral-100"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isSubmitting}
							className="bg-text cursor-pointer rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-neutral-800 disabled:opacity-60"
						>
							{isSubmitting ? 'Authenticating...' : 'Sign In'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
