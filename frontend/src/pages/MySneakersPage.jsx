import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api.js'
import { useAuth } from '../state/AuthContext.jsx'

export default function MySneakersPage() {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get('/products')
      const myProducts = res.items?.filter(p => p.owner && String(p.owner) === String(user?.id)) || []
      setProducts(myProducts)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) load()
  }, [user])

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}" from your listings?`)) return
    try {
      await api.del(`/products/${id}`)
      setProducts(products.filter(p => p._id !== id))
    } catch (e) {
      alert(e.message || 'Failed to delete')
    }
  }

  if (!user) {
    return (
      <div className="container">
        <h2>Please login to view your sneakers</h2>
      </div>
    )
  }

  if (loading) return <div className="container">Loading...</div>
  if (error) return <div className="container">{error}</div>

  return (
    <div className="container">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 42, fontWeight: 900, margin: 0, marginBottom: 8 }}>My Sneakers</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>
          Manage your listed products
        </p>
      </div>

      {products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
          <p>You haven't listed any sneakers yet.</p>
          <Link to="/sell" className="btn" style={{ marginTop: 20, display: 'inline-flex' }}>
            List Your First Sneaker
          </Link>
        </div>
      ) : (
        <div className="my-sneakers-grid">
          {products.map(product => (
            <div key={product._id} className="my-sneaker-card">
              <Link to={`/product/${product._id}`} className="sneaker-image-link">
                <img 
                  src={product.images?.[0] || 'https://picsum.photos/400/300?blur=3'} 
                  alt={product.name}
                  style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                />
              </Link>
              <div style={{ padding: 20 }}>
                <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>
                  {product.brand}
                </div>
                <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px 0' }}>{product.name}</h3>
                </Link>
                {product.colorway ? (
                  <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 12 }}>
                    {product.colorway}
                  </div>
                ) : null}
                <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span className="price" style={{ fontSize: 20 }}>${product.price?.toFixed(2)}</span>
                  <span className="badge">
                    Stock: {product.stock || 0}
                  </span>
                </div>
                <div className="row" style={{ gap: 8 }}>
                  <Link to={`/product/${product._id}`} className="btn btn-outline" style={{ flex: 1, textDecoration: 'none' }}>
                    View
                  </Link>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleDelete(product._id, product.name)}
                    style={{ padding: '12px 16px' }}
                    title="Delete sneaker"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .my-sneakers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        .my-sneaker-card {
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .my-sneaker-card:hover {
          border-color: var(--primary);
          box-shadow: 0 8px 24px var(--shadow);
        }

        .sneaker-image-link {
          display: block;
          overflow: hidden;
        }

        .sneaker-image-link img {
          transition: transform 0.3s ease;
        }

        .sneaker-image-link:hover img {
          transform: scale(1.05);
        }

        @media (max-width: 768px) {
          .my-sneakers-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
