import RatingStars from './RatingStars'

export default function ReviewList({ reviews=[] }){
  if(!reviews.length) return <div className="badge">No reviews yet.</div>
  return (
    <div style={{display:'grid',gap:12}}>
      {reviews.map(r=> (
        <div key={r._id} className="form">
          <div className="row" style={{justifyContent:'space-between'}}>
            <strong>{r.userId?.name || 'User'}</strong>
            <span className="badge">{new Date(r.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="row" style={{gap:8}}>
            <RatingStars value={r.rating} />
            <span>{r.rating.toFixed(1)}</span>
          </div>
          {r.comment && <p style={{marginTop:8,color:'var(--muted)'}}>{r.comment}</p>}
        </div>
      ))}
    </div>
  )
}
