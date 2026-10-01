import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Star } from 'lucide-react';

interface GameCardProps {
  rawgId: number;
  title: string;
  slug?: string;
  coverUrl: string | null;
  releaseDate?: string | null;
  platforms?: string[];
  rating?: number | null;
  aspect?: 'poster' | 'landscape';
}

export default function GameCard({
  rawgId,
  title,
  coverUrl,
  releaseDate,
  platforms = [],
  rating,
  aspect = 'poster',
}: GameCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const year = releaseDate ? new Date(releaseDate).getFullYear() : null;

  // Shorten platform names with clean modern tags
  const shortPlatforms = platforms.slice(0, 3).map((p) => {
    if (p.includes('PlayStation 5')) return 'PS5';
    if (p.includes('PlayStation 4')) return 'PS4';
    if (p.includes('PlayStation')) return 'PS';
    if (p.includes('Xbox Series')) return 'XSX';
    if (p.includes('Xbox One')) return 'XB1';
    if (p.includes('Xbox')) return 'Xbox';
    if (p.includes('Nintendo Switch') || p.includes('Switch')) return 'Switch';
    if (p.includes('PC')) return 'PC';
    if (p.includes('macOS') || p.includes('Mac')) return 'Mac';
    if (p.includes('iOS') || p.includes('Android')) return 'Mobile';
    return p.split(' ')[0];
  });

  const aspectClass = aspect === 'landscape' ? 'aspect-[16/9]' : 'aspect-[2/3]';

  return (
    <Link
      to={`/game/${rawgId}`}
      className="group relative block focus:outline-none"
    >
      {/* Ambient shadow glow on hover */}
      <div className="absolute -inset-1.5 rounded-[22px] bg-gradient-to-b from-white/10 to-transparent opacity-0 blur-xl transition-all duration-500 group-hover:opacity-100 group-hover:scale-105 pointer-events-none" />

      {/* Main Poster Container */}
      <div
        className={`apple-poster-card relative w-full ${aspectClass} rounded-2xl overflow-hidden bg-[#111218] border border-white/[0.08] group-hover:border-white/25`}
      >
        {/* Placeholder / Skeleton while loading */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 apple-skeleton" />
        )}

        {/* Cover Art Image */}
        {coverUrl && !imageError ? (
          <img
            src={coverUrl}
            alt={title}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#181922] to-[#0E0F14] text-white/30 p-4 text-center">
            <Gamepad2 className="w-8 h-8 mb-2 stroke-[1.2] text-white/20 group-hover:text-white/40 transition-colors" />
            <span className="text-[11px] font-medium tracking-wider uppercase text-white/40">No Artwork</span>
          </div>
        )}

        {/* Cinematic Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none" />

        {/* Top Badges (Rating / Loved) */}
        {rating !== undefined && rating !== null && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-white shadow-lg">
            <Star className="w-3 h-3 text-[#E50914] fill-[#E50914]" />
            <span>{rating.toFixed(1)}</span>
          </div>
        )}

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-3.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
            {shortPlatforms.slice(0, 2).map((plat) => (
              <span
                key={plat}
                className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/20 backdrop-blur-md text-white border border-white/20"
              >
                {plat}
              </span>
            ))}
          </div>

          <p className="text-xs font-semibold text-white drop-shadow-md truncate">
            View Details
          </p>
        </div>
      </div>

      {/* Title & Metadata (Underneath card for Apple TV grid elegance) */}
      <div className="mt-2.5 px-0.5">
        <h3 className="text-[13px] font-medium text-white/90 group-hover:text-white truncate transition-colors tracking-tight">
          {title}
        </h3>
        <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-[#8E8E98]">
          {year && <span>{year}</span>}
          {year && shortPlatforms.length > 0 && <span className="text-white/20">·</span>}
          {shortPlatforms.length > 0 && (
            <span className="truncate">
              {shortPlatforms.join(', ')}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
