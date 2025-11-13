import React, { Component, ReactNode, ErrorInfo } from 'react';
import PerformanceMonitor from './performance';

// Enhanced Error Boundary with performance monitoring
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<{ error: Error; errorId: string; retry: () => void }>;
  onError?: (error: Error, errorInfo: ErrorInfo, errorId: string) => void;
  level?: 'page' | 'component' | 'critical';
}

export class EnhancedErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryCount = 0;
  private maxRetries = 3;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError, level = 'component' } = this.props;
    const { errorId } = this.state;

    // Log error with performance context
    ErrorLogger.logError(error, {
      ...errorInfo,
      level,
      errorId,
      retryCount: this.retryCount,
      url: typeof window !== 'undefined' ? window.location.href : 'SSR',
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'Unknown',
      timestamp: new Date().toISOString(),
    });

    // Record performance impact
    PerformanceMonitor.updateMetrics({
      loadTime: 0,
      renderTime: 0,
      apiCalls: 0,
    });

    this.setState({ errorInfo });

    if (onError) {
      onError(error, errorInfo, errorId);
    }
  }

  retry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: '',
      });
    }
  };

  render() {
    const { hasError, error, errorId } = this.state;
    const { children, fallback: Fallback } = this.props;

    if (hasError && error) {
      if (Fallback) {
        return <Fallback error={error} errorId={errorId} retry={this.retry} />;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-lg font-medium text-gray-900">Something went wrong</h3>
              <p className="mt-2 text-sm text-gray-500">
                An unexpected error occurred. Our team has been notified.
              </p>
              <p className="mt-1 text-xs text-gray-400">Error ID: {errorId}</p>
            </div>
            <div className="mt-6 flex gap-3">
              {this.retryCount < this.maxRetries && (
                <button
                  onClick={this.retry}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Try Again ({this.maxRetries - this.retryCount} left)
                </button>
              )}
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

// Error Logging Service
export class ErrorLogger {
  private static errors: Array<{
    error: Error;
    context: any;
    timestamp: string;
    resolved: boolean;
  }> = [];

  static logError(error: Error, context: any = {}) {
    const errorEntry = {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      context,
      timestamp: new Date().toISOString(),
      resolved: false,
    };

    // Store locally
    this.errors.push(errorEntry);

    // Console logging with better formatting
    console.group(`🚨 Error: ${error.name}`);
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    console.error('Context:', context);
    console.error('Time:', errorEntry.timestamp);
    console.groupEnd();

    // Send to monitoring service (if configured)
    this.sendToMonitoring(errorEntry);

    // Store in localStorage for offline debugging
    this.storeLocally(errorEntry);
  }

  private static sendToMonitoring(errorEntry: any) {
    // Integration with monitoring services (Sentry, LogRocket, etc.)
    if (typeof window !== 'undefined') {
      // Example: Send to external monitoring
      // fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorEntry),
      // }).catch(console.error);
    }
  }

  private static storeLocally(errorEntry: any) {
    if (typeof window !== 'undefined') {
      try {
        const storedErrors = JSON.parse(localStorage.getItem('app_errors') || '[]');
        storedErrors.push(errorEntry);
        
        // Keep only last 50 errors
        if (storedErrors.length > 50) {
          storedErrors.splice(0, storedErrors.length - 50);
        }
        
        localStorage.setItem('app_errors', JSON.stringify(storedErrors));
      } catch (e) {
        console.error('Failed to store error locally:', e);
      }
    }
  }

  static getErrors() {
    return [...this.errors];
  }

  static getStoredErrors() {
    if (typeof window !== 'undefined') {
      try {
        return JSON.parse(localStorage.getItem('app_errors') || '[]');
      } catch (e) {
        return [];
      }
    }
    return [];
  }

  static clearErrors() {
    this.errors = [];
    if (typeof window !== 'undefined') {
      localStorage.removeItem('app_errors');
    }
  }
}

// Performance Alert System
export class PerformanceAlerter {
  private static thresholds = {
    loadTime: 3000, // 3 seconds
    apiResponseTime: 1000, // 1 second
    memoryUsage: 100 * 1024 * 1024, // 100MB
    cacheHitRate: 0.8, // 80%
  };

  static checkPerformance(metrics: any) {
    const alerts: string[] = [];

    if (metrics.loadTime > this.thresholds.loadTime) {
      alerts.push(`Slow page load: ${metrics.loadTime}ms (threshold: ${this.thresholds.loadTime}ms)`);
    }

    if (metrics.apiResponseTime > this.thresholds.apiResponseTime) {
      alerts.push(`Slow API response: ${metrics.apiResponseTime}ms (threshold: ${this.thresholds.apiResponseTime}ms)`);
    }

    if (metrics.memoryUsage > this.thresholds.memoryUsage) {
      alerts.push(`High memory usage: ${Math.round(metrics.memoryUsage / 1024 / 1024)}MB (threshold: ${Math.round(this.thresholds.memoryUsage / 1024 / 1024)}MB)`);
    }

    if (metrics.cacheHitRate < this.thresholds.cacheHitRate) {
      alerts.push(`Low cache hit rate: ${Math.round(metrics.cacheHitRate * 100)}% (threshold: ${Math.round(this.thresholds.cacheHitRate * 100)}%)`);
    }

    if (alerts.length > 0) {
      console.warn('⚠️ Performance Alerts:');
      alerts.forEach(alert => console.warn(`  - ${alert}`));
      
      // Send alerts to monitoring
      this.sendAlerts(alerts, metrics);
    }
  }

  private static sendAlerts(alerts: string[], metrics: any) {
    // Integration with alerting systems
    ErrorLogger.logError(new Error('Performance threshold exceeded'), {
      type: 'performance_alert',
      alerts,
      metrics,
    });
  }
}

// Global error handler
export function setupGlobalErrorHandling() {
  if (typeof window === 'undefined') return;

  // Unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    ErrorLogger.logError(
      new Error(`Unhandled Promise Rejection: ${event.reason}`),
      {
        type: 'unhandled_promise',
        reason: event.reason,
        url: window.location.href,
      }
    );
  });

  // Global JavaScript errors
  window.addEventListener('error', (event) => {
    ErrorLogger.logError(event.error || new Error(event.message), {
      type: 'global_error',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      url: window.location.href,
    });
  });

  // Resource loading errors
  window.addEventListener('error', (event) => {
    if (event.target && event.target !== window) {
      const target = event.target as HTMLElement;
      ErrorLogger.logError(new Error(`Resource loading failed: ${target.tagName}`), {
        type: 'resource_error',
        tagName: target.tagName,
        src: (target as any).src || (target as any).href,
        url: window.location.href,
      });
    }
  }, true);
}

// Health Check System
export class HealthCheck {
  static async checkSystemHealth() {
    const results = {
      api: await this.checkApiHealth(),
      database: await this.checkDatabaseHealth(),
      cache: await this.checkCacheHealth(),
      performance: await this.checkPerformanceHealth(),
    };

    return {
      overall: Object.values(results).every(status => status === 'healthy'),
      details: results,
      timestamp: new Date().toISOString(),
    };
  }

  private static async checkApiHealth(): Promise<'healthy' | 'degraded' | 'unhealthy'> {
    try {
      const response = await fetch('/api/health', { 
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      return response.ok ? 'healthy' : 'degraded';
    } catch (error) {
      return 'unhealthy';
    }
  }

  private static async checkDatabaseHealth(): Promise<'healthy' | 'degraded' | 'unhealthy'> {
    try {
      const response = await fetch('/api/health/database', {
        method: 'GET',
        signal: AbortSignal.timeout(3000) // 3 second timeout
      });
      return response.ok ? 'healthy' : 'degraded';
    } catch (error) {
      return 'unhealthy';
    }
  }

  private static async checkCacheHealth(): Promise<'healthy' | 'degraded' | 'unhealthy'> {
    // Check localStorage availability and cache hit rates
    try {
      localStorage.setItem('health_check', 'test');
      localStorage.removeItem('health_check');
      return 'healthy';
    } catch (error) {
      return 'unhealthy';
    }
  }

  private static async checkPerformanceHealth(): Promise<'healthy' | 'degraded' | 'unhealthy'> {
    if (typeof window === 'undefined') return 'healthy';

    try {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      
      if (loadTime < 2000) return 'healthy';
      if (loadTime < 5000) return 'degraded';
      return 'unhealthy';
    } catch (error) {
      return 'degraded';
    }
  }
}

export default {
  EnhancedErrorBoundary,
  ErrorLogger,
  PerformanceAlerter,
  setupGlobalErrorHandling,
  HealthCheck,
};