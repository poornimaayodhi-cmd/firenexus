import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import {
  Activity,
  TrendingDown,
  TrendingUp,
  BarChart3,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Users,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { incident, currentStepIndex } = useSimulation();

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-1">
            <span>Crowd Dynamics & CV Performance</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Emergency Telemetry Analytics</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Evacuation Dynamics & Vision Metrics
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Real-time throughput metrics, exit bottleneck forecasting, and computer vision false-positive suppression telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>Vision Ingest Rate:</span>
          <strong className="text-emerald-400">120 FPS Aggregated</strong>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-[11px] font-mono text-slate-400">Evacuation Velocity</div>
          <div className="text-2xl font-mono font-extrabold text-white">1.1 m/s</div>
          <div className="text-[10px] text-emerald-400 font-mono">Stable flow toward Staircase C</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-[11px] font-mono text-slate-400">Exit B Bottleneck Risk</div>
          <div className="text-2xl font-mono font-extrabold text-rose-400">CRITICAL (100%)</div>
          <div className="text-[10px] text-rose-300 font-mono">0 persons/min egress capacity</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-[11px] font-mono text-slate-400">Staircase C Throughput</div>
          <div className="text-2xl font-mono font-extrabold text-emerald-400">42 / min</div>
          <div className="text-[10px] text-slate-400 font-mono">Max capacity: 95 / min (44% load)</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-[11px] font-mono text-slate-400">CV Inference Latency</div>
          <div className="text-2xl font-mono font-extrabold text-white">22 ms</div>
          <div className="text-[10px] text-cyan-400 font-mono">YOLO + ByteTrack edge pipeline</div>
        </div>
      </div>

      {/* Charts & Diagnostics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 Cols): Throughput Comparison Bar Chart Simulation */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>Evacuation Flow Rate by Corridor (Occupants / Minute)</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">LAST 10 MINUTES</span>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                <span>Staircase C (East Primary - Clear)</span>
                <span className="text-emerald-400 font-bold">42 / min (44% Load)</span>
              </div>
              <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full w-[44%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                <span>Staircase B (West Wing - Blocked)</span>
                <span className="text-rose-400 font-bold">0 / min (0% Pass Through - Blocked)</span>
              </div>
              <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-rose-600 rounded-full w-[2%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                <span>Staircase A (North Core - Secondary Clear)</span>
                <span className="text-cyan-400 font-bold">15 / min (21% Load)</span>
              </div>
              <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-cyan-600 rounded-full w-[21%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                <span>Central Atrium Concourse Transit Flow</span>
                <span className="text-purple-400 font-bold">38 / min (60% Transit)</span>
              </div>
              <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-purple-600 rounded-full w-[60%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 Cols): Vision Model Reliability */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>Vision System Reliability</span>
            </h3>
            <span className="text-[11px] font-mono text-emerald-400">CALIBRATED</span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">False Positive Suppression:</span>
              <strong className="text-emerald-400 font-bold">98.4%</strong>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Cross-Camera Re-ID Accuracy:</span>
              <strong className="text-white font-bold">96.8%</strong>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Blind-Spot Coverage Safety:</span>
              <strong className="text-amber-400 font-bold">Active (Zero-Assumption)</strong>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Temporal Verification Window:</span>
              <strong className="text-white font-bold">1.2 sec multi-frame</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
