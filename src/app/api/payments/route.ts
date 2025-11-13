import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

// GET - Fetch pending payments with search and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const shopId = searchParams.get('shopId') || '';
    const invoiceId = searchParams.get('invoiceId') || '';

    const skip = (page - 1) * limit;

    // Build where condition
    const whereCondition: any = {};

    if (search) {
      whereCondition.OR = [
        {
          shop: {
            shopName: {
              contains: search
            }
          }
        },
        {
          invoice: {
            invoiceNumber: {
              contains: search
            }
          }
        }
      ];
    }

    if (shopId) {
      whereCondition.shopId = parseInt(shopId);
    }

    if (invoiceId) {
      whereCondition.invoiceId = parseInt(invoiceId);
    }

    if (status) {
      if (status === 'due') {
        // Filter for overdue payments (due date is before today)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        whereCondition.AND = [
          {
            OR: [
              { paymentStatus: 'pending' },
              { paymentStatus: 'partial' }
            ]
          },
          {
            dueDate: {
              lt: today
            }
          }
        ];
      } else {
        whereCondition.paymentStatus = status;
      }
    }

    // Get total count
    const totalCount = await (prisma as any).pendingPayment.count({
      where: whereCondition
    });

    // Get payments with relations
    const payments = await (prisma as any).pendingPayment.findMany({
      where: whereCondition,
      select: {
        id: true,
        invoiceId: true,
        shopId: true,
        netTotal: true,
        paidAmount: true,
        remainingAmount: true,
        paymentStatus: true,
        dueDate: true,
        createdAt: true,
        shop: {
          select: {
            id: true,
            shopName: true,
            ownerName: true,
            contactNumber: true
          }
        },
        invoice: {
          select: {
            id: true,
            invoiceNumber: true,
            invoiceDate: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });

    const totalPages = Math.ceil(totalCount / limit);

    // Convert Decimal values to numbers for proper JSON serialization
    const paymentsWithNumbers = payments.map((payment: any) => ({
      ...payment,
      netTotal: Number(payment.netTotal),
      paidAmount: Number(payment.paidAmount),
      remainingAmount: Number(payment.remainingAmount)
    }));

    return NextResponse.json({
      success: true,
      payments: paymentsWithNumbers,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching pending payments:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch pending payments'
    }, { status: 500 });
  }
}

// PUT - Update payment (add payment amount)
export async function PUT(request: NextRequest) {
  try {
    const { id, paidAmount, description } = await request.json();

    if (!id || paidAmount === undefined) {
      return NextResponse.json({
        success: false,
        error: 'Payment ID and paid amount are required'
      }, { status: 400 });
    }

    const paymentAmount = parseFloat(paidAmount);

    if (paymentAmount <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Payment amount must be greater than 0'
      }, { status: 400 });
    }

    // Get current payment record
    const currentPayment = await (prisma as any).pendingPayment.findUnique({
      where: { id: parseInt(id) },
      include: { shop: true }
    });

    if (!currentPayment) {
      return NextResponse.json({
        success: false,
        error: 'Payment record not found'
      }, { status: 404 });
    }

    // Calculate new amounts
    const newPaidAmount = currentPayment.paidAmount.toNumber() + paymentAmount;
    const newRemainingAmount = currentPayment.netTotal.toNumber() - newPaidAmount;

    // Check if payment exceeds remaining amount
    if (newRemainingAmount < 0) {
      return NextResponse.json({
        success: false,
        error: `Payment amount exceeds remaining balance. Remaining: LKR ${currentPayment.remainingAmount.toNumber().toLocaleString()}`
      }, { status: 400 });
    }

    // Determine new payment status
    let newStatus = 'pending';
    if (newRemainingAmount === 0) {
      newStatus = 'completed';
    } else if (newPaidAmount > 0) {
      newStatus = 'partial';
    }

    // Update payment record and shop balance in transaction
    const result = await prisma.$transaction(async (tx: any) => {
      // Update pending payment
      const updatedPayment = await (tx as any).pendingPayment.update({
        where: { id: parseInt(id) },
        data: {
          paidAmount: newPaidAmount,
          remainingAmount: newRemainingAmount,
          paymentStatus: newStatus
        },
        include: {
          shop: true,
          invoice: true
        }
      });

      // Reduce shop balance amount
      await tx.shop.update({
        where: { id: currentPayment.shopId },
        data: {
          balanceAmount: {
            decrement: paymentAmount
          }
        }
      });

      return updatedPayment;
    });

    return NextResponse.json({
      success: true,
      message: 'Payment updated successfully',
      payment: result
    });

  } catch (error) {
    console.error('Error updating payment:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update payment'
    }, { status: 500 });
  }
}

// DELETE - Mark payment as cancelled (only if no payments made)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Payment ID is required'
      }, { status: 400 });
    }

    const payment = await (prisma as any).pendingPayment.findUnique({
      where: { id: parseInt(id) }
    });

    if (!payment) {
      return NextResponse.json({
        success: false,
        error: 'Payment not found'
      }, { status: 404 });
    }

    // Only allow cancellation if no payments have been made
    if (payment.paidAmount.toNumber() > 0) {
      return NextResponse.json({
        success: false,
        error: 'Cannot cancel payment with existing payments'
      }, { status: 400 });
    }

    await (prisma as any).pendingPayment.update({
      where: { id: parseInt(id) },
      data: {
        paymentStatus: 'cancelled'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Payment cancelled successfully'
    });

  } catch (error) {
    console.error('Error cancelling payment:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to cancel payment'
    }, { status: 500 });
  }
}