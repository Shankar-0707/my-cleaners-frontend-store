import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Store } from '@/lib/mockData';
import { loginUser, getStoreMe } from '@/services/api';

interface User {
  id: string;
  full_name: string;
  email: string;
  mobile: string;
  role: string;
  store_id: string;
}

interface AuthContextType {
  user: User | null;
  store: Store | null;
  isAuthenticated: boolean;
  login: (mobile: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth on load
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Try to get store info - if this succeeds, we are logged in
        const storeData = await getStoreMe();
        if (storeData && storeData.store) {
          setStore(storeData.store);
          const savedUser = localStorage.getItem('user');
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          } else {
            // If store is found but local user info is missing, 
            // we should still consider authenticated or fetch user details.
            // For now, if user info is missing but store is valid, 
            // we'll set a placeholder or fetch details if available.
          }
        } else {
          logout(); // Clear local state if store query fails
        }
      } catch (error) {
        console.error("Auth check failed", error);
        logout(); // Ensure state is cleared on error
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (mobile: string, password: string): Promise<boolean> => {
    try {
      const data = await loginUser(mobile, password);
      if (data && data.user) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Fetch store info immediately after login
        const storeData = await getStoreMe();
        if (storeData && storeData.store) {
          setStore(storeData.store);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setStore(null);
    localStorage.removeItem('user');
    // For cookies, we should also call a logout API to clear the cookie
    // but the browser will handle session expiration if not specified
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        store,
        isAuthenticated: !!user,
        login,
        logout,
        isLoading,
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
