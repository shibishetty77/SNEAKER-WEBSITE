import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'

export default function SignupPage(){
  const { signup, loading } = useAuth()
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = async (e)=>{
    e.preventDefault()
    if(password.length < 6){ setError('Password must be at least 6 characters'); return }
    const res = await signup(name, email, password)
    if(!res.ok){ setError(res.message); return }
    nav('/')
  }

  return (
    <div className="container" style={{maxWidth:420}}>
      <form className="form" onSubmit={submit}>
        <h2 style={{marginTop:0}}>Create account</h2>
        {error && <div className="badge" style={{color:'#ff8383'}}>{error}</div>}
        <div className="space"/>
        <label>Name</label>
        <input className="input" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Your name"/>
        <div className="space"/>
        <label>Email</label>
        <input className="input" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com"/>
        <div className="space"/>
        <label>Password</label>
        <input className="input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••"/>
        <div className="space"/>
        <button className="btn" disabled={loading}>{loading? 'Signing up...':'Sign up'}</button>
        <div className="space"/>
        <div className="badge">Have an account? <Link to="/login" style={{color:'var(--green)'}}>Login</Link></div>
      </form>
    </div>
  )
}
