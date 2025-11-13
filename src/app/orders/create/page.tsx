'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePageProtection } from '@/components/ProtectedRoute';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { handleNumberInputWheel } from '@/lib/numberInputUtils';
import styles from './order.module.css';

interface Shop {
  id: number;
  shopName: string;
  ownerName: string;
  contactNumber: string;
  address: string;
  creditLimit: number;
  balanceAmount: number;
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
  totalCost: number;
  category: {
    id: number;
    category: string;
  };
}

interface OrderItem {
  id: string;
  productId: number;
  productCode: string;
  productName: string;
  quantity: number;
  sellingPrice: number;
  discount: number;
  availableQty: number;
  costPrice: number;
}

const OrderCreation: React.FC = () => {
  // Navigation
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Edit mode detection
  const editId = searchParams?.get('editId');
  const isEditMode = !!editId;
  
  // Page protection
  const { isAuthorized, isLoading: authLoading } = usePageProtection('orders');
  
  // Theme context
  const { isDarkMode } = useTheme();
  
  // Auth context
  const { user } = useAuth();

  // Edit mode states
  const [isLoadingOrder, setIsLoadingOrder] = useState(isEditMode);
  const [existingOrder, setExistingOrder] = useState<any>(null);

  // Form state
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [selectedSalesRep, setSelectedSalesRep] = useState<SalesRep | null>(null);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);
  const [cashDiscountEnabled, setCashDiscountEnabled] = useState(false);
  const [notes, setNotes] = useState('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  // Search states
  const [shopSearch, setShopSearch] = useState('');
  const [shopResults, setShopResults] = useState<Shop[]>([]);
  const [showShopResults, setShowShopResults] = useState(false);
  
  const [salesRepSearch, setSalesRepSearch] = useState('');
  const [salesRepResults, setSalesRepResults] = useState<SalesRep[]>([]);
  const [showSalesRepResults, setShowSalesRepResults] = useState(false);
  
  const [productSearch, setProductSearch] = useState('');
  const [productResults, setProductResults] = useState<Product[]>([]);
  const [showProductResults, setShowProductResults] = useState(false);

  // Free products states
  const [freeProductSearch, setFreeProductSearch] = useState('');
  const [freeProductResults, setFreeProductResults] = useState<Product[]>([]);
  const [showFreeProductResults, setShowFreeProductResults] = useState(false);

  // Data states
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  
  // Credit validation state
  const [isCreditExceeded, setIsCreditExceeded] = useState(false);
  
  // Overdue payments state
  const [overduePayments, setOverduePayments] = useState<OverduePayment[]>([]);
  const [hasOverduePayments, setHasOverduePayments] = useState(false);
  
  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Settings state for cash discount percentage and order controls
  const [cashDiscountPercent, setCashDiscountPercent] = useState(5);
  const [orderSettings, setOrderSettings] = useState({
    hideSellingPrice: false,
    hideDiscount: false,
    hideFreeProducts: false,
    hideCashDiscount: false
  });

  // Get user headers for API requests
  const getUserHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'x-user-data': JSON.stringify(user || {})
    };
  };

  // Load initial data
  useEffect(() => {
    if (isAuthorized) {
      loadDiscounts();
      loadSettings();
      if (isEditMode && editId) {
        loadExistingOrder();
      }
    }
  }, [isAuthorized, isEditMode, editId]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      // Close shop dropdown if click is outside shop search container
      if (showShopResults && !target.closest('.shop-search-container')) {
        setShowShopResults(false);
      }
      
      // Close sales rep dropdown if click is outside sales rep search container
      if (showSalesRepResults && !target.closest('.salesrep-search-container')) {
        setShowSalesRepResults(false);
      }
      
      // Close product dropdown if click is outside product search container
      if (showProductResults && !target.closest('.product-search-container')) {
        setShowProductResults(false);
      }
      
      // Close free product dropdown if click is outside free product search container
      if (showFreeProductResults && !target.closest('.freeproduct-search-container')) {
        setShowFreeProductResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShopResults, showSalesRepResults, showProductResults, showFreeProductResults]);

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

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/softwareSettings', {
        headers: getUserHeaders()
      });
      const data = await response.json();
      if (data.success && data.settings) {
        setCashDiscountPercent(data.settings.totalBalanceDiscountPercent || 5);
        setOrderSettings({
          hideSellingPrice: data.settings.hideSellingPrice || false,
          hideDiscount: data.settings.hideDiscount || false,
          hideFreeProducts: data.settings.hideFreeProducts || false,
          hideCashDiscount: data.settings.hideCashDiscount || false
        });
        console.log('✅ Loaded order settings:', {
          hideSellingPrice: data.settings.hideSellingPrice || false,
          hideDiscount: data.settings.hideDiscount || false,
          hideFreeProducts: data.settings.hideFreeProducts || false,
          hideCashDiscount: data.settings.hideCashDiscount || false
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadExistingOrder = async () => {
    try {
      setIsLoadingOrder(true);
      const response = await fetch(`/api/orders/${editId}`);
      const data = await response.json();
      
      if (!data.success) {
        setError(data.error || 'Failed to load order');
        return;
      }

      const orderData = data.order;
      
      // Check if order is pending
      if (orderData.status.toLowerCase() !== 'pending') {
        setError('Only pending orders can be edited');
        setTimeout(() => router.push('/orders'), 2000);
        return;
      }

      setExistingOrder(orderData);
      
      // Pre-populate form data
      setOrderDate(new Date(orderData.orderDate).toISOString().split('T')[0]);
      setSelectedShop(orderData.shop);
      setShopSearch(orderData.shop.shopName);
      
      if (orderData.salesRep) {
        setSelectedSalesRep(orderData.salesRep);
        setSalesRepSearch(orderData.salesRep.name);
      }
      
      if (orderData.discount) {
        setSelectedDiscount(orderData.discount);
      }
      
      setNotes(orderData.notes || '');
      
      // Convert order items to form format
      const formattedItems: OrderItem[] = orderData.orderItems.map((item: any, index: number) => ({
        id: `item-${item.id}-${index}`,
        productId: item.product.id,
        productCode: item.product.productCode,
        productName: item.sellingPrice === 0 ? `${item.product.itemName} (FREE)` : item.product.itemName,
        quantity: Number(item.quantity) || 0,
        sellingPrice: Number(item.sellingPrice) || 0,
        discount: Number(item.discount) || 0,
        availableQty: (item.product.availableQty || 0) + (item.quantity || 0),
        costPrice: item.product.availableQty > 0 ? Number(item.product.totalCost) / item.product.availableQty : 0
      }));
      
      setOrderItems(formattedItems);
      
    } catch (error) {
      console.error('Error loading order:', error);
      setError('Failed to load order');
    } finally {
      setIsLoadingOrder(false);
    }
  };

  // Search functions
  const searchShops = useCallback(async (searchTerm: string) => {
    if (searchTerm.length < 2) {
      setShopResults([]);
      return;
    }

    try {
      const response = await fetch(`/api/shops?search=${encodeURIComponent(searchTerm)}&limit=10&activeOnly=true`);
      const data = await response.json();
      if (data.success) {
        setShopResults(data.shops || []);
      }
    } catch (error) {
      console.error('Error searching shops:', error);
    }
  }, []);

  const searchSalesReps = useCallback(async (searchTerm: string) => {
    if (searchTerm.length < 2) {
      setSalesRepResults([]);
      return;
    }

    try {
      const response = await fetch(`/api/sales-rep?search=${encodeURIComponent(searchTerm)}&activeOnly=true`);
      const data = await response.json();
      if (data.success) {
        setSalesRepResults(data.salesReps || []);
      }
    } catch (error) {
      console.error('Error searching sales reps:', error);
    }
  }, []);

  const searchProducts = useCallback(async (searchTerm: string) => {
    if (searchTerm.length < 2) {
      setProductResults([]);
      return;
    }

    try {
      const response = await fetch(`/api/products/search?search=${encodeURIComponent(searchTerm)}&limit=10`);
      const data = await response.json();
      if (data.success) {
        setProductResults(data.products || []);
      }
    } catch (error) {
      console.error('Error searching products:', error);
    }
  }, []);

  const searchFreeProducts = useCallback(async (searchTerm: string) => {
    if (searchTerm.length < 2) {
      setFreeProductResults([]);
      return;
    }

    try {
      const response = await fetch(`/api/products/search?search=${encodeURIComponent(searchTerm)}&limit=10`);
      const data = await response.json();
      if (data.success) {
        setFreeProductResults(data.products || []);
      }
    } catch (error) {
      console.error('Error searching free products:', error);
    }
  }, []);

  // Handle search input changes with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (shopSearch) {
        searchShops(shopSearch);
        setShowShopResults(true);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [shopSearch, searchShops]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (salesRepSearch) {
        searchSalesReps(salesRepSearch);
        setShowSalesRepResults(true);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [salesRepSearch, searchSalesReps]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (productSearch) {
        searchProducts(productSearch);
        setShowProductResults(true);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [productSearch, searchProducts]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (freeProductSearch) {
        searchFreeProducts(freeProductSearch);
        setShowFreeProductResults(true);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [freeProductSearch, searchFreeProducts]);

  // Monitor order changes for credit validation
  useEffect(() => {
    checkOrderCanBeSaved();
  }, [orderItems, selectedShop, selectedDiscount, cashDiscountEnabled]);

  // Selection handlers
  const selectShop = async (shop: Shop) => {
    setSelectedShop(shop);
    setShopSearch(shop.shopName);
    setShowShopResults(false);
    console.log('Shop selected, dropdown should close');
    
    // Clear previous overdue payments
    setOverduePayments([]);
    setHasOverduePayments(false);
    
    // Check for overdue payments for this shop
    await checkOverduePayments(shop.id);
  };

  const selectSalesRep = (salesRep: SalesRep) => {
    setSelectedSalesRep(salesRep);
    setSalesRepSearch(salesRep.name);
    setShowSalesRepResults(false);
    console.log('Sales rep selected, dropdown should close');
  };

  // Credit validation function
  const validateCreditLimit = (orderTotal: number): { isValid: boolean; message?: string } => {
    if (!selectedShop) {
      return { isValid: false, message: 'Please select a shop first' };
    }

    // If discount type is not "credit", allow the order
    if (!selectedDiscount || selectedDiscount.discountName.toLowerCase() !== 'credit') {
      return { isValid: true };
    }

    const creditLimit = selectedShop.creditLimit || 0;
    const currentBalance = selectedShop.balanceAmount || 0;
    const availableCredit = creditLimit - currentBalance;

    if (orderTotal > availableCredit) {
      return { 
        isValid: false, 
        message: `Order total (Rs ${orderTotal.toLocaleString()}) exceeds available credit (Rs ${availableCredit.toLocaleString()})` 
      };
    }

    return { isValid: true };
  };

  // Check if current order can be saved (for button state)
  const checkOrderCanBeSaved = () => {
    if (!selectedShop || orderItems.length === 0) {
      setIsCreditExceeded(false);
      return;
    }

    // If discount type is not "credit", allow the order
    if (!selectedDiscount || selectedDiscount.discountName.toLowerCase() !== 'credit') {
      setIsCreditExceeded(false);
      return;
    }

    // Calculate current order total
    const orderTotal = orderItems.reduce((total, item) => {
      const itemTotal = (item.quantity * item.sellingPrice) - item.discount;
      return total + itemTotal;
    }, 0);

    // Apply discount percentage if selected
    let finalOrderTotal = orderTotal;
    if (selectedDiscount) {
      const discountAmount = (orderTotal * selectedDiscount.percentage) / 100;
      finalOrderTotal = orderTotal - discountAmount;
    }

    // Apply cash discount if enabled
    if (cashDiscountEnabled) {
      const cashDiscountAmount = (finalOrderTotal * cashDiscountPercent) / 100;
      finalOrderTotal = finalOrderTotal - cashDiscountAmount;
    }

    // Check credit limit
    const creditValidation = validateCreditLimit(finalOrderTotal);
    setIsCreditExceeded(!creditValidation.isValid);
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
            `⚠️ This shop has ${overduePmts.length} overdue payment(s) totaling Rs ${totalOverdue.toLocaleString()}. ` +
            `Please settle overdue payments before creating new orders.`
          );
        } else {
          // Clear error if no overdue payments
          if (error.includes('overdue payment')) {
            setError('');
          }
        }
      }
    } catch (error) {
      console.error('Error checking overdue payments:', error);
    }
  };

  const addProduct = (product: Product) => {
    // Check if product already exists
    if (orderItems.find(item => item.productId === product.id)) {
      setError('Product already added to order');
      return;
    }

    const newItem: OrderItem = {
      id: `item-${Date.now()}`,
      productId: product.id,
      productCode: product.productCode,
      productName: product.itemName,
      quantity: 1,
      sellingPrice: Number(product.sellingPrice),
      discount: 0,
      availableQty: product.availableQty,
      costPrice: product.availableQty > 0 ? Number(product.totalCost) / product.availableQty : 0
    };

    // Calculate new order total with this item
    const currentTotal = orderItems.reduce((total, item) => {
      const itemTotal = (item.quantity * item.sellingPrice) - item.discount;
      return total + itemTotal;
    }, 0);
    const newItemTotal = newItem.quantity * newItem.sellingPrice - newItem.discount;
    const newOrderTotal = currentTotal + newItemTotal;

    // Apply discount percentage if selected
    let finalOrderTotal = newOrderTotal;
    if (selectedDiscount) {
      const discountAmount = (newOrderTotal * selectedDiscount.percentage) / 100;
      finalOrderTotal = newOrderTotal - discountAmount;
    }

    // Apply cash discount if enabled
    if (cashDiscountEnabled) {
      const cashDiscountAmount = (finalOrderTotal * cashDiscountPercent) / 100;
      finalOrderTotal = finalOrderTotal - cashDiscountAmount;
    }

    // Validate credit limit for credit orders
    const creditValidation = validateCreditLimit(finalOrderTotal);
    if (!creditValidation.isValid) {
      setError(creditValidation.message || 'Credit limit exceeded');
      return;
    }

    setOrderItems(prev => [...prev, newItem]);
    setProductSearch('');
    setShowProductResults(false);
    setError(''); // Clear any previous errors
  };

  const addFreeProduct = (product: Product) => {
    // Always add as new free item (separate row even if product exists as regular item)
    const newItem: OrderItem = {
      id: `free-item-${Date.now()}-${product.id}-${Math.random()}`, // Unique ID for free items
      productId: product.id,
      productCode: product.productCode,
      productName: `${product.itemName} (FREE)`, // Mark as free in the name
      quantity: 1,
      sellingPrice: 0, // Free product selling price is 0
      discount: 0,
      availableQty: product.availableQty,
      costPrice: product.availableQty > 0 ? Number(product.totalCost) / product.availableQty : 0
    };

    // Add free items to the end of the list (they will appear at the bottom)
    setOrderItems(prev => [...prev, newItem]);
    setFreeProductSearch('');
    setFreeProductResults([]);
    setShowFreeProductResults(false);
    setError(''); // Clear any previous errors
  };

  const updateOrderItem = (itemId: string, field: keyof OrderItem, value: number) => {
    // Create updated items array for validation
    const updatedItems = orderItems.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value };
        
        // Validate quantity
        if (field === 'quantity' && value > item.availableQty) {
          setError(`Insufficient stock for ${item.productName}. Available: ${item.availableQty}`);
          return item; // Don't update if invalid
        }
        
        return updatedItem;
      }
      return item;
    });

    // Calculate new order total with updated items
    const newOrderTotal = updatedItems.reduce((total, item) => {
      const itemTotal = (item.quantity * item.sellingPrice) - item.discount;
      return total + itemTotal;
    }, 0);

    // Apply discount percentage if selected
    let finalOrderTotal = newOrderTotal;
    if (selectedDiscount) {
      const discountAmount = (newOrderTotal * selectedDiscount.percentage) / 100;
      finalOrderTotal = newOrderTotal - discountAmount;
    }

    // Apply cash discount if enabled
    if (cashDiscountEnabled) {
      const cashDiscountAmount = (finalOrderTotal * cashDiscountPercent) / 100;
      finalOrderTotal = finalOrderTotal - cashDiscountAmount;
    }

    // Validate credit limit for credit orders (only if order items would change)
    const hasActualChange = updatedItems.some((item, index) => {
      const original = orderItems[index];
      return !original || item.quantity !== original.quantity || item.sellingPrice !== original.sellingPrice || item.discount !== original.discount;
    });

    if (hasActualChange) {
      const creditValidation = validateCreditLimit(finalOrderTotal);
      if (!creditValidation.isValid) {
        setError(creditValidation.message || 'Credit limit exceeded');
        return; // Don't update if credit validation fails
      }
    }

    setOrderItems(updatedItems);
    setError(''); // Clear any previous errors
  };

  const removeOrderItem = (itemId: string) => {
    setOrderItems(prev => prev.filter(item => item.id !== itemId));
  };

  // Calculate totals
  const calculateTotals = () => {
    let subTotal = 0;
    let totalDiscount = 0;
    let totalCost = 0;
    let totalProfit = 0;

    orderItems.forEach(item => {
      const itemTotal = item.sellingPrice * item.quantity;
      const itemDiscountAmount = item.discount * item.quantity;
      const itemPrice = itemTotal - itemDiscountAmount;
      const itemCost = item.costPrice * item.quantity;

      subTotal += itemTotal;
      totalDiscount += itemDiscountAmount;
      totalCost += itemCost;
      totalProfit += (itemPrice - itemCost);
    });

    // Apply invoice type discount
    let invoiceTypeDiscount = 0;
    if (selectedDiscount) {
      invoiceTypeDiscount = subTotal * (Number(selectedDiscount.percentage) / 100);
    }

    // Apply cash discount
    let cashDiscount = 0;
    if (cashDiscountEnabled) {
      cashDiscount = (subTotal - invoiceTypeDiscount - totalDiscount) * (cashDiscountPercent / 100);
    }

    const netTotal = subTotal - invoiceTypeDiscount - totalDiscount - cashDiscount;
    const finalProfit = totalProfit - invoiceTypeDiscount - cashDiscount;

    return {
      subTotal,
      totalDiscount,
      invoiceTypeDiscount,
      cashDiscount,
      netTotal,
      totalCost,
      totalProfit: finalProfit
    };
  };

  const totals = calculateTotals();

  // Form validation
  const isFormValid = () => {
    // Check for at least one regular product (free products are optional)
    const regularProducts = orderItems.filter(item => item.sellingPrice > 0);
    
    return (
      orderDate &&
      selectedShop &&
      selectedSalesRep &&
      selectedDiscount &&
      regularProducts.length > 0 &&
      orderItems.every(item => item.quantity > 0 && item.quantity <= item.availableQty)
    );
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Debug current form state
    console.log('Form validation debug:', {
      orderDate,
      selectedShop: selectedShop?.shopName || 'null',
      selectedSalesRep: selectedSalesRep?.name || 'null', 
      selectedDiscount: selectedDiscount?.discountName || 'null',
      orderItems: orderItems.length,
      regularProducts: orderItems.filter(item => item.sellingPrice > 0).length,
      freeProducts: orderItems.filter(item => item.sellingPrice === 0).length
    });

    // Check specific missing fields
    const missingFields = [];
    if (!orderDate) missingFields.push('Order Date');
    if (!selectedShop) missingFields.push('Shop');
    if (!selectedSalesRep) missingFields.push('Sales Representative');
    if (!selectedDiscount) missingFields.push('Discount Type');
    
    // Check for at least one regular product (free products are optional)
    const regularProducts = orderItems.filter(item => item.sellingPrice > 0);
    if (regularProducts.length === 0) missingFields.push('At least one regular product');
    
    // Check for invalid quantities (both regular and free products)
    const invalidItems = orderItems.filter(item => item.quantity <= 0 || item.quantity > item.availableQty);
    
    console.log('Validation results:', { missingFields, invalidItems });
    
    if (missingFields.length > 0 || invalidItems.length > 0) {
      let errorMsg = '';
      if (missingFields.length > 0) {
        errorMsg += `Missing required fields: ${missingFields.join(', ')}`;
      }
      if (invalidItems.length > 0) {
        if (errorMsg) errorMsg += '. ';
        errorMsg += `Invalid quantities for: ${invalidItems.map(item => item.productName).join(', ')}`;
      }
      console.log('Setting error:', errorMsg);
      setError(errorMsg);
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const orderData = {
        orderDate,
        shopId: selectedShop!.id,
        salesRepId: selectedSalesRep?.id,
        discountId: selectedDiscount?.id,
        invoiceTypePercentage: selectedDiscount ? Number(selectedDiscount.percentage) : 0,
        cashDiscountEnabled,
        notes,
        status: 'PENDING', // Always save as pending
        orderItems: orderItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          sellingPrice: item.sellingPrice,
          discount: item.discount
        }))
      };

      // Use different API endpoints for create vs update
      const url = isEditMode ? `/api/orders/${editId}` : '/api/orders';
      const method = isEditMode ? 'PUT' : 'POST';

      console.log('Sending order data:', orderData);

      const response = await fetch(url, {
        method,
        headers: getUserHeaders(),
        body: JSON.stringify(orderData)
      });

      const data = await response.json();
      console.log('API response:', data);

      if (data.success) {
        setMessage(isEditMode ? 'Order updated successfully!' : 'Order saved successfully!');
        
        // Navigate back to orders list
        setTimeout(() => {
          router.push('/orders');
        }, 2000);
      } else {
        setError(data.error || `Failed to ${isEditMode ? 'update' : 'save'} order`);
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'saving'} order:`, error);
      setError(`An error occurred while ${isEditMode ? 'updating' : 'saving'} the order`);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking authorization
  if (authLoading) {
    return <div className={styles.loading}>Checking permissions...</div>;
  }

  // Show loading while loading existing order
  if (isLoadingOrder && isEditMode) {
    return <div className={styles.loading}>Loading order data...</div>;
  }

  // Show access denied if not authorized
  if (!isAuthorized) {
    return <div className={styles.loading}>Access denied to order management</div>;
  }

  return (
    <div className={`${styles.container} ${isDarkMode ? 'dark' : 'light'}`}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <button
            type="button"
            onClick={() => router.push('/orders')}
            className={styles.backButton}
          >
            ← Back
          </button>
        </div>
        <h1 className={styles.title}>📋 {isEditMode ? `Edit Order ${existingOrder?.orderNumber || ''}` : 'Create New Order'}</h1>
        <p className={styles.subtitle}>{isEditMode ? 'Edit existing order details' : 'Create orders that can be converted to invoices later'}</p>
      </div>

      <form className={styles.orderForm} onSubmit={(e) => e.preventDefault()}>
        {/* Basic Information */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>📅 Order Information</h2>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label className={styles.label}>Order Date *</label>
              <input
                type="date"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Discount Type *</label>
              <select
                value={selectedDiscount?.id || ''}
                onChange={(e) => {
                  const discount = discounts.find(d => d.id === parseInt(e.target.value));
                  setSelectedDiscount(discount || null);
                }}
                className={styles.select}
                required
              >
                <option value="">Select Discount Type</option>
                {discounts.map(discount => (
                  <option key={discount.id} value={discount.id}>
                    {discount.discountName} ({discount.percentage}%)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formGrid}>
            {/* Shop Search */}
            <div className={styles.field}>
              <label className={styles.label}>Shop *</label>
              <div className={`${styles.searchContainer} shop-search-container`}>
                <input
                  type="text"
                  placeholder="Search shops..."
                  value={shopSearch}
                  onChange={(e) => setShopSearch(e.target.value)}
                  onFocus={() => setShowShopResults(true)}
                  className={styles.searchInput}
                  required
                />
                <span className={styles.searchIcon}>🔍</span>
                {showShopResults && shopResults.length > 0 && (
                  <div className={styles.searchResults}>
                    {shopResults.map(shop => (
                      <div
                        key={shop.id}
                        className={styles.searchResult}
                        onClick={() => selectShop(shop)}
                      >
                        <div className={styles.resultName}>{shop.shopName}</div>
                        <div className={styles.resultDetails}>
                          {shop.ownerName} • {shop.contactNumber}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Credit Limit Display */}
            {selectedShop && (
              <div className={styles.field}>
                <div className={styles.creditLimitContainer}>
                  <h3 className={styles.creditLimitTitle}>💳 Credit Information</h3>
                  <div className={styles.creditLimitGrid}>
                    <div className={styles.creditLimitItem}>
                      <span className={styles.creditLimitLabel}>Credit Limit:</span>
                      <span className={styles.creditLimitValue}>
                        Rs {selectedShop.creditLimit?.toLocaleString() || '0'}
                      </span>
                    </div>
                    <div className={styles.creditLimitItem}>
                      <span className={styles.creditLimitLabel}>Current Balance:</span>
                      <span className={styles.creditLimitValue}>
                        Rs {selectedShop.balanceAmount?.toLocaleString() || '0'}
                      </span>
                    </div>
                    <div className={styles.creditLimitItem}>
                      <span className={styles.creditLimitLabel}>Available Credit:</span>
                      <span className={`${styles.creditLimitValue} ${
                        (selectedShop.creditLimit || 0) - (selectedShop.balanceAmount || 0) > 0 
                          ? styles.positiveCredit 
                          : styles.negativeCredit
                      }`}>
                        Rs {((selectedShop.creditLimit || 0) - (selectedShop.balanceAmount || 0)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Overdue Payments Warning */}
            {selectedShop && hasOverduePayments && (
              <div className={styles.field}>
                <div className={styles.overdueWarning}>
                  <h3 className={styles.overdueWarningTitle}>⚠️ Overdue Payments Alert</h3>
                  <p className={styles.overdueWarningText}>
                    This shop has {overduePayments.length} overdue payment(s). No orders can be created until all overdue payments are settled.
                  </p>
                  <div className={styles.overduePaymentsList}>
                    {overduePayments.map((payment) => (
                      <div key={payment.id} className={styles.overduePaymentItem}>
                        <span className={styles.overdueInvoiceNumber}>Invoice: {payment.invoiceNumber}</span>
                        <span className={styles.overdueDueDate}>Due: {new Date(payment.dueDate).toLocaleDateString()}</span>
                        <span className={styles.overdueAmount}>Rs {payment.remainingAmount.toLocaleString()}</span>
                        <span className={styles.overdueDays}>{payment.daysPastDue} days overdue</span>
                      </div>
                    ))}
                  </div>
                  <div className={styles.overdueTotal}>
                    Total Overdue: Rs {overduePayments.reduce((sum, p) => sum + Number(p.remainingAmount), 0).toLocaleString()}
                  </div>
                </div>
              </div>
            )}

            {/* Sales Rep Search */}
            <div className={styles.field}>
              <label className={styles.label}>Sales Representative *</label>
              <div className={`${styles.searchContainer} salesrep-search-container`}>
                <input
                  type="text"
                  placeholder="Search sales reps..."
                  value={salesRepSearch}
                  onChange={(e) => setSalesRepSearch(e.target.value)}
                  onFocus={() => setShowSalesRepResults(true)}
                  className={styles.searchInput}
                  required
                />
                <span className={styles.searchIcon}>👤</span>
                {showSalesRepResults && salesRepResults.length > 0 && (
                  <div className={styles.searchResults}>
                    {salesRepResults.map(rep => (
                      <div
                        key={rep.id}
                        className={styles.searchResult}
                        onClick={() => selectSalesRep(rep)}
                      >
                        <div className={styles.resultName}>{rep.name}</div>
                        <div className={styles.resultDetails}>{rep.contactNumber}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional order notes..."
              className={styles.textarea}
            />
          </div>

          {/* Cash Discount Toggle - Hidden if setting is enabled */}
          {!orderSettings.hideCashDiscount && (
            <div className={styles.toggleField}>
              <label className={styles.toggleLabel}>
                <input
                  type="checkbox"
                  checked={cashDiscountEnabled}
                  onChange={(e) => setCashDiscountEnabled(e.target.checked)}
                  className={styles.toggleInput}
                />
                <span>Enable Cash Discount ({cashDiscountPercent}%)</span>
              </label>
            </div>
          )}
        </div>

        {/* Products Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>📦 Order Items</h2>
          
          {/* Product Search */}
          <div className={styles.productSearch}>
            <label className={styles.label}>Add Products</label>
            <div className={`${styles.searchContainer} product-search-container`}>
              <input
                type="text"
                placeholder="Search products to add..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                onFocus={() => setShowProductResults(true)}
                className={styles.searchInput}
              />
              <span className={styles.searchIcon}>📦</span>
              {showProductResults && productResults.length > 0 && (
                <div className={styles.searchResults}>
                  {productResults.map(product => (
                    <div
                      key={product.id}
                      className={styles.searchResult}
                      onClick={() => addProduct(product)}
                    >
                      <div className={styles.resultName}>{product.itemName}</div>
                      <div className={styles.resultDetails}>
                        {product.productCode} • Stock: {product.availableQty} • LKR {Number(product.sellingPrice).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Free Products Search - Hidden if setting is enabled */}
          {!orderSettings.hideFreeProducts && (
            <div className={styles.productSearch}>
              <label className={styles.label}>Add Free Products</label>
              <div className={`${styles.searchContainer} freeproduct-search-container`}>
                <input
                  type="text"
                  placeholder="Search products to add as free items (price = 0)..."
                  value={freeProductSearch}
                  onChange={(e) => setFreeProductSearch(e.target.value)}
                  onFocus={() => setShowFreeProductResults(true)}
                  className={styles.searchInput}
                />
                <span className={styles.searchIcon}>🆓</span>
                {showFreeProductResults && freeProductResults.length > 0 && (
                  <div className={styles.searchResults}>
                    {freeProductResults.map(product => (
                      <div
                        key={`free-${product.id}`}
                        className={styles.searchResult}
                        onClick={() => addFreeProduct(product)}
                      >
                        <div className={styles.resultName}>{product.itemName} (FREE)</div>
                        <div className={styles.resultDetails}>
                          {product.productCode} • Stock: {product.availableQty} • Original: LKR {Number(product.sellingPrice).toLocaleString()} • Free: LKR 0
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Added Products */}
          <div className={styles.addedProducts}>
            {orderItems
              .sort((a, b) => {
                // Sort free items (selling price = 0) to the bottom
                if (a.sellingPrice === 0 && b.sellingPrice !== 0) return 1;
                if (a.sellingPrice !== 0 && b.sellingPrice === 0) return -1;
                return 0; // Keep original order for items of same type
              })
              .map(item => (
              <div key={item.id} className={styles.productItem}>
                <div className={styles.productHeader}>
                  <div className={styles.productInfo}>
                    <div className={styles.productName}>{item.productName}</div>
                    <div className={styles.productCode}>Code: {item.productCode}</div>
                    <div className={styles.productStock}>Available: {item.availableQty}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeOrderItem(item.id)}
                    className={styles.removeButton}
                  >
                    🗑️
                  </button>
                </div>

                <div className={styles.productInputs}>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Quantity</label>
                    <input
                      type="number"
                      min="1"
                      max={item.availableQty}
                      value={item.quantity}
                      onWheel={handleNumberInputWheel}
                      onChange={(e) => updateOrderItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                      className={styles.productInput}
                    />
                  </div>
                  
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Selling Price</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.sellingPrice}
                      onChange={(e) => updateOrderItem(item.id, 'sellingPrice', parseFloat(e.target.value) || 0)}
                      onWheel={handleNumberInputWheel}
                      className={styles.productInput}
                      readOnly={item.sellingPrice === 0 || orderSettings.hideSellingPrice}
                      title={item.sellingPrice === 0 ? 'Free item - selling price cannot be changed' : 
                             orderSettings.hideSellingPrice ? 'Selling price is read-only (configured in settings)' : ''}
                    />
                  </div>
                  
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Discount</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.discount}
                      onChange={(e) => updateOrderItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                      onWheel={handleNumberInputWheel}
                      className={styles.productInput}
                      readOnly={item.sellingPrice === 0 || orderSettings.hideDiscount}
                      title={item.sellingPrice === 0 ? 'Free item - no additional discount can be applied' : 
                             orderSettings.hideDiscount ? 'Discount is read-only (configured in settings)' : ''}
                    />
                  </div>
                  
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Price</label>
                    <div className={styles.productInput} style={{display: 'flex', alignItems: 'center'}}>
                      LKR {((item.sellingPrice - item.discount) * item.quantity).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Total</label>
                    <div className={styles.productInput} style={{display: 'flex', alignItems: 'center', fontWeight: 'bold'}}>
                      LKR {(item.sellingPrice * item.quantity).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {orderItems.length === 0 && (
              <div className={styles.loading}>
                No products added yet. Search and add products above.
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        {orderItems.length > 0 && (
          <div className={styles.summarySection}>
            <h2 className={styles.sectionTitle}>💰 Order Summary</h2>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Sub Total:</span>
                <span className={styles.summaryValue}>LKR {totals.subTotal.toLocaleString()}</span>
              </div>
              
              {selectedDiscount && (
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>
                    {selectedDiscount.discountName} ({selectedDiscount.percentage}%):
                  </span>
                  <span className={styles.summaryValue}>- LKR {totals.invoiceTypeDiscount.toLocaleString()}</span>
                </div>
              )}
              
              {totals.totalDiscount > 0 && (
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Item Discounts:</span>
                  <span className={styles.summaryValue}>- LKR {totals.totalDiscount.toLocaleString()}</span>
                </div>
              )}
              
              {cashDiscountEnabled && !orderSettings.hideCashDiscount && (
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Cash Discount ({cashDiscountPercent}%):</span>
                  <span className={styles.summaryValue}>- LKR {totals.cashDiscount.toLocaleString()}</span>
                </div>
              )}
              
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Net Total:</span>
                <span className={styles.summaryValue}>LKR {totals.netTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        {error && <div className={`${styles.message} ${styles.error}`}>{error}</div>}
        {message && <div className={`${styles.message} ${styles.success}`}>{message}</div>}

        {/* Action Buttons */}
        <div className={styles.actionSection}>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isFormValid() || isLoading || isCreditExceeded || hasOverduePayments}
            className={styles.submitButton}
          >
            {isLoading 
              ? (isEditMode ? '� Updating...' : '�💾 Saving...') 
              : (isEditMode ? '📝 Update Order' : '💾 Save Order')}
          </button>
          {isCreditExceeded && (
            <div className={`${styles.message} ${styles.error}`}>
              ⚠️ Cannot {isEditMode ? 'update' : 'save'} order: Available credit limit exceeded for credit payment
            </div>
          )}
          {hasOverduePayments && (
            <div className={`${styles.message} ${styles.error}`}>
              ⚠️ Cannot {isEditMode ? 'update' : 'save'} order: Shop has overdue payments that must be settled first
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

// Wrapper component with Suspense for useSearchParams
const OrderPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderCreation />
    </Suspense>
  );
};

export default OrderPage;