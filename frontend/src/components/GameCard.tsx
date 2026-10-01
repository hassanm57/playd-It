import { Link } from 'react-router-dom';

interface GameCardProps {
  rawgId: number;
  title: string;
  slug: string;
  coverUrl: string | null;
  releaseDate?: string | null;
  platforms?: string[];
}

export default function GameCard({
  rawgId,
  title,
  slug: _slug,
  coverUrl,
  releaseDate,
  platforms = [],
}: GameCardProps) {
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null;

  // Shorten platform names
  const shortPlatforms = platforms.slice(0, 3).map((p) => {
    if (p.includes('PC')) return 'PC';
    if (p.includes('PlayStation 5')) return 'PS5';
    if (p.includes('PlayStation 4')) return 'PS4';
    if (p.includes('PlayStation 3')) return 'PS3';
    if (p.includes('Xbox Series')) return 'XSX';
    if (p.includes('Xbox One')) return 'XB1';
    if (p.includes('Switch')) return 'Switch';
    return p.split(' ')[0];
  });

  return (
    <Link
      to={`/game/${rawgId}`}
      className="group block"
    >
      {/* Cover Image */}
      <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-bg-card border border-border/50 transition-all duration-200 group-hover:border-border-light group-hover:scale-[1.02] group-hover:shadow-lg group-hover:shadow-black/30">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted text-sm">
            No Image
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="mt-2 text-sm font-medium text-text-primary truncate group-hover:text-white transition-colors">
        {title}
      </h3>

      {/* Meta */}
      <div className="flex items-center gap-1.5 mt-0.5">
        {year && (
          <span className="text-xs text-text-muted">{year}</span>
        )}
        {year && shortPlatforms.length > 0 && (
          <span className="text-xs text-text-muted">·</span>
        )}
        {shortPlatforms.length > 0 && (
          <span className="text-xs text-text-muted">
            {shortPlatforms.join(' · ')}
            {platforms.length > 3 && ` +${platforms.length - 3}`}
          </span>
        )}
      </div>
    </Link>
  );
}
