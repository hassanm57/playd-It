import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('playd_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('playd_token');
      // Don't redirect, let the UI handle it
    }
    return Promise.reject(error);
  }
);

export default api;

// --- Auth ---
export const authAPI = {
  register: (data: { username: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

// --- Games ---
export const gamesAPI = {
  search: (q: string) => api.get(`/games/search?q=${encodeURIComponent(q)}`),
  getDetail: (rawgId: number) => api.get(`/games/${rawgId}`),
  getStats: (rawgId: number) => api.get(`/games/${rawgId}/stats`),
  getStatus: (rawgId: number) => api.get(`/games/${rawgId}/status`),
  getReviews: (rawgId: number, page = 1) =>
    api.get(`/games/${rawgId}/reviews?page=${page}`),
};

// --- Ratings ---
export const ratingsAPI = {
  rate: (rawgId: number, rating: number) =>
    api.put(`/games/${rawgId}/rate`, { rating }),
  unrate: (rawgId: number) => api.delete(`/games/${rawgId}/rate`),
};

// --- Favorites ---
export const favoritesAPI = {
  toggle: (rawgId: number) => api.put(`/games/${rawgId}/love`),
};

// --- Reviews ---
export const reviewsAPI = {
  create: (rawgId: number, data: { body: string; contains_spoilers?: boolean }) =>
    api.post(`/games/${rawgId}/reviews`, data),
  update: (reviewId: number, data: { body?: string; contains_spoilers?: boolean }) =>
    api.put(`/reviews/${reviewId}`, data),
  delete: (reviewId: number) => api.delete(`/reviews/${reviewId}`),
};

// --- Users ---
export const usersAPI = {
  getProfile: (username: string) => api.get(`/users/${username}`),
  getRatings: (username: string, page = 1) =>
    api.get(`/users/${username}/ratings?page=${page}`),
  getFavorites: (username: string, page = 1) =>
    api.get(`/users/${username}/favorites?page=${page}`),
  getReviews: (username: string, page = 1) =>
    api.get(`/users/${username}/reviews?page=${page}`),
  updateProfile: (data: { bio?: string; avatar_url?: string }) =>
    api.patch('/users/me', data),
};

// --- Discover ---
export const discoverAPI = {
  popular: (limit = 20) => api.get(`/discover/popular?limit=${limit}`),
  topRated: (limit = 20) => api.get(`/discover/top-rated?limit=${limit}`),
  recent: (limit = 20) => api.get(`/discover/recent?limit=${limit}`),
};
