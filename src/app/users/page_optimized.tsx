'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { UserAPI, UserValidator, formatDate, AVAILABLE_PAGES, getPageName } from '@/lib/userUtils';
import type { User, NewUser } from '@/lib/userUtils';

interface EditUser extends User {
  isEditing?: boolean;
}

const UsersPage: React.FC = () => {
  // State management
  const [users, setUsers] = useState<EditUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [newUser, setNewUser] = useState<NewUser>({
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
    accessPages: []
  });

  // Fetch users with error handling
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await UserAPI.fetchUsers();
      setUsers(data.map(user => ({ ...user, isEditing: false })));
      setErrors(prev => ({ ...prev, fetch: '' }));
    } catch (error) {
      console.error('Error fetching users:', error);
      setErrors(prev => ({ ...prev, fetch: 'Failed to load users. Please refresh the page.' }));
    } finally {
      setLoading(false);
    }
  }, []);

  // Load users on mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Auto-clear error messages
  useEffect(() => {
    if (errors.action || errors.fetch) {
      const timer = setTimeout(() => {
        setErrors(prev => ({ ...prev, action: '', fetch: '' }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors.action, errors.fetch]);

  // Form validation
  const validateForm = useCallback((): boolean => {
    const validationErrors = UserValidator.validateUser(newUser, users);
    setErrors(prev => ({ ...prev, ...validationErrors }));
    return Object.keys(validationErrors).length === 0;
  }, [newUser, users]);

  // Reset form
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

  // Add new user
  const handleAddUser = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setProcessing(-1);

    try {
      await UserAPI.createUser({
        name: newUser.name.trim(),
        username: newUser.username.trim(),
        password: newUser.password,
        accessPages: newUser.accessPages,
        isActive: true
      });
      
      await fetchUsers();
      resetForm();
    } catch (error) {
      setErrors(prev => ({ ...prev, submit: error instanceof Error ? error.message : 'Failed to create user' }));
    } finally {
      setProcessing(null);
    }
  }, [newUser, validateForm, fetchUsers, resetForm]);

  // Toggle edit mode
  const toggleEditMode = useCallback((userId: number) => {
    setUsers(prevUsers => 
      prevUsers.map(user => ({
        ...user,
        isEditing: user.id === userId ? !user.isEditing : false
      }))
    );
    setErrors({});
  }, []);

  // Toggle user status with optimistic updates
  const toggleUserStatus = useCallback(async (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (!user || processing === userId) return;

    setProcessing(userId);

    // Optimistic update
    setUsers(prevUsers => 
      prevUsers.map(u => 
        u.id === userId ? { ...u, isActive: !u.isActive } : u
      )
    );

    try {
      await UserAPI.updateUser(userId, { isActive: !user.isActive });
    } catch (error) {
      // Revert on error
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === userId ? { ...u, isActive: user.isActive } : u
        )
      );
      setErrors(prev => ({ ...prev, action: 'Failed to update user status' }));
    } finally {
      setProcessing(null);
    }
  }, [users, processing]);

  // Delete user with confirmation
  const deleteUser = useCallback(async (userId: number, userName: string) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    setProcessing(userId);

    try {
      await UserAPI.deleteUser(userId);
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    } catch (error) {
      setErrors(prev => ({ ...prev, action: 'Failed to delete user' }));
    } finally {
      setProcessing(null);
    }
  }, [processing]);

  // Handle access page selection
  const handleAccessPageChange = useCallback((pageId: string, checked: boolean) => {
    setNewUser(prev => ({
      ...prev,
      accessPages: checked 
        ? [...prev.accessPages, pageId]
        : prev.accessPages.filter(p => p !== pageId)
    }));
  }, []);

  return (
    <div className="page-container">
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
          <button 
            className="themed-button secondary"
            onClick={fetchUsers}
            disabled={loading || processing !== null}
            title="Refresh users list"
          >
            {loading ? '↻ Loading...' : '↻ Refresh'}
          </button>
        </div>

        {/* Add User Form */}
        {showAddForm && (
          <div className="add-user-form">
            <h3>Add New User</h3>
            <form onSubmit={handleAddUser}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Name *</label>
                  <input
                    id="name"
                    type="text"
                    className="themed-input"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    placeholder="Enter full name"
                    disabled={processing === -1}
                  />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="username">Username *</label>
                  <input
                    id="username"
                    type="text"
                    className="themed-input"
                    value={newUser.username}
                    onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                    placeholder="Enter username"
                    disabled={processing === -1}
                  />
                  {errors.username && <span className="error-text">{errors.username}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password *</label>
                  <input
                    id="password"
                    type="password"
                    className="themed-input"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    placeholder="Enter password"
                    disabled={processing === -1}
                  />
                  {errors.password && <span className="error-text">{errors.password}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password *</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    className="themed-input"
                    value={newUser.confirmPassword}
                    onChange={(e) => setNewUser({...newUser, confirmPassword: e.target.value})}
                    placeholder="Confirm password"
                    disabled={processing === -1}
                  />
                  {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Access Pages *</label>
                <div className="access-pages-grid">
                  {AVAILABLE_PAGES.map((page) => (
                    <label key={page.id} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={newUser.accessPages.includes(page.id)}
                        onChange={(e) => handleAccessPageChange(page.id, e.target.checked)}
                        disabled={processing === -1}
                      />
                      <span className="checkbox-text">{page.name}</span>
                    </label>
                  ))}
                </div>
                {errors.accessPages && <span className="error-text">{errors.accessPages}</span>}
              </div>

              {errors.submit && <div className="error-text">{errors.submit}</div>}

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="themed-button"
                  disabled={processing === -1}
                >
                  {processing === -1 ? '⏳ Creating...' : '✓ Create User'}
                </button>
                <button 
                  type="button" 
                  className="themed-button secondary"
                  onClick={resetForm}
                  disabled={processing === -1}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Users List */}
        <div className="users-list">
          <h3>Current Users ({users.length})</h3>
          {loading ? (
            <div className="loading-message">Loading users...</div>
          ) : (
            <div className="users-table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Access Pages</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-info">
                          <span className="user-name">{user.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className="username">@{user.username}</span>
                      </td>
                      <td>
                        <div className="access-tags">
                          {user.accessPages.map((pageId) => (
                            <span key={pageId} className="access-tag">
                              {getPageName(pageId)}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${user.isActive ? 'active' : 'inactive'} ${processing === user.id ? 'processing' : ''}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>
                        <div className="user-actions">
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
                            title={user.isEditing ? 'Cancel Edit' : 'Edit User'}
                            disabled={processing !== null}
                          >
                            {user.isEditing ? '✕' : '✏️'}
                          </button>
                          <button
                            className="action-btn delete-btn"
                            onClick={() => deleteUser(user.id, user.name)}
                            title="Delete User"
                            disabled={processing === user.id}
                          >
                            {processing === user.id ? '⏳' : '🗑️'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;