import { useEffect, useState } from 'react'
import api from '../utils/api.js'
import ProductCard from '../components/ProductCard'
import { useCart } from '../state/CartContext'
import ShoeAnimation3D from '../components/ShoeAnimation3D'

export default function Home(){
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [maxPrice, setMaxPrice] = useState(500)
  const [minRating, setMinRating] = useState(0)
  const [brands, setBrands] = useState({ nike: false, adidas: false, puma: false, newbalance: false, underarmour: false })
  const { add } = useCart()

  const load = async ()=>{
    setLoading(true)
    try{
      const selected = Object.entries(brands).filter(([,v])=>v).map(([k])=>k)
      const qs = new URLSearchParams()
      if(maxPrice) qs.set('maxPrice', String(maxPrice))
      if(minRating > 0) qs.set('minRating', String(minRating))
      if(selected.length) qs.set('brand', selected.join(','))
      const res = await api.get(`/products?${qs.toString()}`)
      setProducts(res.items || [])
    }catch(e){
      setError(e.message)
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{ load() // eslint-disable-next-line
  },[])

  useEffect(()=>{ load() // eslint-disable-next-line
  },[maxPrice, minRating, brands])

  if(loading) return <div className="container">Loading...</div>
  if(error) return <div className="container">{error}</div>

  return (
    <div className="container">
      <ShoeAnimation3D />
      
      <div className="filter-section">
        <h3>Filter Premium Collection</h3>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))',gap:24}}>
          <div>
            <label style={{marginBottom:12}}>Max Price: ${Number(maxPrice).toFixed(0)}</label>
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
    </div>
  )
}
