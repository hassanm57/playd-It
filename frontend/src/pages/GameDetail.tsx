import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StarRating from '../components/StarRating';
import LoveButton from '../components/LoveButton';
import ReviewCard from '../components/ReviewCard';
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
  const [editingReview, setEditingReview] = useState(false);
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
      // handle error
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
      // Refresh status and stats
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
      const statusRes = await gamesAPI.getStatus(id);
      setStatus(statusRes.data);
    } catch {}
  };

  const handleSubmitReview = async () => {
    if (!user || !reviewText.trim()) return;
    setSubmittingReview(true);
    try {
      if (status?.review) {
        await reviewsAPI.update(status.review.id, {
          body: reviewText,
          contains_spoilers: spoilers,
        });
      } else {
        await reviewsAPI.create(id, {
          body: reviewText,
          contains_spoilers: spoilers,
        });
      }
      setEditingReview(false);
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
      await fetchData();
    } catch {}
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-64 h-80 skeleton rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-4">
            <div className="h-8 w-3/4 skeleton rounded" />
            <div className="h-4 w-1/2 skeleton rounded" />
            <div className="h-4 w-1/3 skeleton rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <p className="text-text-muted">Game not found</p>
      </div>
    );
  }

  const year = game.release_date
    ? new Date(game.release_date).getFullYear()
    : null;

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      {/* Cinematic Backdrop Banner */}
      {game.background_url && (
        <div className="absolute top-0 left-0 right-0 h-96 overflow-hidden pointer-events-none opacity-20 -z-0">
          <img
            src={game.background_url}
            alt=""
            className="w-full h-full object-cover filter blur-xs scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-primary/80 to-bg-primary" />
        </div>
      )}

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-10">
        {/* Hero section */}
        <div className="flex flex-col md:flex-row gap-8 mb-10">
          {/* Cover */}
          <div className="w-48 md:w-64 flex-shrink-0 mx-auto md:mx-0">
            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-bg-card border border-border shadow-2xl shadow-black/50">
              {game.cover_url ? (
                <img
                  src={game.cover_url}
                  alt={game.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-muted">
                  No Image
                </div>
              )}
            </div>
          </div>

        {/* Info */}
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{game.title}</h1>

          <div className="flex flex-wrap items-center gap-2 text-text-secondary mb-4">
            {year && <span>{year}</span>}
            {game.developer && (
              <>
                <span className="text-text-muted">·</span>
                <span>{game.developer}</span>
              </>
            )}
          </div>

          {/* Platforms */}
          {game.platforms.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {game.platforms.map((p) => (
                <span
                  key={p}
                  className="text-xs px-2.5 py-1 rounded-md bg-bg-card border border-border text-text-secondary"
                >
                  {p}
                </span>
              ))}
            </div>
          )}

          {/* Community rating */}
          {stats && stats.total_ratings > 0 && (
            <div className="flex items-center gap-3 mb-5">
              <StarRating value={stats.avg_rating} readonly size={20} />
              <span className="text-lg font-semibold text-text-primary">
                {stats.avg_rating?.toFixed(2)}
              </span>
              <span className="text-sm text-text-muted">
                {stats.total_ratings.toLocaleString()} {stats.total_ratings === 1 ? 'rating' : 'ratings'}
              </span>
            </div>
          )}

          {/* Genres */}
          {game.genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {game.genres.map((g) => (
                <span
                  key={g}
                  className="text-xs px-2.5 py-1 rounded-full bg-bg-secondary border border-border text-text-muted"
                >
                  {g}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          {game.description && (
            <p className="text-sm text-text-secondary leading-relaxed line-clamp-4">
              {game.description}
            </p>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border mb-8" />

      {/* Your interaction section */}
      {user && (
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
            {/* Your rating */}
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Your Rating</p>
              <StarRating
                value={status?.rating ?? null}
                onChange={handleRate}
                size={28}
                showValue
              />
            </div>

            {/* Love button */}
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Love</p>
              <LoveButton
                loved={status?.is_favorite ?? false}
                onClick={handleLove}
                size={28}
                showLabel
              />
            </div>
          </div>

          {/* Review section */}
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wider mb-3">Your Review</p>
            {status?.review && !editingReview ? (
              <div className="bg-bg-card rounded-xl border border-border p-4">
                <p className="text-sm text-text-secondary leading-relaxed mb-3">
                  {status.review.body}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setEditingReview(true)}
                    className="text-xs text-text-muted hover:text-text-primary transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDeleteReview}
                    className="text-xs text-accent hover:text-accent-dark transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-bg-card rounded-xl border border-border p-4">
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Write your review here..."
                  className="w-full h-32 bg-transparent text-text-primary placeholder:text-text-muted outline-none resize-none mb-3 text-sm"
                />
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                    <input
                      type="checkbox"
                      checked={spoilers}
                      onChange={(e) => setSpoilers(e.target.checked)}
                      className="rounded border-border bg-bg-secondary text-accent focus:ring-accent"
                    />
                    Contains spoilers
                  </label>
                  <div className="flex gap-3">
                    {editingReview && (
                      <button
                        onClick={() => {
                          setEditingReview(false);
                          setReviewText(status?.review?.body || '');
                          setSpoilers(status?.review?.contains_spoilers || false);
                        }}
                        className="text-sm text-text-muted hover:text-text-primary transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      onClick={handleSubmitReview}
                      disabled={!reviewText.trim() || submittingReview}
                      className="px-4 py-1.5 bg-accent hover:bg-accent-dark text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      {submittingReview ? 'Saving...' : 'Save Review'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reviews list */}
      <div>
        <h2 className="text-xl font-bold mb-4">Reviews</h2>
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <p className="text-text-muted">No reviews yet. Be the first to review this game!</p>
        )}
      </div>
    </div>
  </div>
  );
}
