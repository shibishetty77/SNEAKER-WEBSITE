export default function RatingStars({ value=0 }){
  const full = Math.round(value)
  return (
    <span className="stars" aria-label={`${value} stars`}>
      {'★★★★★'.split('').map((s,i)=> (
        <span key={i} style={{opacity: i < full ? 1 : .25}}>★</span>
      ))}
    </span>
  )
}
