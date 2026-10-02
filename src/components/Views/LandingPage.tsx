import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { UserRole } from '../../types';
import { ArchitecturalHeroBackground } from './ArchitecturalHeroBackground';
import {
  Flame,
  Eye,
  Crosshair,
  Search,
  BrainCircuit,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  AlertTriangle,
  Compass,
  Layers,
  CheckCircle2,
  Users,
} from 'lucide-react';

import imgLobby from '../../assets/images/cctv_main_lobby_1790962078096.jpg';
import imgWestCorridorNormal from '../../assets/images/cctv_west_corridor_normal_1790962130243.jpg';
import imgWestCorridorSmoke from '../../assets/images/cctv_corridor_smoke_1790961553130.jpg';
import imgTechOffice from '../../assets/images/cctv_tech_office_1790962143252.jpg';
import imgServerNormal from '../../assets/images/cctv_server_normal_1790962155728.jpg';
import imgServerFire from '../../assets/images/cctv_server_fire_1790961565613.jpg';
import imgStaircaseNormal from '../../assets/images/cctv_stairwell_crowd_1790961582076.jpg';
import imgStaircaseBlocked from '../../assets/images/cctv_blocked_exit_1790961594379.jpg';
import imgParking from '../../assets/images/cctv_parking_service_1790962168291.jpg';
import imgWarehouse from '../../assets/images/cctv_warehouse_storage_1790962182956.jpg';
import imgEastCorridor from '../../assets/images/cctv_east_corridor_clean_1790962194612.jpg';

interface LandingPageProps {
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth }) => {
  const { setCurrentView, setActiveRole, goToStep } = useSimulation();

  const handleEnterPlatform = (role: UserRole = 'emergency_officer', step: number = 1) => {
    setActiveRole(role);
    goToStep(step);
    setCurrentView('live_scene');
  };

  const stages = [
    {
      step: '01',
      title: 'Detection',
      subtitle: 'Multi-Object Computer Vision',
      desc: 'Detects fire combustion signatures, smoke plumes, isolated occupants, crowd clusters, structural obstacles, and emergency exit hardware with real-time confidence scores and false-positive context verification.',
      icon: <Eye className="w-5 h-5 text-rose-400" />,
      tag: 'YOLO Computer Vision',
    },
    {
      step: '02',
      title: 'Tracking',
      subtitle: 'Cross-Camera Re-Identification',
      desc: 'Maintains persistent object identities across non-overlapping CCTV views. Tracks person trajectories, optical crowd velocity vectors, fire propagation fronts, and smoke dispersion strata.',
      icon: <Crosshair className="w-5 h-5 text-amber-400" />,
      tag: 'ByteTrack & Re-ID',
    },
    {
      step: '03',
      title: 'Inspection',
      subtitle: 'Contextual Threat Proximity',
      desc: 'Deep-inspects every detected occupant against surrounding environmental hazards: thermal proximity distance, smoke density saturation, nearest exit obstruction status, and movement deceleration.',
      icon: <Search className="w-5 h-5 text-cyan-400" />,
      tag: 'Contextual Spatial Reasoning',
    },
    {
      step: '04',
      title: 'Scene Understanding',
      subtitle: 'Unified Operational Synthesis',
      desc: 'Fuses fragmented camera feeds into one holistic emergency scene model: synthesizes real-time incident risk, ranks responder intervention priorities, and adapts dynamic evacuation guidance.',
      icon: <BrainCircuit className="w-5 h-5 text-purple-400" />,
      tag: 'Incident Correlation Engine',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-rose-500/30 selection:text-rose-200">
      {/* Hero Section with Premium 3D Architectural Environment */}
      <section className="relative px-6 pt-16 pb-20 lg:pt-24 lg:pb-28 overflow-hidden border-b border-slate-900 min-h-[580px] flex items-center justify-center">
        {/* Subtle realistic 3D architectural background */}
        <ArchitecturalHeroBackground />

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-widest text-rose-400 uppercase mb-4 font-mono">
            <span>MULTI-CAMERA FIRE DETECTION, TRACKING & SCENE INTELLIGENCE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none text-balance mb-6">
            FIRENEXUS
            <br />
            <span className="bg-gradient-to-r from-rose-400 via-orange-300 to-amber-200 bg-clip-text text-transparent text-3xl sm:text-5xl lg:text-6xl">
              SEE THE SCENE. UNDERSTAND THE RISK. GUIDE THE RESPONSE.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed text-balance mb-10">
            Next-generation real-time multi-camera scene intelligence platform. Transforms fragmented CCTV camera feeds into unified emergency decision support, cross-camera tracking, and dynamic evacuation guidance.
          </p>

          {/* Action CTAs: Master Prompt Contract */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <button
              onClick={() => handleEnterPlatform('emergency_officer', 1)}
              className="px-7 py-4 text-sm font-extrabold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-xl shadow-rose-950/60 transition-all transform hover:-translate-y-0.5 flex items-center gap-2.5 whitespace-nowrap cursor-pointer"
            >
              <span>ENTER FIRENEXUS</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentView('signin')}
              className="px-6 py-4 text-sm font-bold text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap backdrop-blur-sm cursor-pointer"
            >
              <span>SIGN IN</span>
            </button>

            <button
              onClick={() => setCurrentView('signup')}
              className="px-6 py-4 text-sm font-bold text-slate-300 bg-slate-950/90 hover:bg-slate-900 border border-slate-800 hover:border-rose-900/60 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap backdrop-blur-sm cursor-pointer"
            >
              <span>CREATE ACCOUNT</span>
            </button>
          </div>

          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-400 backdrop-blur-sm shadow-lg">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>AI-Assisted · Human-Controlled Decision Support:</strong> Provides real-time tactical intelligence for certified responders. Does not make autonomous life-safety decisions.
            </span>
          </div>
        </div>
      </section>

      {/* 8 Distinct Camera Feeds Showcase */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
              Building CCTV Ingest (8 Genuinely Distinct Locations)
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              No Duplicate Feeds · Every Camera Has Its Own Scene
            </h2>
          </div>
          <button
            onClick={() => {
              setCurrentView('detection');
              goToStep(1);
            }}
            className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1.5"
          >
            <span>Inspect Live Detection Matrix</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { id: 'CAM-01', location: 'Main Entrance Lobby', desc: 'Turnstiles & Reception', img: imgLobby, status: 'NOMINAL' },
            { id: 'CAM-02', location: 'West Wing Corridor', desc: 'Corridor & Offices', img: imgWestCorridorNormal, status: 'NOMINAL' },
            { id: 'CAM-03', location: 'Tech Office Open Space', desc: 'Workstations & Devs', img: imgTechOffice, status: 'NOMINAL' },
            { id: 'CAM-04', location: 'Data Center / Server Hub 204', desc: 'Server Racks (Incident Locus)', img: imgServerNormal, status: 'ORIGIN' },
            { id: 'CAM-05', location: 'Staircase B (West Wing)', desc: 'Emergency Egress Stairs', img: imgStaircaseNormal, status: 'EGRESS' },
            { id: 'CAM-06', location: 'Basement Parking & Service', desc: 'Vehicle Ramp & Dock', img: imgParking, status: 'NOMINAL' },
            { id: 'CAM-07', location: 'Storage Warehouse', desc: 'Industrial High Racks', img: imgWarehouse, status: 'NOMINAL' },
            { id: 'CAM-08', location: 'East Concourse Corridor', desc: 'Clear Alternative Path', img: imgEastCorridor, status: 'SAFE' },
          ].map((c) => (
            <div
              key={c.id}
              className="group relative rounded-lg overflow-hidden border border-slate-800 bg-slate-900 shadow-md"
            >
              <div className="aspect-video relative overflow-hidden bg-slate-950">
                <img
                  src={c.img}
                  alt={c.location}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 cctv-scanline opacity-50" />
                <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-slate-950/85 px-2 py-0.5 rounded text-[10px] font-mono text-white border border-slate-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>{c.id}</span>
                </div>
                <div className="absolute top-2 right-2 bg-slate-950/85 px-2 py-0.5 rounded text-[9px] font-mono text-slate-400 border border-slate-800">
                  ● SIMULATION
                </div>
              </div>
              <div className="p-3">
                <div className="text-xs font-semibold text-slate-200 truncate">{c.location}</div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                  <span>{c.desc}</span>
                  <span className={c.status === 'SAFE' ? 'text-emerald-400 font-bold' : c.status === 'ORIGIN' ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                    {c.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The Four Core Intelligence Stages */}
      <section className="py-20 px-6 bg-slate-900/40 border-t border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
              The Four Intelligence Stages
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              From Raw Pixels to Emergency Action
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto mt-3 text-sm sm:text-base">
              The platform is built around four rigorous computer vision and spatial reasoning layers.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stages.map((stage) => (
              <div
                key={stage.step}
                className="p-6 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-sm font-bold text-rose-400">
                      STAGE {stage.step}
                    </span>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      {stage.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    {stage.title}
                  </h3>
                  <div className="text-xs text-slate-400 font-medium mb-3">
                    {stage.subtitle}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {stage.desc}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{stage.tag}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 px-6 border-t border-slate-900 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300 tracking-wider">FIRENEXUS</span>
            <span aria-hidden="true">·</span>
            <span>Multi-Camera Fire Detection, Tracking & Scene Intelligence</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onOpenAuth} className="hover:text-slate-300 transition-colors">
              Authentication Portal
            </button>
            <span aria-hidden="true">·</span>
            <span>Emergency Decision Support Protocol</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
