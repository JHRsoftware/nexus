'use client';

import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { usePageProtection } from '@/components/ProtectedRoute';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { handleNumberInputWheel } from '@/lib/numberInputUtils';
import styles from './edit-invoice.module.css';

interface Shop {
  id: number;
  shopName: string;
  ownerName: string;
  contactNumber: string;
  creditLimit: number;
  balanceAmount: number;
}

interface Discount {
  id: number;
  discountName: string;
  percentage: number;
}

interface Product {
  id: number;
  productCode: string;
  itemName: string;
  sellingPrice: number;
  availableQty: number;
  category: string;
  costPrice?: number;
}

interface SalesRep {
  id: number;
  name: string;
  contactNumber: string;
  status: string;
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
  availableQty: number;
  costPrice: number;
  itemCost?: number;
  itemProfit?: number;
}

interface Invoice {
  id: number;
  invoiceNumber: string;
  invoiceDate: string;
  shop: Shop;
  salesRep?: SalesRep;
  discount?: Discount;
  subTotal: number;
  totalDiscount: number;
  cashDiscount: number;
  cashDiscountEnabled: boolean;
  cashDiscountPercentage?: number;
  netTotal: number;
  totalCost?: number;
  totalProfit?: number;
  notes?: string;
  invoiceItems: any[];
}

interface PendingPayment {
  id: number;
  invoiceId: number;
  shopId: number;
  netTotal: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: string;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

interface OverduePayment {
  id: number;
  invoiceNumber: string;
  dueDate: string;
  remainingAmount: number;
  daysPastDue: number;
}

interface InvoiceSearchResult {
  id: number;
  invoiceNumber: string;
  invoiceDate: string;
  shopName: string;
  ownerName: string;
  netTotal: number;
}

const EditInvoicePage: React.FC = () => {
  // URL search parameters and navigation
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Page protection
  const { isAuthorized, isLoading: authLoading } = usePageProtection('invoices-edit');
  const { user, isLoading, hasAccess } = useAuth();

  // Invoice settings state
  const [invoiceSettings, setInvoiceSettings] = useState({
    isSellingPriceReadonly: false,
    isDiscountReadonly: false,
    showTotalDiscountFromItems: true,
    showTotalBalanceDiscount: false,
    totalBalanceDiscountPercent: 5,
    hideCostProfit: false
  });

  // Date formatting functions
  const formatDateForDisplay = (isoDate: string) => {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateForInput = (displayDate: string) => {
    const [day, month, year] = displayDate.split('/');
    if (!day || !month || !year) return '';
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  // Form state
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [invoiceDateDisplay, setInvoiceDateDisplay] = useState(formatDateForDisplay(new Date().toISOString().split('T')[0]));
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [selectedSalesRep, setSelectedSalesRep] = useState<SalesRep | null>(null);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);
  const [cashDiscountEnabled, setCashDiscountEnabled] = useState(false);
  const [cashDiscountPercentage, setCashDiscountPercentage] = useState<number>(0);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [dueDate, setDueDate] = useState('');
  const [dueDateDisplay, setDueDateDisplay] = useState('');
  const [dueDateOptions, setDueDateOptions] = useState<{label: string, days: number, isDefault: boolean}[]>([]);
  const [selectedDueDateOption, setSelectedDueDateOption] = useState<{label: string, days: number, isDefault: boolean} | null>(null);
  const [notes, setNotes] = useState('');
  
  // Search states
  const [invoiceSearchTerm, setInvoiceSearchTerm] = useState('');
  const [shopSearchTerm, setShopSearchTerm] = useState('');
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [salesRepSearchTerm, setSalesRepSearchTerm] = useState('');
  
  // Data states
  const [invoiceSearchResults, setInvoiceSearchResults] = useState<InvoiceSearchResult[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [salesReps, setSalesReps] = useState<SalesRep[]>([]);
  
  // Dropdown visibility states
  const [showInvoiceDropdown, setShowInvoiceDropdown] = useState(false);
  const [showShopDropdown, setShowShopDropdown] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [showSalesRepDropdown, setShowSalesRepDropdown] = useState(false);
  
  // Loading and status states
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [pendingPaymentData, setPendingPaymentData] = useState<PendingPayment | null>(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  
  // Credit limit management states
  const [isEditingCreditLimit, setIsEditingCreditLimit] = useState(false);
  const [newCreditLimit, setNewCreditLimit] = useState('');
  const [isUpdatingCreditLimit, setIsUpdatingCreditLimit] = useState(false);
  
  // Overdue payment checking
  const [overduePayments, setOverduePayments] = useState<OverduePayment[]>([]);
  const [hasOverduePayments, setHasOverduePayments] = useState(false);

  // Minimum stock requirement - always keep at least 1 in stock
  const MINIMUM_STOCK_REQUIRED = 1;

  // User headers helper
  const getUserHeaders = () => {
    const currentUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    
    if (currentUser) {
      headers['x-user-data'] = currentUser;
    }
    
    return headers;
  };

  // Check if current discount is credit invoice
  const isCreditInvoice = () => {
    return Boolean(selectedDiscount && selectedDiscount.discountName.toLowerCase().includes('credit'));
  };

  // Handle due date option change
  const handleDueDateOptionChange = (option: {label: string, days: number, isDefault: boolean}) => {
    setSelectedDueDateOption(option);
  };

  // Validate date format
  const isValidDate = (dateString: string): boolean => {
    if (!dateString || dateString.length !== 10) return false;
    const [day, month, year] = dateString.split('/');
    if (!day || !month || !year) return false;
    const dayNum = parseInt(day);
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    
    if (dayNum < 1 || dayNum > 31) return false;
    if (monthNum < 1 || monthNum > 12) return false;
    if (yearNum < 1900 || yearNum > 2100) return false;
    
    const date = new Date(yearNum, monthNum - 1, dayNum);
    return date.getFullYear() === yearNum && 
           date.getMonth() === monthNum - 1 && 
           date.getDate() === dayNum;
  };

  // Load due date options from settings
  const loadDueDateOptions = async () => {
    try {
      const response = await fetch('/api/softwareSettings', {
        headers: getUserHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.settings && data.settings.dueDateOptions) {
          setDueDateOptions(data.settings.dueDateOptions);
          
          // Set default option
          const defaultOption = data.settings.dueDateOptions.find((opt: any) => opt.isDefault);
          if (defaultOption) {
            setSelectedDueDateOption(defaultOption);
          }
        }
      }
    } catch (error) {
      console.error('Error loading due date options:', error);
    }
  };

  // Load discounts
  const loadDiscounts = async () => {
    try {
      const response = await fetch('/api/discounts');
      const data = await response.json();
      if (data.success) {
        setDiscounts(data.discounts.filter((d: Discount) => d.percentage > 0));
      }
    } catch (error) {
      console.error('Error loading discounts:', error);
    }
  };

  // Search invoices
  const searchInvoices = useCallback(async (search: string) => {
    if (search.length < 2) {
      setInvoiceSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`/api/invoices/search?search=${encodeURIComponent(search)}&limit=10`, {
        headers: getUserHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setInvoiceSearchResults(data.invoices || []);
      }
    } catch (error) {
      console.error('Error searching invoices:', error);
    }
  }, []);

  // Search shops
  const searchShops = useCallback(async (search: string) => {
    if (search.length < 2) {
      setShops([]);
      return;
    }

    try {
      const response = await fetch(`/api/shops?search=${encodeURIComponent(search)}&limit=10&activeOnly=true`);
      const data = await response.json();
      if (data.success) {
        setShops(data.shops || []);
      }
    } catch (error) {
      console.error('Error searching shops:', error);
    }
  }, []);

  // Search products
  const searchProducts = useCallback(async (search: string) => {
    if (search.length < 2) {
      setProducts([]);
      return;
    }

    try {
      const response = await fetch(`/api/products/search?search=${encodeURIComponent(search)}&limit=10`);
      const data = await response.json();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error searching products:', error);
    }
  }, []);

  // Search sales reps
  const searchSalesReps = useCallback(async (search: string) => {
    try {
      const response = await fetch(`/api/sales-rep?search=${encodeURIComponent(search)}&activeOnly=true`);
      const data = await response.json();
      if (data.success) {
        const activeSalesReps = data.salesReps?.filter((rep: SalesRep) => rep.status === 'active') || [];
        setSalesReps(activeSalesReps);
      }
    } catch (error) {
      console.error('Error searching sales reps:', error);
    }
  }, []);

  // Debounced search effects
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (invoiceSearchTerm) {
        searchInvoices(invoiceSearchTerm);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [invoiceSearchTerm, searchInvoices]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (shopSearchTerm) {
        searchShops(shopSearchTerm);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [shopSearchTerm, searchShops]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (productSearchTerm) {
        searchProducts(productSearchTerm);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [productSearchTerm, searchProducts]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (salesRepSearchTerm) {
        searchSalesReps(salesRepSearchTerm);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [salesRepSearchTerm, searchSalesReps]);

  // Auto-load invoice if invoiceId parameter is provided in URL
  useEffect(() => {
    const invoiceId = searchParams.get('invoiceId');
    if (invoiceId && !isNaN(parseInt(invoiceId))) {
      const numericInvoiceId = parseInt(invoiceId);
      console.log('Auto-loading invoice from URL parameter:', numericInvoiceId);
      loadInvoiceDetails(numericInvoiceId);
    }
  }, [searchParams]);

  // Load due date options and discounts on component mount
  useEffect(() => {
    loadDueDateOptions();
    loadDiscounts();
  }, []);

  // Calculate due date when invoice date or payment terms change
  useEffect(() => {
    if (isCreditInvoice() && invoiceDate && selectedDueDateOption) {
      const calculatedDueDate = new Date(invoiceDate);
      calculatedDueDate.setDate(calculatedDueDate.getDate() + selectedDueDateOption.days);
      const dueDateISO = calculatedDueDate.toISOString().split('T')[0];
      setDueDate(dueDateISO);
      setDueDateDisplay(formatDateForDisplay(dueDateISO));
    } else {
      setDueDate('');
      setDueDateDisplay('');
    }
  }, [invoiceDate, selectedDiscount, selectedDueDateOption]);

  // Add product to invoice
  const addProductToInvoice = (product: Product) => {
    const existingItem = invoiceItems.find(item => item.productId === product.id);
    
    if (existingItem) {
      // Check if we can increase quantity while maintaining minimum stock
      const maxAllowedQty = existingItem.availableQty - MINIMUM_STOCK_REQUIRED;
      if (existingItem.quantity < maxAllowedQty) {
        updateInvoiceItem(existingItem.id, 'quantity', existingItem.quantity + 1);
      } else {
        setError(`Cannot add more ${product.itemName}. Must maintain minimum stock of ${MINIMUM_STOCK_REQUIRED}. Available for sale: ${maxAllowedQty}`);
      }
    } else {
      // Check if product has enough stock to add (must leave at least 1 in stock)
      const availableForSale = product.availableQty - MINIMUM_STOCK_REQUIRED;
      
      if (availableForSale < 1) {
        setError(`Cannot add ${product.itemName}. Must maintain minimum stock of ${MINIMUM_STOCK_REQUIRED}. Current stock: ${product.availableQty}`);
        setProductSearchTerm('');
        setProducts([]);
        setShowProductDropdown(false);
        return;
      }
      
      // Add new item
      const newItem: InvoiceItem = {
        id: `item_${Date.now()}`,
        productId: product.id,
        productCode: product.productCode,
        productName: product.itemName,
        quantity: 1,
        sellingPrice: product.sellingPrice,
        discount: 0,
        price: product.sellingPrice,
        totalPrice: product.sellingPrice,
        availableQty: product.availableQty,
        costPrice: product.costPrice || 0
      };
      
      setInvoiceItems(items => [...items, newItem]);
    }
    
    setProductSearchTerm('');
    setProducts([]);
    setShowProductDropdown(false);
  };

  // Update invoice item with stock validation
  const updateInvoiceItem = (itemId: string, field: string, value: number) => {
    setInvoiceItems(items => 
      items.map(item => {
        if (item.id === itemId) {
          let validatedValue = Number(value);
          
          // If updating quantity, validate against available stock with minimum stock requirement
          if (field === 'quantity') {
            const maxAllowedQty = item.availableQty - MINIMUM_STOCK_REQUIRED;
            
            if (validatedValue <= 0) {
              validatedValue = 1; // Minimum quantity is 1
              setError(`Quantity must be at least 1 for ${item.productName}`);
            } else if (validatedValue > maxAllowedQty) {
              setError(`Cannot save invoice! Quantity ${validatedValue} exceeds available for sale (${maxAllowedQty}) for ${item.productName}. Must maintain minimum stock of ${MINIMUM_STOCK_REQUIRED}. Maximum allowed: ${maxAllowedQty}`);
              validatedValue = Math.max(1, maxAllowedQty); // Set to maximum allowed or 1, whichever is higher
            } else {
              // Clear error if quantity is valid
              setError('');
            }
          }
          
          const updatedItem = { ...item, [field]: validatedValue };
          
          // Recalculate price and total - ensure all values are numbers
          updatedItem.price = Number(updatedItem.quantity) * Number(updatedItem.sellingPrice);
          updatedItem.totalPrice = updatedItem.price - Number(updatedItem.discount);
          
          return updatedItem;
        }
        return item;
      })
    );
  };

  // Remove invoice item
  const removeInvoiceItem = (itemId: string) => {
    setInvoiceItems(items => items.filter(item => item.id !== itemId));
  };

  // Calculate effective cash discount percentage (use stored if available, otherwise settings)
  const effectiveCashDiscountPercent = cashDiscountPercentage > 0 ? cashDiscountPercentage : invoiceSettings.totalBalanceDiscountPercent;

  // Calculate totals with useMemo for real-time updates
  const totals = React.useMemo(() => {
    // Sub Total = sum of all Total Price values in the table - ensure numbers
    const subTotal = invoiceItems.reduce((sum, item) => sum + Number(item.totalPrice), 0);
    const totalDiscount = invoiceItems.reduce((sum, item) => sum + Number(item.discount), 0);
    
    // Invoice Type discount (Credit/Cash discount percentage)
    const invoiceTypeDiscount = selectedDiscount ? Number(subTotal) * (parseFloat(selectedDiscount.percentage.toString()) / 100) : 0;
    
    // Cash discount is applied on the Sub Total (after item discounts)
    // Use stored percentage if available, otherwise fall back to settings
    const effectiveCashDiscountPercent = cashDiscountPercentage > 0 ? cashDiscountPercentage : invoiceSettings.totalBalanceDiscountPercent;
    const cashDiscount = cashDiscountEnabled ? Number(subTotal) * (effectiveCashDiscountPercent / 100) : 0;
    
    // Net Total = Sub Total - Invoice Type Discount - Cash Discount
    const netTotal = Number(subTotal) - Number(invoiceTypeDiscount) - Number(cashDiscount);

    // Calculate total cost and profit for the invoice
    let totalCost = 0;
    let totalProfit = 0;

    invoiceItems.forEach(item => {
      // Item cost = costPrice * quantity
      const itemCost = (item.costPrice || 0) * item.quantity;
      totalCost += itemCost;

      // Item profit calculation with all deductions
      const itemTotalPrice = Number(item.totalPrice);
      const itemInvoiceTypeDeduction = selectedDiscount ? (itemTotalPrice * (parseFloat(selectedDiscount.percentage.toString()) / 100)) : 0;
      const itemCashDiscountDeduction = cashDiscountEnabled ? (itemTotalPrice * (effectiveCashDiscountPercent / 100)) : 0;
      const itemAdjustedPrice = itemTotalPrice - itemInvoiceTypeDeduction - itemCashDiscountDeduction;
      const itemProfit = itemAdjustedPrice - itemCost;
      
      totalProfit += itemProfit;
    });

    return {
      subTotal: Number(subTotal),
      totalDiscount: Number(totalDiscount),
      invoiceTypeDiscount: Number(invoiceTypeDiscount),
      cashDiscount: Number(cashDiscount),
      netTotal: Number(netTotal),
      totalCost: Number(totalCost),
      totalProfit: Number(totalProfit)
    };
  }, [invoiceItems, cashDiscountEnabled, cashDiscountPercentage, invoiceSettings.totalBalanceDiscountPercent, selectedDiscount]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedShop) {
      setError('Please select a shop');
      return;
    }

    if (!selectedSalesRep) {
      setError('Please select a sales representative');
      return;
    }

    if (invoiceItems.length === 0) {
      setError('Please add at least one product');
      return;
    }

    // Check for overdue payments if updating a credit invoice
    if (isCreditInvoice() && hasOverduePayments) {
      const totalOverdue = overduePayments.reduce((sum, p) => sum + Number(p.remainingAmount), 0);
      setError(
        `❌ Cannot update credit invoice! This shop has ${overduePayments.length} overdue payment(s) totaling LKR ${totalOverdue.toLocaleString()}. ` +
        `Please settle all overdue payments before updating credit invoices.`
      );
      return;
    }

    // Validate stock availability for all items
    const stockErrors = [];
    for (const item of invoiceItems) {
      if (item.quantity > item.availableQty) {
        stockErrors.push(`${item.productName}: Requested ${item.quantity}, Available ${item.availableQty}`);
      }
      if (item.quantity <= 0) {
        stockErrors.push(`${item.productName}: Invalid quantity ${item.quantity}`);
      }
    }

    if (stockErrors.length > 0) {
      setError(`Cannot update invoice! Stock validation failed:\n${stockErrors.join('\n')}\nPlease adjust quantities before saving.`);
      return;
    }

    // Validate credit limit for credit invoices
    if (isCreditInvoice() && !validateCreditLimit()) {
      const availableCredit = (selectedShop.creditLimit || 0) - (selectedShop.balanceAmount || 0);
      setError(`Credit limit exceeded! Available credit: LKR ${availableCredit.toLocaleString()}. Invoice total: LKR ${totals.netTotal.toLocaleString()}`);
      return;
    }

    setIsLoadingForm(true);
    setError('');
    setMessage('');

    try {
      const payload = {
        id: selectedInvoice?.id,
        invoiceDate,
        shopId: selectedShop.id,
        salesRepId: selectedSalesRep.id,
        discountId: selectedDiscount?.id || null,
        invoiceType: selectedDiscount?.discountName || null,
        invoiceTypePercentage: selectedDiscount?.percentage || null,
        cashDiscountEnabled,
        ...(selectedDiscount && selectedDiscount.discountName.toLowerCase().includes('credit') && dueDate && { dueDate }),
        notes: notes || null,
        items: invoiceItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          sellingPrice: item.sellingPrice,
          discount: item.discount
        }))
      };

      const response = await fetch('/api/invoices', {
        method: 'PUT',
        headers: getUserHeaders(),
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (data.success) {
        // If there's pending payment data and the net total changed, update it
        if (pendingPaymentData && pendingPaymentData.netTotal !== totals.netTotal) {
          await updatePendingPaymentTotal(pendingPaymentData.id, totals.netTotal);
        }
        
        setMessage('Invoice updated successfully!');
        
        // Reload invoice and payment data to reflect changes
        await loadInvoiceDetails(selectedInvoice!.id);
      } else {
        setError(data.error || 'Failed to update invoice');
      }
    } catch (error) {
      console.error('Error updating invoice:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoadingForm(false);
    }
  };

  // Load pending payment data for selected invoice
  const loadPendingPaymentData = async (invoiceId: number) => {
    setIsLoadingPayment(true);
    try {
      const response = await fetch(`/api/payments?invoiceId=${invoiceId}`, {
        headers: getUserHeaders()
      });

      const data = await response.json();
      if (data.success && data.payments && data.payments.length > 0) {
        setPendingPaymentData(data.payments[0]);
      } else {
        setPendingPaymentData(null);
      }
    } catch (error) {
      console.error('Error loading pending payment:', error);
      setPendingPaymentData(null);
    } finally {
      setIsLoadingPayment(false);
    }
  };

  // Update pending payment total when invoice total changes
  const updatePendingPaymentTotal = async (paymentId: number, newNetTotal: number) => {
    try {
      const response = await fetch('/api/payments/update-total', {
        method: 'PUT',
        headers: getUserHeaders(),
        body: JSON.stringify({
          id: paymentId,
          newNetTotal: newNetTotal
        })
      });

      const data = await response.json();
      if (!data.success) {
        console.error('Failed to update pending payment total:', data.error);
      }
    } catch (error) {
      console.error('Error updating pending payment total:', error);
    }
  };

  // Update shop credit limit
  const updateShopCreditLimit = async () => {
    if (!selectedShop || !newCreditLimit) return;

    const creditLimitValue = parseFloat(newCreditLimit);
    if (creditLimitValue < 0) {
      setError('Credit limit cannot be negative');
      return;
    }

    setIsUpdatingCreditLimit(true);
    setError('');

    try {
      const response = await fetch('/api/shops/update-credit-limit', {
        method: 'PUT',
        headers: getUserHeaders(),
        body: JSON.stringify({
          shopId: selectedShop.id,
          creditLimit: creditLimitValue
        })
      });

      const data = await response.json();
      if (data.success) {
        // Update the selected shop's credit limit in the state
        setSelectedShop(prev => prev ? { ...prev, creditLimit: creditLimitValue } : null);
        setMessage(`Credit limit updated successfully to LKR ${creditLimitValue.toLocaleString()}`);
        setIsEditingCreditLimit(false);
        setNewCreditLimit('');
      } else {
        setError(data.error || 'Failed to update credit limit');
      }
    } catch (error) {
      console.error('Error updating credit limit:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsUpdatingCreditLimit(false);
    }
  };

  // Cancel credit limit editing
  const cancelCreditLimitEdit = () => {
    setIsEditingCreditLimit(false);
    setNewCreditLimit('');
    setError('');
  };

  // Check if user can edit credit limits
  const canEditCreditLimit = () => {
    return hasAccess('shops');
  };

  // Check credit limit validation
  const validateCreditLimit = () => {
    if (!selectedShop || !isCreditInvoice()) return true;
    
    const availableCredit = (selectedShop.creditLimit || 0) - (selectedShop.balanceAmount || 0);
    return totals.netTotal <= availableCredit;
  };

  // Check for overdue payments for selected shop
  const checkOverduePayments = async (shopId: number) => {
    try {
      const response = await fetch(`/api/payments?shopId=${shopId}&status=due`);
      const data = await response.json();
      
      if (data.success && data.payments) {
        const overduePmts: OverduePayment[] = data.payments.map((payment: any) => {
          const dueDate = new Date(payment.dueDate);
          const today = new Date();
          const daysPastDue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
          
          return {
            id: payment.id,
            invoiceNumber: payment.invoice.invoiceNumber,
            dueDate: payment.dueDate,
            remainingAmount: payment.remainingAmount,
            daysPastDue: daysPastDue
          };
        }).filter((payment: OverduePayment) => payment.daysPastDue > 0);

        setOverduePayments(overduePmts);
        setHasOverduePayments(overduePmts.length > 0);

        if (overduePmts.length > 0) {
          const totalOverdue = overduePmts.reduce((sum, p) => sum + Number(p.remainingAmount), 0);
          setMessage(
            `⚠️ This shop has ${overduePmts.length} overdue payment(s) totaling LKR ${totalOverdue.toLocaleString()}. ` +
            `Creating new credit invoices may be restricted.`
          );
        }
      } else {
        setOverduePayments([]);
        setHasOverduePayments(false);
      }
    } catch (error) {
      console.error('Error checking overdue payments:', error);
    }
  };

  // Start editing credit limit
  const startEditingCreditLimit = () => {
    if (!canEditCreditLimit()) {
      setError('You do not have permission to edit credit limits');
      return;
    }
    
    if (selectedShop) {
      setNewCreditLimit(selectedShop.creditLimit.toString());
      setIsEditingCreditLimit(true);
    }
  };

  // Load invoice details
  const loadInvoiceDetails = async (invoiceId: number) => {
    setIsLoadingForm(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`/api/invoices/${invoiceId}`, {
        headers: getUserHeaders()
      });

      const data = await response.json();
      if (data.success && data.invoice) {
        const invoice = data.invoice;
        
        // Set form data from invoice
        setInvoiceDate(invoice.invoiceDate);
        setInvoiceDateDisplay(formatDateForDisplay(invoice.invoiceDate));
        setSelectedShop(invoice.shop);
        setSelectedSalesRep(invoice.salesRep || null);
        setSelectedDiscount(invoice.discount || null);
        setNotes(invoice.notes || '');
        
        // Check for overdue payments when loading invoice
        if (invoice.shop && invoice.shop.id) {
          await checkOverduePayments(invoice.shop.id);
        }
        setCashDiscountEnabled(invoice.cashDiscountEnabled || false);
        setCashDiscountPercentage(invoice.cashDiscountPercentage || 0);
        setInvoiceItems(invoice.invoiceItems || []);
        // Format due date for input field (YYYY-MM-DD)
        if (invoice.dueDate) {
          const dueDateObj = new Date(invoice.dueDate);
          const formattedDueDate = dueDateObj.toISOString().split('T')[0];
          setDueDate(formattedDueDate);
        } else {
          setDueDate('');
        }
        setSelectedInvoice(invoice);
        
        // Load pending payment data
        await loadPendingPaymentData(invoiceId);
        
        setMessage(`Invoice ${invoice.invoiceNumber} loaded successfully!`);
      } else {
        setError(data.error || 'Failed to load invoice details');
      }
    } catch (error) {
      console.error('Error loading invoice:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoadingForm(false);
    }
  };

  // Load invoice settings
  useEffect(() => {
    const loadInvoiceSettings = async () => {
      try {
        if (user) {
          const response = await fetch('/api/softwareSettings', {
            headers: getUserHeaders()
          });
          const data = await response.json();
          
          if (data.success && data.settings) {
            const newSettings = {
              isSellingPriceReadonly: data.settings.isSellingPriceReadonly === 1 || data.settings.isSellingPriceReadonly === true,
              isDiscountReadonly: data.settings.isDiscountReadonly === 1 || data.settings.isDiscountReadonly === true,
              showTotalDiscountFromItems: !(data.settings.showTotalDiscountFromItems === 1 || data.settings.showTotalDiscountFromItems === true),
              showTotalBalanceDiscount: !(data.settings.showTotalBalanceDiscount === 1 || data.settings.showTotalBalanceDiscount === true),
              totalBalanceDiscountPercent: data.settings.totalBalanceDiscountPercent || 5,
              hideCostProfit: data.settings.hideCostProfit === 1 || data.settings.hideCostProfit === true
            };
            
            setInvoiceSettings(newSettings);
          }
        }
      } catch (error) {
        console.error('Error loading invoice settings:', error);
      }
    };

    if (!authLoading && isAuthorized) {
      loadInvoiceSettings();
    }
  }, [user, authLoading, isAuthorized]);

  if (authLoading || isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!isAuthorized) {
    return <div className={styles.unauthorized}>You are not authorized to access this page.</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Edit Invoice</h1>
      </div>

      {/* Invoice Search Section */}
      <div className={styles.searchSection}>
        <h2 className={styles.searchTitle}>Search Invoice to Edit</h2>
        
        <div className={styles.field}>
          <label className={styles.label}>Search by Invoice Number or Shop Name:</label>
          <div className={styles.searchContainer}>
            <input
              type="text"
              value={invoiceSearchTerm}
              onChange={(e) => {
                setInvoiceSearchTerm(e.target.value);
                setShowInvoiceDropdown(true);
              }}
              onFocus={() => setShowInvoiceDropdown(true)}
              placeholder="Type invoice number or shop name..."
              className={styles.input}
              disabled={isLoadingForm}
            />
            
            {showInvoiceDropdown && invoiceSearchResults.length > 0 && (
              <div className={styles.dropdown}>
                {invoiceSearchResults.map((invoice) => (
                  <div
                    key={invoice.id}
                    className={styles.dropdownItem}
                    onClick={() => {
                      loadInvoiceDetails(invoice.id);
                      setInvoiceSearchTerm(`${invoice.invoiceNumber} - ${invoice.shopName}`);
                      setShowInvoiceDropdown(false);
                    }}
                  >
                    <div className={styles.invoiceInfo}>
                      <div className={styles.invoiceNumber}>#{invoice.invoiceNumber}</div>
                      <div className={styles.invoiceShop}>{invoice.shopName} ({invoice.ownerName})</div>
                      <div className={styles.invoiceDetails}>
                        Date: {new Date(invoice.invoiceDate).toLocaleDateString()} | 
                        Total: LKR {invoice.netTotal.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {message && <p className={styles.success}>{message}</p>}

      {/* Pending Payment Information - Show when invoice is selected and has pending payment */}
      {selectedInvoice && pendingPaymentData && (
        <div className={styles.paymentInfoSection}>
          <h2 className={styles.paymentInfoTitle}>
            📋 Pending Payment Information
          </h2>
          
          <div className={styles.paymentInfoGrid}>
            <div className={styles.paymentInfoCard}>
              <div className={styles.paymentInfoLabel}>Payment Status:</div>
              <div className={`${styles.paymentStatus} ${styles[pendingPaymentData.paymentStatus]}`}>
                {pendingPaymentData.paymentStatus.toUpperCase()}
              </div>
            </div>
            
            <div className={styles.paymentInfoCard}>
              <div className={styles.paymentInfoLabel}>Net Total:</div>
              <div className={styles.paymentAmount}>
                LKR {pendingPaymentData.netTotal.toLocaleString()}
              </div>
            </div>
            
            <div className={styles.paymentInfoCard}>
              <div className={styles.paymentInfoLabel}>Paid Amount:</div>
              <div className={styles.paymentAmount}>
                LKR {pendingPaymentData.paidAmount.toLocaleString()}
              </div>
            </div>
            
            <div className={styles.paymentInfoCard}>
              <div className={styles.paymentInfoLabel}>Remaining Amount:</div>
              <div className={`${styles.paymentAmount} ${pendingPaymentData.remainingAmount > 0 ? styles.amountDue : styles.amountPaid}`}>
                LKR {pendingPaymentData.remainingAmount.toLocaleString()}
              </div>
            </div>
            
            {pendingPaymentData.dueDate && (
              <div className={styles.paymentInfoCard}>
                <div className={styles.paymentInfoLabel}>Due Date:</div>
                <div className={styles.paymentDueDate}>
                  {new Date(pendingPaymentData.dueDate).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>
          
          <div className={styles.paymentWarning}>
            <strong>⚠️ Note:</strong> Editing this invoice will automatically update the pending payment data. 
            If you change the invoice total, the remaining payment amount will be recalculated.
          </div>
        </div>
      )}

      {/* Invoice Edit Form - Only show when invoice is selected */}
      {selectedInvoice && (
        <div className={styles.editSection}>
          <h2 className={styles.editTitle}>
            Editing Invoice #{selectedInvoice.invoiceNumber}
          </h2>
          
          {/* Invoice Edit Form - Same structure as create invoice */}
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Date and Sales Rep Selection */}
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Invoice Date: *</label>
                <input
                  type="text"
                  placeholder="DD/MM/YYYY"
                  value={invoiceDateDisplay}
                  onChange={(e) => {
                    const value = e.target.value;
                    setInvoiceDateDisplay(value);
                    
                    // Auto-format as user types
                    let formattedValue = value.replace(/[^\d]/g, '');
                    if (formattedValue.length >= 3 && formattedValue.length <= 4) {
                      formattedValue = formattedValue.replace(/(\d{2})(\d{1,2})/, '$1/$2');
                    } else if (formattedValue.length >= 5) {
                      formattedValue = formattedValue.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
                    }
                    
                    if (formattedValue !== value && formattedValue.length <= 10) {
                      setInvoiceDateDisplay(formattedValue);
                    }
                    
                    // Convert to ISO format if valid
                    if (isValidDate(formattedValue)) {
                      const isoDate = formatDateForInput(formattedValue);
                      if (isoDate) {
                        setInvoiceDate(isoDate);
                      }
                    }
                  }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (!isValidDate(value)) {
                      const today = new Date().toISOString().split('T')[0];
                      setInvoiceDate(today);
                      setInvoiceDateDisplay(formatDateForDisplay(today));
                    }
                  }}
                  className={styles.input}
                  disabled={isLoadingForm}
                  required
                  maxLength={10}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Select Sales Rep: *</label>
                <div className={styles.searchContainer}>
                  <input
                    type="text"
                    value={selectedSalesRep ? `${selectedSalesRep.name} (${selectedSalesRep.contactNumber})` : salesRepSearchTerm}
                    onChange={(e) => {
                      if (!selectedSalesRep) {
                        setSalesRepSearchTerm(e.target.value);
                        setShowSalesRepDropdown(true);
                      }
                    }}
                    onFocus={() => setShowSalesRepDropdown(true)}
                    placeholder="Type to search sales representatives..."
                    className={styles.input}
                    disabled={isLoadingForm}
                    required
                  />
                  {selectedSalesRep && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSalesRep(null);
                        setSalesRepSearchTerm('');
                        setShowSalesRepDropdown(false);
                      }}
                      className={styles.clearSelection}
                      disabled={isLoadingForm}
                    >
                      ×
                    </button>
                  )}
                  {showSalesRepDropdown && salesReps.length > 0 && (
                    <div className={styles.dropdown}>
                      {salesReps.map((rep) => (
                        <div
                          key={rep.id}
                          className={styles.dropdownItem}
                          onClick={() => {
                            setSelectedSalesRep(rep);
                            setSalesRepSearchTerm('');
                            setShowSalesRepDropdown(false);
                          }}
                        >
                          <div className={styles.repName}>{rep.name}</div>
                          <div className={styles.repContact}>{rep.contactNumber}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className={styles.field}>
                <label className={styles.label}>Select Shop: *</label>
                <div className={styles.searchContainer}>
                  <input
                    type="text"
                    value={selectedShop ? `${selectedShop.shopName} (${selectedShop.ownerName})` : shopSearchTerm}
                    onChange={(e) => {
                      if (!selectedShop) {
                        const value = e.target.value;
                        setShopSearchTerm(value);
                        // Show dropdown only if there's text, hide if empty
                        setShowShopDropdown(value.length > 0);
                      }
                    }}
                    onFocus={() => setShowShopDropdown(true)}
                    onBlur={() => {
                      // Delay hiding to allow clicking on dropdown items
                      setTimeout(() => setShowShopDropdown(false), 150);
                    }}
                    placeholder="Type to search shops..."
                    className={styles.input}
                    disabled={isLoadingForm}
                    required
                  />
                  
                  {selectedShop && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedShop(null);
                        setShopSearchTerm('');
                        setShowShopDropdown(false);
                      }}
                      className={styles.clearSelection}
                    >
                      ×
                    </button>
                  )}

                  {showShopDropdown && shops.length > 0 && !selectedShop && (
                    <div className={styles.dropdown}>
                      {shops.map((shop) => (
                        <div
                          key={shop.id}
                          className={styles.dropdownItem}
                          onClick={() => {
                            setSelectedShop(shop);
                            setShopSearchTerm('');
                            setShowShopDropdown(false);
                          }}
                        >
                          <div className={styles.shopInfo}>
                            <div className={styles.shopName}>{shop.shopName}</div>
                            <div className={styles.shopOwner}>Owner: {shop.ownerName} | Contact: {shop.contactNumber}</div>
                            <div className={styles.shopOwner}>
                              Credit Limit: LKR {shop.creditLimit.toLocaleString()} | 
                              Balance: LKR {shop.balanceAmount.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Selected Shop Details with Credit Limit Management */}
              {selectedShop && (
                <div className={styles.field}>
                  <label className={styles.label}>Selected Shop Details:</label>
                  <div className={styles.selectedShopDetails}>
                    <div className={styles.shopDetailCard}>
                      <div className={styles.shopDetailRow}>
                        <span className={styles.shopDetailLabel}>Shop Name:</span>
                        <span className={styles.shopDetailValue}>{selectedShop.shopName}</span>
                      </div>
                      <div className={styles.shopDetailRow}>
                        <span className={styles.shopDetailLabel}>Owner:</span>
                        <span className={styles.shopDetailValue}>{selectedShop.ownerName}</span>
                      </div>
                      <div className={styles.shopDetailRow}>
                        <span className={styles.shopDetailLabel}>Contact:</span>
                        <span className={styles.shopDetailValue}>{selectedShop.contactNumber}</span>
                      </div>
                      <div className={styles.shopDetailRow}>
                        <span className={styles.shopDetailLabel}>Credit Limit:</span>
                        <div className={styles.creditLimitSection}>
                          {!isEditingCreditLimit ? (
                            <>
                              <span className={styles.shopDetailValue}>
                                LKR {selectedShop.creditLimit.toLocaleString()}
                              </span>
                              {canEditCreditLimit() && (
                                <button
                                  type="button"
                                  onClick={startEditingCreditLimit}
                                  className={styles.editCreditLimitBtn}
                                  disabled={isLoadingForm}
                                >
                                  ✏️ Edit
                                </button>
                              )}
                              {!canEditCreditLimit() && (
                                <span className={styles.permissionNote}>
                                  (Edit requires Shop permissions)
                                </span>
                              )}
                            </>
                          ) : (
                            <div className={styles.creditLimitEdit}>
                              <input
                                type="number"
                                value={newCreditLimit}
                                onChange={(e) => setNewCreditLimit(e.target.value)}
                                placeholder="Enter new credit limit"
                                className={styles.creditLimitInput}
                                disabled={isUpdatingCreditLimit}
                                min="0"
                                step="0.01"
                              />
                              <div className={styles.creditLimitActions}>
                                <button
                                  type="button"
                                  onClick={updateShopCreditLimit}
                                  className={styles.saveCredtiLimitBtn}
                                  disabled={isUpdatingCreditLimit}
                                >
                                  {isUpdatingCreditLimit ? 'Saving...' : '💾 Save'}
                                </button>
                                <button
                                  type="button"
                                  onClick={cancelCreditLimitEdit}
                                  className={styles.cancelCreditLimitBtn}
                                  disabled={isUpdatingCreditLimit}
                                >
                                  ❌ Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className={styles.shopDetailRow}>
                        <span className={styles.shopDetailLabel}>Balance:</span>
                        <span className={`${styles.shopDetailValue} ${selectedShop.balanceAmount > 0 ? styles.balanceDue : styles.balanceClear}`}>
                          LKR {selectedShop.balanceAmount.toLocaleString()}
                        </span>
                      </div>
                      
                      {/* Credit Information for Credit Invoices */}
                      {isCreditInvoice() && (
                        <div className={styles.creditInfoSection}>
                          <div className={styles.shopDetailRow}>
                            <span className={styles.shopDetailLabel}>Available Credit:</span>
                            <span className={`${styles.shopDetailValue} ${((selectedShop.creditLimit || 0) - (selectedShop.balanceAmount || 0)) <= 0 ? styles.balanceDue : styles.balanceClear}`}>
                              LKR {((selectedShop.creditLimit || 0) - (selectedShop.balanceAmount || 0)).toLocaleString()}
                            </span>
                          </div>
                          
                          {/* Credit Limit Validation Warning */}
                          {!validateCreditLimit() && (
                            <div className={styles.creditWarning}>
                              <strong>⚠️ Credit Limit Warning:</strong> Invoice total (LKR {totals.netTotal.toLocaleString()}) exceeds available credit 
                              (LKR {((selectedShop.creditLimit || 0) - (selectedShop.balanceAmount || 0)).toLocaleString()}). 
                              Update cannot proceed.
                            </div>
                          )}
                          
                          {/* Overdue Payments Warning */}
                          {hasOverduePayments && (
                            <div className={styles.overdueWarning}>
                              <strong>🚨 Overdue Payments Alert:</strong> This shop has {overduePayments.length} overdue payment(s) 
                              totaling LKR {overduePayments.reduce((sum, p) => sum + Number(p.remainingAmount), 0).toLocaleString()}. 
                              Credit invoice updates are restricted.
                              <div className={styles.overdueDetails}>
                                {overduePayments.slice(0, 3).map((payment, index) => (
                                  <div key={payment.id} className={styles.overdueItem}>
                                    #{payment.invoiceNumber}: LKR {payment.remainingAmount.toLocaleString()} 
                                    ({payment.daysPastDue} days overdue)
                                  </div>
                                ))}
                                {overduePayments.length > 3 && (
                                  <div className={styles.overdueMore}>
                                    ... and {overduePayments.length - 3} more
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Invoice Type and Notes Row */}
              <div className={styles.invoiceTypeNotesRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Invoice Type: *</label>
                  <select
                    value={selectedDiscount?.id || ''}
                    onChange={(e) => {
                      const discountId = e.target.value;
                      const discount = discounts.find(d => d.id.toString() === discountId);
                      setSelectedDiscount(discount || null);
                    }}
                    className={styles.input}
                    disabled={isLoadingForm}
                    required
                  >
                    <option value="" disabled>Select Invoice Type</option>
                    {discounts.map((discount) => (
                      <option key={discount.id} value={discount.id}>
                        {discount.discountName} Discount ({discount.percentage}%)
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Notes:</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter any additional notes for this invoice..."
                    className={styles.notesInput}
                    disabled={isLoadingForm}
                    rows={1}
                  />
                </div>

                {/* Payment Terms Field - Third column if credit invoice */}
                {isCreditInvoice() && (
                  <div className={styles.field}>
                    <label className={styles.label}>Payment Terms:</label>
                    <select
                      value={selectedDueDateOption ? `${selectedDueDateOption.label}-${selectedDueDateOption.days}` : ''}
                      onChange={(e) => {
                        const [label, daysStr] = e.target.value.split('-');
                        const days = parseInt(daysStr);
                        const option = dueDateOptions.find(opt => opt.label === label && opt.days === days);
                        if (option) {
                          handleDueDateOptionChange(option);
                        }
                      }}
                      className={styles.select}
                      disabled={isLoadingForm}
                    >
                      <option value="">Select Payment Terms</option>
                      {dueDateOptions.map((option, index) => (
                        <option 
                          key={index} 
                          value={`${option.label}-${option.days}`}
                        >
                          {option.label} ({option.days} days) {option.isDefault ? '- Default' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Due Date - Separate Row */}
            {isCreditInvoice() && dueDate && (
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Payment Due Date:</label>
                  <input
                    type="text"
                    placeholder="DD/MM/YYYY"
                    value={dueDateDisplay}
                    onChange={(e) => {
                      const value = e.target.value;
                      setDueDateDisplay(value);
                      
                      // Auto-format as user types
                      let formattedValue = value.replace(/[^\d]/g, '');
                      if (formattedValue.length >= 3 && formattedValue.length <= 4) {
                        formattedValue = formattedValue.replace(/(\d{2})(\d{1,2})/, '$1/$2');
                      } else if (formattedValue.length >= 5) {
                        formattedValue = formattedValue.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
                      }
                      
                      if (formattedValue !== value && formattedValue.length <= 10) {
                        setDueDateDisplay(formattedValue);
                      }
                      
                      // Convert to ISO format for storage if valid
                      const isoDate = formatDateForInput(formattedValue);
                      if (isoDate) {
                        setDueDate(isoDate);
                      }
                    }}
                    className={styles.input}
                    disabled={isLoadingForm}
                  />
                </div>
              </div>
            )}



            {/* Invoice Items Section */}
            <div className={styles.itemsSection}>
              <h3 className={styles.sectionTitle}>Invoice Items</h3>
              
              {/* Add Product Search */}
              <div className={styles.addProductSection}>
                <div className={styles.field}>
                  <label className={styles.label}>Add Product:</label>
                  <div className={styles.searchContainer}>
                    <input
                      type="text"
                      value={productSearchTerm}
                      onChange={(e) => {
                        const value = e.target.value;
                        setProductSearchTerm(value);
                        // Show dropdown only if there's text, hide if empty
                        setShowProductDropdown(value.length > 0);
                      }}
                      onFocus={() => setShowProductDropdown(true)}
                      onBlur={() => {
                        // Delay hiding to allow clicking on dropdown items
                        setTimeout(() => setShowProductDropdown(false), 150);
                      }}
                      placeholder="Type to search products..."
                      className={styles.input}
                      disabled={isLoadingForm}
                    />
                    
                    {showProductDropdown && products.length > 0 && (
                      <div className={styles.dropdown}>
                        {products.map((product) => {
                          const availableForSale = Math.max(0, product.availableQty - MINIMUM_STOCK_REQUIRED);
                          const canAddProduct = availableForSale > 0;
                          
                          return (
                            <div
                              key={product.id}
                              className={`${styles.dropdownItem} ${!canAddProduct ? styles.productUnavailable : ''}`}
                              onClick={() => canAddProduct ? addProductToInvoice(product) : null}
                              style={{ cursor: canAddProduct ? 'pointer' : 'not-allowed' }}
                            >
                              <div className={styles.productInfo}>
                                <div className={styles.productName}>
                                  {product.itemName} ({product.productCode})
                                  {!canAddProduct && <span className={styles.unavailableTag}> - UNAVAILABLE</span>}
                                </div>
                                <div className={styles.productDetails}>
                                  Price: LKR {product.sellingPrice} | 
                                  Available for Sale: {availableForSale} | 
                                  Total Stock: {product.availableQty} | 
                                  Category: {product.category}
                                  {!canAddProduct && (
                                    <div className={styles.minimumStockNote}>
                                      (Must maintain minimum stock of {MINIMUM_STOCK_REQUIRED})
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Invoice Items Table */}
              <div className={styles.itemsTable}>
                <div className={`${styles.itemsHeader} ${!invoiceSettings.showTotalDiscountFromItems ? styles.itemsHeaderNoDiscount : ''}`}>
                  <div>Product</div>
                  <div>Quantity</div>
                  <div>Selling Price</div>
                  {invoiceSettings.showTotalDiscountFromItems && <div>Discount</div>}
                  <div>Price</div>
                  {!invoiceSettings.hideCostProfit && <div>Cost</div>}
                  {!invoiceSettings.hideCostProfit && <div>Profit</div>}
                  <div>Total Price</div>
                  <div>Action</div>
                </div>
                
                {invoiceItems.length === 0 ? (
                  <div className={styles.noItemsRow}>
                    <div className={styles.noItemsMessage}>
                      No items added yet. Search and add products above.
                    </div>
                  </div>
                ) : (
                  invoiceItems.map((item) => (
                    <div key={item.id} className={`${styles.itemRow} ${!invoiceSettings.showTotalDiscountFromItems ? styles.itemRowNoDiscount : ''}`}>
                      <div className={styles.product}>
                        <div className={styles.productName}>{item.productName}</div>
                        <div className={styles.productCode}>({item.productCode})</div>
                      </div>
                      <div className={styles.quantity}>
                        <input
                          type="number"
                          min="1"
                          max={Math.max(1, item.availableQty - MINIMUM_STOCK_REQUIRED)}
                          value={item.quantity}
                          onWheel={handleNumberInputWheel}
                          onChange={(e) => updateInvoiceItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                          className={styles.quantityInput}
                        />
                      </div>
                      <div className={styles.sellingPrice}>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.sellingPrice}
                          onChange={(e) => updateInvoiceItem(item.id, 'sellingPrice', parseFloat(e.target.value) || 0)}
                          onWheel={handleNumberInputWheel}
                          className={styles.priceInput}
                          readOnly={invoiceSettings.isSellingPriceReadonly}
                          title={invoiceSettings.isSellingPriceReadonly ? 'Selling price is read-only (configured in settings)' : ''}
                        />
                      </div>
                      {invoiceSettings.showTotalDiscountFromItems && (
                        <div className={styles.discount}>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.discount}
                            onChange={(e) => updateInvoiceItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                            onWheel={handleNumberInputWheel}
                            className={styles.discountInput}
                            placeholder="0.00"
                            readOnly={invoiceSettings.isDiscountReadonly}
                            title={invoiceSettings.isDiscountReadonly ? 'Discount is read-only (configured in settings)' : ''}
                          />
                        </div>
                      )}
                      <div className={styles.price}>
                        LKR {item.price.toLocaleString()}
                      </div>
                      {!invoiceSettings.hideCostProfit && (
                        <div className={styles.cost}>
                          LKR {(item.costPrice * item.quantity).toLocaleString()}
                        </div>
                      )}
                      {!invoiceSettings.hideCostProfit && (
                        <div className={styles.profit}>
                          LKR {(() => {
                            const invoiceTypeDeduction = selectedDiscount ? (item.totalPrice * (parseFloat(selectedDiscount.percentage.toString()) / 100)) : 0;
                            const cashDiscountDeduction = cashDiscountEnabled ? (item.totalPrice * (effectiveCashDiscountPercent / 100)) : 0;
                            const adjustedTotalPrice = item.totalPrice - invoiceTypeDeduction - cashDiscountDeduction;
                            const totalCost = item.costPrice * item.quantity;
                            return (adjustedTotalPrice - totalCost).toLocaleString();
                          })()}
                        </div>
                      )}
                      <div className={styles.totalPrice}>
                        LKR {item.totalPrice.toLocaleString()}
                      </div>
                      <div className={styles.actions}>
                        <button
                          type="button"
                          onClick={() => removeInvoiceItem(item.id)}
                          className={styles.removeButton}
                          disabled={isLoadingForm}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Totals Section */}
            <div className={styles.totalsSection}>
              <div className={styles.totalsGrid}>
                <div className={styles.totalRow}>
                  <span>Sub Total{selectedDiscount ? ` - ${selectedDiscount.discountName} Discount (${selectedDiscount.percentage}%)` : ''}:</span>
                  <span>LKR {totals.subTotal.toLocaleString()}</span>
                </div>
                {selectedDiscount && (
                  <div className={styles.totalRow}>
                    <span>Discount Amount ({selectedDiscount.percentage}%):</span>
                    <span>- LKR {totals.invoiceTypeDiscount.toLocaleString()}</span>
                  </div>
                )}
                {invoiceSettings.showTotalDiscountFromItems && (
                  <div className={styles.totalRow}>
                    <span>Total Discount from Items:</span>
                    <span>LKR {totals.totalDiscount.toLocaleString()}</span>
                  </div>
                )}
                {invoiceSettings.showTotalBalanceDiscount && (
                  <div className={styles.totalRow}>
                    <label className={styles.cashDiscountLabel}>
                      <input
                        type="checkbox"
                        checked={cashDiscountEnabled}
                        onChange={(e) => setCashDiscountEnabled(e.target.checked)}
                        className={styles.checkbox}
                      />
                      <span>Cash Discount ({effectiveCashDiscountPercent}%):</span>
                    </label>
                    <span>{cashDiscountEnabled && totals.cashDiscount > 0 ? `- LKR ${totals.cashDiscount.toLocaleString()}` : `LKR ${totals.cashDiscount.toLocaleString()}`}</span>
                  </div>
                )}
                <div className={`${styles.totalRow} ${styles.netTotal}`}>
                  <span>Net Total:</span>
                  <span>LKR {totals.netTotal.toLocaleString()}</span>
                </div>
                {!invoiceSettings.hideCostProfit && (
                  <div className={styles.totalRow}>
                    <span>Total Cost:</span>
                    <span>LKR {totals.totalCost.toLocaleString()}</span>
                  </div>
                )}
                {!invoiceSettings.hideCostProfit && (
                  <div className={`${styles.totalRow} ${styles.profitRow}`}>
                    <span>Total Profit:</span>
                    <span style={{color: totals.totalProfit >= 0 ? '#28a745' : '#dc3545', fontWeight: 'bold'}}>
                      LKR {totals.totalProfit.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Section */}
            <div className={styles.submitSection}>
              <button
                type="submit"
                disabled={
                  isLoadingForm || 
                  invoiceItems.length === 0 || 
                  (isCreditInvoice() && hasOverduePayments) ||
                  (isCreditInvoice() && !validateCreditLimit())
                }
                className={styles.submitButton}
              >
                {isLoadingForm ? 'Updating Invoice...' : 'Update Invoice'}
              </button>
              
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className={styles.cancelButton}
                disabled={isLoadingForm}
              >
                Cancel Edit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

// Wrapper component with Suspense for useSearchParams  
const InvoiceEditPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading invoice editor...</div>}>
      <EditInvoicePage />
    </Suspense>
  );
};

export default InvoiceEditPage;