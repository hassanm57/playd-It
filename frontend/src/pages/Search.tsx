import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Frown, Sparkles } from 'lucide-react';
import GameCard from '../components/GameCard';
import SearchBar from '../components/SearchBar';
import { gamesAPI } from '../lib/api';
import type { GameSearchResult } from '../types';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<GameSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) return;
    setLoading(true);
    gamesAPI
      .search(query.trim())
      .then((res) => {
        setResults(res.data);
      })
      .catch(() => {
        setResults([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [query]);

  return (
    <div className="min-h-screen pb-24">
      {/* ========================================================= */}
      {/* 1. CENTERED TOP SEARCH HEADER                             */}
      {/* ========================================================= */}
      <section className="pt-10 pb-8 border-b border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="max-w-xl mx-auto mb-6">
            <SearchBar large placeholder="Search video games across all platforms..." />
          </div>

          <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
            {query ? (
              <>
                Search Results for <span className="text-[#E50914]">"{query}"</span>
              </>
            ) : (
              'Search Video Games'
            )}
          </h1>
          {results.length > 0 && (
            <p className="text-xs sm:text-sm text-white/40 mt-1.5 font-medium">
              Found {results.length} titles matching your query
            </p>
          )}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. BALANCED AUTO-FIT RESULTS GRID                         */}
      {/* ========================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-10">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-2.5">
                <div className="aspect-[2/3] rounded-2xl apple-skeleton" />
                <div className="h-4 w-3/4 rounded-md apple-skeleton" />
                <div className="h-3 w-1/2 rounded-md apple-skeleton" />
              </div>
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {results.map((game) => (
              <GameCard
                key={game.rawg_id}
                rawgId={game.rawg_id}
                title={game.title}
                coverUrl={game.cover_url}
                releaseDate={game.release_date}
                platforms={game.platforms}
              />
            ))}
          </div>
        ) : query.trim().length >= 2 ? (
          <div className="text-center py-20 px-8 rounded-3xl apple-glass max-w-md mx-auto border border-white/10 shadow-2xl">
            <Frown className="w-12 h-12 text-white/30 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1.5">No Games Found</h3>
            <p className="text-xs sm:text-sm text-white/50 leading-relaxed font-normal">
              We couldn't find any titles matching "{query}". Check the spelling or try searching for another title.
            </p>
          </div>
        ) : (
          <div className="text-center py-24 max-w-md mx-auto text-white/40">
            <Sparkles className="w-8 h-8 text-[#E50914]/60 mx-auto mb-3" />
            <p className="text-sm font-medium text-white/70">Ready to search</p>
            <p className="text-xs text-white/40 mt-1">
              Type at least 2 characters to search across 800,000+ games.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
