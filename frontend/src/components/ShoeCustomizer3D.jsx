import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Environment, 
  Float, 
  ContactShadows,
  useGLTF,
  useTexture,
  Sparkles
} from '@react-three/drei';
import * as THREE from 'three';
import api from '../utils/api';

function CategoryEffects({ variant }) {
  switch (variant) {
    case 'running':
      return (
        <>
          <Sparkles count={60} size={2} speed={2.5} opacity={0.35} color="#22d3ee" scale={[6, 3, 6]} position={[0, 0.5, 0]} />
          <mesh position={[0, -0.52, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.6, 0.9, 64]} />
            <meshBasicMaterial color="#22d3ee" transparent opacity={0.2} />
          </mesh>
        </>
      );
    case 'basketball':
      return (
        <>
          <Sparkles count={40} size={2.2} speed={1.6} opacity={0.35} color="#ff6b6b" scale={[5.5, 3, 5.5]} position={[0, 0.5, 0]} />
          <mesh position={[0, -0.52, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.65, 1.0, 64]} />
            <meshBasicMaterial color="#ff6b6b" transparent opacity={0.18} />
          </mesh>
        </>
      );
    case 'hiking':
      return (
        <>
          <Sparkles count={25} size={3} speed={0.4} opacity={0.25} color="#d4a574" scale={[6, 2.5, 6]} position={[0, 0.6, 0]} />
          <mesh position={[0, -0.53, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[1.1, 64]} />
            <meshStandardMaterial color="#2a2a2a" roughness={1} metalness={0} />
          </mesh>
        </>
      );
    case 'casual':
      return (
        <>
          <Sparkles count={30} size={2.2} speed={0.7} opacity={0.28} color="#00ff88" scale={[5.5, 3, 5.5]} position={[0, 0.6, 0]} />
          <mesh position={[0, -0.52, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.55, 0.85, 64]} />
            <meshBasicMaterial color="#00ff88" transparent opacity={0.12} />
          </mesh>
        </>
      );
    default:
      return (
        <>
          <Sparkles count={20} size={2} speed={0.6} opacity={0.22} color="#00ff88" scale={[5, 2.5, 5]} position={[0, 0.6, 0]} />
          <mesh position={[0, -0.52, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.5, 0.8, 64]} />
            <meshBasicMaterial color="#00ff88" transparent opacity={0.1} />
          </mesh>
        </>
      );
  }
}

/**
 * Enhanced 3D Shoe Component with GLB model loading
 * Supports real-time color customization and material changes
 */
function ShoeModel({ 
  colors, 
  material, 
  texture,
  variant = 'classic',
  onLoad 
}) {
  const groupRef = useRef();
  const gltfRef = useRef();
  
  // Try to load GLB model, fallback to procedural if not found
  const modelPath = `/models/shoe-${variant}.glb`;
  let gltf = null;
  try {
    gltf = useGLTF(modelPath, true);
  } catch (error) {
    console.warn(`Model not found at ${modelPath}, using procedural fallback`);
  }
  const hasModel = !!(gltf && gltf.scene);

  // Material properties based on selected material type
  const materialProps = useMemo(() => {
    const baseProps = {
      leather: {
        roughness: 0.45,
        metalness: 0.1,
        clearcoat: 0.9,
        clearcoatRoughness: 0.15,
        sheen: 0.4,
        sheenRoughness: 0.6
      },
      canvas: {
        roughness: 0.9,
        metalness: 0.02,
        clearcoat: 0.05,
        clearcoatRoughness: 0.7
      },
      mesh: {
        roughness: 0.5,
        metalness: 0.08,
        clearcoat: 0.25,
        clearcoatRoughness: 0.35,
        transmission: 0.12,
        thickness: 0.6
      },
      suede: {
        roughness: 0.98,
        metalness: 0.0,
        clearcoat: 0.03,
        clearcoatRoughness: 0.9,
        sheen: 0.6,
        sheenRoughness: 0.9
      },
      synthetic: {
        roughness: 0.28,
        metalness: 0.25,
        clearcoat: 0.8,
        clearcoatRoughness: 0.12,
        iridescence: 0.1,
        iridescenceIOR: 1.2
      }
    };
    return baseProps[material] || baseProps.leather;
  }, [material]);

  // Create materials with real-time color updates
  const materials = useMemo(() => {
    const matProps = materialProps;
    
    return {
      sole: new THREE.MeshPhysicalMaterial({
        ...matProps,
        color: new THREE.Color(colors.sole),
        envMapIntensity: 1.0
      }),
      upper: new THREE.MeshPhysicalMaterial({
        ...matProps,
        color: new THREE.Color(colors.upper),
        envMapIntensity: 1.2
      }),
      laces: new THREE.MeshPhysicalMaterial({
        roughness: 0.85,
        metalness: 0.03,
        color: new THREE.Color(colors.laces),
        envMapIntensity: 0.9
      }),
      logo: new THREE.MeshPhysicalMaterial({
        roughness: 0.08,
        metalness: 0.95,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        color: new THREE.Color(colors.logo),
        emissive: new THREE.Color(colors.logo),
        emissiveIntensity: 0.22,
        envMapIntensity: 2.2
      })
    };
  }, [colors, materialProps]);

  // Update material colors in real-time
  useEffect(() => {
    if (materials.sole) materials.sole.color.set(colors.sole);
    if (materials.upper) materials.upper.color.set(colors.upper);
    if (materials.laces) materials.laces.color.set(colors.laces);
    if (materials.logo) {
      materials.logo.color.set(colors.logo);
      materials.logo.emissive.set(colors.logo);
    }
  }, [colors, materials]);

  // Load and apply PBR texture maps for ultra-realism (graceful fallback)
  useEffect(() => {
    if (!materials || texture === 'solid') return;
    const loader = new THREE.TextureLoader();

    const mapsToLoad = (part) => {
      const base = `/textures/${variant}/${material}/${part}`;
      // We'll attempt these extensions in order
      const exts = ['jpg', 'png', 'webp', 'jpeg', 'svg'];
      const withExts = (suffix) => exts.map((ext) => `${base}_${suffix}.${ext}`);
      return {
        normal: withExts('normal'),
        roughness: withExts('roughness'),
        metalness: withExts('metallic'),
        ao: withExts('ao')
      };
    };

    const setCommon = (tex) => {
      if (!tex) return;
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(1, 1);
      tex.anisotropy = Math.min(8, loader.manager?.renderer?.capabilities?.getMaxAnisotropy?.() || 8);
    };

    const tryLoadOne = (url) => new Promise((resolve) => {
      loader.load(
        url,
        (tx) => { setCommon(tx); resolve(tx); },
        undefined,
        () => resolve(null)
      );
    });

    const loadFirstAvailable = async (urls) => {
      for (const u of urls) {
        // eslint-disable-next-line no-await-in-loop
        const tex = await tryLoadOne(u);
        if (tex) return tex;
      }
      return null;
    };

    let cancelled = false;

    const applyMapsToMaterial = async (targetMat, partKey) => {
      if (!targetMat) return;
      const urls = mapsToLoad(partKey);
      const [normalMap, roughnessMap, metalnessMap, aoMap] = await Promise.all([
        loadFirstAvailable(urls.normal),
        loadFirstAvailable(urls.roughness),
        loadFirstAvailable(urls.metalness),
        loadFirstAvailable(urls.ao)
      ]);
      if (cancelled) return;
      if (normalMap) targetMat.normalMap = normalMap;
      if (roughnessMap) targetMat.roughnessMap = roughnessMap;
      if (metalnessMap) targetMat.metalnessMap = metalnessMap;
      if (aoMap) targetMat.aoMap = aoMap;
      if (targetMat.normalScale) targetMat.normalScale.set(1, 1);
      if ('aoMapIntensity' in targetMat) targetMat.aoMapIntensity = 1.0;
      targetMat.needsUpdate = true;
    };

    // Apply maps primarily to upper and sole; logo/laces left clean for contrast
    applyMapsToMaterial(materials.upper, 'upper');
    applyMapsToMaterial(materials.sole, 'sole');

    return () => { cancelled = true; };
  }, [materials, material, texture, variant]);

  // Variant-specific animation configurations
  const animationConfig = useMemo(() => {
    const configs = {
      casual: { floatSpeed: 0.3, floatAmplitude: 0.03, rotationSpeed: 0.15, rotationAmplitude: 0.04 },
      hiking: { floatSpeed: 0.2, floatAmplitude: 0.015, rotationSpeed: 0.1, rotationAmplitude: 0.02 },
      running: { floatSpeed: 0.6, floatAmplitude: 0.05, rotationSpeed: 0.4, rotationAmplitude: 0.08 },
      basketball: { floatSpeed: 0.8, floatAmplitude: 0.06, rotationSpeed: 0.5, rotationAmplitude: 0.1 },
      classic: { floatSpeed: 0.4, floatAmplitude: 0.04, rotationSpeed: 0.2, rotationAmplitude: 0.05 }
    };
    return configs[variant] || configs.classic;
  }, [variant]);

  // If no GLB, notify parent that fallback is ready so loader hides
  useEffect(() => {
    if (!hasModel && onLoad) {
      const id = requestAnimationFrame(() => onLoad());
      return () => cancelAnimationFrame(id);
    }
  }, [hasModel, onLoad]);

  // Variant-specific smooth animations
  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    const config = animationConfig;
    switch (variant) {
      case 'casual':
        groupRef.current.position.y = -0.5 + Math.sin(time * config.floatSpeed) * config.floatAmplitude;
        groupRef.current.rotation.y = Math.sin(time * config.rotationSpeed) * config.rotationAmplitude;
        groupRef.current.rotation.z = Math.sin(time * config.rotationSpeed * 0.7) * config.rotationAmplitude * 0.5;
        groupRef.current.scale.setScalar(0.8);
        break;
      case 'hiking':
        groupRef.current.position.y = -0.5 + Math.sin(time * config.floatSpeed) * config.floatAmplitude;
        groupRef.current.position.x = Math.sin(time * config.floatSpeed * 0.5) * config.floatAmplitude * 0.3;
        groupRef.current.rotation.y = Math.sin(time * config.rotationSpeed) * config.rotationAmplitude;
        groupRef.current.scale.setScalar(0.8);
        break;
      case 'running':
        groupRef.current.position.y = -0.5 + Math.sin(time * config.floatSpeed) * config.floatAmplitude;
        groupRef.current.rotation.y = Math.sin(time * config.rotationSpeed) * config.rotationAmplitude;
        groupRef.current.rotation.x = Math.sin(time * config.rotationSpeed * 1.2) * config.rotationAmplitude * 0.3;
        {
          const pulse = 1 + Math.sin(time * config.floatSpeed * 2) * 0.01;
          groupRef.current.scale.setScalar(pulse * 0.8);
        }
        break;
      case 'basketball':
        groupRef.current.position.y = -0.5 + Math.abs(Math.sin(time * config.floatSpeed)) * config.floatAmplitude;
        groupRef.current.rotation.y = Math.sin(time * config.rotationSpeed) * config.rotationAmplitude;
        groupRef.current.rotation.z = Math.sin(time * config.rotationSpeed * 1.5) * config.rotationAmplitude * 0.4;
        {
          const bounce = 1 + Math.sin(time * config.floatSpeed * 3) * 0.02;
          groupRef.current.scale.setScalar(bounce * 0.8);
        }
        break;
      default:
        groupRef.current.position.y = -0.5 + Math.sin(time * config.floatSpeed) * config.floatAmplitude;
        groupRef.current.rotation.y = Math.sin(time * config.rotationSpeed) * config.rotationAmplitude;
        groupRef.current.scale.setScalar(0.8);
    }
  });

  // If GLB model loaded successfully, use it
  if (gltf && gltf.scene) {
    useEffect(() => {
      gltfRef.current = gltf.scene;
      
      // Apply materials to model meshes
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          // Map materials based on mesh name patterns
          if (child.name.toLowerCase().includes('sole')) {
            child.material = materials.sole;
          } else if (child.name.toLowerCase().includes('upper') || 
                     child.name.toLowerCase().includes('body')) {
            child.material = materials.upper;
          } else if (child.name.toLowerCase().includes('lace')) {
            child.material = materials.laces;
          } else if (child.name.toLowerCase().includes('logo') || 
                     child.name.toLowerCase().includes('swoosh')) {
            child.material = materials.logo;
          } else {
            child.material = materials.upper;
          }
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      
      if (onLoad) onLoad();
    }, [gltf]);

    return (
      <group ref={groupRef} position={[0, -0.5, 0]} scale={[0.8, 0.8, 0.8]}>
        <primitive object={gltf.scene} />
      </group>
    );
  }

  // Fallback: Procedural shoe model (existing code enhanced)
  return (
    <group ref={groupRef} position={[0, -0.5, 0]} scale={[0.8, 0.8, 0.8]}>
      {/* Main Body / Upper */}
      <mesh position={[0, 0.5, 0.4]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.35, 2.9]} />
        <primitive object={materials.upper} attach="material" />
      </mesh>

      {/* Sole - Bottom */}
      <mesh position={[0, 0.08, 0.1]} castShadow receiveShadow>
        <boxGeometry args={[1.9, 0.15, 3.6]} />
        <primitive object={materials.sole} attach="material" />
      </mesh>

      {/* Toe Cap */}
      <mesh position={[0, 0.52, 1.8]} rotation={[0.2, 0, 0]} castShadow>
        <sphereGeometry args={[0.75, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2.5]} />
        <primitive object={materials.upper} attach="material" />
      </mesh>

      {/* Logo/Swoosh Accents */}
      {[-0.76, 0.76].map((x, idx) => (
        <mesh 
          key={idx} 
          position={[x, 0.55, 0.5]} 
          rotation={[0, idx === 0 ? Math.PI / 2 : -Math.PI / 2, 0]} 
          castShadow
        >
          <boxGeometry args={[2.2, 0.15, 0.04]} />
          <primitive object={materials.logo} attach="material" />
        </mesh>
      ))}

      {/* Laces */}
      <mesh position={[0, 0.6, 0.2]} castShadow>
        <boxGeometry args={[0.1, 0.3, 1.2]} />
        <primitive object={materials.laces} attach="material" />
      </mesh>
    </group>
  );
}

/**
 * Camera Controls Component with preset angles
 */
function CameraControls({ 
  autoRotate, 
  cameraPosition,
  onCameraChange,
  autoRotateSpeed
}) {
  const { camera } = useThree();
  const controlsRef = useRef();

  // Apply preset camera positions
  useEffect(() => {
    if (cameraPosition && controlsRef.current) {
      const positions = {
        front: { position: [0, 0.5, 5], target: [0, 0, 0] },
        side: { position: [5, 0.5, 0], target: [0, 0, 0] },
        top: { position: [0, 5, 0], target: [0, 0, 0] },
        threeQuarter: { position: [4, 2.5, 4], target: [0, 0, 0] }
      };
      
      const preset = positions[cameraPosition];
      if (preset) {
        camera.position.set(...preset.position);
        controlsRef.current.target.set(...preset.target);
        controlsRef.current.update();
      }
    }
  }, [cameraPosition, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      autoRotate={autoRotate}
      autoRotateSpeed={autoRotateSpeed}
      enablePan={false}
      enableZoom={true}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 1.5}
      minDistance={3}
      maxDistance={10}
      target={[0, 0, 0]}
      onChange={() => {
        if (onCameraChange && controlsRef.current) {
          const pos = camera.position;
          onCameraChange({
            x: pos.x,
            y: pos.y,
            z: pos.z
          });
        }
      }}
      // Touch controls for mobile
      touches={{
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN
      }}
    />
  );
}

/**
 * Main 3D Customizer Component
 * Enhanced with GLB model support, zoom controls, preset cameras, and screenshot capture
 */
export default function ShoeCustomizer3D({ 
  colors, 
  autoRotate = true, 
  variant = 'classic',
  customization,
  onScreenshot 
}) {
  const canvasRef = useRef(null);
  const [cameraPosition, setCameraPosition] = useState('threeQuarter');
  const [zoom, setZoom] = useState(1);
  const [modelLoaded, setModelLoaded] = useState(false);

  // Extract customization data or use defaults
  const customizationData = customization || {
    colors: colors || {
      sole: '#fff',
      upper: '#000',
      laces: '#fff',
      logo: '#ff0000'
    },
    material: 'leather',
    size: '42',
    texture: 'solid'
  };

  const currentColors = customizationData.colors || colors;
  const material = customizationData.material || 'leather';
  const texture = customizationData.texture || 'solid';

  // Safety: if model hasn't reported ready in time (e.g., missing GLB), hide loader
  useEffect(() => {
    if (modelLoaded) return;
    const timeout = setTimeout(() => setModelLoaded(true), 2500);
    return () => clearTimeout(timeout);
  }, [modelLoaded, variant]);

  // Variant-specific Float configurations
  const floatConfig = useMemo(() => {
    const configs = {
      casual: { speed: 1.0, rotationIntensity: 0.15, floatIntensity: 0.2, floatingRange: [0.015, 0.06] },
      hiking: { speed: 0.8, rotationIntensity: 0.1, floatIntensity: 0.15, floatingRange: [0.01, 0.04] },
      running: { speed: 2.0, rotationIntensity: 0.3, floatIntensity: 0.35, floatingRange: [0.03, 0.1] },
      basketball: { speed: 2.5, rotationIntensity: 0.4, floatIntensity: 0.4, floatingRange: [0.04, 0.12] },
      classic: { speed: 1.2, rotationIntensity: 0.2, floatIntensity: 0.25, floatingRange: [0.02, 0.08] }
    };
    return configs[variant] || configs.classic;
  }, [variant]);

  // Variant-specific lighting configurations
  const lightingConfig = useMemo(() => {
    const configs = {
      casual: { ambientIntensity: 0.65, keyLightIntensity: 2.3, keyLightColor: '#ffffff', rimLightColor: '#00ff88', fillLightColor: '#b0c4de' },
      hiking: { ambientIntensity: 0.7, keyLightIntensity: 2.8, keyLightColor: '#ffd700', rimLightColor: '#ff8c00', fillLightColor: '#d4a574' },
      running: { ambientIntensity: 0.6, keyLightIntensity: 2.7, keyLightColor: '#ffffff', rimLightColor: '#00ffff', fillLightColor: '#87ceeb' },
      basketball: { ambientIntensity: 0.55, keyLightIntensity: 3.0, keyLightColor: '#ffffff', rimLightColor: '#ff6b6b', fillLightColor: '#ffd93d' },
      classic: { ambientIntensity: 0.6, keyLightIntensity: 2.5, keyLightColor: '#ffffff', rimLightColor: '#00ff88', fillLightColor: '#b0c4de' }
    };
    return configs[variant] || configs.classic;
  }, [variant]);

  // Auto-rotate speed per variant
  const autoRotateSpeedByVariant = useMemo(() => {
    const map = { casual: 1.2, hiking: 0.8, running: 2.0, basketball: 2.2, classic: 1.5 };
    return map[variant] ?? 1.5;
  }, [variant]);

  // Screenshot capture function
  const captureScreenshot = () => {
    // Get canvas element from Three.js renderer
    const canvasElement = document.querySelector('canvas');
    if (canvasElement) {
      // Convert canvas to blob
      canvasElement.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          
          // Create download link
          const link = document.createElement('a');
          link.download = `custom-shoe-${Date.now()}.png`;
          link.href = url;
          link.click();
          
          // Cleanup
          setTimeout(() => URL.revokeObjectURL(url), 100);
          
          // Callback if provided
          if (onScreenshot) {
            onScreenshot(url);
          }
        }
      }, 'image/png');
    }
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Only trigger if not in input field
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      // Screenshot (S key)
      if ((e.key === 's' || e.key === 'S') && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        captureScreenshot();
      }
      
      // Zoom controls (+/- keys)
      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        setZoom(prev => Math.min(prev + 0.1, 2));
      }
      if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        setZoom(prev => Math.max(prev - 0.1, 0.5));
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onScreenshot]);

  return (
    <div className="shoe-customizer-3d-container">
      {/* Canvas Container */}
      <Canvas 
        ref={canvasRef}
        shadows 
        dpr={[1, 2]} 
        camera={{ 
          position: [4, 2.5, 4], 
          fov: 45,
          zoom: zoom
        }}
        gl={{ 
          preserveDrawingBuffer: true,
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance'
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.25;
          if (gl.outputColorSpace !== undefined) {
            gl.outputColorSpace = THREE.SRGBColorSpace;
          }
          // @ts-ignore - older three versions use physicallyCorrectLights
          if ('physicallyCorrectLights' in gl) gl.physicallyCorrectLights = true;
        }}
        style={{ 
          width: '100%', 
          height: '100%',
          background: 'transparent'
        }}
      >
        <color attach="background" args={['#0a0a0a']} />
        
        {/* Studio Environment */}
        <Environment preset="studio" />
        
        {/* Variant-specific Realistic Lighting Setup */}
        <ambientLight intensity={lightingConfig.ambientIntensity} color="#ffffff" />
        <spotLight
          position={[8, 12, 8]}
          angle={0.3}
          penumbra={1.5}
          decay={2}
          intensity={lightingConfig.keyLightIntensity}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0001}
          color={lightingConfig.keyLightColor}
        />
        <pointLight position={[-6, 4, -6]} intensity={0.75} color={lightingConfig.fillLightColor} />
        <pointLight position={[6, 2, -6]} intensity={0.55} color={lightingConfig.rimLightColor} />

        {/* 3D Shoe Model with variant-specific Float */}
        <Float 
          speed={floatConfig.speed} 
          rotationIntensity={floatConfig.rotationIntensity} 
          floatIntensity={floatConfig.floatIntensity}
          floatingRange={floatConfig.floatingRange}
        >
          <ShoeModel 
            colors={currentColors}
            material={material}
            texture={texture}
            variant={variant}
            onLoad={() => setModelLoaded(true)}
          />
        </Float>

        {/* Category-specific ambient effects */}
        <CategoryEffects variant={variant} />

        {/* Contact Shadows */}
        <ContactShadows
          opacity={0.4}
          scale={10}
          blur={3}
          far={10}
          resolution={256}
          color="#000000"
        />

        {/* Camera Controls with Presets */}
        <CameraControls
          autoRotate={autoRotate}
          autoRotateSpeed={autoRotateSpeedByVariant}
          cameraPosition={cameraPosition}
          onCameraChange={(pos) => {
            // Camera change callback
          }}
        />
      </Canvas>

      {/* Loading Indicator */}
      {!modelLoaded && (
        <div className="customizer-3d-loading">
          <div className="loading-spinner"></div>
          <span>Loading 3D Model...</span>
        </div>
      )}

      {/* Zoom Controls - Bottom Left */}
      <div className="customizer-zoom-controls">
        <button
          className="zoom-btn zoom-in"
          onClick={() => setZoom(Math.min(zoom + 0.1, 2))}
          title="Zoom In (or press +)"
          aria-label="Zoom in"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <button
          className="zoom-btn zoom-out"
          onClick={() => setZoom(Math.max(zoom - 0.1, 0.5))}
          title="Zoom Out (or press -)"
          aria-label="Zoom out"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <div className="zoom-indicator">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* Preset Camera Buttons - Bottom Right */}
      <div className="customizer-camera-presets">
        {[
          { id: 'front', label: 'Front', icon: '⬆️' },
          { id: 'side', label: 'Side', icon: '➡️' },
          { id: 'top', label: 'Top', icon: '⬆️' },
          { id: 'threeQuarter', label: '3/4', icon: '↗️' }
        ].map(preset => (
          <button
            key={preset.id}
            className={`camera-preset-btn ${cameraPosition === preset.id ? 'active' : ''}`}
            onClick={() => setCameraPosition(preset.id)}
            title={`View from ${preset.label}`}
            aria-label={`Set camera to ${preset.label} view`}
          >
            <span className="preset-icon">{preset.icon}</span>
            <span className="preset-label">{preset.label}</span>
          </button>
        ))}
      </div>

      {/* Screenshot Button - Top Right */}
      <button
        className="screenshot-btn"
        onClick={captureScreenshot}
        title="Capture Screenshot (or press S)"
        aria-label="Capture screenshot"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 12C10.6569 12 12 10.6569 12 9C12 7.34315 10.6569 6 9 6C7.34315 6 6 7.34315 6 9C6 10.6569 7.34315 12 9 12Z" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M2.25 6.75L3.9375 4.5C4.2945 4.05225 4.81275 3.75 5.367 3.75H12.633C13.1873 3.75 13.7055 4.05225 14.0625 4.5L15.75 6.75M2.25 6.75V13.5C2.25 14.1213 2.75368 14.625 3.375 14.625H14.625C15.2463 14.625 15.75 14.1213 15.75 13.5V6.75M2.25 6.75H15.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Keyboard Shortcuts Hint - Top Left */}
      <div className="keyboard-shortcuts-hint" title="Keyboard shortcuts">
        <div className="shortcuts-content">
          <div className="shortcut-item">
            <kbd>+</kbd><kbd>-</kbd> <span>Zoom</span>
          </div>
          <div className="shortcut-item">
            <kbd>S</kbd> <span>Screenshot</span>
          </div>
        </div>
      </div>
    </div>
  );
}
// Preload GLB models
if (typeof window !== 'undefined') {
  // Preload will be handled by useGLTF hook
}

