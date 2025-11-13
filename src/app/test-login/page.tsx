export default function SimpleLogin() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      fontFamily: 'system-ui, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        padding: '3rem',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        maxWidth: '500px',
        width: '100%'
      }}>
        <h1 style={{ fontSize: '2.5rem', margin: '0 0 1rem 0' }}>🔐 Login Test</h1>
        <p style={{ fontSize: '1.1rem', margin: '0 0 2rem 0', opacity: 0.9 }}>
          Testing login page rendering on Vercel
        </p>
        
        <div style={{ 
          background: 'rgba(255,255,255,0.1)', 
          padding: '1.5rem', 
          borderRadius: '10px',
          marginBottom: '2rem',
          textAlign: 'left'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#ffeb3b' }}>🚀 System Status</h3>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <div>✅ Page Routing: Working</div>
            <div>✅ React Rendering: Active</div>
            <div>✅ CSS Styles: Loaded</div>
            <div>⚠️ Database: Testing Required</div>
          </div>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
            <strong>Next Step:</strong> Test database connection
          </p>
          <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>
            Try: /api/test-db to check database connectivity
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a 
            href="/api/test-db" 
            style={{ 
              display: 'inline-block',
              background: 'rgba(255,255,255,0.2)', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '5px', 
              textDecoration: 'none', 
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            🔍 Test DB
          </a>
          <a 
            href="/api/debug" 
            style={{ 
              display: 'inline-block',
              background: 'rgba(255,255,255,0.2)', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '5px', 
              textDecoration: 'none', 
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            🛠️ Debug Info
          </a>
        </div>
      </div>

      <div style={{ marginTop: '2rem', fontSize: '0.9rem', opacity: 0.7 }}>
        <p>Deployment Time: {new Date().toISOString()}</p>
        <p>Environment: {process.env.NODE_ENV || 'unknown'}</p>
      </div>
    </div>
  );
}