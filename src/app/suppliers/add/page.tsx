'use client';

import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { usePageProtection } from '@/components/ProtectedRoute';
import styles from './add.module.css';

interface Supplier {
  id: number;
  supplierName: string;
  address: string;
  contactNumber: string;
  email: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export default function AddSupplier() {
  // Page protection - check if user has access to Suppliers pages
  const { isAuthorized, isLoading: authLoading } = usePageProtection('suppliers');
  
  const { user } = useAuth();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSupplierLoaded, setIsSupplierLoaded] = useState(false);
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [formData, setFormData] = useState({
    supplierName: '',
    address: '',
    contactNumber: '',
    email: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState({
    supplierName: '',
    address: '',
    contactNumber: '',
    email: ''
  });

  const loadSuppliers = async (page = 1, search = '') => {
    try {
      setIsLoadingSuppliers(true);
      setError('');
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search })
      });
      
      const response = await fetch(`/api/suppliers?${params}`);
      const data = await response.json();
      
      if (response.ok && data.suppliers) {
        setSuppliers(data.suppliers);
        setPagination(data.pagination);
        setCurrentPage(page);
        setIsSupplierLoaded(true);
        setMessage(`Suppliers loaded successfully! (Page ${page} of ${data.pagination.totalPages})`);
      } else {
        setError(data.error || 'Failed to load suppliers');
      }
    } catch (error) {
      console.error('Error loading suppliers:', error);
      setError('An error occurred while loading suppliers');
    } finally {
      setIsLoadingSuppliers(false);
    }
  };

  // Search functionality with API call
  const handleSearch = (searchValue: string) => {
    setSearchTerm(searchValue);
    if (isSupplierLoaded) {
      loadSuppliers(1, searchValue); // Reset to page 1 when searching
    }
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      loadSuppliers(currentPage + 1, searchTerm);
    }
  };

  const handlePrevPage = () => {
    if (pagination.hasPrevPage) {
      loadSuppliers(currentPage - 1, searchTerm);
    }
  };

  const handlePageClick = (page: number) => {
    loadSuppliers(page, searchTerm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!formData.supplierName || !formData.address || !formData.contactNumber || !formData.email) {
      setError('All fields are required');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      const response = await fetch('/api/suppliers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-data': JSON.stringify(user)
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Supplier registered successfully!');
        setFormData({
          supplierName: '',
          address: '',
          contactNumber: '',
          email: ''
        });
        // Reload suppliers list only if already loaded
        if (isSupplierLoaded) {
          loadSuppliers(currentPage, searchTerm);
        }
      } else {
        setError(data.error || 'Failed to register supplier');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while registering supplier');
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingId(supplier.id);
    setEditFormData({
      supplierName: supplier.supplierName,
      address: supplier.address,
      contactNumber: supplier.contactNumber,
      email: supplier.email
    });
  };

  const handleUpdate = async (id: number) => {
    try {
      const response = await fetch('/api/suppliers', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...editFormData })
      });

      const data = await response.json();

      if (data.success) {
        setEditingId(null);
        if (isSupplierLoaded) {
          loadSuppliers(currentPage, searchTerm);
        }
        setMessage('Supplier updated successfully!');
      } else {
        setError(data.error || 'Failed to update supplier');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while updating supplier');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this supplier?')) {
      try {
        const response = await fetch(`/api/suppliers?id=${id}`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (data.success) {
          if (isSupplierLoaded) {
            loadSuppliers(currentPage, searchTerm);
          }
          setMessage('Supplier deleted successfully!');
        } else {
          setError(data.error || 'Failed to delete supplier');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('An error occurred while deleting supplier');
      }
    }
  };

  // Show loading while checking authorization
  if (authLoading || !isAuthorized) {
    return null; // ProtectedRoute component handles the loading UI and redirects
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Supplier Registration</h1>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Supplier Name"
          value={formData.supplierName}
          onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
          className={styles.input}
        />

        <textarea
          placeholder="Address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className={styles.textarea}
          rows={3}
        />

        <input
          type="tel"
          placeholder="Contact Number"
          value={formData.contactNumber}
          onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
          className={styles.input}
        />

        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={styles.input}
        />

        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.button}>
            Register Supplier
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {message && <div className={styles.success}>{message}</div>}
      </form>

      <div className={styles.suppliersList}>
        <div className={styles.suppliersHeader}>
          <h2 className={styles.subtitle}>Supplier Management</h2>
          <button
            onClick={() => loadSuppliers()}
            className={`${styles.button} ${styles.loadButton}`}
            disabled={isLoadingSuppliers}
          >
            {isLoadingSuppliers ? 'Loading...' : 'Load Suppliers'}
          </button>
        </div>
        
        {isSupplierLoaded && (
          <div className={styles.searchSection}>
            <input
              type="text"
              placeholder="Search by supplier name, email, contact, or address..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className={styles.searchInput}
            />
            {searchTerm && (
              <p className={styles.searchResults}>
                Showing {suppliers.length} of {pagination.totalCount} suppliers (filtered by "{searchTerm}")
              </p>
            )}
          </div>
        )}
        
        {!isSupplierLoaded ? (
          <p className={styles.noSuppliers}>Click "Load Suppliers" to view registered suppliers.</p>
        ) : suppliers.length === 0 ? (
          searchTerm ? (
            <p className={styles.noSuppliers}>No suppliers found matching "{searchTerm}".</p>
          ) : (
            <p className={styles.noSuppliers}>No suppliers registered yet.</p>
          )
        ) : (
          <>
            <div className={styles.supplierItems}>
              {suppliers.map((supplier: Supplier) => (
              <div key={supplier.id} className={styles.supplierItem}>
                {editingId === supplier.id ? (
                  // Edit mode
                  <div className={styles.editMode}>
                    <div className={styles.editField}>
                      <label className={styles.editLabel}>Supplier Name</label>
                      <input
                        type="text"
                        value={editFormData.supplierName}
                        onChange={(e) => setEditFormData({ ...editFormData, supplierName: e.target.value })}
                        className={styles.editInput}
                        placeholder="Enter supplier name"
                      />
                    </div>

                    <div className={styles.editField}>
                      <label className={styles.editLabel}>Address</label>
                      <textarea
                        value={editFormData.address}
                        onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                        className={styles.editTextarea}
                        placeholder="Enter address"
                        rows={3}
                      />
                    </div>

                    <div className={styles.editField}>
                      <label className={styles.editLabel}>Contact Number</label>
                      <input
                        type="tel"
                        value={editFormData.contactNumber}
                        onChange={(e) => setEditFormData({ ...editFormData, contactNumber: e.target.value })}
                        className={styles.editInput}
                        placeholder="Enter contact number"
                      />
                    </div>

                    <div className={styles.editField}>
                      <label className={styles.editLabel}>Email</label>
                      <input
                        type="email"
                        value={editFormData.email}
                        onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                        className={styles.editInput}
                        placeholder="Enter email address"
                      />
                    </div>

                    <div className={styles.editButtons}>
                      <button
                        onClick={() => handleUpdate(supplier.id)}
                        className={styles.saveBtn}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className={styles.cancelBtn}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <div className={styles.viewMode}>
                    <div className={styles.supplierInfo}>
                      <div className={styles.supplierHeader}>
                        <span className={styles.supplierName}>{supplier.supplierName}</span>
                        <span className={styles.supplierEmail}>{supplier.email}</span>
                      </div>
                      <div className={styles.supplierDetails}>
                        <div className={styles.supplierAddress}>
                          <strong>Address:</strong> {supplier.address}
                        </div>
                        <div className={styles.supplierContact}>
                          <strong>Contact:</strong> {supplier.contactNumber}
                        </div>
                      </div>
                      <div className={styles.supplierUser}>Added by: {supplier.user}</div>
                    </div>
                    <div className={styles.supplierActions}>
                      <button
                        onClick={() => handleEdit(supplier)}
                        className={styles.editBtn}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(supplier.id)}
                        className={styles.deleteBtn}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={handlePrevPage}
                disabled={!pagination.hasPrevPage}
                className={`${styles.pageBtn} ${!pagination.hasPrevPage ? styles.disabled : ''}`}
              >
                ← Previous
              </button>
              
              <div className={styles.pageNumbers}>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageClick(page)}
                    className={`${styles.pageBtn} ${page === currentPage ? styles.active : ''}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleNextPage}
                disabled={!pagination.hasNextPage}
                className={`${styles.pageBtn} ${!pagination.hasNextPage ? styles.disabled : ''}`}
              >
                Next →
              </button>
            </div>
          )}

          {/* Pagination Info */}
          {isSupplierLoaded && (
            <div className={styles.paginationInfo}>
              <p>
                Showing {suppliers.length} of {pagination.totalCount} suppliers 
                {searchTerm && ` (filtered by "${searchTerm}")`}
                • Page {currentPage} of {pagination.totalPages}
              </p>
            </div>
          )}
          </>
        )}
      </div>
    </div>
  );
}