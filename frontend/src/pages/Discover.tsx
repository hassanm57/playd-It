import { useEffect, useState } from 'react';
import GameCard from '../components/GameCard';
import SearchBar from '../components/SearchBar';
import { discoverAPI, gamesAPI } from '../lib/api';

export default function Discover() {
  const [trending, setTrending] = useState<any[]>([]);
  const [popular, setPopular] = useState<any[]>([]);
  const [topRated, setTopRated] = useState<any[]>([]);
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      gamesAPI.getTrending(12).catch(() => ({ data: [] })),
      discoverAPI.popular(12).catch(() => ({ data: [] })),
      discoverAPI.topRated(12).catch(() => ({ data: [] })),
      discoverAPI.recent(12).catch(() => ({ data: [] })),
    ])
      .then(([trendRes, popRes, topRes, recRes]) => {
        setTrending(trendRes.data);
        setPopular(popRes.data);
        setTopRated(topRes.data);
        setRecent(recRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const isEmpty = !loading && trending.length === 0 && popular.length === 0 && topRated.length === 0 && recent.length === 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Discover</h1>

      <div className="max-w-lg mb-10">
        <SearchBar large />
      </div>

      {isEmpty && (
        <div className="text-center py-16">
          <p className="text-text-muted mb-2">Nothing here yet.</p>
          <p className="text-text-muted text-sm">Start by searching and rating some games!</p>
        </div>
      )}

      {trending.length > 0 && (
        <section className="mb-12">
          <h2 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-4">
            All-Time Favorites
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {trending.map((game: any) => (
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
        </section>
      )}

      {popular.length > 0 && (
        <section className="mb-12">
          <h2 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-4">
            Popular
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {popular.map((game: any) => (
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
        </section>
      )}

      {topRated.length > 0 && (
        <section className="mb-12">
          <h2 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-4">
            Highest Rated
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {topRated.map((game: any) => (
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
        </section>
      )}

      {recent.length > 0 && (
        <section className="mb-12">
          <h2 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-4">
            Recently Active
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recent.map((game: any) => (
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
        </section>
      )}
    </div>
  );
}
