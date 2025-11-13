import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient() as any;

// PUT - Update product inventory (quantity and total cost)
export async function PUT(req: NextRequest) {
  // Get user data from headers
  const userHeader = req.headers.get('x-user-data');
  
  let sessionUserName = 'Default User';
  
  if (userHeader) {
    try {
      const userData = JSON.parse(userHeader);
      sessionUserName = userData.name || userData.username || 'Unknown User';
      console.log('✅ Updating product inventory for user:', sessionUserName);
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }

  try {
    const { 
      productId, 
      quantityChange, 
      totalCostChange 
    } = await req.json();
    
    // Validate required fields
    if (!productId || quantityChange === undefined || totalCostChange === undefined) {
      return NextResponse.json({ 
        error: 'Product ID, quantity change, and total cost change are required' 
      }, { status: 400 });
    }

    // Update product inventory in transaction
    const result = await prisma.$transaction(async (tx: any) => {
      // Get current product data
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

      if (!currentProduct) {
        throw new Error('Product not found');
      }

      // Calculate new values
      const newQuantity = Math.max(0, currentProduct.availableQty + parseInt(quantityChange));
      const newTotalCost = Math.max(0, parseFloat(currentProduct.totalCost.toString()) + parseFloat(totalCostChange));

      // Update product
      const updatedProduct = await tx.product.update({
        where: { id: parseInt(productId) },
        data: {
          availableQty: newQuantity,
          totalCost: newTotalCost
        }
      });

      return {
        product: updatedProduct,
        changes: {
          quantityChange: parseInt(quantityChange),
          totalCostChange: parseFloat(totalCostChange),
          oldQuantity: currentProduct.availableQty,
          newQuantity: newQuantity,
          oldTotalCost: parseFloat(currentProduct.totalCost.toString()),
          newTotalCost: newTotalCost
        }
      };
    });

    console.log(`✅ Product inventory updated:`, {
      productId: result.product.id,
      productName: result.product.itemName,
      changes: result.changes
    });

    return NextResponse.json({ 
      success: true, 
      product: result.product,
      changes: result.changes,
      message: 'Product inventory updated successfully' 
    });

  } catch (error) {
    console.error('Error updating product inventory:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Server error while updating product inventory'
    }, { status: 500 });
  }
}