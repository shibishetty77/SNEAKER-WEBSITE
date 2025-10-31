import { NavLink, Link } from 'react-router-dom'

export default function Navbar(){
  return (
    <nav className="nav">
      <Link to="/" className="brand">SOLESPHERE</Link>
      <div className="navlinks">
        <NavLink to="/" end>Browse</NavLink>
        <NavLink to="/customize">🎨 Customize</NavLink>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/signup">Signup</NavLink>
        <NavLink to="/cart">Cart <span className="cart-pill">0</span></NavLink>
      </div>
    </nav>
  )
}
