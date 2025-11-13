import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Type assertions for new models (workaround for TypeScript cache issue)
const orders = (prisma as any).order;

// GET - Search orders for dropdown/autocomplete
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || 'pending';

    const where: any = {};
    
    // Case-insensitive status matching
    if (status) {
      where.status = {
        contains: status,
        mode: 'insensitive'
      };
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search } },
        { shop: { shopName: { contains: search } } },
        { salesRep: { name: { contains: search } } }
      ];
    }

    const ordersList = await orders.findMany({
      where,
      include: {
        shop: {
          select: {
            id: true,
            shopName: true,
            ownerName: true
          }
        },
        salesRep: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            orderItems: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });

    const formattedOrders = ordersList.map((order: any) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      orderDate: order.orderDate,
      shop: order.shop,
      salesRep: order.salesRep,
      netTotal: order.netTotal,
      status: order.status,
      itemCount: order._count.orderItems
    }));

    return NextResponse.json({
      success: true,
      orders: formattedOrders
    });

  } catch (error) {
    console.error('Error searching orders:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to search orders'
    }, { status: 500 });
  }
}