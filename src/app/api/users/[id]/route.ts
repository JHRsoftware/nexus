import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

// GET single user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Convert accessPages from JSON string to array
    const userWithParsedAccessPages = {
      ...user,
      accessPages: user.accessPages ? JSON.parse(user.accessPages as string) : []
    };

    return NextResponse.json(userWithParsedAccessPages);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PUT update user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, username, password, accessPages, isActive } = body;

    // Prepare update data
    const updateData: any = {};
    
    if (name !== undefined) updateData.name = name.trim();
    if (username !== undefined) updateData.username = username.trim();
    if (password !== undefined) updateData.password = password;
    if (isActive !== undefined) updateData.isActive = isActive;
    
    // Convert accessPages array to JSON string if provided
    if (accessPages !== undefined) {
      if (!Array.isArray(accessPages)) {
        return NextResponse.json(
          { error: 'accessPages must be an array' },
          { status: 400 }
        );
      }
      updateData.accessPages = JSON.stringify(accessPages);
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    // Return user with parsed accessPages for consistency
    const userResponse = {
      ...updatedUser,
      accessPages: updatedUser.accessPages ? JSON.parse(updatedUser.accessPages as string) : []
    };

    return NextResponse.json(userResponse);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await prisma.user.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}