import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { UserRole } from '../../types';
import {
  X,
  ShieldCheck,
  Lock,
  Mail,
  User,
  ArrowRight,
  Flame,
  CheckCircle2,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { activeRole, setActiveRole } = useSimulation();

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signin') {
      setSuccessMessage('Authenticated successfully as command officer.');
    } else if (mode === 'signup') {
      setSuccessMessage('Registration submitted for Marshall clearance.');
    } else {
      setSuccessMessage('Password reset link dispatched to security email.');
    }

    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 1200);
  };

  const handleRoleQuickSelect = (r: UserRole) => {
    setActiveRole(r);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-400 uppercase">
            <Flame className="w-4 h-4 text-rose-500" />
            <span>FIRENEXUS SECURE ACCESS</span>
          </div>
          <h2 className="text-xl font-bold text-white">
            {mode === 'signin' && 'Sign in to Emergency Console'}
            {mode === 'signup' && 'Register Official Credentials'}
            {mode === 'forgot' && 'Reset Security Clearance'}
          </h2>
          <p className="text-xs text-slate-400">
            Authorized for certified public safety officers and building security personnel.
          </p>
        </div>

        {successMessage && (
          <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-800 text-xs text-emerald-300 font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Official Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@publicsafety.gov"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Security Password / Token
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-colors shadow-lg shadow-rose-950/50"
          >
            {mode === 'signin' && 'Authenticate & Enter'}
            {mode === 'signup' && 'Create Emergency Profile'}
            {mode === 'forgot' && 'Send Reset Link'}
          </button>
        </form>

        {/* Mode Switchers */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
          {mode === 'signin' ? (
            <>
              <button onClick={() => setMode('forgot')} className="hover:text-slate-200">
                Forgot password?
              </button>
              <button onClick={() => setMode('signup')} className="text-rose-400 hover:underline">
                Create new account
              </button>
            </>
          ) : (
            <button onClick={() => setMode('signin')} className="text-rose-400 hover:underline">
              Back to sign in
            </button>
          )}
        </div>

        {/* Instant Role Demo Selector */}
        <div className="pt-2 border-t border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 mb-2">
            FAST DEMO ROLE ACCESS:
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleRoleQuickSelect('emergency_officer')}
              className={`p-2 rounded border text-left transition-colors ${
                activeRole === 'emergency_officer'
                  ? 'bg-rose-950/60 border-rose-600 text-white'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-850'
              }`}
            >
              <div className="font-bold text-[11px]">Emergency Officer</div>
              <div className="text-[10px] text-slate-500">Live scene & evacuation</div>
            </button>

            <button
              onClick={() => handleRoleQuickSelect('fire_officer')}
              className={`p-2 rounded border text-left transition-colors ${
                activeRole === 'fire_officer'
                  ? 'bg-rose-950/60 border-rose-600 text-white'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-850'
              }`}
            >
              <div className="font-bold text-[11px]">Fire Officer</div>
              <div className="text-[10px] text-slate-500">Suppression & thermal</div>
            </button>

            <button
              onClick={() => handleRoleQuickSelect('admin')}
              className={`p-2 rounded border text-left transition-colors ${
                activeRole === 'admin'
                  ? 'bg-purple-950/60 border-purple-600 text-white'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-850'
              }`}
            >
              <div className="font-bold text-[11px]">Administrator</div>
              <div className="text-[10px] text-slate-500">Full system access</div>
            </button>

            <button
              onClick={() => handleRoleQuickSelect('viewer')}
              className={`p-2 rounded border text-left transition-colors ${
                activeRole === 'viewer'
                  ? 'bg-cyan-950/60 border-cyan-600 text-white'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-850'
              }`}
            >
              <div className="font-bold text-[11px]">Viewer</div>
              <div className="text-[10px] text-slate-500">Read-only auditing</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
