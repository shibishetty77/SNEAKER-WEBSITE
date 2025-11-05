import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'
import { useCart } from '../state/CartContext.jsx'

export default function Navbar(){
  const { user, logout } = useAuth()
  const { items } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const count = Array.isArray(items) ? items.reduce((n,i)=>n+(i?.quantity||0),0) : 0
  
  return (
    <nav className="nav">
      <Link to="/" className="brand" onClick={()=>setMobileMenuOpen(false)}>SOLESPHERE</Link>
      
      {/* Mobile Menu Button */}
      <button 
        className="mobile-menu-btn"
        onClick={()=>setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {mobileMenuOpen ? (
            <path d="M18 6L6 18M6 6l12 12"/>
          ) : (
            <path d="M3 12h18M3 6h18M3 18h18"/>
          )}
        </svg>
      </button>
      
      <div className={`navlinks ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <NavLink to="/" end onClick={()=>setMobileMenuOpen(false)}>Browse</NavLink>
        <NavLink to="/customize" onClick={()=>setMobileMenuOpen(false)}>🎨 Customize</NavLink>
        {user ? (
          <>
            <NavLink to="/profile" onClick={()=>setMobileMenuOpen(false)}>👤 Profile</NavLink>
            <NavLink to="/sell" onClick={()=>setMobileMenuOpen(false)}>Sell</NavLink>
            <NavLink to="/my-sneakers" onClick={()=>setMobileMenuOpen(false)}>My Sneakers</NavLink>
            <button className="btn btn-outline" onClick={()=>{logout(); setMobileMenuOpen(false)}}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login" onClick={()=>setMobileMenuOpen(false)}>Login</NavLink>
            <NavLink to="/signup" onClick={()=>setMobileMenuOpen(false)}>Signup</NavLink>
          </>
        )}
        <NavLink to="/cart" onClick={()=>setMobileMenuOpen(false)}>
          Cart 
          {count > 0 && <span className="cart-pill">{count}</span>}
        </NavLink>
      </div>
      
      <style>{`
        .mobile-menu-btn {
          display: none;
          background: transparent;
          border: none;
          color: var(--text);
          cursor: pointer;
          padding: 8px;
          border-radius: var(--radius-sm);
          transition: background 0.2s ease;
        }
        
        .mobile-menu-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .navlinks {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(10, 10, 10, 0.95);
            backdrop-filter: blur(24px);
            border-bottom: 1px solid var(--border);
            flex-direction: column;
            align-items: stretch;
            padding: 16px;
            gap: 8px;
            transform: translateY(-100%);
            opacity: 0;
            pointer-events: none;
            transition: all 0.3s ease;
            box-shadow: 0 8px 32px var(--shadow);
          }
          
          .navlinks.mobile-open {
            transform: translateY(0);
            opacity: 1;
            pointer-events: all;
          }
          
          .navlinks a, .navlinks button {
            width: 100%;
            padding: 12px 16px;
            border-radius: var(--radius-sm);
          }
        }
      `}</style>
    </nav>
  )
}
