import React from 'react';

export function SkeletonBlock({ className = '' }) {
  return <div className={`animate-pulse bg-slate-200 rounded-md ${className}`} />;
}

export function SkeletonTable({ rows = 5, cols = 5 }) {
  return (
    <div className="card-base overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[700px]">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="px-6 py-3">
                <SkeletonBlock className="h-3 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r}>
              {Array.from({ length: cols }).map((_, c) => (
                <td key={c} className="px-6 py-4">
                  <SkeletonBlock className={`h-4 ${c === 0 ? 'w-32' : 'w-16'}`} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SkeletonKpiRow({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card-base p-6 flex items-center gap-4">
          <SkeletonBlock className="h-12 w-12 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <SkeletonBlock className="h-3 w-20" />
            <SkeletonBlock className="h-6 w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonChartGrid({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card-base p-6">
          <SkeletonBlock className="h-4 w-40 mb-4" />
          <SkeletonBlock className="h-56 w-full" />
        </div>
      ))}
    </div>
  );
}
