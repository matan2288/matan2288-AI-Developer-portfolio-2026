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
				<div className="text-text flex min-h-screen items-center justify-center bg-white p-6 font-sans">
					<div className="border-border w-full max-w-md space-y-5 rounded-2xl border bg-white p-8 text-center shadow-sm">
						<div className="text-text mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
							<AlertTriangle size={22} className="text-neutral-700" />
						</div>

						<div className="space-y-2">
							<h2 className="text-text text-lg font-bold">Something went wrong</h2>
							<p className="text-text-muted text-xs leading-relaxed">
								An unexpected error occurred while rendering the view. You can return to the main
								portfolio or reload the application.
							</p>
						</div>

						{this.state.error?.message && (
							<div className="border-border text-text-muted max-h-24 overflow-auto rounded-xl border bg-neutral-50 p-3 text-left font-mono text-[11px]">
								{this.state.error.message}
							</div>
						)}

						<div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
							<button
								type="button"
								onClick={this.handleReset}
								className="bg-text inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-neutral-800 sm:w-auto"
							>
								<Home size={13} />
								<span>Return to Portfolio</span>
							</button>

							<button
								type="button"
								onClick={this.handleReload}
								className="text-text-muted hover:text-text border-border inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border bg-white px-4 py-2.5 text-xs font-medium transition-colors hover:bg-neutral-50 sm:w-auto"
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
