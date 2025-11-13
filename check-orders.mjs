import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const prisma = new PrismaClient();

async function checkOrderStatuses() {
  try {
    console.log('🔍 Checking all order statuses in database...');
    
    // Get all unique status values
    const statusResults = await prisma.order.findMany({
      select: {
        status: true,
        id: true,
        orderNumber: true,
        orderDate: true,
        shop: {
          select: {
            shopName: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    if (statusResults.length === 0) {
      console.log('❌ No orders found in database');
      return;
    }
    
    // Group by status
    const statusGroups = {};
    statusResults.forEach(order => {
      if (!statusGroups[order.status]) {
        statusGroups[order.status] = [];
      }
      statusGroups[order.status].push(order);
    });
    
    console.log('\n📊 Order Status Summary:');
    console.log('========================');
    
    Object.entries(statusGroups).forEach(([status, orders]) => {
      console.log(`\n📋 Status: "${status}" (${orders.length} orders)`);
      orders.slice(0, 3).forEach(order => { // Show first 3 orders for each status
        console.log(`   • Order #${order.orderNumber} - ${order.shop.shopName} - ${order.orderDate.toLocaleDateString()}`);
      });
      if (orders.length > 3) {
        console.log(`   ... and ${orders.length - 3} more`);
      }
    });
    
    console.log('\n🎯 Status values found:', Object.keys(statusGroups));
    
    // Test search with different status values (exact match)
    console.log('\n🧪 Testing search with different status values (exact match):');
    
    const testStatuses = ['pending', 'Pending', 'PENDING', 'draft', 'Draft', 'DRAFT'];
    
    for (const testStatus of testStatuses) {
      const results = await prisma.order.findMany({
        where: { status: testStatus },
        select: { id: true, status: true }
      });
      console.log(`   "${testStatus}": ${results.length} orders found`);
    }

    // Test case-insensitive search
    console.log('\n🔍 Testing case-insensitive search:');
    for (const testStatus of testStatuses) {
      const results = await prisma.order.findMany({
        where: { 
          status: {
            contains: testStatus,
            mode: 'insensitive'
          }
        },
        select: { id: true, status: true }
      });
      console.log(`   "${testStatus}" (case-insensitive): ${results.length} orders found`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkOrderStatuses();
