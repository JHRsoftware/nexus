export default function HealthCheck() {
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
      <h1 style={{ fontSize: '3rem', margin: '0 0 1rem 0' }}>✅ Deployment Successful</h1>
      <p style={{ fontSize: '1.2rem', margin: '0 0 2rem 0', opacity: 0.9 }}>
        Your Next.js app is running on Vercel!
      </p>
      
      <div style={{ 
        background: 'rgba(255,255,255,0.1)', 
        padding: '1.5rem', 
        borderRadius: '10px',
        backdropFilter: 'blur(10px)',
        maxWidth: '600px'
      }}>
        <h2 style={{ margin: '0 0 1rem 0' }}>🚀 System Status</h2>
        <div style={{ display: 'grid', gap: '1rem', textAlign: 'left' }}>
          <div>✅ Next.js Runtime: Active</div>
          <div>✅ API Routes: Available</div>
          <div>✅ Static Assets: Loaded</div>
          <div>✅ Build Process: Complete</div>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
          Time: {new Date().toISOString()}
        </p>
        <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
          Environment: {process.env.NODE_ENV}
        </p>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <a 
          href="/" 
          style={{ 
            display: 'inline-block',
            background: 'rgba(255,255,255,0.2)', 
            padding: '0.75rem 1.5rem', 
            borderRadius: '5px', 
            textDecoration: 'none', 
            color: 'white',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}
        >
          🏠 Go to Dashboard
        </a>
      </div>
    </div>
  );
}