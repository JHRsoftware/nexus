'use client';

import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import styles from './users.module.css';
import './users.css';
import LoadingButton from '../../components/LoadingButton';
import PageLoader from '../../components/PageLoader';
import { useLoading } from '../../hooks/useLoading';
import { useRequireAuth } from '../../contexts/AuthContext';
import { getAvailablePages } from '../../config/navigation';

interface User {
  id: number;
  name: string;
  username: string;
  password: string;
  accessPages: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NewUser {
  name: string;
  username: string;
  password: string;
  confirmPassword: string;
  accessPages: string[];
}

interface EditUser extends User {
  isEditing?: boolean;
}

interface EditUserData {
  name: string;
  username: string;
  password: string;
  accessPages: string[];
  accessSearch?: string;
}

const UsersPage: React.FC = () => {
  // Require authentication and access to 'users' page
  const { user, isLoading } = useRequireAuth('users');
  
  // Loading states management
  const { 
    startLoading, 
    stopLoading, 
    isLoading: isActionLoading 
  } = useLoading();
  
  // State management
  const [users, setUsers] = useState<EditUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editData, setEditData] = useState<Record<number, EditUserData>>({});
  const [isMobileView, setIsMobileView] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  
  const [newUser, setNewUser] = useState<NewUser>({
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
    accessPages: []
  });

  // Available pages for access control - automatically synced with sidebar navigation
  const availablePages = useMemo(() => getAvailablePages(), []);
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>Loading...</h1>
          <p className="page-subtitle">Please wait while we verify your access</p>
        </div>
      </div>
    );
  }

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users', {
        cache: 'no-store'
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.map((user: User) => ({ ...user, isEditing: false })));
      } else {
        throw new Error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setErrors({ fetch: 'Failed to load users. Please refresh the page.' });
    } finally {
      setLoading(false);
    }
  }, []);

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      setIsMobileView(width < 640);
    };
    
    // Set initial size
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-clear error messages
  useEffect(() => {
    if (errors.action || errors.fetch) {
      const timer = setTimeout(() => {
        setErrors(prev => ({ ...prev, action: '', fetch: '' }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors.action, errors.fetch]);

  // Enhanced form validation
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!newUser.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (newUser.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!newUser.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (newUser.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(newUser.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    } else if (users.some(u => u.username.toLowerCase() === newUser.username.toLowerCase())) {
      newErrors.username = 'Username already exists';
    }

    if (!newUser.password) {
      newErrors.password = 'Password is required';
    } else if (newUser.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (newUser.password !== newUser.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (newUser.accessPages.length === 0) {
      newErrors.accessPages = 'Please select at least one access page';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [newUser, users]);

  // Validate edit form (read-only validation - doesn't set errors)
  const isEditFormValid = useCallback((userId: number): boolean => {
    const editUserData = editData[userId];
    if (!editUserData) return false;

    // Check all validation rules without setting errors
    if (!editUserData.name.trim() || editUserData.name.length < 2) return false;
    if (!editUserData.username.trim() || editUserData.username.length < 3) return false;
    if (!/^[a-zA-Z0-9_]+$/.test(editUserData.username)) return false;
    if (users.some(u => u.id !== userId && u.username.toLowerCase() === editUserData.username.toLowerCase())) return false;
    if (!editUserData.password || editUserData.password.length < 6) return false;
    if (editUserData.accessPages.length === 0) return false;

    return true;
  }, [editData, users]);

  // Validate edit form and set errors (use this for form submission)
  const validateEditForm = useCallback((userId: number): boolean => {
    const editUserData = editData[userId];
    if (!editUserData) return false;

    const newErrors: Record<string, string> = {};

    if (!editUserData.name.trim()) {
      newErrors[`edit_name_${userId}`] = 'Name is required';
    } else if (editUserData.name.length < 2) {
      newErrors[`edit_name_${userId}`] = 'Name must be at least 2 characters';
    }

    if (!editUserData.username.trim()) {
      newErrors[`edit_username_${userId}`] = 'Username is required';
    } else if (editUserData.username.length < 3) {
      newErrors[`edit_username_${userId}`] = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(editUserData.username)) {
      newErrors[`edit_username_${userId}`] = 'Username can only contain letters, numbers, and underscores';
    } else if (users.some(u => u.id !== userId && u.username.toLowerCase() === editUserData.username.toLowerCase())) {
      newErrors[`edit_username_${userId}`] = 'Username already exists';
    }

    if (!editUserData.password) {
      newErrors[`edit_password_${userId}`] = 'Password is required';
    } else if (editUserData.password.length < 6) {
      newErrors[`edit_password_${userId}`] = 'Password must be at least 6 characters';
    }

    if (editUserData.accessPages.length === 0) {
      newErrors[`edit_access_${userId}`] = 'Please select at least one access page';
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  }, [editData, users]);

  // Reset form to initial state
  const resetForm = useCallback(() => {
    setNewUser({
      name: '',
      username: '',
      password: '',
      confirmPassword: '',
      accessPages: []
    });
    setErrors({});
    setShowAddForm(false);
  }, []);

  // Enhanced add user function
  const handleAddUser = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setProcessing(-1);
    startLoading('addUser');

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newUser.name.trim(),
          username: newUser.username.trim(),
          password: newUser.password,
          accessPages: newUser.accessPages,
        }),
      });

      if (response.ok) {
        await fetchUsers();
        resetForm();
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.error || 'Failed to create user' });
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setProcessing(null);
      stopLoading('addUser');
    }
  }, [newUser, validateForm, fetchUsers, resetForm]);

  // Start editing a user
  const startEdit = useCallback((user: User) => {
    setEditData(prev => ({
      ...prev,
      [user.id]: {
        name: user.name,
        username: user.username,
        password: '', // Don't pre-fill password for security
        accessPages: [...user.accessPages]
      }
    }));
    
    setUsers(prevUsers => 
      prevUsers.map(u => ({
        ...u,
        isEditing: u.id === user.id ? true : false // Close other edit modes
      }))
    );
    setErrors({}); // Clear any existing errors
  }, []);

  // Cancel editing
  const cancelEdit = useCallback((userId: number) => {
    setUsers(prevUsers => 
      prevUsers.map(u => 
        u.id === userId ? { ...u, isEditing: false } : u
      )
    );
    
    setEditData(prev => {
      const newEditData = { ...prev };
      delete newEditData[userId];
      return newEditData;
    });
    
    // Clear edit-specific errors
    setErrors(prev => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach(key => {
        if (key.includes(`_${userId}`)) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  }, []);

  // Save user edit
  const saveEdit = useCallback(async (userId: number) => {
    if (!validateEditForm(userId)) return;
    
    const editUserData = editData[userId];
    setProcessing(userId);
    startLoading(`editUser_${userId}`);

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editUserData.name.trim(),
          username: editUserData.username.trim(),
          password: editUserData.password,
          accessPages: editUserData.accessPages,
          isActive: users.find(u => u.id === userId)?.isActive || true
        }),
      });

      if (response.ok) {
        await fetchUsers();
        cancelEdit(userId);
      } else {
        const errorData = await response.json();
        setErrors(prev => ({ ...prev, [`edit_submit_${userId}`]: errorData.error || 'Failed to update user' }));
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setErrors(prev => ({ ...prev, [`edit_submit_${userId}`]: 'Network error. Please try again.' }));
    } finally {
      setProcessing(null);
      stopLoading(`editUser_${userId}`);
    }
  }, [editData, validateEditForm, users, fetchUsers, cancelEdit]);

  // Toggle edit mode for a user
  const toggleEditMode = useCallback((userId: number) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    if (user.isEditing) {
      cancelEdit(userId);
    } else {
      startEdit(user);
    }
  }, [users, cancelEdit, startEdit]);

  // Enhanced toggle user status with optimistic updates
  const toggleUserStatus = useCallback(async (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (!user || processing === userId) return;

    setProcessing(userId);
    startLoading(`toggleStatus_${userId}`);

    // Optimistic update
    setUsers(prevUsers => 
      prevUsers.map(u => 
        u.id === userId ? { ...u, isActive: !u.isActive } : u
      )
    );

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...user,
          isActive: !user.isActive,
        }),
      });

      if (!response.ok) {
        // Revert optimistic update on failure
        setUsers(prevUsers => 
          prevUsers.map(u => 
            u.id === userId ? { ...u, isActive: user.isActive } : u
          )
        );
        throw new Error('Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      setErrors({ action: 'Failed to update user status' });
    } finally {
      setProcessing(null);
      stopLoading(`toggleStatus_${userId}`);
    }
  }, [users, processing]);

  // Enhanced delete user with confirmation
  const deleteUser = useCallback(async (userId: number, userName: string) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    setProcessing(userId);
    startLoading(`deleteUser_${userId}`);

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Optimistic update - remove user immediately
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setErrors({ action: 'Failed to delete user' });
      await fetchUsers(); // Refresh on error
    } finally {
      setProcessing(null);
      stopLoading(`deleteUser_${userId}`);
    }
  }, [processing, fetchUsers]);

  // Handle access page selection for new user
  const handleAccessPageChange = useCallback((pageId: string, checked: boolean) => {
    setNewUser(prev => ({
      ...prev,
      accessPages: checked 
        ? [...prev.accessPages, pageId]
        : prev.accessPages.filter(p => p !== pageId)
    }));
  }, []);

  // Handle access page selection for edit user
  const handleEditAccessPageChange = useCallback((userId: number, pageId: string, checked: boolean) => {
    setEditData(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        accessPages: checked 
          ? [...prev[userId].accessPages, pageId]
          : prev[userId].accessPages.filter(p => p !== pageId)
      }
    }));
  }, []);

  // Mobile Card Component for Users - memoized for performance
  const UserCard = memo(({ user }: { user: EditUser }) => (
    <div className={`${styles.mobileCard} ${user.isEditing ? styles.editing : ''} ${processing === user.id ? styles.cardLoading : ''}`}>
      <div className={styles.cardHeader}>
        <div className={styles.cardUserInfo}>
          <div className={styles.cardUserName}>{user.name}</div>
          <div className={styles.cardUsername}>@{user.username}</div>
        </div>
        <div className={styles.cardStatus}>
          <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
            {user.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {user.isEditing ? (
        <div className={styles.mobileEditForm}>
          <div className={styles.mobileEditGrid}>
            <div className={styles.mobileEditField}>
              <label className={styles.mobileEditLabel}>Name *</label>
              <input
                type="text"
                className={styles.mobileEditInput}
                value={editData[user.id]?.name || ''}
                onChange={(e) => setEditData(prev => ({
                  ...prev,
                  [user.id]: { ...prev[user.id], name: e.target.value }
                }))}
                placeholder="Enter name"
                disabled={processing === user.id}
              />
              {errors[`edit_name_${user.id}`] && (
                <span className="error-text">{errors[`edit_name_${user.id}`]}</span>
              )}
            </div>

            <div className={styles.mobileEditField}>
              <label className={styles.mobileEditLabel}>Username *</label>
              <input
                type="text"
                className={styles.mobileEditInput}
                value={editData[user.id]?.username || ''}
                onChange={(e) => setEditData(prev => ({
                  ...prev,
                  [user.id]: { ...prev[user.id], username: e.target.value }
                }))}
                placeholder="Enter username"
                disabled={processing === user.id}
              />
              {errors[`edit_username_${user.id}`] && (
                <span className="error-text">{errors[`edit_username_${user.id}`]}</span>
              )}
            </div>

            <div className={styles.mobileEditField}>
              <label className={styles.mobileEditLabel}>New Password *</label>
              <input
                type="password"
                className={styles.mobileEditInput}
                value={editData[user.id]?.password || ''}
                onChange={(e) => setEditData(prev => ({
                  ...prev,
                  [user.id]: { ...prev[user.id], password: e.target.value }
                }))}
                placeholder="New password"
                disabled={processing === user.id}
              />
              {errors[`edit_password_${user.id}`] && (
                <span className="error-text">{errors[`edit_password_${user.id}`]}</span>
              )}
            </div>

            <div className={styles.mobileEditField}>
              <label className={styles.mobileEditLabel}>Access Pages *</label>
              <div className={styles.multiSelectDropdown}>
                <input
                  type="text"
                  className={styles.multiSelectInput}
                  placeholder="Search pages..."
                  value={editData[user.id]?.accessSearch || ''}
                  onChange={e => setEditData(prev => ({
                    ...prev,
                    [user.id]: { ...prev[user.id], accessSearch: e.target.value }
                  }))}
                  disabled={processing === user.id}
                />
                <div className={styles.multiSelectOptions}>
                  {availablePages.filter(page => {
                    const search = editData[user.id]?.accessSearch || '';
                    return (
                      !editData[user.id]?.accessPages?.includes(page.id) &&
                      (search === '' || page.name.toLowerCase().includes(search.toLowerCase()) || page.id.toLowerCase().includes(search.toLowerCase()))
                    );
                  }).map(page => (
                    <div
                      key={page.id}
                      className={styles.multiSelectOption}
                      onClick={() => setEditData(prev => ({
                        ...prev,
                        [user.id]: {
                          ...prev[user.id],
                          accessPages: [...(prev[user.id]?.accessPages || []), page.id],
                          accessSearch: ''
                        }
                      }))}
                    >
                      {page.name}
                    </div>
                  ))}
                </div>
                <div className={styles.multiSelectTags}>
                  {(editData[user.id]?.accessPages || []).map(pageId => (
                    <span key={pageId} className={styles.multiSelectTag}>
                      {availablePages.find(p => p.id === pageId)?.name || pageId}
                      <button
                        type="button"
                        className={styles.multiSelectRemove}
                        onClick={() => setEditData(prev => ({
                          ...prev,
                          [user.id]: {
                            ...prev[user.id],
                            accessPages: prev[user.id].accessPages.filter(p => p !== pageId)
                          }
                        }))}
                        disabled={processing === user.id}
                      >✕</button>
                    </span>
                  ))}
                </div>
              </div>
              {errors[`edit_access_${user.id}`] && (
                <span className="error-text">{errors[`edit_access_${user.id}`]}</span>
              )}
            </div>
          </div>

          <div className={styles.mobileEditActions}>
            <LoadingButton
              className={`${styles.mobileEditAction} ${styles.save}`}
              onClick={() => saveEdit(user.id)}
              disabled={processing === user.id || !isEditFormValid(user.id)}
              loading={isActionLoading(`editUser_${user.id}`)}
              loadingText="Saving..."
            >
              ✓ Save Changes
            </LoadingButton>
            <button
              className={`${styles.mobileEditAction} ${styles.cancel}`}
              onClick={() => cancelEdit(user.id)}
              disabled={processing === user.id}
            >
              ✕ Cancel
            </button>
          </div>
          {errors[`edit_submit_${user.id}`] && (
            <div className={styles.mobileErrorMessage}>{errors[`edit_submit_${user.id}`]}</div>
          )}
        </div>
      ) : (
        <>
          <div className={styles.cardBody}>
            <div className={styles.cardField}>
              <div className={styles.cardLabel}>Password</div>
              <div className={styles.cardValue}>••••••••</div>
            </div>
            <div className={styles.cardField}>
              <div className={styles.cardLabel}>Access Pages</div>
              <div className={`${styles.cardValue} ${styles.cardAccessPages}`}>
                {user.accessPages.map((pageId) => (
                  <span key={pageId} className="access-tag">
                    {availablePages.find(p => p.id === pageId)?.name || pageId}
                  </span>
                ))}
              </div>
            </div>
            <div className={styles.cardField}>
              <div className={styles.cardLabel}>Created</div>
              <div className={`${styles.cardValue} ${styles.cardDate}`}>
                {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className={styles.cardActions}>
            <LoadingButton
              className={`${styles.cardAction} ${user.isActive ? styles.warning : styles.success}`}
              onClick={() => toggleUserStatus(user.id)}
              title={user.isActive ? 'Deactivate User' : 'Activate User'}
              disabled={processing === user.id}
              loading={isActionLoading(`toggleStatus_${user.id}`)}
              loadingText={user.isActive ? 'Deactivating...' : 'Activating...'}
            >
              {user.isActive ? '⏸️ Deactivate' : '▶️ Activate'}
            </LoadingButton>
            <button
              className={`${styles.cardAction} ${styles.primary}`}
              onClick={() => toggleEditMode(user.id)}
              title="Edit User"
              disabled={processing !== null}
            >
              ✏️ Edit
            </button>
            <LoadingButton
              className={`${styles.cardAction} ${styles.error}`}
              onClick={() => deleteUser(user.id, user.name)}
              title="Delete User"
              disabled={processing === user.id}
              loading={isActionLoading(`deleteUser_${user.id}`)}
              loadingText="Deleting..."
            >
              🗑️ Delete
            </LoadingButton>
          </div>
        </>
      )}
    </div>
  ));
  
  UserCard.displayName = 'UserCard';

  return (
    <PageLoader loading={loading} loadingText="Loading users...">
      <div className={`page-container ${styles.usersContainer}`}>
        <div className="page-header">
          <h1>Users Management</h1>
          <p className="page-subtitle">Manage user accounts and permissions</p>
        </div>
        
        <div className="page-content">
        {/* Error Messages */}
        {(errors.fetch || errors.action) && (
          <div className="error-banner">
            {errors.fetch || errors.action}
            <button 
              className="error-close" 
              onClick={() => setErrors({})}
              title="Close error"
            >
              ✕
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="users-actions">
          <button 
            className="themed-button"
            onClick={() => setShowAddForm(!showAddForm)}
            disabled={processing !== null}
          >
            {showAddForm ? '✕ Cancel' : '+ Add New User'}
          </button>
          <LoadingButton 
            className="themed-button secondary"
            onClick={fetchUsers}
            disabled={loading || processing !== null}
            title="Refresh users list"
            loading={loading}
            loadingText="Loading..."
          >
            ↻ Refresh
          </LoadingButton>
        </div>

        {/* Mobile View Toggle */}
        {windowWidth > 0 && windowWidth < 768 && (
          <div className={styles.mobileTableToggle}>
            <button
              className={`${styles.toggleButton} ${!isMobileView ? styles.active : ''}`}
              onClick={() => setIsMobileView(false)}
            >
              📊 Table View
            </button>
            <button
              className={`${styles.toggleButton} ${isMobileView ? styles.active : ''}`}
              onClick={() => setIsMobileView(true)}
            >
              📱 Card View
            </button>
          </div>
        )}

        {/* Add User Form */}
        {showAddForm && (
          <div className="add-user-form">
            <h3>Add New User</h3>
            <form onSubmit={handleAddUser}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Full Name <span className="required-asterisk">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="themed-input"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    placeholder="Enter full name"
                    disabled={processing === -1}
                    autoComplete="name"
                    aria-describedby={errors.name ? "name-error" : undefined}
                    aria-invalid={errors.name ? "true" : "false"}
                  />
                  {errors.name && (
                    <span id="name-error" className="error-text" role="alert">
                      {errors.name}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="username" className="form-label">
                    Username <span className="required-asterisk">*</span>
                  </label>
                  <input
                    id="username"
                    type="text"
                    className="themed-input"
                    value={newUser.username}
                    onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                    placeholder="Enter username"
                    disabled={processing === -1}
                    autoComplete="username"
                    aria-describedby={errors.username ? "username-error" : undefined}
                    aria-invalid={errors.username ? "true" : "false"}
                  />
                  {errors.username && (
                    <span id="username-error" className="error-text" role="alert">
                      {errors.username}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Password <span className="required-asterisk">*</span>
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="themed-input"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    placeholder="Enter secure password"
                    disabled={processing === -1}
                    autoComplete="new-password"
                    aria-describedby={errors.password ? "password-error" : "password-help"}
                    aria-invalid={errors.password ? "true" : "false"}
                  />
                  <small id="password-help" className="form-help">
                    Minimum 6 characters required
                  </small>
                  {errors.password && (
                    <span id="password-error" className="error-text" role="alert">
                      {errors.password}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password <span className="required-asterisk">*</span>
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    className="themed-input"
                    value={newUser.confirmPassword}
                    onChange={(e) => setNewUser({...newUser, confirmPassword: e.target.value})}
                    placeholder="Confirm your password"
                    disabled={processing === -1}
                    autoComplete="new-password"
                    aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                    aria-invalid={errors.confirmPassword ? "true" : "false"}
                  />
                  {errors.confirmPassword && (
                    <span id="confirm-password-error" className="error-text" role="alert">
                      {errors.confirmPassword}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <fieldset className="form-fieldset">
                  <legend className="form-legend">
                    Access Permissions <span className="required-asterisk">*</span>
                  </legend>
                  <div className="access-pages-grid" role="group" aria-labelledby="access-pages-label">
                    {availablePages.map((page) => (
                      <label key={page.id} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={newUser.accessPages.includes(page.id)}
                          onChange={(e) => handleAccessPageChange(page.id, e.target.checked)}
                          disabled={processing === -1}
                          aria-describedby={`access-${page.id}-desc`}
                        />
                        <span className="checkbox-text">{page.name}</span>
                        <span id={`access-${page.id}-desc`} className="sr-only">
                          Grant access to {page.name}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.accessPages && (
                    <span className="error-text" role="alert">
                      {errors.accessPages}
                    </span>
                  )}
                </fieldset>
              </div>

              {errors.submit && (
                <div className="error-text form-error" role="alert">
                  {errors.submit}
                </div>
              )}

              <div className="form-actions">
                <LoadingButton 
                  type="submit" 
                  className="themed-button primary-action"
                  disabled={processing === -1}
                  loading={isActionLoading('addUser')}
                  loadingText="Creating User..."
                  aria-describedby="create-user-help"
                >
                  ✓ Create User
                </LoadingButton>
                <button 
                  type="button" 
                  className="themed-button secondary"
                  onClick={resetForm}
                  disabled={processing === -1}
                >
                  <span aria-hidden="true">✕</span>
                  <span>Cancel</span>
                </button>
              </div>
              <small id="create-user-help" className="form-help">
                All required fields must be completed to create a user account
              </small>
            </form>
          </div>
        )}

        {/* Users List */}
        <div className="users-list">
          <h3>Current Users ({users.length})</h3>
          {loading ? (
            <div className="loading-message">
              <span>Loading users...</span>
            </div>
          ) : users.length === 0 ? (
            <div className={styles.mobileEmptyState}>
              <div className={styles.mobileEmptyIcon}>👥</div>
              <div className={styles.mobileEmptyTitle}>No Users Found</div>
              <div className={styles.mobileEmptyDescription}>
                Get started by adding your first user account.
              </div>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              {(windowWidth < 640 || isMobileView) && windowWidth > 0 ? (
                <div className="mobile-cards-container">
                  {users.map((user) => (
                    <UserCard key={user.id} user={user} />
                  ))}
                </div>
              ) : (
                /* Desktop Table View */
                <div className={`users-table-container ${windowWidth > 1200 ? '' : 'scrollable'}`}>
                  <table className="users-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Password</th>
                    <th>Access Pages</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className={user.isEditing ? 'editing' : ''}>
                      {/* Name Column */}
                      <td>
                        {user.isEditing ? (
                          <div className="edit-field">
                            <input
                              type="text"
                              className="edit-input"
                              value={editData[user.id]?.name || ''}
                              onChange={(e) => setEditData(prev => ({
                                ...prev,
                                [user.id]: { ...prev[user.id], name: e.target.value }
                              }))}
                              placeholder="Enter name"
                              disabled={processing === user.id}
                            />
                            {errors[`edit_name_${user.id}`] && (
                              <span className="error-text">{errors[`edit_name_${user.id}`]}</span>
                            )}
                          </div>
                        ) : (
                          <div className="user-info">
                            <span className="user-name">{user.name}</span>
                          </div>
                        )}
                      </td>

                      {/* Username Column */}
                      <td>
                        {user.isEditing ? (
                          <div className="edit-field">
                            <input
                              type="text"
                              className="edit-input"
                              value={editData[user.id]?.username || ''}
                              onChange={(e) => setEditData(prev => ({
                                ...prev,
                                [user.id]: { ...prev[user.id], username: e.target.value }
                              }))}
                              placeholder="Enter username"
                              disabled={processing === user.id}
                            />
                            {errors[`edit_username_${user.id}`] && (
                              <span className="error-text">{errors[`edit_username_${user.id}`]}</span>
                            )}
                          </div>
                        ) : (
                          <span className="username">@{user.username}</span>
                        )}
                      </td>

                      {/* Password Column */}
                      <td>
                        {user.isEditing ? (
                          <div className="edit-field">
                            <input
                              type="password"
                              className="edit-input"
                              value={editData[user.id]?.password || ''}
                              onChange={(e) => setEditData(prev => ({
                                ...prev,
                                [user.id]: { ...prev[user.id], password: e.target.value }
                              }))}
                              placeholder="New password"
                              disabled={processing === user.id}
                            />
                            {errors[`edit_password_${user.id}`] && (
                              <span className="error-text">{errors[`edit_password_${user.id}`]}</span>
                            )}
                          </div>
                        ) : (
                          <span className="password-hidden">••••••••</span>
                        )}
                      </td>

                      {/* Access Pages Column */}
                      <td>
                        {user.isEditing ? (
                          <div className="edit-field">
                            <div className={styles.multiSelectDropdown}>
                              <input
                                type="text"
                                className={styles.multiSelectInput}
                                placeholder="Search pages..."
                                value={editData[user.id]?.accessSearch || ''}
                                onChange={e => setEditData(prev => ({
                                  ...prev,
                                  [user.id]: { ...prev[user.id], accessSearch: e.target.value }
                                }))}
                                disabled={processing === user.id}
                              />
                              <div className={styles.multiSelectOptions}>
                                {availablePages.filter(page => {
                                  const search = editData[user.id]?.accessSearch || '';
                                  return (
                                    !editData[user.id]?.accessPages?.includes(page.id) &&
                                    (search === '' || page.name.toLowerCase().includes(search.toLowerCase()) || page.id.toLowerCase().includes(search.toLowerCase()))
                                  );
                                }).map(page => (
                                  <div
                                    key={page.id}
                                    className={styles.multiSelectOption}
                                    onClick={() => setEditData(prev => ({
                                      ...prev,
                                      [user.id]: {
                                        ...prev[user.id],
                                        accessPages: [...(prev[user.id]?.accessPages || []), page.id],
                                        accessSearch: ''
                                      }
                                    }))}
                                  >
                                    {page.name}
                                  </div>
                                ))}
                              </div>
                              <div className={styles.multiSelectTags}>
                                {(editData[user.id]?.accessPages || []).map(pageId => (
                                  <span key={pageId} className={styles.multiSelectTag}>
                                    {availablePages.find(p => p.id === pageId)?.name || pageId}
                                    <button
                                      type="button"
                                      className={styles.multiSelectRemove}
                                      onClick={() => setEditData(prev => ({
                                        ...prev,
                                        [user.id]: {
                                          ...prev[user.id],
                                          accessPages: prev[user.id].accessPages.filter(p => p !== pageId)
                                        }
                                      }))}
                                      disabled={processing === user.id}
                                    >✕</button>
                                  </span>
                                ))}
                              </div>
                            </div>
                            {errors[`edit_access_${user.id}`] && (
                              <span className="error-text">{errors[`edit_access_${user.id}`]}</span>
                            )}
                          </div>
                        ) : (
                          <div className="access-tags">
                            {user.accessPages.map((pageId) => (
                              <span key={pageId} className="access-tag">
                                {availablePages.find(p => p.id === pageId)?.name || pageId}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* Status Column */}
                      <td>
                        <span className={`status-badge ${user.isActive ? 'active' : 'inactive'} ${processing === user.id ? 'processing' : ''}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      {/* Created Column */}
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>

                      {/* Actions Column */}
                      <td>
                        <div className="user-actions">
                          {user.isEditing ? (
                            <>
                              <button
                                className="action-btn save-btn"
                                onClick={() => saveEdit(user.id)}
                                title="Save Changes"
                                disabled={processing === user.id}
                              >
                                {processing === user.id ? '⏳' : '✓'}
                              </button>
                              <button
                                className="action-btn cancel-btn"
                                onClick={() => cancelEdit(user.id)}
                                title="Cancel Edit"
                                disabled={processing === user.id}
                              >
                                ✕
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="action-btn toggle-btn"
                                onClick={() => toggleUserStatus(user.id)}
                                title={user.isActive ? 'Deactivate User' : 'Activate User'}
                                disabled={processing === user.id}
                              >
                                {processing === user.id ? '⏳' : (user.isActive ? '⏸️' : '▶️')}
                              </button>
                              <button
                                className="action-btn edit-btn"
                                onClick={() => toggleEditMode(user.id)}
                                title="Edit User"
                                disabled={processing !== null}
                              >
                                ✏️
                              </button>
                              <button
                                className="action-btn delete-btn"
                                onClick={() => deleteUser(user.id, user.name)}
                                title="Delete User"
                                disabled={processing === user.id}
                              >
                                {processing === user.id ? '⏳' : '🗑️'}
                              </button>
                            </>
                          )}
                        </div>
                        {errors[`edit_submit_${user.id}`] && (
                          <div className="error-text">{errors[`edit_submit_${user.id}`]}</div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
    </PageLoader>
  );
};

export default UsersPage;