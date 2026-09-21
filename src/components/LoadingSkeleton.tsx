import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-8 animate-pulse" aria-label="Loading weather intelligence data">
      {/* Loading banner */}
      <div className="flex items-center justify-center gap-3 p-4 bg-sky-50 border border-sky-100 rounded-2xl text-sky-700 text-sm font-medium">
        <Loader2 className="w-5 h-5 animate-spin text-sky-600" />
        <span>Fetching real-time meteorological observations and 7-day projections...</span>
      </div>

      {/* Hero card skeleton */}
      <div className="w-full h-80 bg-slate-200 rounded-3xl" />

      {/* Recommendations skeleton */}
      <div className="space-y-3">
        <div className="h-6 w-56 bg-slate-200 rounded-md" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-36 bg-slate-200 rounded-2xl" />
          <div className="h-36 bg-slate-200 rounded-2xl" />
          <div className="h-36 bg-slate-200 rounded-2xl" />
        </div>
      </div>

      {/* 7-day forecast skeleton */}
      <div className="space-y-3">
        <div className="h-6 w-48 bg-slate-200 rounded-md" />
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-44 bg-slate-200 rounded-2xl" />
          ))}
        </div>
      </div>

      {/* Chart skeleton */}
      <div className="h-72 bg-slate-200 rounded-3xl" />
    </div>
  );
};
