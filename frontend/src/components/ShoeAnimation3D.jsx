import { useEffect, useState } from 'react'

export default function ShoeAnimation3D() {
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 1) % 360)
    }, 30)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="shoe-3d-container">
      <div className="shoe-3d-scene">
        <div 
          className="shoe-3d" 
          style={{ 
            transform: `rotateY(${rotation}deg) rotateX(15deg)`
          }}
        >
          <div className="shoe-body">
            <div className="shoe-side shoe-left"></div>
            <div className="shoe-side shoe-right"></div>
            <div className="shoe-side shoe-top"></div>
            <div className="shoe-side shoe-bottom"></div>
            <div className="shoe-side shoe-front"></div>
            <div className="shoe-side shoe-back"></div>
          </div>
          <div className="shoe-sole"></div>
          <div className="shoe-swoosh"></div>
          <div className="glow-effect"></div>
        </div>
      </div>
      <div className="shoe-3d-text">
        <h2>Premium Sneakers</h2>
        <p>Curated Collection of Luxury Footwear</p>
      </div>

      <style>{`
        .shoe-3d-container {
          position: relative;
          width: 100%;
          max-width: 600px;
          margin: 0 auto 60px;
          padding: 60px 20px;
        }

        .shoe-3d-scene {
          perspective: 1000px;
          perspective-origin: 50% 50%;
          position: relative;
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .shoe-3d {
          position: relative;
          transform-style: preserve-3d;
          width: 280px;
          height: 180px;
          transition: transform 0.05s linear;
        }

        .shoe-body {
          position: absolute;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
        }

        .shoe-side {
          position: absolute;
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          border: 1px solid rgba(0, 255, 136, 0.3);
          box-shadow: 
            inset 0 0 30px rgba(0, 255, 136, 0.1),
            0 0 20px rgba(0, 255, 136, 0.2);
        }

        .shoe-left {
          width: 80px;
          height: 100%;
          transform: rotateY(90deg) translateZ(100px);
          border-radius: 40px 40px 0 0;
        }

        .shoe-right {
          width: 80px;
          height: 100%;
          transform: rotateY(-90deg) translateZ(180px);
          border-radius: 40px 40px 0 0;
        }

        .shoe-top {
          width: 280px;
          height: 80px;
          transform: rotateX(90deg) translateZ(90px);
          border-radius: 80px 80px 0 0;
          background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
        }

        .shoe-bottom {
          width: 280px;
          height: 80px;
          transform: rotateX(-90deg) translateZ(100px);
        }

        .shoe-front {
          width: 280px;
          height: 100%;
          transform: translateZ(40px);
          border-radius: 80px 80px 0 0;
          background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 50%, #2d2d2d 100%);
          box-shadow: inset 0 10px 40px rgba(0, 255, 136, 0.15);
        }

        .shoe-back {
          width: 280px;
          height: 100%;
          transform: translateZ(-40px) rotateY(180deg);
          border-radius: 80px 80px 0 0;
        }

        .shoe-sole {
          position: absolute;
          bottom: -15px;
          left: 50%;
          transform: translateX(-50%);
          width: 90%;
          height: 30px;
          background: linear-gradient(90deg, #00ff88 0%, #00cc6f 100%);
          border-radius: 140px;
          box-shadow: 
            0 5px 20px rgba(0, 255, 136, 0.5),
            inset 0 2px 10px rgba(255, 255, 255, 0.3);
          transform-style: preserve-3d;
        }

        .shoe-swoosh {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) translateZ(45px);
          width: 100px;
          height: 60px;
          background: linear-gradient(135deg, transparent 30%, #00ff88 30%, #00ff88 35%, transparent 35%);
          opacity: 0.8;
          filter: blur(0.5px);
          animation: pulse 2s ease-in-out infinite;
        }

        .glow-effect {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(0, 255, 136, 0.2) 0%, transparent 70%);
          pointer-events: none;
          animation: glow-pulse 3s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
            transform: translate(-50%, -50%) translateZ(45px) scale(1);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) translateZ(45px) scale(1.05);
          }
        }

        @keyframes glow-pulse {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }

        .shoe-3d-text {
          text-align: center;
          margin-top: 40px;
          animation: fadeInUp 1s ease-out;
        }

        .shoe-3d-text h2 {
          font-size: 36px;
          font-weight: 900;
          margin: 0 0 12px 0;
          background: linear-gradient(135deg, var(--primary) 0%, #00ffff 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .shoe-3d-text p {
          color: var(--text-secondary);
          font-size: 16px;
          margin: 0;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .shoe-3d-container {
            padding: 40px 20px;
          }
          .shoe-3d-scene {
            height: 200px;
          }
          .shoe-3d {
            width: 200px;
            height: 130px;
          }
          .shoe-3d-text h2 {
            font-size: 28px;
          }
          .shoe-3d-text p {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  )
}
