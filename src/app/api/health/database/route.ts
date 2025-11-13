import { NextRequest } from 'next/server';
import { ApiResponse } from '@/lib/api-utils';
import { prisma } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // Test basic connectivity
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1 as test`;
    const queryTime = Date.now() - start;
    
    // Test table access
    const userCount = await prisma.user.count();
    const productCount = await prisma.product.count();
    
    // Check for any pending migrations
    const migrationStatus = await checkMigrationStatus();
    
    const healthData = {
      status: 'healthy',
      connectivity: {
        connected: true,
        responseTime: queryTime,
        status: queryTime < 50 ? 'excellent' : queryTime < 200 ? 'good' : 'slow'
      },
      tables: {
        users: userCount,
        products: productCount,
        accessible: true
      },
      migrations: migrationStatus,
      timestamp: new Date().toISOString()
    };

    return ApiResponse.success(healthData, 'Database healthy', 30); // Cache for 30 seconds
    
  } catch (error) {
    console.error('Database health check failed:', error);
    
    return ApiResponse.error('Database health check failed', 503, {
      connectivity: {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown database error'
      },
      timestamp: new Date().toISOString()
    });
  }
}

async function checkMigrationStatus() {
  try {
    // Check if migrations table exists and get status
    const result = await prisma.$queryRaw`
      SELECT COUNT(*) as migration_count 
      FROM _prisma_migrations 
      WHERE finished_at IS NULL
    ` as any[];
    
    const pendingMigrations = Number(result[0]?.migration_count || 0);
    
    return {
      hasPendingMigrations: pendingMigrations > 0,
      pendingCount: pendingMigrations,
      status: pendingMigrations > 0 ? 'pending' : 'current'
    };
  } catch (error) {
    return {
      hasPendingMigrations: false,
      pendingCount: 0,
      status: 'unknown',
      error: 'Could not check migration status'
    };
  }
}