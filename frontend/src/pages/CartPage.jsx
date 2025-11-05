import { useCart } from '../state/CartContext'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import api from '../utils/api'

export default function CartPage(){
  const { items, update, remove, total } = useCart()
  const [buying, setBuying] = useState(null)

  const handleBuy = async (item) => {
    const productId = item?.product?._id || item?.product || item?._id
    if (!productId) {
      alert('Invalid product')
      return
    }
    setBuying(productId)
    try {
      await api.post(`/products/${productId}/purchase`, { quantity: item?.quantity || 1 })
      alert(`Successfully purchased ${item?.product?.name || 'item'}!`)
      remove(String(productId))
    } catch (e) {
      alert(e.message || 'Purchase failed')
    } finally {
      setBuying(null)
    }
  }

  if(!items.length){
    return (
      <div className="container">
        <div style={{marginBottom:32}}>
          <h1 style={{fontSize:42,fontWeight:900,margin:0,marginBottom:8}}>Shopping Cart</h1>
          <p style={{color:'var(--text-secondary)',fontSize:16}}>Review your selected sneakers</p>
        </div>
        <div className="form" style={{textAlign:'center',padding:60}}>
          <div style={{fontSize:48,marginBottom:16}}>🛒</div>
          <p style={{marginBottom:20}}>Your cart is empty.</p>
          <Link to="/" className="btn" style={{textDecoration:'none'}}>Browse Sneakers</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div style={{marginBottom:32}}>
        <h1 style={{fontSize:42,fontWeight:900,margin:0,marginBottom:8}}>Shopping Cart</h1>
        <p style={{color:'var(--text-secondary)',fontSize:16}}>{items.length} {items.length === 1 ? 'item' : 'items'} in your cart</p>
      </div>
      
      <div style={{display:'grid',gap:20}}>
        {items.map((it, idx)=> {
          const productId = it?.product?._id || it?.product || it?._id || `item-${idx}`
          const product = it?.product || {}
          const price = it?.price || product?.price || 0
          const quantity = it?.quantity || 0
          
          return (
          <div key={productId} className="cart-item-card">
            <Link to={`/product/${productId}`} className="cart-item-image">
              <img 
                src={product?.images?.[0] || 'https://picsum.photos/400/400?blur=3'} 
                alt={product?.name || 'item'}
              />
            </Link>
            <div className="cart-item-details">
              <div>
                <div style={{fontSize:11,textTransform:'uppercase',color:'var(--text-muted)',fontWeight:700,letterSpacing:1,marginBottom:4}}>
                  {product?.brand || 'Unknown Brand'}
                </div>
                <Link to={`/product/${productId}`} style={{textDecoration:'none',color:'inherit'}}>
                  <h3 style={{fontSize:20,fontWeight:700,margin:'0 0 4px 0'}}>{product?.name || 'Item'}</h3>
                </Link>
                {product?.colorway ? (
                  <div style={{fontSize:14,color:'var(--text-secondary)',marginBottom:8}}>
                    {product.colorway}
                  </div>
                ) : null}
                <div style={{fontSize:14,color:'var(--text-secondary)',marginTop:8}}>
                  <span className="badge">₹{Number(price).toFixed(2)} each</span>
                </div>
              </div>
              <div className="cart-item-actions">
                <div className="row" style={{gap:8,marginBottom:12}}>
                  <label style={{margin:0,fontSize:14}}>Qty:</label>
                  <input 
                    className="input" 
                    type="number" 
                    min={1} 
                    max={product?.stock || 999}
                    value={quantity} 
                    onChange={(e)=>update(String(productId), Number(e.target.value))} 
                    style={{width:80,padding:'8px 12px'}}
                  />
                </div>
                <div className="row" style={{gap:8}}>
                  <button 
                    className="btn"
                    onClick={()=>handleBuy(it)}
                    disabled={buying === productId}
                    style={{flex:1}}
                  >
                    {buying === productId ? 'Processing...' : 'Buy Now'}
                  </button>
                  <button 
                    className="btn btn-danger" 
                    onClick={()=>{
                      if(confirm(`Remove ${product?.name || 'item'} from cart?`)){
                        remove(String(productId))
                      }
                    }}
                    style={{padding:'12px 16px'}}
                    title="Remove from cart"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="cart-item-total">
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:13,color:'var(--text-secondary)',marginBottom:6}}>Subtotal</div>
                <div className="price" style={{fontSize:24}}>₹{(price * quantity).toFixed(2)}</div>
              </div>
            </div>
          </div>
        )})}
      </div>
      
      <div className="cart-summary">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
          <div>
            <div style={{fontSize:14,color:'var(--text-secondary)',marginBottom:4}}>Total Items</div>
            <div style={{fontSize:18,fontWeight:700}}>{Array.isArray(items) ? items.reduce((sum,i)=>sum+(i?.quantity||0),0) : 0}</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:14,color:'var(--text-secondary)',marginBottom:4}}>Grand Total</div>
            <div className="price" style={{fontSize:32}}>₹{total.toFixed(2)}</div>
          </div>
        </div>
        <button className="btn" style={{width:'100%',padding:16,fontSize:16}}>Proceed to Checkout</button>
      </div>

      <style>{`
        .cart-item-card {
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 20px;
          display: grid;
          grid-template-columns: 140px 1fr auto;
          gap: 24px;
          align-items: start;
          transition: all 0.3s ease;
        }

        .cart-item-card:hover {
          border-color: var(--primary);
          box-shadow: 0 8px 24px var(--shadow);
        }

        .cart-item-image {
          display: block;
          border-radius: var(--radius-md);
          overflow: hidden;
          width: 140px;
          height: 140px;
        }

        .cart-item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .cart-item-image:hover img {
          transform: scale(1.1);
        }

        .cart-item-details {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 140px;
        }

        .cart-item-total {
          display: flex;
          align-items: center;
        }

        .cart-summary {
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 32px;
          margin-top: 32px;
          box-shadow: 0 8px 24px var(--shadow);
        }

        @media (max-width: 768px) {
          .cart-item-card {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .cart-item-image {
            width: 100%;
            height: 200px;
          }

          .cart-item-total {
            justify-content: flex-start;
          }

          .cart-item-actions {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  )
}
