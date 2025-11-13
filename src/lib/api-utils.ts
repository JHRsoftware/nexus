import { NextRequest, NextResponse } from 'next/server';
import { CacheManager } from './cache';

// API Response wrapper for consistent format and caching
export class ApiResponse {
  static success<T>(data: T, message: string = 'Success', cacheTTL?: number) {
    const response = NextResponse.json({
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
    });

    if (cacheTTL) {
      response.headers.set('Cache-Control', `public, max-age=${cacheTTL}`);
    }

    return response;
  }

  static error(message: string, statusCode: number = 400, details?: any) {
    return NextResponse.json({
      success: false,
      error: message,
      details,
      timestamp: new Date().toISOString(),
    }, { status: statusCode });
  }

  static paginated<T>(
    data: T[],
    page: number,
    limit: number,
    total: number,
    message: string = 'Success'
  ) {
    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
      message,
      timestamp: new Date().toISOString(),
    });
  }
}

// API rate limiting
class RateLimiter {
  private requests: Map<string, { count: number; resetTime: number }> = new Map();
  private limit: number;
  private windowMs: number;

  constructor(limit: number = 100, windowMs: number = 60000) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  check(key: string): boolean {
    const now = Date.now();
    const record = this.requests.get(key);

    if (!record || now > record.resetTime) {
      this.requests.set(key, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return true;
    }

    if (record.count >= this.limit) {
      return false;
    }

    record.count++;
    return true;
  }

  getRemainingRequests(key: string): number {
    const record = this.requests.get(key);
    if (!record || Date.now() > record.resetTime) {
      return this.limit;
    }
    return Math.max(0, this.limit - record.count);
  }
}

const rateLimiter = new RateLimiter(100, 60000); // 100 requests per minute

// Middleware for API optimization
export function withApiOptimization(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: {
    cache?: { ttl: number; key?: string };
    rateLimit?: boolean;
    validateMethod?: string[];
  } = {}
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const clientId = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anonymous';
    
    // Rate limiting
    if (options.rateLimit !== false) {
      if (!rateLimiter.check(clientId)) {
        return ApiResponse.error('Rate limit exceeded', 429, {
          remaining: rateLimiter.getRemainingRequests(clientId),
        });
      }
    }

    // Method validation
    if (options.validateMethod && !options.validateMethod.includes(req.method)) {
      return ApiResponse.error(`Method ${req.method} not allowed`, 405);
    }

    // Cache check
    if (options.cache && req.method === 'GET') {
      const cacheKey = options.cache.key || req.url;
      const cached = await CacheManager.get(cacheKey);
      if (cached) {
        console.log(`🎯 Cache hit for ${cacheKey}`);
        return NextResponse.json(cached);
      }
    }

    try {
      const response = await handler(req);
      
      // Cache response if successful
      if (options.cache && req.method === 'GET' && response.status === 200) {
        const cacheKey = options.cache.key || req.url;
        const data = await response.clone().json();
        await CacheManager.set(cacheKey, data, options.cache.ttl);
      }

      return response;
    } catch (error) {
      console.error('API Error:', error);
      return ApiResponse.error(
        'Internal server error',
        500,
        process.env.NODE_ENV === 'development' ? error : undefined
      );
    }
  };
}

// Database query optimization helpers
export class QueryOptimizer {
  static buildPaginationQuery(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    return { skip, take: Math.min(limit, 100) }; // Max 100 items per page
  }

  static buildSearchQuery(search?: string, fields: string[] = []) {
    if (!search || fields.length === 0) return {};

    return {
      OR: fields.map(field => ({
        [field]: {
          contains: search,
          mode: 'insensitive' as const,
        },
      })),
    };
  }

  static buildSortQuery(sort?: string, order?: string) {
    if (!sort) return { createdAt: 'desc' as const };

    const sortOrder = order === 'asc' ? 'asc' : 'desc';
    return {
      [sort]: sortOrder as 'asc' | 'desc',
    };
  }

  static optimizeIncludes(includes: string[] = []) {
    // Prevent N+1 queries by optimizing includes
    const optimizedIncludes: Record<string, boolean | object> = {};
    
    includes.forEach(include => {
      if (include.includes('.')) {
        const [parent, child] = include.split('.');
        optimizedIncludes[parent] = {
          include: {
            [child]: true,
          },
        };
      } else {
        optimizedIncludes[include] = true;
      }
    });

    return optimizedIncludes;
  }
}

// Request validation helpers
export class RequestValidator {
  static validatePagination(searchParams: URLSearchParams) {
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    
    return { page, limit };
  }

  static validateRequiredFields<T extends Record<string, any>>(
    data: T,
    required: (keyof T)[]
  ): string[] {
    const missing: string[] = [];
    
    required.forEach(field => {
      if (data[field] === undefined || data[field] === null || data[field] === '') {
        missing.push(String(field));
      }
    });

    return missing;
  }

  static sanitizeInput(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }
}

// API metrics collection
export class ApiMetrics {
  private static metrics = new Map<string, {
    count: number;
    totalTime: number;
    errors: number;
  }>();

  static recordRequest(endpoint: string, duration: number, isError: boolean = false) {
    const current = this.metrics.get(endpoint) || { count: 0, totalTime: 0, errors: 0 };
    
    current.count++;
    current.totalTime += duration;
    if (isError) current.errors++;

    this.metrics.set(endpoint, current);
  }

  static getMetrics() {
    const result: Record<string, any> = {};
    
    this.metrics.forEach((value, key) => {
      result[key] = {
        ...value,
        averageTime: value.totalTime / value.count,
        errorRate: value.errors / value.count,
      };
    });

    return result;
  }

  static resetMetrics() {
    this.metrics.clear();
  }
}

export default { ApiResponse, withApiOptimization, QueryOptimizer, RequestValidator, ApiMetrics };