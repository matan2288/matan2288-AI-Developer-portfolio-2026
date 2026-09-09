import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    // Clear potentially corrupted query parameters or hash
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('view');
      window.history.replaceState({}, '', url.pathname);
      window.location.hash = '';
    }
    this.setState({ hasError: false, error: null });
  };

  private handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.href = window.location.pathname;
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white text-text flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full p-8 bg-white border border-border rounded-2xl shadow-sm text-center space-y-5">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-text">
              <AlertTriangle size={22} className="text-neutral-700" />
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-bold text-text">Something went wrong</h2>
              <p className="text-xs text-text-muted leading-relaxed">
                An unexpected error occurred while rendering the view. You can return to the main portfolio or reload the application.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 bg-neutral-50 rounded-xl border border-border text-[11px] font-mono text-text-muted text-left overflow-auto max-h-24">
                {this.state.error.message}
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-text hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg shadow-2xs transition-all cursor-pointer"
              >
                <Home size={13} />
                <span>Return to Portfolio</span>
              </button>

              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white hover:bg-neutral-50 text-text-muted hover:text-text border border-border rounded-lg text-xs font-medium transition-colors cursor-pointer"
              >
                <RotateCcw size={12} />
                <span>Reload Page</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
