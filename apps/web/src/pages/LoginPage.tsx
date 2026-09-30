import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, KeyRound, ArrowRight, Lock, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { session, login, verifyTwoFactor, loginWithOAuth } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.success) {
      setError(result.error || 'Authentication failed');
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await verifyTwoFactor(twoFactorCode);
    setLoading(false);
    if (!result.success) {
      setError(result.error || 'Verification failed');
      setTwoFactorCode('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="max-w-md w-full space-y-8 bg-slate-900/90 border border-slate-800 p-8 rounded-3xl shadow-2xl backdrop-blur-md">
        {/* Brand Header */}
        <div className="text-center">
          <div className="w-14 h-14 bg-gradient-to-tr from-cyan-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-cyan-500/20 mb-3">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-100">Dwirro Platform</h2>
          <p className="text-xs text-slate-400 mt-1">Autonomous AI Personal Assistant with Zero-Trust Security</p>
        </div>

        {error && (
          <div
            data-testid="auth-error-banner"
            className="bg-red-950/50 border border-red-500/50 rounded-xl p-3.5 text-xs text-red-300 flex items-start gap-2.5 animate-in fade-in"
          >
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {!session.requiresTwoFactor ? (
          /* Step 1: Email & Password */
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Work Email Address
              </label>
              <input
                data-testid="login-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <input
                data-testid="login-password-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <button
              data-testid="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-cyan-600/20 text-sm transition-all disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In with Password'}
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-900 px-2 text-slate-500 font-mono">Or continue with</span>
              </div>
            </div>

            {/* Mock OAuth Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                data-testid="oauth-google-btn"
                type="button"
                onClick={() => loginWithOAuth('google')}
                className="flex items-center justify-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl py-2.5 text-xs font-medium text-slate-200 transition-colors"
              >
                <span>Google OAuth</span>
              </button>
              <button
                data-testid="oauth-ms-btn"
                type="button"
                onClick={() => loginWithOAuth('microsoft')}
                className="flex items-center justify-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl py-2.5 text-xs font-medium text-slate-200 transition-colors"
              >
                <span>Microsoft SSO</span>
              </button>
            </div>
          </form>
        ) : (
          /* Step 2: 2FA Verification */
          <form onSubmit={handleVerify2FA} className="space-y-4 animate-in fade-in">
            <div className="text-center py-2">
              <div className="w-10 h-10 bg-cyan-950 border border-cyan-500/50 rounded-xl flex items-center justify-center text-cyan-400 mx-auto mb-2">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-100 text-sm">Two-Factor Authentication</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Enter the 6-digit code sent to your authenticator app (Demo: <strong className="text-cyan-400 font-mono">123456</strong>)
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 text-center">
                6-Digit Security Code
              </label>
              <input
                data-testid="2fa-code-input"
                type="text"
                maxLength={6}
                required
                autoFocus
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full text-center tracking-widest font-mono text-xl bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-cyan-300 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <button
              data-testid="2fa-submit-btn"
              type="submit"
              disabled={loading || twoFactorCode.length !== 6}
              className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold py-3 rounded-xl shadow text-sm transition-all"
            >
              {loading ? 'Verifying Code...' : 'Verify & Continue'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-slate-800 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>Encrypted in-memory session. Zero credentials persisted in storage.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
