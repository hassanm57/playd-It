import { useEffect, useState } from 'react';
import { Sparkles, TrendingUp, Award, Clock } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import GameShelf from '../components/GameShelf';
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
      discoverAPI.popular(14).catch(() => ({ data: [] })),
      discoverAPI.topRated(14).catch(() => ({ data: [] })),
      discoverAPI.recent(14).catch(() => ({ data: [] })),
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
    <div className="min-h-screen pb-32 overflow-x-hidden w-full">
      {/* ========================================================= */}
      {/* 1. EXPANSIVE CINEMATIC DISCOVER HEADER                    */}
      {/* ========================================================= */}
      <section className="relative w-full pt-16 pb-12 overflow-hidden border-b border-white/[0.08]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-gradient-to-b from-[#E50914]/15 via-transparent to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-white/90 mb-4 shadow-sm">
            <Sparkles className="w-4 h-4 text-[#E50914]" />
            <span>Curated Game Archives</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
            Discover Video Games
          </h1>
          <p className="text-sm sm:text-base text-white/60 max-w-xl mx-auto mb-10 font-normal leading-relaxed">
            Browse critically acclaimed titles, all-time community favorites, and trending video games across every platform.
          </p>

          <div className="max-w-2xl mx-auto">
            <SearchBar large placeholder="Search by game title, developer, or genre..." />
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. CINEMATIC CATEGORY CAROUSELS (EXPANSIVE WIDTH)         */}
      {/* ========================================================= */}
      <main className="space-y-16 sm:space-y-24 pt-10">
        {/* SHELF 1: ALL-TIME FAVORITES */}
        {trending.length > 0 && (
          <GameShelf
            title="All-Time Masterpieces"
            subtitle="Acclaimed titles with universal acclaim across PlayStation, Xbox, Switch & PC"
            icon={<Sparkles className="w-6 h-6 text-[#E50914]" />}
            games={trending}
          />
        )}

        {/* SHELF 2: COMMUNITY POPULAR */}
        {popular.length > 0 && (
          <GameShelf
            title="Most Rated on PLAYD"
            subtitle="Titles currently generating the most ratings and reviews in the community"
            icon={<TrendingUp className="w-6 h-6 text-emerald-400" />}
            games={popular}
          />
        )}

        {/* SHELF 3: HIGHEST RATED */}
        {topRated.length > 0 && (
          <GameShelf
            title="Highest Community Rating"
            subtitle="Top-rated video games according to player diaries and reviews"
            icon={<Award className="w-6 h-6 text-amber-400" />}
            games={topRated}
          />
        )}

        {/* SHELF 4: RECENT ACTIVITY */}
        {recent.length > 0 && (
          <GameShelf
            title="Recently Active"
            subtitle="Games recently reviewed and logged into member profiles"
            icon={<Clock className="w-6 h-6 text-sky-400" />}
            games={recent}
          />
        )}

        {/* Skeletons when loading */}
        {loading && trending.length === 0 && (
          <div className="w-full px-6 sm:px-10 lg:px-14 xl:px-20 space-y-12">
            {[1, 2].map((row) => (
              <div key={row} className="space-y-4">
                <div className="h-7 w-56 apple-skeleton rounded-xl" />
                <div className="flex gap-5 overflow-hidden py-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-[220px] aspect-[2/3] rounded-3xl apple-skeleton flex-shrink-0"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
