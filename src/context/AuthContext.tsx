/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  username: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  socialLogin: (provider: string, email: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  register: (name: string, username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (name: string, username: string, email: string, password?: string) => Promise<void>;
  isAuthLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>({
    id: 'mock-user-id',
    email: 'hacker@wyrmsentry.ai',
    name: 'Admin User',
    username: 'admin'
  });
  const [token, setToken] = useState<string | null>('mock-token');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  
  const noop = async () => {};

  return (
    <AuthContext.Provider value={{
      user, token, isLoading, isAuthLoading,
      login: noop, socialLogin: noop, signInWithGoogle: noop, signInWithGithub: noop, register: noop, logout: noop, updateProfile: noop
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within a AuthProvider');
  return context;
}
