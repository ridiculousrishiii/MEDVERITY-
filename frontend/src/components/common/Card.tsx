import React, { HTMLAttributes, ReactNode } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'subtle' | 'elevated' | 'bordered';
  interactive?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  interactive = false,
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-white border border-ink-200/80 shadow-soft',
    subtle: 'bg-background-subtle border border-ink-200/60',
    elevated: 'bg-white border border-ink-200/90 shadow-card',
    bordered: 'bg-transparent border border-dashed border-ink-300',
  };

  const interactiveStyles = interactive
    ? 'cursor-pointer hover:border-verity-400 hover:shadow-card hover:-translate-y-0.5 transition-all duration-200'
    : '';

  return (
    <div
      className={`rounded-xl p-6 ${variantStyles[variant]} ${interactiveStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
