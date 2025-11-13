import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Force TypeScript to recognize the category model
const prisma = new PrismaClient() as any;

// GET all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        id: 'desc'
      }
    });
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // Get user information from request headers
  const userHeader = req.headers.get('x-user-data');
  let sessionUserName = 'Unknown User'; // fallback if no user is logged in
  
  console.log('User header received:', userHeader); // Debug log
  
  if (userHeader) {
    try {
      const userData = JSON.parse(userHeader);
      console.log('Parsed user data:', userData); // Debug log
      
      // Use the actual logged-in user's name
      sessionUserName = userData.name || userData.username || 'Unknown User';
      console.log('✅ Using logged-in user:', sessionUserName); // Debug log
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  } else {
    console.log('❌ No user logged in, using fallback'); // Debug log
  }

  try {
    const { category } = await req.json();
    if (!category || typeof category !== 'string' || !category.trim()) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    // Use dynamic access to avoid TypeScript errors
    const newCategory = await prisma.category.create({
      data: {
        category: category.trim(),
        user: sessionUserName,
      },
    });

    return NextResponse.json({ success: true, category: newCategory });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PUT - Update category
export async function PUT(req: NextRequest) {
  try {
    const { id, category } = await req.json();
    if (!id || !category || typeof category !== 'string' || !category.trim()) {
      return NextResponse.json({ error: 'ID and category are required' }, { status: 400 });
    }

    const updatedCategory = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        category: category.trim(),
      },
    });

    return NextResponse.json({ success: true, category: updatedCategory });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE - Delete category
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    await prisma.category.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
