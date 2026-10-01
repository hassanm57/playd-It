import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface RegisterProps {
  onRegister: (username: string, email: string, password: string) => Promise<void>;
}

export default function Register({ onRegister }: RegisterProps) {
  const [username, setUsername] = useState('');
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
      await onRegister(username, email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-8">
          Join <span className="text-accent">PLAYD</span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 text-accent text-sm">
              {error}
            </div>
          )}

          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              pattern="^[a-zA-Z0-9_]+$"
              minLength={3}
              maxLength={30}
              className="w-full h-11 px-4 rounded-lg bg-bg-card border border-border text-text-primary placeholder:text-text-muted outline-none focus:border-border-light transition-colors"
            />
            <p className="text-xs text-text-muted mt-1 ml-1">Letters, numbers, and underscores only</p>
          </div>

          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full h-11 px-4 rounded-lg bg-bg-card border border-border text-text-primary placeholder:text-text-muted outline-none focus:border-border-light transition-colors"
            />
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              minLength={6}
              className="w-full h-11 px-4 rounded-lg bg-bg-card border border-border text-text-primary placeholder:text-text-muted outline-none focus:border-border-light transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-accent hover:bg-accent-dark text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-text-muted mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:text-accent-dark transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
