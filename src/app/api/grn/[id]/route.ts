import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient() as any;

// PUT - Update existing GRN
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const grnId = parseInt(id);
    if (isNaN(grnId)) {
      return NextResponse.json(
        { error: 'Invalid GRN ID' },
        { status: 400 }
      );
    }

    const userHeader = req.headers.get('x-user-data');
    if (!userHeader) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = JSON.parse(userHeader);
    const body = await req.json();
    const { grnDate, supplierId, invoiceNumber, poNumber, paymentType, items } = body;

    // Validation
    if (!supplierId || !invoiceNumber || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if GRN exists
    const existingGrn = await prisma.grn.findUnique({
      where: { id: grnId },
      include: { grnItems: true }
    });

    if (!existingGrn) {
      return NextResponse.json(
        { error: 'GRN not found' },
        { status: 404 }
      );
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum: number, item: any) => 
      sum + (item.quantity * item.costPrice), 0
    );

    // Update GRN using transaction
    const result = await prisma.$transaction(async (tx: any) => {
      // Get existing GRN items to reverse product updates
      const existingGrnItems = await tx.grnItem.findMany({
        where: { grnId: grnId }
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

      // Delete existing GRN items
      await tx.grnItem.deleteMany({
        where: { grnId: grnId }
      });

      // Update GRN header
      const updatedGrn = await tx.grn.update({
        where: { id: grnId },
        data: {
          grnDate: new Date(grnDate),
          supplierId: parseInt(supplierId),
          invoiceNumber,
          poNumber,
          paymentType,
          totalAmount,
          user: user.username || user.email || 'Unknown'
        }
      });

      // Create new GRN items and update product quantities/costs
      const grnItems = await Promise.all(
        items.map(async (item: any) => {
          const itemTotal = item.quantity * item.costPrice;

          // Create GRN item
          const grnItem = await tx.grnItem.create({
            data: {
              grnId: updatedGrn.id,
              productId: item.productId,
              quantity: item.quantity,
              costPrice: item.costPrice,
              totalCost: itemTotal
            }
          });

          // Update product quantity and total cost
          const currentProduct = await tx.product.findUnique({
            where: { id: item.productId },
            select: { availableQty: true, totalCost: true }
          });

          if (currentProduct) {
            await tx.product.update({
              where: { id: item.productId },
              data: {
                availableQty: currentProduct.availableQty + item.quantity,
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
      message: 'GRN updated successfully',
      grn: result.grn
    });

  } catch (error) {
    console.error('Update GRN error:', error);
    return NextResponse.json(
      { error: 'Failed to update GRN' },
      { status: 500 }
    );
  }
}

// GET - Get single GRN by ID
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const grnId = parseInt(id);
    if (isNaN(grnId)) {
      return NextResponse.json(
        { error: 'Invalid GRN ID' },
        { status: 400 }
      );
    }

    const grn = await prisma.grn.findUnique({
      where: { id: grnId },
      include: {
        supplier: {
          select: {
            id: true,
            supplierName: true,
            contactNumber: true,
            email: true,
            address: true
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
      }
    });

    if (!grn) {
      return NextResponse.json(
        { error: 'GRN not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      grn
    });

  } catch (error) {
    console.error('Get GRN error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GRN' },
      { status: 500 }
    );
  }
}

// DELETE - Delete GRN
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const grnId = parseInt(id);
    if (isNaN(grnId)) {
      return NextResponse.json(
        { error: 'Invalid GRN ID' },
        { status: 400 }
      );
    }

    const userHeader = req.headers.get('x-user-data');
    if (!userHeader) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if GRN exists and get items
    const existingGrn = await prisma.grn.findUnique({
      where: { id: grnId },
      include: { grnItems: true }
    });

    if (!existingGrn) {
      return NextResponse.json(
        { error: 'GRN not found' },
        { status: 404 }
      );
    }

    // Delete GRN with product quantity reversal in transaction
    await prisma.$transaction(async (tx: any) => {
      // Reverse product quantities and costs for all GRN items
      for (const item of existingGrn.grnItems) {
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

      // Delete GRN (cascade delete will handle GRN items)
      await tx.grn.delete({
        where: { id: grnId }
      });
    });

    return NextResponse.json({
      success: true,
      message: 'GRN deleted successfully'
    });

  } catch (error) {
    console.error('Delete GRN error:', error);
    return NextResponse.json(
      { error: 'Failed to delete GRN' },
      { status: 500 }
    );
  }
}