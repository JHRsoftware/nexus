import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      status: 'success',
      message: 'Login debug endpoint working',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      userAgent: 'server-side'
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Login debug failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    return NextResponse.json({
      status: 'debug',
      message: 'Login attempt captured',
      receivedData: {
        hasUsername: !!body.username,
        hasPassword: !!body.password,
        usernameLength: body.username?.length || 0
      },
      environment: process.env.NODE_ENV,
      databaseAvailable: !!process.env.DATABASE_URL,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Login debug POST failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}