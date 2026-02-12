import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { useState, createContext, useContext } from 'react';
import { Loader2 } from 'lucide-react';

interface LayoutContextType {
  pageTitle: string;
  setPageTitle: (title: string) => void;
}

const LayoutContext = createContext<LayoutContextType>({
  pageTitle: 'Dashboard',
  setPageTitle: () => { },
});

export const useLayout = () => useContext(LayoutContext);

export const AppLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [pageTitle, setPageTitle] = useState('Dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <LayoutContext.Provider value={{ pageTitle, setPageTitle }}>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div className="ml-64">
           <TopNav title={pageTitle} />
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </LayoutContext.Provider>
  );
};
