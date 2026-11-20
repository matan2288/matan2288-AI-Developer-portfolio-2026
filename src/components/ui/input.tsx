import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
	return (
		<div className="w-full space-y-1.5">
			{label && (
				<label className="text-text-muted block text-xs font-semibold tracking-wide uppercase">{label}</label>
			)}
			<input
				className={`border-border text-text focus:border-text focus:ring-0.5 focus:ring-text w-full rounded-lg border bg-white px-4 py-2.5 font-sans text-sm transition-all outline-none ${className}`}
				{...props}
			/>
			{error && <p className="text-xs text-red-500">{error}</p>}
		</div>
	);
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string;
	error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, error, className = '', ...props }) => {
	return (
		<div className="w-full space-y-1.5">
			{label && (
				<label className="text-text-muted block text-xs font-semibold tracking-wide uppercase">{label}</label>
			)}
			<textarea
				className={`border-border text-text focus:border-text focus:ring-0.5 focus:ring-text w-full resize-none rounded-lg border bg-white px-4 py-2.5 font-sans text-sm leading-relaxed transition-all outline-none ${className}`}
				{...props}
			/>
			{error && <p className="text-xs text-red-500">{error}</p>}
		</div>
	);
};
