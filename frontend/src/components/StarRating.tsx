import { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number | null;
  onChange?: (rating: number | null) => void;
  readonly?: boolean;
  size?: number;
  showValue?: boolean;
}

const RATING_LABELS: Record<number, string> = {
  0.5: 'Terrible',
  1.0: 'Poor',
  1.5: 'Disappointing',
  2.0: 'Mediocre',
  2.5: 'Decent',
  3.0: 'Good',
  3.5: 'Very Good',
  4.0: 'Great',
  4.5: 'Exceptional',
  5.0: 'Masterpiece',
};

export default function StarRating({
  value,
  onChange,
  readonly = false,
  size = 22,
  showValue = false,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const displayValue = hoverValue ?? value ?? 0;

  const handleClick = (starRating: number) => {
    if (readonly || !onChange) return;
    if (starRating === value) {
      onChange(null); // Toggle off
    } else {
      onChange(starRating);
    }
  };

  return (
    <div className="inline-flex items-center gap-2.5 select-none">
      <div
        className="flex items-center gap-1.5"
        onMouseLeave={() => !readonly && setHoverValue(null)}
      >
        {[0, 1, 2, 3, 4].map((starIndex) => {
          const starNumber = starIndex + 1;
          const fillPercent =
            displayValue >= starNumber
              ? 100
              : displayValue >= starNumber - 0.5
                ? 50
                : 0;

          return (
            <div
              key={starIndex}
              className={`relative group ${
                readonly ? 'cursor-default' : 'cursor-pointer'
              } transition-transform duration-150 ${
                !readonly ? 'hover:scale-115 active:scale-95' : ''
              }`}
            >
              {/* Invisible Left & Right Click Target Zones for Precision */}
              {!readonly && (
                <>
                  <div
                    className="absolute inset-y-0 left-0 w-1/2 z-20"
                    onMouseEnter={() => setHoverValue(starIndex + 0.5)}
                    onClick={() => handleClick(starIndex + 0.5)}
                    title={`${starIndex + 0.5} stars`}
                  />
                  <div
                    className="absolute inset-y-0 right-0 w-1/2 z-20"
                    onMouseEnter={() => setHoverValue(starIndex + 1.0)}
                    onClick={() => handleClick(starIndex + 1.0)}
                    title={`${starIndex + 1.0} stars`}
                  />
                </>
              )}

              {/* Background Empty Star */}
              <Star
                size={size}
                className="text-white/15 stroke-[1.5] transition-colors"
              />

              {/* Filled Star with Glowing Gradient */}
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none transition-all duration-150"
                style={{ width: `${fillPercent}%` }}
              >
                <Star
                  size={size}
                  className="text-[#E50914] fill-[#E50914] stroke-[1.5] drop-shadow-[0_0_8px_rgba(229,9,20,0.55)]"
                />
              </div>
            </div>
          );
        })}
      </div>

      {showValue && (displayValue > 0 || (value !== null && value !== undefined)) && (
        <div className="flex items-center gap-2 animate-in fade-in duration-200">
          <span className="text-sm font-bold text-white px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 shadow-sm">
            {displayValue.toFixed(1)}
          </span>
          {RATING_LABELS[displayValue] && (
            <span className="text-xs font-medium text-[#A0A0AB] hidden sm:inline">
              {RATING_LABELS[displayValue]}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
