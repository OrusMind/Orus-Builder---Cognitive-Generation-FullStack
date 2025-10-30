/**
 * ============================================================================
 * ORUS BUILDER - REACT ENTRY POINT
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-09T20:38:00-03:00
 * LAST_MODIFIED: 2025-10-10T09:20:00-03:00
 * COMPONENT_HASH: orus.frontend.main.entry.20251009.MAN6G7H8
 * 
 * PURPOSE:
 * - React 18 application entry point with strict mode
 * - Global providers initialization (Router, Query, Theme)
 * - Error boundary and performance monitoring setup
 * - Development tools integration
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: ApplicationBootstrapAgent
 * - COGNITIVE_LEVEL: Advanced
 * - AUTONOMY_DEGREE: 98
 * - TRINITY_INTEGRATED: Cerebro (Bootstrap Logic)
 * ============================================================================
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './styles/globals.css';

/**
 * React Query Configuration
 * Optimized for ORUS Builder API interaction patterns
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
      onError: (error) => {
        console.error('[ORUS] Mutation Error:', error);
      },
    },
  },
});

/**
 * Error Boundary Component
 * Catches and displays runtime errors gracefully
 */
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ORUS] Error Boundary Caught:', error, errorInfo);
    // TODO: Send to error tracking service (Sentry, etc.)
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-background-surface rounded-lg p-6 border border-primary/20">
            <h1 className="text-2xl font-bold text-primary mb-4">
              ⚠️ ORUS Error
            </h1>
            <p className="text-foreground-muted mb-4">
              Something went wrong in ORUS Builder. Please refresh the page.
            </p>
            <pre className="text-xs bg-background p-4 rounded overflow-auto max-h-40 text-error">
              {this.state.error?.message || 'Unknown error'}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 w-full bg-primary hover:bg-primary-hover text-background font-medium py-2 px-4 rounded transition-colors"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Performance Monitoring (Development Only)
 */
if (import.meta.env.DEV && import.meta.env['VITE_SHOW_PERFORMANCE_METRICS'] === 'true') {
  // Optional: Add web vitals library integration here
  // import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';
  // const reportWebVitals = (metric: any) => {
  //   console.log(`[ORUS Performance] ${metric.name}:`, metric.value);
  // };
  // onCLS(reportWebVitals);
  // onFID(reportWebVitals);
  // onFCP(reportWebVitals);
  // onLCP(reportWebVitals);
  // onTTFB(reportWebVitals);
}

/**
 * Root Render
 * React 18 concurrent mode with all providers
 */
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('[ORUS] Root element not found. Ensure index.html has <div id="root"></div>');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);

/**
 * Hot Module Replacement (Development Only)
 */
if (import.meta.hot) {
  import.meta.hot.accept();
}

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: None (entry point)
 * NAMED_EXPORTS: None
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal
 * ============================================================================
 */
