'use client';

import React, { useState } from 'react';
import styles from './add.module.css';

interface Category {
  id: number;
  category: string;
  user: string;
}

const AddCategoryPage = () => {
  const [category, setCategory] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!category.trim()) {
      setError('Category name is required');
      return;
    }
    try {
      // Get current user from localStorage
      const currentUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
      console.log('Current user from storage:', currentUser); // Debug log
      
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      
      if (currentUser) {
        headers['x-user-data'] = currentUser;
        console.log('Sending user data in header:', currentUser); // Debug log
      } else {
        console.log('No user data found in storage'); // Debug log
      }
      
      const res = await fetch('/api/category', {
        method: 'POST',
        headers,
        body: JSON.stringify({ category }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        setCategory('');
      } else {
        setError(data.error || 'Failed to add category');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  // Load categories from database
  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/category');
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      } else {
        setError('Failed to load categories');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Start editing a category
  const startEdit = (id: number, currentValue: string) => {
    setEditingId(id);
    setEditValue(currentValue);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  // Update category
  const updateCategory = async (id: number) => {
    if (!editValue.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      const res = await fetch('/api/category', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, category: editValue }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCategories(categories.map(cat => 
          cat.id === id ? { ...cat, category: editValue } : cat
        ));
        cancelEdit();
        setSuccess(true);
      } else {
        setError(data.error || 'Failed to update category');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  // Delete category
  const deleteCategory = async (id: number, categoryName: string) => {
    if (!confirm(`Are you sure you want to delete "${categoryName}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/category?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCategories(categories.filter(cat => cat.id !== id));
        setSuccess(true);
      } else {
        setError(data.error || 'Failed to delete category');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Category Management</h1>
      
      {/* Add Category Form */}
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          className="themed-input"
          placeholder="Enter category name"
          value={category}
          onChange={e => setCategory(e.target.value)}
        />
        <div className={styles.buttonGroup}>
          <button type="submit" className="themed-button primary-action">Add Category</button>
          <button type="button" className="themed-button secondary" onClick={loadCategories} disabled={loading}>
            {loading ? 'Loading...' : 'Load Categories'}
          </button>
        </div>
      </form>
      
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>Operation completed successfully!</p>}

      {/* Categories List */}
      {categories.length > 0 && (
        <div className={styles.categoriesList}>
          <h2 className={styles.subtitle}>Categories ({categories.length})</h2>
          <div className={styles.categoryItems}>
            {categories.map((cat) => (
              <div key={cat.id} className={styles.categoryItem}>
                {editingId === cat.id ? (
                  <div className={styles.editMode}>
                    <input
                      type="text"
                      className={styles.editInput}
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                    />
                    <div className={styles.editButtons}>
                      <button 
                        className={styles.saveBtn}
                        onClick={() => updateCategory(cat.id)}
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
                    <div className={styles.categoryInfo}>
                      <span className={styles.categoryName}>{cat.category}</span>
                      <span className={styles.categoryUser}>by {cat.user}</span>
                    </div>
                    <div className={styles.categoryActions}>
                      <button 
                        className={styles.editBtn}
                        onClick={() => startEdit(cat.id, cat.category)}
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        className={styles.deleteBtn}
                        onClick={() => deleteCategory(cat.id, cat.category)}
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
    </div>
  );
};

export default AddCategoryPage;
