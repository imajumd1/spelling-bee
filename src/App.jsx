import React, { useState, Suspense, lazy } from 'react';
import './App.css'

// Lazy load the GameBoard component
const GameBoard = lazy(() => import('./components/GameBoard'));

function App() {
  const [useSimpleMode, setUseSimpleMode] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  if (useSimpleMode) {
    return (
      <div className="app" style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>🐝 Spelling Bee</h1>
        <p>Debug Mode - Testing Basic Functionality</p>
        <button onClick={() => {
          setUseSimpleMode(false);
          setHasError(false);
          setErrorMessage('');
        }}>
          Load Full Game
        </button>
        <div style={{ marginTop: '2rem', background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
          <p>✅ React is working</p>
          <p>✅ State management is working</p>
          <p>✅ Basic styling is working</p>
          <p>✅ Dynamic imports supported</p>
        </div>
      </div>
    );
  }
  
  if (hasError) {
    return (
      <div className="app" style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>🐝 Spelling Bee</h1>
        <p style={{ color: 'red' }}>Error loading game: {errorMessage}</p>
        <button onClick={() => setUseSimpleMode(true)}>
          Back to Debug Mode
        </button>
        <details style={{ marginTop: '1rem', textAlign: 'left', background: '#f8f9fa', padding: '1rem', borderRadius: '4px' }}>
          <summary>Error Details</summary>
          <pre style={{ fontSize: '0.8rem', overflow: 'auto' }}>{errorMessage}</pre>
        </details>
      </div>
    );
  }
  
  return (
    <div className="app">
      <Suspense fallback={
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>🐝 Spelling Bee</h1>
          <p>Loading game...</p>
          <div style={{ margin: '2rem auto', width: '40px', height: '40px', border: '3px solid #f3f3f3', borderTop: '3px solid #007bff', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      }>
        <ErrorBoundary onError={(error) => {
          setHasError(true);
          setErrorMessage(error.toString());
        }}>
          <GameBoard />
        </ErrorBoundary>
      </Suspense>
    </div>
  );
}

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('GameBoard Error:', error, errorInfo);
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.children;
    }

    return this.props.children;
  }
}

export default App
