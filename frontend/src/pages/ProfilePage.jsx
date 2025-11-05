import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'

export default function ProfilePage() {
  const { user } = useAuth()
  const [customDesigns, setCustomDesigns] = useState([])
  const [activeDesign, setActiveDesign] = useState(null)

  useEffect(() => {
    // Load all saved custom designs from localStorage
    const savedDesigns = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('customShoeDesign_')) {
        try {
          const design = JSON.parse(localStorage.getItem(key))
          savedDesigns.push({ id: key, ...design })
        } catch (e) {
          console.error('Failed to parse design:', e)
        }
      }
    }
    // Sort by date (newest first)
    savedDesigns.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt))
    setCustomDesigns(savedDesigns)
  }, [])

  const handleDelete = (id) => {
    if (confirm('Delete this custom design?')) {
      localStorage.removeItem(id)
      setCustomDesigns(designs => designs.filter(d => d.id !== id))
      if (activeDesign?.id === id) {
        setActiveDesign(null)
      }
    }
  }

  const handleLoadDesign = (design) => {
    // Save to the main design slot for the customizer to load
    localStorage.setItem('customShoeDesign', JSON.stringify(design.colors))
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!user) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: 60 }}>
          <h2>Please login to view your profile</h2>
          <Link to="/login" className="btn" style={{ marginTop: 20 }}>
            Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <h1>Welcome back, {user.name}! 👋</h1>
          <p className="profile-email">{user.email}</p>
        </div>
      </div>

      <div className="profile-section">
        <div className="section-header">
          <h2>🎨 Your Custom Designs ({customDesigns.length})</h2>
          <Link to="/customize" className="btn">
            Create New Design
          </Link>
        </div>

        {customDesigns.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👟</div>
            <h3>No custom designs yet</h3>
            <p>Start designing your dream sneakers in the customizer!</p>
            <Link to="/customize" className="btn" style={{ marginTop: 20 }}>
              Go to Customizer
            </Link>
          </div>
        ) : (
          <div className="designs-grid">
            {customDesigns.map(design => (
              <div 
                key={design.id} 
                className={`design-card ${activeDesign?.id === design.id ? 'active' : ''}`}
                onClick={() => setActiveDesign(design)}
              >
                <div className="design-preview">
                  <div className="color-swatches">
                    {Object.entries(design.colors).slice(0, 6).map(([part, color]) => (
                      <div
                        key={part}
                        className="color-swatch"
                        style={{ backgroundColor: color }}
                        title={part}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="design-info">
                  <h3>{design.name || 'Unnamed Design'}</h3>
                  <p className="design-date">
                    Saved {formatDate(design.savedAt)}
                  </p>
                </div>

                <div className="design-actions">
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleLoadDesign(design)
                    }}
                    title="Load in customizer"
                  >
                    <Link to="/customize" style={{ color: 'inherit', textDecoration: 'none' }}>
                      Edit
                    </Link>
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(design.id)
                    }}
                    title="Delete design"
                  >
                    🗑️
                  </button>
                </div>

                {activeDesign?.id === design.id && (
                  <div className="design-details">
                    <h4>Color Details:</h4>
                    <div className="color-list">
                      {Object.entries(design.colors).map(([part, color]) => (
                        <div key={part} className="color-item">
                          <div 
                            className="color-dot" 
                            style={{ backgroundColor: color }}
                          />
                          <span className="part-name">
                            {part.charAt(0).toUpperCase() + part.slice(1)}:
                          </span>
                          <span className="color-value">{color}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="profile-section">
        <h2>📦 Quick Links</h2>
        <div className="quick-links">
          <Link to="/my-sneakers" className="quick-link-card">
            <div className="quick-link-icon">👟</div>
            <h3>My Sneakers</h3>
            <p>View your listed products</p>
          </Link>
          <Link to="/sell" className="quick-link-card">
            <div className="quick-link-icon">💰</div>
            <h3>Sell Sneakers</h3>
            <p>List new products for sale</p>
          </Link>
          <Link to="/customize" className="quick-link-card">
            <div className="quick-link-icon">🎨</div>
            <h3>Customizer</h3>
            <p>Design custom sneakers</p>
          </Link>
          <Link to="/cart" className="quick-link-card">
            <div className="quick-link-icon">🛒</div>
            <h3>Cart</h3>
            <p>View your shopping cart</p>
          </Link>
        </div>
      </div>

      <style>{`
        .profile-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
          animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .profile-header {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 30px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(0, 255, 136, 0.2);
          border-radius: 16px;
          margin-bottom: 40px;
          box-shadow: 0 4px 20px rgba(0, 255, 136, 0.1);
        }

        .profile-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary) 0%, #00cc6f 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          font-weight: 900;
          color: var(--bg);
          box-shadow: 0 4px 16px rgba(0, 255, 136, 0.4);
        }

        .profile-info h1 {
          margin: 0 0 8px 0;
          font-size: 32px;
          font-weight: 900;
          color: var(--text);
        }

        .profile-email {
          margin: 0;
          color: var(--text-secondary);
          font-size: 16px;
        }

        .profile-section {
          margin-bottom: 48px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .section-header h2 {
          margin: 0;
          font-size: 28px;
          font-weight: 800;
          color: var(--text);
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
          background: rgba(255, 255, 255, 0.02);
          border: 2px dashed rgba(0, 255, 136, 0.3);
          border-radius: 16px;
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 8px 0;
          color: var(--text);
        }

        .empty-state p {
          color: var(--text-secondary);
          font-size: 16px;
          margin: 0;
        }

        .designs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        .design-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(0, 255, 136, 0.2);
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .design-card:hover {
          border-color: var(--primary);
          box-shadow: 0 8px 24px rgba(0, 255, 136, 0.2);
          transform: translateY(-4px);
        }

        .design-card.active {
          border-color: var(--primary);
          box-shadow: 0 0 30px rgba(0, 255, 136, 0.3);
        }

        .design-preview {
          margin-bottom: 16px;
        }

        .color-swatches {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .color-swatch {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }

        .design-card:hover .color-swatch {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .design-info h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 700;
          color: var(--text);
        }

        .design-date {
          margin: 0;
          font-size: 14px;
          color: var(--text-muted);
        }

        .design-actions {
          display: flex;
          gap: 8px;
          margin-top: 16px;
        }

        .btn-sm {
          padding: 8px 16px;
          font-size: 14px;
        }

        .btn-danger {
          background: rgba(220, 38, 38, 0.1);
          border: 1px solid rgba(220, 38, 38, 0.3);
          color: #f87171;
        }

        .btn-danger:hover {
          background: rgba(220, 38, 38, 0.2);
          border-color: #dc2626;
        }

        .design-details {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid rgba(0, 255, 136, 0.2);
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .design-details h4 {
          margin: 0 0 12px 0;
          font-size: 14px;
          font-weight: 600;
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .color-list {
          display: grid;
          gap: 8px;
        }

        .color-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
        }

        .color-dot {
          width: 20px;
          height: 20px;
          border-radius: 4px;
          border: 2px solid rgba(255, 255, 255, 0.2);
        }

        .part-name {
          color: var(--text-secondary);
          min-width: 80px;
        }

        .color-value {
          color: var(--text-muted);
          font-family: monospace;
          font-size: 12px;
        }

        .quick-links {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
        }

        .quick-link-card {
          padding: 24px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(0, 255, 136, 0.2);
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.3s ease;
          text-align: center;
        }

        .quick-link-card:hover {
          border-color: var(--primary);
          background: rgba(0, 255, 136, 0.05);
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 255, 136, 0.2);
        }

        .quick-link-icon {
          font-size: 48px;
          margin-bottom: 12px;
        }

        .quick-link-card h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 700;
          color: var(--text);
        }

        .quick-link-card p {
          margin: 0;
          font-size: 14px;
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .profile-container {
            padding: 20px 10px;
          }

          .profile-header {
            flex-direction: column;
            text-align: center;
            padding: 20px;
          }

          .profile-info h1 {
            font-size: 24px;
          }

          .section-header {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }

          .section-header h2 {
            font-size: 22px;
          }

          .designs-grid {
            grid-template-columns: 1fr;
          }

          .quick-links {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
