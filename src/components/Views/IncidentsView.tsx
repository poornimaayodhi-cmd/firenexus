import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import {
  Flame,
  AlertTriangle,
  Clock,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  DoorOpen,
} from 'lucide-react';

export const IncidentsView: React.FC = () => {
  const { incident, currentStepIndex, setCurrentView } = useSimulation();

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-400 uppercase tracking-wider mb-1">
            <span>Spatio-Temporal Incident Fusion</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Active Incident Directory</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Correlated Emergency Incidents
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Multi-camera fusion algorithm binds separate camera observations into unified operational incident records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 font-mono text-xs font-bold">
            1 ACTIVE INCIDENT
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 font-mono text-xs">
            14 RESOLVED (PAST 30D)
          </span>
        </div>
      </div>

      {/* Primary Correlated Incident Card */}
      <div className="bg-slate-900/90 border border-rose-800/60 rounded-xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-rose-400 mb-1">
              <span className="font-bold text-base">{incident.id}</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-300 uppercase font-semibold">{incident.primaryLocation}</span>
              <span aria-hidden="true">·</span>
              <span>CONFIDENCE: {incident.confidenceScore}%</span>
            </div>
            <h2 className="text-xl font-bold text-white">{incident.title}</h2>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
              <span>Bound Feeds:</span>
              {incident.correlatedCameras.map((cam) => (
                <span key={cam} className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-200 font-mono">
                  {cam}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 font-mono text-xs font-bold uppercase">
              {incident.overallRisk} RISK
            </div>
            <button
              onClick={() => setCurrentView('live_scene')}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>Command View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Hazard Elements Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="text-[11px] font-mono text-slate-400">Hazard Origin</div>
            <div className="text-sm font-bold text-white">Electrical Combustion (Utility 204)</div>
            <div className="text-[11px] text-rose-400 font-mono">412°C active rack flame</div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="text-[11px] font-mono text-slate-400">Corridor Condition</div>
            <div className="text-sm font-bold text-white">Heavy Dense Smoke Dispersion</div>
            <div className="text-[11px] text-amber-400 font-mono">Visibility &lt; 2.5m (Zone B)</div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="text-[11px] font-mono text-slate-400">Critical Obstruction</div>
            <div className="text-sm font-bold text-white">Staircase B Exit Blocked</div>
            <div className="text-[11px] text-rose-500 font-mono">Structural ceiling collapse</div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="text-[11px] font-mono text-slate-400">Occupants at Risk</div>
            <div className="text-sm font-bold text-white">{incident.peopleAtRiskCount} In Danger Zone</div>
            <div className="text-[11px] text-emerald-400 font-mono">Person #104 targeted for extraction</div>
          </div>
        </div>

        {/* Unified Chronological Event History */}
        <div className="space-y-3 pt-2">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-rose-400" />
            <span>Unified Multi-Camera Chronology</span>
          </div>

          <div className="space-y-2">
            {incident.timeline.map((event) => (
              <div
                key={event.id}
                className="flex items-start justify-between p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs"
              >
                <div className="flex items-start gap-3">
                  <span className="font-mono text-slate-400 text-[11px] shrink-0 pt-0.5">
                    {event.timecode}
                  </span>
                  <span className="font-mono font-bold text-rose-400 text-[11px] shrink-0 pt-0.5">
                    {event.camera}
                  </span>
                  <div>
                    <div className="font-semibold text-white">{event.title}</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">{event.detail}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500 shrink-0">
                  <span>Confidence: {event.confidence}%</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
