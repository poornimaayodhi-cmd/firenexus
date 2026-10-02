import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { TrackedEntity } from '../../types';
import {
  Crosshair,
  User,
  Users,
  Flame,
  Wind,
  ArrowRight,
  TrendingDown,
  Compass,
  Search,
  Activity,
  MapPin,
  Clock,
} from 'lucide-react';

export const TrackingView: React.FC = () => {
  const {
    trackedEntities,
    selectedEntity,
    setSelectedEntity,
    setCurrentView,
    highlightedPathEntityId,
    setHighlightedPathEntityId,
  } = useSimulation();

  const [filterType, setFilterType] = useState<'all' | 'person' | 'crowd' | 'hazard'>('all');

  const currentEntity = selectedEntity || trackedEntities[0];

  const filteredEntities = trackedEntities.filter((e) => {
    if (filterType === 'all') return true;
    if (filterType === 'person') return e.type === 'person';
    if (filterType === 'crowd') return e.type === 'crowd';
    if (filterType === 'hazard') return e.type === 'fire_front' || e.type === 'smoke_plume';
    return true;
  });

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-1">
            <span>Stage 02</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Cross-Camera Re-Identification & Flow Tracking</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Cross-Camera Trajectory & Hazard Tracking
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Tracks individual occupants, crowd egress velocities, and propagating fire/smoke fronts across disjoint camera fields of view without losing identity.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
          {[
            { id: 'all', label: 'All Entities' },
            { id: 'person', label: 'Occupants' },
            { id: 'crowd', label: 'Crowd Groups' },
            { id: 'hazard', label: 'Hazard Fronts' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setFilterType(t.id as any)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                filterType === t.id
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols): Entities List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Active Tracked Entities ({filteredEntities.length})
          </div>

          <div className="space-y-2.5">
            {filteredEntities.map((ent) => {
              const isSelected = currentEntity?.id === ent.id;
              return (
                <div
                  key={ent.id}
                  onClick={() => {
                    setSelectedEntity(ent);
                    setHighlightedPathEntityId(ent.id);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500/80 shadow-lg shadow-amber-950/20'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-bold text-xs flex items-center gap-2 text-white">
                      {ent.type === 'person' && <User className="w-4 h-4 text-cyan-400" />}
                      {ent.type === 'crowd' && <Users className="w-4 h-4 text-emerald-400" />}
                      {ent.type === 'fire_front' && <Flame className="w-4 h-4 text-rose-500" />}
                      {ent.type === 'smoke_plume' && <Wind className="w-4 h-4 text-amber-400" />}
                      <span>{ent.id}</span>
                    </span>

                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                        ent.riskStatus === 'critical'
                          ? 'text-rose-400 bg-rose-950/40 border-rose-800/60'
                          : ent.riskStatus === 'high'
                          ? 'text-amber-400 bg-amber-950/40 border-amber-800/60'
                          : 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60'
                      }`}
                    >
                      {ent.riskStatus} RISK
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-slate-200 mb-1">{ent.label}</div>
                  <div className="text-xs text-slate-400 mb-2 truncate">
                    Loc: {ent.currentLocation}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/70">
                    <div>
                      Feed: <strong className="text-white">{ent.currentCamera}</strong>
                    </div>
                    <div>
                      Movement: <strong className="text-amber-300 uppercase">{ent.movementStatus}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (7 Cols): Trajectory Path & Surroundings Map */}
        <div className="lg:col-span-7 space-y-4">
          {currentEntity && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 lg:p-6 shadow-xl space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
                    <span>TRACK IDENTIFIER:</span>
                    <strong className="text-amber-400 font-bold">{currentEntity.id}</strong>
                    <span aria-hidden="true">·</span>
                    <span>VELOCITY: {currentEntity.speedMps} m/s</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">{currentEntity.label}</h2>
                </div>

                <button
                  onClick={() => setCurrentView('inspection')}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto transition-colors"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Inspect Surroundings</span>
                </button>
              </div>

              {/* Cross-Camera Trajectory Breadcrumbs */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  <span>Cross-Camera Trajectory History</span>
                </div>

                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                  {currentEntity.pathHistory.map((step, idx) => (
                    <div key={idx} className="relative flex items-start justify-between text-xs">
                      <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-4 ring-slate-900" />
                      <div>
                        <div className="font-semibold text-white">
                          Camera <span className="text-rose-400 font-mono">{step.camera}</span> ({step.location})
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Coordinates: [{step.x}%, {step.y}%] on floor plane
                        </div>
                      </div>
                      <span className="font-mono text-slate-500 text-[11px]">{step.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Rationale & Context */}
              <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="text-xs font-semibold text-slate-300">
                  Movement Rationale & Route Guidance
                </div>
                <p className="text-xs text-rose-300/90 leading-relaxed font-mono">
                  {currentEntity.riskReason}
                </p>

                <div className="p-3 rounded bg-emerald-950/30 border border-emerald-900/60 text-xs space-y-1">
                  <div className="text-emerald-400 font-semibold font-mono text-[11px]">
                    RECOMMENDED EVACUATION ESCAPE VECTOR:
                  </div>
                  <div className="text-white font-medium">
                    {currentEntity.nearestAvailableRoute}
                  </div>
                </div>
              </div>

              {/* Crowd Dynamics / Optical Flow Section */}
              {currentEntity.type === 'crowd' && (
                <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-cyan-400" />
                      <span>Crowd Density & Optical Flow Dynamics</span>
                    </span>
                    <span className="font-mono text-cyan-400 font-semibold">1.1 m/s (NOMINAL)</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Optical flow vectors confirm synchronized movement toward Staircase C. No turbulent counter-flows or stampede pressure spikes detected.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
