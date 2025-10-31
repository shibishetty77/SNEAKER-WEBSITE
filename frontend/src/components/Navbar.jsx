import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'
import { useCart } from '../state/CartContext.jsx'

export default function Navbar(){
  const { user, logout } = useAuth()
  const { items } = useCart()
  const count = Array.isArray(items) ? items.reduce((n,i)=>n+(i?.quantity||0),0) : 0
  return (
    <nav className="nav">
      <Link to="/" className="brand">SOLESPHERE</Link>
      <div className="navlinks">
        <NavLink to="/" end>Browse</NavLink>
        <NavLink to="/customize">🎨 Customize</NavLink>
        {user ? (
          <>
            <NavLink to="/sell">Sell</NavLink>
            <NavLink to="/my-sneakers">My Sneakers</NavLink>
            <span className="badge">Hi, {user.name}</span>
            <button className="btn btn-outline" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/signup">Signup</NavLink>
          </>
        )}
        <NavLink to="/cart">Cart <span className="cart-pill">{count}</span></NavLink>
      </div>
    </nav>
  )
}
