export default function App() {
  return (
    <div style={{ 
      background: '#0a0a0a', 
      color: '#00ff88', 
      minHeight: '100vh', 
      padding: '40px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>
        ✅ React is Working!
      </h1>
      <p style={{ fontSize: '20px', marginBottom: '20px' }}>
        If you see this, React and Vite are working correctly.
      </p>
      <div style={{ 
        background: '#1a1a1a', 
        padding: '20px', 
        borderRadius: '10px',
        border: '1px solid #00ff88'
      }}>
        <h2>Next Steps:</h2>
        <ol style={{ lineHeight: '2' }}>
          <li>Open browser console (F12)</li>
          <li>Check for any red error messages</li>
          <li>Tell me what errors you see</li>
        </ol>
      </div>
      <button 
        onClick={() => {
          fetch('http://localhost:5000/api/health')
            .then(r => r.json())
            .then(d => alert('Backend OK: ' + JSON.stringify(d)))
            .catch(e => alert('Backend Error: ' + e.message))
        }}
        style={{
          background: '#00ff88',
          color: '#000',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Test Backend Connection
      </button>
    </div>
  )
}
