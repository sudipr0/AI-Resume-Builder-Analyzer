// src/components/ErrorBoundary.jsx
import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log to error reporting service
    console.error('Error caught by boundary:', error, errorInfo);

    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: true
      });
    }
    try {
      const payload = {
        message: error?.toString?.() || String(error),
        stack: error?.stack || null,
        time: new Date().toISOString()
      };
      localStorage.setItem('last_app_error', JSON.stringify(payload));
    } catch (e) {
      // ignore
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  handleCopy = () => {
    try {
      const text = `${this.state.error?.toString() || ''}\n\n${this.state.error?.stack || ''}`;
      navigator.clipboard.writeText(text);
      // best-effort feedback
      alert('Error details copied to clipboard');
    } catch (e) {
      console.warn('Copy failed', e);
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-6 max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-4">We apologize for the inconvenience. Please try again.</p>

            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center mb-4">
              <button
                onClick={this.handleRetry}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Reload Application
              </button>

              <button
                onClick={this.handleCopy}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
              >
                Copy Error Details
              </button>
            </div>

            <details className="text-left text-sm bg-white border p-3 rounded-md max-h-56 overflow-auto">
              <summary className="cursor-pointer font-medium mb-2">Show error details</summary>
              <pre className="whitespace-pre-wrap break-words text-xs text-gray-700">{this.state.error?.toString()}
                {this.state.error?.stack}</pre>
            </details>

            <p className="text-sm text-gray-500 mt-4">If the problem persists, contact support.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}