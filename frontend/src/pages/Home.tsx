import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Sparkles, ChevronRight } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import GameCard from '../components/GameCard';
import type { User, UserRating, GameSearchResult } from '../types';
import { usersAPI, discoverAPI, gamesAPI } from '../lib/api';

interface HomeProps {
  user: User | null;
}

export default function Home({ user }: HomeProps) {
  const [recentRatings, setRecentRatings] = useState<UserRating[]>([]);
  const [popularGames, setPopularGames] = useState<GameSearchResult[]>([]);
  const [trendingGames, setTrendingGames] = useState<GameSearchResult[]>([]);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadHomeData = async () => {
      setLoading(true);
      try {
        if (user) {
          usersAPI.getRatings(user.username, 1).then((res) => {
            if (isMounted) setRecentRatings(res.data.slice(0, 10));
          }).catch(() => {});
        }

        const [trendRes, popRes] = await Promise.all([
          gamesAPI.getTrending(12).catch(() => ({ data: [] })),
          discoverAPI.popular(12).catch(() => ({ data: [] })),
        ]);

        if (isMounted) {
          setTrendingGames(trendRes.data);
          // If community ratings are fewer than 6, fallback to trending
          if (popRes.data && popRes.data.length >= 4) {
            setPopularGames(popRes.data);
          } else {
            setPopularGames(trendRes.data.slice(4, 12));
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadHomeData();
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Featured games for the Apple TV billboard hero (top 4 trending games)
  const featuredGames = trendingGames.slice(0, 4);
  const currentHero = featuredGames[activeHeroIndex];

  // Auto-advance hero carousel every 8 seconds
  useEffect(() => {
    if (featuredGames.length <= 1) return;
    const interval = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % featuredGames.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [featuredGames.length]);

  return (
    <div className="min-h-screen pb-24">
      {/* ========================================================= */}
      {/* 1. APPLE TV CINEMATIC BILLBOARD HERO STAGE                */}
      {/* ========================================================= */}
      {currentHero ? (
        <section className="relative w-full h-[65vh] sm:h-[75vh] max-h-[750px] overflow-hidden select-none bg-[#070709]">
          {/* Ambient Blurred Backlight */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <img
              key={`blur-${currentHero.rawg_id}`}
              src={currentHero.cover_url || ''}
              alt=""
              className="w-full h-full object-cover filter blur-[90px] opacity-25 scale-125 transition-opacity duration-1000"
            />
          </div>

          {/* Crisp Widescreen Backdrop Banner */}
          <div className="absolute inset-0">
            {currentHero.cover_url && (
              <img
                key={`banner-${currentHero.rawg_id}`}
                src={currentHero.cover_url}
                alt={currentHero.title}
                className="w-full h-full object-cover object-top filter brightness-[0.85] transition-all duration-1000 ease-out"
              />
            )}
            {/* Multi-directional Cinematic Vignette Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#070709] via-[#070709]/80 sm:via-[#070709]/40 to-transparent" />
          </div>

          {/* Billboard Overlay Content */}
          <div className="relative z-10 max-w-7xl mx-auto h-full px-6 sm:px-10 flex flex-col justify-end pb-12 sm:pb-16">
            <div className="max-w-2xl">
              {/* Badges */}
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#E50914] text-white shadow-[0_0_15px_rgba(229,9,20,0.5)]">
                  Featured
                </span>
                {currentHero.release_date && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 backdrop-blur-md text-white/80 border border-white/10">
                    {new Date(currentHero.release_date).getFullYear()}
                  </span>
                )}
                {currentHero.platforms.length > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 backdrop-blur-md text-white/80 border border-white/10 truncate max-w-[200px]">
                    {currentHero.platforms.slice(0, 3).map((p) => p.split(' ')[0]).join(' · ')}
                  </span>
                )}
              </div>

              {/* Title in Bold Editorial Typography */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08] mb-3 drop-shadow-xl">
                {currentHero.title}
              </h1>

              {/* Tagline / Subtitle */}
              <p className="text-sm sm:text-base text-white/70 font-normal mb-6 max-w-xl line-clamp-2">
                Rate, review, and save this title to your personal gaming diary.
              </p>

              {/* Apple-Style Action Buttons */}
              <div className="flex items-center gap-3 flex-wrap">
                <Link
                  to={`/game/${currentHero.rawg_id}`}
                  className="px-6 py-3 rounded-full font-semibold text-sm bg-white text-black hover:bg-white/90 shadow-[0_8px_30px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                >
                  <Star className="w-4 h-4 fill-black text-black" />
                  <span>Rate & Review</span>
                </Link>

                <Link
                  to={`/game/${currentHero.rawg_id}`}
                  className="px-6 py-3 rounded-full font-semibold text-sm bg-white/10 hover:bg-white/18 text-white border border-white/15 backdrop-blur-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5"
                >
                  <span>Explore Details</span>
                  <ChevronRight className="w-4 h-4 text-white/60" />
                </Link>
              </div>
            </div>

            {/* Billboard Dot Indicators */}
            <div className="absolute bottom-6 right-6 sm:right-10 flex items-center gap-2 z-20">
              {featuredGames.map((game, idx) => (
                <button
                  key={game.rawg_id}
                  onClick={() => setActiveHeroIndex(idx)}
                  className={`transition-all duration-300 rounded-full ${
                    idx === activeHeroIndex
                      ? 'w-8 h-2 bg-white'
                      : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
      ) : (
        /* Fallback if no hero yet */
        <div className="h-48 w-full bg-[#070709]" />
      )}

      {/* ========================================================= */}
      {/* 2. MAIN CONTENT STAGE                                     */}
      {/* ========================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mt-8 space-y-14">
        {/* Prominent Spotlight Search Capsule for Quick Lookups */}
        <section className="max-w-2xl mx-auto px-2">
          <SearchBar large placeholder="Search any game title... (Press ⌘K)" />
        </section>

        {/* LOGGED IN USER: Recent Diary Shelf */}
        {user && recentRatings.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Your Recent Logged Games
                </h2>
                <p className="text-xs text-white/40 mt-0.5">Games you recently rated or played</p>
              </div>
              <Link
                to={`/@${user.username}`}
                className="text-xs font-semibold text-[#E50914] hover:text-[#FF1E27] flex items-center gap-1 transition-colors"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
              {recentRatings.map((item) => (
                <GameCard
                  key={item.game.rawg_id}
                  rawgId={item.game.rawg_id}
                  title={item.game.title}
                  coverUrl={item.game.cover_url}
                  releaseDate={item.game.release_date}
                  platforms={item.game.platforms}
                  rating={item.rating}
                />
              ))}
            </div>
          </section>
        )}

        {/* SHELF 1: Trending & All-Time Masterpieces */}
        {trendingGames.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  <span>All-Time Masterpieces</span>
                  <Sparkles className="w-4 h-4 text-[#E50914]" />
                </h2>
                <p className="text-xs text-white/40 mt-0.5">Most played and acclaimed games across all platforms</p>
              </div>
              <Link
                to="/discover"
                className="text-xs font-semibold text-white/50 hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>Explore More</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
              {trendingGames.slice(0, 12).map((game) => (
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

        {/* SHELF 2: Community Favorites */}
        {popularGames.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Popular on PLAYD
                </h2>
                <p className="text-xs text-white/40 mt-0.5">Trending within the community this month</p>
              </div>
              <Link
                to="/discover"
                className="text-xs font-semibold text-white/50 hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>Discover</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
              {popularGames.slice(0, 12).map((game) => (
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

        {/* Empty state when loading */}
        {loading && trendingGames.length === 0 && (
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
