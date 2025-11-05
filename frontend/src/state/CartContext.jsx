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
    try {
    const res = await api.post('/cart', { productId, quantity })
      setItems(Array.isArray(res) ? res : [])
    } catch (e) {
      console.error('Cart add error:', e)
      throw e
    }
  }
  const update = async (productId, quantity) => {
    try {
    const res = await api.put('/cart', { productId, quantity })
      setItems(Array.isArray(res) ? res : [])
    } catch (e) {
      console.error('Cart update error:', e)
      throw e
    }
  }
  const remove = async (productId) => {
    try {
    const res = await api.del(`/cart/${productId}`)
      setItems(Array.isArray(res) ? res : [])
    } catch (e) {
      console.error('Cart remove error:', e)
      throw e
    }
  }

  // Calculate total - handle both price directly on item and price from populated product
  const total = Array.isArray(items) 
    ? items.reduce((sum, i) => {
        const price = i?.price || i?.product?.price || 0
        const quantity = i?.quantity || 0
        return sum + (price * quantity)
      }, 0)
    : 0

  return (
    <CartContext.Provider value={{ items, add, update, remove, total, loading }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
