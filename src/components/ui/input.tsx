import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-[10px] font-mono text-text-muted uppercase block font-bold">
          {label}
        </label>
      )}
      <input
        className={`w-full bg-white border border-border rounded-lg px-4 py-2.5 text-xs text-text font-mono tracking-tight outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all ${className}`}
        {...props}
      />
      {error && <p className="text-[10px] font-mono text-red-500">{error}</p>}
    </div>
  );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-[10px] font-mono text-text-muted uppercase block font-bold">
          {label}
        </label>
      )}
      <textarea
        className={`w-full bg-white border border-border rounded-lg px-4 py-2.5 text-xs text-text font-sans outline-none focus:border-accent focus:ring-1 focus:ring-accent resize-none leading-relaxed transition-all ${className}`}
        {...props}
      />
      {error && <p className="text-[10px] font-mono text-red-500">{error}</p>}
    </div>
  );
};
