import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Force TypeScript to recognize the salesRep model
const prisma = new PrismaClient() as any;

// GET single sales rep by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: 'Sales Rep ID is required' }, { status: 400 });
    }

    const salesRep = await prisma.salesRep.findUnique({
      where: { id: parseInt(id) }
    });

    if (!salesRep) {
      return NextResponse.json({ error: 'Sales Rep not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, salesRep });
  } catch (error) {
    console.error('Error fetching sales rep:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PUT - Update specific sales rep
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, contactNumber, remark, status } = await req.json();
    
    if (!id) {
      return NextResponse.json({ error: 'Sales Rep ID is required' }, { status: 400 });
    }
    
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

// DELETE specific sales rep
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
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