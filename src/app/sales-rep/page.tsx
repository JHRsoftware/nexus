'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './sales-rep.module.css';

interface SalesRep {
  id: number;
  name: string;
  contactNumber: string;
  remark: string;
  status: 'active' | 'deactive';
  user: string;
  createdAt: string;
}

const SalesRepPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    remark: '',
    status: 'active' as 'active' | 'deactive'
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [salesReps, setSalesReps] = useState<SalesRep[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState(formData);

  // Check authentication and user permissions
  useEffect(() => {
    const checkAuth = () => {
      const currentUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
      if (!currentUser) {
        router.push('/login');
        return;
      }

      try {
        const userData = JSON.parse(currentUser);
        // Add any additional permission checks here if needed
        console.log('User authenticated:', userData.name);
      } catch (error) {
        console.error('Invalid user data:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  // Get user headers for API requests
  const getUserHeaders = () => {
    const currentUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    
    if (currentUser) {
      headers['x-user-data'] = currentUser;
    }
    
    return headers;
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEditInputChange = (field: keyof typeof editFormData, value: string) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (data: typeof formData) => {
    if (!data.name.trim()) {
      return 'Sales Rep name is required';
    }
    if (!data.contactNumber.trim()) {
      return 'Contact number is required';
    }
    // Basic phone number validation
    const phoneRegex = /^[\+]?[0-9\-\(\)\s]+$/;
    if (!phoneRegex.test(data.contactNumber)) {
      return 'Please enter a valid contact number';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const validationError = validateForm(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const res = await fetch('/api/sales-rep', {
        method: 'POST',
        headers: getUserHeaders(),
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        setFormData({
          name: '',
          contactNumber: '',
          remark: '',
          status: 'active'
        });
        // Reload the list
        loadSalesReps();
      } else {
        setError(data.error || 'Failed to add sales rep');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  // Load sales reps from database
  const loadSalesReps = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sales-rep', {
        headers: getUserHeaders()
      });
      const data = await res.json();
      if (data.success) {
        setSalesReps(data.salesReps);
      } else {
        setError('Failed to load sales reps');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Start editing a sales rep
  const startEdit = (salesRep: SalesRep) => {
    setEditingId(salesRep.id);
    setEditFormData({
      name: salesRep.name,
      contactNumber: salesRep.contactNumber,
      remark: salesRep.remark,
      status: salesRep.status
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditFormData(formData);
  };

  // Update sales rep
  const updateSalesRep = async (id: number) => {
    const validationError = validateForm(editFormData);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const res = await fetch('/api/sales-rep', {
        method: 'PUT',
        headers: getUserHeaders(),
        body: JSON.stringify({ id, ...editFormData }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSalesReps(salesReps.map(rep => 
          rep.id === id ? { ...rep, ...editFormData } : rep
        ));
        cancelEdit();
        setSuccess(true);
        setError('');
      } else {
        setError(data.error || 'Failed to update sales rep');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  // Delete sales rep
  const deleteSalesRep = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete sales rep "${name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/sales-rep?id=${id}`, {
        method: 'DELETE',
        headers: getUserHeaders()
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSalesReps(salesReps.filter(rep => rep.id !== id));
        setSuccess(true);
        setError('');
      } else {
        setError(data.error || 'Failed to delete sales rep');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Sales Representative Management</h1>
      
      {/* Add Sales Rep Form */}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formRow}>
          <input
            type="text"
            className="themed-input"
            placeholder="Sales Rep Name *"
            value={formData.name}
            onChange={e => handleInputChange('name', e.target.value)}
            required
          />
          <input
            type="tel"
            className="themed-input"
            placeholder="Contact Number *"
            value={formData.contactNumber}
            onChange={e => handleInputChange('contactNumber', e.target.value)}
            required
          />
        </div>
        
        <div className={styles.formRow}>
          <textarea
            className={`themed-input ${styles.textarea}`}
            placeholder="Remark (Optional)"
            value={formData.remark}
            onChange={e => handleInputChange('remark', e.target.value)}
            rows={3}
          />
          <select
            className="themed-input"
            value={formData.status}
            onChange={e => handleInputChange('status', e.target.value as 'active' | 'deactive')}
          >
            <option value="active">Active</option>
            <option value="deactive">Deactive</option>
          </select>
        </div>
        
        <div className={styles.buttonGroup}>
          <button type="submit" className="themed-button primary-action">
            Add Sales Rep
          </button>
          <button 
            type="button" 
            className="themed-button secondary" 
            onClick={loadSalesReps} 
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load Sales Reps'}
          </button>
        </div>
      </form>
      
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>Operation completed successfully!</p>}

      {/* Sales Reps List */}
      {salesReps.length > 0 && (
        <div className={styles.salesRepsList}>
          <h2 className={styles.subtitle}>
            Sales Representatives ({salesReps.length})
          </h2>
          <div className={styles.salesRepItems}>
            {salesReps.map((rep) => (
              <div key={rep.id} className={styles.salesRepItem}>
                {editingId === rep.id ? (
                  <div className={styles.editMode}>
                    <div className={styles.editFormRow}>
                      <input
                        type="text"
                        className={styles.editInput}
                        placeholder="Sales Rep Name *"
                        value={editFormData.name}
                        onChange={e => handleEditInputChange('name', e.target.value)}
                      />
                      <input
                        type="tel"
                        className={styles.editInput}
                        placeholder="Contact Number *"
                        value={editFormData.contactNumber}
                        onChange={e => handleEditInputChange('contactNumber', e.target.value)}
                      />
                    </div>
                    <div className={styles.editFormRow}>
                      <textarea
                        className={`${styles.editInput} ${styles.textarea}`}
                        placeholder="Remark"
                        value={editFormData.remark}
                        onChange={e => handleEditInputChange('remark', e.target.value)}
                        rows={2}
                      />
                      <select
                        className={styles.editInput}
                        value={editFormData.status}
                        onChange={e => handleEditInputChange('status', e.target.value as 'active' | 'deactive')}
                      >
                        <option value="active">Active</option>
                        <option value="deactive">Deactive</option>
                      </select>
                    </div>
                    <div className={styles.editButtons}>
                      <button 
                        className={styles.saveBtn}
                        onClick={() => updateSalesRep(rep.id)}
                      >
                        ✓ Save
                      </button>
                      <button 
                        className={styles.cancelBtn}
                        onClick={cancelEdit}
                      >
                        ✕ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.viewMode}>
                    <div className={styles.salesRepInfo}>
                      <div className={styles.nameRow}>
                        <span className={styles.salesRepName}>{rep.name}</span>
                        <span className={`${styles.status} ${styles[rep.status]}`}>
                          {rep.status}
                        </span>
                      </div>
                      <div className={styles.contactRow}>
                        <span className={styles.contactNumber}>📞 {rep.contactNumber}</span>
                      </div>
                      {rep.remark && (
                        <div className={styles.remarkRow}>
                          <span className={styles.remark}>💬 {rep.remark}</span>
                        </div>
                      )}
                      <div className={styles.metaRow}>
                        <span className={styles.createdBy}>Created by: {rep.user}</span>
                        <span className={styles.createdAt}>
                          {new Date(rep.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className={styles.salesRepActions}>
                      <button 
                        className={styles.editBtn}
                        onClick={() => startEdit(rep)}
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        className={styles.deleteBtn}
                        onClick={() => deleteSalesRep(rep.id, rep.name)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {salesReps.length === 0 && !loading && (
        <div className={styles.emptyState}>
          <p>No sales representatives found. Add your first sales rep above!</p>
        </div>
      )}
    </div>
  );
};

export default SalesRepPage;