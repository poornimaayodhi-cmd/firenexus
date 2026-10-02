import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { ALL_USERS } from '../../data/mockData';
import {
  Sliders,
  Camera,
  Layers,
  ShieldCheck,
  Activity,
  Users,
  AlertTriangle,
  Server,
  Settings,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const { cameras, exits, dangerZones, activeRole } = useSimulation();

  const [activeTab, setActiveTab] = useState<'overview' | 'cameras' | 'officers' | 'zones' | 'health'>('overview');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (activeRole !== 'admin') {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Restricted Access</h2>
        <p className="text-xs text-slate-400">
          The Admin Console is restricted to authenticated system administrators. Please switch to the Administrator role using the top navigation profile switcher.
        </p>
      </div>
    );
  }

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400 uppercase tracking-wider mb-1">
            <span>Enterprise Infrastructure Management</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Administrator Console</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            System Administration & Control
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Configure CCTV cameras, spatial building zones, emergency exit hardware, authorized responder roles, and AI inference pipelines.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
          {[
            { id: 'overview', label: 'System Overview' },
            { id: 'cameras', label: 'Camera Feeds (24)' },
            { id: 'officers', label: 'Officers & RBAC' },
            { id: 'zones', label: 'Zones & Exits' },
            { id: 'health', label: 'Health & Audit' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                activeTab === t.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-800 text-xs text-emerald-300 font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Stat Dashboard (As mandated by user prompt) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Active Cameras</div>
          <div className="text-2xl font-mono font-extrabold text-white">24</div>
          <div className="text-[10px] text-emerald-400 font-mono">100% online</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Active Incidents</div>
          <div className="text-2xl font-mono font-extrabold text-rose-400">01</div>
          <div className="text-[10px] text-rose-300 font-mono">Incident #1042</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Online Officers</div>
          <div className="text-2xl font-mono font-extrabold text-cyan-400">12</div>
          <div className="text-[10px] text-slate-400 font-mono">4 Stations connected</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Active Tracks</div>
          <div className="text-2xl font-mono font-extrabold text-amber-400">86</div>
          <div className="text-[10px] text-slate-400 font-mono">Tracked building occupants</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase">System Health</div>
          <div className="text-2xl font-mono font-extrabold text-emerald-400">98%</div>
          <div className="text-[10px] text-emerald-400 font-mono">Nominal status</div>
        </div>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">Vision Pipeline Configuration</h3>
            <div className="space-y-3 text-xs font-mono text-slate-300">
              <div className="flex justify-between items-center p-3 rounded bg-slate-950 border border-slate-800">
                <div>
                  <span className="font-bold text-white">YOLO Detection Engine</span>
                  <div className="text-slate-500 text-[11px]">Model: fire-smoke-occupant-v11-fp16</div>
                </div>
                <button
                  onClick={() => showToast('AI model sensitivity updated to high')}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-slate-300"
                >
                  Configure
                </button>
              </div>

              <div className="flex justify-between items-center p-3 rounded bg-slate-950 border border-slate-800">
                <div>
                  <span className="font-bold text-white">Cross-Camera Re-Identification</span>
                  <div className="text-slate-500 text-[11px]">Tracking: ByteTrack + Spatio-Temporal Spatial Graph</div>
                </div>
                <button
                  onClick={() => showToast('Re-ID feature weights calibrated')}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-slate-300"
                >
                  Calibrate
                </button>
              </div>

              <div className="flex justify-between items-center p-3 rounded bg-slate-950 border border-slate-800">
                <div>
                  <span className="font-bold text-white">Dynamic Routing Engine</span>
                  <div className="text-slate-500 text-[11px]">Algorithm: A* Multi-Hazard Dynamic Cost Routing</div>
                </div>
                <button
                  onClick={() => showToast('Routing weights recalculated')}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-slate-300"
                >
                  Recalculate
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">Audit Log Stream</h3>
            <div className="space-y-2 text-[11px] font-mono text-slate-400">
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500">21:42:25</span> — Admin session started by Dr. Sarah Lin
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500">21:42:10</span> — CAM-07 flagged Exit B obstruction
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500">21:41:48</span> — Incident #1042 created from CAM-03 & CAM-01
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Officers & RBAC */}
      {activeTab === 'officers' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Authorized Responders & Officers</h3>
            <button
              onClick={() => showToast('New officer invite dialog staged')}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Officer</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Badge</th>
                  <th className="py-2.5 px-3">Station / Agency</th>
                  <th className="py-2.5 px-3">Callsign</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {ALL_USERS.map((usr) => (
                  <tr key={usr.id}>
                    <td className="py-2.5 px-3 font-semibold text-white">{usr.name}</td>
                    <td className="py-2.5 px-3">
                      <span className="text-purple-400 uppercase font-bold text-[10px]">
                        {usr.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">{usr.badgeNumber}</td>
                    <td className="py-2.5 px-3 text-slate-400">{usr.station}</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">{usr.callsign}</td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => showToast(`Edited permissions for ${usr.name}`)}
                        className="text-slate-400 hover:text-white mr-2"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Cameras */}
      {activeTab === 'cameras' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Registered CCTV IP Video Streams (24 Total)</h3>
            <button
              onClick={() => showToast('RTSP stream probe initialized')}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add IP Camera</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cameras.map((c) => (
              <div key={c.id} className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="font-bold text-white">{c.id}</span>
                  <span className="text-emerald-400">{c.ip}</span>
                </div>
                <div className="text-xs text-slate-300 font-semibold">{c.name}</div>
                <div className="text-[11px] text-slate-500">{c.location}</div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-800/60 text-[10px] font-mono text-slate-400">
                  <span>Coverage: {c.blindSpotCoverage.toUpperCase()}</span>
                  <span className="text-slate-300">{c.fps} FPS</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Zones & Health */}
      {(activeTab === 'zones' || activeTab === 'health') && (
        <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Infrastructure Health & Zones</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 rounded bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400">Building Network Switch:</span>
              <div className="text-emerald-400 font-bold text-base">ONLINE (10 Gbps)</div>
            </div>
            <div className="p-4 rounded bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400">Edge Inference Cluster:</span>
              <div className="text-emerald-400 font-bold text-base">4x NVIDIA L40S (22ms)</div>
            </div>
            <div className="p-4 rounded bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400">Thermal Telemetry Link:</span>
              <div className="text-emerald-400 font-bold text-base">ACTIVE (BACnet/IP)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
