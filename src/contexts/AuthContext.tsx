'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  username: string;
  accessPages: string[];
  isActive: boolean;
  loginTime?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  logout: () => void;
  hasAccess: (page: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Auto logout timer for inactive users
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (user && !user.isActive) {
      timer = setTimeout(() => {
        setUser(null);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('rememberLogin');
        sessionStorage.removeItem('currentUser');
        localStorage.setItem('logout', Date.now().toString());
        router.push('/login');
      }, 5 * 60 * 1000); // 5 minutes
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [user, router]);

  const isAuthenticated = !!user;

  // Load user from storage on app start
  useEffect(() => {
    const loadUser = () => {
      try {
        // Check session storage first, then local storage
        let storedUser = sessionStorage.getItem('currentUser');
        if (!storedUser) {
          storedUser = localStorage.getItem('currentUser');
        }

        if (storedUser) {
          const userData = JSON.parse(storedUser);
          if (userData && userData.username) {
            console.log('Loading user from storage:', userData.username);
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
        // Clear invalid data
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
      } finally {
        setIsLoading(false);
      }
    };

    // Small delay to ensure storage operations from login page have completed
    const timeoutId = setTimeout(loadUser, 10);
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Listen for storage changes (when user logs in from another tab or the login page)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'logout') {
        // Force logout in all tabs
        setUser(null);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('rememberLogin');
        sessionStorage.removeItem('currentUser');
        deleteCookie('currentUser'); // Clear cookie
        // Always redirect to login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return;
      }
      if (e.key === 'currentUser' || e.key === null) {
        // Reload user data when storage changes
        try {
          let storedUser = sessionStorage.getItem('currentUser');
          if (!storedUser) {
            storedUser = localStorage.getItem('currentUser');
          }
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            if (userData && userData.username) {
              setUser(userData);
            }
          } else {
            setUser(null);
          }
        } catch (error) {
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events from the same tab
    const handleAuthChange = () => {
      try {
        let storedUser = sessionStorage.getItem('currentUser');
        if (!storedUser) {
          storedUser = localStorage.getItem('currentUser');
        }

        if (storedUser) {
          const userData = JSON.parse(storedUser);
          if (userData && userData.username) {
            console.log('User data reloaded from auth change:', userData.username);
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Error handling auth change:', error);
      }
    };

    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  // Cookie management functions
  const setCookie = useCallback((name: string, value: string, days: number = 7) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
  }, []);

  const deleteCookie = useCallback((name: string) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }, []);

  const login = useCallback(async (username: string, password: string, rememberMe: boolean = false): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        return false;
      }

      const result = await response.json();

      if (result.success && result.user) {
        const userData = {
          ...result.user,
          loginTime: new Date().toISOString()
        };

        setUser(userData);

        // Store user data
        if (rememberMe) {
          localStorage.setItem('currentUser', JSON.stringify(userData));
          localStorage.setItem('rememberLogin', 'true');
          setCookie('currentUser', JSON.stringify(userData), 7); // 7 days
        } else {
          sessionStorage.setItem('currentUser', JSON.stringify(userData));
          setCookie('currentUser', JSON.stringify(userData), 1); // 1 day for session
          // Clear any previous remember me data
          localStorage.removeItem('currentUser');
          localStorage.removeItem('rememberLogin');
        }

        // Trigger custom event to notify other components
        window.dispatchEvent(new CustomEvent('authChange'));

        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, [setCookie]);

  const logout = useCallback(async () => {
    try {
      // Call logout API
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear user state and storage
      setUser(null);
      localStorage.removeItem('currentUser');
      localStorage.removeItem('rememberLogin');
      sessionStorage.removeItem('currentUser');
      deleteCookie('currentUser'); // Clear cookie
      // Broadcast logout to all tabs
      localStorage.setItem('logout', Date.now().toString());
      // Redirect to login
      router.push('/login');
    }
  }, [router, deleteCookie]);

  const hasAccess = useCallback((page: string): boolean => {
    if (!user || !user.isActive) {
      return false;
    }

    // Check if user has access to the specific page
    return user.accessPages.includes(page);
  }, [user]);

  const contextValue: AuthContextType = useMemo(() => ({
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    hasAccess,
  }), [user, isLoading, isAuthenticated, login, logout, hasAccess]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Hook for protected pages
export const useRequireAuth = (requiredPage?: string) => {
  const { user, isLoading, isAuthenticated, hasAccess } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      if (requiredPage && !hasAccess(requiredPage)) {
        // Find the first accessible page and redirect there
        if (user && user.accessPages && user.accessPages.length > 0) {
          const firstAccessiblePage = user.accessPages[0];
          // Map page names to routes
          const pageRoutes: Record<string, string> = {
            'home': '/',
            'sample1': '/sample1',
            'sample2': '/sample2', 
            'users': '/users',
            'settings': '/settings'
          };
          
          const redirectRoute = pageRoutes[firstAccessiblePage] || '/';
          router.push(redirectRoute);
        } else {
          // No access to any pages, logout
          router.push('/login');
        }
        return;
      }
    }
  }, [isLoading, isAuthenticated, requiredPage, hasAccess, router, user]);

  return { user, isLoading, isAuthenticated, hasAccess };
};