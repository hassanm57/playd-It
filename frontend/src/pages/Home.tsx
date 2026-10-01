import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Flame, Sparkles, Sword, Crosshair, Award, Clock } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import GameShelf from '../components/GameShelf';
import { PlatformIconList } from '../components/PlatformIcon';
import type { User, UserRating, GameSearchResult } from '../types';
import { usersAPI, gamesAPI } from '../lib/api';

interface HomeProps {
  user: User | null;
}

interface HomeFeedData {
  featured: GameSearchResult[];
  trending: GameSearchResult[];
  latest: GameSearchResult[];
  rpg: GameSearchResult[];
  action: GameSearchResult[];
  top_rated: GameSearchResult[];
}

export default function Home({ user }: HomeProps) {
  const [recentRatings, setRecentRatings] = useState<UserRating[]>([]);
  const [feed, setFeed] = useState<HomeFeedData>({
    featured: [],
    trending: [],
    latest: [],
    rpg: [],
    action: [],
    top_rated: [],
  });
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // 1. Fetch user recent diary logs if logged in
    if (user) {
      usersAPI
        .getRatings(user.username, 1)
        .then((res) => {
          if (isMounted) setRecentRatings(res.data.slice(0, 10));
        })
        .catch(() => {});
    }

    // 2. Fetch multi-category home feed
    gamesAPI
      .getHomeFeed()
      .then((res) => {
        if (isMounted) {
          setFeed(res.data);
          setLoading(false);
        }
      })
      .catch(async () => {
        // Fallback to trending endpoint if needed
        try {
          const trendRes = await gamesAPI.getTrending(18);
          if (isMounted) {
            setFeed({
              featured: trendRes.data.slice(0, 4),
              trending: trendRes.data,
              latest: trendRes.data.slice(2, 10),
              rpg: trendRes.data.slice(4, 12),
              action: trendRes.data.slice(6, 14),
              top_rated: trendRes.data.slice(1, 9),
            });
            setLoading(false);
          }
        } catch {
          if (isMounted) setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [user]);

  const featuredGames = feed.featured.length > 0 ? feed.featured : feed.trending.slice(0, 4);
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
    <div className="min-h-screen pb-32 overflow-x-hidden w-full">
      {/* ========================================================= */}
      {/* 1. EXPANSIVE APPLE TV CINEMATIC BILLBOARD HERO            */}
      {/* ========================================================= */}
      {currentHero ? (
        <section className="relative w-full h-[74vh] sm:h-[84vh] min-h-[620px] max-h-[850px] overflow-hidden select-none bg-[#070709] border-b border-white/[0.08]">
          {/* Ambient Blurred Backlight */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <img
              key={`blur-${currentHero.rawg_id}`}
              src={currentHero.cover_url || ''}
              alt=""
              className="w-full h-full object-cover filter blur-[100px] opacity-35 scale-125 transition-opacity duration-1000"
            />
          </div>

          {/* Crisp Widescreen Backdrop Banner */}
          <div className="absolute inset-0">
            {currentHero.cover_url && (
              <img
                key={`banner-${currentHero.rawg_id}`}
                src={currentHero.cover_url}
                alt={currentHero.title}
                className="w-full h-full object-cover object-top filter brightness-[0.75] transition-all duration-1000 ease-out"
              />
            )}
            {/* Vignette Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#070709] via-[#070709]/75 sm:via-[#070709]/30 to-transparent" />
          </div>

          {/* Expansive Hero Content - Spanning Across Full Window with Generous Padding */}
          <div className="relative z-10 w-full px-6 sm:px-12 lg:px-16 xl:px-24 h-full flex flex-col justify-end pb-14 sm:pb-20">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
              {/* Left Column: Title & Actions */}
              <div className="md:col-span-8 lg:col-span-8">
                {/* Badges & Platform Vector Icons */}
                <div className="flex items-center gap-3 flex-wrap mb-4">
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-[#E50914] text-white shadow-[0_0_20px_rgba(229,9,20,0.5)] whitespace-nowrap">
                    Featured Masterpiece
                  </span>
                  {currentHero.release_date && (
                    <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md text-white border border-white/15 whitespace-nowrap">
                      {new Date(currentHero.release_date).getFullYear()}
                    </span>
                  )}
                  {/* Minimalist Platform Icons */}
                  <PlatformIconList
                    platforms={currentHero.platforms}
                    max={5}
                    className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white"
                  />
                </div>

                {/* Main Title */}
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] mb-4 drop-shadow-2xl">
                  {currentHero.title}
                </h1>

                {/* Subtitle */}
                <p className="text-sm sm:text-base text-white/80 font-normal mb-8 max-w-xl leading-relaxed">
                  Log your verdict, rate out of 5 stars, favorite, and share reviews with fellow gamers.
                </p>

                {/* Apple-Style Pill Buttons */}
                <div className="flex items-center gap-4 flex-wrap">
                  <Link
                    to={`/game/${currentHero.rawg_id}`}
                    className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full font-bold text-sm bg-white text-black hover:bg-white/90 shadow-[0_8px_30px_rgba(255,255,255,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap cursor-pointer"
                  >
                    <Star className="w-4 h-4 fill-black text-black" />
                    <span>Rate & Review</span>
                  </Link>

                  <Link
                    to={`/game/${currentHero.rawg_id}`}
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xl hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap cursor-pointer"
                  >
                    <span>View Game Details →</span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Floating Artwork Card */}
              <div className="hidden md:flex md:col-span-4 lg:col-span-4 justify-end">
                <Link
                  to={`/game/${currentHero.rawg_id}`}
                  className="w-52 lg:w-64 aspect-[2/3] rounded-3xl overflow-hidden border-2 border-white/20 shadow-[0_30px_70px_rgba(0,0,0,0.95)] hover:scale-105 transition-all duration-400 group relative block"
                >
                  <img
                    src={currentHero.cover_url || ''}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-bold text-white">Click to Open Details</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Billboard Carousel Dot Indicators */}
            <div className="flex items-center gap-2.5 pt-10 z-20">
              {featuredGames.map((game, idx) => (
                <button
                  key={game.rawg_id}
                  onClick={() => setActiveHeroIndex(idx)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    idx === activeHeroIndex
                      ? 'w-10 h-2.5 bg-white'
                      : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <div className="h-64 w-full bg-[#070709]" />
      )}

      {/* ========================================================= */}
      {/* 2. CENTERED SPOTLIGHT SEARCH SECTION                      */}
      {/* ========================================================= */}
      <section className="max-w-3xl mx-auto px-6 my-16 text-center">
        <SearchBar large placeholder="Search 800,000+ video games... (Press ⌘K)" />
      </section>

      {/* ========================================================= */}
      {/* 3. NETFLIX-STYLE HORIZONTAL CATEGORY SHELVES              */}
      {/* ========================================================= */}
      <div className="space-y-16 sm:space-y-24">
        {/* LOGGED IN USER: Personal Diary Shelf */}
        {user && recentRatings.length > 0 && (
          <GameShelf
            title="Your Gaming Diary"
            subtitle="Recent games you played, rated, or reviewed"
            icon={<Clock className="w-6 h-6 text-sky-400" />}
            games={recentRatings.map((r) => ({
              rawg_id: r.game.rawg_id,
              title: r.game.title,
              slug: r.game.slug,
              cover_url: r.game.cover_url,
              release_date: r.game.release_date,
              platforms: r.game.platforms,
            }))}
          />
        )}

        {/* SHELF 1: Trending Now */}
        <GameShelf
          title="Trending Masterpieces"
          subtitle="Top played titles across all gaming platforms"
          icon={<Flame className="w-6 h-6 text-[#E50914]" />}
          games={feed.trending}
        />

        {/* SHELF 2: Latest & Recent Releases */}
        <GameShelf
          title="New & Recent Hits"
          subtitle="Critically acclaimed releases from 2023 to 2026"
          icon={<Sparkles className="w-6 h-6 text-amber-400" />}
          games={feed.latest}
        />

        {/* SHELF 3: Legendary RPGs */}
        <GameShelf
          title="Legendary Role-Playing Games"
          subtitle="Immersive open worlds, rich narratives, and character progression"
          icon={<Sword className="w-6 h-6 text-purple-400" />}
          games={feed.rpg}
        />

        {/* SHELF 4: High-Octane Action */}
        <GameShelf
          title="Action & Adventure Blockbusters"
          subtitle="Heart-pounding gameplay, shooters, and epic adventures"
          icon={<Crosshair className="w-6 h-6 text-emerald-400" />}
          games={feed.action}
        />

        {/* SHELF 5: Critically Acclaimed */}
        <GameShelf
          title="Critically Acclaimed Hall of Fame"
          subtitle="Highest rated titles by critics and players alike"
          icon={<Award className="w-6 h-6 text-yellow-400" />}
          games={feed.top_rated}
        />

        {/* Loading skeleton placeholder */}
        {loading && feed.trending.length === 0 && (
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
      </div>
    </div>
  );
}
