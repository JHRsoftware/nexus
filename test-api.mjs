// Test the orders API endpoint
async function testAPI() {
  try {
    console.log('🔄 Testing orders API endpoint...');
    
    // Test with lowercase 'pending'
    const response = await fetch('http://localhost:3000/api/orders/search?status=pending&limit=5');
    
    if (!response.ok) {
      console.log(`❌ HTTP Error: ${response.status} ${response.statusText}`);
      return;
    }
    
    const data = await response.json();
    console.log('✅ API Response:', JSON.stringify(data, null, 2));
    
    if (data.success && data.orders) {
      console.log(`📊 Found ${data.orders.length} pending orders`);
      data.orders.forEach(order => {
        console.log(`   • ${order.orderNumber} - ${order.shop.shopName} - Status: "${order.status}"`);
      });
    } else {
      console.log('❌ API returned error or no orders');
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

testAPI();