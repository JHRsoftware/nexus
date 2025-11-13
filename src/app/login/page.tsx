'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

interface LoginForm {
  username: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  user?: {
    id: number;
    name: string;
    username: string;
    accessPages: string[];
    isActive: boolean;
  };
  error?: string;
}

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginForm>({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showContactNumber, setShowContactNumber] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          if (user && user.username && user.accessPages) {
            // Small delay to ensure the auth context is fully loaded
            setTimeout(() => {
              // Only redirect to home page if user has access
              if (user.accessPages.includes('home')) {
                console.log('Already logged in, redirecting to home page');
                router.push('/');
              } else {
                // If no home access, clear session and stay on login
                console.log('No home access, clearing session');
                localStorage.removeItem('currentUser');
                sessionStorage.removeItem('currentUser');
                window.dispatchEvent(new CustomEvent('authChange'));
              }
            }, 50);
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
      }
    };

    checkAuth();
  }, [router]);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call for authentication
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result: LoginResponse = await response.json();

      if (result.success && result.user) {
        // Store user data in localStorage
        const userData = {
          ...result.user,
          loginTime: new Date().toISOString()
        };

        if (rememberMe) {
          localStorage.setItem('currentUser', JSON.stringify(userData));
          localStorage.setItem('rememberLogin', 'true');
        } else {
          sessionStorage.setItem('currentUser', JSON.stringify(userData));
        }

        // Set a simpler cookie for middleware to read (avoid JSON parsing issues)
        const cookieValue = encodeURIComponent(JSON.stringify(userData));
        const maxAge = rememberMe ? '; max-age=2592000' : '';
        document.cookie = `currentUser=${cookieValue}; path=/${maxAge}; SameSite=Lax`;
        
        console.log('Cookie set:', document.cookie);

        // Trigger auth change event to update contexts immediately
        window.dispatchEvent(new CustomEvent('authChange'));

        // Simplified redirect logic to prevent loops
        console.log('Login successful, user data:', result.user);
        
        if (result.user && result.user.accessPages.includes('home')) {
          console.log('User has home access, redirecting...');
          
          // Small delay to ensure cookie is set and auth context updates
          setTimeout(() => {
            console.log('Performing redirect to home page');
            window.location.href = '/';
          }, 500);
          
        } else {
          // If no home access, clear session and show error
          console.log('No home access for user');
          localStorage.removeItem('currentUser');
          sessionStorage.removeItem('currentUser');
          document.cookie = 'currentUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
          window.dispatchEvent(new CustomEvent('authChange'));
          setErrors({ general: 'Access denied. You do not have permission to access the home page.' });
        }
      } else {
        setErrors({ general: result.error || 'Login failed. Please try again.' });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle demo login (for testing)
  const handleDemoLogin = (userType: 'admin' | 'user') => {
    const demoCredentials = {
      admin: { username: 'username', password: 'password' },
      user: { username: 'username', password: 'password' }
    };

    setFormData(demoCredentials[userType]);
  };

  // Handle contact admin button click
  const handleContactAdmin = () => {
    setShowContactNumber(!showContactNumber);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        {/* Header */}
        <div className={styles.loginHeader}>
          <div className={styles.logo}>
            <div className={styles.logoContainer}>
              <div className={styles.logoIcon}>
                <div className={styles.logoCircle}>
                  <span className={styles.logoInitial}>H</span>
                </div>
              </div>
              <div className={styles.logoTextContainer}>
                <h1 className={styles.logoText}>Harshana</h1>
                <span className={styles.logoSubtext}>System</span>
              </div>
            </div>
          </div>
          <p className={styles.subtitle}>Sign in to your account</p>
        </div>

        {/* Error Banner */}
        {errors.general && (
          <div className={styles.errorBanner} role="alert">
            <span className={styles.errorIcon}>⚠️</span>
            <span>{errors.general}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className={styles.loginForm} noValidate>
          {/* Username Field */}
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.formLabel}>
              Username
            </label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>👤</span>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                className={`${styles.formInput} ${errors.username ? styles.inputError : ''}`}
                placeholder="Enter your username"
                disabled={isLoading}
                autoComplete="username"
                aria-describedby={errors.username ? "username-error" : undefined}
                aria-invalid={errors.username ? "true" : "false"}
              />
            </div>
            {errors.username && (
              <span id="username-error" className={styles.errorText} role="alert">
                {errors.username}
              </span>
            )}
          </div>

          {/* Password Field */}
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.formLabel}>
              Password
            </label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>🔒</span>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                className={`${styles.formInput} ${errors.password ? styles.inputError : ''}`}
                placeholder="Enter your password"
                disabled={isLoading}
                autoComplete="current-password"
                aria-describedby={errors.password ? "password-error" : undefined}
                aria-invalid={errors.password ? "true" : "false"}
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? '👁️‍🗨️' : '👁️'}
              </button>
            </div>
            {errors.password && (
              <span id="password-error" className={styles.errorText} role="alert">
                {errors.password}
              </span>
            )}
          </div>

          {/* Remember Me */}
          <div className={styles.formOptions}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>Remember me</span>
            </label>
            <button
              type="button"
              className={styles.forgotPassword}
              disabled={isLoading}
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className={styles.loadingSpinner}>⏳</span>
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <span className={styles.submitIcon}>→</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Section */}
        <div className={styles.demoSection}>
          <div className={styles.divider}>
            <span className={styles.dividerText}>Try Demo Accounts</span>
          </div>
          <div className={styles.demoButtons}>
            <button
              type="button"
              className={styles.demoButton}
              onClick={() => handleDemoLogin('admin')}
              disabled={isLoading}
            >
              <span className={styles.demoIcon}>👑</span>
              <div>
                <div className={styles.demoTitle}>Admin Demo</div>
                <div className={styles.demoDesc}>Full access</div>
              </div>
            </button>
            <button
              type="button"
              className={styles.demoButton}
              onClick={() => handleDemoLogin('user')}
              disabled={isLoading}
            >
              <span className={styles.demoIcon}>👤</span>
              <div>
                <div className={styles.demoTitle}>User Demo</div>
                <div className={styles.demoDesc}>Limited access</div>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.loginFooter}>
          <p className={styles.footerText}>
            Don't have an account? 
            <button
              type="button"
              className={styles.signupLink}
              onClick={handleContactAdmin}
              disabled={isLoading}
            >
              Contact admin
            </button>
          </p>
          {showContactNumber && (
            <div className={styles.contactInfo}>
              <p className={styles.contactText}>
                📞 Contact Number: <strong>077-5897772</strong>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Background Pattern */}
      <div className={styles.backgroundPattern}></div>
    </div>
  );
};

export default LoginPage;