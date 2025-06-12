import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { api } from '../lib/api';

interface User {
  id: number;
  email: string;
  name: string;
}

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('token');
    if (stored) {
      api('/users/me', { headers: { Authorization: `Bearer ${stored}` } })
        .then(setUser)
        .catch(() => localStorage.removeItem('token'));
    }
  }, []);

  async function login(email: string, password: string) {
    const data = await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    localStorage.setItem('token', data.token);
    setUser(data.user);
  }

  async function register(email: string, password: string, name: string) {
    await api('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name })
    });
    await login(email, password);
  }

  function logout() {
    localStorage.removeItem('token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('AuthContext');
  return ctx;
}
