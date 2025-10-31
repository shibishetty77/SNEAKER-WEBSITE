import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../utils/api.js'
import { useAuth } from './AuthContext.jsx'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { token } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) { setItems([]); return }
    ;(async () => {
      try {
        setLoading(true)
        const res = await api.get('/cart')
        setItems(Array.isArray(res) ? res : [])
      } catch (e) {
        console.error('Cart load error:', e)
        setItems([])
      } finally {
        setLoading(false)
      }
    })()
  }, [token])

  const add = async (productId, quantity = 1) => {
    const res = await api.post('/cart', { productId, quantity })
    setItems(res)
  }
  const update = async (productId, quantity) => {
    const res = await api.put('/cart', { productId, quantity })
    setItems(res)
  }
  const remove = async (productId) => {
    const res = await api.del(`/cart/${productId}`)
    setItems(res)
  }

  const total = Array.isArray(items) ? items.reduce((sum, i) => sum + (i?.price || 0) * (i?.quantity || 0), 0) : 0

  return (
    <CartContext.Provider value={{ items, add, update, remove, total, loading }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
