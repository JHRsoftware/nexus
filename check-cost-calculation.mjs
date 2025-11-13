import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const prisma = new PrismaClient();

async function checkOrderItemCostCalculation() {
  try {
    console.log('🔍 Checking order item cost calculation...');
    
    // Get a sample order with items and their products
    const order = await prisma.order.findFirst({
      where: {
        status: 'Pending'
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                productCode: true,
                itemName: true,
                availableQty: true,
                totalCost: true
              }
            }
          }
        },
        shop: {
          select: {
            shopName: true
          }
        }
      }
    });

    if (!order) {
      console.log('❌ No pending orders found');
      return;
    }

    console.log('\n📦 Order Details:');
    console.log(`Order #${order.id} - ${order.shop.shopName}`);
    console.log(`Status: ${order.status}`);
    console.log(`Items count: ${order.orderItems.length}`);

    console.log('\n📊 Cost Calculation Comparison:');
    console.log('=====================================');

    order.orderItems.forEach((item, index) => {
      const product = item.product;
      
      // Old calculation (incorrect - total cost)
      const oldCostPrice = Number(product.totalCost || 0);
      
      // New calculation (correct - unit cost)
      const newCostPrice = product.availableQty > 0 
        ? Number((product.totalCost / product.availableQty).toFixed(2))
        : 0;
      
      // Total cost for this item with both methods
      const oldTotalItemCost = oldCostPrice * item.quantity;
      const newTotalItemCost = newCostPrice * item.quantity;
      
      console.log(`\nItem ${index + 1}: ${product.itemName} (${product.productCode})`);
      console.log(`  Quantity: ${item.quantity}`);
      console.log(`  Available Stock: ${product.availableQty}`);
      console.log(`  Total Stock Cost: LKR ${Number(product.totalCost).toLocaleString()}`);
      console.log(`  ❌ Old Cost Price (wrong): LKR ${oldCostPrice.toLocaleString()} per unit`);
      console.log(`  ✅ New Cost Price (correct): LKR ${newCostPrice.toLocaleString()} per unit`);
      console.log(`  ❌ Old Total Item Cost: LKR ${oldTotalItemCost.toLocaleString()}`);
      console.log(`  ✅ New Total Item Cost: LKR ${newTotalItemCost.toLocaleString()}`);
      console.log(`  💰 Selling Price: LKR ${Number(item.sellingPrice).toLocaleString()} per unit`);
      console.log(`  💰 Item Total Selling: LKR ${(Number(item.sellingPrice) * item.quantity).toLocaleString()}`);
      
      // Profit calculation
      const itemRevenue = Number(item.totalPrice);
      const oldProfit = itemRevenue - oldTotalItemCost;
      const newProfit = itemRevenue - newTotalItemCost;
      
      console.log(`  📈 Item Revenue: LKR ${itemRevenue.toLocaleString()}`);
      console.log(`  ❌ Old Profit Calculation: LKR ${oldProfit.toLocaleString()}`);
      console.log(`  ✅ New Profit Calculation: LKR ${newProfit.toLocaleString()}`);
      
      if (Math.abs(oldProfit - newProfit) > 0.01) {
        console.log(`  🚨 SIGNIFICANT DIFFERENCE: LKR ${Math.abs(oldProfit - newProfit).toLocaleString()}`);
      }
    });

    // Calculate order totals
    let oldOrderCost = 0;
    let newOrderCost = 0;
    let orderRevenue = 0;

    order.orderItems.forEach(item => {
      const product = item.product;
      const oldCostPrice = Number(product.totalCost || 0);
      const newCostPrice = product.availableQty > 0 
        ? Number((product.totalCost / product.availableQty).toFixed(2))
        : 0;
      
      oldOrderCost += oldCostPrice * item.quantity;
      newOrderCost += newCostPrice * item.quantity;
      orderRevenue += Number(item.totalPrice);
    });

    console.log('\n💼 Order Summary:');
    console.log('=================');
    console.log(`Total Revenue: LKR ${orderRevenue.toLocaleString()}`);
    console.log(`❌ Old Total Cost: LKR ${oldOrderCost.toLocaleString()}`);
    console.log(`✅ New Total Cost: LKR ${newOrderCost.toLocaleString()}`);
    console.log(`❌ Old Total Profit: LKR ${(orderRevenue - oldOrderCost).toLocaleString()}`);
    console.log(`✅ New Total Profit: LKR ${(orderRevenue - newOrderCost).toLocaleString()}`);
    
    const profitDifference = Math.abs((orderRevenue - oldOrderCost) - (orderRevenue - newOrderCost));
    console.log(`🔄 Profit Difference: LKR ${profitDifference.toLocaleString()}`);
    
    if (profitDifference > 0.01) {
      console.log(`🚨 COST CALCULATION WAS INCORRECT! Fixed difference: LKR ${profitDifference.toLocaleString()}`);
    } else {
      console.log(`✅ No significant difference in calculations`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkOrderItemCostCalculation();