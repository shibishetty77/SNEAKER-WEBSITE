import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, Float } from '@react-three/drei'
import * as THREE from 'three'

function Shoe({ colors }) {
  const shoeRef = useRef()
  
  // Create animated color materials with smooth transitions
  const materials = useMemo(() => ({
    base: new THREE.MeshStandardMaterial({ 
      roughness: 0.3, 
      metalness: 0.2,
      color: new THREE.Color(colors.base)
    }),
    toe: new THREE.MeshStandardMaterial({ 
      roughness: 0.3, 
      metalness: 0.2,
      color: new THREE.Color(colors.toe)
    }),
    tongue: new THREE.MeshStandardMaterial({ 
      roughness: 0.5, 
      metalness: 0.1,
      color: new THREE.Color(colors.tongue)
    }),
    sides: new THREE.MeshStandardMaterial({ 
      roughness: 0.4, 
      metalness: 0.1,
      color: new THREE.Color(colors.sides)
    }),
    sole: new THREE.MeshStandardMaterial({ 
      roughness: 0.7, 
      metalness: 0.05,
      color: new THREE.Color(colors.sole)
    }),
    heel: new THREE.MeshStandardMaterial({ 
      roughness: 0.3, 
      metalness: 0.2,
      color: new THREE.Color(colors.heel)
    }),
    logo: new THREE.MeshStandardMaterial({ 
      roughness: 0.2, 
      metalness: 0.6,
      emissiveIntensity: 0.2,
      color: new THREE.Color(colors.logo),
      emissive: new THREE.Color(colors.logo)
    }),
    laces: new THREE.MeshStandardMaterial({ 
      roughness: 0.8,
      color: new THREE.Color(colors.laces)
    })
  }), [])
  
  // Smooth color transitions
  useFrame((state, delta) => {
    if (shoeRef.current) {
      shoeRef.current.rotation.y += delta * 0.2
    }
    
    // Animate color changes smoothly
    Object.keys(materials).forEach(key => {
      const targetColor = new THREE.Color(colors[key])
      materials[key].color.lerp(targetColor, 0.1)
      if (key === 'logo') {
        materials[key].emissive.lerp(targetColor, 0.1)
      }
    })
  })

  return (
    <group ref={shoeRef} position={[0, -0.5, 0]}>
      {/* Shoe Base/Body */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[2, 0.6, 3]} />
        <primitive object={materials.base} attach="material" />
      </mesh>

      {/* Shoe Front Toe */}
      <mesh position={[0, 0.5, 1.7]} rotation={[Math.PI / 6, 0, 0]} castShadow>
        <sphereGeometry args={[0.5, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <primitive object={materials.toe} attach="material" />
      </mesh>

      {/* Shoe Tongue */}
      <mesh position={[0, 1, 0.2]} rotation={[-0.3, 0, 0]} castShadow>
        <boxGeometry args={[0.8, 0.6, 0.4]} />
        <primitive object={materials.tongue} attach="material" />
      </mesh>

      {/* Left Side Panel */}
      <mesh position={[-1.05, 0.5, 0]} castShadow>
        <boxGeometry args={[0.1, 0.8, 2.5]} />
        <primitive object={materials.sides} attach="material" />
      </mesh>

      {/* Right Side Panel */}
      <mesh position={[1.05, 0.5, 0]} castShadow>
        <boxGeometry args={[0.1, 0.8, 2.5]} />
        <primitive object={materials.sides} attach="material" />
      </mesh>

      {/* Sole */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.3, 3.2]} />
        <primitive object={materials.sole} attach="material" />
      </mesh>

      {/* Heel */}
      <mesh position={[0, 0.3, -1.3]} castShadow>
        <boxGeometry args={[1.8, 0.9, 0.6]} />
        <primitive object={materials.heel} attach="material" />
      </mesh>

      {/* Logo/Swoosh - Left Side */}
      <mesh position={[-1.1, 0.7, 0.3]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <coneGeometry args={[0.3, 1, 3]} />
        <primitive object={materials.logo} attach="material" />
      </mesh>

      {/* Logo/Swoosh - Right Side */}
      <mesh position={[1.1, 0.7, 0.3]} rotation={[0, -Math.PI / 2, 0]} castShadow>
        <coneGeometry args={[0.3, 1, 3]} />
        <primitive object={materials.logo} attach="material" />
      </mesh>

      {/* Laces */}
      {[0, 0.4, 0.8].map((z, i) => (
        <group key={i} position={[0, 1.1, z - 0.2]}>
          <mesh position={[-0.3, 0, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
            <primitive object={materials.laces} attach="material" />
          </mesh>
          <mesh position={[0.3, 0, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
            <primitive object={materials.laces} attach="material" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export default function ShoeCustomizer3D({ colors, autoRotate = true }) {
  return (
    <div style={{ width: '100%', height: '500px', background: 'transparent' }}>
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[5, 3, 5]} />
        <OrbitControls 
          enablePan={false}
          minDistance={4}
          maxDistance={12}
          autoRotate={autoRotate}
          autoRotateSpeed={2}
        />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#00ff88" />
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={1}
          intensity={0.5}
          castShadow
        />
        
        {/* Environment for reflections */}
        <Environment preset="studio" />
        
        {/* Ground Plane */}
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, 0]}>
          <planeGeometry args={[20, 20]} />
          <shadowMaterial opacity={0.3} />
        </mesh>

        {/* The Shoe */}
        <Shoe colors={colors} />
      </Canvas>
    </div>
  )
}
