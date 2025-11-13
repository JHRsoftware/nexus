// Centralized navigation configuration
// This file contains all available pages and their metadata

export interface NavigationPage {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  route: string;
  description?: string;
}

export const NAVIGATION_PAGES: NavigationPage[] = [
  {
    id: 'home',
    name: 'Home',
    displayName: 'Home Page',
    icon: '🏠',
    route: '/',
    description: 'Dashboard and overview'
  },
  {
    id: 'sample1',
    name: 'Sample Page 1',
    displayName: 'Sample Page 1',
    icon: '📄',
    route: '/sample1',
    description: 'First sample page'
  },
  {
    id: 'sample2',
    name: 'Sample Page 2', 
    displayName: 'Sample Page 2',
    icon: '📋',
    route: '/sample2',
    description: 'Second sample page'
  },
  {
    id: 'users',
    name: 'Users',
    displayName: 'Users Management',
    icon: '👥',
    route: '/users',
    description: 'Manage user accounts and permissions'
  },
  {
    id: 'category',
    name: 'Categories',
    displayName: 'Category Management',
    icon: '🏷️',
    route: '/category/add',
    description: 'Manage product categories'
  },
  {
    id: 'sales-rep',
    name: 'Sales Reps',
    displayName: 'Sales Representative Management',
    icon: '👤',
    route: '/sales-rep',
    description: 'Register and manage sales representatives'
  },
  {
    id: 'products',
    name: 'Products',
    displayName: 'Product Management',
    icon: '📦',
    route: '/products/add',
    description: 'Register and manage products'
  },
  {
    id: 'suppliers',
    name: 'Suppliers',
    displayName: 'Supplier Management',
    icon: '🏢',
    route: '/suppliers/add',
    description: 'Register and manage suppliers'
  },
  {
    id: 'shops',
    name: 'Shops',
    displayName: 'Shop Management',
    icon: '🏪',
    route: '/shops/add',
    description: 'Register and manage shops/customers'
  },
  {
    id: 'grn',
    name: 'GRN',
    displayName: 'Goods Received Note',
    icon: '📥',
    route: '/grn/add',
    description: 'Record incoming goods and inventory'
  },
  {
    id: 'discounts',
    name: 'Discounts',
    displayName: 'Discount Management',
    icon: '💰',
    route: '/discounts/add',
    description: 'Manage product discounts and promotional offers'
  },
  {
    id: 'orders',
    name: 'Orders',
    displayName: 'Order Management',
    icon: '📝',
    route: '/orders',
    description: 'Create and manage customer orders'
  },
  {
    id: 'invoices',
    name: 'Invoices',
    displayName: 'Invoice Management',
    icon: '🧾',
    route: '/invoices/create',
    description: 'Create and manage customer invoices'
  },
  {
    id: 'invoices-edit',
    name: 'Edit Invoices',
    displayName: 'Edit Invoice Management',
    icon: '✏️',
    route: '/invoices/edit',
    description: 'Search and edit existing invoices'
  },
  {
    id: 'payments',
    name: 'Payments',
    displayName: 'Payment Management',
    icon: '💳',
    route: '/payments',
    description: 'Process payments and manage credit invoices'
  },
  {
    id: 'shop-create-by-users',
    name: 'Shop Create by Users',
    displayName: 'Shop Create by Users',
    icon: '🏪',
    route: '/shop-create-by-users',
    description: 'Shop creation and management by authorized users'
  },
  {
    id: 'reports',
    name: 'Reports',
    displayName: 'Reports & Analytics',
    icon: '📊',
    route: '/reports',
    description: 'View sales and inventory reports'
  },
  {
    id: 'softwareSettings',
    name: 'Software Settings',
    displayName: 'Software Settings',
    icon: '⚙️',
    route: '/softwareSettings',
    description: 'Configure business information and system preferences'
  },
  {
    id: 'debug',
    name: 'Debug Access',
    displayName: 'Access Control Debug',
    icon: '🔍',
    route: '/debug-access',
    description: 'Debug access control and permissions (Admin only)'
  }
];

// Helper function to get page by id
export const getPageById = (id: string): NavigationPage | undefined => {
  return NAVIGATION_PAGES.find(page => page.id === id);
};

// Helper function to get available pages for user access list
export const getAvailablePages = () => {
  return NAVIGATION_PAGES.map(page => ({
    id: page.id,
    name: page.displayName
  }));
};