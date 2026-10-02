import React, { useState, useEffect } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { CameraFeedState } from '../../types';
import {
  Flame,
  Wind,
  AlertTriangle,
  Users,
  Compass,
  Radio,
  ArrowRight,
  ShieldAlert,
  Eye,
  Crosshair,
  Search,
  BrainCircuit,
  Clock,
  Sparkles,
  Maximize2,
  CheckCircle2,
  Layers,
  ChevronRight,
  Activity,
  DoorOpen,
  ShieldCheck,
  TrendingUp,
  MapPin,
  AlertOctagon,
  Video,
  X,
  SlidersHorizontal,
} from 'lucide-react';

export const LiveSceneView: React.FC = () => {
  const {
    incident,
    currentStepIndex,
    currentStep,
    stateMachine,
    cameras,
    selectedCamera,
    setSelectedCamera,
    trackedEntities,
    exits,
    dangerZones,
    blindSpots,
    falseAlarmVerification,
    propagationTimeline,
    crowdFlow,
    vulnerablePeople,
    riskExplanationBullets,
    correlationSummaryText,
    setCurrentView,
    isAiSynthesizing,
    triggerAiSceneSynthesis,
    aiGeneratedSummary,
  } = useSimulation();

  // Active Center Tab: 'fusion' | 'feed' | 'correlation'
  const [centerTab, setCenterTab] = useState<'fusion' | 'feed' | 'correlation'>('fusion');

  // Full-Screen / Focused Camera Modal for Mobile & Desktop
  const [fullscreenCam, setFullscreenCam] = useState<CameraFeedState | null>(null);

  // Real-time ticking timecode for authentic CCTV stream feeling
  const [liveTimecode, setLiveTimecode] = useState<string>('21:42:00.00');
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      const ms = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0');
      setLiveTimecode(`${hours}:${mins}:${secs}.${ms}`);
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const currentCam = selectedCamera || cameras[3]; // default CAM-04 Server Room

  const riskBadgeStyles: Record<string, string> = {
    critical: 'text-rose-400 bg-rose-950/60 border-rose-800',
    high: 'text-amber-400 bg-amber-950/60 border-amber-800',
    moderate: 'text-yellow-400 bg-yellow-950/60 border-yellow-800',
    caution: 'text-yellow-400 bg-yellow-950/60 border-yellow-800',
    low: 'text-emerald-400 bg-emerald-950/60 border-emerald-800',
    safe: 'text-emerald-400 bg-emerald-950/60 border-emerald-800',
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'FIRE_DETECTED':
        return 'bg-rose-950/80 text-rose-400 border-rose-800 font-bold';
      case 'SMOKE_DETECTED':
        return 'bg-amber-950/80 text-amber-400 border-amber-800 font-bold';
      case 'BLOCKED':
        return 'bg-red-950/90 text-red-300 border-red-800 font-extrabold';
      case 'CONGESTED':
        return 'bg-yellow-950/80 text-yellow-400 border-yellow-800 font-bold';
      case 'SAFE_EVAC':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-800 font-semibold';
      case 'ANOMALY':
        return 'bg-orange-950/80 text-orange-400 border-orange-800 font-semibold';
      default:
        return 'bg-slate-900 text-slate-400 border-slate-800 font-normal';
    }
  };

  const getDangerZoneBg = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-rose-950/50 border-rose-600/70 text-rose-300';
      case 'high':
        return 'bg-orange-950/50 border-orange-600/70 text-orange-300';
      case 'caution':
      case 'moderate':
        return 'bg-yellow-950/50 border-yellow-600/70 text-yellow-300';
      case 'safe':
      case 'low':
      default:
        return 'bg-emerald-950/40 border-emerald-600/50 text-emerald-300';
    }
  };

  // Safe Exits count
  const safeExitsCount = exits.filter((e) => e.status === 'safe' || e.status === 'available').length;

  return (
    <div className="p-3 sm:p-4 lg:p-5 max-w-[1680px] mx-auto space-y-3.5 sm:space-y-4">
      {/* ======================================================== */}
      {/* TOP HEADER: 5 Required Dashboard KPI Pillars             */}
      {/* 1. Active Incidents 2. Overall Risk 3. People at Risk    */}
      {/* 4. Cameras Online   5. Safe Exits                       */}
      {/* ======================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5">
        {/* Pillar 1: Active Incidents */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-xl p-2.5 sm:p-3 flex items-center justify-between shadow-lg">
          <div className="min-w-0">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 truncate">Active Incidents</div>
            <div className="text-xs sm:text-base font-extrabold text-white flex items-center gap-1.5 mt-0.5 truncate">
              <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse shrink-0" />
              <span className="truncate">1 Active ({incident.id})</span>
            </div>
            <div className="text-[10px] text-slate-500 truncate mt-0.5">{incident.primaryLocation}</div>
          </div>
        </div>

        {/* Pillar 2: Overall Risk Level */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-xl p-2.5 sm:p-3 flex items-center justify-between shadow-lg">
          <div className="min-w-0">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 truncate">Risk Level</div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`px-2 py-0.5 rounded text-[11px] sm:text-xs font-mono font-extrabold uppercase border ${riskBadgeStyles[incident.overallRisk]}`}>
                {incident.overallRisk}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5 truncate">Confidence: {incident.confidenceScore}%</div>
          </div>
          <AlertOctagon className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400 shrink-0 opacity-80" />
        </div>

        {/* Pillar 3: People at Risk */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-xl p-2.5 sm:p-3 flex items-center justify-between shadow-lg">
          <div className="min-w-0">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 truncate">People At Risk</div>
            <div className="text-xs sm:text-base font-extrabold text-white mt-0.5 truncate">
              {incident.peopleAtRiskCount < 10 ? `0${incident.peopleAtRiskCount}` : incident.peopleAtRiskCount}{' '}
              <span className="text-[11px] text-rose-400 font-semibold">Occupants</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5 truncate">
              {vulnerablePeople.length} Critical Targets
            </div>
          </div>
          <Users className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0 opacity-80" />
        </div>

        {/* Pillar 4: Cameras Online */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-xl p-2.5 sm:p-3 flex items-center justify-between shadow-lg">
          <div className="min-w-0">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 truncate">Cameras Online</div>
            <div className="text-xs sm:text-base font-extrabold text-white mt-0.5 flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
              <span className="truncate">8 / 8 Online</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5 truncate">Coverage: 92% (1 Blind)</div>
          </div>
          <Video className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 shrink-0 opacity-80" />
        </div>

        {/* Pillar 5: Safe Exits */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-xl p-2.5 sm:p-3 flex items-center justify-between shadow-lg col-span-2 sm:col-span-1">
          <div className="min-w-0">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 truncate">Safe Exits</div>
            <div className="text-xs sm:text-base font-extrabold text-emerald-400 mt-0.5 flex items-center gap-1.5 truncate">
              <DoorOpen className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">{safeExitsCount} of {exits.length} Safe</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5 truncate">Exit C Recommended</div>
          </div>
          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0 opacity-80" />
        </div>
      </div>

      {/* Cross-Camera Fusion Incident Banner */}
      <div className="p-2.5 rounded-lg bg-slate-900/80 border border-rose-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 text-xs font-mono">
        <div className="flex items-center gap-2 truncate">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0"></span>
          <span className="font-extrabold text-rose-400 uppercase tracking-wide truncate">
            {correlationSummaryText}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400 shrink-0">
          <span className="hidden sm:inline">Active State:</span>
          <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-white font-bold">
            {stateMachine}
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MAIN RESPONSIVE COMMAND LAYOUT                           */}
      {/* Mobile (<md): Stacked Center -> Right -> Left            */}
      {/* Tablet (md): 2-Col (Cameras + Center) then (Risk + Exits) */}
      {/* Desktop (lg): 3-Col (Left -> Center -> Right)            */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-start">
        
        {/* ====================================================== */}
        {/* CENTER COLUMN: Scene Intelligence & Active Streams     */}
        {/* Mobile: order-1 | Tablet: order-2 (col-1) | Desktop: lg:col-span-5 */}
        {/* ====================================================== */}
        <div className="order-1 md:order-2 lg:order-2 md:col-span-1 lg:col-span-5 space-y-3">
          {/* Tab Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCenterTab('fusion')}
                className={`px-2.5 sm:px-3 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer ${
                  centerTab === 'fusion'
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : 'text-slate-400 hover:text-white bg-slate-900/60'
                }`}
              >
                Scene Intelligence
              </button>
              <button
                onClick={() => setCenterTab('feed')}
                className={`px-2.5 sm:px-3 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer ${
                  centerTab === 'feed'
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : 'text-slate-400 hover:text-white bg-slate-900/60'
                }`}
              >
                CCTV Feed: {currentCam.id}
              </button>
              <button
                onClick={() => setCenterTab('correlation')}
                className={`px-2.5 sm:px-3 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer ${
                  centerTab === 'correlation'
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : 'text-slate-400 hover:text-white bg-slate-900/60'
                }`}
              >
                Verifications
              </button>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-white font-bold">{liveTimecode}</span>
            </div>
          </div>

          {/* TAB 1: SCENE FUSION INTELLIGENCE (Unified Emergency Understanding) */}
          {centerTab === 'fusion' && (
            <div className="space-y-3">
              {/* Feature 1: Multi-Camera Fusion Correlation Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-3.5 space-y-2.5 shadow-xl">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <BrainCircuit className="w-4 h-4 text-purple-400" />
                    <span>MULTI-CAMERA SCENE FUSION</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800 text-[10px] font-mono text-purple-300 font-bold">
                    4 CORRELATED
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 space-y-0.5">
                    <div className="text-[10px] text-slate-500">CAM-04</div>
                    <div className="text-rose-400 font-bold truncate">Fire Detected</div>
                    <div className="text-[10px] text-slate-400 truncate">Server Hub 204</div>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 space-y-0.5">
                    <div className="text-[10px] text-slate-500">CAM-02</div>
                    <div className="text-amber-400 font-bold truncate">Smoke Plume</div>
                    <div className="text-[10px] text-slate-400 truncate">West Corridor</div>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 space-y-0.5">
                    <div className="text-[10px] text-slate-500">CAM-03</div>
                    <div className="text-cyan-400 font-bold truncate">Crowd Flow</div>
                    <div className="text-[10px] text-slate-400 truncate">Tech Office</div>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 space-y-0.5">
                    <div className="text-[10px] text-slate-500">CAM-05</div>
                    <div className="text-red-400 font-bold truncate">Exit B Blocked</div>
                    <div className="text-[10px] text-slate-400 truncate">Debris Hazard</div>
                  </div>
                </div>

                <div className="p-2 rounded bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-300 leading-snug">
                  <span className="text-slate-400 font-semibold font-mono">FUSION INSIGHT: </span>
                  Independent feeds correlated into one active threat vector. Occupants moving toward Exit B are converging on a blocked threshold with smoke encroaching behind them.
                </div>
              </div>

              {/* Feature 2: Cross-Camera Person Tracking (P-027, P-014, P-104) */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-3.5 space-y-2.5 shadow-xl">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <Crosshair className="w-4 h-4 text-amber-400" />
                    <span>CROSS-CAMERA PERSON TRACKING (RE-ID)</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">PERSISTENT RE-ID</span>
                </div>

                <div className="space-y-2">
                  {/* Person P-027 Path Example */}
                  <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1.5 text-xs font-mono">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        <span>PERSON P-027</span>
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-rose-950 border border-rose-800 text-[10px] font-bold text-rose-300 uppercase truncate">
                        HIGH RISK: Smoke + blocked exit
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-300 overflow-x-auto pb-1">
                      <span className="text-slate-500 shrink-0">Path History:</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-white font-semibold whitespace-nowrap">
                        CAM-01
                      </span>
                      <span className="text-slate-600">→</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-white font-semibold whitespace-nowrap">
                        CORRIDOR A
                      </span>
                      <span className="text-slate-600">→</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-white font-semibold whitespace-nowrap">
                        CAM-03
                      </span>
                      <span className="text-slate-600">→</span>
                      <span className="px-1.5 py-0.5 rounded bg-rose-950 border border-rose-700 text-rose-200 font-bold whitespace-nowrap">
                        STAIRCASE B
                      </span>
                    </div>
                  </div>

                  {/* Person P-014 Stationary Example */}
                  <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1 text-xs font-mono">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                        <span>PERSON P-014</span>
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-red-950 border border-red-800 text-[10px] font-bold text-red-300 uppercase">
                        CRITICAL: Stationary near fire
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Location: Server Hub 204 Entry Vestibule · Exposure: 125s · Extraction Unit: Bravo Assigned
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 4 & 8: Dynamic Crowd Flow & Bottleneck Prediction */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-3.5 space-y-2.5 shadow-xl">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span>CROWD-FLOW & BOTTLENECK PREDICTION</span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">OPTICAL FLOW</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-500">CROWD DENSITY</div>
                    <div className="text-sm font-bold text-white mt-0.5">{crowdFlow.density}</div>
                    <div className="text-[10px] text-slate-400">Vel: {crowdFlow.velocityMps} m/s</div>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-500">FLOW DIRECTION</div>
                    <div className="text-xs font-bold text-amber-300 mt-0.5 truncate">{crowdFlow.flowDirection}</div>
                    <div className="text-[10px] text-slate-400 truncate">Adaptive Graph</div>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-500">CONGESTION LEVEL</div>
                    <div className="text-sm font-bold text-rose-400 mt-0.5">{crowdFlow.congestionPercent}%</div>
                    <div className="text-[10px] text-rose-500 font-semibold">{crowdFlow.bottleneckRisk} RISK</div>
                  </div>
                </div>

                <div className="p-2 rounded bg-rose-950/30 border border-rose-800/50 text-[11px] text-rose-200 font-mono space-y-0.5">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="truncate">PREDICTED BOTTLENECK: {crowdFlow.bottleneckLocation}</span>
                  </div>
                  <div className="text-[10px] text-slate-300">{crowdFlow.recommendedDiversion}</div>
                </div>
              </div>

              {/* Feature 6 & 7: Fire & Smoke Propagation Timeline & Danger Zones */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Propagation Timeline */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-2 shadow-xl">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span>PROPAGATION TIMELINE</span>
                  </div>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {propagationTimeline.length > 0 ? (
                      propagationTimeline.map((item, idx) => (
                        <div key={idx} className="p-1.5 rounded bg-slate-950 border border-slate-800/80 text-[10px] font-mono space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="text-rose-400 font-bold">{item.elapsedTime}</span>
                            <span className="text-slate-500">{item.timestamp}</span>
                          </div>
                          <div className="text-white font-medium">{item.event}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-[10px] text-slate-500 py-3 text-center font-mono">
                        No combustion propagation. Nominal baseline.
                      </div>
                    )}
                  </div>
                </div>

                {/* Live Danger-Zone Mapping */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-2 shadow-xl">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span>DYNAMIC DANGER ZONES</span>
                  </div>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {dangerZones.map((zone) => (
                      <div
                        key={zone.id}
                        className={`p-1.5 rounded border text-[10px] font-mono flex items-center justify-between ${getDangerZoneBg(zone.riskLevel)}`}
                      >
                        <div>
                          <div className="font-bold text-white">{zone.name}</div>
                          <div className="text-[9px] text-slate-400">Occupants: {zone.occupantCount}</div>
                        </div>
                        <span className="font-bold uppercase px-1.5 py-0.5 rounded bg-slate-950/80">
                          {zone.riskLevel}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACTIVE OPTICAL CCTV STREAM VIEWPORT */}
          {centerTab === 'feed' && (
            <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl space-y-2">
              <div className="aspect-video relative overflow-hidden bg-slate-950">
                <img
                  src={currentCam.activeImage}
                  alt={currentCam.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
                <div className="absolute inset-0 cctv-scanline opacity-50 pointer-events-none" />

                {/* Computer Vision Detections Matching Visual Scene */}
                {currentCam.detections.map((det) => (
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
                        ? 'border-rose-500 bg-rose-500/15'
                        : det.category === 'smoke'
                        ? 'border-amber-400 bg-amber-400/15'
                        : det.category === 'obstacle'
                        ? 'border-red-600 bg-red-600/25'
                        : det.category === 'crowd'
                        ? 'border-cyan-400 bg-cyan-400/15'
                        : 'border-emerald-400 bg-emerald-400/10'
                    }`}
                  >
                    <div className="absolute -top-5 left-0 px-1.5 py-0.5 bg-slate-950/90 text-[10px] font-mono font-bold tracking-tight text-white whitespace-nowrap border border-slate-700 flex items-center gap-1 shadow-md">
                      <span>{det.label}</span>
                      <span className="text-slate-400">{det.confidence}%</span>
                    </div>
                  </div>
                ))}

                {/* HUD Header */}
                <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex items-center gap-1.5 sm:gap-2 bg-slate-950/85 backdrop-blur-sm px-2 sm:px-2.5 py-1 rounded text-[11px] sm:text-xs font-mono text-slate-200 border border-slate-800">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span className="font-bold">{currentCam.id}</span>
                  <span className="text-slate-500 hidden sm:inline">·</span>
                  <span className="text-white font-medium truncate max-w-[120px] sm:max-w-none">{currentCam.name}</span>
                </div>

                {/* Fullscreen / Focus Action & FPS */}
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-sm px-2 py-1 rounded text-[11px] font-mono text-slate-300 border border-slate-800">
                  <button
                    onClick={() => setFullscreenCam(currentCam)}
                    className="flex items-center gap-1 text-slate-300 hover:text-white cursor-pointer"
                    title="Open Fullscreen Focused View"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="hidden sm:inline">Focus</span>
                  </button>
                  <span className="text-slate-600">·</span>
                  <span className="text-emerald-400">{currentCam.fps} FPS</span>
                </div>

                {/* Detection State Badge Bottom Left */}
                <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 bg-slate-950/90 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-800 text-[11px] font-mono space-y-0.5">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    {currentCam.hasFire && <Flame className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                    {currentCam.hasSmoke && <Wind className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                    <span className="truncate">{currentCam.statusText}</span>
                  </div>
                </div>

                {/* People Count Badge Bottom Right */}
                <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 bg-slate-950/90 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-800 text-[11px] font-mono text-right">
                  <div className="font-bold text-white">
                    {currentCam.peopleCount} <span className="text-slate-400 font-normal">in frame</span>
                  </div>
                </div>
              </div>

              {/* Related Cameras Quick Switch */}
              <div className="p-2.5 sm:p-3 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <span className="text-slate-400">CORRELATED CAMERAS:</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {currentCam.relatedCameras.map((rc) => (
                    <button
                      key={rc}
                      onClick={() => {
                        const target = cameras.find((c) => c.id === rc);
                        if (target) setSelectedCamera(target);
                      }}
                      className="px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-800 text-rose-300 border border-slate-700 font-bold cursor-pointer"
                    >
                      {rc}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FALSE-ALARM CONTEXT VERIFICATION & CORRELATION DETAILS */}
          {centerTab === 'correlation' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-4 space-y-3 shadow-xl">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>FALSE-ALARM CONTEXT VERIFICATION</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 font-mono text-[10px]">
                  {falseAlarmVerification.verificationStatus}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex flex-wrap justify-between gap-1 border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">Primary Observation ({falseAlarmVerification.primaryCamera}):</span>
                  <span className="text-amber-400 font-bold">
                    {falseAlarmVerification.primaryDetection} ({falseAlarmVerification.primaryConfidence}%)
                  </span>
                </div>

                <div className="space-y-1 pt-1">
                  <div className="text-[10px] text-slate-500 uppercase">Cross-Check Confirmation:</div>
                  {falseAlarmVerification.crossCheckCameras.map((c, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-300">{c.camera}: {c.reading}</span>
                      <span className="text-emerald-400 font-bold">{c.confidence}%</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400 font-bold">Fused Cross-Camera Confidence:</span>
                  <span className="text-emerald-400 font-extrabold text-sm">{falseAlarmVerification.overallConfidence}%</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 font-mono leading-relaxed bg-slate-950/60 p-2.5 rounded border border-slate-800/80">
                {falseAlarmVerification.reasoning}
              </p>
            </div>
          )}
        </div>

        {/* ====================================================== */}
        {/* RIGHT COLUMN: AI Emergency Intelligence Panel          */}
        {/* Mobile: order-2 | Tablet: order-3 (2-col) | Desktop: lg:col-span-4 */}
        {/* ====================================================== */}
        <div className="order-2 md:order-3 lg:order-3 md:col-span-2 lg:col-span-4 space-y-3">
          {/* Feature 15: Emergency Event Summarization */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-3.5 space-y-2.5 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <BrainCircuit className="w-4 h-4 text-purple-400" />
                <span>AI EMERGENCY INTELLIGENCE SUMMARY</span>
              </div>
              <button
                onClick={triggerAiSceneSynthesis}
                disabled={isAiSynthesizing}
                className="text-[10px] font-mono text-purple-300 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>{isAiSynthesizing ? 'Synthesizing...' : 'Update AI Brief'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {aiGeneratedSummary ? aiGeneratedSummary : incident.executiveSceneSummary}
            </p>
          </div>

          {/* Tablet 2-column split for secondary operational cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3">
            {/* Feature 12: Real-Time Risk Level Assessment Breakdown */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-3.5 space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>RISK-LEVEL ASSESSMENT</span>
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${riskBadgeStyles[incident.overallRisk]}`}>
                  {incident.overallRisk}
                </span>
              </div>

              <div className="text-[11px] text-slate-300 font-sans space-y-1 pt-1">
                <div className="text-[10px] font-mono uppercase text-slate-500">Why Risk Level Changed:</div>
                <ul className="space-y-1 pl-3 list-disc text-slate-300 marker:text-rose-500 text-[11px]">
                  {riskExplanationBullets.map((bullet, idx) => (
                    <li key={idx} className="leading-snug">{bullet}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Feature 3: People-at-Risk Identification */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-3.5 space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>PEOPLE AT RISK: {incident.peopleAtRiskCount < 10 ? `0${incident.peopleAtRiskCount}` : incident.peopleAtRiskCount}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">PRIORITY TARGETS</span>
              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {vulnerablePeople.map((person) => (
                  <div key={person.id} className="p-2 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{person.id} ({person.camera})</span>
                      <span className={`px-1 rounded text-[9px] font-bold uppercase ${
                        person.riskLevel === 'critical' ? 'text-rose-400 bg-rose-950' : 'text-amber-400 bg-amber-950'
                      }`}>
                        {person.riskLevel}
                      </span>
                    </div>
                    <div className="text-slate-400 text-[10px]">{person.riskReason}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature 5 & 13: Emergency Exits & Dynamic Evacuation Guidance */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-3.5 space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <div className="flex items-center gap-1.5">
                  <DoorOpen className="w-4 h-4 text-emerald-400" />
                  <span>EMERGENCY EXITS & EVACUATION</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400">DYNAMIC GUIDANCE</span>
              </div>

              <div className="space-y-1.5">
                {exits.map((ex) => (
                  <div
                    key={ex.id}
                    className={`p-2 rounded border text-[11px] font-mono flex items-center justify-between ${
                      ex.status === 'blocked'
                        ? 'bg-rose-950/40 border-rose-800 text-rose-300'
                        : ex.status === 'crowded'
                        ? 'bg-amber-950/40 border-amber-800 text-amber-300'
                        : 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-bold text-white truncate">{ex.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{ex.recommendation}</div>
                    </div>
                    <span className="uppercase font-bold px-1.5 py-0.5 rounded bg-slate-950/80 text-[10px] shrink-0">
                      {ex.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature 10 & 14: Responder Priority & Blind-Spot Awareness */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-3.5 space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <div className="flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-amber-400" />
                  <span>RESPONDER PRIORITIES</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">DISPATCH QUEUE</span>
              </div>

              <div className="space-y-1.5">
                {incident.responderPriorities.map((item) => (
                  <div
                    key={item.rank}
                    className="p-2 rounded bg-slate-950/80 border border-slate-800 text-xs flex items-start gap-2"
                  >
                    <span className="w-5 h-5 rounded bg-slate-900 border border-slate-700 flex items-center justify-center font-mono font-bold text-rose-400 text-[10px] shrink-0">
                      {item.rank}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200 text-xs truncate">{item.zone}</span>
                        <span className="text-[10px] font-mono text-amber-400 uppercase font-semibold">
                          {item.priorityLevel}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">{item.actionGuidance}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Feature 14: Camera Blind-Spot Awareness Box */}
              <div className="p-2 rounded bg-slate-950 border border-amber-900/60 text-[10px] font-mono space-y-0.5">
                <div className="flex items-center justify-between text-amber-300 font-bold">
                  <span>CAMERA COVERAGE: 92%</span>
                  <span className="px-1 rounded bg-amber-950 border border-amber-800 text-[9px]">UNVERIFIED AREA</span>
                </div>
                <div className="text-slate-400 text-[10px]">
                  BLIND SPOT: Zone D — Stairwell (sub-landing). Ground teams must verify manually.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================== */}
        {/* LEFT COLUMN: Multi-Camera Feeds Grid                   */}
        {/* Mobile: order-3 | Tablet: order-1 (col-1) | Desktop: lg:col-span-3 */}
        {/* ====================================================== */}
        <div className="order-3 md:order-1 lg:order-1 md:col-span-1 lg:col-span-3 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-1 border-b border-slate-800">
            <span className="font-bold text-slate-300">8 DISTINCT LOCATIONS</span>
            <span className="text-[10px] text-rose-400 font-semibold">● SYNC INGEST</span>
          </div>

          {/* Responsive Camera Grid: 1-col on mobile/desktop sidebar, 1-col on tablet sidebar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2 max-h-[780px] overflow-y-auto pr-1">
            {cameras.map((cam) => {
              const isSelected = currentCam.id === cam.id;
              const hasAlert = cam.hasFire || cam.hasSmoke || cam.status === 'BLOCKED' || cam.status === 'CONGESTED';

              return (
                <div
                  key={cam.id}
                  onClick={() => {
                    setSelectedCamera(cam);
                    setCenterTab('feed');
                  }}
                  className={`p-2 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-rose-500/80 shadow-md ring-1 ring-rose-500/40'
                      : hasAlert
                      ? 'bg-slate-950/90 border-amber-900/60 hover:border-amber-700'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex gap-2.5">
                    {/* Camera Thumbnail */}
                    <div className="w-24 sm:w-28 h-16 rounded overflow-hidden relative shrink-0 bg-slate-900 border border-slate-800">
                      <img
                        src={cam.activeImage}
                        alt={cam.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 cctv-scanline opacity-40 pointer-events-none" />
                      <div className="absolute top-1 left-1 bg-slate-950/85 px-1 rounded text-[9px] font-mono text-white">
                        {cam.id}
                      </div>
                      {cam.hasFire && (
                        <div className="absolute top-1 right-1 bg-rose-600 px-1 rounded text-[8px] font-bold text-white uppercase animate-pulse">
                          FIRE
                        </div>
                      )}
                      {!cam.hasFire && cam.hasSmoke && (
                        <div className="absolute top-1 right-1 bg-amber-500 px-1 rounded text-[8px] font-bold text-black uppercase">
                          SMOKE
                        </div>
                      )}
                    </div>

                    {/* Camera Metadata */}
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-white truncate">{cam.id}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setFullscreenCam(cam);
                          }}
                          className="p-1 text-slate-400 hover:text-white"
                          title="Open Focused View"
                        >
                          <Maximize2 className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-[11px] font-medium text-slate-300 truncate">{cam.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">{cam.location}</div>

                      <div className="flex items-center justify-between pt-1 text-[10px] font-mono">
                        <span className={`px-1.5 py-0.2 rounded border text-[9px] uppercase ${getStatusBadge(cam.status)}`}>
                          {cam.statusText}
                        </span>
                        <span className="text-slate-400">
                          {cam.peopleCount} <Users className="w-2.5 h-2.5 inline text-slate-500" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* Feature 9: Live Incident Timeline Chronology             */}
      {/* ======================================================== */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-4 shadow-xl space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-white font-bold">
            <Clock className="w-4 h-4 text-rose-400" />
            <span>Multi-Camera Incident Timeline Chronology (Live Audit)</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {incident.timeline.length} Events
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
          {incident.timeline.slice(-4).map((item) => (
            <div
              key={item.id}
              className="p-2 sm:p-2.5 rounded bg-slate-950/80 border border-slate-800 text-xs font-mono space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[10px]">{item.timecode}</span>
                <span className="text-rose-400 font-bold text-[10px]">{item.camera}</span>
              </div>
              <div className="text-slate-200 font-semibold text-[11px] truncate">{item.title}</div>
              <div className="text-slate-400 text-[10px] leading-tight line-clamp-2">{item.detail}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* FULLSCREEN / FOCUSED CAMERA INSPECTION MODAL             */}
      {/* ======================================================== */}
      {fullscreenCam && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">
            {/* Modal Header */}
            <div className="p-3 sm:p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                <span className="font-bold text-white text-sm">{fullscreenCam.id}</span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-300 font-medium">{fullscreenCam.name}</span>
                <span className="text-slate-500 hidden sm:inline">·</span>
                <span className="text-slate-400 hidden sm:inline">{fullscreenCam.location}</span>
              </div>
              <button
                onClick={() => setFullscreenCam(null)}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Viewport with CV bounding boxes */}
            <div className="aspect-video relative overflow-hidden bg-slate-950 w-full flex-1">
              <img
                src={fullscreenCam.activeImage}
                alt={fullscreenCam.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 cctv-scanline opacity-40 pointer-events-none" />

              {/* Bounding boxes */}
              {fullscreenCam.detections.map((det) => (
                <div
                  key={det.id}
                  style={{
                    top: `${det.box.ymin}%`,
                    left: `${det.box.xmin}%`,
                    width: `${det.box.xmax - det.box.xmin}%`,
                    height: `${det.box.ymax - det.box.ymin}%`,
                  }}
                  className="absolute border-2 border-rose-500 bg-rose-500/15 pointer-events-none"
                >
                  <div className="absolute -top-5 left-0 px-1.5 py-0.5 bg-slate-950/90 text-[10px] font-mono font-bold text-white border border-slate-700">
                    {det.label} ({det.confidence}%)
                  </div>
                </div>
              ))}

              <div className="absolute bottom-3 left-3 bg-slate-950/90 px-3 py-1.5 rounded border border-slate-800 text-xs font-mono">
                Status: <strong className="text-white">{fullscreenCam.statusText}</strong> · Occupants: <strong className="text-white">{fullscreenCam.peopleCount}</strong>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <div className="text-slate-400">
                Incident Role: <span className="text-slate-200">{fullscreenCam.incidentRelationship}</span>
              </div>
              <button
                onClick={() => {
                  setSelectedCamera(fullscreenCam);
                  setFullscreenCam(null);
                  setCenterTab('feed');
                }}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer"
              >
                Set as Active Center View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
