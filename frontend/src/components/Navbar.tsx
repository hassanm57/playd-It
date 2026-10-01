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
    <header className="sticky top-0 z-40 w-full apple-glass border-b border-white/[0.08] transition-all">
      <div className="w-full px-6 sm:px-10 lg:px-14 xl:px-20 h-20 flex items-center justify-between gap-6">
        {/* Brand Logo - Aligned to Far Left */}
        <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#E50914] to-[#FF4552] flex items-center justify-center shadow-[0_0_20px_rgba(229,9,20,0.45)] group-hover:scale-105 transition-transform">
            <span className="text-white font-extrabold text-base tracking-tighter">P</span>
          </div>
          <span className="text-xl font-black tracking-tight text-white flex items-center">
            PLAYD<span className="text-[#E50914] text-2xl leading-none">.</span>
          </span>
        </Link>

        {/* Center Search Capsule - Fully Centered in Header */}
        <div className="flex-1 max-w-xl mx-auto hidden sm:block">
          <SearchBar />
        </div>

        {/* Navigation Items - Aligned to Far Right */}
        <nav className="flex items-center gap-3 flex-shrink-0">
          <Link
            to="/discover"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap transition-all ${
              isActive('/discover')
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-white/70 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Discover</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-3 pl-2">
              {/* Profile Link */}
              <Link
                to={`/@${user.username}`}
                className={`inline-flex items-center gap-2.5 p-1.5 pr-4 rounded-full border whitespace-nowrap transition-all ${
                  isActive(`/@${user.username}`)
                    ? 'border-white/30 bg-white/15 shadow-sm'
                    : 'border-white/10 hover:border-white/25 bg-white/[0.05]'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-[#181922] border border-white/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-4 h-4 text-white/60" />
                  )}
                </div>
                <span className="text-xs font-semibold text-white/90 hidden md:inline">
                  {user.username}
                </span>
              </Link>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="p-2.5 rounded-full text-white/40 hover:text-white hover:bg-white/[0.08] transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-4 py-2 rounded-full text-xs font-semibold text-white/80 hover:text-white hover:bg-white/[0.08] border border-white/10 whitespace-nowrap transition-all cursor-pointer"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#E50914] to-[#B20710] hover:from-[#FF1E27] hover:to-[#C60812] shadow-[0_0_20px_rgba(229,9,20,0.4)] whitespace-nowrap transition-all transform hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>

      {/* Mobile Search Bar row */}
      <div className="px-6 pb-3 sm:hidden">
        <SearchBar />
      </div>
    </header>
  );
}
