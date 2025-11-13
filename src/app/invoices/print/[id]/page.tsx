'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import './print-global.css';

// Company Settings Interface
interface CompanySettings {
  companyName: string;
  companyAddress: string;
  companyContactNumber: string;
  companyBusinessRegNo: string;
  companyDescription: string;
  companyLogo?: string;
  totalBalanceDiscountPercent?: number;
}

interface InvoiceItem {
  id: string;
  productId: number;
  productCode: string;
  productName: string;
  quantity: number;
  sellingPrice: number;
  discount: number;
  price: number;
  totalPrice: number;
  costPrice?: number;
}

interface Shop {
  id: number;
  shopName: string;
  ownerName: string;
  contactNumber: string;
  address?: string;
}

interface SalesRep {
  id: number;
  name: string;
  contactNumber: string;
}

interface Discount {
  id: number;
  discountName: string;
  percentage: number;
}

interface Invoice {
  id: number;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate?: string;
  shop: Shop;
  salesRep?: SalesRep;
  discount?: Discount;
  invoiceType?: string;
  invoiceTypePercentage?: number;
  cashDiscountEnabled: boolean;
  cashDiscountPercentage?: number;
  notes?: string;
  subTotal: number;
  discountAmount: number;
  netTotal: number;
  invoiceItems: InvoiceItem[];
}

const InvoicePrintTemplate: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const invoiceId = params?.id as string;
  const { user } = useAuth();
  
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [companySettings, setCompanySettings] = useState<CompanySettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Get user headers for API requests
  const getUserHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'x-user-data': JSON.stringify(user || {})
    };
  };

  // Fetch invoice data
  useEffect(() => {
    const fetchInvoice = async () => {
      if (!invoiceId) return;
      
      setIsLoading(true);
      try {
        const response = await fetch(`/api/invoices/${invoiceId}`, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        const data = await response.json();
        
        if (data.success && data.invoice) {
          console.log('📋 Invoice Data:', data.invoice);
          setInvoice(data.invoice);
        } else {
          setError('Invoice not found');
        }
      } catch (error) {
        console.error('Error fetching invoice:', error);
        setError('Failed to load invoice');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceId]);

  // Fetch company settings
  useEffect(() => {
    const fetchCompanySettings = async () => {
      try {
        const response = await fetch('/api/softwareSettings', {
          headers: getUserHeaders()
        });
        
        const data = await response.json();
        console.log('🏢 Company Settings API Response:', data);
        
        if (data.success && data.settings) {
          const settings = {
            companyName: data.settings.companyName || '',
            companyAddress: data.settings.companyAddress || '',
            companyContactNumber: data.settings.companyContactNumber || '',
            companyBusinessRegNo: data.settings.companyBusinessRegNo || '',
            companyDescription: data.settings.companyDescription || '',
            companyLogo: data.settings.companyLogo || '',
            totalBalanceDiscountPercent: data.settings.totalBalanceDiscountPercent || 0
          };
          console.log('🏢 Setting company settings:', settings);
          setCompanySettings(settings);
        } else {
          console.log('❌ API response not successful or no settings:', data);
        }
      } catch (error) {
        console.error('❌ Error fetching company settings:', error);
        // Set default company info if API fails
        setCompanySettings({
          companyName: 'API Error - Company Name',
          companyAddress: 'API Error - Company Address',
          companyContactNumber: 'API Error - Contact Number',
          companyBusinessRegNo: '',
          companyDescription: '',
          companyLogo: '',
          totalBalanceDiscountPercent: 0
        });
      }
    };

    if (user) {
      fetchCompanySettings();
    }
  }, [user]);

  // Print function with clean settings
  const handlePrint = () => {
    // Hide browser UI elements before printing
    document.title = ''; // Clear page title
    
    // Trigger print with a slight delay to ensure styles are applied
    setTimeout(() => {
      window.print();
    }, 100);
  };

  // Go back function
  const handleGoBack = () => {
    router.back();
  };

  // Use stored totals from database to ensure accuracy
  const calculateTotals = () => {
    if (!invoice) return { 
      subTotal: 0, 
      creditDiscount: 0,
      discountAmount: 0, 
      totalDiscountFromItems: 0,
      netBeforeCashDiscount: 0,
      cashDiscount: 0, 
      cashDiscountPercent: 0,
      netTotal: 0, 
      totalItems: 0 
    };
    
    // Use the stored values from the database which are already calculated correctly
    const subTotal = Number(invoice.subTotal || 0);
    const storedDiscountAmount = Number(invoice.discountAmount || 0);
    const netTotal = Number(invoice.netTotal || 0);
    
    // Calculate item-level discount total
    const totalDiscountFromItems = Number(
      invoice.invoiceItems.reduce((sum, item) => sum + Number(item.discount || 0), 0).toFixed(2)
    );
    
    // Credit discount calculation - check multiple sources for percentage
    let creditDiscountPercent = 0;
    if (invoice.discount && invoice.discount.percentage) {
      creditDiscountPercent = invoice.discount.percentage;
    } else if (invoice.invoiceTypePercentage) {
      creditDiscountPercent = invoice.invoiceTypePercentage;
    }
    
    // Calculate actual discount amount from percentage if discount exists
    let actualDiscountAmount = 0;
    if (creditDiscountPercent > 0) {
      actualDiscountAmount = Number(((subTotal * creditDiscountPercent) / 100).toFixed(2));
    }
    
    // Prefer stored amount, but use calculated if stored is 0 and we have a percentage
    const discountAmount = storedDiscountAmount > 0 ? storedDiscountAmount : actualDiscountAmount;
    
    // Debug logging
    console.log('🧮 Print Totals Debug:', {
      subTotal,
      storedDiscountAmount,
      actualDiscountAmount,
      finalDiscountAmount: discountAmount,
      creditDiscountPercent,
      hasDiscount: !!invoice.discount,
      invoiceTypePercentage: invoice.invoiceTypePercentage,
      cashDiscountEnabled: invoice.cashDiscountEnabled,
      cashDiscountFromSettings: companySettings?.totalBalanceDiscountPercent,
      allInvoiceFields: Object.keys(invoice)
    });
    
    // Net amount after credit discount but before cash discount
    const netBeforeCashDiscount = subTotal - discountAmount;
    
    // Calculate cash discount from the difference (if cash discount is enabled)
    let cashDiscountPercent = 0;
    let cashDiscount = 0;
    
    if (invoice.cashDiscountEnabled) {
      // Use stored cash discount percentage if available, otherwise fall back to settings
      cashDiscountPercent = invoice.cashDiscountPercentage || companySettings?.totalBalanceDiscountPercent || 0;
      
      // Calculate actual cash discount amount that was applied
      cashDiscount = Math.max(0, netBeforeCashDiscount - netTotal);
      
      console.log('💰 Cash Discount Debug:', {
        enabled: invoice.cashDiscountEnabled,
        storedPercentage: invoice.cashDiscountPercentage,
        settingsPercentage: companySettings?.totalBalanceDiscountPercent,
        effectivePercentage: cashDiscountPercent,
        netBeforeCashDiscount,
        netTotal,
        calculatedCashDiscount: cashDiscount
      });
    }
    
    // Calculate total items quantity
    const totalItems = Number(invoice.invoiceItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0));
    
    return { 
      subTotal: Number(subTotal.toFixed(2)), 
      creditDiscount: Number(discountAmount.toFixed(2)), // Use calculated discount amount
      creditDiscountPercent: Number(creditDiscountPercent),
      discountAmount: Number(discountAmount.toFixed(2)), 
      totalDiscountFromItems: Number(totalDiscountFromItems),
      netBeforeCashDiscount: Number(netBeforeCashDiscount.toFixed(2)),
      cashDiscount: Number(cashDiscount.toFixed(2)),
      cashDiscountPercent: Number(cashDiscountPercent),
      netTotal: Number(netTotal.toFixed(2)), 
      totalItems: Number(totalItems)
    };
  };

  const totals = calculateTotals();

  if (isLoading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading invoice...</p>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="error">
        <h2>Error</h2>
        <p>{error || 'Invoice not found'}</p>
        <button onClick={handleGoBack} className="back-button">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="print-container">
      {/* Print Controls - Hidden in print */}
      <div className="print-controls">
        <button onClick={handleGoBack} className="back-button">
          ← Back to Invoices
        </button>
        <button onClick={handlePrint} className="print-button">
          🖨️ Print Invoice
        </button>
      </div>

      {/* Invoice Template */}
      <div className="invoice">
        {/* Company Header */}
        <div className="header">
          <div className="company-info">
            {companySettings?.companyLogo && companySettings.companyLogo.trim() !== '' && (
              <div className="company-logo">
                <img 
                  src={companySettings.companyLogo} 
                  alt="Company Logo" 
                  className="logo-image"
                  onError={(e) => {
                    // Hide logo if image fails to load
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
            <h1 className="company-name">
              {companySettings?.companyName && companySettings.companyName.trim() !== '' 
                ? companySettings.companyName 
                : 'Company Name Not Set'}
            </h1>
            <p className="company-address">
              {companySettings?.companyAddress && companySettings.companyAddress.trim() !== '' ? (
                <>
                  {companySettings.companyAddress.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      {index < companySettings.companyAddress.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                  <br />
                  Phone: {companySettings.companyContactNumber || 'Contact Number Not Set'}
                  {companySettings.companyBusinessRegNo && companySettings.companyBusinessRegNo.trim() !== '' && (
                    <>
                      <br />
                      Business Reg: {companySettings.companyBusinessRegNo}
                    </>
                  )}
                </>
              ) : (
                <>
                  Company Address Not Set<br />
                  Please update in Settings<br />
                  Phone: Contact Number Not Set<br />
                </>
              )}
            </p>
          </div>
          <div className="invoice-header">
            <h2 className="invoice-title">INVOICE</h2>
            <div className="invoice-info">
              <p><strong>Invoice #:</strong> {invoice.invoiceNumber}</p>
              <p><strong>Date:</strong> {new Date(invoice.invoiceDate).toLocaleDateString('en-GB')}</p>
              {invoice.dueDate && (
                <p><strong>Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString('en-GB')}</p>
              )}
              {invoice.discount && (
                <p><strong>Invoice Type:</strong> {invoice.discount.discountName} ({invoice.discount.percentage}% discount)</p>
              )}
              {invoice.dueDate && (
                <p><strong>Payment Terms:</strong> Net {Math.ceil((new Date(invoice.dueDate).getTime() - new Date(invoice.invoiceDate).getTime()) / (1000 * 60 * 60 * 24))} days</p>
              )}
            </div>
          </div>
        </div>

        {/* Billing Information */}
        <div className="billing-info">
          <div className="bill-to">
            <h3>Bill To:</h3>
            <div className="customer-info">
              <p><strong>{invoice.shop.shopName}</strong></p>
              <p>{invoice.shop.ownerName}</p>
              <p>Phone: {invoice.shop.contactNumber}</p>
              {invoice.shop.address && <p>{invoice.shop.address}</p>}
            </div>
          </div>
          
          {invoice.salesRep && (
            <div className="sales-rep">
              <h3>Sales Representative:</h3>
              <p><strong>{invoice.salesRep.name}</strong></p>
              <p>Phone: {invoice.salesRep.contactNumber}</p>
            </div>
          )}
        </div>

        {/* Items Table */}
        <div className="items-section">
          <table className="items-table">
            <thead>
              <tr>
                <th>Item Code</th>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Discount</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.invoiceItems.map((item, index) => (
                <tr key={item.id || index}>
                  <td>{item.productCode}</td>
                  <td>{item.productName}</td>
                  <td className="center">{item.quantity}</td>
                  <td className="right">LKR {item.sellingPrice.toLocaleString()}</td>
                  <td className="right">LKR {item.discount.toLocaleString()}</td>
                  <td className="right">LKR {item.totalPrice.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="totals-section">
          <div className="totals-grid">
            
            {/* Sub Total - Credit Discount */}
            <div className="total-row">
              <span>Sub Total - Credit Discount ({invoice.discount ? totals.creditDiscountPercent : 0}%):</span>
              <span>LKR {totals.subTotal.toLocaleString()}</span>
            </div>
            
            {/* Discount Amount */}
            <div className="total-row">
              <span>Discount Amount ({invoice.discount ? totals.creditDiscountPercent : 0}%):</span>
              <span>
                {totals.discountAmount > 0 
                  ? `- LKR ${totals.discountAmount.toLocaleString()}` 
                  : '- LKR 0'}
              </span>
            </div>
            
            {/* Total Discount from Items */}
            <div className="total-row">
              <span>Total Discount from Items:</span>
              <span>LKR {totals.totalDiscountFromItems.toLocaleString()}</span>
            </div>
            
            {/* Cash Discount */}
            <div className="total-row">
              <span>Cash Discount ({totals.cashDiscountPercent}%):</span>
              <span>
                {totals.cashDiscount > 0 
                  ? `- LKR ${totals.cashDiscount.toLocaleString()}` 
                  : 'LKR 0'}
              </span>
            </div>
            
            {/* Net Total */}
            <div className="total-row net-total">
              <span>Net Total:</span>
              <span>LKR {totals.netTotal.toLocaleString()}</span>
            </div>
            
          </div>
        </div>

        {/* Notes Section */}
        {invoice.notes && (
          <div className="notes-section">
            <h3>Notes:</h3>
            <p>{invoice.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="footer">
          <div className="thank-you">
            <h3>Thank you for your business!</h3>
          </div>
          {companySettings?.companyDescription && companySettings.companyDescription.trim() !== '' && (
            <div className="company-description">
              <p>{companySettings.companyDescription}</p>
            </div>
          )}
        </div>

        {/* Print Timestamp */}
        <div className="print-info">
          <p>Printed on: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePrintTemplate;