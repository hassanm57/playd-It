import { useState, useEffect, useCallback } from 'react';
import { authAPI } from '../lib/api';
import type { User } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('playd_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await authAPI.me();
      setUser(res.data);
    } catch {
      localStorage.removeItem('playd_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email: string, password: string) => {
    const res = await authAPI.login({ email, password });
    localStorage.setItem('playd_token', res.data.access_token);
    await fetchUser();
  };

  const register = async (username: string, email: string, password: string) => {
    const res = await authAPI.register({ username, email, password });
    localStorage.setItem('playd_token', res.data.access_token);
    await fetchUser();
  };

  const logout = () => {
    localStorage.removeItem('playd_token');
    setUser(null);
  };

  return { user, loading, login, register, logout, refetch: fetchUser };
}
