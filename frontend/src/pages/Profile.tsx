import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { User as UserIcon } from 'lucide-react';
import GameCard from '../components/GameCard';
import StarRating from '../components/StarRating';
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
  const [tab, setTab] = useState<'overview' | 'ratings' | 'reviews' | 'favorites'>('overview');

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
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex flex-col items-center gap-4 mb-10">
          <div className="w-20 h-20 rounded-full skeleton" />
          <div className="h-6 w-32 skeleton rounded" />
          <div className="h-4 w-48 skeleton rounded" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <p className="text-text-muted">User not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Profile header */}
      <div className="flex flex-col items-center mb-10">
        <div className="w-20 h-20 rounded-full bg-bg-card border-2 border-border flex items-center justify-center overflow-hidden mb-4">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <UserIcon className="w-8 h-8 text-text-muted" />
          )}
        </div>
        <h1 className="text-xl font-bold mb-1">{profile.username}</h1>
        <p className="text-sm text-text-secondary mb-3">@{profile.username}</p>
        {profile.bio && (
          <p className="text-sm text-text-muted text-center max-w-md mb-3">{profile.bio}</p>
        )}
        <div className="flex items-center gap-6 text-sm">
          <div className="text-center">
            <span className="font-semibold text-text-primary">{profile.games_rated}</span>
            <span className="text-text-muted ml-1">games</span>
          </div>
          {profile.avg_rating && (
            <div className="text-center">
              <span className="font-semibold text-text-primary">{profile.avg_rating.toFixed(1)}</span>
              <span className="text-text-muted ml-1">avg</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-border mb-8">
        {(['overview', 'ratings', 'reviews', 'favorites'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
              tab === t
                ? 'border-accent text-text-primary'
                : 'border-transparent text-text-muted hover:text-text-secondary'
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'overview' && (
        <>
          {/* Favorites */}
          {favorites.length > 0 && (
            <div className="mb-10">
              <h2 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-4">
                Favorites
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {favorites.slice(0, 6).map((fav) => (
                  <GameCard
                    key={fav.game.rawg_id}
                    rawgId={fav.game.rawg_id}
                    title={fav.game.title}
                    slug={fav.game.slug}
                    coverUrl={fav.game.cover_url}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Recent ratings */}
          {ratings.length > 0 && (
            <div className="mb-10">
              <h2 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-4">
                Recent Ratings
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {ratings.slice(0, 12).map((item) => (
                  <GameCard
                    key={item.game.rawg_id}
                    rawgId={item.game.rawg_id}
                    title={item.game.title}
                    slug={item.game.slug}
                    coverUrl={item.game.cover_url}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Recent reviews */}
          {reviews.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-4">
                Reviews
              </h2>
              <div className="space-y-3">
                {reviews.slice(0, 5).map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </div>
          )}

          {ratings.length === 0 && favorites.length === 0 && (
            <div className="text-center py-16">
              <p className="text-text-muted">No activity yet.</p>
            </div>
          )}
        </>
      )}

      {tab === 'ratings' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {ratings.map((item) => (
            <div key={item.game.rawg_id}>
              <GameCard
                rawgId={item.game.rawg_id}
                title={item.game.title}
                slug={item.game.slug}
                coverUrl={item.game.cover_url}
              />
              <div className="mt-1">
                <StarRating value={item.rating} readonly size={14} />
              </div>
            </div>
          ))}
          {ratings.length === 0 && (
            <div className="col-span-full text-center py-16">
              <p className="text-text-muted">No ratings yet.</p>
            </div>
          )}
        </div>
      )}

      {tab === 'reviews' && (
        <div className="space-y-3">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
          {reviews.length === 0 && (
            <div className="text-center py-16">
              <p className="text-text-muted">No reviews yet.</p>
            </div>
          )}
        </div>
      )}

      {tab === 'favorites' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {favorites.map((fav) => (
            <div key={fav.game.rawg_id}>
              <GameCard
                rawgId={fav.game.rawg_id}
                title={fav.game.title}
                slug={fav.game.slug}
                coverUrl={fav.game.cover_url}
              />
            </div>
          ))}
          {favorites.length === 0 && (
            <div className="col-span-full text-center py-16">
              <p className="text-text-muted">No favorites yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
