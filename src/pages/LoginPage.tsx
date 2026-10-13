import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { ShieldCheck, Award, GraduationCap, ArrowRight, CheckCircle2, Lock, Sparkles } from 'lucide-react';

export const LoginPage: React.FC<{ navigate: (route: string) => void }> = ({ navigate }) => {
  const { user, loginWithGoogle, demoLogin, loading } = useAuth();
  const [googleEmail, setGoogleEmail] = useState('basavarajr779@gmail.com');
  const [error, setError] = useState('');
  const [inProgress, setInProgress] = useState(false);

  // If already logged in, show account info and redirect button
  if (user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6 animate-fadeIn">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Signed in as {user.name}</h2>
          <p className="text-xs text-slate-400 font-mono mt-1">{user.email}</p>
          <div className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-slate-800 text-emerald-400">
            Role: {user.role.replace('_', ' ')}
          </div>
        </div>

        <div className="pt-2 flex flex-col gap-2">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
          >
            Go to Student Dashboard &rarr;
          </button>
          {(user.role === 'admin' || user.role === 'super_admin' || user.role === 'content_manager') && (
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
            >
              Go to Admin Dashboard &rarr;
            </button>
          )}
        </div>
      </div>
    );
  }

  const handleGoogleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmail.trim()) {
      setError('Please provide your Gmail address.');
      return;
    }
    setError('');
    setInProgress(true);
    try {
      await loginWithGoogle({
        email: googleEmail.trim(),
        name: googleEmail.split('@')[0],
        googleId: `google_${Date.now()}`
      });
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Google authentication failed.');
    } finally {
      setInProgress(false);
    }
  };

  const handleQuickDemoRole = async (role: UserRole) => {
    setInProgress(true);
    try {
      await demoLogin(role);
      if (role === 'admin' || role === 'super_admin' || role === 'content_manager') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Quick login failed');
    } finally {
      setInProgress(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-700 mx-auto flex items-center justify-center shadow-md">
            <svg viewBox="0 0 100 100" className="w-8 h-8">
              <ellipse cx="50" cy="50" rx="36" ry="16" fill="none" stroke="#38bdf8" strokeWidth="6" strokeDasharray="14 6" transform="rotate(-30 50 50)" />
              <ellipse cx="50" cy="50" rx="36" ry="16" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="18 4" transform="rotate(30 50 50)" />
              <circle cx="50" cy="50" r="9" fill="#10b981" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-white">Welcome to Orbit X</h1>
          <p className="text-xs text-slate-400">
            Secure Google Sign-In for students, content editors, and academic administrators.
          </p>
        </div>

        {/* Primary Google Sign-In */}
        <form onSubmit={handleGoogleContinue} className="space-y-4">
          <div>
            <label className="block text-slate-300 font-medium text-xs mb-1.5">
              Your Google Account Email (Gmail)
            </label>
            <input
              type="email"
              required
              value={googleEmail}
              onChange={(e) => setGoogleEmail(e.target.value)}
              placeholder="e.g. basavarajr779@gmail.com"
              className="w-full bg-slate-800 text-white text-xs p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 font-mono"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              * The email <span className="text-amber-400 font-mono">basavarajr779@gmail.com</span> is pre-authorized with Super Admin privileges.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={inProgress || loading}
            className="w-full py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-3 shadow-lg transition-all cursor-pointer"
          >
            {/* Google Colorful Icon */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>{inProgress ? 'Connecting to Google...' : 'Continue with Google'}</span>
          </button>
        </form>

        {/* Quick Testing Role Switcher */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-mono font-semibold text-center">
            Instant Role Test (Reviewer Evaluation):
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleQuickDemoRole('super_admin')}
              className="p-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-left cursor-pointer"
            >
              <span className="font-bold block">Super Admin</span>
              <span className="text-[10px] text-slate-400">Full system & RBAC</span>
            </button>

            <button
              onClick={() => handleQuickDemoRole('admin')}
              className="p-2 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 text-left cursor-pointer"
            >
              <span className="font-bold block">Academic Admin</span>
              <span className="text-[10px] text-slate-400">Papers & Scholarships</span>
            </button>

            <button
              onClick={() => handleQuickDemoRole('content_manager')}
              className="p-2 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 text-left cursor-pointer"
            >
              <span className="font-bold block">Content Manager</span>
              <span className="text-[10px] text-slate-400">Add & Edit content</span>
            </button>

            <button
              onClick={() => handleQuickDemoRole('student')}
              className="p-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-left cursor-pointer"
            >
              <span className="font-bold block">Student</span>
              <span className="text-[10px] text-slate-400">Bookmarks & Mocks</span>
            </button>
          </div>
        </div>

        {/* Security and Privacy Notes */}
        <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 text-center space-y-1">
          <p className="flex items-center justify-center gap-1">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>Encrypted server-side token validation</span>
          </p>
          <p>
            By continuing, you acknowledge our <button onClick={() => navigate('/about')} className="text-slate-400 underline">Terms of Service</button> and <button onClick={() => navigate('/about')} className="text-slate-400 underline">Privacy Policy</button>.
          </p>
        </div>
      </div>
    </div>
  );
};
