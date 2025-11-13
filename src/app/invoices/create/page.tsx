'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { usePageProtection } from '@/components/ProtectedRoute';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { handleNumberInputWheel } from '@/lib/numberInputUtils';
import styles from './invoice.module.css';

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
}

interface OverduePayment {
  id: number;
  invoiceNumber: string;
  dueDate: string;
  remainingAmount: number;
  daysPastDue: number;
}

interface SalesRep {
  id: number;
  name: string;
  contactNumber: string;
  status: string;
}

interface Invoice {
  id: number;
  invoiceNumber: string;
  invoiceDate: string;
  shop: Shop;
  discount?: Discount;
  subTotal: number;
  totalDiscount: number;
  cashDiscount: number;
  cashDiscountEnabled: boolean;
  netTotal: number;
  notes?: string;
  invoiceItems: any[];
}

interface Order {
  id: number;
  orderNumber: string;
  orderDate: string;
  shop: Shop;
  salesRep?: SalesRep;
  discount?: Discount;
  invoiceTypePercentage?: number;
  subTotal: number;
  totalDiscount: number;
  cashDiscount: number;
  cashDiscountEnabled: boolean;
  netTotal: number;
  status: string;
  notes?: string;
  orderItems: {
    id: number;
    productId: number;
    quantity: number;
    sellingPrice: number;
    discount: number;
    price: number;
    totalPrice: number;
    itemCost: number;
    itemProfit: number;
    product: Product & { category: { category: string } };
  }[];
}

const InvoiceManagement: React.FC = () => {
  // Navigation
  const router = useRouter();
  
  // Page protection
  const { isAuthorized, isLoading: authLoading } = usePageProtection('invoices');
  
  // Theme context
  const { isDarkMode } = useTheme();
  
  // Auth context
  const { user } = useAuth();

  // Minimum stock requirement - always keep at least 1 in stock
  const MINIMUM_STOCK_REQUIRED = 1;

  // Date utility functions
  const formatDateForDisplay = (isoDate: string): string => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateForInput = (displayDate: string): string => {
    if (!displayDate) return '';
    const [day, month, year] = displayDate.split('/');
    if (day && month && year && day.length <= 2 && month.length <= 2 && year.length === 4) {
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return '';
  };

  const isValidDate = (displayDate: string): boolean => {
    const [day, month, year] = displayDate.split('/');
    if (!day || !month || !year) return false;
    const dayNum = parseInt(day);
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    if (isNaN(dayNum) || isNaN(monthNum) || isNaN(yearNum)) return false;
    const date = new Date(yearNum, monthNum - 1, dayNum);
    return date.getDate() === dayNum && 
           date.getMonth() + 1 === monthNum && 
           date.getFullYear() === yearNum;
  };
  
  // Form state
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [invoiceDateDisplay, setInvoiceDateDisplay] = useState(formatDateForDisplay(new Date().toISOString().split('T')[0]));
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);
  const [cashDiscountEnabled, setCashDiscountEnabled] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [dueDateDisplay, setDueDateDisplay] = useState('');
  const [dueDateOptions, setDueDateOptions] = useState<{label: string, days: number, isDefault: boolean}[]>([]);
  const [selectedDueDateOption, setSelectedDueDateOption] = useState<{label: string, days: number, isDefault: boolean} | null>(null);
  const [notes, setNotes] = useState('');
  
  // Search states
  const [shopSearchTerm, setShopSearchTerm] = useState('');
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [salesRepSearchTerm, setSalesRepSearchTerm] = useState('');
  const [shops, setShops] = useState<Shop[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [salesReps, setSalesReps] = useState<SalesRep[]>([]);
  const [selectedSalesRep, setSelectedSalesRep] = useState<SalesRep | null>(null);
  const [showShopDropdown, setShowShopDropdown] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [showSalesRepDropdown, setShowSalesRepDropdown] = useState(false);
  
  // Free products states
  const [freeProductSearchTerm, setFreeProductSearchTerm] = useState('');
  const [freeProducts, setFreeProducts] = useState<Product[]>([]);
  const [showFreeProductDropdown, setShowFreeProductDropdown] = useState(false);
  
  // Order-related states
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDropdown, setShowOrderDropdown] = useState(false);
  const [isOrdersLoaded, setIsOrdersLoaded] = useState(false);
  
  // Invoice items
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  
  // Overdue payment checking
  const [overduePayments, setOverduePayments] = useState<OverduePayment[]>([]);
  const [hasOverduePayments, setHasOverduePayments] = useState(false);
  
  // Invoices list
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false
  });
  
  // Invoice search and filtering
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [isViewMode, setIsViewMode] = useState(false);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  
  // Last created invoice for quick print access
  const [lastCreatedInvoiceId, setLastCreatedInvoiceId] = useState<number | null>(null);

  // Settings state
  const [invoiceSettings, setInvoiceSettings] = useState({
    isSellingPriceReadonly: false,
    isDiscountReadonly: false,
    showTotalDiscountFromItems: true,
    showTotalBalanceDiscount: false,
    totalBalanceDiscountPercent: 5,
    hideCostProfit: false
  });

  // Get user headers for API requests
  const getUserHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'x-user-data': JSON.stringify(user || {})
    };
  };

  // Load discounts
  useEffect(() => {
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

    loadDiscounts();
  }, []);

  // Load invoice settings from settings
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

    loadInvoiceSettings();
  }, [user]);

  // Load due date options from settings
  useEffect(() => {
    const loadDueDateOptions = async () => {
      try {
        if (user) {
          const response = await fetch('/api/softwareSettings', {
            headers: getUserHeaders()
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.settings && data.settings.dueDateOptions) {
              setDueDateOptions(data.settings.dueDateOptions);
              
              // Auto select default option
              const defaultOption = data.settings.dueDateOptions.find((opt: any) => opt.isDefault);
              if (defaultOption) {
                setSelectedDueDateOption(defaultOption);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error loading due date options:', error);
      }
    };

    if (user) {
      loadDueDateOptions();
    }
  }, [user]);

  // Debug invoiceItems state changes
  useEffect(() => {
    console.log('🔍 Invoice Items State Changed:', invoiceItems.length, 'items');
    console.log('🔍 Items:', invoiceItems);
    if (isViewMode) {
      console.log('🔍 In View Mode - Items should display');
    }
  }, [invoiceItems, isViewMode]);

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

  // Search free products
  const searchFreeProducts = useCallback(async (search: string) => {
    if (search.length < 2) {
      setFreeProducts([]);
      return;
    }

    try {
      const response = await fetch(`/api/products/search?search=${encodeURIComponent(search)}&limit=10`);
      const data = await response.json();
      if (data.success) {
        setFreeProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error searching free products:', error);
    }
  }, []);

  // Search sales reps
  const searchSalesReps = useCallback(async (search: string) => {
    try {
      const response = await fetch(`/api/sales-rep?search=${encodeURIComponent(search)}&activeOnly=true`);
      const data = await response.json();
      if (data.success) {
        // Filter only active sales reps
        const activeSalesReps = data.salesReps?.filter((rep: SalesRep) => rep.status === 'active') || [];
        setSalesReps(activeSalesReps);
      }
    } catch (error) {
      console.error('Error searching sales reps:', error);
    }
  }, []);

  // Search orders - Only load orders with pending status
  const searchOrders = useCallback(async (search: string) => {
    try {
      const response = await fetch(`/api/orders/search?search=${encodeURIComponent(search)}&status=pending`);
      if (response.ok) {
        const data = await response.json();
        // Handle the API response format: { success: true, orders: [...] }
        if (data.success && Array.isArray(data.orders)) {
          console.log('✅ Loaded orders with pending status:', data.orders.length);
          setOrders(data.orders);
        } else {
          setOrders([]);
        }
      }
    } catch (error) {
      console.error('Error searching orders:', error);
      setOrders([]);
    }
  }, []);

  // Load all pending orders when "Show Orders" button is clicked
  const loadAllOrders = async () => {
    try {
      console.log('Loading all pending orders...');
      const response = await fetch('/api/orders/search?search=&status=pending&limit=100');
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.orders)) {
          console.log('✅ Loaded all pending orders:', data.orders.length);
          setOrders(data.orders);
          setIsOrdersLoaded(true);
          setShowOrderDropdown(true);
        } else {
          setOrders([]);
          alert('No pending orders found');
        }
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      alert('Failed to load orders. Please try again.');
    }
  };

  // Debounced shop search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (shopSearchTerm) {
        searchShops(shopSearchTerm);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [shopSearchTerm, searchShops]);

  // Debounced product search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (productSearchTerm) {
        searchProducts(productSearchTerm);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [productSearchTerm, searchProducts]);

  // Debounced sales rep search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (salesRepSearchTerm) {
        searchSalesReps(salesRepSearchTerm);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [salesRepSearchTerm, searchSalesReps]);

  // Debounced free products search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (freeProductSearchTerm) {
        searchFreeProducts(freeProductSearchTerm);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [freeProductSearchTerm, searchFreeProducts]);

  // Debounced order search - Disabled to prevent automatic loading
  // Orders will only load when "Show Orders" button is clicked
  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     if (orderSearchTerm) {
  //       searchOrders(orderSearchTerm);
  //     }
  //   }, 300);

  //   return () => clearTimeout(timeoutId);
  // }, [orderSearchTerm, searchOrders]);

  // Function to load order details into invoice form
  const loadOrderDetails = async (order: Order) => {
    try {
      // First fetch the complete order details with items
      const response = await fetch(`/api/orders/${order.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }
      
      const data = await response.json();
      const fullOrder = data.success ? data.order : null;
      
      if (!fullOrder || !fullOrder.orderItems) {
        alert('Unable to load order details. Please try again.');
        return;
      }
      
      // Check if the order is still pending before loading
      if (fullOrder.status?.toLowerCase() !== 'pending') {
        alert('Only pending orders can be converted to invoices. This order status is: ' + (fullOrder.status || 'Unknown'));
        return;
      }
      
      console.log('✅ Loading pending order:', fullOrder.orderNumber);
      setSelectedOrder(fullOrder);
      
      // Set shop details
      if (fullOrder.shop) {
        setSelectedShop(fullOrder.shop);
        setShopSearchTerm(fullOrder.shop.shopName);
      }

      // Set sales rep details
      if (fullOrder.salesRep) {
        setSelectedSalesRep(fullOrder.salesRep);
        setSalesRepSearchTerm(fullOrder.salesRep.name);
      }

      // Set discount/invoice type details
      if (fullOrder.discount) {
        setSelectedDiscount(fullOrder.discount);
      }

      // Set cash discount if it was enabled in the order
      if (fullOrder.cashDiscountEnabled) {
        setCashDiscountEnabled(fullOrder.cashDiscountEnabled);
      }

      // Set notes from the order
      if (fullOrder.notes) {
        setNotes(fullOrder.notes);
      }

      // Set invoice items from order items
      const invoiceItems = fullOrder.orderItems.map((orderItem: any) => ({
      id: `${Date.now()}_${Math.random()}`, // Generate unique string ID for invoice item
      productId: orderItem.product.id,
      productCode: orderItem.product.productCode,
      productName: orderItem.product.itemName,
      quantity: orderItem.quantity,
      sellingPrice: Number(orderItem.sellingPrice),
      discount: Number(orderItem.discount || 0),
      price: Number(orderItem.price),
      totalPrice: Number(orderItem.totalPrice),
        availableQty: orderItem.product.availableQty,
        costPrice: Number((orderItem.product as any).totalCost || 0)
      }));

      setInvoiceItems(invoiceItems);
      setShowOrderDropdown(false);
      setOrderSearchTerm(`Order #${fullOrder.id} - ${fullOrder.shop?.shopName || 'N/A'}`);
      
    } catch (error) {
      console.error('Error loading order details:', error);
      alert('Failed to load order details. Please try again.');
    }
  };

  // Add product to invoice
  const addProductToInvoice = (product: Product) => {
    const existingItem = invoiceItems.find(item => item.productId === product.id);
    
    if (existingItem) {
      // Check if we can increase quantity while maintaining minimum stock
      const newQuantity = Number(existingItem.quantity) + 1;
      const maxAllowedQty = product.availableQty - MINIMUM_STOCK_REQUIRED;
      
      if (newQuantity > maxAllowedQty) {
        setError(`Cannot add more ${product.itemName}. Must maintain minimum stock of ${MINIMUM_STOCK_REQUIRED}. Maximum for sale: ${maxAllowedQty}`);
        return;
      }
      
      // Increase quantity if product already exists and recalculate
      setInvoiceItems(items => 
        items.map(item => {
          if (item.productId === product.id) {
            const newPrice = newQuantity * Number(item.sellingPrice);
            const newTotalPrice = newPrice - Number(item.discount);
            return { 
              ...item, 
              quantity: newQuantity,
              price: newPrice,
              totalPrice: newTotalPrice
            };
          }
          return item;
        })
      );
    } else {
      // Check if product has enough stock to sell (must leave at least 1 in stock)
      const availableForSale = product.availableQty - MINIMUM_STOCK_REQUIRED;
      if (availableForSale < 1) {
        setError(`Cannot add ${product.itemName}. Must maintain minimum stock of ${MINIMUM_STOCK_REQUIRED}. Current stock: ${product.availableQty}`);
        return;
      }
      
      // Add new item
      const quantity = 1;
      const sellingPrice = Number(product.sellingPrice);
      const discount = 0;
      const price = quantity * sellingPrice;
      const totalPrice = price - discount;
      
      const newItem: InvoiceItem = {
        id: `item-${Date.now()}-${product.id}`,
        productId: product.id,
        productCode: product.productCode,
        productName: product.itemName,
        quantity: quantity,
        sellingPrice: sellingPrice,
        discount: discount,
        price: price,
        totalPrice: totalPrice,
        availableQty: product.availableQty,
        costPrice: product.costPrice || 0
      };
      
      setInvoiceItems(items => [...items, newItem]);
    }
    
    setProductSearchTerm('');
    setProducts([]);
    setShowProductDropdown(false);
  };

  // Add free product to invoice (selling price = 0) - Always as separate row
  const addFreeProductToInvoice = (product: Product) => {
    // Check if product has enough stock to sell (must leave at least 1 in stock)
    const availableForSale = product.availableQty - MINIMUM_STOCK_REQUIRED;
    if (availableForSale < 1) {
      setError(`Cannot add ${product.itemName}. Must maintain minimum stock of ${MINIMUM_STOCK_REQUIRED}. Current stock: ${product.availableQty}`);
      return;
    }
    
    // Always add as new free item (separate row even if product exists as regular item)
    const quantity = 1;
    const sellingPrice = 0; // Free product selling price is 0
    const discount = 0;
    const price = quantity * sellingPrice;
    const totalPrice = price - discount;
    
    const newItem: InvoiceItem = {
      id: `free-item-${Date.now()}-${product.id}-${Math.random()}`, // Unique ID for free items
      productId: product.id,
      productCode: product.productCode,
      productName: `${product.itemName} (FREE)`, // Mark as free in the name
      quantity: quantity,
      sellingPrice: sellingPrice,
      discount: discount,
      price: price,
      totalPrice: totalPrice,
      availableQty: product.availableQty,
      costPrice: product.costPrice || 0
    };
    
    // Add free items to the end of the list (they will appear at the bottom)
    setInvoiceItems(items => [...items, newItem]);
    
    setFreeProductSearchTerm('');
    setFreeProducts([]);
    setShowFreeProductDropdown(false);
  };

  // Update invoice item with stock validation
  const updateInvoiceItem = (itemId: string, field: string, value: number) => {
    setInvoiceItems(items => 
      items.map(item => {
        if (item.id === itemId) {
          let validatedValue = Number(value);
          
          // If updating quantity, validate against available stock
          if (field === 'quantity') {
            if (validatedValue <= 0) {
              validatedValue = 1; // Minimum quantity is 1
              setError(`Quantity must be at least 1 for ${item.productName}`);
            } else if (validatedValue > item.availableQty) {
              setError(`Cannot save invoice! Quantity ${validatedValue} exceeds available stock (${item.availableQty}) for ${item.productName}. Maximum allowed: ${item.availableQty}`);
              validatedValue = item.availableQty; // Set to maximum available
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

  // Calculate totals with useMemo for real-time updates
  const totals = React.useMemo(() => {
    // Sub Total = sum of all Total Price values in the table - ensure numbers
    const subTotal = invoiceItems.reduce((sum, item) => sum + Number(item.totalPrice), 0);
    const totalDiscount = invoiceItems.reduce((sum, item) => sum + Number(item.discount), 0);
    
    // Invoice Type discount (Credit/Cash discount percentage)
    const invoiceTypeDiscount = selectedDiscount ? Number(subTotal) * (parseFloat(selectedDiscount.percentage.toString()) / 100) : 0;
    
    // Cash discount is applied on the Sub Total (after item discounts)
    const cashDiscount = cashDiscountEnabled ? Number(subTotal) * (invoiceSettings.totalBalanceDiscountPercent / 100) : 0;
    
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
      const itemCashDiscountDeduction = cashDiscountEnabled ? (itemTotalPrice * (invoiceSettings.totalBalanceDiscountPercent / 100)) : 0;
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
  }, [invoiceItems, cashDiscountEnabled, selectedDiscount, invoiceSettings.totalBalanceDiscountPercent]);

  // Calculate due date when invoice date, discount type, or due date option changes
  useEffect(() => {
    if (isCreditInvoice() && invoiceDate && selectedDueDateOption) {
      const invoiceDateObj = new Date(invoiceDate);
      const calculatedDueDate = new Date(invoiceDateObj);
      calculatedDueDate.setDate(calculatedDueDate.getDate() + selectedDueDateOption.days);
      const dueDateISO = calculatedDueDate.toISOString().split('T')[0];
      setDueDate(dueDateISO);
      setDueDateDisplay(formatDateForDisplay(dueDateISO));
    } else {
      setDueDate('');
      setDueDateDisplay('');
    }
  }, [invoiceDate, selectedDiscount, selectedDueDateOption]);

  // Check if selected invoice type is credit
  const isCreditInvoice = () => {
    return selectedDiscount?.discountName?.toLowerCase().includes('credit') || false;
  };

  // Handle due date option change
  const handleDueDateOptionChange = (option: {label: string, days: number, isDefault: boolean}) => {
    setSelectedDueDateOption(option);
  };

  // Check for overdue payments for selected shop
  const checkOverduePayments = async (shopId: number) => {
    try {
      const response = await fetch(`/api/payments?shopId=${shopId}&status=due&limit=100`);
      const data = await response.json();
      
      if (data.success) {
        const overduePmts: OverduePayment[] = data.payments.map((payment: any) => {
          const dueDate = new Date(payment.dueDate);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          dueDate.setHours(0, 0, 0, 0);
          const daysPastDue = Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
          
          return {
            id: payment.id,
            invoiceNumber: payment.invoice.invoiceNumber,
            dueDate: payment.dueDate,
            remainingAmount: Number(payment.remainingAmount) || 0,
            daysPastDue: Math.max(0, daysPastDue)
          };
        });
        
        setOverduePayments(overduePmts);
        setHasOverduePayments(overduePmts.length > 0);
        
        if (overduePmts.length > 0) {
          const totalOverdue = overduePmts.reduce((sum, p) => sum + Number(p.remainingAmount), 0);
          setError(
            `⚠️ This shop has ${overduePmts.length} overdue payment(s) totaling LKR ${totalOverdue.toLocaleString()}. ` +
            `Please settle overdue payments before creating new credit invoices.`
          );
        }
      }
    } catch (error) {
      console.error('Error checking overdue payments:', error);
    }
  };

  // Check credit limit validation
  const validateCreditLimit = () => {
    if (!selectedShop || !isCreditInvoice()) return true;
    
    const availableCredit = (selectedShop.creditLimit || 0) - (selectedShop.balanceAmount || 0);
    return totals.netTotal <= availableCredit;
  };

  // Check if any items have stock validation errors
  const hasStockErrors = () => {
    return invoiceItems.some(item => 
      item.quantity <= 0 || item.quantity > item.availableQty
    );
  };

  // Submit invoice
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

    if (!selectedDiscount) {
      setError('Please select an invoice type');
      return;
    }

    if (invoiceItems.length === 0) {
      setError('Please add at least one product');
      return;
    }

    // Check for overdue payments if creating a credit invoice
    if (isCreditInvoice() && hasOverduePayments) {
      const totalOverdue = overduePayments.reduce((sum, p) => sum + Number(p.remainingAmount), 0);
      setError(
        `❌ Cannot create credit invoice! This shop has ${overduePayments.length} overdue payment(s) totaling LKR ${totalOverdue.toLocaleString()}. ` +
        `Please settle all overdue payments before creating new credit invoices.`
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
      setError(`Cannot save invoice! Stock validation failed:\n${stockErrors.join('\n')}\nPlease adjust quantities before saving.`);
      return;
    }

    // Validate credit limit for credit invoices
    if (isCreditInvoice() && !validateCreditLimit()) {
      const availableCredit = (selectedShop.creditLimit || 0) - (selectedShop.balanceAmount || 0);
      setError(`Credit limit exceeded! Available credit: LKR ${availableCredit.toLocaleString()}. Invoice total: LKR ${totals.netTotal.toLocaleString()}`);
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const payload = {
        ...(isEditing && { id: editingInvoice?.id }),
        invoiceDate,
        shopId: selectedShop.id,
        salesRepId: selectedSalesRep.id,
        discountId: selectedDiscount?.id || null,
        invoiceType: selectedDiscount?.discountName || null,
        invoiceTypePercentage: selectedDiscount?.percentage || null,
        cashDiscountEnabled,
        ...(isCreditInvoice() && dueDate && { dueDate }),
        ...(selectedOrder && { orderNumber: selectedOrder.orderNumber }),
        notes: notes || null,
        items: invoiceItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          sellingPrice: item.sellingPrice,
          discount: item.discount
        }))
      };

      const url = '/api/invoices';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: getUserHeaders(),
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        
        // Store the created invoice ID for printing
        const createdInvoiceId = data.invoice?.id;
        
        // Store last created invoice ID for quick print access
        if (createdInvoiceId && !isEditing) {
          setLastCreatedInvoiceId(createdInvoiceId);
        }
        
        // Show success message briefly, then reset form
        setTimeout(() => {
          if (!isEditing) {
            resetForm();
          }
          setMessage('');
        }, 2000); // Show success message for 2 seconds before resetting
        
        // Show print option for new invoices
        if (createdInvoiceId && !isEditing) {
          setTimeout(() => {
            const shouldPrint = window.confirm('Invoice created successfully! Would you like to print it now?');
            if (shouldPrint) {
              window.open(`/invoices/print/${createdInvoiceId}`, '_blank');
            }
          }, 2500);
        }
      } else {
        setError(data.error || 'Operation failed');
      }
    } catch (error) {
      console.error('Error submitting invoice:', error);
      setError('An error occurred while processing the invoice');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    const today = new Date().toISOString().split('T')[0];
    setInvoiceDate(today);
    setInvoiceDateDisplay(formatDateForDisplay(today));
    setSelectedShop(null);
    setSelectedSalesRep(null);
    setSelectedDiscount(null);
    setCashDiscountEnabled(false);
    setDueDate('');
    setDueDateDisplay('');
    setNotes('');
    setInvoiceItems([]);
    setShopSearchTerm('');
    setSalesRepSearchTerm('');
    setProductSearchTerm('');
    setFreeProductSearchTerm('');
    setShowShopDropdown(false);
    setShowSalesRepDropdown(false);
    setShowProductDropdown(false);
    setShowFreeProductDropdown(false);
    setFreeProducts([]);
    setIsEditing(false);
    setEditingInvoice(null);
    setError('');
    setMessage('');
    setOverduePayments([]);
    setHasOverduePayments(false);
  };

  // Load invoices with search support
  const loadInvoices = useCallback(async (page: number = 1, search: string = '') => {
    setIsLoading(true);
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '5',
        search: search.trim()
      });

      const response = await fetch(`/api/invoices?${params}`, {
        headers: getUserHeaders()
      });
      const data = await response.json();

      if (data.success) {
        setInvoices(data.invoices);
        setPagination(data.pagination);
        setCurrentPage(page);
        console.log('✅ Loaded invoices:', data.invoices.length);
      } else {
        setError(data.error || 'Failed to load invoices');
        setInvoices([]);
      }
    } catch (error) {
      console.error('Error loading invoices:', error);
      setError('An error occurred while loading invoices');
      setInvoices([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Remove auto-loading - invoices will only load when "Load Invoices" button is pressed
  // useEffect(() => {
  //   if (user) {
  //     loadInvoices(1, ''); // Load first page automatically
  //   }
  // }, [user, loadInvoices]);

  // View invoice function
  const viewInvoice = async (invoice: Invoice) => {
    try {
      console.log('🚀 Starting viewInvoice for:', invoice.invoiceNumber, 'ID:', invoice.id);
      
      // Fetch full invoice details
      const response = await fetch(`/api/invoices/${invoice.id}`, {
        headers: getUserHeaders()
      });
      
      console.log('📡 API Response Status:', response.status);
      const data = await response.json();
      console.log('📡 API Response Data:', data);
      
      if (data.success && data.invoice) {
        const fullInvoice = data.invoice;
        
        // Set view mode
        setIsViewMode(true);
        setViewingInvoice(fullInvoice);
        
        // Populate form with invoice data (readonly mode)
        setInvoiceDate(new Date(fullInvoice.invoiceDate).toISOString().split('T')[0]);
        setInvoiceDateDisplay(new Date(fullInvoice.invoiceDate).toLocaleDateString('en-GB'));
        setSelectedShop(fullInvoice.shop);
        setShopSearchTerm(fullInvoice.shop.shopName);
        
        if (fullInvoice.salesRep) {
          setSelectedSalesRep(fullInvoice.salesRep);
          setSalesRepSearchTerm(fullInvoice.salesRep.name);
        }
        
        if (fullInvoice.discount) {
          setSelectedDiscount(fullInvoice.discount);
        }
        
        setCashDiscountEnabled(fullInvoice.cashDiscountEnabled || false);
        setNotes(fullInvoice.notes || '');
        
        // Set due date if available
        if (fullInvoice.dueDate) {
          setDueDate(new Date(fullInvoice.dueDate).toISOString().split('T')[0]);
          setDueDateDisplay(new Date(fullInvoice.dueDate).toLocaleDateString('en-GB'));
        }
        
        // Debug the invoice data structure
        console.log('📦 Full Invoice Data:', fullInvoice);
        console.log('📦 Invoice Items Raw:', fullInvoice.invoiceItems);
        console.log('📦 Free Products Raw:', fullInvoice.freeProducts);
        
        // Convert invoice items from API format to form format
        const formattedItems: InvoiceItem[] = (fullInvoice.invoiceItems || [])
          .map((item: any) => {
            console.log('Processing item:', item);
            return {
              id: `view-${item.productId}-${Date.now()}-${Math.random()}`, // Unique ID for view mode
              productId: item.productId,
              productCode: item.productCode || '',
              productName: item.productName || '',
              quantity: Number(item.quantity || 0),
              sellingPrice: Number(item.sellingPrice || 0),
              discount: Number(item.discount || 0),
              price: Number(item.price || 0),
              totalPrice: Number(item.totalPrice || 0),
              availableQty: Number(item.availableQty || 0),
              costPrice: Number(item.costPrice || 0)
            };
          });
        
        console.log('✅ Formatted Items for Display:', formattedItems);
        console.log('✅ Setting', formattedItems.length, 'items to state');
        setInvoiceItems(formattedItems);
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
      } else {
        alert('Failed to load invoice details');
      }
    } catch (error) {
      console.error('Error viewing invoice:', error);
      alert('An error occurred while loading invoice details');
    }
  };

  // Exit view mode
  const exitViewMode = () => {
    setIsViewMode(false);
    setViewingInvoice(null);
    resetForm();
  };

  // Handle invoice search
  const handleInvoiceSearch = (searchTerm: string) => {
    setInvoiceSearch(searchTerm);
    loadInvoices(1, searchTerm);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages && !isLoading) {
      loadInvoices(page, invoiceSearch);
    }
  };

  // Show loading while checking authorization
  if (authLoading) {
    return <div className={styles.loading}>Checking permissions...</div>;
  }

  // Show access denied if not authorized
  if (!isAuthorized) {
    return <div className={styles.accessDenied}>Access denied to invoice management</div>;
  }

  return (
    <div className={`${styles.container} ${isDarkMode ? 'dark' : 'light'}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {isViewMode ? `View Invoice - ${viewingInvoice?.invoiceNumber}` : 
           isEditing ? 'Edit Invoice' : 'Create Invoice'}
        </h1>
        <p className={styles.subtitle}>
          {isViewMode ? 'Viewing invoice details (read-only mode)' :
           isEditing ? 'Edit invoice details' : 'Create and manage invoices for your business'}
        </p>
        
        {(isEditing || isViewMode) && (
          <button
            type="button"
            onClick={isViewMode ? exitViewMode : resetForm}
            className={styles.clearButton}
          >
            {isViewMode ? 'Back to Create' : 'Cancel Edit'}
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Load from Order (Optional) */}
        <div className={styles.field}>
          <div className={styles.labelRow}>
            <label className={styles.label}>Load from Order (Optional):</label>
            <button
              type="button"
              onClick={loadAllOrders}
              className={styles.showOrdersButton}
              disabled={isLoading}
            >
              Show Orders
            </button>
          </div>
          <div className={styles.searchContainer}>
            <input
              type="text"
              value={selectedOrder ? `Order #${selectedOrder.id} - ${selectedOrder.shop?.shopName || 'N/A'}` : orderSearchTerm}
              onChange={(e) => {
                if (!selectedOrder && isOrdersLoaded) {
                  const value = e.target.value;
                  setOrderSearchTerm(value);
                  // Filter loaded orders based on search term
                  if (value.trim()) {
                    const filteredOrders = orders.filter(order =>
                      order.orderNumber.toLowerCase().includes(value.toLowerCase()) ||
                      order.shop?.shopName?.toLowerCase().includes(value.toLowerCase()) ||
                      order.notes?.toLowerCase().includes(value.toLowerCase())
                    );
                    setOrders(filteredOrders);
                  } else {
                    // If search is empty, reload all orders
                    loadAllOrders();
                  }
                  setShowOrderDropdown(true);
                }
              }}
              onFocus={() => {
                if (isOrdersLoaded) {
                  setShowOrderDropdown(true);
                }
              }}
              onBlur={() => {
                // Delay hiding to allow clicking on dropdown items
                setTimeout(() => setShowOrderDropdown(false), 150);
              }}
              placeholder={isOrdersLoaded ? "Search loaded orders..." : "Click 'Show Orders' to load orders first"}
              className={styles.input}
              disabled={isLoading || !isOrdersLoaded}
            />
            
            {selectedOrder && (
              <button
                type="button"
                onClick={() => {
                  setSelectedOrder(null);
                  setOrderSearchTerm('');
                  setShowOrderDropdown(false);
                  setIsOrdersLoaded(false);
                  setOrders([]);
                  // Optionally reset the form when clearing order
                  // resetForm();
                }}
                className={styles.clearButton}
                disabled={isLoading}
              >
                Clear Order
              </button>
            )}
            
            {showOrderDropdown && isOrdersLoaded && orders.length > 0 && (
              <div className={styles.dropdown}>
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className={styles.dropdownItem}
                    onClick={() => loadOrderDetails(order)}
                  >
                    <div className={styles.orderInfo}>
                      <strong>Order #{order.id}</strong>
                      <span className={styles.shopName}>{order.shop?.shopName || 'N/A'}</span>
                      <span className={styles.orderDate}>
                        {new Date(order.orderDate).toLocaleDateString()}
                      </span>
                      <span className={styles.orderTotal}>
                        Rs. {Number(order.netTotal || 0).toFixed(2)}
                      </span>
                      {order.notes && (
                        <span className={styles.orderNotes}>{order.notes}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Show message when orders are loaded but none found */}
            {showOrderDropdown && isOrdersLoaded && orders.length === 0 && (
              <div className={styles.dropdown}>
                <div className={styles.noOrdersMessage}>
                  No pending orders found{orderSearchTerm ? ` matching "${orderSearchTerm}"` : ''}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Date and Shop Selection */}
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
              disabled={isLoading}
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
                    const value = e.target.value;
                    setSalesRepSearchTerm(value);
                    // Show dropdown only if there's text, hide if empty
                    setShowSalesRepDropdown(value.length > 0);
                  }
                }}
                onFocus={() => setShowSalesRepDropdown(true)}
                onBlur={() => {
                  // Delay hiding to allow clicking on dropdown items
                  setTimeout(() => setShowSalesRepDropdown(false), 150);
                }}
                placeholder="Type to search sales representatives..."
                className={styles.input}
                disabled={isLoading}
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
                  disabled={isLoading}
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
            <label className={styles.label}>Select Shop/Customer: *</label>
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
                placeholder="Search shop by name or owner..."
                className={styles.input}
                disabled={isLoading}
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
                      onClick={async () => {
                        setSelectedShop(shop);
                        setShopSearchTerm('');
                        setShowShopDropdown(false);
                        setError(''); // Clear any existing errors
                        setOverduePayments([]);
                        setHasOverduePayments(false);
                        
                        // Check for overdue payments for this shop
                        await checkOverduePayments(shop.id);
                      }}
                      className={styles.dropdownItem}
                    >
                      <div className={styles.shopInfo}>
                        <div className={styles.shopName}>{shop.shopName}</div>
                        <div className={styles.shopOwner}>{shop.ownerName} • {shop.contactNumber}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Shop Details Display */}
        {selectedShop && (
          <div className={styles.shopDetailsSection}>
            <div className={styles.shopDetailsCard}>
              <h3 className={styles.shopDetailsTitle}>Shop Information</h3>
              <div className={styles.shopDetailsGrid}>
                <div className={styles.shopDetailItem}>
                  <span className={styles.detailLabel}>Shop Name:</span>
                  <span className={styles.detailValue}>{selectedShop.shopName}</span>
                </div>
                <div className={styles.shopDetailItem}>
                  <span className={styles.detailLabel}>Owner:</span>
                  <span className={styles.detailValue}>{selectedShop.ownerName}</span>
                </div>
                <div className={styles.shopDetailItem}>
                  <span className={styles.detailLabel}>Contact:</span>
                  <span className={styles.detailValue}>{selectedShop.contactNumber}</span>
                </div>
                <div className={styles.shopDetailItem}>
                  <span className={styles.detailLabel}>Credit Limit:</span>
                  <span className={styles.detailValue}>LKR {selectedShop.creditLimit?.toLocaleString() || '0'}</span>
                </div>
                <div className={styles.shopDetailItem}>
                  <span className={styles.detailLabel}>Current Balance:</span>
                  <span className={styles.detailValue}>LKR {selectedShop.balanceAmount?.toLocaleString() || '0'}</span>
                </div>
                <div className={styles.shopDetailItem}>
                  <span className={styles.detailLabel}>Available Credit:</span>
                  <span className={`${styles.detailValue} ${
                    ((selectedShop.creditLimit || 0) - (selectedShop.balanceAmount || 0)) <= 0 
                      ? styles.creditExceeded 
                      : styles.availableCredit
                  }`}>
                    LKR {((selectedShop.creditLimit || 0) - (selectedShop.balanceAmount || 0)).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Overdue Payments Warning */}
        {selectedShop && hasOverduePayments && (
          <div className={styles.overdueWarningSection}>
            <div className={styles.overdueWarningCard}>
              <h3 className={styles.overdueWarningTitle}>⚠️ Overdue Payments Alert</h3>
              <p className={styles.overdueWarningMessage}>
                This shop has {overduePayments.length} overdue payment(s). Credit invoices cannot be created until all overdue payments are settled.
              </p>
              <div className={styles.overduePaymentsList}>
                {overduePayments.map((payment) => (
                  <div key={payment.id} className={styles.overduePaymentItem}>
                    <div className={styles.overdueInvoice}>Invoice: {payment.invoiceNumber}</div>
                    <div className={styles.overdueDays}>{payment.daysPastDue} days overdue</div>
                    <div className={styles.overdueAmount}>LKR {Number(payment.remainingAmount).toLocaleString()}</div>
                  </div>
                ))}
              </div>
              <div className={styles.overdueTotalSection}>
                <strong className={styles.overdueTotal}>
                  Total Overdue: LKR {overduePayments.reduce((sum, p) => sum + Number(p.remainingAmount), 0).toLocaleString()}
                </strong>
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
              disabled={isLoading}
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
              disabled={isLoading}
              rows={1}
            />
          </div>
          
          {/* Payment Terms - Show in third column if credit invoice */}
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
                disabled={isLoading}
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

        {/* Payment Due Date for Credit Invoices */}
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
                    
                    // Convert to ISO format if valid
                    if (isValidDate(formattedValue)) {
                      const isoDate = formatDateForInput(formattedValue);
                      if (isoDate) {
                        setDueDate(isoDate);
                      }
                    }
                  }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (!isValidDate(value) && dueDate) {
                      // Reset to calculated date if invalid
                      setDueDateDisplay(formatDateForDisplay(dueDate));
                    }
                  }}
                  className={styles.input}
                  disabled={isLoading}
                  maxLength={10}
                />
                <small style={{ color: '#666', fontSize: '0.85em', marginTop: '4px', display: 'block' }}>
                  💡 Calculated from: Invoice Date + {selectedDueDateOption?.days || 0} days
                </small>
              </div>
            </div>
          )}



        {/* Product Search Row - Add Products and Add Free Products on same line */}
        <div className={styles.productSearchRow}>
          <div className={styles.productSearchSection}>
            <label className={styles.label}>Add Products:</label>
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
                placeholder="Search products by code or name..."
                className={styles.input}
                disabled={isLoading}
              />

              {showProductDropdown && products.length > 0 && (
                <div className={styles.dropdown}>
                  {products.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => addProductToInvoice(product)}
                      className={styles.dropdownItem}
                    >
                      <div className={styles.productInfo}>
                        <div className={styles.productName}>
                          <span className={styles.productCode}>{product.productCode}</span>
                          <span className={styles.productTitle}>{product.itemName}</span>
                        </div>
                        <div className={styles.productDetails}>
                          <span>Price: LKR {product.sellingPrice.toLocaleString()}</span>
                          <span>Available: {product.availableQty}</span>
                          <span>Category: {product.category}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={styles.productSearchSection}>
            <label className={styles.label}>Add Free Products:</label>
            <div className={styles.searchContainer}>
              <input
                type="text"
                value={freeProductSearchTerm}
                onChange={(e) => {
                  const value = e.target.value;
                  setFreeProductSearchTerm(value);
                  // Show dropdown only if there's text, hide if empty
                  setShowFreeProductDropdown(value.length > 0);
                }}
                onFocus={() => setShowFreeProductDropdown(true)}
                onBlur={() => {
                  // Delay hiding to allow clicking on dropdown items
                  setTimeout(() => setShowFreeProductDropdown(false), 150);
                }}
                placeholder="Search products to add as free items (price = 0)..."
                className={styles.input}
                disabled={isLoading}
              />

              {showFreeProductDropdown && freeProducts.length > 0 && (
                <div className={styles.dropdown}>
                  {freeProducts.map((product) => (
                    <div
                      key={`free-${product.id}`}
                      onClick={() => addFreeProductToInvoice(product)}
                      className={styles.dropdownItem}
                    >
                      <div className={styles.productInfo}>
                        <div className={styles.productName}>
                          <span className={styles.productCode}>{product.productCode}</span>
                          <span className={styles.productTitle}>{product.itemName} (FREE)</span>
                        </div>
                        <div className={styles.productDetails}>
                          <span>Original Price: LKR {product.sellingPrice.toLocaleString()}</span>
                          <span>Free Price: LKR 0</span>
                          <span>Available: {product.availableQty}</span>
                          <span>Category: {product.category}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Invoice Items Table */}
        {invoiceItems.length > 0 && (
          <div className={styles.itemsSection}>
            <h3 className={styles.sectionTitle}>Invoice Items</h3>
            <div className={styles.itemsTable}>
              <div className={`${styles.itemsHeader} ${!invoiceSettings.showTotalDiscountFromItems ? styles.itemsHeaderNoDiscount : ''}`}>
                <div>Product Code</div>
                <div>Product Name</div>
                <div>Qty</div>
                <div>Selling Price</div>
                {invoiceSettings.showTotalDiscountFromItems && <div>Discount</div>}
                <div>Price</div>
                {!invoiceSettings.hideCostProfit && <div>Cost</div>}
                {!invoiceSettings.hideCostProfit && <div>Profit</div>}
                <div>Total Price</div>
                <div>Actions</div>
              </div>
              <div className={styles.itemsBody}>
                {invoiceItems
                  .sort((a, b) => {
                    // Sort free items (selling price = 0) to the bottom
                    if (a.sellingPrice === 0 && b.sellingPrice !== 0) return 1;
                    if (a.sellingPrice !== 0 && b.sellingPrice === 0) return -1;
                    return 0; // Keep original order for items of same type
                  })
                  .map((item) => (
                  <div key={item.id} className={`${styles.itemRow} ${!invoiceSettings.showTotalDiscountFromItems ? styles.itemRowNoDiscount : ''}`}>
                    <div className={styles.productCode}>{item.productCode}</div>
                    <div className={styles.productName}>{item.productName}</div>
                    <div className={styles.quantity}>
                      <input
                        type="number"
                        min="1"
                        max={item.availableQty}
                        step="1"
                        value={item.quantity}
                        onChange={(e) => updateInvoiceItem(item.id, 'quantity', parseFloat(e.target.value) || 1)}
                        onWheel={handleNumberInputWheel}
                        className={`${styles.quantityInput} ${item.quantity > item.availableQty ? styles.quantityError : ''}`}
                        title={`Available stock: ${item.availableQty}`}
                        readOnly={isViewMode}
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
                        readOnly={isViewMode || invoiceSettings.isSellingPriceReadonly || item.sellingPrice === 0}
                        title={
                          isViewMode ? 'View mode - cannot edit' :
                          item.sellingPrice === 0 
                            ? 'Free item - selling price cannot be changed' 
                            : (invoiceSettings.isSellingPriceReadonly ? 'Selling price is read-only (configured in settings)' : '')
                        }
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
                          readOnly={isViewMode || invoiceSettings.isDiscountReadonly || item.sellingPrice === 0}
                          title={
                            isViewMode ? 'View mode - cannot edit' :
                            item.sellingPrice === 0 
                              ? 'Free item - no additional discount can be applied' 
                              : (invoiceSettings.isDiscountReadonly ? 'Discount is read-only (configured in settings)' : '')
                          }
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
                          // Invoice Type deduction (Credit/Cash Discount %)
                          const invoiceTypeDeduction = selectedDiscount ? (item.totalPrice * (parseFloat(selectedDiscount.percentage.toString()) / 100)) : 0;
                          
                          // Cash Discount deduction (if enabled)
                          const cashDiscountDeduction = cashDiscountEnabled ? (item.totalPrice * (invoiceSettings.totalBalanceDiscountPercent / 100)) : 0;
                          
                          // Calculate final profit: Total Price - Invoice Type % - Cash Discount % - Total Cost
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
                      {!isViewMode && (
                        <button
                          type="button"
                          onClick={() => removeInvoiceItem(item.id)}
                          className={styles.removeButton}
                        >
                          Remove
                        </button>
                      )}
                      {isViewMode && (
                        <span className={styles.viewModeLabel}>View Only</span>
                      )}
                    </div>
                  </div>
                ))}
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
                      <span>Cash Discount ({invoiceSettings.totalBalanceDiscountPercent}%):</span>
                    </label>
                    <span>
                      {cashDiscountEnabled && totals.cashDiscount > 0
                        ? `- LKR ${totals.cashDiscount.toLocaleString()}`
                        : 'LKR 0'}
                    </span>
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
          </div>
        )}

        {error && <div className={styles.error}>{error}</div>}
        {message && <div className={styles.success}>{message}</div>}

        {/* Submit and Print buttons section */}
        <div className={styles.submitSection}>
          {/* Show submit button for create/edit modes */}
          {!isViewMode && (
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isLoading || !selectedShop || !selectedDiscount || invoiceItems.length === 0 || hasStockErrors() || (isCreditInvoice() && hasOverduePayments)}
              title={
                hasStockErrors() ? "Cannot save: Some items exceed available stock" : 
                (isCreditInvoice() && hasOverduePayments) ? "Cannot create credit invoice: Shop has overdue payments" : ""
              }
            >
              {isLoading ? 'Processing...' : hasStockErrors() ? 'Check Stock Quantities' : (isEditing ? 'Update Invoice' : 'Create Invoice')}
            </button>
          )}
          
          {/* Print Last Invoice Button - Show next to Create Invoice button */}
          {!isViewMode && lastCreatedInvoiceId && (
            <button 
              type="button"
              onClick={() => window.open(`/invoices/print/${lastCreatedInvoiceId}`, '_blank')}
              className={styles.printLastInvoiceButton}
              disabled={isLoading}
              title="Print the last created invoice"
            >
              🖨️ Print Last Invoice
            </button>
          )}
          
          {/* Show print button in view mode */}
          {isViewMode && viewingInvoice && (
            <button 
              type="button"
              onClick={() => window.open(`/invoices/print/${viewingInvoice.id}`, '_blank')}
              className={styles.printInvoiceButton}
              disabled={isLoading}
            >
              🖨️ Print This Invoice
            </button>
          )}
        </div>
      </form>

      {/* Invoices List Section */}
      <div className={styles.invoicesList}>
        <div className={styles.invoicesHeader}>
          <h2 className={styles.subtitle}>Recent Invoices</h2>
          <div className={styles.invoicesControls}>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search by invoice number or shop name..."
                value={invoiceSearch}
                onChange={(e) => setInvoiceSearch(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleInvoiceSearch(invoiceSearch);
                  }
                }}
                className={styles.searchInput}
              />
              <button
                onClick={() => handleInvoiceSearch(invoiceSearch)}
                className={styles.searchButton}
                disabled={isLoading}
              >
                🔍
              </button>
            </div>
            <button
              onClick={() => loadInvoices(1, invoiceSearch)}
              className={styles.loadButton}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Load Latest 5 Invoices'}
            </button>
          </div>
        </div>

        {invoices.length > 0 && (
          <>
            <div className={styles.invoicesTable}>
              <div className={styles.tableHeader}>
                <div>Invoice #</div>
                <div>Date</div>
                <div>Shop</div>
                <div>Items</div>
                <div>Net Total</div>
                <div>Notes</div>
                <div>Actions</div>
              </div>
              <div className={styles.tableBody}>
                {invoices.map((invoice) => (
                  <div key={invoice.id} className={styles.tableRow}>
                    <div className={styles.invoiceNumber}>{invoice.invoiceNumber}</div>
                    <div>{new Date(invoice.invoiceDate).toLocaleDateString()}</div>
                    <div>{invoice.shop.shopName}</div>
                    <div>{invoice.invoiceItems.length} items</div>
                    <div>LKR {Number(invoice.netTotal).toLocaleString()}</div>
                    <div className={styles.notes} title={invoice.notes || 'No notes'}>
                      {invoice.notes ? (invoice.notes.length > 30 ? `${invoice.notes.substring(0, 30)}...` : invoice.notes) : '-'}
                    </div>
                    <div className={styles.actions}>
                      <button 
                        className={styles.viewButton}
                        onClick={() => viewInvoice(invoice)}
                        disabled={isLoading}
                      >
                        View
                      </button>
                      <button 
                        className={styles.printButton}
                        onClick={() => window.open(`/invoices/print/${invoice.id}`, '_blank')}
                        disabled={isLoading}
                        title="Print Invoice"
                      >
                        Print
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className={styles.pagination}>
                <div className={styles.paginationInfo}>
                  <span>
                    Page {pagination.currentPage} of {pagination.totalPages} 
                    ({pagination.totalCount} total invoices)
                    {invoiceSearch && <span> | Filtered by: "{invoiceSearch}"</span>}
                  </span>
                </div>
                <div className={styles.paginationButtons}>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!pagination.hasPrev || isLoading}
                    className={styles.pageButton}
                  >
                    ← Previous
                  </button>
                  
                  {/* Page numbers */}
                  {(() => {
                    const pages = [];
                    const totalPages = pagination.totalPages;
                    const current = currentPage;
                    
                    if (totalPages <= 5) {
                      // Show all pages if 5 or fewer
                      for (let i = 1; i <= totalPages; i++) {
                        pages.push(i);
                      }
                    } else {
                      // Show smart pagination
                      pages.push(1);
                      
                      if (current > 3) {
                        pages.push('...');
                      }
                      
                      const start = Math.max(2, current - 1);
                      const end = Math.min(totalPages - 1, current + 1);
                      
                      for (let i = start; i <= end; i++) {
                        if (!pages.includes(i)) {
                          pages.push(i);
                        }
                      }
                      
                      if (current < totalPages - 2) {
                        pages.push('...');
                      }
                      
                      if (!pages.includes(totalPages)) {
                        pages.push(totalPages);
                      }
                    }
                    
                    return pages.map((page, index) => (
                      page === '...' ? (
                        <span key={`ellipsis-${index}`} className={styles.ellipsis}>...</span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page as number)}
                          className={`${styles.pageButton} ${page === currentPage ? styles.activePage : ''}`}
                          disabled={isLoading}
                        >
                          {page}
                        </button>
                      )
                    ));
                  })()}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!pagination.hasNext || isLoading}
                    className={styles.pageButton}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* No invoices message */}
        {invoices.length === 0 && !isLoading && (
          <div className={styles.noInvoices}>
            <p>No invoices found{invoiceSearch ? ` matching "${invoiceSearch}"` : ''}.</p>
            <p>Click "Load Latest 5 Invoices" to fetch recent invoices.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceManagement;