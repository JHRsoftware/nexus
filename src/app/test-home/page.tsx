'use client';

import Link from 'next/link';

export default function TestHome() {
  return (
    <div style={{ 
      padding: '2rem', 
      textAlign: 'center',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1>🏠 Test Home Page</h1>
      <p>This is a test home page that bypasses authentication.</p>
      
      <div style={{ margin: '2rem 0' }}>
        <h2>✅ Success!</h2>
        <p>If you can see this page, the redirect mechanism works.</p>
      </div>
      
      <div style={{ 
        background: '#f0f8ff', 
        padding: '1rem', 
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <h3>🔍 Debug Info:</h3>
        <p><strong>URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'Server-side'}</p>
        <p><strong>Timestamp:</strong> {new Date().toLocaleString()}</p>
      </div>
      
      <div>
        <Link 
          href="/login"
          style={{ 
            display: 'inline-block',
            padding: '1rem 2rem',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px'
          }}
        >
          ← Back to Login
        </Link>
      </div>
    </div>
  );
}