import { useState, useEffect, useRef } from 'react'
import ShoeCustomizer3D from '../components/ShoeCustomizer3D'
import api from '../utils/api'

export default function CustomizerPage() {
  // Updated state structure matching requirements
  const [customization, setCustomization] = useState({
    colors: {
      sole: '#fff',
      upper: '#000',
      laces: '#fff',
      logo: '#ff0000'
    },
    material: 'leather',
    size: '42',
    texture: 'solid'
  })

  // Legacy color state for backward compatibility
  const [colors, setColors] = useState({
    base: '#1a1a1a',
    toe: '#2d2d2d',
    tongue: '#1a1a1a',
    sides: '#2d2d2d',
    sole: '#00ff88',
    heel: '#1a1a1a',
    logo: '#00ff88',
    laces: '#ffffff'
  })

  const [autoRotate, setAutoRotate] = useState(true)
  const [selectedPart, setSelectedPart] = useState('upper')
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState({ show: false, message: '' })
  const [isAnimating, setIsAnimating] = useState(false)
  const [designName, setDesignName] = useState('')
  const [shoeVariant, setShoeVariant] = useState('classic')
  const [saving, setSaving] = useState(false)
  const customizerRef = useRef(null)

  // Load existing design if available and simulate loading
  useEffect(() => {
    const savedDesign = localStorage.getItem('customShoeDesign')
    if (savedDesign) {
      try {
        const parsed = JSON.parse(savedDesign)
        // Support both old and new format
        if (parsed.colors) {
          setCustomization(parsed)
          // Map new format to legacy format for compatibility
          setColors({
            base: parsed.colors.upper,
            toe: parsed.colors.upper,
            tongue: parsed.colors.upper,
            sides: parsed.colors.upper,
            sole: parsed.colors.sole,
            heel: parsed.colors.upper,
            logo: parsed.colors.logo,
            laces: parsed.colors.laces
          })
        } else {
          setColors(parsed)
        }
      } catch (e) {
        console.error('Failed to load saved design:', e)
      }
    }
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  // Sync colors between new and legacy format
  useEffect(() => {
    setColors(prev => ({
      ...prev,
      sole: customization.colors.sole,
      logo: customization.colors.logo,
      laces: customization.colors.laces,
      base: customization.colors.upper,
      toe: customization.colors.upper,
      tongue: customization.colors.upper,
      sides: customization.colors.upper,
      heel: customization.colors.upper
    }))
  }, [customization.colors])

  const showToast = (message) => {
    setToast({ show: true, message })
    setTimeout(() => setToast({ show: false, message: '' }), 2000)
  }

  const presetColors = [
    { name: 'Classic Black', colors: { base: '#1a1a1a', toe: '#2d2d2d', tongue: '#1a1a1a', sides: '#2d2d2d', sole: '#00ff88', heel: '#1a1a1a', logo: '#00ff88', laces: '#ffffff' }},
    { name: 'Pure White', colors: { base: '#f5f5f5', toe: '#ffffff', tongue: '#f5f5f5', sides: '#ffffff', sole: '#1a1a1a', heel: '#f5f5f5', logo: '#1a1a1a', laces: '#1a1a1a' }},
    { name: 'Royal Blue', colors: { base: '#1e3a8a', toe: '#2563eb', tongue: '#1e3a8a', sides: '#2563eb', sole: '#ffffff', heel: '#1e3a8a', logo: '#fbbf24', laces: '#ffffff' }},
    { name: 'Fire Red', colors: { base: '#991b1b', toe: '#dc2626', tongue: '#991b1b', sides: '#dc2626', sole: '#1a1a1a', heel: '#991b1b', logo: '#1a1a1a', laces: '#ffffff' }},
    { name: 'Neon Volt', colors: { base: '#1a1a1a', toe: '#2d2d2d', tongue: '#1a1a1a', sides: '#2d2d2d', sole: '#84cc16', heel: '#1a1a1a', logo: '#84cc16', laces: '#84cc16' }},
    { name: 'Purple Haze', colors: { base: '#581c87', toe: '#7c3aed', tongue: '#581c87', sides: '#7c3aed', sole: '#ffffff', heel: '#581c87', logo: '#fbbf24', laces: '#ffffff' }},
  ]

  const colorPalette = [
    '#1a1a1a', '#2d2d2d', '#ffffff', '#f5f5f5',
    '#991b1b', '#dc2626', '#f87171',
    '#1e3a8a', '#2563eb', '#60a5fa',
    '#065f46', '#059669', '#10b981',
    '#581c87', '#7c3aed', '#a78bfa',
    '#f59e0b', '#fbbf24', '#fcd34d',
    '#00ff88', '#84cc16', '#22d3ee'
  ]

  const handleColorChange = (part, color) => {
    setIsAnimating(true)
    
    // Update both new and legacy format
    const newPartMap = {
      'base': 'upper',
      'toe': 'upper',
      'tongue': 'upper',
      'sides': 'upper',
      'heel': 'upper',
      'sole': 'sole',
      'logo': 'logo',
      'laces': 'laces',
      'upper': 'upper'
    }
    
    const newPart = newPartMap[part] || part
    
    setCustomization(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [newPart]: color
      }
    }))
    
    setColors(prev => ({
      ...prev,
      [part]: color
    }))
    
    setTimeout(() => setIsAnimating(false), 300)
  }

  const handlePresetClick = (preset) => {
    setIsAnimating(true)
    setColors(preset.colors)
    showToast(`🎨 Applied ${preset.name} preset!`)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const handleSave = async () => {
    const name = designName.trim() || `Custom Design ${new Date().toLocaleDateString()}`
    const designId = `customShoeDesign_${Date.now()}`
    const designData = {
      name,
      ...customization,
      savedAt: new Date().toISOString()
    }
    
    // Save design to localStorage with unique ID
    localStorage.setItem(designId, JSON.stringify(designData))
    
    // Also save as active design for quick reload
    localStorage.setItem('customShoeDesign', JSON.stringify(customization))
    
    // Save to API if available
    try {
      setSaving(true)
      await api.post('/products/customize', {
        name,
        customization: {
          colors: customization.colors,
          material: customization.material,
          size: customization.size,
          texture: customization.texture,
          variant: shoeVariant
        }
      })
      showToast(`💾 "${name}" saved successfully!`)
    } catch (error) {
      // API might not be available yet, still save locally
      console.warn('API save failed, saved locally:', error)
      showToast(`💾 "${name}" saved locally!`)
    } finally {
      setSaving(false)
      setDesignName('')
    }
  }

  // Screenshot capture handler
  const handleScreenshot = (dataURL) => {
    // Could save screenshot or upload to server
    const link = document.createElement('a')
    link.download = `custom-shoe-${Date.now()}.png`
    link.href = dataURL
    link.click()
    showToast('📸 Screenshot captured!')
  }

  // Add to Cart handler
  const handleAddToCart = async () => {
    try {
      setSaving(true)
      await api.post('/products/customize', {
        addToCart: true,
        customization: {
          colors: customization.colors,
          material: customization.material,
          size: customization.size,
          texture: customization.texture,
          variant: shoeVariant
        }
      })
      showToast('🛒 Custom design added to cart!')
    } catch (error) {
      console.error('Add to cart failed:', error)
      showToast('❌ Failed to add to cart. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    handlePresetClick(presetColors[0])
  }

  const partNames = {
    upper: 'Upper Body',
    base: 'Base Body',
    toe: 'Toe Cap',
    tongue: 'Tongue',
    sides: 'Side Panels',
    sole: 'Sole',
    heel: 'Heel Counter',
    logo: 'Logo/Swoosh',
    laces: 'Laces'
  }

  const materialOptions = [
    { id: 'leather', name: 'Leather', preview: '🟤', description: 'Premium genuine leather' },
    { id: 'canvas', name: 'Canvas', preview: '⬜', description: 'Durable canvas material' },
    { id: 'mesh', name: 'Mesh', preview: '🔲', description: 'Breathable mesh fabric' },
    { id: 'suede', name: 'Suede', preview: '🟫', description: 'Soft suede texture' },
    { id: 'synthetic', name: 'Synthetic', preview: '◻️', description: 'Modern synthetic material' }
  ]

  const textureOptions = [
    { id: 'solid', name: 'Solid', preview: '■' },
    { id: 'pattern', name: 'Pattern', preview: '▦' },
    { id: 'gradient', name: 'Gradient', preview: '▧' }
  ]

  const sizeOptions = ['38', '39', '40', '41', '42', '43', '44', '45', '46']

  const handleMaterialChange = (material) => {
    setCustomization(prev => ({
      ...prev,
      material
    }))
    showToast(`🔄 Material changed to ${materialOptions.find(m => m.id === material)?.name}`)
  }

    const handleSizeChange = (size) => {
    // Convert size to number for comparison
    const newSize = parseFloat(size)
    
    // Validate size is within bounds
    if (newSize >= 35 && newSize <= 47) {
      setCustomization(prev => ({
        ...prev,
        size: size.toString()
      }))
      showToast(`� Size set to ${size}`)
    }
  }

  const handleSizeAdjust = (increment) => {
    const currentSize = parseFloat(customization.size)
    const newSize = currentSize + increment

    // Ensure size stays within valid range (35-47)
    if (newSize >= 35 && newSize <= 47) {
      handleSizeChange(newSize.toString())
    }
  }

  const handleTextureChange = (texture) => {
    setCustomization(prev => ({
      ...prev,
      texture
    }))
    showToast(`🎨 Texture set to ${texture}`)
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <h2>Loading Customizer...</h2>
        <p>Preparing your 3D workspace</p>
      </div>
    )
  }

  return (
    <div className="customizer-page">
      {/* Toast Notification */}
      {toast.show && (
        <div className="toast-notification">
          {toast.message}
        </div>
      )}

      <div className="customizer-header">
        <h1>🎨 Custom Shoe Designer</h1>
        <p>Design your dream sneakers with our interactive 3D customizer</p>
      </div>

      <div className="customizer-layout">
        {/* 3D Viewer */}
        <div className={`customizer-viewer ${isAnimating ? 'animating' : ''}`}>
          <ShoeCustomizer3D 
            colors={colors} 
            autoRotate={autoRotate} 
            variant={shoeVariant}
            customization={customization}
            onScreenshot={handleScreenshot}
          />
          <div className="viewer-controls">
            <button 
              className={`control-btn ${autoRotate ? 'active' : ''}`}
              onClick={() => setAutoRotate(!autoRotate)}
              title={autoRotate ? 'Pause automatic rotation' : 'Enable automatic rotation'}
            >
              {autoRotate ? '⏸️ Pause Rotation' : '▶️ Auto Rotate'}
            </button>
            <button 
              className="control-btn"
              onClick={handleScreenshot}
              title="Capture screenshot (Press 'S')"
            >
              📸 Screenshot
            </button>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="customizer-controls">
          <div className="controls-section">
            <h3>👟 Shoe Style</h3>
            <div className="shoe-variant-selector">
              {[
                { id: 'classic', name: 'Classic Athletic', icon: '👟' },
                { id: 'running', name: 'Running', icon: '🏃' },
                { id: 'basketball', name: 'Basketball', icon: '🏀' },
                { id: 'casual', name: 'Casual/Skate', icon: '🛹' },
                { id: 'hiking', name: 'Hiking Boot', icon: '🥾' }
              ].map(variant => (
                <button
                  key={variant.id}
                  className={`variant-btn ${shoeVariant === variant.id ? 'active' : ''}`}
                  onClick={() => {
                    setShoeVariant(variant.id)
                    setIsAnimating(true)
                    showToast(`${variant.icon} Switched to ${variant.name}`)
                    setTimeout(() => setIsAnimating(false), 500)
                  }}
                  title={`Switch to ${variant.name} style`}
                >
                  <span className="variant-icon">{variant.icon}</span>
                  <span className="variant-name">{variant.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="controls-section">
            <h3>🎨 Quick Presets</h3>
            <div className="preset-grid">
              {presetColors.map((preset, index) => (
                <button
                  key={index}
                  className="preset-btn"
                  onClick={() => handlePresetClick(preset)}
                  title={`Apply ${preset.name} color scheme`}
                >
                  <div className="preset-preview">
                    <div style={{ backgroundColor: preset.colors.base }} className="preset-color"></div>
                    <div style={{ backgroundColor: preset.colors.sole }} className="preset-color"></div>
                    <div style={{ backgroundColor: preset.colors.logo }} className="preset-color"></div>
                  </div>
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="controls-section">
            <h3>🎯 Customize Parts</h3>
            <div className="parts-selector">
              {Object.entries(partNames).map(([key, name]) => (
                <button
                  key={key}
                  className={`part-btn ${selectedPart === key ? 'active' : ''}`}
                  onClick={() => setSelectedPart(key)}
                  style={{
                    borderColor: selectedPart === key ? colors[key] : 'transparent'
                  }}
                >
                  <div 
                    className="part-color-indicator" 
                    style={{ backgroundColor: colors[key] }}
                  ></div>
                  {name}
                </button>
              ))}
            </div>
          </div>

          <div className="controls-section">
            <h3>🎨 Color Palette</h3>
            <p className="selected-part-info">
              Customizing: <strong>{partNames[selectedPart]}</strong>
            </p>
            <div className="color-palette">
              {colorPalette.map((color, index) => (
                <button
                  key={index}
                  className={`color-btn ${colors[selectedPart] === color ? 'active' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange(selectedPart, color)}
                  title={color}
                >
                  {colors[selectedPart] === color && '✓'}
                </button>
              ))}
            </div>
            <div className="custom-color-input">
              <label>Custom Color:</label>
              <input
                type="color"
                value={colors[selectedPart]}
                onChange={(e) => handleColorChange(selectedPart, e.target.value)}
              />
              <span className="color-hex">{colors[selectedPart]}</span>
            </div>
          </div>

          <div className="controls-section">
            <h3>🧵 Material</h3>
            <div className="material-selector">
              {materialOptions.map(material => (
                <button
                  key={material.id}
                  className={`material-btn ${customization.material === material.id ? 'active' : ''}`}
                  onClick={() => handleMaterialChange(material.id)}
                  title={material.description}
                >
                  <span className="material-preview">{material.preview}</span>
                  <span className="material-name">{material.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="controls-section">
            <h3>📏 Size</h3>
            <div className="size-selector">
              <button
                className="size-adjust-btn"
                onClick={() => handleSizeAdjust(-0.5)}
                disabled={parseFloat(customization.size) <= 35}
              >
                -
              </button>
              <div className="current-size">
                {customization.size}
              </div>
              <button
                className="size-adjust-btn"
                onClick={() => handleSizeAdjust(0.5)}
                disabled={parseFloat(customization.size) >= 47}
              >
                +
              </button>
            </div>
          </div>

          <div className="controls-section">
            <h3>🎨 Texture</h3>
            <div className="texture-selector">
              {textureOptions.map(texture => (
                <button
                  key={texture.id}
                  className={`texture-btn ${customization.texture === texture.id ? 'active' : ''}`}
                  onClick={() => handleTextureChange(texture.id)}
                  title={texture.name}
                >
                  <span className="texture-preview">{texture.preview}</span>
                  <span>{texture.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="controls-section">
            <h3>💾 Save Your Design</h3>
            <div className="design-name-input">
              <input
                type="text"
                placeholder="Enter design name (optional)"
                value={designName}
                onChange={(e) => setDesignName(e.target.value)}
                className="design-name-field"
                maxLength={50}
              />
            </div>
            <div className="controls-sticky-footer">
              <div className="action-buttons">
                <button 
                  className="save-btn" 
                  onClick={handleSave}
                  disabled={saving}
                  title="Save your custom design"
                >
                  {saving ? '💾 Saving...' : '💾 Save Design'}
                </button>
                <button 
                  className="add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={saving}
                  title="Add custom design to cart"
                >
                  {saving ? '⏳ Adding...' : '🛒 Add to Cart'}
                </button>
                <button 
                  className="reset-btn"
                  onClick={handleReset}
                  title="Reset to default Classic Black theme"
                >
                  🔄 Reset to Default
                </button>
              </div>
              <div className="design-summary">
                <div className="tags">
                  <span className="design-tag">Material: {customization.material}</span>
                  <span className="design-tag">Size: {customization.size}</span>
                  <span className="design-tag">Texture: {customization.texture}</span>
                </div>
                <div className="design-swatches">
                  <span className="dot" style={{ background: customization.colors.upper }} title="Upper"></span>
                  <span className="dot" style={{ background: customization.colors.sole }} title="Sole"></span>
                  <span className="dot" style={{ background: customization.colors.laces }} title="Laces"></span>
                  <span className="dot" style={{ background: customization.colors.logo }} title="Logo"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .loading-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 70vh;
          animation: fadeIn 0.5s ease-in;
        }

        .loading-spinner {
          width: 60px;
          height: 60px;
          border: 4px solid rgba(0, 255, 136, 0.1);
          border-top: 4px solid var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        .loading-screen h2 {
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 10px 0;
          color: var(--text);
        }

        .loading-screen p {
          color: var(--text-secondary);
          font-size: 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .toast-notification {
          position: fixed;
          top: 100px;
          right: 30px;
          background: linear-gradient(135deg, var(--primary) 0%, #00cc6f 100%);
          color: var(--bg);
          padding: 16px 24px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          box-shadow: 0 8px 24px rgba(0, 255, 136, 0.4);
          animation: slideInRight 0.3s ease-out, fadeOut 0.3s ease-in 1.7s;
          z-index: 1000;
        }

        @keyframes slideInRight {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          to {
            opacity: 0;
            transform: translateY(-10px);
          }
        }

        .customizer-page {
          padding: 20px;
          max-width: 1400px;
          margin: 0 auto;
          animation: fadeIn 0.5s ease-in;
        }

        .customizer-header {
          text-align: center;
          margin-bottom: 30px;
          animation: fadeInDown 0.6s ease-out;
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .customizer-header h1 {
          font-size: 42px;
          font-weight: 900;
          margin: 0 0 10px 0;
          background: linear-gradient(135deg, var(--primary) 0%, #00ffff 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradient-shift 3s ease infinite;
          background-size: 200% 200%;
        }

        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .customizer-header p {
          color: var(--text-secondary);
          font-size: 16px;
          margin: 0;
        }

        .customizer-layout {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 30px;
        }

        .customizer-viewer {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(0, 255, 136, 0.2);
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 8px 32px rgba(0, 255, 136, 0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .customizer-viewer.animating {
          box-shadow: 0 12px 48px rgba(0, 255, 136, 0.25);
          border-color: var(--primary);
        }

        .viewer-controls {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 15px;
          flex-wrap: wrap;
          align-items: center;
        }

        /* 3D overlay controls and loading */
        .shoe-customizer-3d-container {
          width: 100%;
          height: 500px;
          background: transparent;
          position: relative;
          border-radius: 12px;
          overflow: hidden;
        }

        .customizer-3d-loading {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          color: var(--primary);
          font-size: 14px;
          font-weight: 600;
          background: rgba(0, 0, 0, 0.85);
          padding: 20px 32px;
          border-radius: 12px;
          border: 1px solid var(--primary);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 8px 32px rgba(0, 255, 136, 0.3);
        }

        .customizer-zoom-controls {
          position: absolute;
          bottom: 20px;
          left: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          z-index: 10;
          align-items: flex-start;
        }

        .zoom-btn {
          width: 48px;
          height: 48px;
          padding: 0;
          background: rgba(0, 255, 136, 0.12);
          border: 2px solid rgba(0, 255, 136, 0.4);
          border-radius: 12px;
          color: var(--text);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
          position: relative;
          overflow: hidden;
        }

        .zoom-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .zoom-btn:hover::before { left: 100%; }

        .zoom-btn:hover {
          background: rgba(0, 255, 136, 0.25);
          border-color: var(--primary);
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 6px 24px rgba(0, 255, 136, 0.4);
        }

        .zoom-btn:active { transform: translateY(0) scale(0.98); transition-duration: 0.1s; }

        .zoom-btn svg { transition: transform 0.2s ease; }
        .zoom-btn:hover svg { transform: scale(1.1); }

        .zoom-indicator {
          margin-top: 4px;
          padding: 4px 10px;
          background: rgba(0, 0, 0, 0.6);
          border: 1px solid rgba(0, 255, 136, 0.3);
          border-radius: 8px;
          font-size: 11px;
          font-weight: 600;
          color: var(--primary);
          text-align: center;
          min-width: 48px;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        .customizer-camera-presets {
          position: absolute;
          bottom: 20px;
          right: 20px;
          display: flex;
          gap: 8px;
          z-index: 10;
          flex-wrap: wrap;
          max-width: calc(100% - 100px);
          justify-content: flex-end;
        }

        .camera-preset-btn {
          padding: 10px 14px;
          background: rgba(0, 255, 136, 0.12);
          border: 2px solid rgba(0, 255, 136, 0.4);
          border-radius: 10px;
          color: var(--text);
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
          position: relative;
          overflow: hidden;
        }

        .camera-preset-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.2), transparent);
          transition: left 0.5s ease;
        }
        .camera-preset-btn:hover::before { left: 100%; }
        .camera-preset-btn:hover { background: rgba(0, 255, 136, 0.25); border-color: var(--primary); transform: translateY(-2px); box-shadow: 0 6px 24px rgba(0, 255, 136, 0.4); }
        .camera-preset-btn:active { transform: translateY(0); transition-duration: 0.1s; }
        .camera-preset-btn.active { background: var(--primary); color: var(--bg); border-color: var(--primary); box-shadow: 0 4px 20px rgba(0, 255, 136, 0.6); font-weight: 700; }

        .preset-icon { font-size: 14px; line-height: 1; }
        .preset-label { font-size: 11px; letter-spacing: 0.3px; }

        .screenshot-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 48px;
          height: 48px;
          padding: 0;
          background: rgba(0, 255, 136, 0.12);
          border: 2px solid rgba(0, 255, 136, 0.4);
          border-radius: 12px;
          color: var(--text);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          z-index: 10;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
          overflow: hidden;
        }
        .screenshot-btn::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.2), transparent); transition: left 0.5s ease; }
        .screenshot-btn:hover::before { left: 100%; }
        .screenshot-btn:hover { background: rgba(0, 255, 136, 0.25); border-color: var(--primary); transform: translateY(-2px) scale(1.05); box-shadow: 0 6px 24px rgba(0, 255, 136, 0.4); }
        .screenshot-btn:active { transform: translateY(0) scale(0.98); transition-duration: 0.1s; }
        .screenshot-btn svg { transition: transform 0.2s ease; }
        .screenshot-btn:hover svg { transform: scale(1.1); }

        .keyboard-shortcuts-hint {
          position: absolute;
          top: 20px;
          left: 20px;
          padding: 10px 14px;
          background: rgba(0, 0, 0, 0.75);
          border: 1px solid rgba(0, 255, 136, 0.3);
          border-radius: 10px;
          font-size: 10px;
          color: var(--text-secondary);
          z-index: 10;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          opacity: 0.7;
          transition: opacity 0.3s ease;
          cursor: help;
        }
        .keyboard-shortcuts-hint:hover { opacity: 1; border-color: var(--primary); }
        .shortcuts-content { display: flex; flex-direction: column; gap: 6px; }
        .shortcut-item { display: flex; align-items: center; gap: 6px; }
        .shortcut-item kbd { padding: 2px 6px; background: rgba(0, 255, 136, 0.2); border: 1px solid rgba(0, 255, 136, 0.4); border-radius: 4px; font-size: 9px; font-weight: 700; color: var(--primary); font-family: 'Inter', monospace; line-height: 1.4; }
        .shortcut-item span { font-size: 10px; color: var(--text-secondary); }

        @media (max-width: 768px) {
          .customizer-zoom-controls { bottom: 12px; left: 12px; gap: 6px; }
          .zoom-btn { width: 42px; height: 42px; }
          .zoom-indicator { font-size: 10px; padding: 3px 8px; min-width: 42px; }
          .customizer-camera-presets { bottom: 12px; right: 12px; gap: 6px; max-width: calc(100% - 80px); }
          .camera-preset-btn { padding: 8px 10px; font-size: 10px; }
          .preset-icon { font-size: 12px; }
          .preset-label { font-size: 10px; }
          .screenshot-btn { top: 12px; right: 12px; width: 42px; height: 42px; }
          .keyboard-shortcuts-hint { top: 12px; left: 12px; padding: 8px 10px; font-size: 9px; }
          .shortcut-item { gap: 4px; }
          .shortcut-item kbd { padding: 1px 4px; font-size: 8px; }
          .shortcut-item span { font-size: 9px; }
        }

        .control-btn {
          min-width: 120px;
          height: 40px;
          padding: 0 24px;
          background: rgba(255, 255, 255, 0.07);
          border: 2px solid rgba(0, 255, 136, 0.2);
          border-radius: 10px;
          color: var(--text);
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          line-height: 1;
          white-space: nowrap;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        .control-btn:hover {
          background: rgba(0, 255, 136, 0.1);
          border-color: var(--primary);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 255, 136, 0.25);
        }

        .control-btn:active {
          transform: translateY(1px);
          transition-duration: 0.1s;
        }

        .control-btn.active {
          background: var(--primary);
          color: var(--bg);
          border-color: var(--primary);
          box-shadow: 0 4px 16px rgba(0, 255, 136, 0.4);
        }

        .customizer-controls {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(0, 255, 136, 0.2);
          border-radius: 16px;
          padding: 25px;
          max-height: 800px;
          overflow-y: auto;
          scroll-behavior: smooth;
        }

        .customizer-controls::-webkit-scrollbar {
          width: 8px;
        }

        .customizer-controls::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 4px;
        }

        .customizer-controls::-webkit-scrollbar-thumb {
          background: rgba(0, 255, 136, 0.3);
          border-radius: 4px;
          transition: background 0.3s ease;
        }

        .customizer-controls::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 255, 136, 0.5);
        }

        .controls-section {
          margin-bottom: 30px;
        }

        .controls-section h3 {
          font-size: 18px;
          font-weight: 700;
          margin: 0 0 15px 0;
          color: var(--primary);
        }

        .preset-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .preset-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(0, 255, 136, 0.2);
          border-radius: 10px;
          padding: 12px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .preset-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(0, 255, 136, 0.1);
          transform: translate(-50%, -50%);
          transition: width 0.5s, height 0.5s;
        }

        .preset-btn:hover::before {
          width: 200%;
          height: 200%;
        }

        .preset-btn:hover {
          border-color: var(--primary);
          background: rgba(0, 255, 136, 0.05);
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 6px 20px rgba(0, 255, 136, 0.2);
        }

        .preset-btn:active {
          transform: translateY(-1px) scale(1);
        }

        .preset-preview {
          display: flex;
          gap: 4px;
          margin-bottom: 8px;
          justify-content: center;
          position: relative;
          z-index: 1;
        }

        .preset-color {
          width: 30px;
          height: 30px;
          border-radius: 6px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }

        .preset-btn:hover .preset-color {
          transform: translateY(-2px);
          border-color: rgba(0, 255, 136, 0.5);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }

        .preset-btn span {
          color: var(--text);
          font-size: 12px;
          font-weight: 600;
          position: relative;
          z-index: 1;
        }

        .parts-selector {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .part-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(0, 255, 136, 0.2);
          border-radius: 8px;
          color: var(--text);
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .part-btn::after {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 0;
          background: var(--primary);
          border-radius: 0 2px 2px 0;
          transition: height 0.3s ease;
        }

        .part-btn:hover {
          background: rgba(0, 255, 136, 0.05);
          transform: translateX(4px);
          box-shadow: 0 4px 12px rgba(0, 255, 136, 0.15);
        }

        .part-btn:hover::after {
          height: 60%;
        }

        .part-btn:active {
          transform: translateX(2px);
        }

        .part-btn.active {
          border-color: var(--primary);
          background: rgba(0, 255, 136, 0.1);
          box-shadow: 0 0 20px rgba(0, 255, 136, 0.4);
          transform: translateX(4px);
        }

        .part-btn.active::after {
          height: 80%;
        }

        .part-color-indicator {
          width: 20px;
          height: 20px;
          border-radius: 4px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
        }

        .part-btn:hover .part-color-indicator {
          transform: scale(1.1);
          border-color: rgba(0, 255, 136, 0.6);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .selected-part-info {
          color: var(--text-secondary);
          font-size: 14px;
          margin-bottom: 12px;
        }

        .selected-part-info strong {
          color: var(--primary);
        }

        .color-palette {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 8px;
          margin-bottom: 15px;
        }

        .color-btn {
          width: 100%;
          aspect-ratio: 1;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 18px;
          color: white;
          text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);
          position: relative;
          overflow: hidden;
        }

        .color-btn::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.4s, height 0.4s;
        }

        .color-btn:hover::after {
          width: 100%;
          height: 100%;
        }

        .color-btn:hover {
          transform: scale(1.15) rotate(5deg);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
          border-color: rgba(255, 255, 255, 0.5);
          z-index: 10;
        }

        .color-btn:active {
          transform: scale(1.05) rotate(0deg);
        }

        .color-btn.active {
          border-color: var(--primary);
          border-width: 3px;
          box-shadow: 0 0 20px rgba(0, 255, 136, 0.6), 0 4px 12px rgba(0, 0, 0, 0.3);
          transform: scale(1.1);
        }

        .color-btn.active::before {
          content: '';
          position: absolute;
          inset: -4px;
          border: 2px solid var(--primary);
          border-radius: 10px;
          animation: pulse-ring 1.5s ease-out infinite;
        }

        @keyframes pulse-ring {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(1.3);
          }
        }

        .custom-color-input {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px;
          background: rgba(255, 255, 255, 0.07);
          border-radius: 10px;
          border: 2px solid rgba(0, 255, 136, 0.15);
          margin-top: 8px;
          transition: all 0.3s ease;
        }

        .custom-color-input:hover {
          border-color: rgba(0, 255, 136, 0.3);
          background: rgba(255, 255, 255, 0.09);
        }

        .custom-color-input label {
          color: var(--text);
          font-size: 14px;
          font-weight: 600;
          flex: 1;
          white-space: nowrap;
        }

        .action-buttons {
          display: flex;
          gap: 12px;
          margin-top: 16px;
          justify-content: center;
        }

        .action-buttons .control-btn {
          flex: 1;
          max-width: 180px;
        }

        .custom-color-input input[type="color"] {
          width: 50px;
          height: 35px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .color-hex {
          color: var(--text-secondary);
          font-family: monospace;
          font-size: 13px;
        }

        .design-name-input {
          margin-bottom: 16px;
        }

        .design-name-field {
          width: 100%;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(0, 255, 136, 0.3);
          border-radius: 8px;
          color: var(--text);
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .design-name-field:focus {
          outline: none;
          border-color: var(--primary);
          background: rgba(0, 255, 136, 0.08);
          box-shadow: 0 0 0 3px rgba(0, 255, 136, 0.1);
        }

        .design-name-field::placeholder {
          color: var(--text-muted);
        }

        .save-btn {
          width: 100%;
          padding: 14px;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          margin: 0;
          position: relative;
          overflow: hidden;
        }

        .reset-btn {
          width: 100%;
          padding: 14px;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          margin: 0;
          position: relative;
          overflow: hidden;
        }

        .save-btn::before, .reset-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .save-btn:active::before, .reset-btn:active::before {
          width: 300%;
          height: 300%;
        }

        .save-btn {
          background: linear-gradient(135deg, var(--primary) 0%, #00cc6f 100%);
          color: var(--bg);
          border: none;
          box-shadow: 0 4px 15px rgba(0, 255, 136, 0.3);
        }

        .save-btn:hover {
          background: linear-gradient(135deg, #00cc6f 0%, var(--primary) 100%);
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(0, 255, 136, 0.5);
        }

        .save-btn:active {
          transform: translateY(-1px);
        }

        .reset-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: var(--text);
        }

        .reset-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--primary);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 255, 136, 0.2);
        }

        .reset-btn:active {
          transform: translateY(0);
        }

        /* Material Selector */
        .material-selector {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .material-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 10px;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(0, 255, 136, 0.2);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .material-btn:hover {
          border-color: var(--primary);
          background: rgba(0, 255, 136, 0.1);
          transform: translateY(-2px);
        }

        .material-btn.active {
          border-color: var(--primary);
          background: rgba(0, 255, 136, 0.15);
          box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
        }

        .material-preview {
          font-size: 24px;
        }

        .material-name {
          font-size: 11px;
          font-weight: 600;
          color: var(--text);
        }

        /* Size Selector */
        .size-selector {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.07);
          border-radius: 12px;
          border: 2px solid rgba(0, 255, 136, 0.15);
          margin-bottom: 20px;
        }

        .size-adjust-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(0, 255, 136, 0.2);
          border-radius: 10px;
          color: var(--text);
          cursor: pointer;
          font-size: 20px;
          font-weight: bold;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          user-select: none;
        }

        .size-adjust-btn:hover:not(:disabled) {
          background: rgba(0, 255, 136, 0.15);
          border-color: var(--primary);
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0, 255, 136, 0.2);
        }

        .size-adjust-btn:active:not(:disabled) {
          transform: scale(0.95);
        }

        .size-adjust-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          border-color: rgba(255, 255, 255, 0.1);
        }

        .current-size {
          min-width: 80px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 600;
          color: var(--primary);
          background: rgba(0, 255, 136, 0.1);
          border-radius: 10px;
          padding: 0 16px;
          user-select: none;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        /* Texture Selector */
        .texture-selector {
          display: flex;
          gap: 8px;
        }

        .texture-btn {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 10px;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(0, 255, 136, 0.2);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .texture-btn:hover {
          border-color: var(--primary);
          background: rgba(0, 255, 136, 0.1);
        }

        .texture-btn.active {
          border-color: var(--primary);
          background: rgba(0, 255, 136, 0.15);
        }

        .texture-preview {
          font-size: 20px;
        }

        /* Add to Cart Button */
        .add-to-cart-btn {
          width: 100%;
          padding: 14px;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          margin: 0;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: white;
          border: none;
          box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
          position: relative;
          overflow: hidden;
        }

        .add-to-cart-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(37, 99, 235, 0.5);
        }

        .add-to-cart-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .save-btn:disabled,
        .add-to-cart-btn:disabled,
        .reset-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
        }

        /* Action Buttons Container */
        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
        }

        /* Ensure buttons don't stack incorrectly */
        .controls-section:last-child {
          padding-bottom: 0;
        }

        .design-name-input {
          margin-bottom: 16px;
        }

        .save-btn,
        .add-to-cart-btn,
        .reset-btn {
          width: 100%;
          margin: 0;
        }

        .save-btn {
          margin-bottom: 0;
        }

        .add-to-cart-btn {
          margin-bottom: 0;
        }

        .reset-btn {
          margin-bottom: 0;
        }

        .shoe-variant-selector {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .variant-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 16px 12px;
          background: rgba(255, 255, 255, 0.07);
          border: 2px solid rgba(0, 255, 136, 0.15);
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        .variant-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(0, 255, 136, 0.12);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1),
                    height 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 0;
        }

        .variant-btn:hover::before {
          width: 250%;
          height: 250%;
        }

        .variant-btn:hover {
          border-color: var(--primary);
          background: rgba(0, 255, 136, 0.1);
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 8px 24px rgba(0, 255, 136, 0.3);
        }

        .variant-btn:active {
          transform: translateY(1px) scale(0.98);
          transition-duration: 0.1s;
        }

        .variant-btn.active {
          border-color: var(--primary);
          background: rgba(0, 255, 136, 0.18);
          box-shadow: 0 0 30px rgba(0, 255, 136, 0.4),
                    inset 0 0 20px rgba(0, 255, 136, 0.2);
        }

        .variant-icon {
          font-size: 34px;
          position: relative;
          z-index: 1;
          transition: transform 0.3s ease;
        }

        .variant-btn:hover .variant-icon {
          transform: scale(1.1);
        }

        .variant-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--text);
          text-align: center;
          position: relative;
          z-index: 1;
          transition: color 0.3s ease;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        .variant-btn:hover .variant-name {
          color: rgba(0, 255, 136, 0.9);
        }

        .variant-btn.active .variant-name {
          color: var(--primary);
          transform: translateY(1px);
        }

        @media (max-width: 1024px) {
          .customizer-layout {
            grid-template-columns: 1fr;
          }

          .customizer-controls {
            max-height: none;
          }
        }

        @media (max-width: 768px) {
          .customizer-page {
            padding: 10px;
          }

          .customizer-header h1 {
            font-size: 32px;
          }

          .customizer-header p {
            font-size: 14px;
          }

          .customizer-layout {
            gap: 20px;
          }

          .preset-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .parts-selector {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .shoe-variant-selector {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .color-palette {
            grid-template-columns: repeat(5, 1fr);
            gap: 8px;
          }

          .variant-btn {
            padding: 12px 8px;
          }

          .variant-icon {
            font-size: 28px;
          }

          .variant-name {
            font-size: 12px;
          }

          .toast-notification {
            right: 10px;
            left: 10px;
            top: 80px;
            font-size: 14px;
          }

        .customizer-viewer {
          height: 500px;
          background: linear-gradient(to bottom, #000000, #1a1a1a);
          border-radius: 20px;
          box-shadow: 0 0 30px rgba(0, 255, 136, 0.1);
          position: relative;
          overflow: hidden;
          margin-bottom: 20px;
        }          .customizer-controls {
            padding: 15px;
          }
        }

        @media (max-width: 480px) {
          .customizer-header h1 {
            font-size: 26px;
          }

          .color-palette {
            grid-template-columns: repeat(4, 1fr);
          }

          .preset-color {
            width: 25px;
            height: 25px;
          }
        }
      `}</style>
    </div>
  )
}
