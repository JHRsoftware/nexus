import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient() as any;

// POST - Add new item to existing GRN
export async function POST(req: NextRequest) {
  // Get user data from headers
  const userHeader = req.headers.get('x-user-data');
  
  let sessionUserName = 'Default User';
  
  if (userHeader) {
    try {
      const userData = JSON.parse(userHeader);
      sessionUserName = userData.name || userData.username || 'Unknown User';
      console.log('✅ Adding item to GRN for user:', sessionUserName);
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }

  try {
    const { 
      grnId,
      productId,
      quantity,
      costPrice
    } = await req.json();
    
    // Validate required fields
    if (!grnId || !productId || !quantity || !costPrice || quantity <= 0 || costPrice <= 0) {
      return NextResponse.json({ 
        error: 'GRN ID, Product ID, quantity > 0, and cost price > 0 are required' 
      }, { status: 400 });
    }

    // Check if GRN exists
    const existingGrn = await prisma.grn.findUnique({
      where: { id: parseInt(grnId) }
    });

    if (!existingGrn) {
      return NextResponse.json({ 
        error: 'GRN not found' 
      }, { status: 404 });
    }

    // Check if item already exists in this GRN
    const existingItem = await prisma.grnItem.findFirst({
      where: {
        grnId: parseInt(grnId),
        productId: parseInt(productId)
      }
    });

    if (existingItem) {
      return NextResponse.json({ 
        error: 'Product already exists in this GRN' 
      }, { status: 400 });
    }

    // Add item to GRN and update related data in transaction
    const result = await prisma.$transaction(async (tx: any) => {
      const itemTotal = parseFloat(quantity) * parseFloat(costPrice);

      // Create new GRN item
      const newGrnItem = await tx.grnItem.create({
        data: {
          grnId: parseInt(grnId),
          productId: parseInt(productId),
          quantity: parseInt(quantity),
          costPrice: parseFloat(costPrice),
          totalCost: itemTotal
        }
      });

      // Update product quantity and total cost
      const currentProduct = await tx.product.findUnique({
        where: { id: parseInt(productId) },
        select: { 
          id: true,
          productCode: true,
          itemName: true,
          availableQty: true, 
          totalCost: true 
        }
      });

      if (currentProduct) {
        await tx.product.update({
          where: { id: parseInt(productId) },
          data: {
            availableQty: currentProduct.availableQty + parseInt(quantity),
            totalCost: parseFloat(currentProduct.totalCost.toString()) + itemTotal
          }
        });
      }

      // Recalculate GRN total amount
      const allGrnItems = await tx.grnItem.findMany({
        where: { grnId: parseInt(grnId) }
      });

      const newTotalAmount = allGrnItems.reduce((total: number, item: any) => {
        return total + parseFloat(item.totalCost.toString());
      }, 0);

      // Update GRN total amount
      const updatedGrn = await tx.grn.update({
        where: { id: parseInt(grnId) },
        data: {
          totalAmount: newTotalAmount
        }
      });

      return {
        grnItem: newGrnItem,
        updatedGrn: updatedGrn,
        product: currentProduct,
        newTotalAmount: newTotalAmount,
        totalItemsCount: allGrnItems.length
      };
    });

    console.log(`✅ Item added to GRN successfully:`, {
      grnId: parseInt(grnId),
      productId: parseInt(productId),
      quantity: parseInt(quantity),
      itemTotal: result.grnItem.totalCost,
      newGrnTotal: result.newTotalAmount
    });

    return NextResponse.json({ 
      success: true, 
      result: result,
      message: 'Item added to GRN and databases updated successfully' 
    });

  } catch (error) {
    console.error('Error adding item to GRN:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Server error while adding item to GRN'
    }, { status: 500 });
  }
}