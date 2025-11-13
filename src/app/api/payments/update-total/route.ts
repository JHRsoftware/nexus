import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT - Update pending payment total when invoice is edited
export async function PUT(request: NextRequest) {
  try {
    const { id, newNetTotal } = await request.json();

    if (!id || newNetTotal === undefined) {
      return NextResponse.json({
        success: false,
        error: 'Payment ID and new net total are required'
      }, { status: 400 });
    }

    const netTotal = parseFloat(newNetTotal);

    if (netTotal < 0) {
      return NextResponse.json({
        success: false,
        error: 'Net total cannot be negative'
      }, { status: 400 });
    }

    // Get current payment record
    const currentPayment = await (prisma as any).pendingPayment.findUnique({
      where: { id: parseInt(id) }
    });

    if (!currentPayment) {
      return NextResponse.json({
        success: false,
        error: 'Payment record not found'
      }, { status: 404 });
    }

    // Calculate new remaining amount
    const currentPaidAmount = currentPayment.paidAmount.toNumber();
    const newRemainingAmount = netTotal - currentPaidAmount;

    // Determine new payment status
    let newStatus = 'pending';
    if (newRemainingAmount <= 0) {
      newStatus = 'completed';
    } else if (currentPaidAmount > 0) {
      newStatus = 'partial';
    }

    // If the new remaining amount is negative, we need to handle overpayment
    if (newRemainingAmount < 0) {
      return NextResponse.json({
        success: false,
        error: `Cannot reduce total below paid amount. Paid: LKR ${currentPaidAmount.toLocaleString()}, New Total: LKR ${netTotal.toLocaleString()}`
      }, { status: 400 });
    }

    // Update the pending payment record
    const updatedPayment = await (prisma as any).pendingPayment.update({
      where: { id: parseInt(id) },
      data: {
        netTotal: netTotal,
        remainingAmount: newRemainingAmount,
        paymentStatus: newStatus
      },
      include: {
        shop: true,
        invoice: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Pending payment total updated successfully',
      payment: {
        ...updatedPayment,
        netTotal: Number(updatedPayment.netTotal),
        paidAmount: Number(updatedPayment.paidAmount),
        remainingAmount: Number(updatedPayment.remainingAmount)
      }
    });

  } catch (error) {
    console.error('Error updating pending payment total:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update pending payment total'
    }, { status: 500 });
  }
}