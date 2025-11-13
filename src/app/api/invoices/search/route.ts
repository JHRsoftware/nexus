import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient() as any;

// GET - Search invoices by invoice number or shop name
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!search || search.length < 2) {
      return NextResponse.json({ success: true, invoices: [] });
    }

    // Search invoices by invoice number or shop name
    const invoices = await prisma.invoice.findMany({
      where: {
        OR: [
          { invoiceNumber: { contains: search } },
          { shop: { shopName: { contains: search } } },
          { shop: { ownerName: { contains: search } } }
        ]
      },
      include: {
        shop: {
          select: {
            shopName: true,
            ownerName: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });

    // Format response for dropdown display
    const formattedInvoices = invoices.map((invoice: any) => ({
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      invoiceDate: invoice.invoiceDate,
      shopName: invoice.shop.shopName,
      ownerName: invoice.shop.ownerName,
      netTotal: invoice.netTotal
    }));

    return NextResponse.json({ success: true, invoices: formattedInvoices });
  } catch (error) {
    console.error('Error searching invoices:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}