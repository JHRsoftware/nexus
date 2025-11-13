'use client';

import { memo } from 'react';
import './LoadingAnimation.css';

export interface LoadingAnimationProps {
  type?: 'spinner' | 'dots' | 'pulse' | 'bars' | 'wave' | 'skeleton';
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'custom';
  text?: string;
  overlay?: boolean;
  fullScreen?: boolean;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = memo(({
  type = 'spinner',
  size = 'medium',
  color = 'primary',
  text = '',
  overlay = false,
  fullScreen = false
}) => {
  const renderAnimation = () => {
    switch (type) {
      case 'spinner':
        return (
          <div className={`loading-spinner loading-${size} loading-${color}`}>
            <div className="spinner-circle"></div>
          </div>
        );

      case 'dots':
        return (
          <div className={`loading-dots loading-${size} loading-${color}`}>
            <div className="dot dot-1"></div>
            <div className="dot dot-2"></div>
            <div className="dot dot-3"></div>
          </div>
        );

      case 'pulse':
        return (
          <div className={`loading-pulse loading-${size} loading-${color}`}>
            <div className="pulse-circle pulse-1"></div>
            <div className="pulse-circle pulse-2"></div>
            <div className="pulse-circle pulse-3"></div>
          </div>
        );

      case 'bars':
        return (
          <div className={`loading-bars loading-${size} loading-${color}`}>
            <div className="bar bar-1"></div>
            <div className="bar bar-2"></div>
            <div className="bar bar-3"></div>
            <div className="bar bar-4"></div>
            <div className="bar bar-5"></div>
          </div>
        );

      case 'wave':
        return (
          <div className={`loading-wave loading-${size} loading-${color}`}>
            <div className="wave-bar wave-1"></div>
            <div className="wave-bar wave-2"></div>
            <div className="wave-bar wave-3"></div>
            <div className="wave-bar wave-4"></div>
            <div className="wave-bar wave-5"></div>
          </div>
        );

      case 'skeleton':
        return (
          <div className={`loading-skeleton loading-${size}`}>
            <div className="skeleton-line skeleton-title"></div>
            <div className="skeleton-line skeleton-text"></div>
            <div className="skeleton-line skeleton-text short"></div>
          </div>
        );

      default:
        return (
          <div className={`loading-spinner loading-${size} loading-${color}`}>
            <div className="spinner-circle"></div>
          </div>
        );
    }
  };

  const content = (
    <div className={`loading-container ${overlay ? 'loading-overlay' : ''} ${fullScreen ? 'loading-fullscreen' : ''}`}>
      <div className="loading-content">
        {renderAnimation()}
        {text && <div className="loading-text">{text}</div>}
      </div>
    </div>
  );

  return content;
});

LoadingAnimation.displayName = 'LoadingAnimation';

export default LoadingAnimation;