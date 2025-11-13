'use client';

import { memo, ReactNode } from 'react';
import LoadingAnimation from './LoadingAnimation';
import './PageLoader.css';

interface PageLoaderProps {
  loading: boolean;
  children: ReactNode;
  loadingText?: string;
  type?: 'spinner' | 'dots' | 'pulse' | 'bars' | 'wave' | 'skeleton';
  overlay?: boolean;
  minHeight?: string;
}

const PageLoader: React.FC<PageLoaderProps> = memo(({
  loading,
  children,
  loadingText = 'Loading...',
  type = 'pulse',
  overlay = false,
  minHeight = '200px'
}) => {
  if (loading) {
    return (
      <div className="page-loader" style={{ minHeight: overlay ? '100vh' : minHeight }}>
        <LoadingAnimation
          type={type}
          size="large"
          color="primary"
          text={loadingText}
          overlay={overlay}
          fullScreen={overlay}
        />
      </div>
    );
  }

  return <>{children}</>;
});

PageLoader.displayName = 'PageLoader';

export default PageLoader;