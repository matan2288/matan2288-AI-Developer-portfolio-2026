import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-mono uppercase tracking-wider rounded-lg transition-all duration-200 outline-none select-none cursor-pointer disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-accent hover:bg-accent-hover text-white shadow-sm',
    secondary: 'bg-bg-alt hover:bg-neutral-100 text-text-muted hover:text-text border border-border',
    outline: 'bg-white border border-border hover:border-text text-text-muted hover:text-text',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-[10px]',
    md: 'px-5 py-2.5 text-xs',
    lg: 'px-6 py-3 text-xs font-bold',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
