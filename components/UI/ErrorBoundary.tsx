import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Voliteľný fallback komponent */
  fallback?: ReactNode;
  /** Callback pri chybe */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Úroveň — page zaberá celú obrazovku, section je inline */
  level?: 'page' | 'section';
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[ErrorBoundary] Zachytená chyba:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isPage = this.props.level === 'page';

      return (
        <div className={`flex items-center justify-center ${isPage ? 'min-h-screen' : 'min-h-[300px]'} bg-[#F9F9F7]`}>
          <div className="max-w-md mx-auto px-6 py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center">
              <AlertTriangle size={32} className="text-red-500" />
            </div>
            
            <h2 className="text-xl font-bold text-brand-dark mb-3">
              Niečo sa pokazilo
            </h2>
            <p className="text-gray-500 mb-6 text-sm leading-relaxed">
              Ospravedlňujeme sa za komplikácie. Skúste obnoviť stránku alebo sa vráťte na hlavnú stránku.
            </p>

            {/* Error detail v dev mode */}
            {import.meta.env.DEV && this.state.error && (
              <div className="mb-6 p-3 bg-red-50 rounded-lg text-left">
                <p className="text-xs font-mono text-red-700 break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-dark text-white text-sm font-medium rounded-lg hover:bg-brand-gold hover:text-brand-dark transition-colors"
              >
                <RefreshCw size={16} />
                Skúsiť znova
              </button>
              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Home size={16} />
                Domov
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
