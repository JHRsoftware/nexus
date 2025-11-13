'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { usePageProtection } from '@/components/ProtectedRoute';
import { useTheme } from '@/contexts/ThemeContext';
import styles from './add.module.css';

interface Discount {
  id: number;
  discountName: string;
  percentage: number;
  isActive: boolean;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export default function DiscountManagement() {
  // Page protection - check if user has access to discount pages
  const { isAuthorized, isLoading: authLoading } = usePageProtection('discounts');
  
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  // Form states
  const [formData, setFormData] = useState({
    discountName: '',
    percentage: ''
  });
  
  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Pagination states
  const [isDiscountsLoaded, setIsDiscountsLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false,
    limit: 10
  });

  // Show loading while checking authorization
  if (authLoading || !isAuthorized) {
    return null; // ProtectedRoute component handles the loading UI and redirects
  }

  // Load discounts
  const loadDiscounts = async (page = 1, search = '') => {
    try {
      setIsLoading(true);
      setError('');
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search })
      });
      
      const response = await fetch(`/api/discounts?${params}`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        setDiscounts(data.discounts);
        setPagination(data.pagination);
        setCurrentPage(page);
        setIsDiscountsLoaded(true);
        setMessage(`Discounts loaded successfully! (Page ${page} of ${data.pagination.totalPages})`);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError(data.error || 'Failed to load discounts');
      }
    } catch (error) {
      console.error('Error loading discounts:', error);
      setError('An error occurred while loading discounts');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please log in to manage discounts');
      return;
    }

    if (!formData.discountName.trim() || !formData.percentage.trim()) {
      setError('Please fill in all fields');
      return;
    }

    const percentage = parseFloat(formData.percentage);
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      setError('Percentage must be a number between 0 and 100');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const url = isEditing ? '/api/discounts' : '/api/discounts';
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'x-user-data': JSON.stringify(user)
        },
        body: JSON.stringify({
          ...(isEditing && { id: editingId }),
          discountName: formData.discountName.trim(),
          percentage: percentage,
          isActive: true
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage(isEditing ? 'Discount updated successfully!' : 'Discount created successfully!');
        
        // Reset form
        setFormData({ discountName: '', percentage: '' });
        setIsEditing(false);
        setEditingId(null);
        
        // Reload discounts
        if (isDiscountsLoaded) {
          loadDiscounts(currentPage, searchTerm);
        }
        
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError(data.error || 'Failed to save discount');
      }
    } catch (error) {
      console.error('Error saving discount:', error);
      setError('An error occurred while saving discount');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if discount is protected (Cash or Credit)
  const isProtectedDiscount = (discountName: string) => {
    return discountName.toLowerCase() === 'cash' || discountName.toLowerCase() === 'credit';
  };

  // Handle edit for protected discounts (percentage only)
  const handleEditProtected = (discount: Discount) => {
    setFormData({
      discountName: discount.discountName,
      percentage: discount.percentage.toString()
    });
    setIsEditing(true);
    setEditingId(discount.id);
    setError('');
    setMessage(`Editing ${discount.discountName} discount - Name cannot be changed, only percentage can be updated.`);
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle edit
  const handleEdit = (discount: Discount) => {
    // Prevent editing protected discounts names
    if (isProtectedDiscount(discount.discountName)) {
      setError('Cash and Credit discount names cannot be edited. You can only change their percentage values.');
      return;
    }

    setFormData({
      discountName: discount.discountName,
      percentage: discount.percentage.toString()
    });
    setIsEditing(true);
    setEditingId(discount.id);
    setError('');
    setMessage('');
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle toggle active/inactive
  const handleToggleStatus = async (id: number, discountName: string, currentStatus: boolean) => {
    // Prevent toggling protected discounts
    if (isProtectedDiscount(discountName)) {
      setError('Cash and Credit discounts cannot be deactivated as they are system required discounts.');
      return;
    }

    const action = currentStatus ? 'deactivate' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} the discount "${discountName}"?`)) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/discounts?id=${id}&action=toggle`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        
        // Reload discounts
        if (isDiscountsLoaded) {
          loadDiscounts(currentPage, searchTerm);
        }
        
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError(data.error || 'Failed to update discount status');
      }
    } catch (error) {
      console.error('Error toggling discount status:', error);
      setError('An error occurred while updating discount status');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle permanent delete
  const handlePermanentDelete = async (id: number, discountName: string) => {
    // Prevent deleting protected discounts
    if (isProtectedDiscount(discountName)) {
      setError('Cash and Credit discounts cannot be deleted as they are system required discounts.');
      return;
    }

    if (!window.confirm(`⚠️ PERMANENT DELETE WARNING!\n\nAre you sure you want to PERMANENTLY delete "${discountName}"?\n\nThis action CANNOT be undone and will remove the discount from the database completely.`)) {
      return;
    }

    // Double confirmation for permanent delete
    if (!window.confirm(`Final confirmation: Permanently delete "${discountName}"?\n\nClick OK to proceed with permanent deletion.`)) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/discounts?id=${id}&action=permanent`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`Discount "${discountName}" permanently deleted successfully!`);
        
        // Reload discounts
        if (isDiscountsLoaded) {
          loadDiscounts(currentPage, searchTerm);
        }
        
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError(data.error || 'Failed to permanently delete discount');
      }
    } catch (error) {
      console.error('Error permanently deleting discount:', error);
      setError('An error occurred while permanently deleting discount');
    } finally {
      setIsLoading(false);
    }
  };

  // Clear edit mode
  const clearEdit = () => {
    setFormData({ discountName: '', percentage: '' });
    setIsEditing(false);
    setEditingId(null);
    setError('');
    setMessage('');
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (isDiscountsLoaded) {
      loadDiscounts(1, searchTerm);
    }
  };

  return (
    <div className={`${styles.container} ${isDarkMode ? 'dark' : 'light'}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {isEditing ? 'Edit Discount' : 'Discount Management'}
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
            <label className={styles.label}>Discount Name:</label>
            <input
              type="text"
              value={formData.discountName}
              onChange={(e) => setFormData(prev => ({ ...prev, discountName: e.target.value }))}
              className={`${styles.input} ${isEditing && isProtectedDiscount(formData.discountName) ? styles.disabledInput : ''}`}
              placeholder="Enter discount name (e.g., Summer Sale, VIP Discount)"
              readOnly={isEditing && isProtectedDiscount(formData.discountName)}
              disabled={isEditing && isProtectedDiscount(formData.discountName)}
              title={isEditing && isProtectedDiscount(formData.discountName) ? 'Cash and Credit discount names cannot be changed' : ''}
              required
            />
          </div>
          
          <div className={styles.field}>
            <label className={styles.label}>Percentage (%):</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={formData.percentage}
              onChange={(e) => setFormData(prev => ({ ...prev, percentage: e.target.value }))}
              className={styles.input}
              placeholder="Enter percentage (0-100)"
              required
            />
          </div>
        </div>

        <div className={styles.submitSection}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Discount' : 'Create Discount')}
          </button>
        </div>

        {message && <p className={styles.success}>{message}</p>}
        {error && <p className={styles.error}>{error}</p>}
      </form>

      {/* Discounts List Section */}
      <div className={styles.discountsList}>
        <div className={styles.discountsHeader}>
          <h2 className={styles.subtitle}>Existing Discounts</h2>
          <div className={styles.searchSection}>
            <form onSubmit={handleSearch} className={styles.searchForm}>
              <input
                type="text"
                placeholder="Search discounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              <button type="submit" className={styles.searchButton} disabled={isLoading}>
                Search
              </button>
            </form>
            <button
              onClick={() => loadDiscounts(1)}
              className={styles.loadButton}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Load Discounts'}
            </button>
          </div>
        </div>

        {isDiscountsLoaded && (
          <div className={styles.discountsContent}>
            {discounts.length === 0 ? (
              <p className={styles.noDiscounts}>No discounts found.</p>
            ) : (
              <div className={styles.discountsTable}>
                <div className={styles.tableHeader}>
                  <div>Discount Name</div>
                  <div>Percentage</div>
                  <div>Status</div>
                  <div>Created By</div>
                  <div>Actions</div>
                </div>
                
                {discounts.map((discount) => (
                  <div key={discount.id} className={styles.tableRow}>
                    <div className={styles.discountName}>{discount.discountName}</div>
                    <div className={styles.percentage}>{discount.percentage}%</div>
                    <div>
                      <span className={`${styles.status} ${discount.isActive ? styles.active : styles.inactive}`}>
                        {discount.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className={styles.user}>{discount.user}</div>
                    <div className={styles.actions}>
                      {isProtectedDiscount(discount.discountName) ? (
                        <>
                          <button
                            onClick={() => handleEditProtected(discount)}
                            className={styles.editButton}
                            disabled={isLoading}
                            title="Edit percentage only"
                          >
                            Edit %
                          </button>
                          <button
                            className={`${styles.toggleButton} ${styles.disabledButton}`}
                            disabled={true}
                            title="System discounts are always active"
                          >
                            Always Active
                          </button>
                          <button
                            className={`${styles.deleteButton} ${styles.disabledButton}`}
                            disabled={true}
                            title="System discounts cannot be deleted"
                          >
                            Protected
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(discount)}
                            className={styles.editButton}
                            disabled={isLoading}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleToggleStatus(discount.id, discount.discountName, discount.isActive)}
                            className={`${styles.toggleButton} ${discount.isActive ? styles.deactivate : styles.activate}`}
                            disabled={isLoading}
                          >
                            {discount.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handlePermanentDelete(discount.id, discount.discountName)}
                            className={styles.deleteButton}
                            disabled={isLoading}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  onClick={() => loadDiscounts(currentPage - 1, searchTerm)}
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
                          onClick={() => loadDiscounts(pageNum, searchTerm)}
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
                  onClick={() => loadDiscounts(currentPage + 1, searchTerm)}
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
                ({pagination.totalCount} total discounts)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}