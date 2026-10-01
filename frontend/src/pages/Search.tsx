import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import GameCard from '../components/GameCard';
import { gamesAPI } from '../lib/api';
import type { GameSearchResult } from '../types';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<GameSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 2) return;
    setLoading(true);
    gamesAPI.search(query).then((res) => {
      setResults(res.data);
    }).catch(() => {
      setResults([]);
    }).finally(() => {
      setLoading(false);
    });
  }, [query]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-xl font-semibold mb-6">
        Results for <span className="text-text-secondary">"{query}"</span>
      </h1>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i}>
              <div className="aspect-[3/4] skeleton rounded-lg" />
              <div className="mt-2 h-4 w-3/4 skeleton rounded" />
              <div className="mt-1 h-3 w-1/2 skeleton rounded" />
            </div>
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {results.map((game) => (
            <GameCard
              key={game.rawg_id}
              rawgId={game.rawg_id}
              title={game.title}
              slug={game.slug}
              coverUrl={game.cover_url}
              releaseDate={game.release_date}
              platforms={game.platforms}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-text-muted">No games found.</p>
        </div>
      )}
    </div>
  );
}
