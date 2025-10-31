import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import CartPage from './pages/CartPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import SellPage from './pages/SellPage.jsx'
import MySneakersPage from './pages/MySneakersPage.jsx'
import CustomizerPage from './pages/CustomizerPage.jsx'

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/sell" element={<SellPage />} />
          <Route path="/my-sneakers" element={<MySneakersPage />} />
          <Route path="/customize" element={<CustomizerPage />} />
        </Routes>
      </main>
    </div>
  )
}
