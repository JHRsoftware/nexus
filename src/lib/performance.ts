'use client';

import React, { useEffect, useState } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
  apiCalls: number;
  cacheHitRate?: number;
}

// Extended interfaces for Performance API
interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: number;
}

interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

class PerformanceMonitor {
  private static metrics: PerformanceMetrics = {
    loadTime: 0,
    renderTime: 0,
    apiCalls: 0,
  };

  private static observers: ((metrics: PerformanceMetrics) => void)[] = [];

  static startMeasurement(label: string): () => number {
    const startTime = performance.now();
    
    return (): number => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      console.log(`⚡ Performance: ${label} took ${duration.toFixed(2)}ms`);
      return duration;
    };
  }

  static measureApiCall<T>(
    fn: () => Promise<T>,
    label: string = 'API Call'
  ): Promise<T> {
    const endMeasure = this.startMeasurement(label);
    this.metrics.apiCalls++;
    
    return fn().finally(() => {
      endMeasure();
      this.notifyObservers();
    });
  }

  static updateMetrics(updates: Partial<PerformanceMetrics>): void {
    this.metrics = { ...this.metrics, ...updates };
    this.notifyObservers();
  }

  static getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  static subscribe(callback: (metrics: PerformanceMetrics) => void): () => void {
    this.observers.push(callback);
    
    return () => {
      const index = this.observers.indexOf(callback);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    };
  }

  private static notifyObservers(): void {
    this.observers.forEach(callback => callback(this.metrics));
  }

  static getWebVitals(): void {
    if (typeof window !== 'undefined') {
      // Largest Contentful Paint
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          console.log('🎯 LCP:', entry.startTime);
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const eventTiming = entry as PerformanceEventTiming;
          if (eventTiming.processingStart) {
            console.log('⚡ FID:', eventTiming.processingStart - entry.startTime);
          }
        }
      }).observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      let clsValue = 0;
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const layoutShift = entry as LayoutShiftEntry;
          if (layoutShift.hadRecentInput !== undefined && !layoutShift.hadRecentInput) {
            clsValue += layoutShift.value;
            console.log('📐 CLS:', clsValue);
          }
        }
      }).observe({ entryTypes: ['layout-shift'] });
    }
  }
}

// React hook for performance monitoring
export const usePerformance = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>(
    PerformanceMonitor.getMetrics()
  );

  useEffect(() => {
    const unsubscribe = PerformanceMonitor.subscribe(setMetrics);
    return unsubscribe;
  }, []);

  return {
    metrics,
    measure: PerformanceMonitor.startMeasurement,
    measureApi: PerformanceMonitor.measureApiCall,
  };
};

// Performance wrapper component
export const PerformanceWrapper: React.FC<{
  children: React.ReactNode;
  label?: string;
}> = ({ children, label = 'Component' }) => {
  useEffect(() => {
    const endMeasure = PerformanceMonitor.startMeasurement(`${label} Render`);
    // Return cleanup function that doesn't return a value
    return () => {
      endMeasure();
    };
  }, [label]);

  return React.createElement(React.Fragment, null, children);
};

// HOC for measuring component performance
export const withPerformance = <P extends object>(
  Component: React.ComponentType<P>,
  label?: string
) => {
  const WrappedComponent = (props: P) => {
    return React.createElement(
      PerformanceWrapper,
      { 
        label: label || Component.displayName || Component.name,
        children: React.createElement(Component, props)
      }
    );
  };

  WrappedComponent.displayName = `withPerformance(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

export default PerformanceMonitor;