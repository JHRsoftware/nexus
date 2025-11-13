import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

// GET products with pagination
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
      OR: [
        { productCode: { contains: search, mode: 'insensitive' as const } },
        { itemName: { contains: search, mode: 'insensitive' as const } },
        { 
          category: {
            category: { contains: search, mode: 'insensitive' as const }
          }
        }
      ]
    } : {};

    // Get total count for pagination info
    const totalCount = await prisma.product.count({
      where: whereClause
    });

    // Get products with pagination
    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: {
          select: {
            category: true
          }
        }
      },
      orderBy: {
        id: 'desc'
      },
      skip: offset,
      take: limit
    });

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({ 
      success: true, 
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage,
        hasPrevPage
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
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
    const { categoryId, productCode, itemName, sellingPrice, availableQty, totalCost } = await req.json();
    
    // Validate required fields (qty and totalCost are now optional)
    if (!categoryId || !productCode || !itemName || !sellingPrice) {
      return NextResponse.json({ error: 'Category, Product Code, Item Name, and Selling Price are required' }, { status: 400 });
    }

    // Check if product code already exists
    const existingProduct = await prisma.product.findUnique({
      where: { productCode }
    });

    if (existingProduct) {
      return NextResponse.json({ error: 'Product code already exists' }, { status: 400 });
    }

    // Create new product (with default values for optional fields)
    const newProduct = await prisma.product.create({
      data: {
        categoryId: parseInt(categoryId),
        productCode: productCode.trim(),
        itemName: itemName.trim(),
        sellingPrice: parseFloat(sellingPrice),
        availableQty: availableQty ? parseInt(availableQty) : 0,
        totalCost: totalCost ? parseFloat(totalCost) : 0,
        user: sessionUserName,
      },
      include: {
        category: {
          select: {
            category: true
          }
        }
      }
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PUT - Update product
export async function PUT(req: NextRequest) {
  try {
    const { id, categoryId, productCode, itemName, sellingPrice, availableQty, totalCost } = await req.json();
    
    if (!id || !categoryId || !productCode || !itemName || !sellingPrice) {
      return NextResponse.json({ error: 'ID, Category, Product Code, Item Name, and Selling Price are required' }, { status: 400 });
    }

    // Check if product code already exists for other products
    const existingProduct = await prisma.product.findFirst({
      where: { 
        productCode: productCode.trim(),
        NOT: { id: parseInt(id) }
      }
    });

    if (existingProduct) {
      return NextResponse.json({ error: 'Product code already exists' }, { status: 400 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        categoryId: parseInt(categoryId),
        productCode: productCode.trim(),
        itemName: itemName.trim(),
        sellingPrice: parseFloat(sellingPrice),
        availableQty: availableQty ? parseInt(availableQty) : 0,
        totalCost: totalCost ? parseFloat(totalCost) : 0,
      },
      include: {
        category: {
          select: {
            category: true
          }
        }
      }
    });

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE - Delete product
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}