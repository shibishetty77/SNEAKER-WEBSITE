import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'

export default function LoginPage(){
  const { login, loading } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = async (e)=>{
    e.preventDefault()
    const res = await login(email, password)
    if(!res.ok){ setError(res.message); return }
    nav('/')
  }

  return (
    <div className="container" style={{maxWidth:420}}>
      <form className="form" onSubmit={submit}>
        <h2 style={{marginTop:0}}>Login</h2>
        {error && <div className="badge" style={{color:'#ff8383'}}>{error}</div>}
        <div className="space"/>
        <label>Email</label>
        <input className="input" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com"/>
        <div className="space"/>
        <label>Password</label>
        <input className="input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••"/>
        <div className="space"/>
        <button className="btn" disabled={loading}>{loading? 'Logging in...':'Login'}</button>
        <div className="space"/>
        <div className="badge">No account? <Link to="/signup" style={{color:'var(--green)'}}>Sign up</Link></div>
      </form>
    </div>
  )
}
