import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../utils/api.js'
import RatingStars from '../components/RatingStars.jsx'
import ReviewList from '../components/ReviewList.jsx'
import ReviewForm from '../components/ReviewForm.jsx'
import { useCart } from '../state/CartContext.jsx'
import { useAuth } from '../state/AuthContext.jsx'

export default function ProductDetail(){
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [summary, setSummary] = useState({ avgRating: 0, reviewCount: 0, breakdown: {} })
  const [reviews, setReviews] = useState([])
  const [qty, setQty] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [size, setSize] = useState('')
  const [color, setColor] = useState('')
  const [loading, setLoading] = useState(true)
  const { add } = useCart()
  const { user } = useAuth()

  const load = async ()=>{
    setLoading(true)
    try{
      const [p, s, r] = await Promise.all([
        api.get(`/products/${id}`),
        api.get(`/reviews/product/${id}/summary`),
        api.get(`/reviews/product/${id}`)
      ])
      setProduct(p)
      setSummary(s)
      setReviews(r)
      if(p?.sizes?.length) setSize(p.sizes[0])
      if(p?.colors?.length) setColor(p.colors[0])
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{ load() // eslint-disable-next-line
  },[id])

  const breakdownPercents = useMemo(()=>{
    const total = summary.reviewCount || 0
    const out = {}
    for(let star=5; star>=1; star--){
      const count = summary.breakdown?.[star] || 0
      out[star] = total ? Math.round((count/total)*100) : 0
    }
    return out
  },[summary])

  if(loading) return <div className="container">Loading...</div>
  if(!product) return <div className="container">Not found</div>

  return (
    <div className="container" style={{display:'grid',gap:24,gridTemplateColumns:'1fr 1fr'}}>
      <div>
        <img src={product.images?.[activeImage] || 'https://picsum.photos/800/600?blur=3'} alt={product.name} style={{width:'100%',borderRadius:14,border:'1px solid #202020'}} />
        <div className="row" style={{gap:10,marginTop:10,flexWrap:'wrap'}}>
          {(product.images||[]).map((src, i)=> (
            <img key={i} src={src} alt="thumb" onClick={()=>setActiveImage(i)} style={{width:80,height:80,objectFit:'cover',cursor:'pointer',borderRadius:10,border:i===activeImage?'2px solid var(--green)':'1px solid #202020'}} />
          ))}
        </div>
      </div>
      <div>
        <div style={{fontSize:13,textTransform:'uppercase',color:'var(--text-muted)',fontWeight:700,letterSpacing:1.5,marginBottom:8}}>{product.brand}</div>
        <h2 style={{marginTop:0,fontSize:32,fontWeight:900,lineHeight:1.2}}>{product.name}</h2>
        {product.model && product.model !== product.name ? <div style={{fontSize:18,color:'var(--text-secondary)',marginBottom:16}}>{product.model}</div> : null}
        {product.colorway ? <div style={{fontSize:16,color:'var(--primary)',fontWeight:600,marginBottom:20}}>{product.colorway}</div> : null}
        
        <div className="row" style={{justifyContent:'space-between',marginBottom:20}}>
          <div className="price">₹{Number(product.price).toFixed(2)}</div>
          <div className="row" style={{gap:8}}>
            <RatingStars value={summary.avgRating} />
            <strong>{Number(summary.avgRating).toFixed(1)}</strong>
            <span style={{color:'var(--text-secondary)',fontSize:14}}>({summary.reviewCount})</span>
          </div>
        </div>
        
        <div className="row" style={{gap:10,marginBottom:20,flexWrap:'wrap'}}>
          {product.condition ? <span className="badge">{String(product.condition).replace(/-/g, ' ')}</span> : null}
          {product.category ? <span className="badge">{product.category}</span> : null}
          <span className="badge" style={{color:product.stock > 0 ? 'var(--primary)' : '#ff4444',borderColor:product.stock > 0 ? 'var(--primary)' : '#ff4444'}}>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
          {product.releaseDate ? <span className="badge">Released: {new Date(product.releaseDate).toLocaleDateString()}</span> : null}
        </div>
        
        <p style={{color:'var(--text-secondary)',lineHeight:1.8,fontSize:15}}>{product.description}</p>
        {product.sizes?.length ? (
          <div style={{margin:'12px 0'}}>
            <label>Size</label>
            <select className="input" value={size} onChange={(e)=>setSize(e.target.value)}>
              {product.sizes.map(s=> <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        ) : null}
        {product.colors?.length ? (
          <div style={{margin:'12px 0'}}>
            <label>Color</label>
            <select className="input" value={color} onChange={(e)=>setColor(e.target.value)}>
              {product.colors.map(c=> <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        ) : null}
        <div className="row" style={{gap:10,margin:'12px 0', flexWrap:'wrap'}}>
          <label>Qty</label>
          <input className="input" type="number" min={1} value={qty} onChange={(e)=>setQty(Number(e.target.value))} style={{width:100}} />
          <button className="btn" onClick={()=>add(product._id, qty)}>Add to Cart</button>
          <button className="btn btn-outline" onClick={async()=>{
            await api.post(`/products/${id}/purchase`, { quantity: qty })
            await load()
          }}>Buy Now</button>
          {user && product.owner && String(user.id) === String(product.owner) ? (
            <button className="btn btn-danger" onClick={async()=>{
              if(!confirm('Delete this sneaker from your listings?')) return
              await api.del(`/products/${id}`)
              window.history.back()
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>
              </svg>
              Delete
            </button>
          ) : null}
        </div>

        <div className="form" style={{marginTop:16}}>
          <h3 style={{marginTop:0}}>Rating Breakdown</h3>
          <div className="breakdown">
            {[5,4,3,2,1].map(star=> (
              <div className="row" key={star} style={{gap:10}}>
                <span style={{width:20}}>{star}</span>
                <div className="bar" style={{flex:1}}><span style={{width: breakdownPercents[star]+"%"}}/></div>
                <span className="badge">{summary.breakdown?.[star] || 0}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space"/>
        <ReviewForm productId={id} onSubmitted={load} />
        <div className="space"/>
        <ReviewList reviews={reviews} />
      </div>
    </div>
  )
}
