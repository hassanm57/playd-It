import { Link, useLocation } from 'react-router-dom';
import { Compass, User as UserIcon, LogOut } from 'lucide-react';
import SearchBar from './SearchBar';
import type { User } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full apple-glass border-b border-white/[0.07] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#E50914] to-[#FF4552] flex items-center justify-center shadow-[0_0_16px_rgba(229,9,20,0.45)] group-hover:scale-105 transition-transform">
            <span className="text-white font-extrabold text-sm tracking-tighter">P</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-white flex items-center">
            PLAYD<span className="text-[#E50914] text-xl leading-none">.</span>
          </span>
        </Link>

        {/* Center Search Capsule */}
        <div className="flex-1 max-w-lg mx-2 hidden sm:block">
          <SearchBar />
        </div>

        {/* Navigation Items */}
        <nav className="flex items-center gap-1.5 sm:gap-2">
          <Link
            to="/discover"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
              isActive('/discover')
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Discover</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-2 pl-1">
              {/* Profile Link */}
              <Link
                to={`/@${user.username}`}
                className={`flex items-center gap-2 p-1 pr-3 rounded-full border transition-all ${
                  isActive(`/@${user.username}`)
                    ? 'border-white/30 bg-white/10'
                    : 'border-white/10 hover:border-white/20 bg-white/[0.04]'
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-[#181922] border border-white/20 flex items-center justify-center overflow-hidden">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-3.5 h-3.5 text-white/60" />
                  )}
                </div>
                <span className="text-xs font-semibold text-white/90 hidden sm:inline">
                  {user.username}
                </span>
              </Link>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="p-2 rounded-full text-white/40 hover:text-white hover:bg-white/[0.08] transition-colors"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-semibold text-white/70 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/[0.06] transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="text-xs font-semibold bg-gradient-to-r from-[#E50914] to-[#B20710] hover:from-[#FF1E27] hover:to-[#C60812] text-white px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(229,9,20,0.35)] transition-all transform hover:scale-[1.03] active:scale-[0.98]"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>

      {/* Mobile Search Bar row */}
      <div className="px-4 pb-2.5 sm:hidden">
        <SearchBar />
      </div>
    </header>
  );
}
