import dynamic from 'next/dynamic';
import { ComponentType, Suspense } from 'react';
import React from 'react';
import LoadingAnimation from '@/components/LoadingAnimation';

// Lazy load components with loading fallbacks
export const LazyProducts = dynamic(() => import('@/app/products/add/page'), {
  loading: () => React.createElement(LoadingAnimation),
  ssr: true,
});

export const LazyInvoices = dynamic(() => import('@/app/invoices/create/page'), {
  loading: () => React.createElement(LoadingAnimation),
  ssr: true,
});

export const LazyReports = dynamic(() => import('@/app/reports/page'), {
  loading: () => React.createElement(LoadingAnimation),
  ssr: false, // Reports don't need SSR
});

export const LazySettings = dynamic(() => import('@/components/Settings'), {
  loading: () => React.createElement(LoadingAnimation),
  ssr: false,
});

export const LazySidebar = dynamic(() => import('@/components/Sidebar'), {
  loading: () => React.createElement('div', { 
    className: 'w-64 bg-gray-100 animate-pulse',
    style: { height: '100vh' }
  }),
  ssr: true,
});

// Generic lazy loading wrapper
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: {
    loading?: ComponentType;
    ssr?: boolean;
  } = {}
) {
  const { loading = LoadingAnimation, ssr = true } = options;

  const LazyComponent = dynamic(importFn, {
    loading: () => React.createElement(loading as ComponentType),
    ssr,
  });

  return LazyComponent;
}

// Preload function for critical routes
export function preloadRoute(routeImport: () => Promise<any>) {
  if (typeof window !== 'undefined') {
    // Preload on hover or user interaction
    routeImport();
  }
}

// Route-based code splitting configuration
export const routeConfig = {
  '/products': () => import('@/app/products/add/page'),
  '/invoices': () => import('@/app/invoices/create/page'),
  '/reports': () => import('@/app/reports/page'),
  '/settings': () => import('@/app/softwareSettings/page'),
  '/grn': () => import('@/app/grn/add/page'),
  '/users': () => import('@/app/users/page'),
};

// Prefetch critical routes
export function prefetchCriticalRoutes() {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      // Prefetch most commonly used routes
      routeConfig['/products']();
      routeConfig['/invoices']();
    });
  }
}