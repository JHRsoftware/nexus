import { NextRequest, NextResponse } from 'next/server';

// Security headers configuration
export const SECURITY_HEADERS = {
  // Prevent XSS attacks
  'X-XSS-Protection': '1; mode=block',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Control framing (prevent clickjacking)
  'X-Frame-Options': 'DENY',
  
  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // For Next.js development
    "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
    "font-src 'self' fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; '),
  
  // HSTS (HTTPS-only)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  
  // Permissions policy
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'interest-cohort=()'
  ].join(', ')
} as const;

// Apply security headers to response
export function withSecurityHeaders(response: NextResponse): NextResponse {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
}

// Input validation and sanitization
export class SecurityValidator {
  // SQL injection prevention patterns
  private static SQL_INJECTION_PATTERNS = [
    /('|(\\')|(;)|(\\)|(\-\-)|(\/\*)|(\*\/))/i,
    /((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
    /(((\%27)|(\'))union)/i,
    /(exec(\s|\+)+(s|x)p\w+)/i
  ];

  // XSS prevention patterns
  private static XSS_PATTERNS = [
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    /<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi,
    /<object[\s\S]*?>[\s\S]*?<\/object>/gi,
    /<embed[\s\S]*?>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /on\w+\s*=/gi
  ];

  static sanitizeInput(input: string): string {
    if (typeof input !== 'string') return '';
    
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove basic HTML
      .replace(/['"]/g, '') // Remove quotes
      .slice(0, 1000); // Limit length
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  static validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  static detectSQLInjection(input: string): boolean {
    return this.SQL_INJECTION_PATTERNS.some(pattern => pattern.test(input));
  }

  static detectXSS(input: string): boolean {
    return this.XSS_PATTERNS.some(pattern => pattern.test(input));
  }

  static validateAndSanitize(input: any, type: 'string' | 'number' | 'email' | 'password' = 'string'): {
    valid: boolean;
    value: any;
    errors: string[];
  } {
    const errors: string[] = [];
    let value = input;

    if (input === null || input === undefined) {
      errors.push('Value is required');
      return { valid: false, value: null, errors };
    }

    switch (type) {
      case 'string':
        if (typeof input !== 'string') {
          errors.push('Value must be a string');
          break;
        }
        
        if (this.detectSQLInjection(input)) {
          errors.push('Potential SQL injection detected');
        }
        
        if (this.detectXSS(input)) {
          errors.push('Potential XSS attack detected');
        }
        
        value = this.sanitizeInput(input);
        break;

      case 'number':
        const num = Number(input);
        if (isNaN(num)) {
          errors.push('Value must be a valid number');
        } else {
          value = num;
        }
        break;

      case 'email':
        if (typeof input !== 'string') {
          errors.push('Email must be a string');
        } else if (!this.validateEmail(input)) {
          errors.push('Invalid email format');
        } else {
          value = this.sanitizeInput(input.toLowerCase());
        }
        break;

      case 'password':
        if (typeof input !== 'string') {
          errors.push('Password must be a string');
        } else {
          const validation = this.validatePassword(input);
          errors.push(...validation.errors);
          value = input; // Don't sanitize passwords
        }
        break;
    }

    return {
      valid: errors.length === 0,
      value,
      errors
    };
  }
}

// Rate limiting by IP
class RateLimiter {
  private requests = new Map<string, { count: number; resetTime: number }>();
  
  constructor(
    private limit: number = 100,
    private windowMs: number = 60000
  ) {}

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const record = this.requests.get(identifier);

    if (!record || now > record.resetTime) {
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs
      });
      return true;
    }

    if (record.count >= this.limit) {
      return false;
    }

    record.count++;
    return true;
  }

  getRemainingRequests(identifier: string): number {
    const record = this.requests.get(identifier);
    if (!record || Date.now() > record.resetTime) {
      return this.limit;
    }
    return Math.max(0, this.limit - record.count);
  }
}

// Global rate limiter instances
export const globalRateLimiter = new RateLimiter(100, 60000); // 100 req/min
export const strictRateLimiter = new RateLimiter(20, 60000); // 20 req/min for sensitive endpoints

// Security middleware factory
export function createSecurityMiddleware(options: {
  rateLimit?: 'global' | 'strict' | 'none';
  validateInput?: boolean;
  requireAuth?: boolean;
} = {}) {
  return async function securityMiddleware(request: NextRequest) {
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';

    // Rate limiting
    if (options.rateLimit !== 'none') {
      const limiter = options.rateLimit === 'strict' ? strictRateLimiter : globalRateLimiter;
      
      if (!limiter.isAllowed(clientIP)) {
        return NextResponse.json(
          { error: 'Rate limit exceeded', remaining: limiter.getRemainingRequests(clientIP) },
          { status: 429 }
        );
      }
    }

    // Request size limiting
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) { // 10MB limit
      return NextResponse.json(
        { error: 'Request too large' },
        { status: 413 }
      );
    }

    // Suspicious pattern detection
    if (containsSuspiciousPatterns(request.url)) {
      console.warn(`🚨 Suspicious request from ${clientIP}: ${request.url}`);
      return NextResponse.json(
        { error: 'Request blocked' },
        { status: 403 }
      );
    }

    return NextResponse.next();
  };
}

// Check for suspicious URL patterns
function containsSuspiciousPatterns(url: string): boolean {
  const suspiciousPatterns = [
    /\.\.\//, // Path traversal
    /\/etc\//, // System file access
    /\/proc\//, // Process information
    /\/admin/, // Admin panel probing (unless legitimate)
    /\/wp-admin/, // WordPress admin
    /\/phpmyadmin/, // Database admin
    /eval\(/, // Code injection
    /__proto__/, // Prototype pollution
  ];

  return suspiciousPatterns.some(pattern => pattern.test(url));
}

// CSRF token utilities
export class CSRFProtection {
  private static tokens = new Map<string, { token: string; expires: number }>();

  static generateToken(sessionId: string): string {
    const token = crypto.randomUUID();
    const expires = Date.now() + (60 * 60 * 1000); // 1 hour
    
    this.tokens.set(sessionId, { token, expires });
    
    // Clean up expired tokens
    this.cleanup();
    
    return token;
  }

  static validateToken(sessionId: string, token: string): boolean {
    const stored = this.tokens.get(sessionId);
    
    if (!stored || stored.expires < Date.now()) {
      this.tokens.delete(sessionId);
      return false;
    }
    
    return stored.token === token;
  }

  private static cleanup() {
    const now = Date.now();
    for (const [sessionId, data] of this.tokens.entries()) {
      if (data.expires < now) {
        this.tokens.delete(sessionId);
      }
    }
  }
}

export default {
  SECURITY_HEADERS,
  withSecurityHeaders,
  SecurityValidator,
  createSecurityMiddleware,
  CSRFProtection,
  globalRateLimiter,
  strictRateLimiter,
};