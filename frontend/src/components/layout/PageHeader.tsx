import React, { ReactNode } from 'react';
import { Badge } from '../common/Badge';

interface PageHeaderProps {
  badgeText?: string;
  badgeVariant?: 'default' | 'verity' | 'amber' | 'crimson' | 'sapphire' | 'slate';
  title: string;
  description?: string;
  actions?: ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  badgeText,
  badgeVariant = 'verity',
  title,
  description,
  actions,
}) => {
  return (
    <div className="mb-8 pb-6 border-b border-ink-200/80 flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in">
      <div className="space-y-2 max-w-3xl">
        {badgeText && (
          <Badge variant={badgeVariant} dot size="sm">
            {badgeText}
          </Badge>
        )}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900 tracking-tight font-sans">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-ink-600 leading-relaxed max-w-2xl font-sans">
            {description}
          </p>
        )}
      </div>

      {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
    </div>
  );
};
