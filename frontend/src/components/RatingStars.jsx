export default function RatingStars({ value=0, size=16 }){
  const full = Math.floor(value)
  const hasHalf = value % 1 >= 0.5
  const empty = 5 - full - (hasHalf ? 1 : 0)
  
  return (
    <span className="stars" aria-label={`${value} stars`} style={{display:'inline-flex',gap:2,alignItems:'center'}}>
      {Array(full).fill(0).map((_,i)=> (
        <span key={i} style={{color:'var(--primary)',fontSize:size,lineHeight:1}}>★</span>
      ))}
      {hasHalf && (
        <span style={{color:'var(--primary)',fontSize:size,lineHeight:1,opacity:0.7}}>★</span>
      )}
      {Array(empty).fill(0).map((_,i)=> (
        <span key={i} style={{color:'var(--text-muted)',fontSize:size,lineHeight:1,opacity:0.3}}>★</span>
      ))}
    </span>
  )
}
