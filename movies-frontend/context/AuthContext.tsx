'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';

interface User {
  name: string;
  image: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  signup: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  signup: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await api.get('/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setIsAuthenticated(true);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    fetchUser();
  };

  const signup = (token: string) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    fetchUser();
  };

  const logout = () => {
    localStorage.removeItem('token');
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setUser(null);
    setIsAuthenticated(false);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
