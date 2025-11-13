import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Type assertions for new models (workaround for TypeScript cache issue)
const orders = (prisma as any).order;

// GET - Get single order by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = parseInt(id);

    if (!orderId || isNaN(orderId)) {
      return NextResponse.json({
        success: false,
        error: 'Valid order ID is required'
      }, { status: 400 });
    }

    const order = await orders.findUnique({
      where: { id: orderId },
      include: {
        shop: {
          select: {
            id: true,
            shopName: true,
            ownerName: true,
            contactNumber: true,
            address: true,
            creditLimit: true,
            balanceAmount: true
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
                totalCost: true,
                category: {
                  select: {
                    id: true,
                    category: true
                  }
                }
              }
            }
          },
          orderBy: {
            id: 'asc'
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json({
        success: false,
        error: 'Order not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      order
    });

  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch order'
    }, { status: 500 });
  }
}

// PUT - Update order (only for pending orders)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = parseInt(id);

    if (!orderId || isNaN(orderId)) {
      return NextResponse.json({
        success: false,
        error: 'Valid order ID is required'
      }, { status: 400 });
    }

    // Check if order exists and is pending
    const existingOrder = await orders.findUnique({
      where: { id: orderId },
      select: { id: true, status: true }
    });

    if (!existingOrder) {
      return NextResponse.json({
        success: false,
        error: 'Order not found'
      }, { status: 404 });
    }

    if (existingOrder.status.toLowerCase() !== 'pending') {
      return NextResponse.json({
        success: false,
        error: 'Only pending orders can be edited'
      }, { status: 400 });
    }

    const body = await request.json();
    console.log('=== ORDER UPDATE DEBUG ===');
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    const {
      orderDate,
      shopId,
      salesRepId,
      discountId,
      notes,
      items,
      orderItems  // Check if it's coming as orderItems instead of items
    } = body;

    // Use orderItems if items is not present (field name mismatch)
    const actualItems = items || orderItems;

    console.log('Extracted fields:');
    console.log('- orderDate:', orderDate);
    console.log('- shopId:', shopId);
    console.log('- salesRepId:', salesRepId);
    console.log('- discountId:', discountId);
    console.log('- notes:', notes);
    console.log('- items:', actualItems);
    console.log('- items type:', typeof actualItems);
    console.log('- items isArray:', Array.isArray(actualItems));

    // Validate required fields
    if (!orderDate || !shopId || !actualItems || !Array.isArray(actualItems)) {
      console.log('Validation failed:');
      console.log('- orderDate present:', !!orderDate);
      console.log('- shopId present:', !!shopId);
      console.log('- actualItems present:', !!actualItems);
      console.log('- actualItems isArray:', Array.isArray(actualItems));
      
      return NextResponse.json({
        success: false,
        error: 'Required fields: orderDate, shopId, items (as array)'
      }, { status: 400 });
    }

    if (actualItems.length === 0) {
      console.log('No items provided');
      return NextResponse.json({
        success: false,
        error: 'Order must have at least one item'
      }, { status: 400 });
    }

    // Validate items
    console.log('Validating items...');
    for (const [index, item] of actualItems.entries()) {
      console.log(`Item ${index}:`, item);
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        console.log(`Item ${index} validation failed:`, {
          productId: item.productId,
          quantity: item.quantity,
          hasProductId: !!item.productId,
          hasQuantity: !!item.quantity,
          quantityValue: item.quantity,
          quantityPositive: item.quantity > 0
        });
        return NextResponse.json({
          success: false,
          error: `Item ${index + 1}: must have productId and positive quantity`
        }, { status: 400 });
      }

      // Validate sellingPrice and discount are not negative
      if (item.sellingPrice === undefined || item.sellingPrice === null || item.sellingPrice < 0 || (item.discount && item.discount < 0)) {
        console.log(`Item ${index} price validation failed:`, {
          sellingPrice: item.sellingPrice,
          discount: item.discount
        });
        return NextResponse.json({
          success: false,
          error: `Item ${index + 1}: selling price must be provided and non-negative`
        }, { status: 400 });
      }
    }

    // Calculate totals
    let subTotal = 0;
    let totalDiscount = 0;

    console.log('Calculating totals...');
    for (const item of actualItems) {
      const itemTotal = item.quantity * item.sellingPrice;
      const itemDiscount = item.discount || 0;
      subTotal += itemTotal;
      totalDiscount += itemDiscount;
      console.log(`Item calculation:`, {
        quantity: item.quantity,
        sellingPrice: item.sellingPrice,
        discount: itemDiscount,
        itemTotal,
        runningSubTotal: subTotal,
        runningDiscount: totalDiscount
      });
    }
    
    console.log('Final totals:', { subTotal, totalDiscount });

    const netTotal = subTotal - totalDiscount;

    // Update order in transaction
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Delete existing order items
      await (tx as any).orderItem.deleteMany({
        where: { orderId: orderId }
      });

      // Update order
      const order = await orders.update({
        where: { id: orderId },
        data: {
          orderDate: new Date(orderDate),
          shopId: parseInt(shopId),
          salesRepId: salesRepId ? parseInt(salesRepId) : null,
          discountId: discountId ? parseInt(discountId) : null,
          subTotal,
          totalDiscount,
          netTotal,
          notes: notes || null,
        }
      });

      // Create new order items
      const orderItemsData = actualItems.map((item: any) => ({
        orderId: orderId,
        productId: parseInt(item.productId),
        quantity: parseInt(item.quantity),
        sellingPrice: parseFloat(item.sellingPrice),
        discount: parseFloat(item.discount || 0),
        price: parseFloat(item.sellingPrice),
        totalPrice: parseInt(item.quantity) * parseFloat(item.sellingPrice) - parseFloat(item.discount || 0)
      }));
      
      console.log('Creating order items:', orderItemsData);
      
      await (tx as any).orderItem.createMany({
        data: orderItemsData
      });

      return order;
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
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('DELETE request received for order ID:', await params);
    const { id } = await params;
    const orderId = parseInt(id);
    
    console.log('Parsed order ID:', orderId);

    if (!orderId || isNaN(orderId)) {
      console.log('Invalid order ID provided');
      return NextResponse.json({
        success: false,
        error: 'Valid order ID is required'
      }, { status: 400 });
    }

    // Check if order exists
    console.log('Looking for order with ID:', orderId);
    const existingOrder = await orders.findUnique({
      where: { id: orderId },
      select: { 
        id: true, 
        status: true, 
        orderNumber: true,
        shop: {
          select: {
            shopName: true
          }
        }
      }
    });

    console.log('Found order:', existingOrder);

    if (!existingOrder) {
      console.log('Order not found in database');
      return NextResponse.json({
        success: false,
        error: 'Order not found'
      }, { status: 404 });
    }

    // Delete order and related items in transaction
    console.log('Starting delete transaction for order:', orderId);
    await prisma.$transaction(async (tx) => {
      // Delete order items first (due to foreign key constraint)
      console.log('Deleting order items...');
      const deletedItems = await (tx as any).orderItem.deleteMany({
        where: { orderId: orderId }
      });
      console.log('Deleted order items count:', deletedItems.count);

      // Delete the order
      console.log('Deleting order...');
      const deletedOrder = await (tx as any).order.delete({
        where: { id: orderId }
      });
      console.log('Deleted order:', deletedOrder);
    });

    console.log('Delete transaction completed successfully');
    return NextResponse.json({
      success: true,
      message: `Order ${existingOrder.orderNumber} deleted successfully`
    });

  } catch (error) {
    console.error('Error deleting order:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json({
      success: false,
      error: `Failed to delete order: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
}