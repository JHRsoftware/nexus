'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface WithAuthProps {
  requiredPage: string;
  fallbackRoute?: string;
}

// Higher Order Component for protecting pages
export function withAuth<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  requiredPage: string,
  fallbackRoute: string = '/login'
) {
  return function ProtectedComponent(props: T) {
    const { user, isLoading, isAuthenticated, hasAccess } = useAuth();
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
      if (!isLoading) {
        // Not authenticated - redirect to login
        if (!isAuthenticated) {
          console.log(`Access denied: Not authenticated. Redirecting to ${fallbackRoute}`);
          router.replace(fallbackRoute);
          return;
        }

        // Authenticated but no access to this page
        if (!hasAccess(requiredPage)) {
          console.log(`Access denied: No permission for '${requiredPage}' page`);
          
          // Find first accessible page for redirect
          if (user && user.accessPages && user.accessPages.length > 0) {
            const pageRoutes: Record<string, string> = {
              'home': '/',
              'sample1': '/sample1',
              'sample2': '/sample2',
              'users': '/users',
              'products': '/products/add',
              'suppliers': '/suppliers/add',
              'shops': '/shops/add',
              'grn': '/grn/add',
              'discounts': '/discounts/add',
              'settings': '/settings',
              'reports': '/reports',
              'debug': '/debug-access'
            };
            
            // Find first accessible page
            const firstAccessiblePage = user.accessPages[0];
            const redirectRoute = pageRoutes[firstAccessiblePage] || '/';
            
            console.log(`Redirecting to accessible page: ${redirectRoute}`);
            router.replace(redirectRoute);
          } else {
            // No access to any pages - logout and redirect to login
            console.log('No accessible pages found. Logging out.');
            router.replace('/login');
          }
          return;
        }

        // All checks passed
        setIsChecking(false);
      }
    }, [isLoading, isAuthenticated, hasAccess, requiredPage, user, router]);

    // Show loading while checking authentication
    if (isLoading || isChecking) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'var(--background, #fff)',
          color: 'var(--text, #333)'
        }}>
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid #f3f3f3',
              borderTop: '3px solid var(--primary, #007bff)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }}></div>
            <p>Checking access permissions...</p>
          </div>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      );
    }

    // User has access - render the protected component
    return <WrappedComponent {...props} />;
  };
}

// Hook version for component-level protection
export function usePageProtection(requiredPage: string, fallbackRoute: string = '/login') {
  const { user, isLoading, isAuthenticated, hasAccess } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        console.log(`Access denied: Not authenticated for '${requiredPage}'`);
        router.replace(fallbackRoute);
        return;
      }

      if (!hasAccess(requiredPage)) {
        console.log(`Access denied: No permission for '${requiredPage}' page`);
        
        if (user && user.accessPages && user.accessPages.length > 0) {
          const pageRoutes: Record<string, string> = {
            'home': '/',
            'sample1': '/sample1',
            'sample2': '/sample2',
            'users': '/users',
            'products': '/products/add',
            'suppliers': '/suppliers/add',
            'shops': '/shops/add',
            'grn': '/grn/add',
            'discounts': '/discounts/add',
            'settings': '/settings',
            'reports': '/reports',
            'debug': '/debug-access'
          };
          
          const firstAccessiblePage = user.accessPages[0];
          const redirectRoute = pageRoutes[firstAccessiblePage] || '/';
          
          console.log(`Redirecting to accessible page: ${redirectRoute}`);
          router.replace(redirectRoute);
        } else {
          console.log('No accessible pages found. Redirecting to login.');
          router.replace('/login');
        }
        return;
      }

      setIsAuthorized(true);
    }
  }, [isLoading, isAuthenticated, hasAccess, requiredPage, user, router, fallbackRoute]);

  return {
    isAuthorized: isAuthorized && isAuthenticated,
    isLoading,
    user,
    hasAccess
  };
}

// Access denied component
export function AccessDenied({ 
  message = "You don't have permission to access this page.",
  redirectPath = '/login',
  redirectText = 'Go to Login'
}: {
  message?: string;
  redirectPath?: string;
  redirectText?: string;
}) {
  const router = useRouter();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'var(--background, #fff)',
      color: 'var(--text, #333)',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div style={{
        background: 'var(--surface, #f8f9fa)',
        padding: '3rem',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        maxWidth: '500px',
        border: '1px solid var(--border, #e0e0e0)'
      }}>
        <div style={{
          fontSize: '4rem',
          marginBottom: '1rem',
          color: 'var(--danger, #dc3545)'
        }}>
          🔒
        </div>
        <h1 style={{
          fontSize: '1.5rem',
          marginBottom: '1rem',
          color: 'var(--primary, #007bff)'
        }}>
          Access Denied
        </h1>
        <p style={{
          marginBottom: '2rem',
          color: 'var(--text-secondary, #6c757d)',
          lineHeight: '1.6'
        }}>
          {message}
        </p>
        <button
          onClick={() => router.push(redirectPath)}
          style={{
            background: 'var(--primary, #007bff)',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'var(--primary-dark, #0056b3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'var(--primary, #007bff)';
          }}
        >
          {redirectText}
        </button>
      </div>
    </div>
  );
}