import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<void>;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onLogin(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient background bloom */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#E50914]/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md apple-glass p-8 sm:p-10 rounded-3xl border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.85)] relative z-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#E50914] to-[#FF4552] flex items-center justify-center mx-auto mb-3 shadow-[0_0_25px_rgba(229,9,20,0.4)]">
            <span className="text-white font-extrabold text-xl tracking-tighter">P</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
            Welcome Back
          </h1>
          <p className="text-xs text-white/50">
            Sign in to continue your gaming diary
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-[#E50914]/15 border border-[#E50914]/30 text-[#FF4552] text-xs font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/40 mb-1.5 pl-1">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4 h-4 text-white/35 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/25 text-sm outline-none focus:border-white/30 transition-all font-normal"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/40 mb-1.5 pl-1">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-4 h-4 text-white/35 pointer-events-none" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/25 text-sm outline-none focus:border-white/30 transition-all font-normal"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-white hover:bg-white/90 text-black rounded-xl font-semibold text-sm shadow-[0_4px_25px_rgba(255,255,255,0.15)] transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 mt-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-black" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-white/40 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-white hover:underline font-semibold transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
