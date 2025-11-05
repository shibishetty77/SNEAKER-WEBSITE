import { useEffect, useRef, useState } from 'react'

export default function PremiumHero() {
  const canvasRef = useRef(null)
  const animationFrameRef = useRef(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let time = 0
    const particles = []
    
    // Set canvas size
    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Create floating particles
    const createParticles = () => {
      const particleCount = window.innerWidth > 768 ? 40 : 25
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.8,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.4 + 0.2,
          color: Math.random() > 0.75 ? '#00ff88' : '#00a8ff'
        })
      }
    }
    createParticles()

    // Mouse move handler
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      setMousePos({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height
      })
    }
    canvas.addEventListener('mousemove', handleMouseMove)

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 0.01

      // Draw gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width * 0.5 + Math.sin(time * 0.5) * 50,
        canvas.height * 0.4 + Math.cos(time * 0.3) * 30,
        0,
        canvas.width * 0.5,
        canvas.height * 0.5,
        canvas.width * 0.8
      )
      gradient.addColorStop(0, 'rgba(0, 255, 136, 0.1)')
      gradient.addColorStop(0.5, 'rgba(0, 168, 255, 0.05)')
      gradient.addColorStop(1, 'transparent')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw interactive glow
      if (mousePos.x > 0) {
        const glow = ctx.createRadialGradient(
          mousePos.x * canvas.width,
          mousePos.y * canvas.height,
          0,
          mousePos.x * canvas.width,
          mousePos.y * canvas.height,
          200
        )
        glow.addColorStop(0, 'rgba(0, 255, 136, 0.15)')
        glow.addColorStop(1, 'transparent')
        ctx.fillStyle = glow
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      // Update and draw particles
      particles.forEach(particle => {
        particle.x += particle.speedX
        particle.y += particle.speedY
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')
        ctx.fill()

        // Draw glow
        const glowGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 3
        )
        glowGradient.addColorStop(0, particle.color + '80')
        glowGradient.addColorStop(1, particle.color + '00')
        ctx.fillStyle = glowGradient
        ctx.fillRect(particle.x - particle.size * 3, particle.y - particle.size * 3, particle.size * 6, particle.size * 6)
      })

      // Draw flowing lines (optimized)
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.08)'
      ctx.lineWidth = 1
      ctx.lineCap = 'round'
      for (let i = 0; i < 3; i++) {
        ctx.beginPath()
        const y = (canvas.height / 4) * (i + 1)
        const offset = Math.sin(time * 0.5 + i) * 20
        ctx.moveTo(0, y + offset)
        
        for (let x = 0; x < canvas.width; x += 15) {
          const wave = Math.sin((x / canvas.width) * Math.PI * 2 + time * 1.5 + i) * 15
          ctx.lineTo(x, y + offset + wave)
        }
        ctx.stroke()
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', handleMouseMove)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [mousePos])

  return (
    <div className="premium-hero">
      <canvas 
        ref={canvasRef}
        className="premium-hero-canvas"
      />
      
      <div className="premium-hero-content">
        <div className="premium-hero-badge">
          <span className="badge-glow"></span>
          <span>PREMIUM COLLECTION</span>
        </div>
        
        <h1 className="premium-hero-title">
          <span className="title-line">SOLESPHERE</span>
          <span className="title-subtitle">Where Style Meets Excellence</span>
        </h1>
        
        <p className="premium-hero-description">
          Discover curated luxury footwear from the world's most iconic brands.
          Each pair tells a story of craftsmanship, innovation, and timeless design.
        </p>
        
        <div className="premium-hero-features">
          <div className="feature-item">
            <div className="feature-icon">✨</div>
            <span>Premium Quality</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🚀</div>
            <span>Fast Shipping</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🔒</div>
            <span>Secure Purchase</span>
          </div>
        </div>
      </div>

      <div className="premium-hero-decoration">
        <div className="decoration-circle circle-1"></div>
        <div className="decoration-circle circle-2"></div>
        <div className="decoration-circle circle-3"></div>
      </div>

      <style>{`
        .premium-hero {
          position: relative;
          width: 100%;
          height: 500px;
          margin: 0 auto 40px;
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: var(--bg);
          background-image: 
            radial-gradient(at 0% 0%, rgba(0, 255, 136, 0.05) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(0, 255, 136, 0.03) 0px, transparent 50%);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px var(--border), inset 0 0 60px rgba(0, 255, 136, 0.05);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .premium-hero-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .premium-hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          padding: 40px 24px;
          max-width: 800px;
          animation: fadeInUp 1s ease-out;
        }

        .premium-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 24px;
          background: rgba(0, 255, 136, 0.1);
          border: 1px solid rgba(0, 255, 136, 0.3);
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--primary);
          margin-bottom: 24px;
          position: relative;
          overflow: hidden;
        }

        .badge-glow {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.3), transparent);
          animation: shimmer 3s infinite;
        }

        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .premium-hero-title {
          margin: 0;
          margin-bottom: 16px;
        }

        .title-line {
          display: block;
          font-size: clamp(2.5rem, 8vw, 5rem);
          font-weight: 900;
          line-height: 1.1;
          background: linear-gradient(135deg, var(--primary) 0%, #00a8ff 50%, var(--primary) 100%);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift 5s ease infinite;
          letter-spacing: -2px;
          margin-bottom: 8px;
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .title-subtitle {
          display: block;
          font-size: clamp(1rem, 2vw, 1.5rem);
          font-weight: 500;
          color: var(--text-secondary);
          letter-spacing: 4px;
          text-transform: uppercase;
          margin-top: 8px;
          opacity: 0.9;
        }

        .premium-hero-description {
          font-size: clamp(0.9rem, 1.5vw, 1.1rem);
          color: var(--text-secondary);
          line-height: 1.8;
          margin: 24px 0 32px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          animation: fadeInUp 1s ease-out 0.3s both;
        }

        .premium-hero-features {
          display: flex;
          gap: 32px;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 40px;
          animation: fadeInUp 1s ease-out 0.6s both;
        }

        .feature-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 16px 24px;
          background: rgba(18, 18, 18, 0.6);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .feature-item:hover {
          border-color: var(--primary);
          background: rgba(0, 255, 136, 0.05);
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 255, 136, 0.2);
        }

        .feature-icon {
          font-size: 28px;
          filter: drop-shadow(0 0 8px rgba(0, 255, 136, 0.5));
          animation: float 3s ease-in-out infinite;
        }

        .feature-item:nth-child(2) .feature-icon {
          animation-delay: 0.3s;
        }

        .feature-item:nth-child(3) .feature-icon {
          animation-delay: 0.6s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .feature-item span {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .premium-hero-decoration {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          pointer-events: none;
        }

        .decoration-circle {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(0, 255, 136, 0.1);
          animation: pulse 4s ease-in-out infinite;
        }

        .circle-1 {
          width: 300px;
          height: 300px;
          top: -100px;
          right: -100px;
          animation-delay: 0s;
        }

        .circle-2 {
          width: 200px;
          height: 200px;
          bottom: -50px;
          left: -50px;
          animation-delay: 1s;
          border-color: rgba(0, 168, 255, 0.1);
        }

        .circle-3 {
          width: 150px;
          height: 150px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: 2s;
          border-color: rgba(0, 255, 136, 0.15);
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .premium-hero {
            height: 400px;
            margin-bottom: 32px;
          }

          .premium-hero-content {
            padding: 32px 20px;
          }

          .premium-hero-features {
            gap: 16px;
            margin-top: 24px;
          }

          .feature-item {
            padding: 12px 16px;
          }

          .circle-1 {
            width: 200px;
            height: 200px;
          }

          .circle-2 {
            width: 150px;
            height: 150px;
          }

          .circle-3 {
            width: 100px;
            height: 100px;
          }
        }

        @media (max-width: 480px) {
          .premium-hero {
            height: 350px;
          }

          .premium-hero-description {
            font-size: 0.85rem;
            margin: 16px 0 24px;
          }

          .premium-hero-features {
            flex-direction: column;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  )
}

