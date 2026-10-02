import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import {
  Flame,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import imgEnvironmentSky from '../../assets/images/arch_environment_daylight_1790962482173.jpg';

export const ForgotPasswordView: React.FC = () => {
  const { setCurrentView } = useSimulation();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 lg:p-8 bg-slate-950 text-slate-100 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={imgEnvironmentSky}
          alt="Architectural Campus"
          className="w-full h-full object-cover filter brightness-[0.38] contrast-[1.15]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/60" />
      </div>

      <div className="relative z-10 w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/70 border border-rose-800 text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <span>CREDENTIAL RECOVERY</span>
          </div>

          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Reset Clearance Password
          </h1>

          <p className="text-xs text-slate-400 font-mono">
            Enter your official email to receive security verification instructions.
          </p>
        </div>

        {submitted ? (
          <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-700 text-xs text-emerald-200 font-mono space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Recovery Link Dispatched</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              A cryptographically signed password reset token has been dispatched to <strong>{email}</strong>. Check your departmental inbox.
            </p>
            <button
              onClick={() => setCurrentView('signin')}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white rounded text-xs font-semibold"
            >
              Return to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Registered Department Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="officer@firenexus-command.gov"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-rose-950/60 flex items-center justify-center gap-2"
            >
              <span>SEND RECOVERY INSTRUCTIONS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
          <button
            onClick={() => setCurrentView('signin')}
            className="hover:text-white transition-colors"
          >
            ← Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
