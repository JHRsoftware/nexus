import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient() as any;

// GET - Fetch single invoice with all details
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const invoiceId = parseInt(id);
    
    if (!invoiceId || isNaN(invoiceId)) {
      return NextResponse.json({ error: 'Invalid invoice ID' }, { status: 400 });
    }

    // Fetch invoice with all related data
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        shop: {
          select: {
            id: true,
            shopName: true,
            ownerName: true,
            contactNumber: true,
            creditLimit: true,
            balanceAmount: true
          }
        },
        salesRep: {
          select: {
            id: true,
            name: true,
            contactNumber: true,
            status: true
          }
        },
        discount: {
          select: {
            id: true,
            discountName: true,
            percentage: true
          }
        },
        invoiceItems: {
          include: {
            product: {
              select: {
                id: true,
                productCode: true,
                itemName: true,
                sellingPrice: true,
                availableQty: true
              }
            }
          }
        },
        pendingPayment: {
          select: {
            id: true,
            dueDate: true,
            paymentStatus: true,
            remainingAmount: true
          }
        }
      }
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Get cost prices for all products in the invoice using totalCost/availableQty
    const productIds = invoice.invoiceItems.map((item: any) => item.product.id);
    const productsWithCost = await prisma.product.findMany({
      where: {
        id: { in: productIds }
      },
      select: {
        id: true,
        totalCost: true,
        availableQty: true
      }
    });

    const costPriceMap = new Map();
    productsWithCost.forEach((product: any) => {
      const costPrice = product.availableQty > 0 
        ? parseFloat((product.totalCost / product.availableQty).toFixed(2))
        : 0;
      costPriceMap.set(product.id, costPrice);
    });

    // Format invoice items for edit form
    const formattedInvoiceItems = invoice.invoiceItems.map((item: any, index: number) => ({
      id: `item_${index}`,
      productId: item.product.id,
      productCode: item.product.productCode,
      productName: item.product.itemName,
      quantity: item.quantity,
      sellingPrice: item.sellingPrice,
      discount: item.discount || 0,
      price: item.price,
      totalPrice: item.totalPrice,
      availableQty: item.product.availableQty + item.quantity, // Add back the quantity that was used
      costPrice: costPriceMap.get(item.product.id) || 0
    }));

    const formattedInvoice = {
      ...invoice,
      shop: invoice.shop,
      salesRep: invoice.salesRep,
      discount: invoice.discount,
      invoiceItems: formattedInvoiceItems,
      dueDate: invoice.pendingPayment?.dueDate || null
    };

    return NextResponse.json({ success: true, invoice: formattedInvoice });
  } catch (error) {
    console.error('Error fetching invoice details:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}