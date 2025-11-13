'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './orders.module.css';

interface Product {
  id: number;
  productCode: string;
  itemName: string;
  sellingPrice: number;
  availableQty: number;
}

interface Shop {
  id: number;
  shopName: string;
  ownerName: string;
  contactNumber: string;
}

interface SalesRep {
  id: number;
  name: string;
  contactNumber: string;
}

interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  sellingPrice: number;
  discount: number;
  price: number;
  totalPrice: number;
  product: Product;
}

interface Order {
  id: number;
  orderNumber: string;
  orderDate: string;
  shopId: number;
  salesRepId: number | null;
  subTotal: number;
  totalDiscount: number;
  netTotal: number;
  status: string;
  notes: string | null;
  createdAt: string;
  shop: Shop;
  salesRep: SalesRep | null;
  orderItems: OrderItem[];
}

export default function OrdersPage() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ordersLoaded, setOrdersLoaded] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'amount' | 'shop'>('newest');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  // Removed automatic loading - orders will load only when button is clicked

  // Apply filters and search
  useEffect(() => {
    applyFiltersAndSearch();
  }, [orders, searchTerm, statusFilter, dateFilter, sortBy]);

  // Update pagination
  useEffect(() => {
    setTotalPages(Math.ceil(filteredOrders.length / ordersPerPage));
  }, [filteredOrders, ordersPerPage]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      setError(null); // Clear any previous errors
      const response = await fetch('/api/orders');
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      // Handle the API response format: { success: true, orders: [...] }
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
        setOrdersLoaded(true);
      } else {
        setOrders([]);
        setOrdersLoaded(true);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      setError('Failed to load orders. Please try again.');
      setOrders([]); // Set empty array on error
      setOrdersLoaded(false);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFiltersAndSearch = () => {
    // Ensure orders is an array before filtering
    if (!Array.isArray(orders)) {
      return;
    }
    
    let filtered = [...orders];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(term) ||
        order.shop.shopName.toLowerCase().includes(term) ||
        order.shop.ownerName.toLowerCase().includes(term) ||
        order.notes?.toLowerCase().includes(term) ||
        order.salesRep?.name.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status.toLowerCase() === statusFilter.toLowerCase());
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date(now);
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(order => new Date(order.orderDate) >= filterDate);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(order => new Date(order.orderDate) >= filterDate);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(order => new Date(order.orderDate) >= filterDate);
          break;
      }
    }

    // Sort with priority: pending orders first, then by selected sort criteria
    filtered.sort((a, b) => {
      // First priority: Pending orders come first
      const aIsPending = a.status.toLowerCase() === 'pending';
      const bIsPending = b.status.toLowerCase() === 'pending';
      
      if (aIsPending && !bIsPending) return -1; // a comes first
      if (!aIsPending && bIsPending) return 1;  // b comes first
      
      // If both have same status, apply secondary sorting
      switch (sortBy) {
        case 'newest':
          return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
        case 'oldest':
          return new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime();
        case 'amount':
          return b.netTotal - a.netTotal;
        case 'shop':
          return a.shop.shopName.localeCompare(b.shop.shopName);
        default:
          // Default: newest first within same status
          return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
      }
    });

    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleDeleteOrder = async (orderId: number) => {
    // Find the order to get its details for confirmation
    const orderToDelete = orders.find(order => order.id === orderId);
    if (!orderToDelete) {
      alert('Order not found');
      return;
    }

    // Enhanced confirmation message
    const confirmMessage = `Are you sure you want to delete order ${orderToDelete.orderNumber}?\n\nShop: ${orderToDelete.shop.shopName}\nTotal: Rs. ${Number(orderToDelete.netTotal).toFixed(2)}\n\nThis action cannot be undone.`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Show success message
        alert(`Order ${orderToDelete.orderNumber} has been successfully deleted.`);
        
        // Refresh the order list to ensure it's up to date
        await loadOrders();
      } else {
        // Log the full error for debugging
        console.error('Delete error:', {
          status: response.status,
          statusText: response.statusText,
          data: data,
          orderId: orderId
        });
        
        alert(data.error || `Failed to delete order. Status: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('An error occurred while deleting the order. Please check your connection and try again.');
    }
  };

  const getPaginatedOrders = () => {
    const start = (currentPage - 1) * ordersPerPage;
    const end = start + ordersPerPage;
    return filteredOrders.slice(start, end);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return '#ffc107';
      case 'completed': return '#28a745';
      default: return '#6c757d';
    }
  };

  if (isLoading) {
    return (
      <div className={`${styles.container} ${isDarkMode ? 'dark' : 'light'}`}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.container} ${isDarkMode ? 'dark' : 'light'}`}>
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={loadOrders} className={styles.retryButton}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${isDarkMode ? 'dark' : 'light'}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Order Management</h1>
        <button
          onClick={() => router.push('/orders/create')}
          className={styles.createButton}
        >
          + Create New Order
        </button>
      </div>

      {/* Load Orders Button */}
      {!ordersLoaded && (
        <div className={styles.loadSection}>
          <button
            onClick={loadOrders}
            className={styles.loadButton}
            disabled={isLoading}
          >
            {isLoading ? 'Loading Orders...' : 'Load Orders'}
          </button>
        </div>
      )}

      {/* Filters and Search - Only show when orders are loaded */}
      {ordersLoaded && (
      <div className={styles.filtersSection}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search orders by number, shop, owner, or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filters}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last Month</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className={styles.filterSelect}
          >
            <option value="newest">Pending First, Then Newest</option>
            <option value="oldest">Pending First, Then Oldest</option>
            <option value="amount">Pending First, Then Highest Amount</option>
            <option value="shop">Pending First, Then Shop Name</option>
          </select>
        </div>
      </div>
      )}

      {/* Orders Summary - Only show when orders are loaded */}
      {ordersLoaded && (
        <div className={styles.summary}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Total Pending Orders</span>
            <span className={styles.summaryValue}>
              {orders.filter(order => order.status.toLowerCase() === 'pending').length}
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Total Pending Orders Value</span>
            <span className={styles.summaryValue}>
              Rs. {orders
                .filter(order => order.status.toLowerCase() === 'pending')
                .reduce((sum, order) => sum + Number(order.netTotal), 0)
                .toFixed(2)
              }
            </span>
          </div>
        </div>
      )}
      
      {/* Orders Table - Only show when orders are loaded */}
      {ordersLoaded && (
        <>
          {filteredOrders.length === 0 ? (
            <div className={styles.noOrders}>
              <p>No orders found</p>
              {searchTerm || statusFilter !== 'all' || dateFilter !== 'all' ? (
                <p>Try adjusting your search criteria or filters</p>
              ) : (
                <p>Create your first order to get started</p>
              )}
            </div>
          ) : (
            <>
              <div className={styles.tableContainer}>
                <table className={styles.ordersTable}>
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Date</th>
                  <th>Shop</th>
                  <th>Sales Rep</th>
                  <th>Items</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getPaginatedOrders().map((order) => (
                  <tr key={order.id} className={styles.orderRow}>
                    <td className={styles.orderNumber}>
                      <div className={styles.orderNumberContainer}>
                        <span className={styles.orderNumberText}>{order.orderNumber}</span>
                        <span className={styles.orderDate}>
                          {new Date(order.orderDate).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className={styles.dateCell}>
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                    <td className={styles.shopCell}>
                      <div className={styles.shopInfo}>
                        <span className={styles.shopName}>{order.shop.shopName}</span>
                        <span className={styles.ownerName}>{order.shop.ownerName}</span>
                      </div>
                    </td>
                    <td className={styles.salesRepCell}>
                      {order.salesRep ? order.salesRep.name : 'N/A'}
                    </td>
                    <td className={styles.itemsCell}>
                      {order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}
                    </td>
                    <td className={styles.statusCell}>
                      <span 
                        className={styles.statusBadge}
                        style={{ backgroundColor: getStatusColor(order.status) }}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className={styles.totalCell}>
                      Rs. {Number(order.netTotal).toFixed(2)}
                    </td>
                    <td className={styles.actionsCell}>
                      <div className={styles.actions}>
                        {order.status.toLowerCase() === 'pending' && (
                          <button
                            onClick={() => router.push(`/orders/create?editId=${order.id}`)}
                            className={styles.actionButton}
                            title="Edit Order"
                          >
                            ✏️
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          title="Delete Order"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className={styles.mobileCards}>
            {getPaginatedOrders().map((order) => (
              <div key={`mobile-${order.id}`} className={styles.orderCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardOrderNumber}>
                    <span className={styles.orderNumberText}>{order.orderNumber}</span>
                  </div>
                  <span 
                    className={styles.statusBadge}
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                
                <div className={styles.cardContent}>
                  <div className={styles.cardRow}>
                    <span className={styles.cardLabel}>Date:</span>
                    <span className={styles.cardValue}>
                      {new Date(order.orderDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className={styles.cardRow}>
                    <span className={styles.cardLabel}>Shop:</span>
                    <span className={styles.cardValue}>
                      <div>
                        <div className={styles.shopName}>{order.shop.shopName}</div>
                        <div className={styles.ownerName}>{order.shop.ownerName}</div>
                      </div>
                    </span>
                  </div>
                  
                  <div className={styles.cardRow}>
                    <span className={styles.cardLabel}>Sales Rep:</span>
                    <span className={styles.cardValue}>
                      {order.salesRep ? order.salesRep.name : 'N/A'}
                    </span>
                  </div>
                  
                  <div className={styles.cardRow}>
                    <span className={styles.cardLabel}>Items:</span>
                    <span className={styles.cardValue}>
                      {order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className={styles.cardRow}>
                    <span className={styles.cardLabel}>Total:</span>
                    <span className={styles.cardValue}>
                      Rs. {Number(order.netTotal).toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <div className={styles.cardActions}>
                  {order.status.toLowerCase() === 'pending' && (
                    <button
                      onClick={() => router.push(`/orders/create?editId=${order.id}`)}
                      className={`${styles.actionButton} ${styles.editButton}`}
                      title="Edit Order"
                    >
                      ✏️ Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteOrder(order.id)}
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    title="Delete Order"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={styles.pageButton}
              >
                ← Previous
              </button>
              
              <span className={styles.pageInfo}>
                Page {currentPage} of {totalPages} ({filteredOrders.length} orders)
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={styles.pageButton}
              >
                Next →
              </button>
            </div>
          )}
            </>
          )}
        </>
      )}
    </div>
  );
}