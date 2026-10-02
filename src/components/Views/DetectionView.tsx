import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { DetectionCategory, CameraFeedState } from '../../types';
import {
  Eye,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Wind,
  User,
  DoorOpen,
  Filter,
  CheckCircle,
  HelpCircle,
  Search,
} from 'lucide-react';

export const DetectionView: React.FC = () => {
  const { cameras, selectedCamera, setSelectedCamera, stateMachine } = useSimulation();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<DetectionCategory | 'all'>('all');
  const currentCam = selectedCamera || cameras[3];

  const categoryFilters: { id: DetectionCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Detections' },
    { id: 'fire', label: 'Fire Combustion' },
    { id: 'smoke', label: 'Smoke Plumes' },
    { id: 'person', label: 'Occupants' },
    { id: 'obstacle', label: 'Obstacles / Exits' },
    { id: 'equipment', label: 'Equipment' },
  ];

  const filteredDetections = activeCategoryFilter === 'all'
    ? currentCam.detections
    : currentCam.detections.filter((d) => d.category === activeCategoryFilter);

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-400 uppercase tracking-wider mb-1">
            <span>Stage 01</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Synchronous Multi-Camera Detection</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Live Computer Vision Detections (8 Unique Cameras)
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Real-time object bounding boxes and category confidence scores. Every camera observes a distinct physical location with detections synchronized to the current emergency phase.
          </p>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          {categoryFilters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveCategoryFilter(f.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                activeCategoryFilter === f.id
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Live Camera View + Detection Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 Cols): Camera Feed with Subtle Bounding Boxes */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
            <div className="aspect-video relative overflow-hidden bg-slate-950">
              <img
                src={currentCam.activeImage}
                alt={currentCam.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 cctv-scanline opacity-50 pointer-events-none" />

              {/* Computer Vision Bounding Boxes */}
              {filteredDetections.map((det) => (
                <div
                  key={det.id}
                  style={{
                    top: `${det.box.ymin}%`,
                    left: `${det.box.xmin}%`,
                    width: `${det.box.xmax - det.box.xmin}%`,
                    height: `${det.box.ymax - det.box.ymin}%`,
                  }}
                  className={`absolute border-2 pointer-events-none transition-all duration-300 ${
                    det.category === 'fire'
                      ? 'border-rose-500 bg-rose-500/10'
                      : det.category === 'smoke'
                      ? 'border-amber-400 bg-amber-400/10'
                      : det.category === 'obstacle'
                      ? 'border-red-600 bg-red-600/20'
                      : det.category === 'crowd'
                      ? 'border-cyan-400 bg-cyan-400/10'
                      : 'border-emerald-400 bg-emerald-400/10'
                  }`}
                >
                  <div className="absolute -top-5 left-0 px-2 py-0.5 bg-slate-950/90 text-[10px] font-mono font-bold tracking-tight text-white whitespace-nowrap border border-slate-700 flex items-center gap-1 shadow-md">
                    <span>{det.label}</span>
                    <span className="text-slate-400">{det.confidence}%</span>
                  </div>
                </div>
              ))}

              {/* Camera Header Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-2 bg-slate-950/80 px-2.5 py-1 rounded text-xs font-mono text-slate-200 border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span className="font-bold">{currentCam.id}</span>
                <span className="text-slate-500">·</span>
                <span>{currentCam.location}</span>
                <span className="text-slate-500">·</span>
                <span className="text-rose-400 font-semibold">● SIMULATION</span>
              </div>

              {/* Current Detection State Status */}
              <div className="absolute bottom-3 left-3 bg-slate-950/85 px-3 py-1.5 rounded text-xs font-mono text-white border border-slate-800">
                STATUS: <strong className="text-rose-400">{currentCam.statusText}</strong>
              </div>
            </div>

            {/* 8 Camera Feed Selectors (Genuinely Unique Locations) */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2 overflow-x-auto">
              {cameras.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCamera(c)}
                  className={`px-3 py-2 rounded-md text-xs font-mono font-semibold transition-all border shrink-0 text-left ${
                    currentCam.id === c.id
                      ? 'bg-rose-950/60 border-rose-500 text-rose-300 shadow-sm'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold">{c.id}</div>
                  <div className="text-[10px] text-slate-500 font-normal truncate max-w-28">{c.zone}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Context Verification Note */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-white">Visual Consistency Principle Enforced</span>
              <p className="text-slate-400 leading-relaxed">
                If the camera feed shows <strong>NO FIRE</strong>, the system displays <strong>NO ACTIVE FIRE</strong>. Detections and bounding boxes reflect the exact visual reality of each camera at its designated floor coordinate.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (4 Cols): Detection List & False Alarm Verification Log */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">{currentCam.name} Detections</h3>
              <span className="text-[11px] font-mono text-slate-400">
                {filteredDetections.length} Active
              </span>
            </div>

            {filteredDetections.length === 0 ? (
              <div className="p-6 rounded-lg bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-500 font-mono">
                No active anomaly detections on {currentCam.id}. Environment nominal.
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredDetections.map((det) => (
                  <div
                    key={det.id}
                    className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white flex items-center gap-1.5">
                        {det.category === 'fire' && <Flame className="w-3.5 h-3.5 text-rose-500" />}
                        {det.category === 'smoke' && <Wind className="w-3.5 h-3.5 text-amber-400" />}
                        {det.category === 'person' && <User className="w-3.5 h-3.5 text-cyan-400" />}
                        {det.category === 'obstacle' && <DoorOpen className="w-3.5 h-3.5 text-red-500" />}
                        <span>{det.label}</span>
                      </span>
                      <span className="font-mono text-xs font-bold text-rose-400">
                        {det.confidence}%
                      </span>
                    </div>

                    {det.thermalReading && (
                      <div className="text-[11px] font-mono text-amber-400">
                        Thermal Core: <strong>{det.thermalReading}</strong>
                      </div>
                    )}

                    {det.falsePositiveContext && (
                      <div className="p-2 rounded bg-slate-900 border border-slate-800/80 text-[11px] text-slate-300">
                        <span className="text-slate-500 font-mono">Context: </span>
                        {det.falsePositiveContext}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[10px] font-mono text-slate-400">
                      <span>Status: <strong className="text-emerald-400 uppercase">{det.verificationState}</strong></span>
                      <span>Verified: Yes</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
