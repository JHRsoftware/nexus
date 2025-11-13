import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

// Generate invoice number with retry logic for concurrent requests
async function generateNextInvoiceNumber(tx?: any): Promise<string> {
  const prismaClient = tx || prisma;
  
  // Get only invoices with the new format (INV-XXX)
  const allInvoices = await prismaClient.invoice.findMany({
    select: { invoiceNumber: true },
    where: {
      invoiceNumber: {
        startsWith: 'INV-'
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  let nextNumber = 1;
  
  if (allInvoices.length > 0) {
    // Extract all numbers from the new format and find the maximum
    const numbers = allInvoices
      .map((invoice: any) => {
        const match = invoice.invoiceNumber.match(/^INV-(\d+)$/);
        return match ? parseInt(match[1]) : 0;
      })
      .filter((num: number) => num > 0);
    
    if (numbers.length > 0) {
      nextNumber = Math.max(...numbers) + 1;
    }
  }

  // Format as INV-001, INV-002, etc. (3 digits with leading zeros)
  return `INV-${nextNumber.toString().padStart(3, '0')}`;
}

// Helper function to create invoice with retry for unique constraint
async function createInvoiceWithRetry(invoiceData: any, tx: any, maxRetries = 3): Promise<any> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Generate new invoice number for each attempt
      const invoiceNumber = await generateNextInvoiceNumber(tx);
      const dataWithNumber = { ...invoiceData, invoiceNumber };
      
      return await tx.invoice.create({ data: dataWithNumber });
    } catch (error: any) {
      // If it's a unique constraint violation and we have retries left, try again
      if (error.code === 'P2002' && error.meta?.target?.includes('invoice_number') && attempt < maxRetries) {
        console.log(`Invoice number collision, retrying... (attempt ${attempt + 1}/${maxRetries})`);
        // Small delay to reduce collision probability
        await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
        continue;
      }
      // If it's not a unique constraint error or we're out of retries, throw the error
      throw error;
    }
  }
}

// GET - Fetch invoices with pagination and search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    const where = search ? {
      OR: [
        { invoiceNumber: { contains: search } },
        { shop: { shopName: { contains: search } } },
        { shop: { ownerName: { contains: search } } }
      ]
    } : {};

    const [invoices, totalCount] = await Promise.all([
      prisma.invoice.findMany({
        where,
        skip,
        take: limit,
        include: {
          shop: true,
          salesRep: true,
          discount: true,
          invoiceItems: {
            include: {
              product: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.invoice.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      invoices,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch invoices'
    }, { status: 500 });
  }
}

// POST - Create new invoice
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      invoiceDate,
      shopId,
      salesRepId,
      discountId,
      items,
      cashDiscountEnabled = false,
      dueDate,
      invoiceType,
      invoiceTypePercentage,
      orderNumber,
      notes
    } = body;

    // Validate required fields
    if (!invoiceDate || !shopId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: invoiceDate, shopId, and items'
      }, { status: 400 });
    }

    // Get user info from headers
    const userHeader = request.headers.get('x-user-data');
    const user = userHeader ? JSON.parse(userHeader) : null;
    const userName = user?.name || 'Unknown';

    // Validate shop exists and is active
    const shop = await prisma.shop.findUnique({
      where: { id: parseInt(shopId) }
    });

    if (!shop) {
      return NextResponse.json({
        success: false,
        error: 'Shop not found'
      }, { status: 404 });
    }

    if (!shop.isActive) {
      return NextResponse.json({
        success: false,
        error: 'Cannot create invoice for inactive shop. Please contact administrator.'
      }, { status: 400 });
    }

    // Fetch settings for cash discount percentage
    const settings = await (prisma as any).settings.findFirst({
      orderBy: { id: 'desc' }
    });
    const cashDiscountPercent = settings?.totalBalanceDiscountPercent || 5; // Default to 5% if no settings

    // Validate discount if provided
    let discount = null;
    if (discountId) {
      discount = await prisma.discount.findUnique({
        where: { id: parseInt(discountId) }
      });
      
      if (!discount || !discount.isActive) {
        return NextResponse.json({
          success: false,
          error: 'Invalid or inactive discount'
        }, { status: 400 });
      }
    }

    // Validate products and calculate totals
    let subTotal = 0;
    let totalDiscount = 0;

    for (const item of items) {
      if (!item.productId || !item.quantity || item.sellingPrice === undefined || item.sellingPrice === null) {
        return NextResponse.json({
          success: false,
          error: 'Invalid item data'
        }, { status: 400 });
      }

      const product = await prisma.product.findUnique({
        where: { id: parseInt(item.productId) }
      });

      if (!product) {
        return NextResponse.json({
          success: false,
          error: `Product with ID ${item.productId} not found`
        }, { status: 404 });
      }

      const quantity = parseFloat(item.quantity);
      const sellingPrice = parseFloat(item.sellingPrice);
      const itemDiscount = parseFloat(item.discount || 0);

      // Check if quantity is valid (positive number)
      if (quantity <= 0) {
        return NextResponse.json({
          success: false,
          error: `Invalid quantity for product "${product.itemName}". Quantity must be greater than 0`
        }, { status: 400 });
      }

      // Check if requested quantity exceeds available stock
      if (quantity > product.availableQty) {
        return NextResponse.json({
          success: false,
          error: `Cannot save invoice! Insufficient stock for product "${product.itemName}" (${product.productCode}). Available: ${product.availableQty}, Requested: ${quantity}. Please reduce the quantity to ${product.availableQty} or less.`
        }, { status: 400 });
      }
      
      const price = quantity * sellingPrice;
      const totalPrice = price - itemDiscount;
      
      // Sub Total = sum of all totalPrice values (after individual item discounts)
      subTotal += totalPrice;
      totalDiscount += itemDiscount;
    }

    // Calculate invoice type discount if applicable
    const invoiceTypeDiscount = invoiceTypePercentage ? subTotal * (parseFloat(invoiceTypePercentage) / 100) : 0;
    
    // Calculate cash discount using percentage from settings
    const cashDiscount = cashDiscountEnabled ? subTotal * (cashDiscountPercent / 100) : 0;
    
    // Calculate net total: SubTotal - InvoiceTypeDiscount - CashDiscount
    const netTotal = subTotal - invoiceTypeDiscount - cashDiscount;
    
    console.log('💰 Invoice Totals Calculation:');
    console.log(`   Sub Total: LKR ${subTotal.toLocaleString()}`);
    console.log(`   Invoice Type Discount (${invoiceTypePercentage || 0}%): LKR ${invoiceTypeDiscount.toLocaleString()}`);
    console.log(`   Cash Discount (${cashDiscountPercent}%): LKR ${cashDiscount.toLocaleString()}`);
    console.log(`   Net Total: LKR ${netTotal.toLocaleString()}`);

    // Calculate total cost and total profit for the invoice
    let invoiceTotalCost = 0;
    let invoiceTotalProfit = 0;

    // Critical validation: Get fresh product data and validate stock before transaction
    console.log('=== CRITICAL STOCK VALIDATION BEFORE INVOICE SAVE ===');
    const stockValidationErrors: string[] = [];
    const freshProductData: any[] = [];
    
    for (const item of items) {
      // Fetch the most current product data from database
      const currentProduct = await prisma.product.findUnique({
        where: { id: parseInt(item.productId) },
        select: {
          id: true,
          itemName: true,
          productCode: true,
          availableQty: true,
          totalCost: true
        }
      });
      
      if (!currentProduct) {
        stockValidationErrors.push(`Product with ID ${item.productId} not found in database`);
        continue;
      }
      
      const requestedQuantity = parseFloat(item.quantity);
      const currentAvailableQty = currentProduct.availableQty;
      
      console.log(`Product: ${currentProduct.itemName} (${currentProduct.productCode})`);
      console.log(`  Current Available Qty: ${currentAvailableQty}`);
      console.log(`  Requested Qty: ${requestedQuantity}`);
      console.log(`  Validation: ${requestedQuantity <= currentAvailableQty ? 'PASS' : 'FAIL'}`);
      
      // Store fresh data for transaction
      freshProductData.push({
        ...item,
        productData: currentProduct,
        requestedQuantity
      });
      
      // Check if requested quantity exceeds current available stock
      if (requestedQuantity > currentAvailableQty) {
        stockValidationErrors.push(
          `${currentProduct.itemName} (${currentProduct.productCode}): ` +
          `Current Available: ${currentAvailableQty}, Requested: ${requestedQuantity}. ` +
          `Maximum allowed: ${currentAvailableQty}`
        );
      }
      
      // Additional check for zero or negative quantities
      if (requestedQuantity <= 0) {
        stockValidationErrors.push(
          `${currentProduct.itemName} (${currentProduct.productCode}): ` +
          `Invalid quantity ${requestedQuantity}. Must be greater than 0`
        );
      }
    }

    // If any stock validation errors, prevent saving
    if (stockValidationErrors.length > 0) {
      console.log('=== STOCK VALIDATION FAILED - BLOCKING INVOICE SAVE ===');
      console.log('Errors:', stockValidationErrors);
      
      return NextResponse.json({
        success: false,
        error: `❌ Cannot save invoice! Stock validation failed:\n\n${stockValidationErrors.join('\n\n')}\n\n⚠️ Please refresh the page and check current stock levels before trying again.`
      }, { status: 400 });
    }
    
    console.log('=== STOCK VALIDATION PASSED - PROCEEDING WITH INVOICE SAVE ===');

    // Create invoice with items in transaction using validated fresh data
    const result = await prisma.$transaction(async (tx) => {
      console.log('=== STARTING TRANSACTION WITH FINAL STOCK CHECK ===');
      
      // Final stock check within transaction to prevent race conditions
      for (const itemData of freshProductData) {
        const transactionProduct = await tx.product.findUnique({
          where: { id: parseInt(itemData.productId) },
          select: { availableQty: true, itemName: true, productCode: true }
        });
        
        if (!transactionProduct) {
          throw new Error(`Product ${itemData.productId} not found during transaction`);
        }
        
        if (itemData.requestedQuantity > transactionProduct.availableQty) {
          throw new Error(
            `❌ Transaction blocked! Stock changed during processing. ` +
            `Product: ${transactionProduct.itemName} (${transactionProduct.productCode}). ` +
            `Available: ${transactionProduct.availableQty}, Requested: ${itemData.requestedQuantity}. ` +
            `Please refresh and try again.`
          );
        }
        
        console.log(`✅ Final check passed for ${transactionProduct.itemName}: ${itemData.requestedQuantity} <= ${transactionProduct.availableQty}`);
      }
      
      // Calculate invoice totals for cost and profit
      let tempInvoiceTotalCost = 0;
      let tempInvoiceTotalProfit = 0;

      for (const itemData of freshProductData) {
        const quantity = itemData.requestedQuantity;
        const sellingPrice = parseFloat(itemData.sellingPrice);
        const itemDiscount = parseFloat(itemData.discount || 0);
        const totalPrice = (quantity * sellingPrice) - itemDiscount;
        
        // Calculate cost price using totalCost/availableQty
        const costPrice = itemData.productData.totalCost > 0 && itemData.productData.availableQty > 0 
          ? itemData.productData.totalCost / itemData.productData.availableQty 
          : 0;
        const itemCost = costPrice * quantity;
        
        // Calculate profit considering invoice type and cash discount deductions
        const invoiceTypeDeduction = invoiceTypePercentage ? (totalPrice * (parseFloat(invoiceTypePercentage) / 100)) : 0;
        const cashDiscountDeduction = cashDiscountEnabled ? (totalPrice * (cashDiscountPercent / 100)) : 0;
        const adjustedTotalPrice = totalPrice - invoiceTypeDeduction - cashDiscountDeduction;
        const itemProfit = adjustedTotalPrice - itemCost;
        
        tempInvoiceTotalCost += itemCost;
        tempInvoiceTotalProfit += itemProfit;
      }

      // Create invoice with retry logic to handle concurrent requests
      const invoice = await createInvoiceWithRetry({
        invoiceDate: new Date(invoiceDate),
        shopId: parseInt(shopId),
        salesRepId: salesRepId ? parseInt(salesRepId) : null,
        discountId: discountId ? parseInt(discountId) : null,
        orderNumber: orderNumber || null,
        subTotal,
        totalDiscount,
        cashDiscount,
        cashDiscountEnabled,
        cashDiscountPercentage: cashDiscountEnabled ? cashDiscountPercent : 0,
        invoiceType: invoiceType || null,
        invoiceTypePercentage: invoiceTypePercentage ? parseFloat(invoiceTypePercentage) : null,
        netTotal,
        totalCost: tempInvoiceTotalCost,
        totalProfit: tempInvoiceTotalProfit,
        notes: notes || null,
        user: userName
      } as any, tx);

      console.log(`✅ Invoice created with number: ${invoice.invoiceNumber}`);

      // Create invoice items and update inventory
      for (const itemData of freshProductData) {
        const quantity = itemData.requestedQuantity;
        const sellingPrice = parseFloat(itemData.sellingPrice);
        const itemDiscount = parseFloat(itemData.discount || 0);
        
        const price = quantity * sellingPrice;
        const totalPrice = price - itemDiscount;

        // Calculate cost price using totalCost/availableQty
        const costPrice = itemData.productData.totalCost > 0 && itemData.productData.availableQty > 0 
          ? itemData.productData.totalCost / itemData.productData.availableQty 
          : 0;
        const itemCost = costPrice * quantity;
        
        // Calculate profit considering invoice type and cash discount deductions
        const invoiceTypeDeduction = invoiceTypePercentage ? (totalPrice * (parseFloat(invoiceTypePercentage) / 100)) : 0;
        const cashDiscountDeduction = cashDiscountEnabled ? (totalPrice * (cashDiscountPercent / 100)) : 0;
        const adjustedTotalPrice = totalPrice - invoiceTypeDeduction - cashDiscountDeduction;
        const itemProfit = adjustedTotalPrice - itemCost;

        await (tx.invoiceItem as any).create({
          data: {
            invoiceId: invoice.id,
            productId: parseInt(itemData.productId),
            quantity,
            sellingPrice,
            discount: itemDiscount,
            price,
            totalPrice,
            itemCost,
            itemProfit
          }
        });

        // Get current product data within transaction
        const currentProduct = await tx.product.findUnique({
          where: { id: parseInt(itemData.productId) }
        });

        if (currentProduct) {
          const perItemCost = currentProduct.totalCost.toNumber() / (currentProduct.availableQty || 1);
          const costReduction = perItemCost * quantity;
          
          // Calculate new quantities
          const newQty = Math.max(0, currentProduct.availableQty - Math.floor(quantity));
          const newCost = Math.max(0, currentProduct.totalCost.toNumber() - costReduction);
          
          console.log(`📦 Updating inventory for ${itemData.productData.itemName}:`);
          console.log(`   Old Qty: ${currentProduct.availableQty} → New Qty: ${newQty}`);
          console.log(`   Sold: ${quantity} units`);
          
          await tx.product.update({
            where: { id: parseInt(itemData.productId) },
            data: {
              availableQty: newQty,
              totalCost: newCost
            }
          });
        }
      }

      // If this is a credit invoice, update shop balance and create pending payment
      if (discount && discount.discountName.toLowerCase().includes('credit')) {
        await tx.shop.update({
          where: { id: parseInt(shopId) },
          data: {
            balanceAmount: {
              increment: parseFloat(netTotal.toString())
            }
          }
        });

        // Calculate due date - use provided dueDate or default to invoice date + 90 days
        let finalDueDate: Date;
        if (dueDate) {
          finalDueDate = new Date(dueDate);
          console.log(`📅 Using custom due date: ${finalDueDate.toISOString().split('T')[0]}`);
        } else {
          const invoiceDateObj = new Date(invoiceDate);
          finalDueDate = new Date(invoiceDateObj);
          finalDueDate.setDate(finalDueDate.getDate() + 90);
          console.log(`📅 Calculated due date: ${finalDueDate.toISOString().split('T')[0]} (Invoice Date + 90 days)`);
        }

        // Create pending payment record with sales rep
        await (tx as any).pendingPayment.create({
          data: {
            invoiceId: invoice.id,
            shopId: parseInt(shopId),
            salesRepId: salesRepId ? parseInt(salesRepId) : null,
            netTotal: parseFloat(netTotal.toString()),
            paidAmount: 0,
            remainingAmount: parseFloat(netTotal.toString()),
            paymentStatus: 'pending',
            dueDate: finalDueDate,
            user: userName
          }
        });
        
        console.log(`💳 Created pending payment with due date: ${finalDueDate.toISOString().split('T')[0]}`);;
      }

      // If invoice was created from an order, update the order status to completed
      if (orderNumber) {
        console.log(`📋 Updating order ${orderNumber} status to completed...`);
        const updatedOrder = await (tx as any).order.updateMany({
          where: { 
            orderNumber: orderNumber,
            status: { not: 'completed' } // Only update if not already completed
          },
          data: {
            status: 'completed'
          }
        });
        
        if (updatedOrder.count > 0) {
          console.log(`✅ Order ${orderNumber} status updated to completed`);
        } else {
          console.log(`⚠️ Order ${orderNumber} was not updated (may already be completed or not found)`);
        }
      }

      return invoice;
    });

    return NextResponse.json({
      success: true,
      message: 'Invoice created successfully',
      invoice: result
    });

  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create invoice'
    }, { status: 500 });
  }
}

// PUT - Update invoice
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, invoiceDate, shopId, salesRepId, discountId, items, cashDiscountEnabled = false, invoiceType, invoiceTypePercentage, notes } = body;

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Invoice ID is required'
      }, { status: 400 });
    }

    // Get user info from headers
    const userHeader = request.headers.get('x-user-data');
    const user = userHeader ? JSON.parse(userHeader) : null;
    const userName = user?.name || 'Unknown';

    // Validate invoice exists
    const existingInvoice = await prisma.invoice.findUnique({
      where: { id: parseInt(id) },
      include: { 
        invoiceItems: true,
        discount: true,
        shop: true
      }
    });

    if (!existingInvoice) {
      return NextResponse.json({
        success: false,
        error: 'Invoice not found'
      }, { status: 404 });
    }

    // Fetch settings for cash discount percentage
    const settings = await (prisma as any).settings.findFirst({
      orderBy: { id: 'desc' }
    });
    const cashDiscountPercent = settings?.totalBalanceDiscountPercent || 5; // Default to 5% if no settings

    // Get new discount information if provided
    let newDiscount = null;
    if (discountId) {
      newDiscount = await prisma.discount.findUnique({
        where: { id: parseInt(discountId) }
      });
      
      if (!newDiscount || !newDiscount.isActive) {
        return NextResponse.json({
          success: false,
          error: 'Invalid or inactive discount'
        }, { status: 400 });
      }
    }

    // Determine if old and new invoices are credit types
    const oldIsCredit = existingInvoice.discount && existingInvoice.discount.discountName.toLowerCase().includes('credit');
    const newIsCredit = newDiscount && newDiscount.discountName.toLowerCase().includes('credit');
    const oldNetTotal = Number(existingInvoice.netTotal);
    
    console.log('=== INVOICE UPDATE BALANCE CALCULATION ===');
    console.log(`Old Invoice - Type: ${oldIsCredit ? 'CREDIT' : 'NON-CREDIT'}, Total: ${oldNetTotal}`);
    console.log(`New Invoice - Type: ${newIsCredit ? 'CREDIT' : 'NON-CREDIT'}, Will calculate new total...`);

    // Validate products and calculate new totals
    let subTotal = 0;
    let totalDiscount = 0;

    for (const item of items) {
      if (!item.productId || !item.quantity || item.sellingPrice === undefined || item.sellingPrice === null) {
        return NextResponse.json({
          success: false,
          error: 'Invalid item data'
        }, { status: 400 });
      }

      const product = await prisma.product.findUnique({
        where: { id: parseInt(item.productId) }
      });

      if (!product) {
        return NextResponse.json({
          success: false,
          error: `Product with ID ${item.productId} not found`
        }, { status: 404 });
      }

      const quantity = parseFloat(item.quantity);
      const sellingPrice = parseFloat(item.sellingPrice);
      const itemDiscount = parseFloat(item.discount || 0);

      // For updates, we need to account for the current invoice items that will be returned to stock
      const existingItem = existingInvoice.invoiceItems.find(existing => existing.productId === parseInt(item.productId));
      const currentlyAllocated = existingItem ? Number(existingItem.quantity) : 0;
      const availableAfterReturn = product.availableQty + currentlyAllocated;

      // Check if quantity is valid (positive number)
      if (quantity <= 0) {
        return NextResponse.json({
          success: false,
          error: `Invalid quantity for product "${product.itemName}". Quantity must be greater than 0`
        }, { status: 400 });
      }

      // Check if new quantity exceeds available stock (including returned stock)
      if (quantity > availableAfterReturn) {
        return NextResponse.json({
          success: false,
          error: `Cannot update invoice! Insufficient stock for product "${product.itemName}" (${product.productCode}). Available (including current allocation): ${availableAfterReturn}, Requested: ${quantity}. Please reduce the quantity to ${availableAfterReturn} or less.`
        }, { status: 400 });
      }
      
      const price = quantity * sellingPrice;
      const totalPrice = price - itemDiscount;
      
      // Sub Total = sum of all totalPrice values (after individual item discounts)
      subTotal += totalPrice;
      totalDiscount += itemDiscount;
    }

    // Calculate invoice type discount if applicable
    const invoiceTypeDiscount = invoiceTypePercentage ? subTotal * (parseFloat(invoiceTypePercentage) / 100) : 0;
    
    const cashDiscount = cashDiscountEnabled ? subTotal * (cashDiscountPercent / 100) : 0;
    
    // Calculate net total: SubTotal - InvoiceTypeDiscount - CashDiscount
    const netTotal = subTotal - invoiceTypeDiscount - cashDiscount;

    // Calculate total cost and total profit for the updated invoice
    let updateTotalCost = 0;
    let updateTotalProfit = 0;

    // Critical validation for updates: Get fresh product data and validate stock
    console.log('=== CRITICAL STOCK VALIDATION BEFORE INVOICE UPDATE ===');
    const updateStockErrors: string[] = [];
    const freshUpdateData: any[] = [];
    
    for (const item of items) {
      // Get current product data from database
      const currentProduct = await prisma.product.findUnique({
        where: { id: parseInt(item.productId) },
        select: {
          id: true,
          itemName: true,
          productCode: true,
          availableQty: true,
          totalCost: true
        }
      });
      
      if (!currentProduct) {
        updateStockErrors.push(`Product with ID ${item.productId} not found`);
        continue;
      }
      
      const requestedQuantity = parseFloat(item.quantity);
      
      // Account for currently allocated quantity in this invoice
      const existingItem = existingInvoice.invoiceItems.find(existing => existing.productId === parseInt(item.productId));
      const currentlyAllocated = existingItem ? Number(existingItem.quantity) : 0;
      const availableAfterReturn = currentProduct.availableQty + currentlyAllocated;
      
      console.log(`UPDATE Product: ${currentProduct.itemName} (${currentProduct.productCode})`);
      console.log(`  Current Available: ${currentProduct.availableQty}`);
      console.log(`  Currently Allocated: ${currentlyAllocated}`);
      console.log(`  Available After Return: ${availableAfterReturn}`);
      console.log(`  Requested: ${requestedQuantity}`);
      console.log(`  Validation: ${requestedQuantity <= availableAfterReturn ? 'PASS' : 'FAIL'}`);
      
      freshUpdateData.push({
        ...item,
        productData: currentProduct,
        requestedQuantity,
        currentlyAllocated,
        availableAfterReturn
      });
      
      // Validate against available stock after accounting for return
      if (requestedQuantity > availableAfterReturn) {
        updateStockErrors.push(
          `${currentProduct.itemName} (${currentProduct.productCode}): ` +
          `Available (including current): ${availableAfterReturn}, Requested: ${requestedQuantity}`
        );
      }
      
      if (requestedQuantity <= 0) {
        updateStockErrors.push(
          `${currentProduct.itemName} (${currentProduct.productCode}): ` +
          `Invalid quantity ${requestedQuantity}`
        );
      }
    }

    if (updateStockErrors.length > 0) {
      console.log('=== UPDATE STOCK VALIDATION FAILED ===');
      console.log('Errors:', updateStockErrors);
      
      return NextResponse.json({
        success: false,
        error: `❌ Cannot update invoice! Stock validation failed:\n\n${updateStockErrors.join('\n\n')}\n\n⚠️ Please refresh and check current stock levels.`
      }, { status: 400 });
    }
    
    // Calculate total cost and profit for the updated invoice
    for (const item of freshUpdateData) {
      const quantity = item.requestedQuantity;
      const sellingPrice = parseFloat(item.sellingPrice);
      const itemDiscount = parseFloat(item.discount || 0);
      const totalPrice = (quantity * sellingPrice) - itemDiscount;
      
      // Calculate cost price using totalCost/availableQty
      const costPrice = item.productData.totalCost > 0 && item.productData.availableQty > 0 
        ? item.productData.totalCost / item.productData.availableQty 
        : 0;
      const itemCost = costPrice * quantity;
      
      // Calculate profit considering invoice type and cash discount deductions
      const invoiceTypeDeduction = invoiceTypePercentage ? (totalPrice * (parseFloat(invoiceTypePercentage) / 100)) : 0;
      const cashDiscountDeduction = cashDiscountEnabled ? (totalPrice * (cashDiscountPercent / 100)) : 0;
      const adjustedTotalPrice = totalPrice - invoiceTypeDeduction - cashDiscountDeduction;
      const itemProfit = adjustedTotalPrice - itemCost;
      
      updateTotalCost += itemCost;
      updateTotalProfit += itemProfit;
    }
    
    console.log('=== UPDATE STOCK VALIDATION PASSED ===');

    // Update invoice with items in transaction
    const result = await prisma.$transaction(async (tx) => {
      // First, revert old inventory changes
      const oldInvoiceItems = await tx.invoiceItem.findMany({
        where: { invoiceId: parseInt(id) },
        include: { product: true }
      });

      for (const oldItem of oldInvoiceItems) {
        if (oldItem.product) {
          const perItemCost = oldItem.product.totalCost.toNumber() / (oldItem.product.availableQty || 1);
          const costToAdd = perItemCost * Number(oldItem.quantity);
          
          await tx.product.update({
            where: { id: oldItem.productId },
            data: {
              availableQty: {
                increment: Math.floor(Number(oldItem.quantity))
              },
              totalCost: {
                increment: costToAdd
              }
            }
          });
        }
      }

      // Delete existing items
      await tx.invoiceItem.deleteMany({
        where: { invoiceId: parseInt(id) }
      });

      // Update invoice
      const invoice = await tx.invoice.update({
        where: { id: parseInt(id) },
        data: {
          invoiceDate: new Date(invoiceDate),
          shopId: parseInt(shopId),
          salesRepId: salesRepId ? parseInt(salesRepId) : null,
          discountId: discountId ? parseInt(discountId) : null,
          subTotal,
          totalDiscount,
          cashDiscount,
          cashDiscountEnabled,
          cashDiscountPercentage: cashDiscountEnabled ? cashDiscountPercent : 0,
          invoiceType: invoiceType || null,
          invoiceTypePercentage: invoiceTypePercentage ? parseFloat(invoiceTypePercentage) : null,
          netTotal,
          totalCost: updateTotalCost,
          totalProfit: updateTotalProfit,
          notes: notes || null,
          user: userName
        } as any
      });

      // Create new items
      for (const item of freshUpdateData) {
        const quantity = item.requestedQuantity;
        const sellingPrice = parseFloat(item.sellingPrice);
        const itemDiscount = parseFloat(item.discount || 0);
        
        const price = quantity * sellingPrice;
        const totalPrice = price - itemDiscount;

        // Calculate cost price using totalCost/availableQty
        const costPrice = item.productData.totalCost > 0 && item.productData.availableQty > 0 
          ? item.productData.totalCost / item.productData.availableQty 
          : 0;
        const itemCost = costPrice * quantity;
        
        // Calculate profit considering invoice type and cash discount deductions
        const invoiceTypeDeduction = invoiceTypePercentage ? (totalPrice * (parseFloat(invoiceTypePercentage) / 100)) : 0;
        const cashDiscountDeduction = cashDiscountEnabled ? (totalPrice * (cashDiscountPercent / 100)) : 0;
        const adjustedTotalPrice = totalPrice - invoiceTypeDeduction - cashDiscountDeduction;
        const itemProfit = adjustedTotalPrice - itemCost;

        await (tx.invoiceItem as any).create({
          data: {
            invoiceId: invoice.id,
            productId: parseInt(item.productId),
            quantity,
            sellingPrice,
            discount: itemDiscount,
            price,
            totalPrice,
            itemCost,
            itemProfit
          }
        });

        // Final transaction-level stock validation before updating product
        const finalValidationProduct = await tx.product.findUnique({
          where: { id: parseInt(item.productId) },
          select: {
            id: true,
            itemName: true,
            productCode: true,
            availableQty: true
          }
        });
        
        if (!finalValidationProduct) {
          throw new Error(`Product ${item.productId} not found in final transaction validation`);
        }
        
        console.log(`FINAL TRANSACTION UPDATE ${finalValidationProduct.itemName}: Available: ${finalValidationProduct.availableQty}, Requesting: ${quantity}`);
        
        // Final check - product availability should be sufficient at transaction time
        if (quantity > finalValidationProduct.availableQty) {
          throw new Error(
            `Final transaction validation failed for ${finalValidationProduct.itemName} (${finalValidationProduct.productCode}): ` +
            `Available: ${finalValidationProduct.availableQty}, Requested: ${quantity}. ` +
            `Stock was modified by another process.`
          );
        }

        // Update product inventory for new items
        const currentProduct = await tx.product.findUnique({
          where: { id: parseInt(item.productId) }
        });

        if (currentProduct) {
          const perItemCost = currentProduct.totalCost.toNumber() / (currentProduct.availableQty || 1);
          const costReduction = perItemCost * quantity;
          
          // Ensure we don't go below zero
          const newQty = Math.max(0, currentProduct.availableQty - Math.floor(quantity));
          const newCost = Math.max(0, currentProduct.totalCost.toNumber() - costReduction);
          
          await tx.product.update({
            where: { id: parseInt(item.productId) },
            data: {
              availableQty: newQty,
              totalCost: newCost
            }
          });
        }
      }

      // Handle balance amount changes for credit invoices
      let balanceChange = 0;
      
      if (oldIsCredit && newIsCredit) {
        // Both old and new are credit - update balance by difference
        balanceChange = netTotal - oldNetTotal;
        console.log(`Credit to Credit: Balance change = ${netTotal} - ${oldNetTotal} = ${balanceChange}`);
      } else if (oldIsCredit && !newIsCredit) {
        // Old was credit, new is not - reduce balance by old amount
        balanceChange = -oldNetTotal;
        console.log(`Credit to Non-Credit: Balance change = -${oldNetTotal} = ${balanceChange}`);
      } else if (!oldIsCredit && newIsCredit) {
        // Old was not credit, new is credit - add new amount to balance
        balanceChange = netTotal;
        console.log(`Non-Credit to Credit: Balance change = +${netTotal} = ${balanceChange}`);
      } else {
        // Both non-credit - no balance change
        balanceChange = 0;
        console.log(`Non-Credit to Non-Credit: No balance change`);
      }

      // Update shop balance if there's a change
      if (balanceChange !== 0) {
        await tx.shop.update({
          where: { id: parseInt(shopId) },
          data: {
            balanceAmount: {
              increment: parseFloat(balanceChange.toString())
            }
          }
        });
        console.log(`✅ Shop balance updated by: ${balanceChange}`);
      }

      // Handle pending payment updates
      if (oldIsCredit || newIsCredit) {
        const existingPendingPayment = await (tx as any).pendingPayment.findUnique({
          where: { invoiceId: parseInt(id) }
        });

        if (oldIsCredit && !newIsCredit) {
          // Remove pending payment if changing from credit to non-credit
          if (existingPendingPayment) {
            await (tx as any).pendingPayment.delete({
              where: { invoiceId: parseInt(id) }
            });
            console.log(`🗑️ Deleted pending payment (credit → non-credit)`);
          }
        } else if (!oldIsCredit && newIsCredit) {
          // Create pending payment if changing from non-credit to credit
          const invoiceDateObj = new Date(invoiceDate);
          const defaultDueDate = new Date(invoiceDateObj);
          defaultDueDate.setDate(defaultDueDate.getDate() + 90);

          await (tx as any).pendingPayment.create({
            data: {
              invoiceId: parseInt(id),
              shopId: parseInt(shopId),
              salesRepId: salesRepId ? parseInt(salesRepId) : null,
              netTotal: parseFloat(netTotal.toString()),
              paidAmount: 0,
              remainingAmount: parseFloat(netTotal.toString()),
              paymentStatus: 'pending',
              dueDate: defaultDueDate,
              user: userName
            }
          });
          console.log(`💳 Created pending payment (non-credit → credit)`);
        } else if (oldIsCredit && newIsCredit && existingPendingPayment) {
          // Update existing pending payment if both are credit
          const newRemainingAmount = netTotal - Number(existingPendingPayment.paidAmount);
          let newPaymentStatus = 'pending';
          
          if (newRemainingAmount <= 0) {
            newPaymentStatus = 'completed';
          } else if (Number(existingPendingPayment.paidAmount) > 0) {
            newPaymentStatus = 'partial';
          }

          await (tx as any).pendingPayment.update({
            where: { invoiceId: parseInt(id) },
            data: {
              netTotal: parseFloat(netTotal.toString()),
              remainingAmount: parseFloat(newRemainingAmount.toString()),
              paymentStatus: newPaymentStatus
            }
          });
          console.log(`🔄 Updated pending payment (credit → credit)`);
        }
      }

      return invoice;
    });

    return NextResponse.json({
      success: true,
      message: 'Invoice updated successfully',
      invoice: result
    });

  } catch (error) {
    console.error('Error updating invoice:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update invoice'
    }, { status: 500 });
  }
}

// DELETE - Delete invoice
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Invoice ID is required'
      }, { status: 400 });
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id: parseInt(id) },
      include: { shop: true }
    });

    if (!invoice) {
      return NextResponse.json({
        success: false,
        error: 'Invoice not found'
      }, { status: 404 });
    }

    await prisma.invoice.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({
      success: true,
      message: `Invoice ${invoice.invoiceNumber} deleted successfully`
    });

  } catch (error) {
    console.error('Error deleting invoice:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete invoice'
    }, { status: 500 });
  }
}