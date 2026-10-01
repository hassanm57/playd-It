import { useRef, useState, useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import GameCard from './GameCard';
import type { GameSearchResult } from '../types';

interface GameShelfProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  games: GameSearchResult[];
  seeAllLink?: string;
}

export default function GameShelf({
  title,
  subtitle,
  icon,
  games,
  seeAllLink,
}: GameShelfProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [games]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
    setTimeout(checkScroll, 350);
  };

  if (!games || games.length === 0) return null;

  return (
    <section className="relative group w-full my-8">
      {/* Shelf Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex items-end justify-between mb-4">
        <div>
          <div className="flex items-center gap-2.5">
            {icon && <span className="text-[#E50914]">{icon}</span>}
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              {title}
            </h2>
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-white/40 mt-1 font-normal">{subtitle}</p>
          )}
        </div>

        {/* Right Header: Optional See All + Scroll Nav Buttons */}
        <div className="flex items-center gap-3">
          {seeAllLink && (
            <Link
              to={seeAllLink}
              className="text-xs font-semibold text-white/50 hover:text-white transition-colors mr-1"
            >
              See all →
            </Link>
          )}

          {/* Scroll Nav Buttons (Desktop) */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                canScrollLeft
                  ? 'bg-white/10 hover:bg-white/20 text-white cursor-pointer hover:scale-105 active:scale-95'
                  : 'bg-white/5 text-white/20 cursor-not-allowed opacity-30'
              }`}
              title="Scroll Left"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                canScrollRight
                  ? 'bg-white/10 hover:bg-white/20 text-white cursor-pointer hover:scale-105 active:scale-95'
                  : 'bg-white/5 text-white/20 cursor-not-allowed opacity-30'
              }`}
              title="Scroll Right"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Carousel Track - with generous py-4 so hover scale never clips */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar scroll-smooth py-4 px-1"
        >
          {games.map((game) => (
            <div
              key={game.rawg_id}
              className="w-[155px] sm:w-[195px] md:w-[210px] flex-shrink-0"
            >
              <GameCard
                rawgId={game.rawg_id}
                title={game.title}
                coverUrl={game.cover_url}
                releaseDate={game.release_date}
                platforms={game.platforms}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
