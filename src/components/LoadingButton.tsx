'use client';

import { memo, ReactNode } from 'react';
import LoadingAnimation from './LoadingAnimation';
import './LoadingButton.css';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

const LoadingButton: React.FC<LoadingButtonProps> = memo(({
  loading = false,
  loadingText = 'Loading...',
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const buttonClasses = [
    'loading-button',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth ? 'btn-full-width' : '',
    loading ? 'btn-loading' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="btn-loading-content">
          <LoadingAnimation 
            type="spinner" 
            size="small" 
            color={variant === 'primary' ? 'primary' : 'secondary'} 
          />
          <span className="btn-loading-text">{loadingText}</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
});

LoadingButton.displayName = 'LoadingButton';

export default LoadingButton;