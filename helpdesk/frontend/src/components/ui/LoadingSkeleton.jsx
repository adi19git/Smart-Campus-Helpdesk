import React from 'react';

const LoadingSkeleton = ({ variant = 'card', count = 3 }) => {
  const pulse = 'animate-pulse bg-slate-200/80 dark:bg-slate-700/50 rounded-xl';

  if (variant === 'stats') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl ${pulse}`} />
            <div className="flex-1 space-y-2">
              <div className={`h-3 w-20 ${pulse}`} />
              <div className={`h-7 w-12 ${pulse}`} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className="space-y-3 p-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className={`h-5 w-12 ${pulse}`} />
            <div className={`h-5 flex-1 ${pulse}`} />
            <div className={`h-5 w-20 ${pulse}`} />
            <div className={`h-5 w-20 ${pulse}`} />
            <div className={`h-5 w-24 ${pulse}`} />
          </div>
        ))}
      </div>
    );
  }

  // card variant
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 space-y-3">
          <div className="flex justify-between">
            <div className={`h-4 w-16 ${pulse}`} />
            <div className={`h-4 w-12 ${pulse}`} />
          </div>
          <div className={`h-5 w-3/4 ${pulse}`} />
          <div className={`h-3 w-full ${pulse}`} />
          <div className="flex justify-between pt-2">
            <div className={`h-6 w-20 ${pulse}`} />
            <div className={`h-6 w-16 ${pulse}`} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
