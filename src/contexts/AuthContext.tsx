import React, { createContext, useContext, useState, ReactNode } from 'react';
import { currentStore, Store } from '@/lib/mockData';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'store_manager';
}

interface AuthContextType {
  user: User | null;
  store: Store;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - in real app, this would call an API
    if (email && password) {
      setUser({
        id: 'user-001',
        name: 'Rajesh Kumar',
        email: email,
        phone: '+91 9876543210',
        role: 'store_manager',
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        store: currentStore,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
