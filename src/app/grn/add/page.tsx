'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { usePageProtection } from '@/components/ProtectedRoute';
import { handleNumberInputWheel } from '@/lib/numberInputUtils';
import { useState, useEffect } from 'react';
import styles from './add.module.css';

interface Supplier {
  id: number;
  supplierName: string;
  contactNumber: string;
  email: string;
  address: string;
}

interface Product {
  id: number;
  productCode: string;
  itemName: string;
  sellingPrice: number;
  availableQty: number;
  category: string;
}

interface GrnItem {
  id?: number;
  productId: number;
  productCode: string;
  itemName: string;
  quantity: number;
  costPrice: number;
  totalCost: number;
}

interface Grn {
  id: number;
  grnDate: string;
  supplier: {
    id: number;
    supplierName: string;
    contactNumber: string;
    email?: string;
    address?: string;
  };
  invoiceNumber: string;
  poNumber?: string;
  paymentType: string;
  totalAmount: number;
  user: string;
  grnItems: {
    id: number;
    quantity: number;
    costPrice: number;
    totalCost: number;
    product: {
      id: number;
      productCode: string;
      itemName: string;
    };
  }[];
}

export default function GrnAddPage() {
  // Page protection - check if user has access to GRN pages
  const { isAuthorized, isLoading: authLoading } = usePageProtection('grn');
  
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // GRN Form Data
  const [grnData, setGrnData] = useState({
    grnDate: new Date().toISOString().split('T')[0], // Today's date
    supplierId: '',
    invoiceNumber: '',
    poNumber: '',
    paymentType: 'cash'
  });

  // Selected supplier
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  
  // Supplier search
  const [supplierSearchTerm, setSupplierSearchTerm] = useState('');
  const [supplierSearchResults, setSupplierSearchResults] = useState<Supplier[]>([]);
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  
  // Product search
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [productSearchResults, setProductSearchResults] = useState<Product[]>([]);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  
  // GRN Items
  const [grnItems, setGrnItems] = useState<GrnItem[]>([]);
  const [newItem, setNewItem] = useState({
    productId: 0,
    quantity: 1,
    costPrice: 0
  });

  // GRN List
  const [grns, setGrns] = useState<Grn[]>([]);
  const [isGrnLoaded, setIsGrnLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false
  });

  // Edit GRN state
  const [isEditing, setIsEditing] = useState(false);
  const [editingGrnId, setEditingGrnId] = useState<number | null>(null);
  
  // Remove item loading state
  const [removingItemId, setRemovingItemId] = useState<number | null>(null);

  // Search suppliers
  const searchSuppliers = async (query: string) => {
    if (query.length < 2) {
      setSupplierSearchResults([]);
      return;
    }
    
    try {
      const response = await fetch(`/api/suppliers/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (response.ok) {
        setSupplierSearchResults(data.suppliers || []);
      }
    } catch (error) {
      console.error('Error searching suppliers:', error);
    }
  };

  // Search products
  const searchProducts = async (query: string) => {
    if (query.length < 2) {
      setProductSearchResults([]);
      return;
    }
    
    try {
      const response = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (response.ok) {
        setProductSearchResults(data.products || []);
      }
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  // Handle supplier search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (supplierSearchTerm && !selectedSupplier) {
        searchSuppliers(supplierSearchTerm);
        setShowSupplierDropdown(true);
      } else if (supplierSearchTerm && selectedSupplier && supplierSearchTerm !== selectedSupplier.supplierName) {
        // User is typing again after selecting a supplier
        setSelectedSupplier(null);
        setGrnData(prev => ({ ...prev, supplierId: '' }));
        searchSuppliers(supplierSearchTerm);
        setShowSupplierDropdown(true);
      } else {
        setSupplierSearchResults([]);
        setShowSupplierDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [supplierSearchTerm, selectedSupplier]);

  // Handle product search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (productSearchTerm) {
        searchProducts(productSearchTerm);
        setShowProductDropdown(true);
      } else {
        setProductSearchResults([]);
        setShowProductDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [productSearchTerm]);

  // Select supplier
  const selectSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setSupplierSearchTerm(supplier.supplierName);
    setGrnData(prev => ({ ...prev, supplierId: supplier.id.toString() }));
    
    // Close dropdown and clear search results immediately
    setShowSupplierDropdown(false);
    setSupplierSearchResults([]);
    
    // Remove focus from input to prevent reopening dropdown
    setTimeout(() => {
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement && activeElement.blur) {
        activeElement.blur();
      }
    }, 100);
  };

  // Add product to GRN items
  const addProductToGrn = async (product: Product) => {
    // Check if product already exists in GRN
    const existingItem = grnItems.find(item => item.productId === product.id);
    
    if (existingItem) {
      setError('Product already added to GRN. You can update quantity in the table below.');
      return;
    }

    // Validate inputs one more time
    if (!newItem.quantity || newItem.quantity <= 0) {
      setError('Invalid quantity. Please enter a number greater than 0.');
      return;
    }

    if (!newItem.costPrice || newItem.costPrice <= 0) {
      setError('Invalid cost price. Please enter a number greater than 0.');
      return;
    }

    // If in edit mode, add item to database immediately
    if (isEditing && editingGrnId && user) {
      setIsLoading(true);
      try {
        const response = await fetch('/api/grn/add-item', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-data': JSON.stringify(user)
          },
          body: JSON.stringify({
            grnId: editingGrnId,
            productId: product.id,
            quantity: newItem.quantity,
            costPrice: newItem.costPrice
          })
        });

        const data = await response.json();
        
        if (!data.success) {
          setError(data.error || 'Failed to add item to GRN');
          setIsLoading(false);
          return;
        }

        // Update success message with more details
        const { result } = data;
        setMessage(
          `Item added successfully! ` +
          `GRN total updated to Rs. ${parseFloat(result.newTotalAmount).toFixed(2)}. ` +
          `${result.totalItemsCount} item(s) in GRN.`
        );
        
        // Add item to local state
        const newGrnItem: GrnItem = {
          productId: product.id,
          productCode: product.productCode,
          itemName: product.itemName,
          quantity: newItem.quantity,
          costPrice: newItem.costPrice,
          totalCost: newItem.quantity * newItem.costPrice
        };

        setGrnItems(prev => [...prev, newGrnItem]);
        
        // Clear form inputs
        setProductSearchTerm('');
        setShowProductDropdown(false);
        setProductSearchResults([]);
        setNewItem({ productId: 0, quantity: 1, costPrice: 0 });
        setError('');
        
        // Reload GRNs list to show updated totals if already loaded
        if (isGrnLoaded) {
          loadGrns(currentPage);
        }
        
        // Clear message after 5 seconds
        setTimeout(() => setMessage(''), 5000);
        
      } catch (error) {
        console.error('Error adding item to GRN:', error);
        setError('An error occurred while adding item to GRN');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Create mode: Just add to local state
      const newGrnItem: GrnItem = {
        productId: product.id,
        productCode: product.productCode,
        itemName: product.itemName,
        quantity: newItem.quantity,
        costPrice: newItem.costPrice,
        totalCost: newItem.quantity * newItem.costPrice
      };

      setGrnItems(prev => [...prev, newGrnItem]);
      setProductSearchTerm('');
      setShowProductDropdown(false);
      setProductSearchResults([]);
      setNewItem({ productId: 0, quantity: 1, costPrice: 0 });
      setError('');
      setMessage('Product added to GRN successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Remove item from GRN
  const removeGrnItem = async (productId: number) => {
    // Find the item to be removed
    const itemToRemove = grnItems.find(item => item.productId === productId);
    
    if (!itemToRemove) {
      setError('Item not found');
      return;
    }

    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to remove this item?\n\n` +
      `Product: ${itemToRemove.itemName}\n` +
      `Quantity: ${itemToRemove.quantity}\n` +
      `Cost Price: Rs. ${parseFloat(itemToRemove.costPrice.toString()).toFixed(2)}\n` +
      `Total Cost: Rs. ${parseFloat(itemToRemove.totalCost.toString()).toFixed(2)}\n\n` +
      `This action cannot be undone.`
    );

    if (!confirmed) {
      return; // User cancelled
    }

    // Set loading state for this specific item
    setRemovingItemId(productId);

    // If in edit mode and user exists, update GRN, GRN items, and product tables via API
    if (isEditing && editingGrnId && user) {
      try {
        const response = await fetch(`/api/grn/remove-item?grnId=${editingGrnId}&productId=${productId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'x-user-data': JSON.stringify(user)
          }
        });

        const data = await response.json();
        
        if (!data.success) {
          setError(data.error || 'Failed to remove item from GRN');
          setRemovingItemId(null);
          return;
        }

        // Update success message with more details
        const { result } = data;
        setMessage(
          `Item removed successfully! ` +
          `GRN total updated to Rs. ${parseFloat(result.newTotalAmount).toFixed(2)}. ` +
          `${result.remainingItemsCount} item(s) remaining in GRN.`
        );
        
        // Clear message after 5 seconds (longer for more detailed message)
        setTimeout(() => setMessage(''), 5000);
        
        // Remove item from local state
        setGrnItems(prev => prev.filter(item => item.productId !== productId));
        
        // Clear loading state
        setRemovingItemId(null);
        
        // Reload GRNs list to show updated totals if already loaded
        if (isGrnLoaded) {
          loadGrns(currentPage);
        }
        
        return; // Exit here for edit mode
        
      } catch (error) {
        console.error('Error removing GRN item:', error);
        setError('An error occurred while removing GRN item');
        setRemovingItemId(null);
        return;
      }
    }

    // For create mode (not editing): Remove item from local state only
    setGrnItems(prev => prev.filter(item => item.productId !== productId));
    
    // Clear loading state
    setRemovingItemId(null);
    
    if (!isEditing) {
      setMessage('Item removed successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Update item quantity or cost price
  const updateGrnItem = (productId: number, field: 'quantity' | 'costPrice', value: number) => {
    setGrnItems(prev => prev.map(item => {
      if (item.productId === productId) {
        const updatedItem = { ...item, [field]: value };
        updatedItem.totalCost = updatedItem.quantity * updatedItem.costPrice;
        return updatedItem;
      }
      return item;
    }));
  };

  // Calculate total amount
  const calculateTotalAmount = () => {
    return grnItems.reduce((total, item) => total + item.totalCost, 0);
  };

  // Load GRNs
  const loadGrns = async (page = 1, search = '') => {
    try {
      setIsLoading(true);
      setError('');
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search })
      });
      
      const response = await fetch(`/api/grn?${params}`);
      const data = await response.json();
      
      if (response.ok && data.grns) {
        setGrns(data.grns);
        setPagination(data.pagination);
        setCurrentPage(page);
        setIsGrnLoaded(true);
        setMessage(`GRNs loaded successfully! (Page ${page} of ${data.pagination.totalPages})`);
      } else {
        setError(data.error || 'Failed to load GRNs');
      }
    } catch (error) {
      console.error('Error loading GRNs:', error);
      setError('An error occurred while loading GRNs');
    } finally {
      setIsLoading(false);
    }
  };

  // Load GRN for editing
  const loadGrnForEdit = (grn: Grn) => {
    try {
      setError('');
      setMessage('');
      
      // Set editing mode
      setIsEditing(true);
      setEditingGrnId(grn.id);
      
      // Load GRN header data
      setGrnData({
        grnDate: grn.grnDate.split('T')[0], // Format date for input
        supplierId: grn.supplier.id.toString(),
        invoiceNumber: grn.invoiceNumber,
        poNumber: grn.poNumber || '',
        paymentType: grn.paymentType
      });
      
      // Load supplier data
      setSelectedSupplier({
        id: grn.supplier.id,
        supplierName: grn.supplier.supplierName,
        contactNumber: grn.supplier.contactNumber,
        email: grn.supplier.email || '',
        address: grn.supplier.address || ''
      });
      setSupplierSearchTerm(grn.supplier.supplierName);
      
      // Load GRN items
      const items: GrnItem[] = grn.grnItems.map(item => ({
        productId: item.product.id,
        productCode: item.product.productCode,
        itemName: item.product.itemName,
        quantity: item.quantity,
        costPrice: item.costPrice,
        totalCost: item.quantity * item.costPrice
      }));
      
      setGrnItems(items);
      
      setMessage(`GRN #${grn.id} loaded for editing. You can now modify and update.`);
      
      // Scroll to top of form
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (error) {
      console.error('Error loading GRN for edit:', error);
      setError('Failed to load GRN for editing');
    }
  };

  // Clear edit mode
  const clearEditMode = () => {
    setIsEditing(false);
    setEditingGrnId(null);
    setRemovingItemId(null); // Reset removing item state
    
    // Reset form
    setGrnData({
      grnDate: new Date().toISOString().split('T')[0],
      supplierId: '',
      invoiceNumber: '',
      poNumber: '',
      paymentType: 'cash'
    });
    setSelectedSupplier(null);
    setSupplierSearchTerm('');
    setGrnItems([]);
    setNewItem({ productId: 0, quantity: 1, costPrice: 0 });
    setError('');
    setMessage('Form cleared. You can now create a new GRN.');
  };

  // Submit GRN
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please log in to ' + (isEditing ? 'update' : 'create') + ' GRN');
      return;
    }

    if (!selectedSupplier) {
      setError('Please select a supplier');
      return;
    }

    if (grnItems.length === 0) {
      setError('Please add at least one product');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const url = isEditing ? `/api/grn/${editingGrnId}` : '/api/grn';
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'x-user-data': JSON.stringify(user)
        },
        body: JSON.stringify({
          ...grnData,
          items: grnItems
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage(isEditing ? 'GRN updated successfully!' : 'GRN created successfully!');
        
        // Clear edit mode if updating
        if (isEditing) {
          clearEditMode();
        } else {
          // Reset form for new GRN
          setGrnData({
            grnDate: new Date().toISOString().split('T')[0],
            supplierId: '',
            invoiceNumber: '',
            poNumber: '',
            paymentType: 'cash'
          });
          setSelectedSupplier(null);
          setSupplierSearchTerm('');
          setGrnItems([]);
        }
        
        // Reload GRNs if already loaded
        if (isGrnLoaded) {
          loadGrns(currentPage);
        }
      } else {
        setError(data.error || 'Failed to ' + (isEditing ? 'update' : 'create') + ' GRN');
      }
    } catch (error) {
      console.error('Error ' + (isEditing ? 'updating' : 'creating') + ' GRN:', error);
      setError('An error occurred while ' + (isEditing ? 'updating' : 'creating') + ' GRN');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking authorization
  if (authLoading || !isAuthorized) {
    return null; // ProtectedRoute component handles the loading UI and redirects
  }

  if (!user) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>Please log in to access GRN management.</p>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${isDarkMode ? 'dark' : 'light'}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {isEditing ? `Edit GRN #${editingGrnId}` : 'Create New GRN'}
        </h1>
        {isEditing && (
          <button
            type="button"
            onClick={clearEditMode}
            className={styles.clearButton}
          >
            Clear & Create New
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* GRN Header Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>GRN Details</h2>
          
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>GRN Date:</label>
              <input
                type="date"
                value={grnData.grnDate}
                onChange={(e) => setGrnData(prev => ({ ...prev, grnDate: e.target.value }))}
                className={styles.input}
                required
              />
            </div>
            
            <div className={styles.field}>
              <label className={styles.label}>Invoice Number:</label>
              <input
                type="text"
                value={grnData.invoiceNumber}
                onChange={(e) => setGrnData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                className={styles.input}
                placeholder="Enter invoice number"
                required
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>PO Number:</label>
              <input
                type="text"
                value={grnData.poNumber}
                onChange={(e) => setGrnData(prev => ({ ...prev, poNumber: e.target.value }))}
                className={styles.input}
                placeholder="Enter PO number (optional)"
              />
            </div>
            
            <div className={styles.field}>
              <label className={styles.label}>Payment Type:</label>
              <select
                value={grnData.paymentType}
                onChange={(e) => setGrnData(prev => ({ ...prev, paymentType: e.target.value }))}
                className={styles.select}
                required
              >
                <option value="cash">Cash</option>
                <option value="credit">Credit</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Supplier Search */}
          <div className={styles.field}>
            <label className={styles.label}>Supplier:</label>
            <div className={styles.searchContainer}>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  value={supplierSearchTerm}
                  onChange={(e) => setSupplierSearchTerm(e.target.value)}
                  onBlur={() => {
                    // Close dropdown after a short delay to allow click selection
                    setTimeout(() => {
                      setShowSupplierDropdown(false);
                    }, 200);
                  }}
                  onFocus={() => {
                    // Show dropdown if there are results and no supplier is selected
                    if (supplierSearchResults.length > 0 && !selectedSupplier) {
                      setShowSupplierDropdown(true);
                    }
                  }}
                  className={`${styles.input} ${selectedSupplier ? styles.selectedInput : ''}`}
                  placeholder="Search supplier by name, contact, or email..."
                  required
                />
                {selectedSupplier && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSupplier(null);
                      setSupplierSearchTerm('');
                      setGrnData(prev => ({ ...prev, supplierId: '' }));
                      setShowSupplierDropdown(false);
                      setSupplierSearchResults([]);
                    }}
                    className={styles.clearSupplierButton}
                    title="Clear selected supplier"
                  >
                    ×
                  </button>
                )}
              </div>
              
              {showSupplierDropdown && supplierSearchResults.length > 0 && (
                <div className={styles.dropdown}>
                  {supplierSearchResults.map((supplier) => (
                    <div
                      key={supplier.id}
                      className={styles.dropdownItem}
                      onClick={() => selectSupplier(supplier)}
                    >
                      <div className={styles.supplierInfo}>
                        <strong>{supplier.supplierName}</strong>
                        <span>{supplier.contactNumber}</span>
                        <small>{supplier.email}</small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Add Products</h2>
          
          <div className={styles.productSearch}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Search Product:</label>
                <div className={styles.searchContainer}>
                  <input
                    type="text"
                    value={productSearchTerm}
                    onChange={(e) => setProductSearchTerm(e.target.value)}
                    className={styles.input}
                    placeholder="Search product by code or name..."
                  />
                  
                  {showProductDropdown && productSearchResults.length > 0 && (
                    <div className={styles.dropdown}>
                      {productSearchResults.map((product) => (
                        <div
                          key={product.id}
                          className={styles.dropdownItem}
                          onClick={() => {
                            setNewItem(prev => ({ ...prev, productId: product.id }));
                            setProductSearchTerm(`${product.productCode} - ${product.itemName}`);
                            setShowProductDropdown(false);
                            setError(''); // Clear any previous errors
                          }}
                        >
                          <div className={styles.productInfo}>
                            <strong>{product.productCode}</strong>
                            <span>{product.itemName}</span>
                            <small>Category: {product.category} | Available: {product.availableQty}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className={styles.field}>
                <label className={styles.label}>Quantity:</label>
                <input
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                  onWheel={handleNumberInputWheel}
                  className={styles.input}
                  min="1"
                  required
                />
              </div>
              
              <div className={styles.field}>
                <label className={styles.label}>Cost Price:</label>
                <input
                  type="number"
                  step="0.01"
                  value={newItem.costPrice}
                  onChange={(e) => setNewItem(prev => ({ ...prev, costPrice: parseFloat(e.target.value) || 0 }))}
                  onWheel={handleNumberInputWheel}
                  className={styles.input}
                  min="0"
                  required
                />
              </div>
              
              <div className={styles.field}>
                <button
                  type="button"
                  onClick={() => {
                    // Clear any previous errors and messages
                    setError('');
                    setMessage('');
                    
                    // Debug logging
                    console.log('Add Product clicked:', {
                      productId: newItem.productId,
                      quantity: newItem.quantity,
                      costPrice: newItem.costPrice,
                      productSearchTerm
                    });
                    
                    // Validation checks
                    if (!newItem.productId || newItem.productId === 0) {
                      setError('Please select a product from the dropdown');
                      return;
                    }
                    
                    if (!newItem.quantity || newItem.quantity <= 0) {
                      setError('Please enter a valid quantity (greater than 0)');
                      return;
                    }
                    
                    if (!newItem.costPrice || newItem.costPrice <= 0) {
                      setError('Please enter a valid cost price (greater than 0)');
                      return;
                    }
                    
                    // Find the selected product
                    const selectedProduct = productSearchResults.find(p => p.id === newItem.productId) ||
                      (productSearchTerm ? {
                        id: newItem.productId,
                        productCode: productSearchTerm.split(' - ')[0],
                        itemName: productSearchTerm.split(' - ')[1] || productSearchTerm,
                        category: '',
                        sellingPrice: 0,
                        availableQty: 0
                      } : null);
                    
                    if (selectedProduct) {
                      addProductToGrn(selectedProduct);
                    } else {
                      setError('Selected product not found. Please search and select again.');
                    }
                  }}
                  className={styles.addButton}
                  disabled={!newItem.productId || newItem.quantity <= 0 || newItem.costPrice <= 0}
                >
                  Add Product
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* GRN Items Table */}
        {grnItems.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>GRN Items</h2>
            
            <div className={styles.itemsTable}>
              <div className={styles.tableHeader}>
                <div>Product Code</div>
                <div>Product Name</div>
                <div>Quantity</div>
                <div>Cost Price</div>
                <div>Total Cost</div>
                <div>Actions</div>
              </div>
              
              {grnItems.map((item) => (
                <div key={item.productId} className={styles.tableRow}>
                  <div>{item.productCode}</div>
                  <div>{item.itemName}</div>
                  <div>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={isEditing ? undefined : (e) => updateGrnItem(item.productId, 'quantity', parseInt(e.target.value) || 1)}
                      onWheel={handleNumberInputWheel}
                      className={`${styles.smallInput} ${isEditing ? styles.readOnlyInput : ''}`}
                      min="1"
                      readOnly={isEditing}
                      disabled={isEditing}
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      step="0.01"
                      value={item.costPrice}
                      onChange={isEditing ? undefined : (e) => updateGrnItem(item.productId, 'costPrice', parseFloat(e.target.value) || 0)}
                      onWheel={handleNumberInputWheel}
                      className={`${styles.smallInput} ${isEditing ? styles.readOnlyInput : ''}`}
                      min="0"
                      readOnly={isEditing}
                      disabled={isEditing}
                    />
                  </div>
                  <div className={styles.totalCost}>Rs. {item.totalCost.toFixed(2)}</div>
                  <div>
                    <button
                      type="button"
                      onClick={() => removeGrnItem(item.productId)}
                      className={styles.removeButton}
                      disabled={removingItemId === item.productId || isLoading}
                    >
                      {removingItemId === item.productId ? 'Removing...' : 'Remove'}
                    </button>
                  </div>
                </div>
              ))}
              
              <div className={styles.tableFooter}>
                <div className={styles.totalAmount}>
                  <strong>Total Amount: Rs. {calculateTotalAmount().toFixed(2)}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Section */}
        <div className={styles.submitSection}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading || !selectedSupplier || grnItems.length === 0}
          >
            {isLoading ? (isEditing ? 'Updating GRN...' : 'Creating GRN...') : (isEditing ? 'Update GRN' : 'Create GRN')}
          </button>
        </div>

        {message && <p className={styles.success}>{message}</p>}
        {error && <p className={styles.error}>{error}</p>}
      </form>

      {/* Load GRNs Section */}
      <div className={styles.grnsList}>
        <div className={styles.grnsHeader}>
          <h2 className={styles.subtitle}>Existing GRNs</h2>
          <button
            onClick={() => loadGrns(1)}
            className={styles.loadButton}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Load GRNs'}
          </button>
        </div>

        {isGrnLoaded && (
          <div className={styles.grnsContent}>
            {grns.length === 0 ? (
              <p className={styles.noGrns}>No GRNs found.</p>
            ) : (
              <div className={styles.grnItems}>
                {grns.map((grn) => (
                  <div key={grn.id} className={styles.grnItem}>
                    <div className={styles.grnHeader}>
                      <div className={styles.grnInfo}>
                        <strong>GRN #{grn.id}</strong>
                        <span>Date: {new Date(grn.grnDate).toLocaleDateString()}</span>
                        <span>Invoice: {grn.invoiceNumber}</span>
                      </div>
                      <div className={styles.grnActions}>
                        <div className={styles.grnAmount}>
                          Rs. {parseFloat(grn.totalAmount.toString()).toFixed(2)}
                        </div>
                        <button
                          type="button"
                          onClick={() => loadGrnForEdit(grn)}
                          className={styles.editButton}
                          disabled={isLoading}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                    
                    <div className={styles.grnDetails}>
                      <div>Supplier: {grn.supplier.supplierName}</div>
                      <div>Payment: {grn.paymentType.toUpperCase()}</div>
                      <div>Items: {grn.grnItems.length}</div>
                      <div>User: {grn.user}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  onClick={() => loadGrns(currentPage - 1)}
                  disabled={!pagination.hasPrev || isLoading}
                  className={styles.pageBtn}
                >
                  Previous
                </button>
                
                <div className={styles.pageNumbers}>
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, currentPage - 2) + i;
                    if (pageNum <= pagination.totalPages) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => loadGrns(pageNum)}
                          disabled={isLoading}
                          className={`${styles.pageBtn} ${pageNum === currentPage ? styles.active : ''}`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                    return null;
                  })}
                </div>
                
                <button
                  onClick={() => loadGrns(currentPage + 1)}
                  disabled={!pagination.hasNext || isLoading}
                  className={styles.pageBtn}
                >
                  Next
                </button>
              </div>
            )}

            <div className={styles.paginationInfo}>
              <p>
                Showing page {pagination.currentPage} of {pagination.totalPages} 
                ({pagination.totalCount} total GRNs)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}