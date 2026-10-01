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
    <div className="min-h-screen pb-24 overflow-x-hidden">
      {/* ========================================================= */}
      {/* 1. CINEMATIC DISCOVER HEADER                              */}
      {/* ========================================================= */}
      <section className="relative w-full pt-14 pb-10 overflow-hidden border-b border-white/[0.06]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-56 bg-gradient-to-b from-[#E50914]/15 via-transparent to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-white/80 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#E50914]" />
            <span>Curated Game Archives</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-3">
            Discover Video Games
          </h1>
          <p className="text-xs sm:text-sm text-white/50 max-w-lg mx-auto mb-8 font-normal leading-relaxed">
            Browse critically acclaimed titles, all-time community favorites, and trending video games across every platform.
          </p>

          <div className="max-w-xl mx-auto">
            <SearchBar large placeholder="Search by game title, developer, or genre..." />
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. CINEMATIC CATEGORY CAROUSELS (APPLE TV STYLE)          */}
      {/* ========================================================= */}
      <main className="space-y-12 pt-8">
        {/* SHELF 1: ALL-TIME FAVORITES */}
        {trending.length > 0 && (
          <GameShelf
            title="All-Time Masterpieces"
            subtitle="Acclaimed titles with universal acclaim across PlayStation, Xbox, Switch & PC"
            icon={<Sparkles className="w-5 h-5 text-[#E50914]" />}
            games={trending}
          />
        )}

        {/* SHELF 2: COMMUNITY POPULAR */}
        {popular.length > 0 && (
          <GameShelf
            title="Most Rated on PLAYD"
            subtitle="Titles currently generating the most ratings and reviews in the community"
            icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
            games={popular}
          />
        )}

        {/* SHELF 3: HIGHEST RATED */}
        {topRated.length > 0 && (
          <GameShelf
            title="Highest Community Rating"
            subtitle="Top-rated video games according to player diaries and reviews"
            icon={<Award className="w-5 h-5 text-amber-400" />}
            games={topRated}
          />
        )}

        {/* SHELF 4: RECENT ACTIVITY */}
        {recent.length > 0 && (
          <GameShelf
            title="Recently Active"
            subtitle="Games recently reviewed and logged into member profiles"
            icon={<Clock className="w-5 h-5 text-sky-400" />}
            games={recent}
          />
        )}

        {/* Skeletons when loading */}
        {loading && trending.length === 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 space-y-12">
            {[1, 2].map((row) => (
              <div key={row} className="space-y-4">
                <div className="h-6 w-48 apple-skeleton rounded-lg" />
                <div className="flex gap-4 overflow-hidden py-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-[180px] aspect-[2/3] rounded-2xl apple-skeleton flex-shrink-0"
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
