import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('=== DATABASE CONNECTION TEST ===');
    
    // Check if DATABASE_URL exists and log its format (without exposing the actual URL)
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      return NextResponse.json({
        error: 'DATABASE_URL not set',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    // Log URL structure without exposing credentials
    const urlInfo = {
      length: dbUrl.length,
      startsWithPostgresql: dbUrl.startsWith('postgresql://'),
      includesNeonTech: dbUrl.includes('neon.tech'),
      includesSslMode: dbUrl.includes('sslmode=require'),
      includesChannelBinding: dbUrl.includes('channel_binding=require')
    };

    console.log('Database URL Info:', urlInfo);

    // Test Prisma import
    let prismaImportResult = 'not tested';
    let prismaClient = null;
    
    try {
      const { PrismaClient } = await import('@prisma/client');
      prismaImportResult = 'success';
      prismaClient = new PrismaClient();
      console.log('Prisma client created successfully');
    } catch (error) {
      prismaImportResult = `failed: ${error instanceof Error ? error.message : 'unknown'}`;
      console.error('Prisma import error:', error);
      
      return NextResponse.json({
        error: 'Prisma import failed',
        details: prismaImportResult,
        urlInfo,
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    // Test basic database connectivity
    let dbTestResult = 'not tested';
    try {
      if (prismaClient) {
        console.log('Testing database connection...');
        const result = await prismaClient.$queryRaw`SELECT 1 as test`;
        dbTestResult = 'connection successful';
        console.log('Database test query result:', result);
        
        // Test if we can read from a table
        try {
          const userCount = await prismaClient.user.count();
          console.log('User table accessible, count:', userCount);
          
          await prismaClient.$disconnect();
          
          return NextResponse.json({
            status: 'success',
            database: {
              connection: 'successful',
              userCount: userCount,
              queryTest: 'passed'
            },
            urlInfo,
            timestamp: new Date().toISOString()
          });
          
        } catch (tableError) {
          console.error('Table access error:', tableError);
          await prismaClient.$disconnect();
          
          return NextResponse.json({
            status: 'partial_success',
            database: {
              connection: 'successful',
              tableAccess: 'failed',
              error: tableError instanceof Error ? tableError.message : 'unknown table error'
            },
            urlInfo,
            timestamp: new Date().toISOString()
          }, { status: 500 });
        }
      }
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      dbTestResult = `failed: ${dbError instanceof Error ? dbError.message : 'unknown'}`;
      
      if (prismaClient) {
        try {
          await prismaClient.$disconnect();
        } catch (disconnectError) {
          console.error('Error disconnecting:', disconnectError);
        }
      }
      
      return NextResponse.json({
        error: 'Database connection failed',
        details: dbTestResult,
        urlInfo,
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    return NextResponse.json({
      error: 'Unexpected code path',
      timestamp: new Date().toISOString()
    }, { status: 500 });

  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      error: 'Database test failed',
      details: error instanceof Error ? error.message : 'unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}