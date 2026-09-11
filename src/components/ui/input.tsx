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
        <label className="text-xs text-text-muted uppercase block font-semibold tracking-wide">
          {label}
        </label>
      )}
      <input
        className={`w-full bg-white border border-border rounded-lg px-4 py-2.5 text-sm text-text font-sans outline-none focus:border-text focus:ring-0.5 focus:ring-text transition-all ${className}`}
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

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-xs text-text-muted uppercase block font-semibold tracking-wide">
          {label}
        </label>
      )}
      <textarea
        className={`w-full bg-white border border-border rounded-lg px-4 py-2.5 text-sm text-text font-sans outline-none focus:border-text focus:ring-0.5 focus:ring-text resize-none leading-relaxed transition-all ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
