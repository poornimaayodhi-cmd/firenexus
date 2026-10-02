import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import {
  Radio,
  ShieldCheck,
  AlertCircle,
  Volume2,
  CheckCircle2,
  ArrowRight,
  Flame,
  Users,
  Compass,
  PhoneCall,
  Clock,
  Sparkles,
} from 'lucide-react';

export const ResponseView: React.FC = () => {
  const { incident, currentStepIndex } = useSimulation();

  const [broadcastSent, setBroadcastSent] = useState<boolean>(false);
  const [tasks, setTasks] = useState([
    { id: 't1', label: 'Deploy Team Alpha-1 to Corridor 2W (Extract Person #104)', completed: true, unit: 'Search & Rescue Alpha-1' },
    { id: 't2', label: 'Trigger HVAC Damper Zone B Seal (Prevent toxic smoke migration)', completed: true, unit: 'Building Automation Facility' },
    { id: 't3', label: 'Dispatch Breach Unit Bravo to clear Staircase B debris', completed: false, unit: 'Breach Unit Bravo' },
    { id: 't4', label: 'Energize Staircase C Positive Pressure Airflow fans', completed: true, unit: 'Fire Protection Automation' },
    { id: 't5', label: 'Fire Attack Line charged into Sector 204 electrical breaker', completed: false, unit: 'Engine 14 Tactical Attack' },
  ]);

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleBroadcast = () => {
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 4500);
  };

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-1">
            <span>Tactical Decision Support</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Emergency Operations Response</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Responder Prioritization & Dispatch Queue
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Prioritizes intervention areas based on occupant vulnerability, structural obstacles, and flame propagation rates to guide incident commanders.
          </p>
        </div>

        {/* Human in the loop confirmation notice */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Human-Authorized Dispatch Active</span>
        </div>
      </div>

      {/* Broadcast Alert Center */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-800/60 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-400">
            <Volume2 className="w-4 h-4 text-rose-500 animate-pulse" />
            <span>DYNAMIC PUBLIC ADDRESS & SMART WAYFINDING OVERRIDE</span>
          </div>
          <div className="text-sm font-semibold text-white">
            Broadcast Automated Dynamic Evacuation Audio: &quot;EXIT B IS BLOCKED. DIVERT TO STAIRCASE C.&quot;
          </div>
          <p className="text-xs text-slate-400">
            Pushes dynamic digital signage updates across Floor 2 LCD screens and plays synchronized directional voice commands.
          </p>
        </div>

        <button
          onClick={handleBroadcast}
          className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            broadcastSent
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950'
              : 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/50'
          }`}
        >
          <Volume2 className="w-4 h-4" />
          <span>{broadcastSent ? 'Broadcast Transmitted!' : 'Transmit PA Alert'}</span>
        </button>
      </div>

      {/* Grid: Prioritized Locations + Operational Task Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 Cols): Prioritized Locations */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-amber-400" />
              <span>Prioritized Incident Zones ({incident.responderPriorities.length})</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">RANKED BY THREAT SEVERITY</span>
          </div>

          <div className="space-y-3">
            {incident.responderPriorities.map((item) => (
              <div
                key={item.rank}
                className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded bg-slate-950 border border-slate-700 font-mono font-extrabold text-xs text-rose-400 flex items-center justify-center">
                      {item.rank}
                    </span>
                    <span className="text-sm font-bold text-white">{item.zone}</span>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                      item.priorityLevel === 'critical'
                        ? 'text-rose-400 bg-rose-950 border-rose-800'
                        : 'text-amber-400 bg-amber-950 border-amber-800'
                    }`}
                  >
                    {item.priorityLevel} PRIORITY
                  </span>
                </div>

                <div className="text-xs text-slate-300 font-medium pl-9">
                  {item.hazardDescription}
                </div>

                <div className="p-3 rounded bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 ml-9 space-y-1">
                  <div className="text-[10px] font-mono text-slate-400">TACTICAL GUIDANCE:</div>
                  <p>{item.actionGuidance}</p>
                  <div className="text-[10px] font-mono text-amber-400 pt-1">
                    Designated Unit: <strong>{item.tacticalUnit}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (5 Cols): Response Checklist */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Incident Command Action Checklist</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              {tasks.filter((t) => t.completed).length} / {tasks.length} Completed
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                  task.completed
                    ? 'bg-slate-950/60 border-emerald-900/40 opacity-75'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                    task.completed
                      ? 'bg-emerald-600 border-emerald-500 text-white'
                      : 'border-slate-700 bg-slate-900'
                  }`}
                >
                  {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>

                <div className="flex-1 text-xs">
                  <div className={`font-medium ${task.completed ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                    {task.label}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                    Assigned: {task.unit}
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-2 text-[11px] font-mono text-slate-500 text-center">
              Click any operational task to toggle completion audit status.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
