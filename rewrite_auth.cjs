const fs = require('fs');
let content = fs.readFileSync('src/context/AuthContext.tsx', 'utf8');

// We want to rewrite AuthContext.tsx to just provide a dummy user always.
const mockAuth = `/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  user: any;
  token: string | null;
  loading: boolean;
  login: () => Promise<void>;
  register: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: { id: 'usr_local', name: 'Local User', email: 'local@example.com', username: 'local_user' },
  token: 'mock-token',
  loading: false,
  login: async () => {},
  register: async () => {},
  logout: () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>({ 
    id: 'usr_local', 
    name: 'Local User', 
    email: 'local@example.com', 
    username: 'local_user' 
  });
  
  return (
    <AuthContext.Provider value={{
      user,
      token: 'mock-token',
      loading: false,
      login: async () => {},
      register: async () => {},
      logout: () => {}
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
`;

fs.writeFileSync('src/context/AuthContext.tsx', mockAuth);
