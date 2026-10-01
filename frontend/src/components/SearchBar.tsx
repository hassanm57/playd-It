import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import { gamesAPI } from '../lib/api';
import type { GameSearchResult } from '../types';

interface SearchBarProps {
  large?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
}

export default function SearchBar({
  large = false,
  autoFocus = false,
  placeholder = 'Search any game... (Press ⌘K)',
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GameSearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debouncedQuery = useDebounce(query, 250);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Global ⌘K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    let isMounted = true;
    const search = async () => {
      setLoading(true);
      try {
        const res = await gamesAPI.search(debouncedQuery.trim());
        if (isMounted) {
          setResults(res.data.slice(0, 6));
          setIsOpen(true);
        }
      } catch {
        if (isMounted) setResults([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    search();
    return () => {
      isMounted = false;
    };
  }, [debouncedQuery]);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        navigate(`/game/${results[selectedIndex].rawg_id}`);
        setIsOpen(false);
        setQuery('');
      } else if (query.trim().length >= 2) {
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleResultClick = (rawgId: number) => {
    navigate(`/game/${rawgId}`);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Search Input Pill */}
      <div
        className={`relative flex items-center rounded-2xl transition-all duration-300 ${
          isOpen
            ? 'bg-[#14151D] border-white/25 shadow-[0_12px_40px_rgba(0,0,0,0.8)]'
            : 'bg-white/[0.06] hover:bg-white/[0.09] border-white/[0.08] hover:border-white/15'
        } border ${large ? 'h-13 sm:h-14 px-4' : 'h-10 sm:h-11 px-3.5'}`}
      >
        <Search
          className={`text-white/40 flex-shrink-0 transition-colors ${
            isOpen ? 'text-[#E50914]' : ''
          } ${large ? 'w-5 h-5 mr-3' : 'w-4 h-4 mr-2.5'}`}
        />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(-1);
          }}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={large ? 'Search games, titles, series...' : placeholder}
          autoFocus={autoFocus}
          className={`w-full bg-transparent outline-none text-white placeholder:text-white/35 font-normal tracking-normal ${
            large ? 'text-base sm:text-lg' : 'text-sm'
          }`}
        />

        {/* Loading Spinner or Clear Button */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {loading && (
            <Loader2 className="w-4 h-4 text-white/40 animate-spin mr-1" />
          )}

          {query ? (
            <button
              onClick={() => {
                setQuery('');
                setResults([]);
                setIsOpen(false);
                inputRef.current?.focus();
              }}
              className="p-1 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-medium tracking-wider text-white/35 bg-white/5 border border-white/10 rounded-md select-none">
              ⌘K
            </kbd>
          )}
        </div>
      </div>

      {/* Floating Apple TV Spotlight Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2.5 apple-glass rounded-2xl overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.9)] z-50 animate-in fade-in-0 zoom-in-95 duration-200">
          {results.length > 0 ? (
            <div className="p-1.5 divide-y divide-white/[0.05]">
              <div className="space-y-1">
                {results.map((game, index) => {
                  const isSelected = index === selectedIndex;
                  const year = game.release_date
                    ? new Date(game.release_date).getFullYear()
                    : null;

                  return (
                    <button
                      key={game.rawg_id}
                      onClick={() => handleResultClick(game.rawg_id)}
                      className={`w-full flex items-center gap-3.5 p-2 rounded-xl text-left transition-all duration-200 ${
                        isSelected
                          ? 'bg-white/15 shadow-inner'
                          : 'hover:bg-white/[0.08]'
                      }`}
                    >
                      {/* Thumbnail with poster ratio */}
                      <div className="w-10 h-14 rounded-lg overflow-hidden bg-[#181922] border border-white/10 flex-shrink-0 relative">
                        {game.cover_url ? (
                          <img
                            src={game.cover_url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#1A1B24]" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate tracking-tight">
                          {game.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-[#8E8E98]">
                          {year && <span>{year}</span>}
                          {year && game.platforms.length > 0 && <span>·</span>}
                          {game.platforms.length > 0 && (
                            <span className="truncate">
                              {game.platforms.slice(0, 3).map((p) => p.split(' ')[0]).join(' · ')}
                            </span>
                          )}
                        </div>
                      </div>

                      <ArrowRight className="w-4 h-4 text-white/30 mr-1 flex-shrink-0" />
                    </button>
                  );
                })}
              </div>

              {/* View all results button */}
              <div className="pt-1.5 px-1">
                <button
                  onClick={() => {
                    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
                    setIsOpen(false);
                  }}
                  className="w-full py-2.5 px-3 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/[0.06] rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>See all results for "{query}"</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : !loading && query.trim().length >= 2 ? (
            <div className="py-8 text-center text-sm text-white/40">
              No games found for "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
