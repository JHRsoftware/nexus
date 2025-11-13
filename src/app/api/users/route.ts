import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

// GET all users with caching
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      // Only select needed fields for performance
      select: {
        id: true,
        name: true,
        username: true,
        password: true,
        accessPages: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    // Convert accessPages from JSON string to array for each user
    const usersWithParsedAccessPages = users.map(user => ({
      ...user,
      accessPages: user.accessPages ? JSON.parse(user.accessPages as string) : []
    }));
    
    const response = NextResponse.json(usersWithParsedAccessPages);
    
    // Add caching headers for better performance
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    
    return response;
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  } finally {
    // Don't disconnect in production due to connection pooling
    if (process.env.NODE_ENV !== 'production') {
      await prisma.$disconnect();
    }
  }
}

// POST create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, username, password, accessPages } = body;

    // Validate required fields
    if (!name || !username || !password) {
      return NextResponse.json(
        { error: 'Name, username, and password are required' },
        { status: 400 }
      );
    }

    // Validate accessPages is an array
    if (!accessPages || !Array.isArray(accessPages) || accessPages.length === 0) {
      return NextResponse.json(
        { error: 'At least one access page must be selected' },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 400 }
      );
    }

    // Create new user in database - convert accessPages array to JSON string
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        username: username.trim(),
        password, // In production, hash this password
        accessPages: JSON.stringify(accessPages),
        isActive: true
      }
    });

    // Return user with parsed accessPages for consistency
    const userResponse = {
      ...newUser,
      accessPages: JSON.parse((newUser.accessPages as string) || '[]')
    };

    return NextResponse.json(userResponse, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}