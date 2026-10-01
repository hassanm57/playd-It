import { Link } from 'react-router-dom';
import { User as UserIcon, AlertTriangle } from 'lucide-react';
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
    <div className="apple-glass-subtle p-5 rounded-2xl border border-white/[0.08] hover:border-white/15 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to={`/@${review.user.username}`}
            className="w-9 h-9 rounded-full bg-[#181922] border border-white/15 flex items-center justify-center overflow-hidden flex-shrink-0 group"
          >
            {review.user.avatar_url ? (
              <img
                src={review.user.avatar_url}
                alt=""
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <UserIcon className="w-4 h-4 text-white/50" />
            )}
          </Link>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                to={`/@${review.user.username}`}
                className="text-sm font-semibold text-white hover:text-[#E50914] transition-colors truncate"
              >
                {review.user.username}
              </Link>
              <span className="text-[11px] text-white/40">· {date}</span>
            </div>

            {gameTitle && gameRawgId && (
              <Link
                to={`/game/${gameRawgId}`}
                className="text-xs text-[#8E8E98] hover:text-white transition-colors block truncate mt-0.5"
              >
                Reviewed <span className="text-white/80 font-medium">{gameTitle}</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Review Body */}
      {review.contains_spoilers ? (
        <details className="group mt-2">
          <summary className="text-xs font-semibold text-[#E50914] flex items-center gap-1.5 cursor-pointer hover:underline select-none">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Contains Spoilers — Click to Reveal</span>
          </summary>
          <p className="mt-3 text-sm text-[#D1D1DB] leading-relaxed pl-2 border-l-2 border-[#E50914]/40 font-normal">
            {review.body}
          </p>
        </details>
      ) : (
        <p className="text-sm text-[#D1D1DB] leading-relaxed font-normal">
          {review.body}
        </p>
      )}
    </div>
  );
}
