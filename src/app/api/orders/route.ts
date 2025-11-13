import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

// Type assertions for new models (workaround for TypeScript cache issue)
const orders = (prisma as any).order;
const orderItems = (prisma as any).orderItem;
const products = (prisma as any).product;

// Order interface
interface OrderData {
  orderDate: string;
  shopId: number;
  salesRepId?: number;
  discountId?: number;
  invoiceTypePercentage?: number;
  cashDiscountEnabled: boolean;
  notes?: string;
  orderItems: {
    productId: number;
    quantity: number;
    sellingPrice: number;
    discount: number;
  }[];
}

// GET - Retrieve orders with pagination and search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { orderNumber: { contains: search } },
        { shop: { shopName: { contains: search } } },
        { salesRep: { name: { contains: search } } },
        { notes: { contains: search } }
      ];
    }

    if (status) {
      where.status = status;
    }

    // Get total count
    const totalCount = await orders.count({ where });

    // Get orders with relations
    const ordersList = await orders.findMany({
      where,
      include: {
        shop: {
          select: {
            id: true,
            shopName: true,
            ownerName: true,
            contactNumber: true
          }
        },
        salesRep: {
          select: {
            id: true,
            name: true,
            contactNumber: true
          }
        },
        discount: {
          select: {
            id: true,
            discountName: true,
            percentage: true
          }
        },
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                productCode: true,
                itemName: true,
                sellingPrice: true,
                availableQty: true,
                totalCost: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });

    return NextResponse.json({
      success: true,
      orders: ordersList,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNext: skip + limit < totalCount,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch orders'
    }, { status: 500 });
  }
}

// POST - Create new order
export async function POST(request: NextRequest) {
  try {
    // Get user data from headers
    const userDataHeader = request.headers.get('x-user-data');
    let userData = null;
    
    if (userDataHeader) {
      try {
        userData = JSON.parse(userDataHeader);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    if (!userData || !userData.id) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    const orderData: OrderData = await request.json();

    // Validate required fields
    if (!orderData.orderDate || !orderData.shopId || !orderData.orderItems || orderData.orderItems.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Order date, shop, and at least one order item are required'
      }, { status: 400 });
    }

    // Generate unique order number with retry mechanism
    const generateOrderNumber = async () => {
      const today = new Date();
      const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
      
      // Get the latest order number for today to ensure uniqueness
      const latestOrder = await orders.findFirst({
        where: {
          orderNumber: {
            startsWith: `ORD-${dateStr}-`
          }
        },
        orderBy: {
          orderNumber: 'desc'
        }
      });
      
      let orderSequence = 1;
      if (latestOrder && latestOrder.orderNumber) {
        const match = latestOrder.orderNumber.match(/ORD-\d{8}-(\d+)$/);
        if (match) {
          orderSequence = parseInt(match[1]) + 1;
        }
      }
      
      return `ORD-${dateStr}-${String(orderSequence).padStart(3, '0')}`;
    };

    // Calculate totals
    let subTotal = 0;
    let totalDiscount = 0;
    let totalCost = 0;
    let totalProfit = 0;

    // Validate stock and calculate totals
    for (const item of orderData.orderItems) {
      const product = await products.findUnique({
        where: { id: item.productId }
      });

      if (!product) {
        return NextResponse.json({
          success: false,
          error: `Product with ID ${item.productId} not found`
        }, { status: 400 });
      }

      if (item.quantity > product.availableQty) {
        return NextResponse.json({
          success: false,
          error: `Insufficient stock for product ${product.itemName}. Available: ${product.availableQty}, Requested: ${item.quantity}`
        }, { status: 400 });
      }

      const itemTotal = item.sellingPrice * item.quantity;
      const itemDiscountAmount = item.discount * item.quantity;
      const itemPrice = itemTotal - itemDiscountAmount;
      
      subTotal += itemTotal;
      totalDiscount += itemDiscountAmount;

      // Calculate cost and profit
      const itemCost = (Number(product.totalCost) / Math.max(product.availableQty, 1)) * item.quantity;
      totalCost += itemCost;
      totalProfit += (itemPrice - itemCost);
    }

    // Apply invoice type discount if applicable
    let invoiceTypeDiscount = 0;
    if (orderData.discountId && orderData.invoiceTypePercentage) {
      invoiceTypeDiscount = subTotal * (orderData.invoiceTypePercentage / 100);
    }

    // Apply cash discount if enabled
    let cashDiscount = 0;
    if (orderData.cashDiscountEnabled) {
      // Get cash discount percentage from settings (you might want to pass this or fetch it)
      const cashDiscountPercent = 5; // Default 5%, you can make this dynamic
      cashDiscount = (subTotal - invoiceTypeDiscount - totalDiscount) * (cashDiscountPercent / 100);
    }

    const netTotal = subTotal - invoiceTypeDiscount - totalDiscount - cashDiscount;

    // Create order with items in transaction with retry for unique constraint
    const createOrderWithRetry = async (attempt = 1, maxAttempts = 3) => {
      try {
        const orderNumber = await generateOrderNumber();
        
        const result = await prisma.$transaction(async (tx) => {
          // Create the order
          const newOrder = await (tx as any).order.create({
            data: {
              orderNumber,
              orderDate: new Date(orderData.orderDate),
          shopId: orderData.shopId,
          salesRepId: orderData.salesRepId,
          discountId: orderData.discountId,
          invoiceTypePercentage: orderData.invoiceTypePercentage,
          subTotal,
          totalDiscount: totalDiscount + invoiceTypeDiscount,
          cashDiscount,
          cashDiscountEnabled: orderData.cashDiscountEnabled,
          netTotal,
          totalCost,
          totalProfit: totalProfit - invoiceTypeDiscount - cashDiscount,
          status: 'Pending',
          notes: orderData.notes,
          user: userData.name || userData.username || `User ${userData.id}`
        }
      });

      // Create order items
      for (const item of orderData.orderItems) {
        const product = await (tx as any).product.findUnique({
          where: { id: item.productId }
        });

        const itemTotal = item.sellingPrice * item.quantity;
        const itemDiscountAmount = item.discount * item.quantity;
        const itemPrice = itemTotal - itemDiscountAmount;
        const itemCost = product ? (Number(product.totalCost) / Math.max(product.availableQty, 1)) * item.quantity : 0;
        const itemProfit = itemPrice - itemCost;

        await (tx as any).orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            sellingPrice: item.sellingPrice,
            discount: item.discount,
            price: itemPrice,
            totalPrice: itemTotal,
            itemCost,
            itemProfit
          }
        });
      }

          return newOrder;
        });

        return result;
      } catch (error: any) {
        // If it's a unique constraint violation and we have retries left, try again
        if (error.code === 'P2002' && error.meta?.target?.includes('orderNumber') && attempt < maxAttempts) {
          console.log(`Order number collision, retrying... (attempt ${attempt + 1}/${maxAttempts})`);
          // Small delay to reduce collision probability
          await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
          return createOrderWithRetry(attempt + 1, maxAttempts);
        }
        // If it's not a unique constraint error or we're out of retries, throw the error
        throw error;
      }
    };

    const result = await createOrderWithRetry();

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      order: result
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create order'
    }, { status: 500 });
  }
}

// PUT - Update order
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = parseInt(searchParams.get('id') || '0');

    if (!orderId) {
      return NextResponse.json({
        success: false,
        error: 'Order ID is required'
      }, { status: 400 });
    }

    // Get user data from headers
    const userDataHeader = request.headers.get('x-user-data');
    let userData = null;
    
    if (userDataHeader) {
      try {
        userData = JSON.parse(userDataHeader);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    if (!userData || !userData.id) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    const updateData = await request.json();

    const updatedOrder = await orders.update({
      where: { id: orderId },
      data: {
        ...updateData,
        updatedAt: new Date()
      },
      include: {
        shop: true,
        salesRep: true,
        discount: true,
        orderItems: {
          include: {
            product: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      order: updatedOrder
    });

  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update order'
    }, { status: 500 });
  }
}

// DELETE - Delete order
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = parseInt(searchParams.get('id') || '0');

    if (!orderId) {
      return NextResponse.json({
        success: false,
        error: 'Order ID is required'
      }, { status: 400 });
    }

    await orders.delete({
      where: { id: orderId }
    });

    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete order'
    }, { status: 500 });
  }
}