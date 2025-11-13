import Image, { ImageProps } from 'next/image';
import { useState, useEffect } from 'react';
import React from 'react';

// Progressive loading image component
interface ProgressiveImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  fallbackSrc?: string;
  lowQualitySrc?: string;
  showPlaceholder?: boolean;
}

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  fallbackSrc,
  lowQualitySrc,
  showPlaceholder = true,
  alt,
  className = '',
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(lowQualitySrc || src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (lowQualitySrc && lowQualitySrc !== src) {
      const img = new window.Image();
      img.onload = () => {
        setImageSrc(src);
        setIsLoading(false);
      };
      img.onerror = () => {
        setHasError(true);
        setIsLoading(false);
        if (fallbackSrc) {
          setImageSrc(fallbackSrc);
        }
      };
      img.src = src;
    } else {
      setIsLoading(false);
    }
  }, [src, lowQualitySrc, fallbackSrc]);

  const handleError = () => {
    setHasError(true);
    if (fallbackSrc && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (hasError && !fallbackSrc) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-sm">Image not available</span>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {showPlaceholder && isLoading && (
        <div className={`absolute inset-0 bg-gray-200 animate-pulse ${className}`} />
      )}
      <Image
        src={imageSrc}
        alt={alt}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-50' : 'opacity-100'
        } ${className}`}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
};

// Lazy loading image with intersection observer
export const LazyImage: React.FC<ImageProps & { threshold?: number }> = ({
  threshold = 0.1,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [imgRef, setImgRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!imgRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(imgRef);

    return () => observer.disconnect();
  }, [imgRef, threshold]);

  return (
    <div ref={setImgRef}>
      {isVisible ? (
        <Image {...props} />
      ) : (
        <div 
          className="bg-gray-200 animate-pulse"
          style={{ 
            width: props.width, 
            height: props.height,
            aspectRatio: `${props.width}/${props.height}`
          }}
        />
      )}
    </div>
  );
};

// Image optimization utilities
export class ImageOptimizer {
  static getOptimizedUrl(
    src: string,
    options: {
      width?: number;
      height?: number;
      quality?: number;
      format?: 'webp' | 'avif' | 'jpeg' | 'png';
    } = {}
  ): string {
    const { width, height, quality = 85, format = 'webp' } = options;
    
    // If using Next.js built-in image optimization
    const params = new URLSearchParams();
    if (width) params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    params.set('q', quality.toString());
    params.set('f', format);

    return `/_next/image?url=${encodeURIComponent(src)}&${params.toString()}`;
  }

  static generateSrcSet(
    src: string,
    breakpoints: number[] = [320, 640, 768, 1024, 1280, 1920]
  ): string {
    return breakpoints
      .map(width => `${this.getOptimizedUrl(src, { width })} ${width}w`)
      .join(', ');
  }

  static preloadCriticalImages(imageUrls: string[]): void {
    if (typeof window === 'undefined') return;

    imageUrls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      document.head.appendChild(link);
    });
  }
}

// Asset preloading utilities
export class AssetPreloader {
  private static preloadedAssets = new Set<string>();

  static preloadFont(fontUrl: string): void {
    if (typeof window === 'undefined' || this.preloadedAssets.has(fontUrl)) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    link.href = fontUrl;
    document.head.appendChild(link);
    
    this.preloadedAssets.add(fontUrl);
  }

  static preloadScript(scriptUrl: string): Promise<void> {
    if (typeof window === 'undefined') return Promise.resolve();
    
    return new Promise((resolve, reject) => {
      if (this.preloadedAssets.has(scriptUrl)) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = scriptUrl;
      script.onload = () => {
        this.preloadedAssets.add(scriptUrl);
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  static preloadCSS(cssUrl: string): void {
    if (typeof window === 'undefined' || this.preloadedAssets.has(cssUrl)) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = cssUrl;
    link.onload = () => {
      link.rel = 'stylesheet';
    };
    document.head.appendChild(link);
    
    this.preloadedAssets.add(cssUrl);
  }
}

// Service Worker registration for caching
export function registerServiceWorker(): Promise<ServiceWorkerRegistration | undefined> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return Promise.resolve(undefined);
  }

  return navigator.serviceWorker
    .register('/sw.js')
    .then(registration => {
      console.log('✅ Service Worker registered:', registration);
      
      // Update check
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('🔄 New content available, please refresh');
              // Optionally show update notification to user
            }
          });
        }
      });

      return registration;
    })
    .catch(error => {
      console.error('❌ Service Worker registration failed:', error);
      return undefined;
    });
}

// Critical resource hints
export function injectResourceHints(): void {
  if (typeof window === 'undefined') return;

  // DNS prefetch for external domains
  const externalDomains = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'cdnjs.cloudflare.com',
  ];

  externalDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = `//${domain}`;
    document.head.appendChild(link);
  });

  // Preconnect to same origin
  const preconnectLink = document.createElement('link');
  preconnectLink.rel = 'preconnect';
  preconnectLink.href = window.location.origin;
  document.head.appendChild(preconnectLink);
}

export default {
  ProgressiveImage,
  LazyImage,
  ImageOptimizer,
  AssetPreloader,
  registerServiceWorker,
  injectResourceHints,
};