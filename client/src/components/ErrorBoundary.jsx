import React from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-cream dark:bg-gray-950 p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-danger"></div>
            
            <div className="w-20 h-20 bg-danger/10 text-danger rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              We encountered an unexpected error while rendering this page. Our engineers have been notified.
            </p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={this.handleReload}
                className="btn btn-primary w-full flex items-center justify-center gap-2"
              >
                <RefreshCcw className="w-4 h-4" /> Try Again
              </button>
              
              <a 
                href="/"
                className="btn btn-outline w-full flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700"
              >
                <Home className="w-4 h-4" /> Return to Home
              </a>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-8 text-left bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-xs font-mono text-danger">
                <p className="font-bold mb-2">{this.state.error.toString()}</p>
                <p className="text-gray-500 dark:text-gray-400">{this.state.errorInfo?.componentStack}</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
