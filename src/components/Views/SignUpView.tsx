import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { UserRole } from '../../types';
import {
  Flame,
  User,
  Mail,
  Phone,
  Building,
  Lock,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  KeyRound,
} from 'lucide-react';
import imgEnvironmentSky from '../../assets/images/arch_environment_daylight_1790962482173.jpg';

export const SignUpView: React.FC = () => {
  const { setCurrentView, setActiveRole } = useSimulation();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('emergency_officer');
  const [adminSecurityPasskey, setAdminSecurityPasskey] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters with alphanumeric credentials.');
      return;
    }

    // Role Verification Safeguard: Admin requires Marshal Clearance Key
    if (selectedRole === 'admin') {
      if (adminSecurityPasskey.trim() !== 'MARSHAL-9021' && adminSecurityPasskey.trim() !== 'ADMIN') {
        setErrorMsg('ADMIN ROLE RESTRICTED: Requires verified Marshal Security Passkey (e.g. MARSHAL-9021).');
        return;
      }
    }

    setErrorMsg(null);
    setSuccessMsg('Account registered and role verified! Redirecting to Command Center...');
    setActiveRole(selectedRole);

    setTimeout(() => {
      setCurrentView('live_scene');
    }, 1200);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 lg:p-8 bg-slate-950 text-slate-100 overflow-y-auto">
      {/* Background with Scrim */}
      <div className="fixed inset-0 z-0">
        <img
          src={imgEnvironmentSky}
          alt="Architectural Campus"
          className="w-full h-full object-cover filter brightness-[0.38] contrast-[1.15]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/65" />
      </div>

      <div className="relative z-10 w-full max-w-xl my-8 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/70 border border-rose-800 text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <span>OFFICIAL CLEARANCE REGISTRATION</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Create Official Credentials
          </h1>

          <p className="text-xs text-slate-400 font-mono">
            Trained emergency officers & authorized personnel portal.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-950/80 border border-rose-800 text-xs text-rose-300 font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-700 text-xs text-emerald-200 font-mono flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Officer J. Doe"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Official Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="j.doe@safety.gov"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 234-5678"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Organization / Department
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Metro Fire District #14"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Select Operational Role
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'emergency_officer' as UserRole, label: 'Emergency Officer' },
                { id: 'fire_officer' as UserRole, label: 'Fire Officer' },
                { id: 'admin' as UserRole, label: 'Admin (Restricted)' },
                { id: 'viewer' as UserRole, label: 'Viewer' },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRole(r.id)}
                  className={`p-2.5 rounded-lg border text-xs font-medium text-center transition-all ${
                    selectedRole === r.id
                      ? 'bg-rose-950/80 border-rose-500 text-white font-bold shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Admin Clearance Passkey Requirement */}
          {selectedRole === 'admin' && (
            <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/80 space-y-2 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-300">
                <KeyRound className="w-4 h-4 text-purple-400" />
                <span>MARSHAL CLEARANCE PASSKEY REQUIRED</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Administrative roles manage live building sensors, user roles, and security logs. Enter your organization marshal security passkey (demo passkey: <strong>MARSHAL-9021</strong>).
              </p>
              <input
                type="text"
                value={adminSecurityPasskey}
                onChange={(e) => setAdminSecurityPasskey(e.target.value)}
                placeholder="Enter Marshal Passkey"
                className="w-full bg-slate-950 border border-purple-800/80 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-rose-950/60 flex items-center justify-center gap-2"
          >
            <span>REGISTER & VERIFY CLEARANCE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
          Already registered?{' '}
          <button
            onClick={() => setCurrentView('signin')}
            className="text-rose-400 hover:underline font-semibold"
          >
            Sign In to Command Center
          </button>
        </div>
      </div>
    </div>
  );
};
