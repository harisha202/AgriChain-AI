import React from 'react';
import { HardHat, Rocket } from 'lucide-react';

export default function ComingSoon({ title, description }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-full">
      <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-6">
        <Rocket className="w-12 h-12" />
      </div>
      <h2 className="text-3xl font-bold text-slate-900 mb-3">{title}</h2>
      <p className="text-slate-500 max-w-md text-lg mx-auto">
        {description || "We are currently building out this module. It will be available in the next deployment."}
      </p>
      
      <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-700 text-sm font-medium border border-amber-200">
        <HardHat className="w-4 h-4" />
        Under Construction
      </div>
    </div>
  );
}
