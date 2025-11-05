import { useEffect, useState, useRef } from 'react'
import api from '../utils/api.js'
import ProductCard from '../components/ProductCard'
import { useCart } from '../state/CartContext'
import PremiumHero from '../components/PremiumHero'

export default function Home(){
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [maxPrice, setMaxPrice] = useState(500)
  const [minRating, setMinRating] = useState(0)
  const [filtering, setFiltering] = useState(false)
  const [brands, setBrands] = useState({ nike: false, adidas: false, puma: false, newbalance: false, underarmour: false })
  const { add } = useCart()
  const isInitialLoad = useRef(true)
  const debounceTimer = useRef(null)

  const load = async (isInitial = false)=>{
    if (!isInitial) setFiltering(true)
    try{
      const selected = Object.entries(brands).filter(([,v])=>v).map(([k])=>k)
      const qs = new URLSearchParams()
      if(maxPrice) qs.set('maxPrice', String(maxPrice))
      if(minRating > 0) qs.set('minRating', String(minRating))
      if(selected.length) qs.set('brand', selected.join(','))
      const res = await api.get(`/products?${qs.toString()}`)
      setProducts(res.items || [])
      setError('')
    }catch(e){
      setError(e.message)
    }finally{
      if(isInitial) {
        setLoading(false)
      } else {
        setFiltering(false)
      }
    }
  }

  useEffect(()=>{ 
    load(true)
    isInitialLoad.current = false
    // eslint-disable-next-line
  },[])

  useEffect(()=>{ 
    if(isInitialLoad.current) return
    
    // Clear existing timer
    if(debounceTimer.current) clearTimeout(debounceTimer.current)
    
    // Set new timer for debounced API call
    debounceTimer.current = setTimeout(() => {
      load(false)
    }, 300)
    
    // Cleanup
    return () => {
      if(debounceTimer.current) clearTimeout(debounceTimer.current)
    }
    // eslint-disable-next-line
  },[maxPrice, minRating, brands])

  if(loading) {
    return (
      <div className="container">
        <div className="skeleton skeleton-image" style={{height:500,marginBottom:40,borderRadius:'var(--radius-lg)'}} />
        <div className="filter-section">
          <div className="skeleton skeleton-title" style={{marginBottom:24}} />
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))',gap:24}}>
            {[1,2,3].map(i=> (
              <div key={i}>
                <div className="skeleton skeleton-text" style={{width:'60%',marginBottom:12}} />
                <div className="skeleton" style={{height:8,borderRadius:999,marginBottom:8}} />
              </div>
            ))}
          </div>
        </div>
        <div className="horizontal-scroll-container">
          <div className="horizontal-scroll">
            {[1,2,3,4,5,6].map(i=> (
              <div key={i} className="horizontal-card">
                <div className="card">
                  <div className="skeleton skeleton-image" style={{borderRadius:'var(--radius-lg)'}} />
                  <div className="body">
                    <div className="skeleton skeleton-text" style={{width:'40%'}} />
                    <div className="skeleton skeleton-title" />
                    <div className="skeleton skeleton-text" style={{width:'70%'}} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  if(error) return (
    <div className="container">
      <div style={{
        background:'var(--panel)',
        border:'1px solid #ff4444',
        borderRadius:'var(--radius-lg)',
        padding:32,
        textAlign:'center',
        marginTop:40
      }}>
        <div style={{fontSize:48,marginBottom:16}}>⚠️</div>
        <h2 style={{color:'#ff4444',marginBottom:12}}>Error Loading Products</h2>
        <p style={{color:'var(--text-secondary)',marginBottom:24}}>{error}</p>
        <button className="btn" onClick={()=>load(true)}>Try Again</button>
      </div>
    </div>
  )

  return (
    <div className="container">
      <div className="fade-in">
        <PremiumHero />
      </div>
      
      <div className="filter-section scale-in">
        <h3 style={{
          fontSize:16,
          fontWeight:800,
          color:'var(--text)',
          marginBottom:20,
          display:'flex',
          alignItems:'center',
          gap:10
        }}>
          <span>🔍</span>
          Filter Premium Collection
        </h3>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))',gap:24}}>
          <div>
            <label style={{
              marginBottom:12,
              display:'block',
              fontSize:13,
              fontWeight:600,
              color:'var(--text-secondary)'
            }}>
              Max Price: <span style={{color:'var(--primary)',fontWeight:700}}>₹{Number(maxPrice).toFixed(0)}</span>
            </label>
            <input 
              type="range" 
              min={0} 
              max={1000} 
              step={10} 
              value={maxPrice} 
              onChange={(e)=>setMaxPrice(Number(e.target.value))} 
              style={{width:'100%'}} 
            />
            <div style={{display:'flex',justifyContent:'space-between',marginTop:8,fontSize:11,color:'var(--text-muted)'}}>
              <span>₹0</span>
              <span>₹1000</span>
            </div>
          </div>
          <div>
            <label style={{
              marginBottom:12,
              display:'block',
              fontSize:13,
              fontWeight:600,
              color:'var(--text-secondary)'
            }}>
              Minimum Rating: <span style={{color:'var(--primary)',fontWeight:700}}>{minRating === 0 ? 'All' : `${minRating.toFixed(1)}★+`}</span>
            </label>
            <input 
              type="range" 
              min={0} 
              max={5} 
              step={0.5} 
              value={minRating} 
              onChange={(e)=>setMinRating(Number(e.target.value))} 
              style={{width:'100%'}} 
            />
            <div style={{display:'flex',justifyContent:'space-between',marginTop:6,fontSize:11,color:'var(--text-muted)'}}>
              <span>All</span>
              <span>5★</span>
            </div>
          </div>
          <div>
            <label style={{
              marginBottom:12,
              display:'block',
              fontSize:13,
              fontWeight:600,
              color:'var(--text-secondary)'
            }}>
              Premium Brands
            </label>
            <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
              {['nike','adidas','puma','newbalance','underarmour'].map(b=> (
                <label 
                  key={b} 
                  className="row" 
                  style={{
                    gap:8,
                    cursor:'pointer',
                    padding:'8px 14px',
                    borderRadius:'var(--radius-sm)',
                    background:brands[b] ? 'var(--primary-glow)' : 'transparent',
                    border:`1px solid ${brands[b] ? 'var(--primary)' : 'var(--border)'}`,
                    transition:'all 0.2s ease'
                  }}
                >
                  <input 
                    type="checkbox" 
                    checked={brands[b]||false} 
                    onChange={(e)=> setBrands(s=> ({...s, [b]: e.target.checked}))} 
                    style={{margin:0}}
                  />
                  <span style={{
                    textTransform:'capitalize',
                    fontSize:13,
                    fontWeight:600,
                    color:brands[b] ? 'var(--primary)' : 'var(--text-secondary)',
                    transition:'color 0.2s ease'
                  }}>
                    {b === 'newbalance' ? 'New Balance' : b === 'underarmour' ? 'Under Armour' : b}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Filtering indicator */}
      {filtering && (
        <div className="toast toast-success" style={{
          top: 80,
          bottom: 'auto'
        }}>
          <div className="spinner" style={{
            width: 20,
            height: 20,
            border: '2px solid rgba(0,255,136,0.3)',
            borderTop: '2px solid var(--primary)',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite'
          }} />
          <span style={{fontWeight:600}}>Updating results...</span>
        </div>
      )}
      
      <div style={{
        position: 'relative', 
        opacity: filtering ? 0.7 : 1, 
        transition: 'opacity 0.3s ease',
        pointerEvents: filtering ? 'none' : 'auto'
      }}>
        {products.length === 0 ? (
          <div style={{
            textAlign:'center',
            padding:80,
            background:'var(--panel)',
            border:'1px solid var(--border)',
            borderRadius:'var(--radius-lg)',
            marginTop:32
          }}>
            <div style={{
              fontSize:64,
              marginBottom:20,
              opacity:0.5
            }}>👟</div>
            <h3 style={{
              fontSize:24,
              fontWeight:700,
              marginBottom:12,
              color:'var(--text)'
            }}>No Sneakers Found</h3>
            <p style={{
              color:'var(--text-secondary)',
              marginBottom:24,
              fontSize:15
            }}>
              No sneakers match your filters. Try adjusting your search criteria.
            </p>
            <button 
              className="btn btn-outline" 
              onClick={()=>{
                setMaxPrice(500)
                setMinRating(0)
                setBrands({ nike: false, adidas: false, puma: false, newbalance: false, underarmour: false })
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div style={{marginTop:32}}>
            <div style={{
              display:'flex',
              justifyContent:'space-between',
              alignItems:'center',
              marginBottom:24
            }}>
              <h2 style={{
                fontSize:28,
                fontWeight:800,
                color:'var(--text)',
                margin:0
              }}>
                Premium Collection
              </h2>
              <span style={{
                fontSize:14,
                color:'var(--text-secondary)',
                fontWeight:600
              }}>
                {products.length} {products.length === 1 ? 'sneaker' : 'sneakers'} found
              </span>
            </div>
          <div className="horizontal-scroll-container">
            <div className="horizontal-scroll">
                {products.map((p, idx)=> (
                  <div 
                    key={p._id} 
                    className="horizontal-card" 
                    style={{
                      animation: `fadeIn 0.5s ease ${idx * 0.05}s both`
                    }}
                  >
                  <ProductCard product={p} onAdd={()=>add(p._id,1)} />
                </div>
              ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .hero-section {
          position: relative;
          width: 100%;
          margin: -20px 0 40px;
          overflow: hidden;
          border-radius: 20px;
          background: radial-gradient(circle at center, #1a1a1a 0%, #000000 100%);
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .horizontal-scroll-container {
          margin-top: 40px;
        }
      `}</style>
    </div>
  )
}
