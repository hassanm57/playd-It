import { Link } from 'react-router-dom';
import { User as UserIcon } from 'lucide-react';
import type { Review } from '../types';

interface ReviewCardProps {
  review: Review;
  gameTitle?: string;
  gameRawgId?: number;
}

export default function ReviewCard({ review, gameTitle, gameRawgId }: ReviewCardProps) {
  const date = new Date(review.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="p-4 bg-bg-card rounded-xl border border-border">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <Link
          to={`/@${review.user.username}`}
          className="w-8 h-8 rounded-full bg-bg-secondary border border-border flex items-center justify-center overflow-hidden flex-shrink-0"
        >
          {review.user.avatar_url ? (
            <img src={review.user.avatar_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <UserIcon className="w-4 h-4 text-text-muted" />
          )}
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Link
              to={`/@${review.user.username}`}
              className="text-sm font-medium text-text-primary hover:text-white transition-colors"
            >
              {review.user.username}
            </Link>
            <span className="text-xs text-text-muted">{date}</span>
          </div>
          {gameTitle && gameRawgId && (
            <Link
              to={`/game/${gameRawgId}`}
              className="text-xs text-text-secondary hover:text-accent transition-colors"
            >
              {gameTitle}
            </Link>
          )}
        </div>
      </div>

      {/* Body */}
      {review.contains_spoilers ? (
        <details className="group">
          <summary className="text-sm text-accent cursor-pointer hover:text-accent-dark transition-colors">
            Contains spoilers — click to reveal
          </summary>
          <p className="mt-2 text-sm text-text-secondary leading-relaxed">
            {review.body}
          </p>
        </details>
      ) : (
        <p className="text-sm text-text-secondary leading-relaxed">
          {review.body}
        </p>
      )}
    </div>
  );
}
