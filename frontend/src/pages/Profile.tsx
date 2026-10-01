import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User as UserIcon, Star, Heart, MessageSquare, Calendar, Gamepad2 } from 'lucide-react';
import GameCard from '../components/GameCard';
import ReviewCard from '../components/ReviewCard';
import { usersAPI } from '../lib/api';
import type { UserProfile as UserProfileType, UserRating, UserFavorite, Review } from '../types';

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const cleanUsername = username?.replace('@', '') || '';

  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [ratings, setRatings] = useState<UserRating[]>([]);
  const [favorites, setFavorites] = useState<UserFavorite[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'overview' | 'ratings' | 'favorites' | 'reviews'>('overview');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      usersAPI.getProfile(cleanUsername),
      usersAPI.getRatings(cleanUsername),
      usersAPI.getFavorites(cleanUsername),
      usersAPI.getReviews(cleanUsername),
    ])
      .then(([profileRes, ratingsRes, favsRes, reviewsRes]) => {
        setProfile(profileRes.data);
        setRatings(ratingsRes.data);
        setFavorites(favsRes.data);
        setReviews(reviewsRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [cleanUsername]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex flex-col items-center gap-5 mb-14">
          <div className="w-28 h-28 rounded-full apple-skeleton" />
          <div className="h-7 w-44 apple-skeleton rounded-xl" />
          <div className="h-5 w-60 apple-skeleton rounded-lg" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-28 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Member Not Found</h2>
        <p className="text-sm text-white/50 mb-8">No user exists with the handle @{cleanUsername}.</p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold tracking-wide transition-all"
        >
          Return Home
        </Link>
      </div>
    );
  }

  const joinYear = new Date(profile.created_at).getFullYear();

  return (
    <div className="min-h-screen pb-32 w-full">
      {/* ========================================================= */}
      {/* 1. CINEMATIC PROFILE BANNER & HEADER                      */}
      {/* ========================================================= */}
      <section className="relative w-full pt-16 pb-12 overflow-hidden border-b border-white/[0.08]">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-gradient-to-b from-[#E50914]/15 via-transparent to-transparent blur-3xl pointer-events-none -z-0" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 flex flex-col items-center text-center">
          {/* Avatar with Specular Ring */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#15161F] p-1.5 border-2 border-white/20 shadow-[0_16px_50px_rgba(0,0,0,0.85)] mb-5 group">
            <div className="w-full h-full rounded-full overflow-hidden bg-[#181922] flex items-center justify-center">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="w-12 h-12 text-white/40" />
              )}
            </div>
          </div>

          {/* Username & Handle */}
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
            {profile.username}
          </h1>
          <p className="text-xs sm:text-sm font-medium text-white/40 mb-4 flex items-center gap-2">
            <span>@{profile.username}</span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Member since {joinYear}
            </span>
          </p>

          {/* Bio */}
          {profile.bio && (
            <p className="text-sm sm:text-base text-white/70 max-w-lg mb-8 leading-relaxed font-normal">
              {profile.bio}
            </p>
          )}

          {/* Apple TV Stats Ribbon */}
          <div className="flex items-center gap-6 sm:gap-10 px-8 py-4 rounded-2xl apple-glass border border-white/15 shadow-xl">
            <div className="text-center min-w-[50px]">
              <span className="block text-xl sm:text-2xl font-black text-white">
                {profile.games_rated}
              </span>
              <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                Logged
              </span>
            </div>

            <div className="h-8 w-px bg-white/15" />

            <div className="text-center min-w-[70px]">
              <span className="block text-xl sm:text-2xl font-black text-white flex items-center justify-center gap-1.5">
                <Star className="w-4 h-4 text-[#E50914] fill-[#E50914]" />
                {profile.avg_rating ? profile.avg_rating.toFixed(1) : '—'}
              </span>
              <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                Avg Rating
              </span>
            </div>

            <div className="h-8 w-px bg-white/15" />

            <div className="text-center min-w-[50px]">
              <span className="block text-xl sm:text-2xl font-black text-[#E50914]">
                {favorites.length}
              </span>
              <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                Favorites
              </span>
            </div>

            <div className="h-8 w-px bg-white/15" />

            <div className="text-center min-w-[50px]">
              <span className="block text-xl sm:text-2xl font-black text-white">
                {reviews.length}
              </span>
              <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                Reviews
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. TABS & EXPANSIVE CONTENT                               */}
      {/* ========================================================= */}
      <main className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-14 pt-10">
        {/* Apple TV Nav Pills */}
        <div className="flex items-center justify-center gap-3 mb-12 overflow-x-auto no-scrollbar py-1">
          {(['overview', 'ratings', 'favorites', 'reviews'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap transition-all select-none cursor-pointer ${
                tab === t
                  ? 'bg-white text-black shadow-lg scale-105'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              {t === 'overview'
                ? 'Overview'
                : t === 'ratings'
                  ? `Ratings (${ratings.length})`
                  : t === 'favorites'
                    ? `Favorites (${favorites.length})`
                    : `Reviews (${reviews.length})`}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {tab === 'overview' && (
          <div className="space-y-16">
            {/* Pinned Top Favorites */}
            {favorites.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
                    <Heart className="w-5 h-5 text-[#E50914] fill-[#E50914]" />
                    <span>Favorite Games</span>
                  </h2>
                  <button
                    onClick={() => setTab('favorites')}
                    className="text-xs sm:text-sm font-semibold text-white/40 hover:text-white transition-colors cursor-pointer"
                  >
                    View All ({favorites.length}) →
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-7">
                  {favorites.slice(0, 6).map((fav) => (
                    <GameCard
                      key={fav.game.rawg_id}
                      rawgId={fav.game.rawg_id}
                      title={fav.game.title}
                      coverUrl={fav.game.cover_url}
                      releaseDate={fav.game.release_date}
                      platforms={fav.game.platforms}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Recent Ratings Diary */}
            {ratings.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
                    <Star className="w-5 h-5 text-[#E50914] fill-[#E50914]" />
                    <span>Recent Activity</span>
                  </h2>
                  <button
                    onClick={() => setTab('ratings')}
                    className="text-xs sm:text-sm font-semibold text-white/40 hover:text-white transition-colors cursor-pointer"
                  >
                    View All ({ratings.length}) →
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-7">
                  {ratings.slice(0, 12).map((item) => (
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

            {/* Recent Reviews */}
            {reviews.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
                    <MessageSquare className="w-5 h-5 text-white/60" />
                    <span>Recent Reviews</span>
                  </h2>
                  <button
                    onClick={() => setTab('reviews')}
                    className="text-xs sm:text-sm font-semibold text-white/40 hover:text-white transition-colors cursor-pointer"
                  >
                    View All ({reviews.length}) →
                  </button>
                </div>

                <div className="max-w-4xl mx-auto space-y-4">
                  {reviews.slice(0, 4).map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </section>
            )}

            {ratings.length === 0 && favorites.length === 0 && (
              <div className="text-center py-24 p-10 rounded-3xl apple-glass border border-white/[0.08] max-w-lg mx-auto">
                <Gamepad2 className="w-14 h-14 text-white/20 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-1.5">No Activity Yet</h3>
                <p className="text-sm text-white/40 max-w-sm mx-auto mb-6 leading-relaxed font-normal">
                  {cleanUsername} hasn't rated or logged any games on PLAYD yet.
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-white text-black text-xs font-bold tracking-wide hover:bg-white/90 transition-all shadow-xl"
                >
                  Search Games to Log
                </Link>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: RATINGS */}
        {tab === 'ratings' && (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-7">
              {ratings.map((item) => (
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
            {ratings.length === 0 && (
              <div className="text-center py-24 text-white/40 text-sm max-w-md mx-auto">
                No ratings logged yet.
              </div>
            )}
          </div>
        )}

        {/* TAB 3: FAVORITES */}
        {tab === 'favorites' && (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-7">
              {favorites.map((fav) => (
                <GameCard
                  key={fav.game.rawg_id}
                  rawgId={fav.game.rawg_id}
                  title={fav.game.title}
                  coverUrl={fav.game.cover_url}
                  releaseDate={fav.game.release_date}
                  platforms={fav.game.platforms}
                />
              ))}
            </div>
            {favorites.length === 0 && (
              <div className="text-center py-24 text-white/40 text-sm max-w-md mx-auto">
                No favorite games added yet.
              </div>
            )}
          </div>
        )}

        {/* TAB 4: REVIEWS */}
        {tab === 'reviews' && (
          <div className="max-w-4xl mx-auto space-y-4">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
            {reviews.length === 0 && (
              <div className="text-center py-24 text-white/40 text-sm">
                No reviews written yet.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
