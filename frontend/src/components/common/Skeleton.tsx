import React, { HTMLAttributes } from 'react';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse bg-ink-200/70 rounded-md ${className}`}
      {...props}
    />
  );
};

export const VerificationSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 w-full animate-fade-in">
      {/* Verdict banner skeleton */}
      <div className="h-28 bg-ink-100 rounded-xl animate-pulse p-6 border border-ink-200 flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-48 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <Skeleton className="h-5 w-3/4" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="p-6 bg-white rounded-xl border border-ink-200 space-y-3">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
          <div className="p-6 bg-white rounded-xl border border-ink-200 space-y-4">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-6 bg-white rounded-xl border border-ink-200 space-y-4">
            <Skeleton className="h-5 w-32" />
            <div className="h-36 rounded-full w-36 mx-auto bg-ink-100" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
