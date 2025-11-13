'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRequireAuth } from '../contexts/AuthContext';
import Link from 'next/link';

export default function Home() {
  const { user, isLoading, hasAccess } = useRequireAuth('home');
  const [companyName, setCompanyName] = useState('Harshana System'); // Default name

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
    if (user) {
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
  }, [user, loadCompanyName]);

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="loading-message" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '200px',
          fontSize: '18px',
          color: 'var(--text-secondary)'
        }}>
          <span>⏳ Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Welcome Header */}
      <div className="welcome-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <div className="welcome-icon">
            🏠
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h1 style={{ margin: 0, fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: '700' }}>
              {companyName} Dashboard
            </h1>
            <p style={{ 
              margin: '0.5rem 0 0 0', 
              fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', 
              opacity: 0.9,
              fontWeight: '300'
            }}>
              {user ? `සාදරයෙන් පිළිගනිමු, ${user.name}! 🎉` : 'Welcome to your dashboard'}
            </p>
          </div>
        </div>
        
        {user && (
          <div className="welcome-user-info">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              <div>
                <small style={{ opacity: 0.8 }}>Account</small>
                <div style={{ fontWeight: '600' }}>@{user.username}</div>
              </div>
              <div>
                <small style={{ opacity: 0.8 }}>Status</small>
                <div style={{ fontWeight: '600' }}>
                  <span style={{ color: user.isActive ? '#28a745' : '#dc3545' }}>
                    {user.isActive ? '✅ Active' : '❌ Inactive'}
                  </span>
                </div>
              </div>
              <div>
                <small style={{ opacity: 0.8 }}>Access Level</small>
                <div style={{ fontWeight: '600' }}>{user.accessPages.length} Pages Available</div>
              </div>
              <div>
                <small style={{ opacity: 0.8 }}>Login Time</small>
                <div style={{ fontWeight: '600' }}>
                  {user.loginTime ? new Date(user.loginTime).toLocaleTimeString() : 'Now'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="page-content">
       

        {/* System Features */}
        <div className="content-section" style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ⭐ System Features
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1.5rem' 
          }}>
            <div className="card" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
              <h3 style={{ color: 'var(--primary-color)' }}>Secure Authentication</h3>
              <p>Advanced login system with session management and access control</p>
            </div>
            
            <div className="card" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📱</div>
              <h3 style={{ color: 'var(--primary-color)' }}>Mobile Responsive</h3>
              <p>Optimized for all devices with touch-friendly interface design</p>
            </div>
            
            <div className="card" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎨</div>
              <h3 style={{ color: 'var(--primary-color)' }}>Theme System</h3>
              <p>Customizable themes with dark/light mode support</p>
            </div>
            
            <div className="card" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
              <h3 style={{ color: 'var(--primary-color)' }}>High Performance</h3>
              <p>Built with Next.js 14+ and modern web technologies</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="content-section">
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            📊 System Status
          </h2>
          <div className="info-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem' 
          }}>
            <div className="status-card" style={{ 
              background: 'linear-gradient(135deg, #28a745, #20c997)'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>System Status</h4>
              <div style={{ fontSize: '2rem', margin: '0.5rem 0' }}>✅</div>
              <p style={{ margin: 0, opacity: 0.9 }}>All systems operational</p>
            </div>
            
            <div className="status-card" style={{ 
              background: 'linear-gradient(135deg, #007bff, #6610f2)'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>Database</h4>
              <div style={{ fontSize: '2rem', margin: '0.5rem 0' }}>🗄️</div>
              <p style={{ margin: 0, opacity: 0.9 }}>Connected & synchronized</p>
            </div>
            
            <div className="status-card" style={{ 
              background: 'linear-gradient(135deg, #fd7e14, #e83e8c)'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>Performance</h4>
              <div style={{ fontSize: '2rem', margin: '0.5rem 0' }}>⚡</div>
              <p style={{ margin: 0, opacity: 0.9 }}>Optimal speed</p>
            </div>
            
            <div className="status-card" style={{ 
              background: 'linear-gradient(135deg, #6f42c1, #e83e8c)'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>Security</h4>
              <div style={{ fontSize: '2rem', margin: '0.5rem 0' }}>🛡️</div>
              <p style={{ margin: 0, opacity: 0.9 }}>Fully protected</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
