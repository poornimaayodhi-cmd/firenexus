import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import {
  BrainCircuit,
  Flame,
  Users,
  Compass,
  Radio,
  MapPin,
  TrendingUp,
  AlertOctagon,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Layers,
  CheckCircle2,
  Eye,
} from 'lucide-react';

export const SceneUnderstandingView: React.FC = () => {
  const {
    incident,
    currentStepIndex,
    currentStep,
    dangerZones,
    exits,
    trackedEntities,
    setCurrentView,
    isAiSynthesizing,
    triggerAiSceneSynthesis,
    aiGeneratedSummary,
  } = useSimulation();

  const answers = [
    {
      question: 'WHAT IS HAPPENING?',
      badge: 'Active Incident',
      color: 'border-rose-500/80',
      content:
        'Active electrical fire outbreak in Floor 2 Utility Hub 204 (412°C combustion core) with dense smoke billowing through Corridor 2W. Structural acoustic ceiling collapse has blocked primary West Exit B.',
    },
    {
      question: 'WHERE?',
      badge: 'Geospatial Locus',
      color: 'border-amber-500/80',
      content:
        'Floor 2 / West Wing (Sector Zone A & Zone B). Contamination advancing eastward along upper ceiling return plenum towards Central Atrium concourse.',
    },
    {
      question: 'WHO IS AT RISK?',
      badge: 'Occupant Vulnerability',
      color: 'border-rose-500/80',
      content: `31 occupants currently in West Wing Zone B heading toward dead-end Exit B. Person #104 is disoriented and isolated in Corridor 2W (smoke exposure 74s, visibility < 2.5m).`,
    },
    {
      question: 'HOW IS IT CHANGING?',
      badge: 'Propagation Trend',
      color: 'border-purple-500/80',
      content:
        'Fire combustion expanding along ceiling cable tray (0.08 m/s). Corridor smoke plume dispersing eastward at 0.35 m/s. Danger Zone B expanding into Central Atrium threshold.',
    },
    {
      question: 'WHICH AREAS REQUIRE ATTENTION?',
      badge: 'Responder Priority',
      color: 'border-cyan-500/80',
      content:
        'Priority 1: Zone B Corridor 2W for occupant interception & Person #104 extraction. Priority 2: Exit B breach / debris clearance. Priority 3: Utility 204 electrical suppression.',
    },
    {
      question: 'WHAT ROUTES ARE AVAILABLE?',
      badge: 'Egress Guidance',
      color: 'border-emerald-500/80',
      content:
        'Staircase C (East Wing) is 100% CLEAR and operating normally (42 occupants/min throughput). Staircase A (North Wing) is clear as secondary route. DO NOT ROUTE TO STAIRCASE B.',
    },
  ];

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400 uppercase tracking-wider mb-1">
            <span>Stage 04</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Master Situational Scene Understanding</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Unified Emergency Scene Intelligence
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            The master synthesis engine transforms fragmented computer vision streams into one cohesive, actionable operational picture answering the 6 fundamental command questions.
          </p>
        </div>

        <button
          onClick={triggerAiSceneSynthesis}
          disabled={isAiSynthesizing}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-950/50 transition-all self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4 text-purple-200" />
          <span>{isAiSynthesizing ? 'Re-Synthesizing Model...' : 'Re-Run AI Scene Reasoning'}</span>
        </button>
      </div>

      {/* AI Executive Scene Summary Banner */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-slate-900 via-purple-950/20 to-slate-900 border border-purple-800/40 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
            <BrainCircuit className="w-4 h-4 text-purple-400" />
            <span>EXECUTIVE EMERGENCY SCENE SUMMARY</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            CONFIDENCE: <strong className="text-white">{incident.confidenceScore}%</strong>
          </span>
        </div>

        <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed">
          {aiGeneratedSummary ? aiGeneratedSummary : incident.executiveSceneSummary}
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-purple-900/40 text-xs font-mono">
          <div>
            <span className="text-slate-400">OVERALL RISK:</span>{' '}
            <strong className="text-rose-400 uppercase">{incident.overallRisk}</strong>
          </div>
          <div>
            <span className="text-slate-400">OCCUPANTS AT RISK:</span>{' '}
            <strong className="text-white">{incident.peopleAtRiskCount}</strong>
          </div>
          <div>
            <span className="text-slate-400">PRIMARY CORRIDOR:</span>{' '}
            <strong className="text-emerald-400">{incident.currentEvacuationRoute}</strong>
          </div>
        </div>
      </div>

      {/* The 6 Fundamental Emergency Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {answers.map((item, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-xl bg-slate-900/80 border ${item.color} space-y-3 flex flex-col justify-between shadow-lg`}
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono font-bold text-slate-400">{item.badge}</span>
                <span className="font-mono text-slate-500">0{idx + 1}</span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">{item.question}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{item.content}</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Verified multi-spectral context</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>
        ))}
      </div>

      {/* Multi-Camera Spatio-Temporal Correlation Matrix */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white">
              Multi-Camera Correlation Binding Matrix
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Fused Feeds: CAM-01 + CAM-03 + CAM-05 + CAM-07
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="py-2.5 px-3">Camera Node</th>
                <th className="py-2.5 px-3">Zone Observed</th>
                <th className="py-2.5 px-3">Detection Element</th>
                <th className="py-2.5 px-3">Cross-Camera Correlation</th>
                <th className="py-2.5 px-3">Operational Deduction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-2.5 px-3 font-bold text-rose-400">CAM-04</td>
                <td className="py-2.5 px-3">Server Hub 204</td>
                <td className="py-2.5 px-3">Active Combustion (412°C)</td>
                <td className="py-2.5 px-3 text-slate-400">Binds to CAM-02 smoke plume</td>
                <td className="py-2.5 px-3 text-white">Origin point of thermal plume</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-amber-400">CAM-02</td>
                <td className="py-2.5 px-3">West Corridor 2W</td>
                <td className="py-2.5 px-3">Smoke Haze + Person #104 & P-027</td>
                <td className="py-2.5 px-3 text-slate-400">Binds to CAM-05 egress hazard</td>
                <td className="py-2.5 px-3 text-white">Corridor visibility &lt; 3m; rapid dispersion</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-rose-500">CAM-05</td>
                <td className="py-2.5 px-3">Staircase B Entry</td>
                <td className="py-2.5 px-3">Obstruction / Fallen ceiling</td>
                <td className="py-2.5 px-3 text-slate-400">Binds to crowd flow from CAM-03</td>
                <td className="py-2.5 px-3 text-rose-400 font-bold">Fatal bottleneck averted by East reroute</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-emerald-400">CAM-08</td>
                <td className="py-2.5 px-3">East Concourse / Staircase C</td>
                <td className="py-2.5 px-3">Occupants in orderly egress</td>
                <td className="py-2.5 px-3 text-slate-400">East Wing clear corridor</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">Confirmed viable primary egress path</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature 14 & 11: Blind Spot Awareness & False Alarm Verification Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Blind-Spot Awareness */}
        <div className="bg-slate-900/80 border border-amber-900/60 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-sm flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-400" />
              <span>Camera Blind-Spot Awareness Engine</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-800 text-[10px] font-mono text-amber-300 font-bold">
              COVERAGE: 92%
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 rounded bg-slate-950 border border-amber-800/60 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-amber-300">Zone D — West Stairwell Sub-Landing</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 font-bold text-[9px]">
                  UNVERIFIED AREA
                </span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Reason: Concrete structural shear wall obstructs direct CCTV sightline. Do not assume safe.
              </p>
              <div className="text-emerald-400 text-[10px] font-semibold">
                Action: Dispatch Search Team Alpha-1 to physically verify clear status.
              </div>
            </div>
          </div>
        </div>

        {/* False-Alarm Context Verification */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>False-Alarm Multi-Spectral Verification</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-[10px] font-mono text-emerald-300 font-bold">
              VERIFIED: 94% CONFIDENCE
            </span>
          </div>

          <div className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
            <div className="text-slate-300 text-[11px] leading-relaxed">
              Optical smoke particulate signature on CAM-03 cross-validated with 142°C thermal rise on CAM-04 and ceiling dispersion layer on CAM-02.
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between text-[11px]">
              <span className="text-slate-500">False-Positive Probability:</span>
              <strong className="text-emerald-400 font-bold">&lt; 0.3% (Confirmed Real Incident)</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
