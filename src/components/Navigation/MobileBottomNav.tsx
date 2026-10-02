import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { ViewNavigation } from '../../types';
import {
  Radio,
  Box,
  Eye,
  Crosshair,
  Flame,
  ShieldAlert,
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentView, setCurrentView } = useSimulation();

  const navItems: { id: ViewNavigation; label: string; icon: React.ReactNode }[] = [
    { id: 'live_scene', label: 'Command', icon: <Radio className="w-5 h-5" /> },
    { id: '3d_environment', label: '3D Twin', icon: <Box className="w-5 h-5" /> },
    { id: 'detection', label: 'Detect', icon: <Eye className="w-5 h-5" /> },
    { id: 'tracking', label: 'Track', icon: <Crosshair className="w-5 h-5" /> },
    { id: 'incidents', label: 'Incidents', icon: <Flame className="w-5 h-5" /> },
    { id: 'response', label: 'Response', icon: <ShieldAlert className="w-5 h-5" /> },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] px-1 py-1"
      style={{ paddingBottom: 'max(0.25rem, env(safe-area-inset-bottom))' }}
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex-1 flex flex-col items-center justify-center min-h-[48px] py-1 px-1 rounded-lg transition-colors cursor-pointer select-none ${
                isActive
                  ? 'text-rose-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200 active:scale-95'
              }`}
            >
              <div
                className={`p-1 rounded-md transition-all ${
                  isActive ? 'bg-rose-950/80 text-rose-300 ring-1 ring-rose-500/50' : ''
                }`}
              >
                {item.icon}
              </div>
              <span className="text-[10px] font-mono tracking-tight mt-0.5 leading-none">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
