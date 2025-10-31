const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const API = `${BASE}/api`
let bearer = null

const handle = async (path, options = {}) => {
  const res = await fetch(`${API}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
      ...(options.headers || {})
    },
    credentials: 'include',
    ...options
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.message || 'Request failed')
  return data
}

export default {
  setToken: (t) => (bearer = t),
  get: (p) => handle(p),
  post: (p, body) => handle(p, { method: 'POST', body: JSON.stringify(body) }),
  put: (p, body) => handle(p, { method: 'PUT', body: JSON.stringify(body) }),
  del: (p) => handle(p, { method: 'DELETE' })
}
