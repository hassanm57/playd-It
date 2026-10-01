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
    <div className="min-h-screen pb-32 w-full">
      {/* ========================================================= */}
      {/* 1. EXPANSIVE CENTERED TOP SEARCH HEADER                   */}
      {/* ========================================================= */}
      <section className="pt-16 pb-12 border-b border-white/[0.08] bg-gradient-to-b from-white/[0.02] to-transparent w-full">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar large placeholder="Search video games across all platforms..." />
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {query ? (
              <>
                Search Results for <span className="text-[#E50914]">"{query}"</span>
              </>
            ) : (
              'Search Video Games'
            )}
          </h1>
          {results.length > 0 && (
            <p className="text-sm text-white/50 mt-2 font-medium">
              Found {results.length} titles matching your query
            </p>
          )}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. BALANCED EXPANSIVE RESULTS GRID                        */}
      {/* ========================================================= */}
      <main className="max-w-[1700px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-20 pt-12">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-7">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[2/3] rounded-3xl apple-skeleton" />
                <div className="h-5 w-3/4 rounded-lg apple-skeleton" />
                <div className="h-4 w-1/2 rounded-lg apple-skeleton" />
              </div>
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-7">
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
          <div className="text-center py-24 px-8 rounded-3xl apple-glass max-w-lg mx-auto border border-white/15 shadow-2xl">
            <Frown className="w-14 h-14 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Games Found</h3>
            <p className="text-sm text-white/50 leading-relaxed font-normal">
              We couldn't find any titles matching "{query}". Check the spelling or try searching for another title.
            </p>
          </div>
        ) : (
          <div className="text-center py-28 max-w-md mx-auto text-white/40">
            <Sparkles className="w-10 h-10 text-[#E50914]/60 mx-auto mb-4" />
            <p className="text-base font-semibold text-white/80">Ready to search</p>
            <p className="text-xs text-white/40 mt-1">
              Type at least 2 characters to search across 800,000+ games.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
