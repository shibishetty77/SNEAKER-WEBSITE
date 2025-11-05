import { Link } from 'react-router-dom'
import RatingStars from './RatingStars'

export default function ProductCard({ product, onAdd, onDelete, showDelete }){
  const avgRating = product?.avgRating || 0
  const reviewCount = product?.reviewCount || 0
  
  return (
    <div className="card fade-in">
      <Link to={`/product/${product._id}`}>
        <div style={{position:'relative',overflow:'hidden',borderRadius:'var(--radius-lg)'}}>
        <img src={product.images?.[0] || 'https://picsum.photos/600/400?blur=3'} alt={product.name} />
          {product.stock !== undefined && product.stock === 0 && (
            <div className="card-badge" style={{background:'#ff4444',top:12,left:12,right:'auto'}}>
              Sold Out
            </div>
          )}
          {avgRating >= 4.5 && reviewCount > 0 && (
            <div className="card-badge" style={{background:'var(--primary)',top:12,left:12,right:'auto'}}>
              ⭐ Top Rated
            </div>
          )}
        </div>
      </Link>
      <div className="body">
        <div style={{marginBottom:12}}>
          <div style={{
            fontSize:11,
            textTransform:'uppercase',
            color:'var(--text-muted)',
            fontWeight:700,
            letterSpacing:1,
            marginBottom:6
          }}>
            {product.brand}
          </div>
          <Link to={`/product/${product._id}`} style={{textDecoration:'none',color:'inherit'}}>
            <h3 style={{
              margin:0,
              marginBottom:4,
              fontSize:18,
              fontWeight:700,
              lineHeight:1.3,
              transition:'color 0.2s ease'
            }}>{product.name}</h3>
          </Link>
          {product.colorway ? (
            <div style={{
              fontSize:13,
              color:'var(--text-secondary)',
              marginTop:4,
              marginBottom:8
            }}>
              {product.colorway}
            </div>
          ) : null}
          {avgRating > 0 && (
            <div style={{
              display:'flex',
              alignItems:'center',
              gap:6,
              marginTop:8,
              marginBottom:4
            }}>
              <RatingStars value={avgRating} />
              <span style={{
                fontSize:13,
                color:'var(--text-secondary)',
                fontWeight:600
              }}>
                {avgRating.toFixed(1)}
              </span>
              {reviewCount > 0 && (
                <span style={{
                  fontSize:12,
                  color:'var(--text-muted)'
                }}>
                  ({reviewCount})
                </span>
              )}
            </div>
          )}
        </div>
        <div className="row" style={{justifyContent:'space-between',alignItems:'center',marginTop:16}}>
          <div>
            <span className="price" style={{fontSize:22}}>₹{product.price?.toFixed(2)}</span>
            {product.stock !== undefined && product.stock > 0 && (
              <div style={{
                fontSize:11,
                color:'var(--primary)',
                marginTop:4,
                fontWeight:600,
                textTransform:'uppercase',
                letterSpacing:0.5
              }}>
                {product.stock} Available
              </div>
            )}
          </div>
          {showDelete ? (
            <button 
              className="btn btn-danger" 
              onClick={(e)=>{e.preventDefault();onDelete?.(product)}}
              style={{padding:'10px 14px'}}
              title="Delete sneaker"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>
              </svg>
            </button>
          ) : (
            <button 
              className="btn" 
              onClick={(e)=>{e.preventDefault();onAdd?.(product)}}
              disabled={product.stock === 0}
              style={{
                padding:'12px 20px',
                fontSize:13,
                fontWeight:700
              }}
            >
              {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
