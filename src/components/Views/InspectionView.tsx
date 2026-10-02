import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import {
  Search,
  User,
  Flame,
  Wind,
  Compass,
  AlertTriangle,
  DoorOpen,
  Camera,
  Layers,
  ArrowRight,
  ShieldAlert,
  Activity,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export const InspectionView: React.FC = () => {
  const {
    trackedEntities,
    selectedEntity,
    setSelectedEntity,
    cameras,
    selectedCamera,
    setSelectedCamera,
    exits,
    dangerZones,
    setCurrentView,
    currentStepIndex,
    goToStep,
  } = useSimulation();

  const [inspectTab, setInspectTab] = useState<'entity' | 'exit' | 'camera' | 'zone'>('entity');

  const currentEntity = selectedEntity || trackedEntities[0];
  const currentCam = selectedCamera || cameras[0];

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-1">
            <span>Stage 03</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Surrounding Contextual Inspection</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Environmental Context Inspection
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Examines the local surrounding context for any detected occupant, camera coverage zone, or emergency exit to assess true situational risk.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
          {[
            { id: 'entity', label: 'Occupants & Threats' },
            { id: 'exit', label: 'Exit Egress Points' },
            { id: 'camera', label: 'Camera Blind Spots' },
            { id: 'zone', label: 'Hazard Zones' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setInspectTab(t.id as any)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                inspectTab === t.id
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Occupants & Threat Surroundings */}
      {inspectTab === 'entity' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Entity List */}
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Select Entity to Inspect
            </div>
            <div className="space-y-2">
              {trackedEntities.map((ent) => {
                const isSelected = currentEntity.id === ent.id;
                return (
                  <button
                    key={ent.id}
                    onClick={() => setSelectedEntity(ent)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-500 text-white shadow-lg'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-900/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-xs">{ent.id}</span>
                      <span
                        className={`text-[10px] font-mono font-bold uppercase ${
                          ent.riskStatus === 'critical' ? 'text-rose-400' : 'text-amber-400'
                        }`}
                      >
                        {ent.riskStatus}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-200 truncate">{ent.label}</div>
                    <div className="text-[11px] text-slate-400 mt-1">{ent.currentLocation}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Deep Environmental Inspection Card */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 lg:p-6 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="text-xs font-mono text-cyan-400 mb-1">
                    INSPECTION TARGET: {currentEntity.id}
                  </div>
                  <h2 className="text-xl font-bold text-white">{currentEntity.label}</h2>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Location: <strong className="text-slate-200">{currentEntity.currentLocation}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded text-xs font-mono font-bold uppercase border ${
                      currentEntity.riskStatus === 'critical'
                        ? 'bg-rose-950/60 border-rose-800 text-rose-300'
                        : 'bg-amber-950/60 border-amber-800 text-amber-300'
                    }`}
                  >
                    {currentEntity.riskStatus} RISK
                  </span>
                </div>
              </div>

              {/* Environmental Surrounding Radar Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <Flame className="w-3.5 h-3.5 text-rose-500" />
                    <span>Fire Proximity</span>
                  </div>
                  <div className="text-xl font-mono font-extrabold text-white">
                    {currentEntity.context.fireDistanceMeters}m
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Direct thermal locus</div>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <Wind className="w-3.5 h-3.5 text-amber-400" />
                    <span>Smoke Stratum</span>
                  </div>
                  <div className="text-xl font-mono font-extrabold text-amber-400 uppercase">
                    {currentEntity.context.smokeDensity}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Vis &lt; 2.5m threshold</div>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Local Crowd</span>
                  </div>
                  <div className="text-xl font-mono font-extrabold text-cyan-400 uppercase">
                    {currentEntity.context.crowdDensity}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Isolated from pack</div>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <DoorOpen className="w-3.5 h-3.5 text-red-400" />
                    <span>Ahead Exit</span>
                  </div>
                  <div className="text-xl font-mono font-extrabold text-rose-400 truncate">
                    BLOCKED
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Exit B 12m ahead</div>
                </div>
              </div>

              {/* Threat Diagnosis & Tactical Advice */}
              <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="text-xs font-semibold text-white">Contextual Threat Assessment</div>
                <p className="text-xs text-slate-300 leading-relaxed font-mono">
                  {currentEntity.riskReason}
                </p>

                <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-mono text-emerald-400 font-semibold">
                      SAFE EGRESS ROUTE COMPUTED:
                    </div>
                    <div className="text-xs text-white font-medium mt-0.5">
                      {currentEntity.nearestAvailableRoute}
                    </div>
                  </div>
                  <button
                    onClick={() => setCurrentView('3d_environment')}
                    className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
                  >
                    <span>View in 3D Building</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Exit Egress Points Inspection */}
      {inspectTab === 'exit' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {exits.map((exit) => (
            <div
              key={exit.id}
              className={`p-5 rounded-xl border flex flex-col justify-between shadow-lg ${
                exit.status === 'blocked'
                  ? 'bg-rose-950/20 border-rose-800/80'
                  : exit.status === 'crowded'
                  ? 'bg-amber-950/20 border-amber-800/80'
                  : 'bg-emerald-950/20 border-emerald-800/80'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-slate-400">{exit.id}</span>
                  <span
                    className={`text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded border ${
                      exit.status === 'blocked'
                        ? 'text-rose-400 bg-rose-950 border-rose-800'
                        : exit.status === 'crowded'
                        ? 'text-amber-400 bg-amber-950 border-amber-800'
                        : 'text-emerald-400 bg-emerald-950 border-emerald-800'
                    }`}
                  >
                    {exit.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white">{exit.name}</h3>
                <div className="text-xs text-slate-400">{exit.location}</div>

                <div className="space-y-1.5 py-2 border-y border-slate-800/80 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Flow Throughput:</span>
                    <span className="text-white font-bold">{exit.currentFlowRate} / min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Design Capacity:</span>
                    <span className="text-white">{exit.flowCapacityPerMin} / min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Congestion:</span>
                    <span className={exit.congestionPercent >= 80 ? 'text-rose-400' : 'text-emerald-400'}>
                      {exit.congestionPercent}%
                    </span>
                  </div>
                </div>

                {exit.blockageReason && (
                  <div className="p-2.5 rounded bg-rose-950/60 border border-rose-800/80 text-xs text-rose-200">
                    <strong>Obstruction Cause:</strong> {exit.blockageReason}
                  </div>
                )}

                <p className="text-xs text-slate-300 leading-relaxed">
                  {exit.recommendation}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500">
                  Monitored: {exit.monitoredByCamera}
                </span>
                {exit.id === 'EXIT-B' && (
                  <button
                    onClick={() => goToStep(currentStepIndex >= 7 ? 5 : 7)}
                    className="text-xs font-semibold text-rose-400 hover:text-white underline"
                  >
                    Simulate Clear/Block
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Camera Blind Spots Awareness */}
      {inspectTab === 'camera' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-white">Camera Blind-Spot Safety Principle</span>
              <p className="text-slate-400 leading-relaxed">
                The platform operates under the zero-assumption rule: <strong>An unobserved or blind zone is NEVER assumed to be safe.</strong> Partial or blind zones trigger automated human dispatch verification before an area is cleared for occupant passage.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cameras.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-white">{c.id}</span>
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                      c.blindSpotCoverage === 'full'
                        ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800'
                        : c.blindSpotCoverage === 'partial'
                        ? 'text-amber-400 bg-amber-950/60 border-amber-800'
                        : 'text-rose-400 bg-rose-950/60 border-rose-800'
                    }`}
                  >
                    {c.blindSpotCoverage} COVERAGE
                  </span>
                </div>

                <div className="text-xs font-semibold text-slate-200">{c.name}</div>
                <div className="text-[11px] text-slate-400">{c.location}</div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-2.5 rounded border border-slate-800/80">
                  {c.coverageNotes}
                </p>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-800">
                  <span>FOV: {c.fovAngle}°</span>
                  <span>Detections: {c.detections.length}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Hazard Zones */}
      {inspectTab === 'zone' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {dangerZones.map((z) => (
            <div
              key={z.id}
              className={`p-5 rounded-xl border space-y-3 ${
                z.riskLevel === 'critical'
                  ? 'bg-rose-950/20 border-rose-800/80'
                  : z.riskLevel === 'high'
                  ? 'bg-amber-950/20 border-amber-800/80'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-slate-400">{z.id}</span>
                <span
                  className={`text-[10px] font-mono font-bold uppercase ${
                    z.riskLevel === 'critical' ? 'text-rose-400' : 'text-amber-400'
                  }`}
                >
                  {z.riskLevel}
                </span>
              </div>

              <h3 className="text-base font-bold text-white">{z.name}</h3>

              <div className="space-y-1 text-xs font-mono text-slate-400">
                <div className="flex justify-between">
                  <span>Occupants Inside:</span>
                  <strong className="text-white">{z.occupantCount}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Fire Severity:</span>
                  <strong className="text-rose-400">{z.fireSeverity}%</strong>
                </div>
                <div className="flex justify-between">
                  <span>Smoke Density:</span>
                  <strong className="text-amber-400">{z.smokeDensity}%</strong>
                </div>
                <div className="flex justify-between">
                  <span>Trend:</span>
                  <strong className="text-white uppercase">{z.propagationTrend}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
