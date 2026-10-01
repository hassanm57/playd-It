import { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number | null;
  onChange?: (rating: number | null) => void;
  readonly?: boolean;
  size?: number;
  showValue?: boolean;
}

export default function StarRating({
  value,
  onChange,
  readonly = false,
  size = 24,
  showValue = false,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const displayValue = hoverValue ?? value ?? 0;

  const handleClick = (starIndex: number, isHalf: boolean) => {
    if (readonly || !onChange) return;
    const newRating = isHalf ? starIndex + 0.5 : starIndex + 1;
    // Click same rating to remove it
    if (newRating === value) {
      onChange(null);
    } else {
      onChange(newRating);
    }
  };

  const handleMouseMove = (e: React.MouseEvent, starIndex: number) => {
    if (readonly) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isHalf = x < rect.width / 2;
    setHoverValue(isHalf ? starIndex + 0.5 : starIndex + 1);
  };

  return (
    <div className="inline-flex items-center gap-1">
      <div
        className="star-rating"
        onMouseLeave={() => !readonly && setHoverValue(null)}
      >
        {[0, 1, 2, 3, 4].map((starIndex) => {
          const fillPercent =
            displayValue >= starIndex + 1
              ? 100
              : displayValue > starIndex
                ? (displayValue - starIndex) * 100
                : 0;

          return (
            <div
              key={starIndex}
              className={`star relative ${readonly ? 'cursor-default' : 'cursor-pointer'}`}
              onMouseMove={(e) => handleMouseMove(e, starIndex)}
              onClick={(e) => {
                if (readonly) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const isHalf = x < rect.width / 2;
                handleClick(starIndex, isHalf);
              }}
            >
              {/* Background star (empty) */}
              <Star
                size={size}
                className="text-[#27272A]"
                strokeWidth={1.5}
              />
              {/* Filled overlay */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fillPercent}%` }}
              >
                <Star
                  size={size}
                  className={hoverValue !== null && !readonly ? 'text-accent fill-accent' : value ? 'text-accent fill-accent' : 'text-accent fill-accent'}
                  strokeWidth={1.5}
                  style={{ fill: '#E50914', color: '#E50914' }}
                />
              </div>
            </div>
          );
        })}
      </div>
      {showValue && value !== null && value !== undefined && (
        <span className="ml-2 text-sm font-medium text-text-secondary">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}
