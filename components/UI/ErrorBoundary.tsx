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

function isChunkLoadError(error: Error | null): boolean {
  if (!error) return false;
  const msg = error.message || '';
  return (
    error.name === 'ChunkLoadError' ||
    msg.includes('Loading chunk') ||
    msg.includes('Failed to fetch dynamically imported module') ||
    msg.includes('Importing a module script failed')
  );
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
    if (isChunkLoadError(this.state.error)) {
      window.location.reload();
      return;
    }
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
        <div className={`flex items-center justify-center ${isPage ? 'min-h-dvh' : 'min-h-[300px]'} bg-brand-light text-brand-dark`}>
          <div className="max-w-md mx-auto px-6 py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-brand-sand rounded-full flex items-center justify-center">
              <AlertTriangle size={28} strokeWidth={1.5} className="text-brand-dark" />
            </div>
            
            <h2 className="text-os-h3 mb-3">
              Niečo sa pokazilo
            </h2>
            <p className="text-brand-muted mb-7 font-light leading-relaxed">
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
                className="inline-flex min-h-[46px] items-center gap-2 rounded-[10px] bg-brand-dark px-5 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-brand-light transition-colors hover:bg-[#333331]"
              >
                <RefreshCw size={16} />
                Skúsiť znova
              </button>
              <button
                onClick={this.handleGoHome}
                className="inline-flex min-h-[46px] items-center gap-2 rounded-[10px] border border-brand-dark px-5 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-brand-dark transition-colors hover:bg-brand-dark/5"
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
