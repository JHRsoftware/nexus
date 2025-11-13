import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient() as any;

// GET - Search suppliers for GRN
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '20');
    
    if (!query || query.length < 2) {
      return NextResponse.json({ 
        suppliers: [],
        message: 'Please enter at least 2 characters to search'
      });
    }

    // Search suppliers by name, contact, or email
    const suppliers = await prisma.supplier.findMany({
      where: {
        OR: [
          { supplierName: { contains: query } },
          { contactNumber: { contains: query } },
          { email: { contains: query } }
        ]
      },
      select: {
        id: true,
        supplierName: true,
        contactNumber: true,
        email: true,
        address: true
      },
      take: limit,
      orderBy: {
        supplierName: 'asc'
      }
    });

    return NextResponse.json({
      suppliers
    });

  } catch (error) {
    console.error('Supplier search error:', error);
    return NextResponse.json(
      { error: 'Failed to search suppliers' },
      { status: 500 }
    );
  }
}