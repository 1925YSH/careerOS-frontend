'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient, ApiError } from './api-client';

export type UserRole = 'candidate' | 'company' | 'admin';

export interface User {
  _id: string;
  email: string;
  role: UserRole;
  status: string;
  emailVerified: boolean;
  createdAt: string;
}

export interface CandidateProfile {
  _id: string;
  userId: string;
  name: string;
  headline?: string;
  location?: string;
  skills: Array<{ name: string; proficiency: string; yearsOfExperience: number }>;
  completenessScore: number;
}

export interface CompanyProfile {
  _id: string;
  ownerUserId: string;
  name: string;
  domain: string;
  verified: boolean;
  status: string;
  careersUrl?: string;
}

interface AuthContextType {
  user: User | null;
  profile: CandidateProfile | CompanyProfile | null;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (payload: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<CandidateProfile | CompanyProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = useCallback(async () => {
    try {
      const data = await apiClient<{ user: User; profile: any }>('/auth/me');
      setUser(data.user);
      setProfile(data.profile);
    } catch (err) {
      setUser(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const data = await apiClient<{ user: User; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      setUser(data.user);
      await refreshUser();
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: any) => {
    setIsLoading(true);
    try {
      const data = await apiClient<{ user: User; token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setUser(data.user);
      await refreshUser();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await apiClient('/auth/logout', { method: 'POST' });
      setUser(null);
      setProfile(null);
      window.location.href = '/';
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
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

