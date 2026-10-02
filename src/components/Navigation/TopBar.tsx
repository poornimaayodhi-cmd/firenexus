import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { ViewNavigation, UserRole } from '../../types';
import {
  ShieldAlert,
  Radio,
  Flame,
  User,
  ChevronDown,
  Activity,
  Layers,
  LogOut,
  Sliders,
  FileText,
  AlertTriangle,
  Compass,
  Menu,
  X,
  Eye,
  Crosshair,
  Search,
  BrainCircuit,
  Box,
} from 'lucide-react';

interface TopBarProps {
  onOpenAuth: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenAuth }) => {
  const {
    currentView,
    setCurrentView,
    activeRole,
    setActiveRole,
    currentUser,
    incident,
  } = useSimulation();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Role permissions
  const isAdmin = activeRole === 'admin';

  // Primary 6 nav links with dedicated icons for mobile drawer
  const primaryLinks: { id: ViewNavigation; label: string; icon: React.ReactNode }[] = [
    { id: 'live_scene', label: 'Live Scene', icon: <Radio className="w-4 h-4 text-rose-400" /> },
    { id: 'detection', label: 'Detection', icon: <Eye className="w-4 h-4 text-rose-400" /> },
    { id: 'tracking', label: 'Tracking', icon: <Crosshair className="w-4 h-4 text-amber-400" /> },
    { id: 'inspection', label: 'Inspection', icon: <Search className="w-4 h-4 text-cyan-400" /> },
    { id: 'scene_understanding', label: 'Scene Understanding', icon: <BrainCircuit className="w-4 h-4 text-purple-400" /> },
    { id: '3d_environment', label: '3D Building', icon: <Box className="w-4 h-4 text-emerald-400" /> },
  ];

  // Secondary nav links in dropdown & mobile drawer
  const secondaryLinks: { id: ViewNavigation; label: string; icon: React.ReactNode }[] = [
    { id: 'incidents', label: 'Incidents', icon: <Flame className="w-4 h-4 text-rose-400" /> },
    { id: 'response', label: 'Response', icon: <Radio className="w-4 h-4 text-amber-400" /> },
    { id: 'analytics', label: 'Analytics', icon: <Activity className="w-4 h-4 text-cyan-400" /> },
    { id: 'reports', label: 'Reports', icon: <FileText className="w-4 h-4 text-emerald-400" /> },
    ...(isAdmin
      ? [{ id: 'admin' as ViewNavigation, label: 'Admin Console', icon: <Sliders className="w-4 h-4 text-purple-400" /> }]
      : []),
  ];

  const handleNavClick = (view: ViewNavigation) => {
    setCurrentView(view);
    setIsMoreDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const roleLabels: Record<UserRole, string> = {
    emergency_officer: 'Emergency Officer',
    fire_officer: 'Fire Officer',
    operator: 'Surveillance Operator',
    admin: 'Administrator',
    viewer: 'Viewer (Read-Only)',
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-3 sm:px-4 lg:px-6 h-14 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80">
      {/* Zone 1: Brand Wordmark (Strict single-element display) */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={() => setCurrentView('landing')}
          className="group flex items-center gap-2 text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-rose-500 rounded shrink-0 cursor-pointer"
        >
          <div className="w-7 h-7 rounded bg-gradient-to-tr from-rose-600 via-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-rose-950/50 shrink-0">
            <Flame className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm sm:text-base font-extrabold tracking-wider text-white group-hover:text-rose-400 transition-colors uppercase">
            FIRENEXUS
          </span>
        </button>

        {/* Quiet situational marker (Responsive text truncation) */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 pl-3 border-l border-slate-800 truncate">
          <span className="font-mono text-rose-400 font-semibold">{incident.id}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-slate-300 font-medium truncate">Floor 2 / West Wing</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className={`font-mono text-xs font-semibold uppercase shrink-0 ${
            incident.overallRisk === 'critical' ? 'text-rose-400' :
            incident.overallRisk === 'high' ? 'text-amber-400' :
            'text-emerald-400'
          }`}>
            {incident.overallRisk} RISK
          </span>
        </div>
      </div>

      {/* Zone 2: Primary Desktop & Tablet Nav Links */}
      <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
        {primaryLinks.map((link) => {
          const isActive = currentView === link.id;
          return (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`px-2.5 lg:px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-slate-800/90 text-white shadow-sm border border-slate-700/60 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              {link.label}
            </button>
          );
        })}

        {/* More dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsMoreDropdownOpen(!isMoreDropdownOpen)}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              secondaryLinks.some((l) => l.id === currentView)
                ? 'bg-slate-800/90 text-white border border-slate-700/60 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <span>More</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isMoreDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-48 bg-slate-900 border border-slate-800 rounded-lg shadow-xl shadow-black/60 p-1.5 z-50">
              {secondaryLinks.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-md text-left transition-colors cursor-pointer ${
                    currentView === item.id
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Zone 3: Role Switcher & Mobile Menu Toggle */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Role Quick Selector */}
        <div className="relative">
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 transition-colors cursor-pointer"
            title={`Active Role: ${roleLabels[activeRole]}`}
          >
            <User className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline font-medium text-xs truncate max-w-[130px]">{roleLabels[activeRole]}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isRoleDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-56 bg-slate-900 border border-slate-800 rounded-lg shadow-xl shadow-black/60 p-1.5 z-50">
              <div className="px-2.5 py-1.5 border-b border-slate-800 mb-1">
                <div className="text-[11px] font-medium text-slate-400">Switch Operational Role</div>
                <div className="text-xs font-semibold text-slate-200">{currentUser.name}</div>
              </div>

              {(['emergency_officer', 'fire_officer', 'operator', 'admin', 'viewer'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setActiveRole(r);
                    setIsRoleDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 text-xs rounded-md text-left transition-colors cursor-pointer ${
                    activeRole === r
                      ? 'bg-rose-950/60 text-rose-300 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{roleLabels[r]}</span>
                  {activeRole === r && <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>}
                </button>
              ))}

              <div className="pt-1 mt-1 border-t border-slate-800 space-y-1">
                <button
                  onClick={() => {
                    setIsRoleDropdownOpen(false);
                    setCurrentView('landing');
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-slate-800 rounded-md cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out (Exit Command)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Launch CTA (Visible across tablets and desktop) */}
        <button
          onClick={() => handleNavClick('live_scene')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-md shadow-sm transition-colors whitespace-nowrap cursor-pointer"
        >
          <Radio className="w-3.5 h-3.5" />
          <span>Command View</span>
        </button>

        {/* Mobile Hamburger Button (Active on < md screens) */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="w-4 h-4 text-rose-400" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile Drawer / Navigation Sheet (< md screens) */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-14 bg-slate-950/98 backdrop-blur-xl border-b border-slate-800 shadow-2xl p-4 space-y-4 max-h-[calc(100vh-3.5rem)] overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Mobile Situational Marker */}
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              <span className="text-white font-bold">{incident.id}</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-300">Floor 2 / West</span>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
              incident.overallRisk === 'critical' ? 'text-rose-400 bg-rose-950 border border-rose-800' : 'text-amber-400 bg-amber-950 border border-amber-800'
            }`}>
              {incident.overallRisk} RISK
            </span>
          </div>

          {/* Primary Mobile Navigation List */}
          <div className="space-y-1">
            <div className="text-[10px] font-mono uppercase text-slate-500 tracking-wider px-2 mb-1">
              Core Intelligence Modules
            </div>
            {primaryLinks.map((link) => {
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-rose-950/80 text-rose-300 border border-rose-800 font-bold'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          {/* Secondary Mobile Modules */}
          <div className="space-y-1 pt-2 border-t border-slate-800">
            <div className="text-[10px] font-mono uppercase text-slate-500 tracking-wider px-2 mb-1">
              Incident & Operations Support
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {secondaryLinks.map((item) => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-slate-800 text-white font-bold border border-slate-700'
                        : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Quick Actions */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => handleNavClick('landing')}
              className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              Public Landing
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenAuth();
              }}
              className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white transition-colors"
            >
              Authentication Portal
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
