import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../utils/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(false)

  const login = async (email, password) => {
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email, password })
      setToken(res.token)
      localStorage.setItem('token', res.token)
      api.setToken(res.token)
      setUser(res.user)
      return { ok: true }
    } catch (e) {
      return { ok: false, message: e?.message || 'Login failed' }
    } finally {
      setLoading(false)
    }
  }

  const signup = async (name, email, password) => {
    setLoading(true)
    try {
      const res = await api.post('/auth/register', { name, email, password })
      setToken(res.token)
      localStorage.setItem('token', res.token)
      api.setToken(res.token)
      setUser(res.user)
      return { ok: true }
    } catch (e) {
      return { ok: false, message: e?.message || 'Signup failed' }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    api.setToken(null)
  }

  useEffect(() => {
    if (!token) return
    api.setToken(token)
    api.get('/auth/me')
      .then((res) => setUser(res.user))
      .catch(() => logout())
  }, [token])

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
