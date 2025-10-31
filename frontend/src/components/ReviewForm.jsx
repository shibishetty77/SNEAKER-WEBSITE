import { useState } from 'react'
import { useAuth } from '../state/AuthContext'
import api from '../utils/api'

export default function ReviewForm({ productId, onSubmitted }){
  const { user } = useAuth()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  if(!user) return null

  const submit = async (e)=>{
    e.preventDefault()
    setLoading(true)
    setError('')
    try{
      await api.post('/reviews', { productId, rating: Number(rating), comment })
      setComment('')
      onSubmitted?.()
    }catch(e){
      setError(e.message)
    }finally{
      setLoading(false)
    }
  }

  return (
    <form className="form" onSubmit={submit}>
      <h3 style={{marginTop:0}}>Write a review</h3>
      {error && <div className="badge" style={{color:'#ff8383'}}>{error}</div>}
      <div className="space"/>
      <label>Rating</label>
      <select className="input" value={rating} onChange={(e)=>setRating(e.target.value)}>
        {[5,4,3,2,1].map(n=> <option key={n} value={n}>{n} Star{n>1?'s':''}</option>)}
      </select>
      <div className="space"/>
      <label>Comment</label>
      <textarea className="input" rows={4} value={comment} onChange={(e)=>setComment(e.target.value)} placeholder="Share your thoughts..."/>
      <div className="space"/>
      <button className="btn" disabled={loading}>{loading? 'Submitting...':'Submit Review'}</button>
    </form>
  )
}
