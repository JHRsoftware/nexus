import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma client
const prisma = new PrismaClient();

// Type assertion for settings (workaround for VS Code TypeScript cache issue)
const settings = (prisma as any).settings;

// Settings interface matching frontend
interface SettingsData {
  companyName: string;
  companyAddress: string;
  companyContactNumber: string;
  companyBusinessRegNo: string;
  companyDescription: string;
  companyLogo?: string;
  invoiceWatermark: string;
  invoiceTermsAndConditions: string;
  invoiceFooter: string;
  invoiceDeveloperNote: string;
  defaultCreditLimit: number;
  totalBalanceDiscountPercent: number;
  showTotalBalanceDiscount: boolean;
  dueDateOptions: {
    label: string;
    days: number;
    isDefault: boolean;
  }[];
  isSellingPriceReadonly: boolean;
  isDiscountReadonly: boolean;
  showTotalDiscountFromItems: boolean;
  hideCostProfit: boolean;
  hideSellingPrice: boolean;
  hideDiscount: boolean;
  hideFreeProducts: boolean;
  hideCashDiscount: boolean;
}

// GET - Retrieve settings
export async function GET(request: NextRequest) {
  try {
    // Get user data from headers
    const userDataHeader = request.headers.get('x-user-data');
    let userData = null;
    
    if (userDataHeader) {
      try {
        userData = JSON.parse(userDataHeader);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    // Check if user has permission (you can customize this logic)
    if (!userData || !userData.id) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    // Try to get existing settings
    const existingSettings = await settings.findFirst({
      orderBy: {
        id: 'desc' // Get the latest settings
      }
    });

    if (existingSettings) {
      // Parse JSON fields
      const dueDateOptions = existingSettings.dueDateOptions ? 
        JSON.parse(existingSettings.dueDateOptions as string) : 
        [
          { label: '1 Month', days: 30, isDefault: false },
          { label: '45 Days', days: 45, isDefault: false },
          { label: '2 Months', days: 60, isDefault: false },
          { label: '75 Days', days: 75, isDefault: false },
          { label: '3 Months', days: 90, isDefault: true },
        ];

      const settings: SettingsData = {
        companyName: existingSettings.companyName || '',
        companyAddress: existingSettings.companyAddress || '',
        companyContactNumber: existingSettings.companyContactNumber || '',
        companyBusinessRegNo: existingSettings.companyBusinessRegNo || '',
        companyDescription: existingSettings.companyDescription || '',
        companyLogo: existingSettings.companyLogo || '',
        invoiceWatermark: existingSettings.invoiceWatermark || '',
        invoiceTermsAndConditions: existingSettings.invoiceTermsAndConditions || '',
        invoiceFooter: existingSettings.invoiceFooter || '',
        invoiceDeveloperNote: existingSettings.invoiceDeveloperNote || '',
        defaultCreditLimit: Number(existingSettings.defaultCreditLimit) || 100000,
        totalBalanceDiscountPercent: Number(existingSettings.totalBalanceDiscountPercent) || 5,
        showTotalBalanceDiscount: existingSettings.showTotalBalanceDiscount ?? false,
        dueDateOptions: dueDateOptions,
        isSellingPriceReadonly: existingSettings.isSellingPriceReadonly ?? false,
        isDiscountReadonly: existingSettings.isDiscountReadonly ?? false,
        showTotalDiscountFromItems: existingSettings.showTotalDiscountFromItems ?? true,
        hideCostProfit: existingSettings.hideCostProfit ?? false,
        hideSellingPrice: existingSettings.hideSellingPrice ?? false,
        hideDiscount: existingSettings.hideDiscount ?? false,
        hideFreeProducts: existingSettings.hideFreeProducts ?? false,
        hideCashDiscount: existingSettings.hideCashDiscount ?? false
      };

      return NextResponse.json({
        success: true,
        settings: settings
      });
    } else {
      // Return default settings if none exist
      const defaultSettings: SettingsData = {
        companyName: '',
        companyAddress: '',
        companyContactNumber: '',
        companyBusinessRegNo: '',
        companyDescription: '',
        companyLogo: '',
        invoiceWatermark: '',
        invoiceTermsAndConditions: '',
        invoiceFooter: '',
        invoiceDeveloperNote: '',
        defaultCreditLimit: 100000,
        totalBalanceDiscountPercent: 5,
        showTotalBalanceDiscount: false,
        dueDateOptions: [
          { label: '1 Month', days: 30, isDefault: false },
          { label: '45 Days', days: 45, isDefault: false },
          { label: '2 Months', days: 60, isDefault: false },
          { label: '75 Days', days: 75, isDefault: false },
          { label: '3 Months', days: 90, isDefault: true },
        ],
        isSellingPriceReadonly: false,
        isDiscountReadonly: false,
        showTotalDiscountFromItems: true,
        hideCostProfit: false,
        hideSellingPrice: false,
        hideDiscount: false,
        hideFreeProducts: false,
        hideCashDiscount: false
      };

      return NextResponse.json({
        success: true,
        settings: defaultSettings
      });
    }

  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch settings'
    }, { status: 500 });
  }
}

// POST - Save settings
export async function POST(request: NextRequest) {
  try {
    // Get user data from headers
    const userDataHeader = request.headers.get('x-user-data');
    let userData = null;
    
    if (userDataHeader) {
      try {
        userData = JSON.parse(userDataHeader);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    // Check if user has permission
    if (!userData || !userData.id) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    // Parse request body
    const settingsData: SettingsData = await request.json();

    // Validate required fields
    if (!settingsData.companyName || !settingsData.companyAddress || !settingsData.companyContactNumber) {
      return NextResponse.json({
        success: false,
        error: 'Company name, address, and contact number are required'
      }, { status: 400 });
    }

    // Validate due date options
    if (!settingsData.dueDateOptions || settingsData.dueDateOptions.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'At least one due date option is required'
      }, { status: 400 });
    }

    // Ensure at least one default due date option
    const hasDefault = settingsData.dueDateOptions.some(option => option.isDefault);
    if (!hasDefault && settingsData.dueDateOptions.length > 0) {
      settingsData.dueDateOptions[0].isDefault = true;
    }

    // Prepare data for database
    const dbData = {
      companyName: settingsData.companyName.trim(),
      companyAddress: settingsData.companyAddress.trim(),
      companyContactNumber: settingsData.companyContactNumber.trim(),
      companyBusinessRegNo: settingsData.companyBusinessRegNo?.trim() || null,
      companyDescription: settingsData.companyDescription?.trim() || null,
      companyLogo: settingsData.companyLogo || null,
      invoiceWatermark: settingsData.invoiceWatermark?.trim() || null,
      invoiceTermsAndConditions: settingsData.invoiceTermsAndConditions?.trim() || null,
      invoiceFooter: settingsData.invoiceFooter?.trim() || null,
      invoiceDeveloperNote: settingsData.invoiceDeveloperNote?.trim() || null,
      defaultCreditLimit: settingsData.defaultCreditLimit || 100000,
      totalBalanceDiscountPercent: settingsData.totalBalanceDiscountPercent || 0,
      showTotalBalanceDiscount: settingsData.showTotalBalanceDiscount || false,
      dueDateOptions: JSON.stringify(settingsData.dueDateOptions),
      isSellingPriceReadonly: settingsData.isSellingPriceReadonly ?? false,
      isDiscountReadonly: settingsData.isDiscountReadonly ?? false,
      showTotalDiscountFromItems: settingsData.showTotalDiscountFromItems ?? true,
      hideCostProfit: settingsData.hideCostProfit ?? false,
      hideSellingPrice: settingsData.hideSellingPrice ?? false,
      hideDiscount: settingsData.hideDiscount ?? false,
      hideFreeProducts: settingsData.hideFreeProducts ?? false,
      hideCashDiscount: settingsData.hideCashDiscount ?? false,
      updatedBy: userData.id,
      updatedAt: new Date()
    };

    // Check if settings already exist
    const existingSettings = await settings.findFirst({
      orderBy: {
        id: 'desc'
      }
    });

    let savedSettings;

    if (existingSettings) {
      // Update existing settings
      savedSettings = await settings.update({
        where: {
          id: existingSettings.id
        },
        data: dbData
      });
    } else {
      // Create new settings
      savedSettings = await settings.create({
        data: {
          ...dbData,
          createdBy: userData.id,
          createdAt: new Date()
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Settings saved successfully',
      settingsId: savedSettings.id
    });

  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to save settings'
    }, { status: 500 });
  }
}

// PUT - Update specific setting (optional endpoint for partial updates)
export async function PUT(request: NextRequest) {
  try {
    const userDataHeader = request.headers.get('x-user-data');
    let userData = null;
    
    if (userDataHeader) {
      try {
        userData = JSON.parse(userDataHeader);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    if (!userData || !userData.id) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    const { field, value } = await request.json();

    if (!field) {
      return NextResponse.json({
        success: false,
        error: 'Field name is required'
      }, { status: 400 });
    }

    const existingSettings = await settings.findFirst({
      orderBy: {
        id: 'desc'
      }
    });

    if (!existingSettings) {
      return NextResponse.json({
        success: false,
        error: 'No settings found to update'
      }, { status: 404 });
    }

    const updateData: any = {
      [field]: value,
      updatedBy: userData.id,
      updatedAt: new Date()
    };

    const updatedSettings = await settings.update({
      where: {
        id: existingSettings.id
      },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      message: 'Setting updated successfully',
      settingsId: updatedSettings.id
    });

  } catch (error) {
    console.error('Error updating setting:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update setting'
    }, { status: 500 });
  }
}