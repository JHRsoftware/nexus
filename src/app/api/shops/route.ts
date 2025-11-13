import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch shops with search and pagination
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const activeOnly = searchParams.get('activeOnly') === 'true';
    
    const skip = (page - 1) * limit;
    
    // Build where clause for search
    const where: any = {};
    
    // Add active filter if requested
    if (activeOnly) {
      where.isActive = true;
    }
    
    // Add search conditions
    if (search) {
      where.OR = [
        { shopName: { contains: search } },
        { ownerName: { contains: search } },
        { contactNumber: { contains: search } },
        { email: { contains: search } },
        { businessRegisterNo: { contains: search } }
      ];
    }

    // Get shops with pagination
    const [shops, totalCount] = await Promise.all([
      prisma.shop.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.shop.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      shops,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching shops:', error);
    return NextResponse.json({ 
      error: 'Server error while fetching shops' 
    }, { status: 500 });
  }
}

// POST - Create new shop
export async function POST(req: NextRequest) {
  // Get user data from headers
  const userHeader = req.headers.get('x-user-data');
  
  let sessionUserName = 'Default User';
  
  if (userHeader) {
    try {
      const userData = JSON.parse(userHeader);
      sessionUserName = userData.name || userData.username || 'Unknown User';
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }

  try {
    const { 
      shopName, 
      ownerName, 
      address, 
      contactNumber, 
      email, 
      businessRegisterNo, 
      image, 
      creditLimit, 
      balanceAmount,
      isActive 
    } = await req.json();
    
    // Validate required fields
    if (!shopName || !ownerName || !address || !contactNumber) {
      return NextResponse.json({ 
        error: 'Shop name, owner name, address, and contact number are required' 
      }, { status: 400 });
    }

    // Validate credit limit
    const creditLimitValue = parseFloat(creditLimit) || 0;
    if (creditLimitValue < 0) {
      return NextResponse.json({ 
        error: 'Credit limit cannot be negative' 
      }, { status: 400 });
    }

    // Validate balance amount
    const balanceAmountValue = parseFloat(balanceAmount) || 0;
    // Balance can be negative (debt) so no negative check needed

    // Validate email format if provided
    if (email && email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return NextResponse.json({ 
          error: 'Invalid email format' 
        }, { status: 400 });
      }
    }

    // Check for duplicate shop name
    const duplicateShop = await prisma.shop.findFirst({
      where: { 
        shopName: shopName.trim(),
        isActive: true
      }
    });

    if (duplicateShop) {
      return NextResponse.json({ 
        error: 'Shop name already exists' 
      }, { status: 400 });
    }

    // Check for duplicate contact number
    const duplicateContact = await prisma.shop.findFirst({
      where: { 
        contactNumber: contactNumber.trim()
      }
    });

    if (duplicateContact) {
      return NextResponse.json({ 
        error: 'Contact number already exists' 
      }, { status: 400 });
    }

    // Check for duplicate email if provided
    if (email && email.trim()) {
      const duplicateEmail = await prisma.shop.findFirst({
        where: { 
          email: email.trim()
        }
      });

      if (duplicateEmail) {
        return NextResponse.json({ 
          error: 'Email already exists' 
        }, { status: 400 });
      }
    }

    // Check for duplicate business register number if provided
    if (businessRegisterNo && businessRegisterNo.trim()) {
      const duplicateRegister = await prisma.shop.findFirst({
        where: { 
          businessRegisterNo: businessRegisterNo.trim()
        }
      });

      if (duplicateRegister) {
        return NextResponse.json({ 
          error: 'Business register number already exists' 
        }, { status: 400 });
      }
    }

    // Create new shop
    const newShop = await prisma.shop.create({
      data: {
        shopName: shopName.trim(),
        ownerName: ownerName.trim(),
        address: address.trim(),
        contactNumber: contactNumber.trim(),
        email: email?.trim() || null,
        businessRegisterNo: businessRegisterNo?.trim() || null,
        image: image?.trim() || null,
        creditLimit: creditLimitValue,
        balanceAmount: balanceAmountValue,
        isActive: isActive !== undefined ? isActive : true,
        user: sessionUserName
      }
    });

    return NextResponse.json({ 
      success: true, 
      shop: newShop,
      message: 'Shop created successfully' 
    });

  } catch (error) {
    console.error('Error creating shop:', error);
    return NextResponse.json({ 
      error: 'Server error while creating shop' 
    }, { status: 500 });
  }
}

// PUT - Update shop
export async function PUT(req: NextRequest) {
  // Get user data from headers
  const userHeader = req.headers.get('x-user-data');
  
  let sessionUserName = 'Default User';
  
  if (userHeader) {
    try {
      const userData = JSON.parse(userHeader);
      sessionUserName = userData.name || userData.username || 'Unknown User';
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }

  try {
    const { 
      id, 
      shopName, 
      ownerName, 
      address, 
      contactNumber, 
      email, 
      businessRegisterNo, 
      image, 
      creditLimit, 
      isActive,
      balanceAmount 
    } = await req.json();
    
    if (!id || !shopName || !ownerName || !address || !contactNumber) {
      return NextResponse.json({ 
        error: 'All required fields must be provided' 
      }, { status: 400 });
    }

    // Validate credit limit
    const creditLimitValue = parseFloat(creditLimit) || 0;
    if (creditLimitValue < 0) {
      return NextResponse.json({ 
        error: 'Credit limit cannot be negative' 
      }, { status: 400 });
    }

    // Validate balance amount
    const balanceAmountValue = parseFloat(balanceAmount) || 0;

    // Validate email format if provided
    if (email && email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return NextResponse.json({ 
          error: 'Invalid email format' 
        }, { status: 400 });
      }
    }

    // Check if shop exists
    const existingShop = await prisma.shop.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingShop) {
      return NextResponse.json({ 
        error: 'Shop not found' 
      }, { status: 404 });
    }

    // Check for duplicate shop name (excluding current shop)
    const duplicateShop = await prisma.shop.findFirst({
      where: { 
        shopName: shopName.trim(),
        isActive: true,
        id: { not: parseInt(id) }
      }
    });

    if (duplicateShop) {
      return NextResponse.json({ 
        error: 'Shop name already exists' 
      }, { status: 400 });
    }

    // Check for duplicate contact number (excluding current shop)
    const duplicateContact = await prisma.shop.findFirst({
      where: { 
        contactNumber: contactNumber.trim(),
        id: { not: parseInt(id) }
      }
    });

    if (duplicateContact) {
      return NextResponse.json({ 
        error: 'Contact number already exists' 
      }, { status: 400 });
    }

    // Check for duplicate email if provided (excluding current shop)
    if (email && email.trim()) {
      const duplicateEmail = await prisma.shop.findFirst({
        where: { 
          email: email.trim(),
          id: { not: parseInt(id) }
        }
      });

      if (duplicateEmail) {
        return NextResponse.json({ 
          error: 'Email already exists' 
        }, { status: 400 });
      }
    }

    // Check for duplicate business register number if provided (excluding current shop)
    if (businessRegisterNo && businessRegisterNo.trim()) {
      const duplicateRegister = await prisma.shop.findFirst({
        where: { 
          businessRegisterNo: businessRegisterNo.trim(),
          id: { not: parseInt(id) }
        }
      });

      if (duplicateRegister) {
        return NextResponse.json({ 
          error: 'Business register number already exists' 
        }, { status: 400 });
      }
    }

    // Update shop
    const updatedShop = await prisma.shop.update({
      where: { id: parseInt(id) },
      data: {
        shopName: shopName.trim(),
        ownerName: ownerName.trim(),
        address: address.trim(),
        contactNumber: contactNumber.trim(),
        email: email?.trim() || null,
        businessRegisterNo: businessRegisterNo?.trim() || null,
        image: image?.trim() || null,
        creditLimit: creditLimitValue,
        balanceAmount: balanceAmountValue,
        isActive: isActive !== undefined ? isActive : true,
        user: sessionUserName
      }
    });

    return NextResponse.json({ 
      success: true, 
      shop: updatedShop,
      message: 'Shop updated successfully' 
    });

  } catch (error) {
    console.error('Error updating shop:', error);
    return NextResponse.json({ 
      error: 'Server error while updating shop' 
    }, { status: 500 });
  }
}

// DELETE - Handle both toggle active/inactive and permanent delete
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const action = searchParams.get('action'); // 'toggle' or 'permanent'
    
    if (!id) {
      return NextResponse.json({ 
        error: 'Shop ID is required' 
      }, { status: 400 });
    }

    // Check if shop exists
    const existingShop = await prisma.shop.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingShop) {
      return NextResponse.json({ 
        error: 'Shop not found' 
      }, { status: 404 });
    }

    if (action === 'permanent') {
      // Permanent delete - remove from database completely
      await prisma.shop.delete({
        where: { id: parseInt(id) }
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Shop permanently deleted successfully'
      });
    } else {
      // Toggle active/inactive status (soft delete/restore)
      const newStatus = !existingShop.isActive;
      
      const updatedShop = await prisma.shop.update({
        where: { id: parseInt(id) },
        data: { 
          isActive: newStatus,
          updatedAt: new Date()
        }
      });

      return NextResponse.json({ 
        success: true, 
        message: `Shop ${newStatus ? 'activated' : 'deactivated'} successfully`,
        shop: updatedShop 
      });
    }

  } catch (error) {
    console.error('Error processing shop action:', error);
    return NextResponse.json({ 
      error: 'Server error while processing shop action' 
    }, { status: 500 });
  }
}