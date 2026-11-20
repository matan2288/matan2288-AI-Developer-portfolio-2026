import React from 'react';

interface SectionLabelProps {
	num: string;
	title: string;
	className?: string;
}

export const SectionLabel: React.FC<SectionLabelProps> = ({ num, title, className = '' }) => {
	return (
		<div
			className={`text-text-muted mb-2.5 flex items-center gap-2 font-mono text-[11px] tracking-widest select-none ${className}`}
		>
			<span className="text-text font-semibold">{num}</span>
			<span className="font-light text-neutral-300">/</span>
			<span className="text-text-muted font-medium tracking-[0.16em] uppercase">{title}</span>
		</div>
	);
};
