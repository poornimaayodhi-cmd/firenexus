import React from 'react';
import { ShieldCheck, AlertCircle, Info } from 'lucide-react';

export const EmergencyBanner: React.FC = () => {
  return (
    <div className="bg-slate-900/90 border-b border-slate-800 px-3 sm:px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-300 overflow-hidden">
      <div className="flex items-center gap-2 truncate">
        <span className="inline-flex items-center gap-1 font-mono font-bold tracking-wider text-rose-400 shrink-0 text-[10px] sm:text-[11px]">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          SIMULATION
        </span>
        <span aria-hidden="true" className="text-slate-600">·</span>
        <span className="font-semibold text-slate-200 truncate text-[10px] sm:text-[11px]">
          <span className="hidden sm:inline">AI-ASSISTED / HUMAN-CONTROLLED / </span>DECISION SUPPORT
        </span>
      </div>

      <div className="hidden lg:flex items-center gap-2 text-slate-400 shrink-0 text-[11px]">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Trained personnel authorization required before life-safety dispatch actions.</span>
      </div>
    </div>
  );
};
