import { Suspense, lazy } from 'react'
import './App.css'

// Lazy load the Home component for better performance
const Home = lazy(() => import('./components/Home'))

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error in application:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h1>Something went wrong.</h1>
          <button onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

const LoadingFallback = () => (
  <div className="loading-container">
    <div className="spinner-border" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
)

const App = () => (
  <ErrorBoundary>
    <Suspense fallback={<LoadingFallback />}>
      <Home />
    </Suspense>
  </ErrorBoundary>
)

export default App
