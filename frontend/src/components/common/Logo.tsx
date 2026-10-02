import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  to?: string;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showSubtitle = true,
  to = '/',
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  const content = (
    <div className={`flex items-center gap-2.5 group select-none ${className}`}>
      {/* Precision Geometric Medical Shield Icon */}
      <div
        className={`${iconSizes[size]} rounded-xl bg-ink-900 border border-ink-800 flex items-center justify-center relative overflow-hidden shadow-sm transition-transform duration-300 group-hover:scale-105`}
      >
        {/* Subtle grid lines within shield */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#10B981_1px,transparent_1px),linear-gradient(to_bottom,#10B981_1px,transparent_1px)] bg-[size:6px_6px]" />
        
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-5 h-5 text-verity-400 relative z-10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Medical Cross with pulse notch */}
          <path d="M12 4v16m-6-8h12" stroke="#10B981" strokeWidth="2.2" />
          <circle cx="16" cy="8" r="2" fill="#34D399" />
        </svg>
      </div>

      <div className="flex flex-col">
        <span
          className={`${titleSizes[size]} font-extrabold tracking-tight text-ink-900 leading-none group-hover:text-verity-700 transition-colors font-sans`}
        >
          MED<span className="text-verity-600">VERITY</span>
        </span>
        {showSubtitle && (
          <span className="text-[9px] font-mono font-semibold tracking-widest text-ink-500 uppercase mt-0.5">
            EVIDENCE INTELLIGENCE
          </span>
        )}
      </div>
    </div>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }
  return content;
};
