// Temporary mock identity and no-op auth actions. Real sessions begin in Phase 2.
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React,{ createContext,useContext,useState } from 'react';

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
  const [user] = useState<UserProfile | null>({
    id: 'mock-user-id',
    email: 'developer@ominicode.example',
    name: 'Admin User',
    username: 'admin'
  });
  const [token] = useState<string | null>('mock-token');
  const isLoading = false;
  const isAuthLoading = false;
  
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
