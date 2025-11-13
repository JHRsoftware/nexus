'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { usePageProtection } from '@/components/ProtectedRoute';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { handleNumberInputWheel } from '@/lib/numberInputUtils';
import styles from './add.module.css';

interface Shop {
  id: number;
  shopName: string;
  ownerName: string;
  address: string;
  contactNumber: string;
  email: string | null;
  businessRegisterNo: string | null;
  image: string | null;
  creditLimit: number;
  balanceAmount: number;
  isActive: boolean;
  user: string;
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  shopName: string;
  ownerName: string;
  address: string;
  contactNumber: string;
  email: string;
  businessRegisterNo: string;
  image: string;
  creditLimit: string;
  balanceAmount: string;
  isActive: boolean;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const ShopManagement: React.FC = () => {
  // Page protection
  const { isAuthorized, isLoading: authLoading } = usePageProtection('shops');
  
  // Theme context
  const { isDarkMode } = useTheme();
  
  // Auth context
  const { user } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    shopName: '',
    ownerName: '',
    address: '',
    contactNumber: '',
    email: '',
    businessRegisterNo: '',
    image: '',
    creditLimit: '', // Empty initial value - will be loaded from database settings
    balanceAmount: '0',
    isActive: false
  });
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [defaultCreditLimit, setDefaultCreditLimit] = useState<number>(50000);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Shops list state
  const [shops, setShops] = useState<Shop[]>([]);
  const [isShopsLoaded, setIsShopsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false
  });

  // Get user headers for API requests
  const getUserHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'x-user-data': JSON.stringify(user || {})
    };
  };

  // Load default credit limit from settings when form is empty
  useEffect(() => {
    if (!formData.creditLimit && isAuthorized && user) {
      console.log('Loading credit limit from database settings...');
      
      let isMounted = true;
      const loadDefaultCreditLimit = async () => {
        try {
          const response = await fetch('/api/softwareSettings', {
            headers: {
              'Content-Type': 'application/json',
              'x-user-data': JSON.stringify(user || {})
            }
          });
          const data = await response.json();
          
          if (isMounted && data.success && data.settings && data.settings.defaultCreditLimit) {
            const defaultValue = data.settings.defaultCreditLimit;
            console.log('Loaded credit limit from database:', defaultValue);
            setDefaultCreditLimit(defaultValue);
            
            // Update form data with database value
            setFormData(prev => ({
              ...prev,
              creditLimit: defaultValue.toString()
            }));
          } else {
            console.log('Using fallback credit limit: 50000');
            setDefaultCreditLimit(50000);
            setFormData(prev => ({
              ...prev,
              creditLimit: '50000'
            }));
          }
        } catch (error) {
          if (isMounted) {
            console.error('Error loading default credit limit:', error);
            console.log('Using fallback credit limit due to error: 50000');
            setDefaultCreditLimit(50000);
            setFormData(prev => ({
              ...prev,
              creditLimit: '50000'
            }));
          }
        }
      };
      
      loadDefaultCreditLimit();
      
      return () => {
        isMounted = false;
      };
    }
  }, [formData.creditLimit, isAuthorized, user]);

  // Load shops with better pagination
  const loadShops = useCallback(async (page: number = 1, search: string = '', resetData: boolean = false) => {
    setIsLoading(true);
    setError('');
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '5', // 2 items per page to test pagination
        search: search.trim()
      });

      const response = await fetch(`/api/shops?${params}`, {
        headers: getUserHeaders()
      });
      
      const data = await response.json();

      if (data.success) {
        if (resetData || page === 1) {
          // Reset data for new search or first page
          setShops(data.shops);
        } else {
          // Append for pagination (if implementing load more)
          setShops(data.shops);
        }
        
        setPagination(data.pagination);
        setCurrentPage(page);
        setIsShopsLoaded(true);
        
        if (data.shops.length === 0 && search) {
          setError(`No shops found matching "${search}"`);
        }
      } else {
        setError(data.error || 'Failed to load shops');
        if (resetData) {
          setShops([]);
          setIsShopsLoaded(false);
        }
      }
    } catch (error) {
      console.error('Error loading shops:', error);
      setError('An error occurred while loading shops');
      if (resetData) {
        setShops([]);
        setIsShopsLoaded(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search effect - only works after shops have been loaded at least once
  useEffect(() => {
    if (isShopsLoaded) {
      const timeoutId = setTimeout(() => {
        loadShops(1, searchTerm.trim(), true);
      }, 300); // 300ms delay

      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm, loadShops, isShopsLoaded]);

  // Don't auto-load shops on mount - only when button is pressed

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.shopName || !formData.ownerName || !formData.address || !formData.contactNumber) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate email format if provided
    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        setError('Please enter a valid email address');
        return;
      }
    }

    // Validate credit limit
    const creditLimit = parseFloat(formData.creditLimit);
    if (isNaN(creditLimit) || creditLimit < 0) {
      setError('Credit limit must be a valid positive number');
      return;
    }

    // Validate balance amount
    const balanceAmount = parseFloat(formData.balanceAmount);
    if (isNaN(balanceAmount)) {
      setError('Balance amount must be a valid number');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');
    
    try {
      const url = isEditing ? '/api/shops' : '/api/shops';
      const method = isEditing ? 'PUT' : 'POST';
      
      const payload = {
        ...(isEditing && { id: editingId }),
        shopName: formData.shopName.trim(),
        ownerName: formData.ownerName.trim(),
        address: formData.address.trim(),
        contactNumber: formData.contactNumber.trim(),
        email: formData.email.trim() || null,
        businessRegisterNo: formData.businessRegisterNo.trim() || null,
        image: formData.image.trim() || null,
        creditLimit: parseFloat(formData.creditLimit),
        balanceAmount: parseFloat(formData.balanceAmount),
        isActive: formData.isActive
      };

      const response = await fetch(url, {
        method,
        headers: getUserHeaders(),
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        
        // Reset form
        setFormData({
          shopName: '',
          ownerName: '',
          address: '',
          contactNumber: '',
          email: '',
          businessRegisterNo: '',
          image: '',
          creditLimit: defaultCreditLimit.toString(),
          balanceAmount: '0',
          isActive: false
        });
        
        // Clear edit state
        if (isEditing) {
          setIsEditing(false);
          setEditingId(null);
        }
        
        // Reload shops
        if (isShopsLoaded) {
          loadShops(currentPage, searchTerm);
        }
        
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError(data.error || 'Operation failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('An error occurred while processing your request');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (shop: Shop) => {
    setFormData({
      shopName: shop.shopName,
      ownerName: shop.ownerName,
      address: shop.address,
      contactNumber: shop.contactNumber,
      email: shop.email || '',
      businessRegisterNo: shop.businessRegisterNo || '',
      image: shop.image || '',
      creditLimit: shop.creditLimit.toString(),
      balanceAmount: shop.balanceAmount.toString(),
      isActive: shop.isActive
    });
    setIsEditing(true);
    setEditingId(shop.id);
    setError('');
    setMessage('');
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle toggle active/inactive
  const handleToggleStatus = async (id: number, shopName: string, currentStatus: boolean) => {
    const action = currentStatus ? 'deactivate' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} the shop "${shopName}"?`)) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/shops?id=${id}&action=toggle`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        
        // Reload shops
        if (isShopsLoaded) {
          loadShops(currentPage, searchTerm);
        }
        
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError(data.error || 'Failed to update shop status');
      }
    } catch (error) {
      console.error('Error toggling shop status:', error);
      setError('An error occurred while updating shop status');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle permanent delete
  const handlePermanentDelete = async (id: number, shopName: string) => {
    if (!window.confirm(`⚠️ PERMANENT DELETE WARNING!\n\nAre you sure you want to PERMANENTLY delete "${shopName}"?\n\nThis action CANNOT be undone and will remove the shop from the database completely.`)) {
      return;
    }

    // Double confirmation for permanent delete
    if (!window.confirm(`Final confirmation: Permanently delete "${shopName}"?\n\nClick OK to proceed with permanent deletion.`)) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/shops?id=${id}&action=permanent`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`Shop "${shopName}" permanently deleted successfully!`);
        
        // Reload shops
        if (isShopsLoaded) {
          loadShops(currentPage, searchTerm);
        }
        
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError(data.error || 'Failed to permanently delete shop');
      }
    } catch (error) {
      console.error('Error permanently deleting shop:', error);
      setError('An error occurred while permanently deleting shop');
    } finally {
      setIsLoading(false);
    }
  };

  // Clear edit mode
  const clearEdit = () => {
    setFormData({
      shopName: '',
      ownerName: '',
      address: '',
      contactNumber: '',
      email: '',
      businessRegisterNo: '',
      image: '',
      creditLimit: defaultCreditLimit.toString(),
      balanceAmount: '0',
      isActive: false
    });
    setIsEditing(false);
    setEditingId(null);
    setError('');
    setMessage('');
  };

  // Handle search form submission (prevent default since we have real-time search)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Real-time search handles the search automatically
  };

  // Handle load all shops
  const handleLoadAll = () => {
    setSearchTerm(''); // Clear search term
    loadShops(1, '', true); // Directly load all shops
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages && !isLoading) {
      loadShops(page, searchTerm, false);
    }
  };

  // Show loading while checking authorization
  if (authLoading) {
    return <div className={styles.loading}>Checking permissions...</div>;
  }

  // Show access denied if not authorized
  if (!isAuthorized) {
    return <div className={styles.accessDenied}>Access denied to shop management</div>;
  }

  return (
    <div className={`${styles.container} ${isDarkMode ? 'dark' : 'light'}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {isEditing ? 'Edit Shop' : 'Shop Management'}
        </h1>
        {isEditing && (
          <button
            type="button"
            onClick={clearEdit}
            className={styles.clearButton}
          >
            Cancel Edit
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Shop Name: *</label>
            <input
              type="text"
              value={formData.shopName}
              onChange={(e) => setFormData(prev => ({ ...prev, shopName: e.target.value }))}
              className={styles.input}
              placeholder="Enter shop name"
              disabled={isLoading}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Owner Name: *</label>
            <input
              type="text"
              value={formData.ownerName}
              onChange={(e) => setFormData(prev => ({ ...prev, ownerName: e.target.value }))}
              className={styles.input}
              placeholder="Enter owner name"
              disabled={isLoading}
              required
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Address: *</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className={`${styles.input} ${styles.textarea}`}
              placeholder="Enter complete address"
              disabled={isLoading}
              rows={3}
              required
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Contact Number: *</label>
            <input
              type="tel"
              value={formData.contactNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, contactNumber: e.target.value }))}
              className={styles.input}
              placeholder="Enter contact number"
              disabled={isLoading}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Email:</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className={styles.input}
              placeholder="Enter email address"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Business Register No:</label>
            <input
              type="text"
              value={formData.businessRegisterNo}
              onChange={(e) => setFormData(prev => ({ ...prev, businessRegisterNo: e.target.value }))}
              className={styles.input}
              placeholder="Enter business register number"
              disabled={isLoading}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Credit Limit:</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.creditLimit}
              onChange={(e) => setFormData(prev => ({ ...prev, creditLimit: e.target.value }))}
              onWheel={handleNumberInputWheel}
              className={styles.input}
              placeholder="Enter credit limit"
              disabled={isLoading}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Balance Amount:</label>
            <input
              type="number"
              step="0.01"
              value={formData.balanceAmount}
              onChange={(e) => setFormData(prev => ({ ...prev, balanceAmount: e.target.value }))}
              onWheel={handleNumberInputWheel}
              className={styles.input}
              placeholder="Enter balance amount"
              disabled={isLoading}
              readOnly
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Image URL:</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
              className={styles.input}
              placeholder="Enter image URL"
              disabled={isLoading}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Status:</label>
            <select
              value={formData.isActive ? 'active' : 'inactive'}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'active' }))}
              className={styles.input}
              disabled={isLoading}
            >
              <option value="inactive">Inactive</option>
              <option value="active">Active</option>
            </select>
          </div>
        </div>
        
        {error && <div className={styles.error}>{error}</div>}
        {message && <div className={styles.success}>{message}</div>}
        
        <div className={styles.submitSection}>
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : (isEditing ? 'Update Shop' : 'Create Shop')}
          </button>
        </div>
      </form>

      {/* Shops List Section */}
      <div className={styles.shopsList}>
        <div className={styles.shopsHeader}>
          <h2 className={styles.subtitle}>Existing Shops</h2>
          <div className={styles.searchSection}>
            <form onSubmit={handleSearch} className={styles.searchForm}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by shop name, owner, contact..."
                className={styles.searchInput}
              />
              <button
                type="submit"
                className={styles.searchButton}
                disabled={isLoading}
              >
                Search
              </button>
            </form>
            <button
              onClick={handleLoadAll}
              className={styles.loadButton}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Load All'}
            </button>
          </div>
        </div>

        <div className={styles.shopsContent}>
          {!isShopsLoaded ? (
            <div className={styles.noShops}>
              <div className={styles.noShopsIcon}>🏪</div>
              <h3>Shop Directory</h3>
              <p>Click <strong>"Load All"</strong> to view all registered shops</p>
              <p>Or use the search box to find specific shops</p>
            </div>
          ) : shops.length === 0 ? (
            <div className={styles.noShops}>
              <div className={styles.noShopsIcon}>🔍</div>
              <h3>No Shops Found</h3>
              <p>
                {searchTerm 
                  ? `No shops match "${searchTerm}". Try a different search term.` 
                  : 'No shops have been registered yet. Create your first shop using the form above.'}
              </p>
              {searchTerm && (
                <button onClick={handleLoadAll} className={styles.loadButton} style={{marginTop: '1rem'}}>
                  View All Shops
                </button>
              )}
            </div>
          ) : (
            <div className={styles.shopsTable}>
              <div className={styles.tableHeader}>
                <div>Shop Name</div>
                <div>Owner</div>
                <div>Contact</div>
                <div>Credit Limit</div>
                <div>Balance Amount</div>
                <div>Status</div>
                <div>Created By</div>
                <div>Actions</div>
              </div>
              <div className={styles.tableBody}>
                {shops.map((shop) => (
                  <div key={shop.id} className={styles.tableRow}>
                    <div className={styles.shopName}>{shop.shopName}</div>
                    <div className={styles.ownerName}>{shop.ownerName}</div>
                    <div className={styles.contact}>{shop.contactNumber}</div>
                    <div className={styles.creditLimit}>LKR {Number(shop.creditLimit).toLocaleString()}</div>
                    <div className={styles.balanceAmount}>LKR {Number(shop.balanceAmount).toLocaleString()}</div>
                    <div>
                      <span className={`${styles.status} ${shop.isActive ? styles.active : styles.inactive}`}>
                        {shop.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className={styles.user}>{shop.user}</div>
                    <div className={styles.actions}>
                      <button
                        onClick={() => handleEdit(shop)}
                        className={styles.editButton}
                        disabled={isLoading}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(shop.id, shop.shopName, shop.isActive)}
                        className={`${styles.toggleButton} ${shop.isActive ? styles.deactivate : styles.activate}`}
                        disabled={isLoading}
                      >
                        {shop.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(shop.id, shop.shopName)}
                        className={styles.deleteButton}
                        disabled={isLoading}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}



          {/* Simple Pagination Always Visible */}
          {shops.length > 0 && (
            <div className={styles.pagination}>
              
              
              {pagination.totalPages > 1 && (
                <div className={styles.pageNumbers}>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!pagination.hasPrev || isLoading}
                    className={styles.pageBtn}
                  >
                    ← Previous
                  </button>
                
                {/* Smart pagination - show first, current range, and last */}
                {(() => {
                  const pages = [];
                  const totalPages = pagination.totalPages;
                  const current = currentPage;
                  
                  if (totalPages <= 7) {
                    // Show all pages if 7 or fewer
                    for (let i = 1; i <= totalPages; i++) {
                      pages.push(i);
                    }
                  } else {
                    // Always show first page
                    pages.push(1);
                    
                    if (current > 3) {
                      pages.push('...');
                    }
                    
                    // Show current page and neighbors
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
                    
                    // Always show last page
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
                        className={`${styles.pageBtn} ${page === currentPage ? styles.active : ''}`}
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
                  className={styles.pageBtn}
                >
                  Next →
                </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopManagement;