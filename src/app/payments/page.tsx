'use client';

import React, { useState, useEffect } from 'react';
import { usePageProtection } from '@/components/ProtectedRoute';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { handleNumberInputWheel } from '@/lib/numberInputUtils';
import styles from './payments.module.css';

interface Shop {
  id: number;
  shopName: string;
  ownerName: string;
  contactNumber: string;
}

interface Invoice {
  id: number;
  invoiceNumber: string;
  invoiceDate: string;
}

interface PendingPayment {
  id: number;
  invoiceId: number;
  shopId: number;
  netTotal: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: string;
  dueDate?: string;
  createdAt: string;
  shop: Shop;
  invoice: Invoice;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const PaymentManagement: React.FC = () => {
  // Page protection
  const { isAuthorized, isLoading: authLoading } = usePageProtection('payments');
  
  // Theme and auth
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  
  // State
  const [payments, setPayments] = useState<PendingPayment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<PendingPayment | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // Pagination
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false
  });

  // Helper function to get user headers
  const getUserHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'X-User-Name': user?.username || 'unknown'
    };
  };

  // Load payments
  const loadPayments = async (page: number = 1) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        search: searchTerm,
        ...(statusFilter && { status: statusFilter })
      });

      const response = await fetch(`/api/payments?${params}`, {
        headers: getUserHeaders()
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPayments(data.payments);
        setPagination(data.pagination);
      } else {
        setError(data.error || 'Failed to load payments');
      }
    } catch (error) {
      console.error('Error loading payments:', error);
      setError('Failed to load payments');
    } finally {
      setIsLoading(false);
    }
  };

  // Load payments on component mount and when search changes
  useEffect(() => {
    if (isAuthorized) {
      loadPayments(1);
    }
  }, [isAuthorized, searchTerm, statusFilter]);

  // Open payment modal
  const openPaymentModal = (payment: PendingPayment) => {
    setSelectedPayment(payment);
    setPaymentAmount('');
    setDescription('');
    setShowPaymentModal(true);
    setError('');
    setMessage('');
  };

  // Close payment modal
  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedPayment(null);
    setPaymentAmount('');
    setDescription('');
  };

  // Process payment
  const processPayment = async () => {
    if (!selectedPayment || !paymentAmount) {
      setError('Please enter payment amount');
      return;
    }

    const amount = parseFloat(paymentAmount);
    if (amount <= 0) {
      setError('Payment amount must be greater than 0');
      return;
    }

    if (amount > selectedPayment.remainingAmount) {
      setError(`Payment amount cannot exceed remaining balance: LKR ${selectedPayment.remainingAmount.toLocaleString()}`);
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const response = await fetch('/api/payments', {
        method: 'PUT',
        headers: getUserHeaders(),
        body: JSON.stringify({
          id: selectedPayment.id,
          paidAmount: amount,
          description
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Payment processed successfully');
        closePaymentModal();
        loadPayments(pagination.currentPage);
      } else {
        setError(data.error || 'Failed to process payment');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setError('Failed to process payment');
    } finally {
      setIsLoading(false);
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return styles.statusPending;
      case 'partial': return styles.statusPartial;
      case 'completed': return styles.statusCompleted;
      case 'cancelled': return styles.statusCancelled;
      default: return '';
    }
  };

  // Check if payment is overdue
  const isOverdue = (dueDate: string | undefined) => {
    if (!dueDate) return false;
    const today = new Date();
    const due = new Date(dueDate);
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

  // Format due date with overdue highlighting
  const formatDueDate = (dueDate: string | undefined) => {
    if (!dueDate) return 'N/A';
    
    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${due.toLocaleDateString()} (${Math.abs(diffDays)} days overdue)`;
    } else if (diffDays === 0) {
      return `${due.toLocaleDateString()} (Due Today)`;
    } else if (diffDays <= 7) {
      return `${due.toLocaleDateString()} (Due in ${diffDays} days)`;
    } else {
      return due.toLocaleDateString();
    }
  };

  // Show loading while checking authorization
  if (authLoading) {
    return <div className={styles.loading}>Checking permissions...</div>;
  }

  // Show access denied if not authorized
  if (!isAuthorized) {
    return <div className={styles.accessDenied}>Access denied to payment management</div>;
  }

  return (
    <div className={`${styles.container} ${isDarkMode ? styles.dark : ''}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Payment Management</h1>
        <p className={styles.subtitle}>Manage pending payments and process payments</p>
      </div>

      {/* Search and Filter Section */}
      <div className={styles.searchSection}>
        <div className={styles.searchRow}>
          <div className={styles.searchGroup}>
            <input
              type="text"
              placeholder="Search by shop name or invoice number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <div className={styles.filterGroup}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="partial">Partial</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="due">Due Payments</option>
            </select>
          </div>
          <button
            onClick={() => loadPayments(1)}
            className={styles.searchButton}
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Payments Table */}
      {payments.length > 0 ? (
        <div className={styles.tableSection}>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead className={styles.tableHead}>
                <tr>
                  <th>Invoice #</th>
                  <th>Shop Name</th>
                  <th>Invoice Date</th>
                  <th>Due Date</th>
                  <th>Net Total</th>
                  <th>Paid Amount</th>
                  <th>Remaining</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {payments.map((payment) => (
                  <tr key={payment.id} className={styles.tableRow}>
                    <td className={styles.invoiceNumber}>
                      {payment.invoice.invoiceNumber}
                    </td>
                    <td>
                      <div className={styles.shopInfo}>
                        <div className={styles.shopName}>{payment.shop.shopName}</div>
                        <div className={styles.shopOwner}>{payment.shop.ownerName}</div>
                      </div>
                    </td>
                    <td>
                      {new Date(payment.invoice.invoiceDate).toLocaleDateString()}
                    </td>
                    <td className={`${styles.dueDate} ${isOverdue(payment.dueDate) ? styles.overdue : ''}`}>
                      {formatDueDate(payment.dueDate)}
                    </td>
                    <td className={styles.amount}>
                      LKR {payment.netTotal.toLocaleString()}
                    </td>
                    <td className={styles.amount}>
                      LKR {payment.paidAmount.toLocaleString()}
                    </td>
                    <td className={styles.amount}>
                      LKR {payment.remainingAmount.toLocaleString()}
                    </td>
                    <td>
                      <span className={`${styles.status} ${getStatusColor(payment.paymentStatus)}`}>
                        {payment.paymentStatus.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      {payment.paymentStatus === 'pending' || payment.paymentStatus === 'partial' ? (
                        <button
                          onClick={() => openPaymentModal(payment)}
                          className={styles.payButton}
                        >
                          Add Payment
                        </button>
                      ) : (
                        <span className={styles.completedText}>
                          {payment.paymentStatus === 'completed' ? 'Completed' : 'Cancelled'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={() => loadPayments(pagination.currentPage - 1)}
                disabled={!pagination.hasPrev || isLoading}
                className={styles.pageButton}
              >
                Previous
              </button>
              <span className={styles.pageInfo}>
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => loadPayments(pagination.currentPage + 1)}
                disabled={!pagination.hasNext || isLoading}
                className={styles.pageButton}
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.noData}>
          {isLoading ? 'Loading payments...' : 'No pending payments found'}
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedPayment && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Process Payment</h3>
              <button onClick={closePaymentModal} className={styles.closeButton}>×</button>
            </div>
            <div className={styles.modalContent}>
              <div className={styles.paymentDetails}>
                <p><strong>Invoice:</strong> {selectedPayment.invoice.invoiceNumber}</p>
                <p><strong>Shop:</strong> {selectedPayment.shop.shopName}</p>
                <p><strong>Due Date:</strong> 
                  <span className={isOverdue(selectedPayment.dueDate) ? styles.overdue : ''}>
                    {formatDueDate(selectedPayment.dueDate)}
                  </span>
                </p>
                <p><strong>Total Amount:</strong> LKR {selectedPayment.netTotal.toLocaleString()}</p>
                <p><strong>Already Paid:</strong> LKR {selectedPayment.paidAmount.toLocaleString()}</p>
                <p><strong>Remaining:</strong> LKR {selectedPayment.remainingAmount.toLocaleString()}</p>
              </div>
              
              <div className={styles.paymentForm}>
                <div className={styles.formGroup}>
                  <label>Payment Amount (LKR)</label>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="Enter payment amount"
                    onWheel={handleNumberInputWheel}
                    className={styles.input}
                    max={selectedPayment.remainingAmount}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Description (Optional)</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Payment description"
                    className={styles.input}
                  />
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button onClick={closePaymentModal} className={styles.cancelButton}>
                Cancel
              </button>
              <button 
                onClick={processPayment} 
                className={styles.processButton}
                disabled={isLoading || !paymentAmount}
              >
                {isLoading ? 'Processing...' : 'Process Payment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      {error && <div className={styles.error}>{error}</div>}
      {message && <div className={styles.success}>{message}</div>}
    </div>
  );
};

export default PaymentManagement;