import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient() as any;

// GET - Fetch discounts with pagination and search
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    
    // Calculate offset
    const offset = (page - 1) * limit;
    
    // Build where clause for search
    const whereClause = search ? {
      discountName: { contains: search }
    } : {};

    // Get total count
    const totalCount = await prisma.discount.count({
      where: whereClause
    });

    // Get discounts with pagination
    const discounts = await prisma.discount.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      },
      skip: offset,
      take: limit
    });

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      discounts,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        limit
      }
    });

  } catch (error) {
    console.error('GET discounts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch discounts' },
      { status: 500 }
    );
  }
}

// POST - Create new discount
export async function POST(req: NextRequest) {
  // Get user data from headers
  const userHeader = req.headers.get('x-user-data');
  
  let sessionUserName = 'Default User';
  
  if (userHeader) {
    try {
      const userData = JSON.parse(userHeader);
      sessionUserName = userData.name || userData.username || 'Unknown User';
      console.log('✅ Creating discount for user:', sessionUserName);
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }

  try {
    const { discountName, percentage } = await req.json();
    
    // Validate required fields
    if (!discountName || percentage === undefined || percentage === null) {
      return NextResponse.json({ 
        error: 'Discount name and percentage are required' 
      }, { status: 400 });
    }

    // Validate percentage range
    const percentageValue = parseFloat(percentage);
    if (isNaN(percentageValue) || percentageValue < 0 || percentageValue > 100) {
      return NextResponse.json({ 
        error: 'Percentage must be a number between 0 and 100' 
      }, { status: 400 });
    }

    // Check if discount name already exists
    const existingDiscount = await prisma.discount.findFirst({
      where: { 
        discountName: discountName.trim(),
        isActive: true
      }
    });

    if (existingDiscount) {
      return NextResponse.json({ 
        error: 'Discount name already exists' 
      }, { status: 400 });
    }

    // Create discount
    const newDiscount = await prisma.discount.create({
      data: {
        discountName: discountName.trim(),
        percentage: percentageValue,
        isActive: true,
        user: sessionUserName
      }
    });

    return NextResponse.json({ 
      success: true, 
      discount: newDiscount,
      message: 'Discount created successfully' 
    });

  } catch (error) {
    console.error('Error creating discount:', error);
    return NextResponse.json({ 
      error: 'Server error while creating discount' 
    }, { status: 500 });
  }
}

// PUT - Update discount
export async function PUT(req: NextRequest) {
  // Get user data from headers
  const userHeader = req.headers.get('x-user-data');
  
  let sessionUserName = 'Default User';
  
  if (userHeader) {
    try {
      const userData = JSON.parse(userHeader);
      sessionUserName = userData.name || userData.username || 'Unknown User';
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }

  try {
    const { id, discountName, percentage, isActive } = await req.json();
    
    if (!id || !discountName || percentage === undefined || percentage === null) {
      return NextResponse.json({ 
        error: 'All fields are required' 
      }, { status: 400 });
    }

    // Validate percentage range
    const percentageValue = parseFloat(percentage);
    if (isNaN(percentageValue) || percentageValue < 0 || percentageValue > 100) {
      return NextResponse.json({ 
        error: 'Percentage must be a number between 0 and 100' 
      }, { status: 400 });
    }

    // Check if discount exists
    const existingDiscount = await prisma.discount.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingDiscount) {
      return NextResponse.json({ 
        error: 'Discount not found' 
      }, { status: 404 });
    }

    // Check if discount name already exists (exclude current discount)
    const duplicateDiscount = await prisma.discount.findFirst({
      where: { 
        discountName: discountName.trim(),
        isActive: true,
        id: { not: parseInt(id) }
      }
    });

    if (duplicateDiscount) {
      return NextResponse.json({ 
        error: 'Discount name already exists' 
      }, { status: 400 });
    }

    // Update discount
    const updatedDiscount = await prisma.discount.update({
      where: { id: parseInt(id) },
      data: {
        discountName: discountName.trim(),
        percentage: percentageValue,
        isActive: isActive !== undefined ? isActive : true,
        user: sessionUserName
      }
    });

    return NextResponse.json({ 
      success: true, 
      discount: updatedDiscount,
      message: 'Discount updated successfully' 
    });

  } catch (error) {
    console.error('Error updating discount:', error);
    return NextResponse.json({ 
      error: 'Server error while updating discount' 
    }, { status: 500 });
  }
}

// DELETE - Handle both toggle active/inactive and permanent delete
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const action = searchParams.get('action'); // 'toggle' or 'permanent'
    
    if (!id) {
      return NextResponse.json({ 
        error: 'Discount ID is required' 
      }, { status: 400 });
    }

    // Check if discount exists
    const existingDiscount = await prisma.discount.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingDiscount) {
      return NextResponse.json({ 
        error: 'Discount not found' 
      }, { status: 404 });
    }

    if (action === 'permanent') {
      // Permanent delete - remove from database completely
      await prisma.discount.delete({
        where: { id: parseInt(id) }
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Discount permanently deleted successfully'
      });
    } else {
      // Toggle active/inactive status (soft delete/restore)
      const newStatus = !existingDiscount.isActive;
      
      const updatedDiscount = await prisma.discount.update({
        where: { id: parseInt(id) },
        data: { 
          isActive: newStatus,
          updatedAt: new Date()
        }
      });

      return NextResponse.json({ 
        success: true, 
        message: `Discount ${newStatus ? 'activated' : 'deactivated'} successfully`,
        discount: updatedDiscount 
      });
    }

  } catch (error) {
    console.error('Error processing discount action:', error);
    return NextResponse.json({ 
      error: 'Server error while processing discount action' 
    }, { status: 500 });
  }
}