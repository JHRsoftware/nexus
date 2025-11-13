'use client';

import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import Settings from './Settings';
import { NAVIGATION_PAGES, getPageById } from '../config/navigation';
import './Sidebar.css';

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = memo(({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(true); // Start collapsed by default
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [companyName, setCompanyName] = useState('Harshana System'); // Default name
  const { isAuthenticated, user, hasAccess, logout, isLoading } = useAuth();
  const pathname = usePathname();

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setIsCollapsed(false); // Don't use collapsed state on mobile
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load company name from settings
  const loadCompanyName = useCallback(async () => {
    try {
      if (user) {
        const response = await fetch('/api/softwareSettings', {
          headers: {
            'Content-Type': 'application/json',
            'x-user-data': JSON.stringify(user)
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.settings && data.settings.companyName) {
            setCompanyName(data.settings.companyName);
          }
        }
      }
    } catch (error) {
      console.error('Error loading company name:', error);
      // Keep default name on error
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadCompanyName();
    }

    // Listen for company name updates
    const handleCompanyNameUpdate = () => {
      loadCompanyName();
    };

    window.addEventListener('companyNameUpdated', handleCompanyNameUpdate);
    
    return () => {
      window.removeEventListener('companyNameUpdated', handleCompanyNameUpdate);
    };
  }, [isAuthenticated, user, loadCompanyName]);

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  }, [isMobile, isMobileOpen, isCollapsed]);

  const closeMobileSidebar = useCallback(() => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  }, [isMobile]);

  // Auto expand/collapse on hover (only on desktop)
  const handleMouseEnter = useCallback(() => {
    if (!isMobile) {
      setIsCollapsed(false);
    }
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    if (!isMobile) {
      setIsCollapsed(true);
    }
  }, [isMobile]);

  // Don't show sidebar on login page or if not authenticated
  const shouldShowSidebar = !isLoading && isAuthenticated && pathname !== '/login';

  const handleLogout = useCallback(() => {
    closeMobileSidebar();
    logout();
  }, [closeMobileSidebar, logout]);

  // If loading, show content without sidebar but with a loading indicator
  if (isLoading) {
    return (
      <div className="app-container">
        <div className="loading-wrapper" style={{ 
          position: 'fixed', 
          top: '10px', 
          right: '10px', 
          background: 'rgba(0,0,0,0.1)', 
          padding: '5px 10px', 
          borderRadius: '4px',
          fontSize: '12px',
          zIndex: 1000
        }}>
          Loading auth...
        </div>
        {children}
      </div>
    );
  }

  // If not authenticated or on login page, show content without sidebar
  if (!shouldShowSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="app-container">
      {/* Mobile Menu Button */}
      {isMobile && (
        <button 
          className="mobile-menu-btn"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <span className="hamburger-icon">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      )}
      
      {/* Mobile Overlay */}
      {isMobile && isMobileOpen && (
        <div 
          className="mobile-overlay"
          onClick={closeMobileSidebar}
        />
      )}
      
      <div 
        className={`sidebar ${
          isMobile 
            ? (isMobileOpen ? 'mobile-open' : 'mobile-closed')
            : (isCollapsed ? 'collapsed' : '')
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="sidebar-header">
          <button 
            className="toggle-btn" 
            onClick={toggleSidebar}
            aria-label={
              isMobile 
                ? (isMobileOpen ? 'Close menu' : 'Open menu')
                : (isCollapsed ? 'Expand sidebar' : 'Collapse sidebar')
            }
          >
            {isMobile ? '✕' : (isCollapsed ? '→' : '←')}
          </button>
          {(!isCollapsed || isMobile) && (
            <div className="header-content">
              <h2>{companyName}</h2>
              <div className="header-user-info">
                <span className="header-user-name">{user?.name || 'User'}</span>
                <span className="header-username">@{user?.username || 'user'}</span>
              </div>
            </div>
          )}
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            {NAVIGATION_PAGES.map((page) => (
              hasAccess(page.id) && page.id !== 'settings' && (
                <li key={page.id}>
                  <Link 
                    href={page.route} 
                    className={`nav-link ${pathname === page.route ? 'active' : ''}`} 
                    onClick={closeMobileSidebar}
                    title={page.description}
                  >
                    <span className="nav-icon">{page.icon}</span>
                    {(!isCollapsed || isMobile) && <span className="nav-text">{page.name}</span>}
                  </Link>
                </li>
              )
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="sidebar-footer">
          <button 
            className="logout-btn"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <span className="nav-icon">🚪</span>
            {(!isCollapsed || isMobile) && <span className="nav-text">Logout</span>}
          </button>
        </div>
        
        <div className="sidebar-settings">
          {(!isCollapsed || isMobile) && <Settings />}
        </div>
      </div>
      
      <div className="main-content">
        {children}
      </div>
    </div>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;