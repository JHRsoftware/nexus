import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET() {
  try {
    // Check environment variables
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL_SET: !!process.env.DATABASE_URL,
      DATABASE_URL_LENGTH: process.env.DATABASE_URL?.length || 0,
      NEXTAUTH_SECRET_SET: !!process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL_SET: !!process.env.NEXTAUTH_URL,
    };

    // Check if Prisma is available
    let prismaStatus = 'unknown';
    try {
      const testClient = new PrismaClient();
      prismaStatus = 'imported and instantiated successfully';
      await testClient.$disconnect();
    } catch (error) {
      prismaStatus = `instantiation failed: ${error instanceof Error ? error.message : 'unknown error'}`;
    }

    return NextResponse.json({
      status: 'debug info',
      environment: envCheck,
      prisma: prismaStatus,
      timestamp: new Date().toISOString(),
      runtime: typeof window === 'undefined' ? 'server' : 'client'
    });

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}