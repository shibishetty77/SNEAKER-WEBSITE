import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

function AnimatedShoe() {
  const groupRef = useRef()
  
  // Initialize materials with colors matching the theme
  const materials = useRef({
    base: new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#1a1a1a'), // Dark panel color
      metalness: 0.4,
      roughness: 0.3,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
      emissive: new THREE.Color('#0a0a0a'),
      emissiveIntensity: 0.1,
    }),
    sole: new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#0a0a0a'), // Darkest background color
      metalness: 0.2,
      roughness: 0.9,
      emissive: new THREE.Color('#000000'),
    }),
    accent: new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#00ff88'), // Primary green
      metalness: 0.6,
      roughness: 0.15,
      emissive: new THREE.Color('#00ff88'),
      emissiveIntensity: 0.8,
    })
  })
  
  // Cleanup function to dispose materials
  useEffect(() => {
    return () => {
      if (materials.current) {
        Object.values(materials.current).forEach(material => {
          if (material && material.dispose) {
            material.dispose()
          }
        })
      }
    }
  }, [])

  useFrame((state) => {
    // Guard against materials not being initialized yet
    if (!materials.current?.accent || !groupRef.current) return
    
    const time = state.clock.getElapsedTime()
    
    // Dynamic color shift effect for accent with subtle glow
    materials.current.accent.emissiveIntensity = 0.6 + Math.sin(time * 2) * 0.3
    
    // Subtle rotation animation
    groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.1
    
    // Subtle scale pulse for breathing effect
    const scale = 1 + Math.sin(time * 1.5) * 0.02
    groupRef.current.scale.set(scale * 0.8, scale * 0.8, scale * 0.8)
  })

  return (
    <Float
      speed={2}
      rotationIntensity={0.6}
      floatIntensity={0.8}
      floatingRange={[-0.1, 0.1]}
    >
      <group ref={groupRef} scale={[0.8, 0.8, 0.8]} position={[0, 0, 0]}>
        {/* Main Body */}
        <mesh castShadow receiveShadow position={[0, 0.5, 0.4]}>
          <boxGeometry args={[1.5, 0.35, 2.9]} />
          <primitive object={materials.current.base} attach="material" />
        </mesh>

        {/* Sole */}
        <mesh castShadow receiveShadow position={[0, 0.08, 0.1]}>
          <boxGeometry args={[1.9, 0.15, 3.6]} />
          <primitive object={materials.current.sole} attach="material" />
        </mesh>

        {/* Toe */}
        <mesh castShadow position={[0, 0.52, 1.8]} rotation={[0.2, 0, 0]}>
          <sphereGeometry args={[0.75, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2.5]} />
          <primitive object={materials.current.base} attach="material" />
        </mesh>

        {/* Accents */}
        {[-0.76, 0.76].map((x, idx) => (
          <mesh key={idx} position={[x, 0.55, 0.5]} rotation={[0, idx === 0 ? Math.PI / 2 : -Math.PI / 2, 0]} castShadow>
            <boxGeometry args={[2.2, 0.15, 0.04]} />
            <primitive object={materials.current.accent} attach="material" />
          </mesh>
        ))}
      </group>
    </Float>
  )
}

export default function ShoeAnimation3D() {
  return (
    <div className="shoe-3d-container" style={{ position: 'relative', width: '100%', height: '500px' }}>
      {/* Gradient overlay for seamless blending */}
      <div className="shoe-3d-gradient-overlay" />
      
      <Canvas 
        shadows 
        dpr={[1, 2]} 
        camera={{ position: [0, 1, 5], fov: 45 }}
        style={{ 
          width: '100%', 
          height: '100%',
          background: 'transparent',
          position: 'relative',
          zIndex: 0
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#0a0a0a', 0) // Match page background, fully transparent
          gl.alpha = true
          gl.powerPreference = "high-performance"
        }}
      >
        <color attach="background" args={['#0a0a0a']} />
        {/* Subtle fog matching page background */}
        <fog attach="fog" args={['#0a0a0a', 8, 18]} />
        
        {/* Key Light - warmer, matches page accent */}
        <spotLight
          position={[4, 6, 2]}
          angle={0.5}
          penumbra={0.7}
          intensity={1.2}
          color="#ffffff"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0001}
          shadow-camera-far={20}
        />
        
        {/* Fill Light - subtle blue tint */}
        <pointLight position={[-4, 2, -2]} intensity={0.5} color="#b0c4de" />
        
        {/* Primary Accent Light - green glow */}
        <pointLight position={[2, -1, -2]} intensity={0.6} color="#00ff88" />
        
        {/* Secondary Accent Light - opposite side */}
        <pointLight position={[-2, 1, 2]} intensity={0.3} color="#00ff88" />
        
        {/* Ground Plane for Shadow - subtle and blending */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
          <planeGeometry args={[50, 50]} />
          <shadowMaterial transparent opacity={0.15} />
        </mesh>
        
        <AnimatedShoe />
        
        {/* Custom environment with darker tones */}
        <Environment 
          preset="night" 
          background={false}
        />
        
        {/* Subtle ambient light matching page background */}
        <ambientLight intensity={0.15} color="#0a0a0a" />
      </Canvas>
      
      <div className="shoe-3d-text">
        <h2>Premium Sneakers</h2>
        <p>Curated Collection of Luxury Footwear</p>
      </div>

      <style>{`
        .shoe-3d-container {
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
        }
        
        .shoe-3d-gradient-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 30% 50%, rgba(0, 255, 136, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 70% 50%, rgba(0, 255, 136, 0.05) 0%, transparent 50%);
          pointer-events: none;
          z-index: 1;
          opacity: 0.6;
        }

        .shoe-3d-text {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          text-align: center;
          color: #ffffff;
          z-index: 10;
          pointer-events: none;
          padding: 32px 24px;
          background: linear-gradient(
            to top,
            rgba(10, 10, 10, 0.95) 0%,
            rgba(10, 10, 10, 0.7) 40%,
            transparent 100%
          );
          backdrop-filter: blur(8px);
        }

        .shoe-3d-text h2 {
          font-size: 2.5rem;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 3px;
          font-weight: 900;
          background: linear-gradient(135deg, var(--primary) 0%, #00a8ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 8px rgba(0, 255, 136, 0.3));
          animation: fadeInUp 1s ease-out 0.3s both;
        }

        .shoe-3d-text p {
          font-size: 1.1rem;
          margin: 12px 0 0;
          opacity: 0.85;
          color: var(--text-secondary);
          font-weight: 500;
          letter-spacing: 1px;
          animation: fadeInUp 1s ease-out 0.5s both;
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
            height: 400px;
            margin-bottom: 32px;
          }
          .shoe-3d-text {
            padding: 24px 20px;
          }
          .shoe-3d-text h2 {
            font-size: 1.8rem;
            letter-spacing: 2px;
          }
          .shoe-3d-text p {
            font-size: 0.9rem;
          }
        }
        
        @media (max-width: 480px) {
          .shoe-3d-container {
            height: 350px;
          }
          .shoe-3d-text h2 {
            font-size: 1.5rem;
            letter-spacing: 1px;
          }
          .shoe-3d-text p {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  )
}
