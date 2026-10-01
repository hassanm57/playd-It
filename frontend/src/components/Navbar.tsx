import { Link } from 'react-router-dom';
import { Compass, User as UserIcon, LogOut } from 'lucide-react';
import SearchBar from './SearchBar';
import type { User } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-40 bg-bg-secondary/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-6">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <span className="text-xl font-bold tracking-tight text-text-primary">
            PLAYD<span className="text-accent">.</span>
          </span>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-md">
          <SearchBar />
        </div>

        {/* Nav links */}
        <div className="flex items-center gap-4">
          <Link
            to="/discover"
            className="hidden sm:flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <Compass className="w-4 h-4" />
            <span>Discover</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to={`/@${user.username}`}
                className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-bg-card border border-border flex items-center justify-center overflow-hidden">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-4 h-4 text-text-muted" />
                  )}
                </div>
                <span className="hidden sm:inline">{user.username}</span>
              </Link>
              <button
                onClick={onLogout}
                className="text-text-muted hover:text-text-primary transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="text-sm bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-lg transition-colors font-medium"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
