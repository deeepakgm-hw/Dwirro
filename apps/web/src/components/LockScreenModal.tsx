import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export const LockScreenModal: React.FC = () => {
  const { session, unlockSession, logout } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!session.isLocked) return null;

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await unlockSession(password);
    setLoading(false);
    if (!result.success) {
      setError(result.error || 'Incorrect password.');
      setPassword('');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in duration-200"
    >
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-sm w-full p-8 shadow-2xl text-center">
        <div className="w-16 h-16 bg-cyan-950/70 border border-cyan-500/40 rounded-2xl flex items-center justify-center mx-auto mb-4 text-cyan-400">
          <Lock className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-bold text-slate-100 mb-1">Session Locked</h3>
        <p className="text-xs text-slate-400 mb-6">
          Inactive session locked for security. Enter your password to resume.
        </p>

        <div className="bg-slate-800/60 rounded-xl p-3 mb-5 text-left flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-cyan-600/30 flex items-center justify-center text-cyan-400 font-bold text-xs">
            {session.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="truncate">
            <span className="text-xs font-semibold text-slate-200 block truncate">{session.name}</span>
            <span className="text-[11px] text-slate-400 truncate block">{session.email}</span>
          </div>
        </div>

        <form onSubmit={handleUnlock} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              autoFocus
              required
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-950/40 border border-red-500/30 rounded-lg p-2 font-medium">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold py-3 rounded-xl shadow transition-colors text-sm"
          >
            {loading ? 'Verifying...' : 'Unlock Session'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
          <button
            onClick={logout}
            className="text-slate-400 hover:text-red-400 transition-colors font-medium"
          >
            Switch Account / Logout
          </button>
          <div className="flex items-center gap-1 text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};
