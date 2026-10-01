import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import { gamesAPI } from '../lib/api';
import type { GameSearchResult } from '../types';

interface SearchBarProps {
  large?: boolean;
  autoFocus?: boolean;
}

export default function SearchBar({ large = false, autoFocus = false }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GameSearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const search = async () => {
      setLoading(true);
      try {
        const res = await gamesAPI.search(debouncedQuery);
        setResults(res.data.slice(0, 6));
        setIsOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    search();
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

  // Keyboard nav
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
      } else if (query.length >= 2) {
        navigate(`/search?q=${encodeURIComponent(query)}`);
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
      <div
        className={`relative flex items-center rounded-xl border transition-all duration-200 ${
          isOpen
            ? 'border-border-light bg-bg-card'
            : 'border-border bg-bg-secondary hover:border-border-light'
        } ${
          large ? 'h-14' : 'h-10'
        }`}
      >
        <Search
          className={`absolute left-3 text-text-muted ${
            large ? 'w-5 h-5' : 'w-4 h-4'
          }`}
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
          placeholder="Search games..."
          autoFocus={autoFocus}
          className={`w-full bg-transparent outline-none text-text-primary placeholder:text-text-muted ${
            large
              ? 'pl-11 pr-10 text-lg'
              : 'pl-9 pr-8 text-sm'
          }`}
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-3 text-text-muted hover:text-text-primary transition-colors"
          >
            <X className={large ? 'w-5 h-5' : 'w-4 h-4'} />
          </button>
        )}
      </div>

      {/* Dropdown results */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-bg-card border border-border rounded-xl overflow-hidden shadow-2xl shadow-black/50 z-50">
          {loading ? (
            <div className="p-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-2">
                  <div className="w-10 h-14 skeleton rounded" />
                  <div className="flex-1">
                    <div className="h-4 w-3/4 skeleton rounded mb-2" />
                    <div className="h-3 w-1/2 skeleton rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="py-1">
              {results.map((game, index) => (
                <button
                  key={game.rawg_id}
                  onClick={() => handleResultClick(game.rawg_id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                    index === selectedIndex
                      ? 'bg-bg-card-hover'
                      : 'hover:bg-bg-card-hover'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="w-10 h-14 rounded overflow-hidden bg-bg-secondary flex-shrink-0">
                    {game.cover_url ? (
                      <img
                        src={game.cover_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-bg-secondary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {game.title}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {game.release_date
                        ? new Date(game.release_date).getFullYear()
                        : ''}
                      {game.platforms.length > 0 && (
                        <span>
                          {game.release_date ? ' · ' : ''}
                          {game.platforms
                            .slice(0, 3)
                            .map((p) => {
                              if (p.includes('PC')) return 'PC';
                              if (p.includes('PlayStation 5')) return 'PS5';
                              if (p.includes('PlayStation 4')) return 'PS4';
                              if (p.includes('Xbox Series')) return 'XSX';
                              if (p.includes('Switch')) return 'Switch';
                              return p.split(' ')[0];
                            })
                            .join(' · ')}
                        </span>
                      )}
                    </p>
                  </div>
                </button>
              ))}
              {/* See all link */}
              <button
                onClick={() => {
                  navigate(`/search?q=${encodeURIComponent(query)}`);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2.5 text-sm text-text-secondary hover:text-accent text-center border-t border-border transition-colors"
              >
                See all results for "{query}"
              </button>
            </div>
          ) : (
            <div className="p-6 text-center text-text-muted text-sm">
              No games found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
