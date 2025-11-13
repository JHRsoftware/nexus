import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient() as any;

// GET - Search products for GRN and Invoice
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const search = searchParams.get('search') || query; // Support both parameters
    const limit = parseInt(searchParams.get('limit') || '20');
    
    const searchTerm = search || query;
    
    if (!searchTerm || searchTerm.length < 2) {
      return NextResponse.json({ 
        success: true,
        products: [],
        message: 'Please enter at least 2 characters to search'
      });
    }

    // Search products by code or name
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { productCode: { contains: searchTerm } },
          { itemName: { contains: searchTerm } }
        ]
      },
      include: {
        category: {
          select: {
            id: true,
            category: true
          }
        }
      },
      take: limit,
      orderBy: {
        itemName: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      products: products.map((product: any) => ({
        id: product.id,
        productCode: product.productCode,
        itemName: product.itemName,
        sellingPrice: product.sellingPrice,
        availableQty: product.availableQty,
        category: product.category.category,
        costPrice: product.availableQty > 0 
          ? parseFloat((product.totalCost / product.availableQty).toFixed(2))
          : 0
      }))
    });

  } catch (error) {
    console.error('Product search error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to search products' 
      },
      { status: 500 }
    );
  }
}