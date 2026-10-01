import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Frown } from 'lucide-react';
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
      {/* Top Search Bar */}
      <section className="pt-10 pb-6 border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="max-w-xl mx-auto mb-6">
            <SearchBar large />
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {query ? (
              <>
                Search Results for <span className="text-[#E50914]">"{query}"</span>
              </>
            ) : (
              'Search Video Games'
            )}
          </h1>
          {results.length > 0 && (
            <p className="text-xs text-white/40 mt-1">
              Found {results.length} titles in the database
            </p>
          )}
        </div>
      </section>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-10">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] rounded-2xl apple-skeleton" />
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
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
          <div className="text-center py-24 p-8 rounded-3xl apple-glass max-w-md mx-auto">
            <Frown className="w-12 h-12 text-white/30 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No Games Found</h3>
            <p className="text-xs text-white/40">
              We couldn't find any titles matching "{query}". Try checking the spelling or searching for another title.
            </p>
          </div>
        ) : (
          <div className="text-center py-20 text-white/40 text-sm">
            Type at least 2 characters to search across 800,000+ games.
          </div>
        )}
      </main>
    </div>
  );
}
