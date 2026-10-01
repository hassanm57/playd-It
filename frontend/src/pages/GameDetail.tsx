import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, Gamepad2, AlertCircle, MessageSquarePlus, Trash2, Edit3 } from 'lucide-react';
import StarRating from '../components/StarRating';
import LoveButton from '../components/LoveButton';
import ReviewCard from '../components/ReviewCard';
import PlatformIcon, { getPlatformFamilyName } from '../components/PlatformIcon';
import { gamesAPI, ratingsAPI, favoritesAPI, reviewsAPI } from '../lib/api';
import type { GameDetail as GameDetailType, GameStats, UserGameStatus, Review, User } from '../types';

interface GameDetailProps {
  user: User | null;
}

export default function GameDetail({ user }: GameDetailProps) {
  const { rawgId } = useParams<{ rawgId: string }>();
  const id = Number(rawgId);
  const navigate = useNavigate();

  const [game, setGame] = useState<GameDetailType | null>(null);
  const [stats, setStats] = useState<GameStats | null>(null);
  const [status, setStatus] = useState<UserGameStatus | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Review form state
  const [reviewText, setReviewText] = useState('');
  const [spoilers, setSpoilers] = useState(false);
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [gameRes, statsRes, reviewsRes] = await Promise.all([
        gamesAPI.getDetail(id),
        gamesAPI.getStats(id),
        gamesAPI.getReviews(id),
      ]);
      setGame(gameRes.data);
      setStats(statsRes.data);
      setReviews(reviewsRes.data);

      if (user) {
        const statusRes = await gamesAPI.getStatus(id);
        setStatus(statusRes.data);
        if (statusRes.data.review) {
          setReviewText(statusRes.data.review.body);
          setSpoilers(statusRes.data.review.contains_spoilers);
        }
      }
    } catch {
      // Game not found or error
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRate = async (rating: number | null) => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      if (rating === null) {
        await ratingsAPI.unrate(id);
      } else {
        await ratingsAPI.rate(id, rating);
      }
      const [statusRes, statsRes] = await Promise.all([
        gamesAPI.getStatus(id),
        gamesAPI.getStats(id),
      ]);
      setStatus(statusRes.data);
      setStats(statsRes.data);
    } catch {}
  };

  const handleLove = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await favoritesAPI.toggle(id);
      const [statusRes, statsRes] = await Promise.all([
        gamesAPI.getStatus(id),
        gamesAPI.getStats(id),
      ]);
      setStatus(statusRes.data);
      setStats(statsRes.data);
    } catch {}
  };

  const handleSubmitReview = async () => {
    if (!user || !reviewText.trim()) return;
    setSubmittingReview(true);
    try {
      if (status?.review) {
        await reviewsAPI.update(status.review.id, {
          body: reviewText.trim(),
          contains_spoilers: spoilers,
        });
      } else {
        await reviewsAPI.create(id, {
          body: reviewText.trim(),
          contains_spoilers: spoilers,
        });
      }
      setIsEditingReview(false);
      await fetchData();
    } catch {}
    setSubmittingReview(false);
  };

  const handleDeleteReview = async () => {
    if (!status?.review) return;
    try {
      await reviewsAPI.delete(status.review.id);
      setReviewText('');
      setSpoilers(false);
      setIsEditingReview(false);
      await fetchData();
    } catch {}
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-56 sm:w-64 aspect-[2/3] apple-skeleton rounded-2xl flex-shrink-0 mx-auto md:mx-0" />
          <div className="flex-1 space-y-4">
            <div className="h-10 w-3/4 apple-skeleton rounded-xl" />
            <div className="h-5 w-1/3 apple-skeleton rounded-lg" />
            <div className="h-24 w-full apple-skeleton rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <AlertCircle className="w-12 h-12 text-white/30 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Game Not Found</h2>
        <p className="text-sm text-white/50 mb-6">We couldn't retrieve the details for this title.</p>
        <Link
          to="/"
          className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold tracking-wide transition-all"
        >
          Return Home
        </Link>
      </div>
    );
  }

  const releaseYear = game.release_date
    ? new Date(game.release_date).getFullYear()
    : null;

  return (
    <div className="relative min-h-screen pb-24">
      {/* ========================================================= */}
      {/* 1. CINEMATIC FULL-BLEED BACKDROP                          */}
      {/* ========================================================= */}
      <div className="absolute top-0 left-0 right-0 h-[520px] overflow-hidden pointer-events-none -z-0">
        {game.background_url ? (
          <img
            src={game.background_url}
            alt=""
            className="w-full h-full object-cover filter blur-[2px] brightness-[0.4] scale-105"
          />
        ) : game.cover_url ? (
          <img
            src={game.cover_url}
            alt=""
            className="w-full h-full object-cover filter blur-[20px] brightness-[0.3] scale-110"
          />
        ) : null}
        {/* Soft edge fade into obsidian canvas */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#070709]/75 to-[#070709]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-transparent to-transparent" />
      </div>

      {/* ========================================================= */}
      {/* 2. GAME DETAIL HERO                                       */}
      {/* ========================================================= */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Floating Poster Card */}
          <div className="w-52 sm:w-64 flex-shrink-0 mx-auto md:mx-0">
            <div className="aspect-[2/3] rounded-2xl overflow-hidden bg-[#121319] border border-white/20 shadow-[0_24px_50px_rgba(0,0,0,0.9)] relative group">
              {game.cover_url ? (
                <img
                  src={game.cover_url}
                  alt={game.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-white/30 p-4">
                  <Gamepad2 className="w-10 h-10 mb-2 stroke-[1.2]" />
                  <span className="text-xs uppercase tracking-wider">No Cover</span>
                </div>
              )}
            </div>
          </div>

          {/* Title & Metadata */}
          <div className="flex-1 flex flex-col justify-end">
            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap mb-3">
              {releaseYear && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md text-white/90 border border-white/10">
                  {releaseYear}
                </span>
              )}
              {game.developer && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md text-white/80 border border-white/10">
                  {game.developer}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4 drop-shadow-md">
              {game.title}
            </h1>

            {/* Platforms with Minimalist Icons */}
            {game.platforms.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-5">
                {game.platforms.map((p) => (
                  <span
                    key={p}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/[0.07] border border-white/[0.1] text-white/85 backdrop-blur-md hover:bg-white/[0.12] transition-colors"
                  >
                    <PlatformIcon platform={p} className="w-3.5 h-3.5 text-white/70" />
                    <span>{getPlatformFamilyName(p)}</span>
                  </span>
                ))}
              </div>
            )}

            {/* Community Rating Pill */}
            <div className="flex items-center gap-4 py-3 px-4 rounded-2xl apple-glass w-fit mb-6 border border-white/10">
              <div className="flex items-center gap-2">
                <StarRating value={stats?.avg_rating ?? null} readonly size={18} />
                <span className="text-base font-bold text-white">
                  {stats?.avg_rating ? stats.avg_rating.toFixed(2) : '—'}
                </span>
              </div>
              <div className="h-4 w-px bg-white/15" />
              <div className="text-xs text-white/50">
                <strong className="text-white font-semibold">{stats?.total_ratings || 0}</strong> {stats?.total_ratings === 1 ? 'rating' : 'ratings'}
              </div>
              {stats?.total_favorites ? (
                <>
                  <div className="h-4 w-px bg-white/15" />
                  <div className="flex items-center gap-1.5 text-xs text-[#E50914] font-medium">
                    <Heart className="w-3.5 h-3.5 fill-[#E50914]" />
                    <span>{stats.total_favorites}</span>
                  </div>
                </>
              ) : null}
            </div>

            {/* Genres */}
            {game.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 text-xs text-white/60">
                {game.genres.map((g) => (
                  <span key={g} className="hover:text-white transition-colors">
                    #{g}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. YOUR DIARY LOGGING STAGE (RATE / LOVE / REVIEW)        */}
        {/* ========================================================= */}
        <section className="mt-10 p-6 sm:p-8 rounded-3xl apple-glass border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
            {/* Rating Section */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/40 mb-2">
                Your Rating
              </p>
              <div className="flex items-center gap-3">
                <StarRating
                  value={status?.rating ?? null}
                  onChange={handleRate}
                  size={28}
                  showValue
                />
              </div>
            </div>

            {/* Love Button Section */}
            <div className="flex items-center gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-white/40 mb-2">
                  Favorite
                </p>
                <LoveButton
                  loved={status?.is_favorite ?? false}
                  onClick={handleLove}
                  size={20}
                  showLabel
                  variant="pill"
                />
              </div>
            </div>
          </div>

          {/* Review Box */}
          <div className="mt-6">
            <p className="text-xs font-bold uppercase tracking-wider text-white/40 mb-3 flex items-center justify-between">
              <span>Your Review & Thoughts</span>
              {status?.review && !isEditingReview && (
                <span className="text-emerald-400 font-medium normal-case text-[11px] flex items-center gap-1">
                  ✓ Review logged to diary
                </span>
              )}
            </p>

            {status?.review && !isEditingReview ? (
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
                <p className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap">
                  {status.review.body}
                </p>
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/[0.06]">
                  <button
                    onClick={() => setIsEditingReview(true)}
                    className="text-xs font-semibold text-white/60 hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Review</span>
                  </button>
                  <button
                    onClick={handleDeleteReview}
                    className="text-xs font-semibold text-white/40 hover:text-[#E50914] flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder={
                    user
                      ? "Write a review... What made this game special or memorable?"
                      : "Log in to write a review for this game..."
                  }
                  rows={3}
                  maxLength={5000}
                  disabled={!user}
                  className="w-full p-4 rounded-2xl bg-black/40 border border-white/10 text-white placeholder:text-white/30 text-sm outline-none focus:border-white/30 transition-all resize-none font-normal"
                />

                <div className="flex items-center justify-between flex-wrap gap-3">
                  <label className="flex items-center gap-2 text-xs text-white/60 select-none cursor-pointer">
                    <input
                      type="checkbox"
                      checked={spoilers}
                      onChange={(e) => setSpoilers(e.target.checked)}
                      className="accent-[#E50914] rounded cursor-pointer"
                    />
                    <span>Contains Spoilers</span>
                  </label>

                  <div className="flex items-center gap-2">
                    {isEditingReview && (
                      <button
                        onClick={() => {
                          setIsEditingReview(false);
                          setReviewText(status?.review?.body || '');
                          setSpoilers(status?.review?.contains_spoilers || false);
                        }}
                        className="px-4 py-2 text-xs font-semibold text-white/60 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                    )}

                    <button
                      onClick={user ? handleSubmitReview : () => navigate('/login')}
                      disabled={Boolean(user && (!reviewText.trim() || submittingReview))}
                      className="px-6 py-2 rounded-full text-xs font-semibold bg-white text-black hover:bg-white/90 shadow-[0_4px_20px_rgba(255,255,255,0.15)] disabled:opacity-40 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {submittingReview
                        ? 'Publishing...'
                        : status?.review
                          ? 'Update Review'
                          : user
                            ? 'Publish Review'
                            : 'Log in to Review'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 4. ABOUT & OVERVIEW                                       */}
        {/* ========================================================= */}
        {game.description && (
          <section className="mt-12">
            <h2 className="text-lg font-bold tracking-tight text-white mb-3">
              About the Game
            </h2>
            <div className="p-6 rounded-2xl apple-glass-subtle border border-white/[0.06]">
              <p className="text-sm text-white/80 leading-relaxed whitespace-pre-line font-normal">
                {game.description}
              </p>
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* 5. COMMUNITY REVIEWS DIARY                                */}
        {/* ========================================================= */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <span>Community Reviews</span>
              <span className="text-xs font-normal text-white/40">({reviews.length})</span>
            </h2>
          </div>

          {reviews.length > 0 ? (
            <div className="space-y-3">
              {reviews.map((rev) => (
                <ReviewCard key={rev.id} review={rev} />
              ))}
            </div>
          ) : (
            <div className="p-10 rounded-2xl apple-glass-subtle border border-white/[0.06] text-center">
              <MessageSquarePlus className="w-8 h-8 text-white/20 mx-auto mb-2" />
              <p className="text-sm font-medium text-white/60">No reviews yet.</p>
              <p className="text-xs text-white/35 mt-1">Be the first to share your thoughts on this game.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
