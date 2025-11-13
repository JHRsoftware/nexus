import { setupGlobalErrorHandling, ErrorLogger } from './error-monitoring';
import { registerServiceWorker, injectResourceHints, AssetPreloader } from './asset-optimization';
import PerformanceMonitor from './performance';
import PerformanceBenchmark from './performance-benchmark';
import { prefetchCriticalRoutes } from './lazy-components';

// Central optimization manager
export class OptimizationManager {
  private static initialized = false;
  private static config: OptimizationConfig = {
    enablePerformanceMonitoring: true,
    enableErrorHandling: true,
    enableServiceWorker: true,
    enableAssetOptimization: true,
    enableCaching: true,
    enableLazyLoading: true,
    enableBenchmarking: false, // Only in development
  };

  static async initialize(customConfig?: Partial<OptimizationConfig>) {
    if (this.initialized) {
      console.log('🔧 Optimization Manager already initialized');
      return;
    }

    // Merge custom config
    if (customConfig) {
      this.config = { ...this.config, ...customConfig };
    }

    console.log('🚀 Initializing Optimization Manager...');

    try {
      // Initialize in sequence for dependencies
      await this.initializeErrorHandling();
      await this.initializePerformanceMonitoring();
      await this.initializeAssetOptimization();
      await this.initializeCaching();
      await this.initializeLazyLoading();
      
      if (this.config.enableBenchmarking) {
        await this.initializeBenchmarking();
      }

      this.initialized = true;
      console.log('✅ Optimization Manager initialized successfully');
      
      // Log initialization summary
      this.logInitializationSummary();
      
    } catch (error) {
      console.error('❌ Failed to initialize Optimization Manager:', error);
      ErrorLogger.logError(error as Error, {
        context: 'OptimizationManager.initialize',
        config: this.config,
      });
    }
  }

  private static async initializeErrorHandling() {
    if (!this.config.enableErrorHandling) return;
    
    console.log('📊 Setting up error handling...');
    setupGlobalErrorHandling();
  }

  private static async initializePerformanceMonitoring() {
    if (!this.config.enablePerformanceMonitoring) return;
    
    console.log('📈 Setting up performance monitoring...');
    
    // Start Web Vitals tracking
    PerformanceMonitor.getWebVitals();
    
    // Monitor initial page load
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        
        PerformanceMonitor.updateMetrics({
          loadTime,
          renderTime: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          apiCalls: 0,
        });
        
        console.log(`⚡ Page loaded in ${loadTime}ms`);
      });
    }
  }

  private static async initializeAssetOptimization() {
    if (!this.config.enableAssetOptimization) return;
    
    console.log('🖼️ Setting up asset optimization...');
    
    if (typeof window !== 'undefined') {
      // Inject resource hints
      injectResourceHints();
      
      // Preload critical fonts
      AssetPreloader.preloadFont('/fonts/inter-var.woff2');
      
      // Register service worker
      if (this.config.enableServiceWorker) {
        await registerServiceWorker();
      }
    }
  }

  private static async initializeCaching() {
    if (!this.config.enableCaching) return;
    
    console.log('💾 Setting up caching...');
    // Caching is handled automatically by the CacheManager
    // No additional initialization needed
  }

  private static async initializeLazyLoading() {
    if (!this.config.enableLazyLoading) return;
    
    console.log('🔄 Setting up lazy loading...');
    
    if (typeof window !== 'undefined') {
      // Prefetch critical routes on idle
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
          prefetchCriticalRoutes();
        });
      }
    }
  }

  private static async initializeBenchmarking() {
    console.log('📊 Setting up performance benchmarking...');
    
    // Run benchmark after page load
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        setTimeout(() => {
          PerformanceBenchmark.runFullBenchmark();
        }, 2000); // Wait 2 seconds after load
      });
    }
  }

  private static logInitializationSummary() {
    const enabledFeatures = Object.entries(this.config)
      .filter(([_, enabled]) => enabled)
      .map(([feature, _]) => feature);
    
    console.log('🎯 Optimization Summary:');
    console.log(`  Enabled Features: ${enabledFeatures.length}`);
    enabledFeatures.forEach(feature => {
      console.log(`    ✓ ${feature.replace('enable', '').replace(/([A-Z])/g, ' $1').trim()}`);
    });
  }

  // Public API methods
  static getConfig() {
    return { ...this.config };
  }

  static isInitialized() {
    return this.initialized;
  }

  static async runBenchmark() {
    if (!this.initialized) {
      throw new Error('OptimizationManager not initialized');
    }
    
    return await PerformanceBenchmark.runFullBenchmark();
  }

  static getPerformanceMetrics() {
    return PerformanceMonitor.getMetrics();
  }
}

// Configuration interface
interface OptimizationConfig {
  enablePerformanceMonitoring: boolean;
  enableErrorHandling: boolean;
  enableServiceWorker: boolean;
  enableAssetOptimization: boolean;
  enableCaching: boolean;
  enableLazyLoading: boolean;
  enableBenchmarking: boolean;
}

// React hook for optimization status
export function useOptimization() {
  return {
    isInitialized: OptimizationManager.isInitialized(),
    config: OptimizationManager.getConfig(),
    metrics: OptimizationManager.getPerformanceMetrics(),
    runBenchmark: OptimizationManager.runBenchmark,
  };
}

// Auto-initialize in browser environment
if (typeof window !== 'undefined') {
  // Initialize with default config
  OptimizationManager.initialize({
    enableBenchmarking: process.env.NODE_ENV === 'development',
  });
}

export default OptimizationManager;