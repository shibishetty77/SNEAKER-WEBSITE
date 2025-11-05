import { useEffect, useState, useRef } from 'react'
import api from '../utils/api.js'
import ProductCard from '../components/ProductCard'
import { useCart } from '../state/CartContext'
import ShoeAnimation3D from '../components/ShoeAnimation3D'

export default function Home(){
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtering, setFiltering] = useState(false)
  const [error, setError] = useState('')
  const [maxPrice, setMaxPrice] = useState(500)
  const [minRating, setMinRating] = useState(0)
  const [brands, setBrands] = useState({ nike: false, adidas: false, puma: false, newbalance: false, underarmour: false })
  const { add } = useCart()
  const debounceTimer = useRef(null)
  const isInitialLoad = useRef(true)

  const load = async (isInitial = false)=>{
    if(isInitial) {
      setLoading(true)
    } else {
      setFiltering(true)
    }
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

  if(loading) return <div className="container">Loading...</div>
  if(error) return <div className="container">{error}</div>

  return (
    <div className="container">
      <div className="hero-section">
        <ShoeAnimation3D />
      </div>
      
      {/* Filtering indicator */}
      {filtering && (
        <div style={{
          position: 'fixed',
          top: 80,
          right: 20,
          background: 'var(--primary)',
          color: 'white',
          padding: '12px 20px',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 4px 12px var(--shadow)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          animation: 'slideIn 0.3s ease'
        }}>
          <div className="spinner" style={{
            width: 16,
            height: 16,
            border: '2px solid rgba(255,255,255,0.3)',
            borderTop: '2px solid white',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite'
          }} />
          <span>Updating results...</span>
        </div>
      )}

      <div className="filter-section">
        <h3>Filter Premium Collection</h3>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))',gap:24}}>
          <div>
            <label style={{marginBottom:12}}>Max Price: ₹{Number(maxPrice).toFixed(0)}</label>
            <input type="range" min={0} max={1000} step={10} value={maxPrice} onChange={(e)=>setMaxPrice(Number(e.target.value))} style={{width:'100%'}} />
          </div>
          <div>
            <label style={{marginBottom:12}}>Minimum Rating: {minRating === 0 ? 'All' : `${minRating}★+`}</label>
            <input type="range" min={0} max={5} step={0.5} value={minRating} onChange={(e)=>setMinRating(Number(e.target.value))} style={{width:'100%'}} />
            <div style={{display:'flex',justifyContent:'space-between',marginTop:6,fontSize:12,color:'var(--text-muted)'}}>
              <span>All</span>
              <span>5★</span>
            </div>
          </div>
          <div>
            <label style={{marginBottom:12}}>Premium Brands</label>
            <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
              {['nike','adidas','puma','newbalance','underarmour'].map(b=> (
                <label key={b} className="row" style={{gap:6,cursor:'pointer'}}>
                  <input type="checkbox" checked={brands[b]||false} onChange={(e)=> setBrands(s=> ({...s, [b]: e.target.checked}))} />
                  <span style={{textTransform:'capitalize',fontSize:14}}>{b === 'newbalance' ? 'New Balance' : b === 'underarmour' ? 'Under Armour' : b}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {products.length === 0 ? (
        <div style={{textAlign:'center',padding:60,color:'var(--text-secondary)'}}>
          <div style={{fontSize:48,marginBottom:16}}>👟</div>
          <p>No sneakers match your filters. Try adjusting your search.</p>
        </div>
      ) : (
        <div className="horizontal-scroll-container">
          <div className="horizontal-scroll">
            {products.map(p=> (
              <div key={p._id} className="horizontal-card">
                <ProductCard product={p} onAdd={()=>add(p._id,1)} />
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
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
      `}</style>
    </div>
  )
}