import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import GameCard from '../components/GameCard';
import type { User, UserRating } from '../types';
import { usersAPI, discoverAPI } from '../lib/api';

interface HomeProps {
  user: User | null;
}

export default function Home({ user }: HomeProps) {
  const [recentRatings, setRecentRatings] = useState<UserRating[]>([]);
  const [popularGames, setPopularGames] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      usersAPI.getRatings(user.username, 1).then((res) => {
        setRecentRatings(res.data.slice(0, 6));
      }).catch(() => {});
    }
    discoverAPI.popular(8).then((res) => {
      setPopularGames(res.data);
    }).catch(() => {});
  }, [user]);

  // Logged out landing
  if (!user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-4">
          PLAYD<span className="text-accent">.</span>
        </h1>
        <p className="text-lg text-text-secondary mb-8">
          Every game you've played.
        </p>
        <div className="w-full max-w-lg mb-12">
          <SearchBar large autoFocus />
        </div>
        <p className="text-sm text-text-muted mb-8">
          Track games. Rate them. Love them. Review them.
        </p>
        <div className="flex gap-3">
          <Link
            to="/register"
            className="bg-accent hover:bg-accent-dark text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
          >
            Get Started
          </Link>
          <Link
            to="/discover"
            className="bg-bg-card hover:bg-bg-card-hover text-text-primary border border-border px-6 py-2.5 rounded-lg font-medium transition-colors"
          >
            Discover
          </Link>
        </div>

        {/* Popular games */}
        {popularGames.length > 0 && (
          <div className="mt-16 w-full max-w-5xl">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Popular on PLAYD
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-4">
              {popularGames.slice(0, 8).map((game: any) => (
                <GameCard
                  key={game.rawg_id}
                  rawgId={game.rawg_id}
                  title={game.title}
                  slug={game.slug}
                  coverUrl={game.cover_url}
                  releaseDate={game.release_date}
                  platforms={game.platforms}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Logged in home
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">
        {getGreeting()}, {user.username}
      </h1>

      <div className="max-w-lg mb-10">
        <SearchBar large />
      </div>

      {/* Recent activity */}
      {recentRatings.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-4">
            Your recent games
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {recentRatings.map((item) => (
              <GameCard
                key={item.game.rawg_id}
                rawgId={item.game.rawg_id}
                title={item.game.title}
                slug={item.game.slug}
                coverUrl={item.game.cover_url}
                releaseDate={item.game.release_date}
                platforms={item.game.platforms}
              />
            ))}
          </div>
        </div>
      )}

      {recentRatings.length === 0 && (
        <div className="text-center py-16">
          <p className="text-text-muted mb-2">You haven't rated any games yet.</p>
          <p className="text-text-muted text-sm">Search for something you've played.</p>
        </div>
      )}
    </div>
  );
}
