import { useEffect, useState } from 'react';
import { Sparkles, TrendingUp, Award, Clock } from 'lucide-react';
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
      gamesAPI.getTrending(18).catch(() => ({ data: [] })),
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

  return (
    <div className="min-h-screen pb-24">
      {/* ========================================================= */}
      {/* 1. CINEMATIC DISCOVER HEADER                              */}
      {/* ========================================================= */}
      <section className="relative w-full pt-12 pb-8 overflow-hidden border-b border-white/[0.06]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-48 bg-gradient-to-b from-[#E50914]/15 via-transparent to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-white/80 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#E50914]" />
            <span>Curated Game Archives</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-3">
            Discover Games
          </h1>
          <p className="text-sm text-white/50 max-w-lg mx-auto mb-8 font-normal">
            Browse critically acclaimed titles, all-time community favorites, and trending video games across every platform.
          </p>

          <div className="max-w-lg mx-auto">
            <SearchBar large placeholder="Search by game title, studio, or genre..." />
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. CURATED POSTER SHELVES                                 */}
      {/* ========================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-12 space-y-16">
        {/* SHELF 1: ALL-TIME FAVORITES */}
        {trending.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-5">
              <Sparkles className="w-5 h-5 text-[#E50914]" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                All-Time Masterpieces
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
              {trending.map((game) => (
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
          </section>
        )}

        {/* SHELF 2: COMMUNITY POPULAR */}
        {popular.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Most Rated on PLAYD
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
              {popular.map((game) => (
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
          </section>
        )}

        {/* SHELF 3: HIGHEST RATED */}
        {topRated.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-5">
              <Award className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Highest Rated by Community
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
              {topRated.map((game) => (
                <GameCard
                  key={game.rawg_id}
                  rawgId={game.rawg_id}
                  title={game.title}
                  coverUrl={game.cover_url}
                  releaseDate={game.release_date}
                  platforms={game.platforms}
                  rating={game.avg_rating}
                />
              ))}
            </div>
          </section>
        )}

        {/* SHELF 4: RECENT ACTIVITY */}
        {recent.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-5">
              <Clock className="w-5 h-5 text-sky-400" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Recently Active
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
              {recent.map((game) => (
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
          </section>
        )}

        {/* Skeletons when loading */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] rounded-2xl apple-skeleton" />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
