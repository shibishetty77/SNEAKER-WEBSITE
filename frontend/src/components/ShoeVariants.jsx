import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Running Shoe - Athletic, Low Profile
export function RunningShoe({ colors, materials }) {
  const shoeRef = useRef()
  
  useFrame((state, delta) => {
    if (shoeRef.current) {
      shoeRef.current.rotation.y += delta * 0.2
    }
  })

  return (
    <group ref={shoeRef} position={[0, -0.5, 0]} scale={[0.75, 0.75, 0.75]}>
      {/* Lightweight Running Sole */}
      <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.7, 0.12, 3.8]} />
        <primitive object={materials.sole} attach="material" />
      </mesh>
      <mesh position={[0, 0.08, 2.0]} castShadow>
        <sphereGeometry args={[0.85, 32, 32, 0, Math.PI * 2, 0, Math.PI / 3]} />
        <primitive object={materials.sole} attach="material" />
      </mesh>

      {/* Breathable Mesh Upper */}
      <mesh position={[0, 0.5, 0.4]} castShadow>
        <boxGeometry args={[1.5, 0.35, 2.9]} />
        <primitive object={materials.base} attach="material" />
      </mesh>

      {/* Aerodynamic Toe */}
      <mesh position={[0, 0.52, 1.8]} rotation={[0.2, 0, 0]} castShadow>
        <sphereGeometry args={[0.75, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2.5]} />
        <primitive object={materials.toe} attach="material" />
      </mesh>

      {/* Side Stripes */}
      {[-0.76, 0.76].map((x, idx) => (
        <group key={idx}>
          <mesh position={[x, 0.55, 0.5]} rotation={[0, idx === 0 ? Math.PI / 2 : -Math.PI / 2, 0]} castShadow>
            <boxGeometry args={[2.2, 0.15, 0.04]} />
            <primitive object={materials.logo} attach="material" />
          </mesh>
        </group>
      ))}

      {/* Minimal Heel Counter */}
      <mesh position={[0, 0.65, -1.4]} castShadow>
        <cylinderGeometry args={[0.7, 0.75, 0.8, 32]} />
        <primitive object={materials.heel} attach="material" />
      </mesh>

      {/* Quick Lace System */}
      {[-0.3, 0.1, 0.5, 0.9].map((z, i) => (
        <group key={i}>
          <mesh position={[-0.35, 0.85 + i * 0.08, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.05, 0.02, 12, 24]} />
            <primitive object={materials.laces} attach="material" />
          </mesh>
          <mesh position={[0.35, 0.85 + i * 0.08, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.05, 0.02, 12, 24]} />
            <primitive object={materials.laces} attach="material" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// Basketball Shoe - High Top, Chunky
export function BasketballShoe({ colors, materials }) {
  const shoeRef = useRef()
  
  useFrame((state, delta) => {
    if (shoeRef.current) {
      shoeRef.current.rotation.y += delta * 0.2
    }
  })

  return (
    <group ref={shoeRef} position={[0, -0.5, 0]} scale={[0.8, 0.8, 0.8]}>
      {/* Thick Cushioned Sole */}
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.0, 0.3, 3.4]} />
        <primitive object={materials.sole} attach="material" />
      </mesh>
      <mesh position={[0, 0.18, 1.7]} castShadow>
        <sphereGeometry args={[1.0, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2.5]} />
        <primitive object={materials.sole} attach="material" />
      </mesh>

      {/* Mid Section - Support */}
      <mesh position={[0, 0.6, 0.2]} castShadow>
        <boxGeometry args={[1.85, 0.6, 2.8]} />
        <primitive object={materials.base} attach="material" />
      </mesh>

      {/* High Top Collar */}
      <mesh position={[0, 1.3, -0.5]} castShadow>
        <cylinderGeometry args={[0.85, 0.9, 1.2, 32]} />
        <primitive object={materials.base} attach="material" />
      </mesh>

      {/* Ankle Padding - Left */}
      <mesh position={[-0.75, 1.5, -0.6]} rotation={[0, 0, 0.1]} castShadow>
        <torusGeometry args={[0.3, 0.18, 16, 32, Math.PI * 1.3]} />
        <primitive object={materials.tongue} attach="material" />
      </mesh>

      {/* Ankle Padding - Right */}
      <mesh position={[0.75, 1.5, -0.6]} rotation={[0, 0, -0.1]} castShadow>
        <torusGeometry args={[0.3, 0.18, 16, 32, Math.PI * 1.3]} />
        <primitive object={materials.tongue} attach="material" />
      </mesh>

      {/* Reinforced Toe Cap */}
      <mesh position={[0, 0.7, 1.5]} castShadow>
        <sphereGeometry args={[0.9, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <primitive object={materials.toe} attach="material" />
      </mesh>

      {/* Side Panels with Texture */}
      {[-0.93, 0.93].map((x, idx) => (
        <mesh key={idx} position={[x, 0.8, 0.3]} rotation={[0, idx === 0 ? 0 : Math.PI, 0]} castShadow>
          <cylinderGeometry args={[0.6, 0.65, 2.2, 32, 1, false, 0, Math.PI]} />
          <primitive object={materials.sides} attach="material" />
        </mesh>
      ))}

      {/* Strap Detail */}
      <mesh position={[0, 1.1, -0.2]} rotation={[0, 0, 0]} castShadow>
        <boxGeometry args={[2.0, 0.25, 0.1]} />
        <primitive object={materials.logo} attach="material" />
      </mesh>

      {/* Logo Badge */}
      <mesh position={[0, 1.6, -0.9]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.08, 32]} />
        <primitive object={materials.logo} attach="material" />
      </mesh>
    </group>
  )
}

// Casual Sneaker - Skate Style
export function CasualSneaker({ colors, materials }) {
  const shoeRef = useRef()
  
  useFrame((state, delta) => {
    if (shoeRef.current) {
      shoeRef.current.rotation.y += delta * 0.2
    }
  })

  return (
    <group ref={shoeRef} position={[0, -0.5, 0]} scale={[0.75, 0.75, 0.75]}>
      {/* Flat Vulcanized Sole */}
      <mesh position={[0, 0.08, 0.1]} castShadow receiveShadow>
        <boxGeometry args={[1.95, 0.16, 3.5]} />
        <primitive object={materials.sole} attach="material" />
      </mesh>
      <mesh position={[0, 0.1, 1.85]} castShadow>
        <sphereGeometry args={[0.98, 32, 32, 0, Math.PI * 2, 0, Math.PI / 3.5]} />
        <primitive object={materials.sole} attach="material" />
      </mesh>

      {/* Canvas Upper - Low Profile */}
      <mesh position={[0, 0.45, 0.3]} castShadow>
        <boxGeometry args={[1.8, 0.5, 3.0]} />
        <primitive object={materials.base} attach="material" />
      </mesh>

      {/* Round Toe Cap */}
      <mesh position={[0, 0.5, 1.65]} castShadow>
        <sphereGeometry args={[0.9, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2.3]} />
        <primitive object={materials.toe} attach="material" />
      </mesh>

      {/* Side Stripe */}
      <mesh position={[-0.91, 0.5, 0.4]} castShadow>
        <boxGeometry args={[0.04, 0.5, 2.8]} />
        <primitive object={materials.logo} attach="material" />
      </mesh>
      <mesh position={[0.91, 0.5, 0.4]} castShadow>
        <boxGeometry args={[0.04, 0.5, 2.8]} />
        <primitive object={materials.logo} attach="material" />
      </mesh>

      {/* Heel Tab */}
      <mesh position={[0, 0.75, -1.3]} castShadow>
        <boxGeometry args={[1.8, 0.8, 0.3]} />
        <primitive object={materials.heel} attach="material" />
      </mesh>

      {/* Simple Lacing */}
      {[-0.4, 0, 0.4, 0.8].map((z, i) => (
        <group key={i}>
          {[-0.4, 0.4].map((x, j) => (
            <mesh key={j} position={[x, 0.75 + i * 0.1, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <torusGeometry args={[0.055, 0.025, 12, 24]} />
              <primitive object={materials.sides} attach="material" />
            </mesh>
          ))}
          {i < 3 && (
            <mesh position={[0, 0.79 + i * 0.1, z + 0.15]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.022, 0.022, 0.8, 8]} />
              <primitive object={materials.laces} attach="material" />
            </mesh>
          )}
        </group>
      ))}
    </group>
  )
}

// Hiking Boot - Rugged, High Ankle
export function HikingBoot({ colors, materials }) {
  const shoeRef = useRef()
  
  useFrame((state, delta) => {
    if (shoeRef.current) {
      shoeRef.current.rotation.y += delta * 0.2
    }
  })

  return (
    <group ref={shoeRef} position={[0, -0.5, 0]} scale={[0.78, 0.78, 0.78]}>
      {/* Heavy Tread Sole */}
      <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.95, 0.24, 3.3]} />
        <primitive object={materials.sole} attach="material" />
      </mesh>

      {/* Tread Pattern */}
      {[-1.2, -0.4, 0.4, 1.2].map((z, i) => (
        <mesh key={i} position={[0, 0.02, z]} castShadow receiveShadow>
          <boxGeometry args={[1.7, 0.05, 0.3]} />
          <primitive object={materials.sole} attach="material" />
        </mesh>
      ))}

      {/* Durable Upper */}
      <mesh position={[0, 0.7, 0.1]} castShadow>
        <boxGeometry args={[1.85, 0.8, 2.8]} />
        <primitive object={materials.base} attach="material" />
      </mesh>

      {/* High Ankle Support */}
      <mesh position={[0, 1.4, -0.5]} castShadow>
        <cylinderGeometry args={[0.9, 0.95, 1.1, 32]} />
        <primitive object={materials.base} attach="material" />
      </mesh>

      {/* Reinforced Toe */}
      <mesh position={[0, 0.6, 1.5]} castShadow>
        <boxGeometry args={[1.85, 0.6, 0.6]} />
        <primitive object={materials.toe} attach="material" />
      </mesh>
      <mesh position={[0, 0.7, 1.8]} castShadow>
        <sphereGeometry args={[0.93, 32, 32, 0, Math.PI * 2, 0, Math.PI / 3]} />
        <primitive object={materials.toe} attach="material" />
      </mesh>

      {/* Heel Counter */}
      <mesh position={[0, 0.9, -1.25]} castShadow>
        <cylinderGeometry args={[0.85, 0.9, 1.0, 32]} />
        <primitive object={materials.heel} attach="material" />
      </mesh>

      {/* Lacing Hooks */}
      {[-0.6, -0.2, 0.2, 0.6, 1.0].map((z, i) => (
        <group key={i}>
          {[-0.45, 0.45].map((x, j) => (
            <mesh key={j} position={[x, 1.0 + i * 0.12, z]} castShadow>
              <cylinderGeometry args={[0.05, 0.05, 0.15, 8]} />
              <primitive object={materials.sides} attach="material" />
            </mesh>
          ))}
        </group>
      ))}

      {/* Protective Rand */}
      <mesh position={[0, 0.35, 0.1]} castShadow>
        <boxGeometry args={[1.9, 0.15, 3.1]} />
        <primitive object={materials.sides} attach="material" />
      </mesh>
    </group>
  )
}
