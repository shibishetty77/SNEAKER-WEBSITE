import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo)
    this.state = { hasError: true, error, errorInfo }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0a',
          color: '#fff',
          padding: '20px'
        }}>
          <div style={{
            maxWidth: '600px',
            background: '#1a1a1a',
            border: '1px solid #ff4444',
            borderRadius: '12px',
            padding: '32px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>⚠️</div>
            <h1 style={{
              color: '#ff4444',
              fontSize: '32px',
              marginBottom: '16px',
              fontWeight: 900
            }}>
              Oops! Something went wrong
            </h1>
            <p style={{
              color: '#888',
              fontSize: '16px',
              marginBottom: '24px',
              lineHeight: 1.6
            }}>
              The app encountered an error and couldn't continue. This usually happens when a component crashes.
            </p>
            
            {this.state.error && (
              <details style={{
                background: '#0a0a0a',
                border: '1px solid #333',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '24px',
                textAlign: 'left'
              }}>
                <summary style={{
                  cursor: 'pointer',
                  color: '#00ff88',
                  fontWeight: 600,
                  marginBottom: '12px'
                }}>
                  Show Error Details
                </summary>
                <pre style={{
                  color: '#ff4444',
                  fontSize: '13px',
                  overflow: 'auto',
                  margin: 0,
                  lineHeight: 1.5
                }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo && '\n\n'}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#00ff88',
                color: '#000',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer',
                marginRight: '12px'
              }}
            >
              🔄 Reload Page
            </button>
            
            <button
              onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
              style={{
                background: 'transparent',
                color: '#00ff88',
                border: '1px solid #00ff88',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
