export interface User {
  id: number;
  username: string;
  avatar_url: string | null;
  bio: string;
  created_at: string;
}

export interface UserProfile extends User {
  games_rated: number;
  avg_rating: number | null;
}

export interface GameSearchResult {
  rawg_id: number;
  title: string;
  slug: string;
  cover_url: string | null;
  release_date: string | null;
  platforms: string[];
}

export interface GameDetail {
  id: number;
  rawg_id: number;
  title: string;
  slug: string;
  description: string;
  cover_url: string | null;
  background_url: string | null;
  release_date: string | null;
  developer: string;
  publisher: string;
  platforms: string[];
  genres: string[];
}

export interface GameStats {
  avg_rating: number | null;
  total_ratings: number;
  total_reviews: number;
  total_favorites: number;
}

export interface Rating {
  id: number;
  user_id: number;
  game_id: number;
  rating: number;
  created_at: string;
}

export interface Review {
  id: number;
  user_id: number;
  game_id: number;
  body: string;
  contains_spoilers: boolean;
  created_at: string;
  updated_at: string;
  user: User;
}

export interface UserGameStatus {
  rating: number | null;
  is_favorite: boolean;
  review: Review | null;
}

export interface UserRating {
  rating: number;
  created_at: string;
  game: GameSearchResult & { id: number };
}

export interface UserFavorite {
  created_at: string;
  game: GameSearchResult & { id: number };
}
