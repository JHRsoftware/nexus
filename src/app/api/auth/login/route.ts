import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface LoginRequest {
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

export async function POST(request: NextRequest): Promise<NextResponse<LoginResponse>> {
  try {
    const body: LoginRequest = await request.json();
    const { username, password } = body;

    // Validate input
    if (!username || !password) {
      return NextResponse.json({
        success: false,
        error: 'Please enter both username and password to continue'
      }, { status: 400 });
    }

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { 
        username: username.toLowerCase().trim() 
      }
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Username or password is wrong. Please check your credentials and try again.'
      }, { status: 401 });
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json({
        success: false,
        error: 'Account is deactivated. Please contact administrator.'
      }, { status: 403 });
    }

    // Verify password (in production, use proper password hashing)
    if (user.password !== password) {
      return NextResponse.json({
        success: false,
        error: 'Username or password is wrong. Please check your credentials and try again.'
      }, { status: 401 });
    }

    // Successful login - parse accessPages from JSON string to array
    let accessPages: string[] = [];
    if (user.accessPages) {
      try {
        accessPages = JSON.parse(user.accessPages as string);
      } catch (error) {
        console.error('Error parsing user accessPages:', error);
        accessPages = [];
      }
    }

    const userResponse = {
      id: user.id,
      name: user.name,
      username: user.username,
      accessPages: accessPages,
      isActive: user.isActive
    };

    return NextResponse.json({
      success: true,
      user: userResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error. Please try again later.'
    }, { status: 500 });
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}