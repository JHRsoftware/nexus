import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT - Update shop credit limit
export async function PUT(request: NextRequest) {
  try {
    const { shopId, creditLimit } = await request.json();

    // Validate input
    if (!shopId || creditLimit === undefined) {
      return NextResponse.json({
        success: false,
        error: 'Shop ID and credit limit are required'
      }, { status: 400 });
    }

    const creditLimitValue = parseFloat(creditLimit);

    if (creditLimitValue < 0) {
      return NextResponse.json({
        success: false,
        error: 'Credit limit cannot be negative'
      }, { status: 400 });
    }

    // Check if shop exists
    const existingShop = await prisma.shop.findUnique({
      where: { id: parseInt(shopId) }
    });

    if (!existingShop) {
      return NextResponse.json({
        success: false,
        error: 'Shop not found'
      }, { status: 404 });
    }

    // Get user data from headers for audit trail
    const userDataHeader = request.headers.get('x-user-data');
    let username = 'system';
    
    if (userDataHeader) {
      try {
        const userData = JSON.parse(userDataHeader);
        username = userData.username || 'unknown';
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    // Update the shop's credit limit
    const updatedShop = await prisma.shop.update({
      where: { id: parseInt(shopId) },
      data: {
        creditLimit: creditLimitValue,
        updatedAt: new Date(),
        user: username // Update the user field for audit
      }
    });

    return NextResponse.json({
      success: true,
      message: `Credit limit updated successfully from LKR ${existingShop.creditLimit.toNumber().toLocaleString()} to LKR ${creditLimitValue.toLocaleString()}`,
      shop: {
        id: updatedShop.id,
        shopName: updatedShop.shopName,
        ownerName: updatedShop.ownerName,
        contactNumber: updatedShop.contactNumber,
        creditLimit: Number(updatedShop.creditLimit),
        balanceAmount: Number(updatedShop.balanceAmount),
        previousCreditLimit: Number(existingShop.creditLimit)
      }
    });

  } catch (error) {
    console.error('Error updating shop credit limit:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update credit limit'
    }, { status: 500 });
  }
}