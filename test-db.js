// Simple database connection test
import { PrismaClient } from '@prisma/client';

async function testConnection() {
  console.log('Testing database connection...');
  console.log('DATABASE_URL length:', process.env.DATABASE_URL?.length || 0);
  
  try {
    const prisma = new PrismaClient();
    
    console.log('Connecting to database...');
    await prisma.$connect();
    
    console.log('Testing query...');
    const userCount = await prisma.user.count();
    
    console.log('✅ Database connection successful!');
    console.log('User count:', userCount);
    
    await prisma.$disconnect();
    
    return { success: true, userCount };
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error);
    return { success: false, error: error.message };
  }
}

// Load environment variables for ES modules
import { config } from 'dotenv';
config({ path: '.env.local' });

// Run the test
testConnection();