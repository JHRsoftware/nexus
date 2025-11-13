import { PrismaClient } from '@prisma/client';

// Global database connection with optimization
declare global {
  var prisma: PrismaClient | undefined;
}

// Connection pool configuration
const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
};

// Singleton pattern for database connection
export const prisma = globalThis.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// Connection health check
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    // PostgreSQL-specific health check
    await prisma.$queryRaw`SELECT 1 as health_check`;
    return true;
  } catch (error) {
    console.error('PostgreSQL database connection failed:', error);
    return false;
  }
};

// Graceful shutdown
export const closeDatabaseConnection = async (): Promise<void> => {
  await prisma.$disconnect();
};

// Query optimization helpers
export const withTransaction = async <T>(
  fn: (tx: any) => Promise<T>
): Promise<T> => {
  return prisma.$transaction(fn, {
    maxWait: 5000, // 5 seconds
    timeout: 10000, // 10 seconds
  });
};

// Bulk operations helper
export const batchOperation = async <T>(
  items: T[],
  operation: (item: T) => Promise<any>,
  batchSize: number = 100
): Promise<any[]> => {
  const results = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(operation));
    results.push(...batchResults);
  }
  
  return results;
};

export default prisma;