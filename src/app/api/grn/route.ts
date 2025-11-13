import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Force TypeScript to recognize the models
const prisma = new PrismaClient() as any;

// GET GRNs with pagination and search
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
        { invoiceNumber: { contains: search } },
        { poNumber: { contains: search } },
        { supplier: { supplierName: { contains: search } } }
      ]
    } : {};

    // Get total count
    const totalCount = await prisma.grn.count({
      where: whereClause
    });

    // Get GRNs with pagination
    const grns = await prisma.grn.findMany({
      where: whereClause,
      include: {
        supplier: {
          select: {
            id: true,
            supplierName: true,
            contactNumber: true
          }
        },
        grnItems: {
          include: {
            product: {
              select: {
                id: true,
                productCode: true,
                itemName: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: offset,
      take: limit
    });

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      grns,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('GET GRNs error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GRNs' },
      { status: 500 }
    );
  }
}

// POST - Create GRN with items
export async function POST(req: NextRequest) {
  // Get user data from headers
  const userHeader = req.headers.get('x-user-data');
  
  let sessionUserName = 'Default User';
  
  if (userHeader) {
    try {
      const userData = JSON.parse(userHeader);
      sessionUserName = userData.name || userData.username || 'Unknown User';
      console.log('✅ Creating GRN for user:', sessionUserName);
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }

  try {
    const { 
      grnDate, 
      supplierId, 
      invoiceNumber, 
      poNumber, 
      paymentType, 
      items 
    } = await req.json();
    
    // Validate required fields
    if (!grnDate || !supplierId || !invoiceNumber || !paymentType || !items || items.length === 0) {
      return NextResponse.json({ 
        error: 'GRN date, supplier, invoice number, payment type, and at least one item are required' 
      }, { status: 400 });
    }

    // Validate payment type
    const validPaymentTypes = ['cash', 'credit', 'other'];
    if (!validPaymentTypes.includes(paymentType.toLowerCase())) {
      return NextResponse.json({ 
        error: 'Payment type must be cash, credit, or other' 
      }, { status: 400 });
    }

    // Validate items
    for (const item of items) {
      if (!item.productId || !item.quantity || !item.costPrice || item.quantity <= 0 || item.costPrice <= 0) {
        return NextResponse.json({ 
          error: 'Each item must have valid product, quantity > 0, and cost price > 0' 
        }, { status: 400 });
      }
    }

    // Calculate total amount
    const totalAmount = items.reduce((total: number, item: any) => {
      return total + (parseFloat(item.quantity) * parseFloat(item.costPrice));
    }, 0);

    // Check if invoice number already exists
    const existingGrn = await prisma.grn.findFirst({
      where: { invoiceNumber }
    });

    if (existingGrn) {
      return NextResponse.json({ 
        error: 'Invoice number already exists' 
      }, { status: 400 });
    }

    // Create GRN with items in transaction
    const result = await prisma.$transaction(async (tx: any) => {
      // Create GRN
      const newGrn = await tx.grn.create({
        data: {
          grnDate: new Date(grnDate),
          supplierId: parseInt(supplierId),
          invoiceNumber: invoiceNumber.trim(),
          poNumber: poNumber ? poNumber.trim() : null,
          paymentType: paymentType.toLowerCase(),
          totalAmount: totalAmount,
          user: sessionUserName
        }
      });

      // Create GRN items and update product quantities/costs
      const grnItems = await Promise.all(
        items.map(async (item: any) => {
          const itemTotal = parseFloat(item.quantity) * parseFloat(item.costPrice);
          const quantity = parseInt(item.quantity);
          const costPrice = parseFloat(item.costPrice);
          const productId = parseInt(item.productId);

          // Create GRN item
          const grnItem = await tx.grnItem.create({
            data: {
              grnId: newGrn.id,
              productId: productId,
              quantity: quantity,
              costPrice: costPrice,
              totalCost: itemTotal
            }
          });

          // Update product quantity and total cost
          const currentProduct = await tx.product.findUnique({
            where: { id: productId },
            select: { availableQty: true, totalCost: true }
          });

          if (currentProduct) {
            await tx.product.update({
              where: { id: productId },
              data: {
                availableQty: currentProduct.availableQty + quantity,
                totalCost: parseFloat(currentProduct.totalCost.toString()) + itemTotal
              }
            });
          }

          return grnItem;
        })
      );

      return { grn: newGrn, items: grnItems };
    });

    return NextResponse.json({ 
      success: true, 
      grn: result.grn,
      message: 'GRN created successfully' 
    });

  } catch (error) {
    console.error('Error creating GRN:', error);
    return NextResponse.json({ 
      error: 'Server error while creating GRN' 
    }, { status: 500 });
  }
}

// PUT - Update GRN
export async function PUT(req: NextRequest) {
  try {
    const { 
      id,
      grnDate, 
      supplierId, 
      invoiceNumber, 
      poNumber, 
      paymentType, 
      items 
    } = await req.json();
    
    if (!id || !grnDate || !supplierId || !invoiceNumber || !paymentType || !items) {
      return NextResponse.json({ 
        error: 'All fields including GRN ID are required' 
      }, { status: 400 });
    }

    // Calculate new total
    const totalAmount = items.reduce((total: number, item: any) => {
      return total + (parseFloat(item.quantity) * parseFloat(item.costPrice));
    }, 0);

    // Update GRN and items in transaction
    const result = await prisma.$transaction(async (tx: any) => {
      // Get existing GRN items to reverse product updates
      const existingGrnItems = await tx.grnItem.findMany({
        where: { grnId: parseInt(id) }
      });

      // Reverse product quantities and costs from existing items
      for (const existingItem of existingGrnItems) {
        const currentProduct = await tx.product.findUnique({
          where: { id: existingItem.productId },
          select: { availableQty: true, totalCost: true }
        });

        if (currentProduct) {
          await tx.product.update({
            where: { id: existingItem.productId },
            data: {
              availableQty: Math.max(0, currentProduct.availableQty - existingItem.quantity),
              totalCost: Math.max(0, parseFloat(currentProduct.totalCost.toString()) - parseFloat(existingItem.totalCost.toString()))
            }
          });
        }
      }

      // Update GRN
      const updatedGrn = await tx.grn.update({
        where: { id: parseInt(id) },
        data: {
          grnDate: new Date(grnDate),
          supplierId: parseInt(supplierId),
          invoiceNumber: invoiceNumber.trim(),
          poNumber: poNumber ? poNumber.trim() : null,
          paymentType: paymentType.toLowerCase(),
          totalAmount: totalAmount
        }
      });

      // Delete existing items
      await tx.grnItem.deleteMany({
        where: { grnId: parseInt(id) }
      });

      // Create new items and update product quantities/costs
      const grnItems = await Promise.all(
        items.map(async (item: any) => {
          const itemTotal = parseFloat(item.quantity) * parseFloat(item.costPrice);
          const quantity = parseInt(item.quantity);
          const costPrice = parseFloat(item.costPrice);
          const productId = parseInt(item.productId);

          // Create GRN item
          const grnItem = await tx.grnItem.create({
            data: {
              grnId: parseInt(id),
              productId: productId,
              quantity: quantity,
              costPrice: costPrice,
              totalCost: itemTotal
            }
          });

          // Update product quantity and total cost
          const currentProduct = await tx.product.findUnique({
            where: { id: productId },
            select: { availableQty: true, totalCost: true }
          });

          if (currentProduct) {
            await tx.product.update({
              where: { id: productId },
              data: {
                availableQty: currentProduct.availableQty + quantity,
                totalCost: parseFloat(currentProduct.totalCost.toString()) + itemTotal
              }
            });
          }

          return grnItem;
        })
      );

      return { grn: updatedGrn, items: grnItems };
    });

    return NextResponse.json({ 
      success: true, 
      grn: result.grn,
      message: 'GRN updated successfully' 
    });

  } catch (error) {
    console.error('Error updating GRN:', error);
    return NextResponse.json({ 
      error: 'Server error while updating GRN' 
    }, { status: 500 });
  }
}

// DELETE - Delete GRN
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ 
        error: 'GRN ID is required' 
      }, { status: 400 });
    }

    // Delete GRN with product quantity reversal in transaction
    await prisma.$transaction(async (tx: any) => {
      // Get GRN items to reverse product updates
      const grnItems = await tx.grnItem.findMany({
        where: { grnId: parseInt(id) }
      });

      // Reverse product quantities and costs
      for (const item of grnItems) {
        const currentProduct = await tx.product.findUnique({
          where: { id: item.productId },
          select: { availableQty: true, totalCost: true }
        });

        if (currentProduct) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              availableQty: Math.max(0, currentProduct.availableQty - item.quantity),
              totalCost: Math.max(0, parseFloat(currentProduct.totalCost.toString()) - parseFloat(item.totalCost.toString()))
            }
          });
        }
      }

      // Delete GRN (items will be deleted automatically due to cascade)
      await tx.grn.delete({
        where: { id: parseInt(id) }
      });
    });

    return NextResponse.json({ 
      success: true, 
      message: 'GRN deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting GRN:', error);
    return NextResponse.json({ 
      error: 'Server error while deleting GRN' 
    }, { status: 500 });
  }
}