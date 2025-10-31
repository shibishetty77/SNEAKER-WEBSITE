import { Link } from 'react-router-dom'

export default function ProductCard({ product, onAdd, onDelete, showDelete }){
  return (
    <div className="card">
      <Link to={`/product/${product._id}`}>
        <img src={product.images?.[0] || 'https://picsum.photos/600/400?blur=3'} alt={product.name} />
      </Link>
      <div className="body">
        <div style={{marginBottom:12}}>
          <div style={{fontSize:11,textTransform:'uppercase',color:'var(--text-muted)',fontWeight:700,letterSpacing:1,marginBottom:4}}>{product.brand}</div>
          <h3>{product.name}</h3>
          {product.colorway ? <div style={{fontSize:14,color:'var(--text-secondary)',marginTop:4}}>{product.colorway}</div> : null}
        </div>
        <div className="row" style={{justifyContent:'space-between',marginTop:12}}>
          <span className="price">${product.price?.toFixed(2)}</span>
          {showDelete ? (
            <button 
              className="btn btn-danger" 
              onClick={(e)=>{e.preventDefault();onDelete?.(product)}}
              style={{padding:'10px 12px'}}
              title="Delete sneaker"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>
              </svg>
            </button>
          ) : (
            <button className="btn" onClick={(e)=>{e.preventDefault();onAdd?.(product)}}>Add</button>
          )}
        </div>
        {product.stock !== undefined ? <div style={{fontSize:12,color:product.stock > 0 ? 'var(--primary)' : '#ff4444',marginTop:8,fontWeight:600}}>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</div> : null}
      </div>
    </div>
  )
}
