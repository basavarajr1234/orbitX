import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: (payload: { credential?: string; email?: string; name?: string; picture?: string; googleId?: string }) => Promise<void>;
  demoLogin: (role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (roles: UserRole[]) => boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isContentManager: boolean;
  isStudent: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const initAuth = async () => {
    try {
      const stored = localStorage.getItem('orbitx_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUser(parsed);
        } catch (e) {
          localStorage.removeItem('orbitx_user');
        }
      }
      const res = await api.getMe();
      if (res.user) {
        setUser(res.user);
        localStorage.setItem('orbitx_user', JSON.stringify(res.user));
      }
    } catch (err) {
      console.warn('Auth check error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  const loginWithGoogle = async (payload: { credential?: string; email?: string; name?: string; picture?: string; googleId?: string }) => {
    setLoading(true);
    try {
      const res = await api.loginWithGoogle(payload);
      if (res.user) {
        setUser(res.user);
        localStorage.setItem('orbitx_user', JSON.stringify(res.user));
      }
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async (role: UserRole) => {
    setLoading(true);
    try {
      const res = await api.demoLogin(role);
      if (res.user) {
        setUser(res.user);
        localStorage.setItem('orbitx_user', JSON.stringify(res.user));
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (e) {
      // ignore
    }
    setUser(null);
    localStorage.removeItem('orbitx_user');
  };

  const refreshUser = async () => {
    const res = await api.getMe();
    if (res.user) {
      setUser(res.user);
      localStorage.setItem('orbitx_user', JSON.stringify(res.user));
    }
  };

  const hasRole = (roles: UserRole[]) => {
    if (!user) return false;
    if (user.role === 'super_admin') return true;
    return roles.includes(user.role);
  };

  const isSuperAdmin = user?.role === 'super_admin';
  const isAdmin = user?.role === 'super_admin' || user?.role === 'admin';
  const isContentManager = user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'content_manager';
  const isStudent = user?.role === 'student';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithGoogle,
        demoLogin,
        logout,
        hasRole,
        isSuperAdmin,
        isAdmin,
        isContentManager,
        isStudent,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
