import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { ALL_USERS } from '../../data/mockData';
import { UserRole } from '../../types';
import {
  Flame,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  UserCheck,
} from 'lucide-react';
import imgEnvironmentSky from '../../assets/images/arch_environment_daylight_1790962482173.jpg';

export const SignInView: React.FC = () => {
  const { setCurrentView, setActiveRole } = useSimulation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [authSuccessRole, setAuthSuccessRole] = useState<UserRole | null>(null);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter your authorized official email and security password.');
      return;
    }

    // Match existing user or create authenticated session
    const matched = ALL_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() || u.name.toLowerCase().includes(email.toLowerCase())
    );

    const assignedRole = matched ? matched.role : 'emergency_officer';
    setActiveRole(assignedRole);
    setAuthSuccessRole(assignedRole);
    setErrorMsg(null);

    setTimeout(() => {
      setCurrentView('live_scene');
    }, 900);
  };

  const handleQuickDemoLogin = (user: typeof ALL_USERS[0]) => {
    setEmail(user.email);
    setPassword('••••••••••••');
    setActiveRole(user.role);
    setAuthSuccessRole(user.role);
    setErrorMsg(null);

    setTimeout(() => {
      setCurrentView('live_scene');
    }, 700);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 lg:p-8 bg-slate-950 text-slate-100 overflow-hidden">
      {/* Photorealistic Architectural Background with Contrast Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={imgEnvironmentSky}
          alt="Architectural Campus"
          className="w-full h-full object-cover filter brightness-[0.38] contrast-[1.15]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/60" />
      </div>

      {/* Main Authentication Card */}
      <div className="relative z-10 w-full max-w-lg bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/70 border border-rose-800 text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span>FIRENEXUS SECURE GATEWAY</span>
          </div>

          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Sign In to Command Center
          </h1>

          <p className="text-xs text-slate-400 font-mono">
            SEE THE SCENE. UNDERSTAND THE RISK. GUIDE THE RESPONSE.
          </p>
        </div>

        {/* Verification Success Toast */}
        {authSuccessRole && (
          <div className="p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-700 text-xs text-emerald-200 font-mono flex items-center gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="font-bold">Clearance Verified — Entering Command Center</div>
              <div className="text-[11px] text-emerald-400 uppercase">Role: {authSuccessRole.replace('_', ' ')}</div>
            </div>
          </div>
        )}

        {/* Error Feedback */}
        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-950/80 border border-rose-800 text-xs text-rose-300 font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Official Email / Username
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@firenexus-command.gov"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-300">
                Security Password
              </label>
              <button
                type="button"
                onClick={() => setCurrentView('forgot_password')}
                className="text-[11px] text-rose-400 hover:text-rose-300 hover:underline transition-colors"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 rounded bg-slate-950 border-slate-800 text-rose-600 focus:ring-0"
              />
              <span>Remember this station</span>
            </label>
            <span className="text-[11px] font-mono text-slate-500">256-Bit TLS</span>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-rose-950/60 flex items-center justify-center gap-2"
          >
            <span>AUTHENTICATE & ENTER FIRENEXUS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Fast Verified Roles Access */}
        <div className="pt-4 border-t border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>FAST VERIFIED ROLE ACCESS:</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <UserCheck className="w-3 h-3" />
              <span>Auto-Fill Credentials</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {ALL_USERS.map((usr) => (
              <button
                key={usr.id}
                type="button"
                onClick={() => handleQuickDemoLogin(usr)}
                className="p-2.5 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-left transition-all group"
              >
                <div className="font-bold text-white text-[11px] group-hover:text-rose-400 transition-colors truncate">
                  {usr.name}
                </div>
                <div className="text-[10px] text-slate-400 font-mono uppercase mt-0.5">
                  {usr.role.replace('_', ' ')}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer links */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80">
          <button
            onClick={() => setCurrentView('landing')}
            className="hover:text-white transition-colors"
          >
            ← Back to Landing Page
          </button>

          <button
            onClick={() => setCurrentView('signup')}
            className="text-rose-400 hover:underline font-semibold"
          >
            Create New Account →
          </button>
        </div>
      </div>
    </div>
  );
};
