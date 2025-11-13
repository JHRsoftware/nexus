import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient() as any;

// DELETE - Remove individual GRN item and update GRN total
export async function DELETE(req: NextRequest) {
  // Get user data from headers
  const userHeader = req.headers.get('x-user-data');
  
  let sessionUserName = 'Default User';
  
  if (userHeader) {
    try {
      const userData = JSON.parse(userHeader);
      sessionUserName = userData.name || userData.username || 'Unknown User';
      console.log('✅ Removing GRN item for user:', sessionUserName);
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }

  try {
    const { searchParams } = new URL(req.url);
    const grnId = searchParams.get('grnId');
    const productId = searchParams.get('productId');
    
    if (!grnId || !productId) {
      return NextResponse.json({ 
        error: 'GRN ID and Product ID are required' 
      }, { status: 400 });
    }

    // Remove GRN item and update related data in transaction
    const result = await prisma.$transaction(async (tx: any) => {
      // Find the specific GRN item to remove
      const grnItemToRemove = await tx.grnItem.findFirst({
        where: {
          grnId: parseInt(grnId),
          productId: parseInt(productId)
        }
      });

      if (!grnItemToRemove) {
        throw new Error('GRN item not found');
      }

      // Check if product has sufficient quantity to remove from GRN
      const currentProduct = await tx.product.findUnique({
        where: { id: parseInt(productId) },
        select: { availableQty: true, totalCost: true, itemName: true }
      });

      if (currentProduct) {
        // Check if available quantity is sufficient for removal
        if (currentProduct.availableQty < grnItemToRemove.quantity) {
          throw new Error(
            `Cannot remove item from GRN. Available quantity (${currentProduct.availableQty}) is less than GRN quantity (${grnItemToRemove.quantity}) for product: ${currentProduct.itemName}`
          );
        }

        // Update product inventory (subtract quantities and costs only if sufficient qty available)
        await tx.product.update({
          where: { id: parseInt(productId) },
          data: {
            availableQty: currentProduct.availableQty - grnItemToRemove.quantity,
            totalCost: Math.max(0, parseFloat(currentProduct.totalCost.toString()) - parseFloat(grnItemToRemove.totalCost.toString()))
          }
        });
      } else {
        throw new Error('Product not found');
      }

      // Delete the GRN item
      await tx.grnItem.delete({
        where: { id: grnItemToRemove.id }
      });

      // Recalculate GRN total amount
      const remainingItems = await tx.grnItem.findMany({
        where: { grnId: parseInt(grnId) }
      });

      const newTotalAmount = remainingItems.reduce((total: number, item: any) => {
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
        removedItem: grnItemToRemove,
        updatedGrn: updatedGrn,
        newTotalAmount: newTotalAmount,
        remainingItemsCount: remainingItems.length
      };
    });

    console.log(`✅ GRN item removed successfully:`, {
      grnId: parseInt(grnId),
      productId: parseInt(productId),
      removedItemCost: result.removedItem.totalCost,
      newGrnTotal: result.newTotalAmount,
      remainingItems: result.remainingItemsCount
    });

    return NextResponse.json({ 
      success: true, 
      result: result,
      message: 'GRN item removed and databases updated successfully' 
    });

  } catch (error) {
    console.error('Error removing GRN item:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Server error while removing GRN item'
    }, { status: 500 });
  }
}