'use client';

import { useEffect } from 'react';

interface PerformanceMetrics {
  pageLoadTime: number;
  renderTime: number;
  componentCount: number;
  memoryUsage: number;
}

const PerformanceMonitor = () => {
  useEffect(() => {
    // Only run in development mode
    if (process.env.NODE_ENV !== 'development') return;

    const measurePerformance = () => {
      try {
        const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        // Use actual render timing instead of artificial delay
        const renderStartTime = navigationEntry?.domContentLoadedEventStart || 0;
        const renderEndTime = navigationEntry?.domContentLoadedEventEnd || 0;
        const actualRenderTime = renderEndTime - renderStartTime;
        
        const metrics: PerformanceMetrics = {
          pageLoadTime: navigationEntry.loadEventEnd - navigationEntry.fetchStart,
          renderTime: actualRenderTime > 0 ? actualRenderTime : performance.now() - renderStartTime,
          componentCount: document.querySelectorAll('*').length,
          memoryUsage: (performance as any).memory?.usedJSHeapSize || 0
        };

        console.group('🚀 Performance Metrics');
        console.log('Page Load Time:', `${metrics.pageLoadTime.toFixed(2)}ms`);
        console.log('Render Time:', `${metrics.renderTime.toFixed(2)}ms`);
        console.log('Component Count:', metrics.componentCount);
        console.log('Memory Usage:', `${(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB`);
        console.groupEnd();

        // Warn about potential performance issues with more reasonable thresholds
        // Only show critical performance warnings
        if (metrics.pageLoadTime > 5000) { // Increased threshold
          console.warn('⚠️ Very slow page load time detected:', `${metrics.pageLoadTime.toFixed(2)}ms`);
        }
        if (metrics.renderTime > 1000) { // Back to 1000ms but with better calculation
          console.warn('⚠️ Slow render time detected:', `${metrics.renderTime.toFixed(2)}ms`);
        }
        if (metrics.componentCount > 1500) { // Increased threshold
          console.warn('⚠️ High component count detected:', metrics.componentCount);
        }

      } catch (error) {
        console.error('Performance monitoring error:', error);
      }
    };

    // Measure after a short delay to ensure DOM is ready
    const timer = setTimeout(measurePerformance, 100); // Reduced from 1000ms to 100ms

    // Monitor runtime performance
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'measure') {
          console.log(`📊 ${entry.name}: ${entry.duration.toFixed(2)}ms`);
        }
      });
    });

    observer.observe({ entryTypes: ['measure', 'mark'] });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return null;
};

export default PerformanceMonitor;