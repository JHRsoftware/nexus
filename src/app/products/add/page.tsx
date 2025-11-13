'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { usePageProtection } from '@/components/ProtectedRoute';
import styles from './add.module.css';

interface Category {
  id: number;
  category: string;
  user: string;
}

interface Product {
  id: number;
  categoryId: number;
  productCode: string;
  itemName: string;
  sellingPrice: number;
  availableQty: number;
  totalCost: number;
  user: string;
  category?: {
    category: string;
  };
}

export default function AddProduct() {
  // Page protection - check if user has access to Products pages
  const { isAuthorized, isLoading: authLoading } = usePageProtection('products');
  
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProductsLoaded, setIsProductsLoaded] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
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
    categoryId: '',
    productCode: '',
    itemName: '',
    sellingPrice: '',
    availableQty: '',
    totalCost: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState({
    categoryId: '',
    productCode: '',
    itemName: '',
    sellingPrice: '',
    availableQty: '',
    totalCost: ''
  });

  // Load categories on component mount (products will be loaded manually)
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/category');
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadProducts = async (page = 1, search = '') => {
    try {
      setIsLoadingProducts(true);
      setError('');
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search })
      });
      
      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.products);
        setPagination(data.pagination);
        setCurrentPage(page);
        setIsProductsLoaded(true);
        setMessage(`Products loaded successfully! (Page ${page} of ${data.pagination.totalPages})`);
      } else {
        setError('Failed to load products');
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setError('An error occurred while loading products');
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Search functionality with API call
  const handleSearch = (searchValue: string) => {
    setSearchTerm(searchValue);
    if (isProductsLoaded) {
      loadProducts(1, searchValue); // Reset to page 1 when searching
    }
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      loadProducts(currentPage + 1, searchTerm);
    }
  };

  const handlePrevPage = () => {
    if (pagination.hasPrevPage) {
      loadProducts(currentPage - 1, searchTerm);
    }
  };

  const handlePageClick = (page: number) => {
    loadProducts(page, searchTerm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!formData.categoryId || !formData.productCode || !formData.itemName || 
        !formData.sellingPrice) {
      setError('Category, Product Code, Item Name, and Selling Price are required');
      return;
    }

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-data': JSON.stringify(user)
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Product registered successfully!');
        setFormData({
          categoryId: '',
          productCode: '',
          itemName: '',
          sellingPrice: '',
          availableQty: '',
          totalCost: ''
        });
        // Reload products list only if already loaded
        if (isProductsLoaded) {
          loadProducts(currentPage, searchTerm);
        }
      } else {
        setError(data.error || 'Failed to register product');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while registering product');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditFormData({
      categoryId: product.categoryId.toString(),
      productCode: product.productCode,
      itemName: product.itemName,
      sellingPrice: product.sellingPrice.toString(),
      availableQty: product.availableQty.toString(),
      totalCost: product.totalCost.toString()
    });
  };

  const handleUpdate = async (id: number) => {
    try {
      const response = await fetch('/api/products', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...editFormData })
      });

      const data = await response.json();

      if (data.success) {
        setEditingId(null);
        if (isProductsLoaded) {
          loadProducts(currentPage, searchTerm);
        }
        setMessage('Product updated successfully!');
      } else {
        setError(data.error || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while updating product');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/products?id=${id}`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (data.success) {
          if (isProductsLoaded) {
            loadProducts(currentPage, searchTerm);
          }
          setMessage('Product deleted successfully!');
        } else {
          setError(data.error || 'Failed to delete product');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('An error occurred while deleting product');
      }
    }
  };

  // Prevent mouse wheel scroll on number inputs
  const handleNumberInputWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    e.currentTarget.blur(); // Remove focus to prevent scroll
  };

  // Show loading while checking authorization
  if (authLoading || !isAuthorized) {
    return null; // ProtectedRoute component handles the loading UI and redirects
  }

  // Removed automatic calculation - total cost is now manual entry

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Product Registration</h1>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <select
          value={formData.categoryId}
          onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
          className={styles.select}
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.category}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Product Code"
          value={formData.productCode}
          onChange={(e) => setFormData({ ...formData, productCode: e.target.value })}
          className={styles.input}
        />

        <input
          type="text"
          placeholder="Item Name"
          value={formData.itemName}
          onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
          className={styles.input}
        />

        <input
          type="number"
          step="0.01"
          placeholder="Selling Price"
          value={formData.sellingPrice}
          onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
          onWheel={handleNumberInputWheel}
          className={styles.input}
        />

        <input
          type="number"
          placeholder="Available Quantity (Read-only)"
          value={formData.availableQty}
          onChange={(e) => setFormData({ ...formData, availableQty: e.target.value })}
          onWheel={handleNumberInputWheel}
          className={styles.input}
          readOnly
          title="This field is read-only"
        />

        <input
          type="number"
          step="0.01"
          placeholder="Total Cost (Read-only)"
          value={formData.totalCost}
          onChange={(e) => setFormData({ ...formData, totalCost: e.target.value })}
          onWheel={handleNumberInputWheel}
          className={styles.input}
          readOnly
          title="This field is read-only"
        />

        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.button}>
            Register Product
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {message && <div className={styles.success}>{message}</div>}
      </form>

      <div className={styles.productsList}>
        <div className={styles.productsHeader}>
          <h2 className={styles.subtitle}>Product Management</h2>
          <button
            onClick={() => loadProducts()}
            className={`${styles.button} ${styles.loadButton}`}
            disabled={isLoadingProducts}
          >
            {isLoadingProducts ? 'Loading...' : 'Load Products'}
          </button>
        </div>
        
        {isProductsLoaded && (
          <div className={styles.searchSection}>
            <input
              type="text"
              placeholder="Search by product name, code, or category..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className={styles.searchInput}
            />
            {searchTerm && (
              <p className={styles.searchResults}>
                Showing {products.length} of {pagination.totalCount} products (filtered by "{searchTerm}")
              </p>
            )}
          </div>
        )}
        
        {!isProductsLoaded ? (
          <p className={styles.noProducts}>Click "Load Products" to view registered products.</p>
        ) : products.length === 0 ? (
          searchTerm ? (
            <p className={styles.noProducts}>No products found matching "{searchTerm}".</p>
          ) : (
            <p className={styles.noProducts}>No products registered yet.</p>
          )
        ) : (
          <>
            <div className={styles.productItems}>
              {products.map((product: Product) => (
              <div key={product.id} className={styles.productItem}>
                {editingId === product.id ? (
                  // Edit mode
                  <div className={styles.editMode}>
                    <div className={styles.editField}>
                      <label className={styles.editLabel}>Category *</label>
                      <select
                        value={editFormData.categoryId}
                        onChange={(e) => setEditFormData({ ...editFormData, categoryId: e.target.value })}
                        className={styles.editInput}
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className={styles.editField}>
                      <label className={styles.editLabel}>Product Code *</label>
                      <input
                        type="text"
                        value={editFormData.productCode}
                        onChange={(e) => setEditFormData({ ...editFormData, productCode: e.target.value })}
                        className={styles.editInput}
                        placeholder="Enter product code"
                      />
                    </div>

                    <div className={styles.editField}>
                      <label className={styles.editLabel}>Item Name *</label>
                      <input
                        type="text"
                        value={editFormData.itemName}
                        onChange={(e) => setEditFormData({ ...editFormData, itemName: e.target.value })}
                        className={styles.editInput}
                        placeholder="Enter item name"
                      />
                    </div>

                    <div className={styles.editField}>
                      <label className={styles.editLabel}>Selling Price *</label>
                      <input
                        type="number"
                        step="0.01"
                        value={editFormData.sellingPrice}
                        onChange={(e) => setEditFormData({ ...editFormData, sellingPrice: e.target.value })}
                        onWheel={handleNumberInputWheel}
                        className={styles.editInput}
                        placeholder="Enter selling price"
                      />
                    </div>

                    <div className={styles.editField}>
                      <label className={styles.editLabel}>Available Quantity (Read-only)</label>
                      <input
                        type="number"
                        value={editFormData.availableQty}
                        onChange={(e) => setEditFormData({ ...editFormData, availableQty: e.target.value })}
                        onWheel={handleNumberInputWheel}
                        className={styles.editInput}
                        placeholder="Available quantity (read-only)"
                        readOnly
                        title="This field is read-only"
                      />
                    </div>

                    <div className={styles.editField}>
                      <label className={styles.editLabel}>Total Cost (Read-only)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={editFormData.totalCost}
                        onChange={(e) => setEditFormData({ ...editFormData, totalCost: e.target.value })}
                        onWheel={handleNumberInputWheel}
                        className={styles.editInput}
                        placeholder="Total cost (read-only)"
                        readOnly
                        title="This field is read-only"
                      />
                    </div>

                    <div className={styles.editButtons}>
                      <button
                        onClick={() => handleUpdate(product.id)}
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
                    <div className={styles.productInfo}>
                      <div className={styles.productHeader}>
                        <span className={styles.productCode}>{product.productCode}</span>
                        <span className={styles.productCategory}>{product.category?.category}</span>
                      </div>
                      <div className={styles.productName}>{product.itemName}</div>
                      <div className={styles.productDetails}>
                        <span>Price: Rs. {product.sellingPrice}</span>
                        <span>Qty: {product.availableQty}</span>
                        <span>Total: Rs. {product.totalCost}</span>
                      </div>
                      <div className={styles.productUser}>Added by: {product.user}</div>
                    </div>
                    <div className={styles.productActions}>
                      <button
                        onClick={() => handleEdit(product)}
                        className={styles.editBtn}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
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
          {isProductsLoaded && (
            <div className={styles.paginationInfo}>
              <p>
                Showing {products.length} of {pagination.totalCount} products 
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