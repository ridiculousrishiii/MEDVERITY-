import React, { ReactNode } from 'react';
import { VerdictType } from '../../types';

export interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'verity' | 'amber' | 'crimson' | 'sapphire' | 'slate' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium tracking-tight',
    md: 'text-xs px-2.5 py-1 font-medium',
    lg: 'text-sm px-3 py-1.5 font-semibold',
  };

  const variantStyles = {
    default: 'bg-ink-100 text-ink-800 border border-ink-200',
    verity: 'bg-verity-50 text-verity-800 border border-verity-200',
    amber: 'bg-amber-50 text-amber-800 border border-amber-200',
    crimson: 'bg-rose-50 text-rose-800 border border-rose-200',
    sapphire: 'bg-sapphire-50 text-sapphire-800 border border-sapphire-200',
    slate: 'bg-slate-100 text-slate-700 border border-slate-200',
    outline: 'bg-transparent text-ink-700 border border-ink-300',
  };

  const dotStyles = {
    default: 'bg-ink-500',
    verity: 'bg-verity-500 animate-pulse',
    amber: 'bg-amber-500',
    crimson: 'bg-rose-500',
    sapphire: 'bg-blue-500',
    slate: 'bg-slate-500',
    outline: 'bg-ink-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-mono transition-colors ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[variant]}`} />}
      {children}
    </span>
  );
};

export const VerdictBadge: React.FC<{
  verdict: VerdictType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ verdict, size = 'md', className = '' }) => {
  switch (verdict) {
    case 'confirmed_true':
      return (
        <Badge variant="verity" size={size} dot className={className}>
          VERIFIED SCIENTIFIC FACT
        </Badge>
      );
    case 'false_debunked':
      return (
        <Badge variant="crimson" size={size} dot className={className}>
          DEBUNKED / FALSE
        </Badge>
      );
    case 'misleading_nuanced':
      return (
        <Badge variant="amber" size={size} dot className={className}>
          MISLEADING / NUANCED
        </Badge>
      );
    case 'unproven_inconclusive':
    default:
      return (
        <Badge variant="slate" size={size} dot className={className}>
          UNPROVEN / INCONCLUSIVE
        </Badge>
      );
  }
};
