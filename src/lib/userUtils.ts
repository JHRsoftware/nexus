// User utility functions and types for user management

export interface User {
  id: number;
  name: string;
  username: string;
  password?: string;
  accessPages: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewUser {
  name: string;
  username: string;
  password: string;
  confirmPassword: string;
  accessPages: string[];
}

export interface CreateUserData {
  name: string;
  username: string;
  password: string;
  accessPages: string[];
  isActive: boolean;
}

export interface UpdateUserData {
  name?: string;
  username?: string;
  password?: string;
  accessPages?: string[];
  isActive?: boolean;
}

// Available pages configuration
export const AVAILABLE_PAGES = [
  { id: 'home', name: 'Home' },
  { id: 'sample1', name: 'Sample 1' },
  { id: 'sample2', name: 'Sample 2' },
  { id: 'users', name: 'Users Management' },
  { id: 'settings', name: 'Settings' },
];

// Get page name by ID
export const getPageName = (pageId: string): string => {
  const page = AVAILABLE_PAGES.find(p => p.id === pageId);
  return page ? page.name : pageId;
};

// Format date for display
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return 'Invalid Date';
  }
};

// User validation utility
export const UserValidator = {
  validateUser: (user: NewUser, existingUsers: User[] = []): Record<string, string> => {
    const errors: Record<string, string> = {};

    // Name validation
    if (!user.name.trim()) {
      errors.name = 'Name is required';
    } else if (user.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    } else if (user.name.trim().length > 100) {
      errors.name = 'Name must be less than 100 characters';
    }

    // Username validation
    if (!user.username.trim()) {
      errors.username = 'Username is required';
    } else if (user.username.trim().length < 3) {
      errors.username = 'Username must be at least 3 characters';
    } else if (user.username.trim().length > 50) {
      errors.username = 'Username must be less than 50 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(user.username.trim())) {
      errors.username = 'Username can only contain letters, numbers, and underscores';
    } else if (existingUsers.some(u => u.username.toLowerCase() === user.username.trim().toLowerCase())) {
      errors.username = 'Username already exists';
    }

    // Password validation
    if (!user.password) {
      errors.password = 'Password is required';
    } else if (user.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    } else if (user.password.length > 255) {
      errors.password = 'Password must be less than 255 characters';
    }

    // Confirm password validation
    if (!user.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (user.password !== user.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Access pages validation
    if (!user.accessPages || user.accessPages.length === 0) {
      errors.accessPages = 'At least one access page must be selected';
    }

    return errors;
  }
};

// User API functions
export const UserAPI = {
  // Fetch all users
  fetchUsers: async (): Promise<User[]> => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.users || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  },

  // Create new user
  createUser: async (userData: CreateUserData): Promise<User> => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create user');
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update user
  updateUser: async (userId: number, userData: UpdateUserData): Promise<User> => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user');
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Delete user
  deleteUser: async (userId: number): Promise<void> => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (userId: number): Promise<User> => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new Error('Failed to fetch user');
    }
  }
};

// Utility functions
export const utils = {
  // Generate random password
  generatePassword: (length: number = 12): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  // Sanitize username
  sanitizeUsername: (username: string): string => {
    return username.toLowerCase().trim().replace(/[^a-z0-9_]/g, '');
  },

  // Format access pages for display
  formatAccessPages: (accessPages: string[]): string => {
    return accessPages.map(pageId => getPageName(pageId)).join(', ');
  },

  // Check if user has access to page
  hasPageAccess: (user: User, pageId: string): boolean => {
    return user.accessPages.includes(pageId);
  }
};

export default {
  AVAILABLE_PAGES,
  getPageName,
  formatDate,
  UserValidator,
  UserAPI,
  utils
};