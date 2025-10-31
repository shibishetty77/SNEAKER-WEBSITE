import { useState } from 'react'
import api from '../utils/api.js'
import { useAuth } from '../state/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

export default function SellPage(){
  const { user } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState({ name:'', model:'', colorway:'', description:'', price: '', brand:'nike', stock: 1, condition: 'new', category:'lifestyle', releaseDate:'', images:'', sizes:'' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const onChange = (e)=> setForm(f=> ({...f, [e.target.name]: e.target.value}))

  const submit = async (e)=>{
    e.preventDefault()
    setSaving(true)
    setError('')
    try{
      const payload = {
        name: form.name,
        model: form.model,
        colorway: form.colorway,
        description: form.description,
        price: Number(form.price),
        brand: form.brand,
        stock: Number(form.stock||0),
        condition: form.condition,
        category: form.category,
        releaseDate: form.releaseDate ? new Date(form.releaseDate) : undefined,
        images: form.images ? form.images.split(',').map(s=>s.trim()).filter(Boolean) : [],
        sizes: form.sizes ? form.sizes.split(',').map(s=>s.trim()).filter(Boolean) : []
      }
      const created = await api.post('/products', payload)
      nav(`/product/${created._id}`)
    }catch(e){
      setError(e?.message || 'Failed to create product')
    }finally{
      setSaving(false)
    }
  }

  if(!user){
    return <div className="container">Please login to sell a product.</div>
  }

  return (
    <div className="container">
      <div style={{marginBottom:32}}>
        <h1 style={{fontSize:42,fontWeight:900,margin:0,marginBottom:8}}>List Your Sneakers</h1>
        <p style={{color:'var(--text-secondary)',fontSize:16}}>Sell your kicks to sneakerheads worldwide</p>
      </div>
      {error ? <div className="alert">{error}</div> : null}
      <form onSubmit={submit} className="form" style={{maxWidth:800}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
          <div>
            <label>Sneaker Name</label>
            <input className="input" name="name" placeholder="Air Jordan 1 Retro High" value={form.name} onChange={onChange} required />
          </div>
          <div>
            <label>Model</label>
            <input className="input" name="model" placeholder="Air Jordan 1" value={form.model} onChange={onChange} required />
          </div>
        </div>

        <label>Colorway</label>
        <input className="input" name="colorway" placeholder="Bred Toe, Chicago, etc." value={form.colorway} onChange={onChange} required />

        <label>Description</label>
        <textarea className="input" name="description" placeholder="Detailed description of the sneakers..." value={form.description} onChange={onChange} required rows={4} />

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
          <div>
            <label>Price (USD)</label>
            <input className="input" name="price" type="number" min={0} step="0.01" placeholder="170" value={form.price} onChange={onChange} required />
          </div>
          <div>
            <label>Stock Quantity</label>
            <input className="input" name="stock" type="number" min={0} placeholder="1" value={form.stock} onChange={onChange} />
          </div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
          <div>
            <label>Brand</label>
            <select className="input" name="brand" value={form.brand} onChange={onChange} required>
              <option value="nike">Nike</option>
              <option value="adidas">Adidas</option>
              <option value="puma">Puma</option>
              <option value="newbalance">New Balance</option>
              <option value="underarmour">Under Armour</option>
            </select>
          </div>
          <div>
            <label>Condition</label>
            <select className="input" name="condition" value={form.condition} onChange={onChange} required>
              <option value="new">Brand New</option>
              <option value="used-like-new">Used - Like New</option>
              <option value="used-good">Used - Good</option>
              <option value="used-fair">Used - Fair</option>
            </select>
          </div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
          <div>
            <label>Category</label>
            <select className="input" name="category" value={form.category} onChange={onChange}>
              <option value="lifestyle">Lifestyle</option>
              <option value="basketball">Basketball</option>
              <option value="running">Running</option>
              <option value="skateboarding">Skateboarding</option>
              <option value="training">Training</option>
            </select>
          </div>
          <div>
            <label>Release Date (Optional)</label>
            <input className="input" name="releaseDate" type="date" value={form.releaseDate} onChange={onChange} />
          </div>
        </div>

        <label>Image URLs (comma separated)</label>
        <input className="input" name="images" placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg" value={form.images} onChange={onChange} />

        <label>Available Sizes (comma separated)</label>
        <input className="input" name="sizes" placeholder="7, 7.5, 8, 8.5, 9, 9.5, 10" value={form.sizes} onChange={onChange} />

        <div className="row" style={{gap:10,marginTop:24}}>
          <button className="btn" type="submit" disabled={saving}>{saving?'Listing...':'List Sneakers'}</button>
          <button className="btn btn-outline" type="button" onClick={()=>nav('/')}>Cancel</button>
        </div>
      </form>
    </div>
  )
}
