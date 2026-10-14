'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, RoleType } from '@/types';
import { DEMO_USERS } from './mock-data';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string) => boolean;
  loginAsDemo: (userId: string) => void;
  logout: () => void;
  hasRole: (roles: RoleType[]) => boolean;
  canAccessDisciplinary: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'ncp_bakalia_auth_user_v1';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to restore auth session:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (email: string): boolean => {
    const matched = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (matched) {
      setUser(matched);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(matched));
      return true;
    }
    // Generic fallback for authorized test logins
    const genericUser: UserProfile = {
      id: `user-${Date.now()}`,
      email,
      name: email.split('@')[0],
      role: 'member',
      position_bn: 'কমিটি সদস্য',
      is_active: true,
      created_at: new Date().toISOString(),
    };
    setUser(genericUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(genericUser));
    return true;
  };

  const loginAsDemo = (userId: string) => {
    const matched = DEMO_USERS.find((u) => u.id === userId);
    if (matched) {
      setUser(matched);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(matched));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const hasRole = (roles: RoleType[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const canAccessDisciplinary = (): boolean => {
    if (!user) return false;
    return ['super_admin', 'convener', 'member_secretary'].includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        loginAsDemo,
        logout,
        hasRole,
        canAccessDisciplinary,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
