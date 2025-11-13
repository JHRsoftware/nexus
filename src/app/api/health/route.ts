import { NextRequest } from 'next/server';
import { ApiResponse } from '@/lib/api-utils';
import { prisma } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    
    // Basic database connectivity check
    await prisma.$queryRaw`SELECT 1`;
    
    // Check database response time
    const start = Date.now();
    await prisma.user.findFirst({
      select: { id: true }
    });
    const dbResponseTime = Date.now() - start;
    
    const healthStatus = {
      status: 'healthy',
      database: {
        connected: true,
        responseTime: dbResponseTime,
        status: dbResponseTime < 100 ? 'optimal' : dbResponseTime < 500 ? 'good' : 'slow'
      },
      server: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        nodeVersion: process.version
      },
      timestamp: new Date().toISOString()
    };

    return ApiResponse.success(healthStatus, 'System healthy', 60); // Cache for 60 seconds
    
  } catch (error) {
    console.error('Health check failed:', error);
    
    return ApiResponse.error('Health check failed', 503, {
      database: {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      timestamp: new Date().toISOString()
    });
  }
}