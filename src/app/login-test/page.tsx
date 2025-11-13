'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginTest() {
  const router = useRouter();
  const [status, setStatus] = useState('Ready to test');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    setLogs(prev => [...prev, logEntry]);
    console.log(logEntry);
  };

  const testLogin = async () => {
    try {
      setStatus('Testing login...');
      addLog('Starting login test');

      // Test the login API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'username', password: 'password' })
      });

      const result = await response.json();
      addLog(`API Response: ${JSON.stringify(result)}`);

      if (result.success) {
        // Store user data
        const userData = { ...result.user, loginTime: new Date().toISOString() };
        sessionStorage.setItem('currentUser', JSON.stringify(userData));
        
        // Set cookie
        document.cookie = `currentUser=${encodeURIComponent(JSON.stringify(userData))}; path=/`;
        
        addLog('User data stored in sessionStorage and cookie');
        addLog(`User has access to: ${result.user.accessPages.join(', ')}`);

        if (result.user.accessPages.includes('home')) {
          setStatus('Login successful! Attempting redirect...');
          addLog('User has home access, attempting redirect');
          
          // Try redirect
          setTimeout(() => {
            addLog('Using router.push to redirect to /');
            router.push('/');
          }, 500);

          // Fallback
          setTimeout(() => {
            if (window.location.pathname.includes('test')) {
              addLog('Router redirect failed, using window.location');
              window.location.href = '/';
            }
          }, 2000);
        } else {
          setStatus('Login successful but no home access');
          addLog('User does not have home page access');
        }
      } else {
        setStatus('Login failed');
        addLog(`Login failed: ${result.error}`);
      }
    } catch (error) {
      setStatus('Error during login test');
      addLog(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const clearData = () => {
    sessionStorage.clear();
    localStorage.clear();
    document.cookie = 'currentUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setLogs([]);
    setStatus('Data cleared');
    addLog('All user data cleared');
  };

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '800px', 
      margin: '0 auto',
      fontFamily: 'monospace',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1>🔍 Login Redirect Test</h1>
      <p><strong>Status:</strong> {status}</p>
      
      <div style={{ marginBottom: '2rem' }}>
        <button 
          onClick={testLogin}
          style={{ 
            padding: '1rem 2rem', 
            marginRight: '1rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          🚀 Test Login & Redirect
        </button>
        
        <button 
          onClick={clearData}
          style={{ 
            padding: '1rem 2rem',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          🗑️ Clear Data
        </button>
      </div>

      <div style={{ 
        background: '#000', 
        color: '#00ff00', 
        padding: '1rem',
        borderRadius: '5px',
        maxHeight: '400px',
        overflowY: 'auto'
      }}>
        <h3>📋 Debug Log:</h3>
        {logs.length === 0 ? (
          <p>No logs yet...</p>
        ) : (
          logs.map((log, index) => (
            <div key={index} style={{ marginBottom: '0.5rem' }}>{log}</div>
          ))
        )}
      </div>

      <div style={{ marginTop: '2rem', fontSize: '0.9rem' }}>
        <p><strong>This page tests:</strong></p>
        <ul>
          <li>✅ API login functionality</li>
          <li>✅ User data storage (sessionStorage + cookies)</li>
          <li>✅ Access permission checking</li>
          <li>✅ Redirect mechanism (router.push + window.location fallback)</li>
        </ul>
        
        <p><strong>URLs to test:</strong></p>
        <ul>
          <li>Local: <code>http://localhost:3000/login-test</code></li>
          <li>Vercel: <code>https://nexus-7fdj.vercel.app/login-test</code></li>
        </ul>
      </div>
    </div>
  );
}