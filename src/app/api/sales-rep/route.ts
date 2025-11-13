import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Force TypeScript to recognize the salesRep model
const prisma = new PrismaClient() as any;

// GET all sales reps
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const activeOnly = searchParams.get('activeOnly') === 'true';

    let whereClause: any = {};

    // Filter by active status if requested
    if (activeOnly) {
      whereClause.status = 'active';
    }

    // Add search functionality
    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { contactNumber: { contains: search } }
      ];
    }

    const salesReps = await prisma.salesRep.findMany({
      where: whereClause,
      orderBy: {
        name: 'asc'  // Order by name for better UX in dropdown
      }
    });

    return NextResponse.json({ success: true, salesReps });
  } catch (error) {
    console.error('Error fetching sales reps:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST - Create new sales rep
export async function POST(req: NextRequest) {
  // Get user information from request headers
  const userHeader = req.headers.get('x-user-data');
  let sessionUserName = 'Unknown User'; // fallback if no user is logged in
  
  console.log('User header received:', userHeader); // Debug log
  
  if (userHeader) {
    try {
      const userData = JSON.parse(userHeader);
      console.log('Parsed user data:', userData); // Debug log
      
      // Use the actual logged-in user's name
      sessionUserName = userData.name || userData.username || 'Unknown User';
      console.log('✅ Using logged-in user:', sessionUserName); // Debug log
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  } else {
    console.log('❌ No user logged in, using fallback'); // Debug log
  }

  try {
    const { name, contactNumber, remark, status } = await req.json();
    
    // Validation
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Sales Rep name is required' }, { status: 400 });
    }
    
    if (!contactNumber || typeof contactNumber !== 'string' || !contactNumber.trim()) {
      return NextResponse.json({ error: 'Contact number is required' }, { status: 400 });
    }
    
    // Basic phone number validation
    const phoneRegex = /^[\+]?[0-9\-\(\)\s]+$/;
    if (!phoneRegex.test(contactNumber)) {
      return NextResponse.json({ error: 'Please enter a valid contact number' }, { status: 400 });
    }
    
    if (!status || !['active', 'deactive'].includes(status)) {
      return NextResponse.json({ error: 'Status must be either active or deactive' }, { status: 400 });
    }

    // Check if contact number already exists
    const existingRep = await prisma.salesRep.findFirst({
      where: { contactNumber: contactNumber.trim() }
    });
    
    if (existingRep) {
      return NextResponse.json({ error: 'Contact number already exists' }, { status: 400 });
    }

    // Create new sales rep
    const newSalesRep = await prisma.salesRep.create({
      data: {
        name: name.trim(),
        contactNumber: contactNumber.trim(),
        remark: remark ? remark.trim() : '',
        status,
        user: sessionUserName,
        createdAt: new Date()
      },
    });

    return NextResponse.json({ success: true, salesRep: newSalesRep });
  } catch (error) {
    console.error('Error creating sales rep:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PUT - Update sales rep
export async function PUT(req: NextRequest) {
  try {
    const { id, name, contactNumber, remark, status } = await req.json();
    
    // Validation
    if (!id) {
      return NextResponse.json({ error: 'Sales Rep ID is required' }, { status: 400 });
    }
    
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Sales Rep name is required' }, { status: 400 });
    }
    
    if (!contactNumber || typeof contactNumber !== 'string' || !contactNumber.trim()) {
      return NextResponse.json({ error: 'Contact number is required' }, { status: 400 });
    }
    
    // Basic phone number validation
    const phoneRegex = /^[\+]?[0-9\-\(\)\s]+$/;
    if (!phoneRegex.test(contactNumber)) {
      return NextResponse.json({ error: 'Please enter a valid contact number' }, { status: 400 });
    }
    
    if (!status || !['active', 'deactive'].includes(status)) {
      return NextResponse.json({ error: 'Status must be either active or deactive' }, { status: 400 });
    }

    // Check if contact number already exists for different sales rep
    const existingRep = await prisma.salesRep.findFirst({
      where: { 
        contactNumber: contactNumber.trim(),
        id: { not: parseInt(id) }
      }
    });
    
    if (existingRep) {
      return NextResponse.json({ error: 'Contact number already exists' }, { status: 400 });
    }

    const updatedSalesRep = await prisma.salesRep.update({
      where: { id: parseInt(id) },
      data: {
        name: name.trim(),
        contactNumber: contactNumber.trim(),
        remark: remark ? remark.trim() : '',
        status,
      },
    });

    return NextResponse.json({ success: true, salesRep: updatedSalesRep });
  } catch (error) {
    console.error('Error updating sales rep:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE - Delete sales rep
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Sales Rep ID is required' }, { status: 400 });
    }

    await prisma.salesRep.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true, message: 'Sales Rep deleted successfully' });
  } catch (error) {
    console.error('Error deleting sales rep:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}