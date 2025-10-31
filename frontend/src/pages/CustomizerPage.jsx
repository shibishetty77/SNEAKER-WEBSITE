import { useState, useEffect } from 'react'
import ShoeCustomizer3D from '../components/ShoeCustomizer3D'

export default function CustomizerPage() {
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
  const [selectedPart, setSelectedPart] = useState('base')
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState({ show: false, message: '' })
  const [isAnimating, setIsAnimating] = useState(false)

  // Simulate loading for smooth entry
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

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

  const handleSave = () => {
    showToast('💾 Design saved successfully!')
    // Here you would typically save to localStorage or backend
    localStorage.setItem('customShoeDesign', JSON.stringify(colors))
  }

  const handleReset = () => {
    handlePresetClick(presetColors[0])
  }

  const partNames = {
    base: 'Base Body',
    toe: 'Toe Cap',
    tongue: 'Tongue',
    sides: 'Side Panels',
    sole: 'Sole',
    heel: 'Heel Counter',
    logo: 'Logo/Swoosh',
    laces: 'Laces'
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
          <ShoeCustomizer3D colors={colors} autoRotate={autoRotate} />
          <div className="viewer-controls">
            <button 
              className={`control-btn ${autoRotate ? 'active' : ''}`}
              onClick={() => setAutoRotate(!autoRotate)}
              title={autoRotate ? 'Pause automatic rotation' : 'Enable automatic rotation'}
            >
              {autoRotate ? '⏸️ Pause Rotation' : '▶️ Auto Rotate'}
            </button>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="customizer-controls">
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
            <button 
              className="save-btn" 
              onClick={handleSave}
              title="Save your custom design"
            >
              💾 Save Design
            </button>
            <button 
              className="reset-btn"
              onClick={handleReset}
              title="Reset to default Classic Black theme"
            >
              🔄 Reset to Default
            </button>
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
          gap: 10px;
          margin-top: 15px;
        }

        .control-btn {
          padding: 10px 20px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(0, 255, 136, 0.3);
          border-radius: 8px;
          color: var(--text);
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .control-btn:hover {
          background: rgba(0, 255, 136, 0.1);
          border-color: var(--primary);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 255, 136, 0.2);
        }

        .control-btn:active {
          transform: translateY(0);
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
          gap: 10px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
        }

        .custom-color-input label {
          color: var(--text);
          font-size: 14px;
          font-weight: 600;
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

        .save-btn, .reset-btn {
          width: 100%;
          padding: 14px;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          margin-bottom: 10px;
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
          }

          .parts-selector {
            grid-template-columns: 1fr;
          }

          .color-palette {
            grid-template-columns: repeat(5, 1fr);
            gap: 6px;
          }

          .toast-notification {
            right: 10px;
            left: 10px;
            top: 80px;
            font-size: 14px;
          }

          .customizer-viewer {
            padding: 15px;
          }

          .customizer-controls {
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
