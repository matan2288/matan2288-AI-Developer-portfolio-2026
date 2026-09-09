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
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 outline-none select-none cursor-pointer disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-white hover:bg-neutral-50 text-text font-medium border border-border/80 hover:border-neutral-300 shadow-2xs active:scale-[0.98]',
    secondary: 'bg-white hover:bg-neutral-50 text-text font-medium border border-border/80 hover:border-neutral-300 shadow-2xs active:scale-[0.98]',
    outline: 'bg-white border border-border/80 hover:border-neutral-300 text-text hover:bg-neutral-50 shadow-2xs active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-[10px]',
    md: 'px-4 py-2 text-xs',
    lg: 'px-5 py-2.5 text-xs font-semibold',
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
