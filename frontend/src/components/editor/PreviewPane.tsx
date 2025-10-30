/**
 * ============================================================================
 * ORUS BUILDER - PREVIEW PANE COMPONENT
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-10T08:53:00-03:00
 * LAST_MODIFIED: 2025-10-10T08:53:00-03:00
 * COMPONENT_HASH: orus.frontend.component.preview.20251010.PRV4J5K6
 * 
 * PURPOSE:
 * - Live preview of generated code
 * - Iframe sandbox for safe rendering
 * - Responsive viewport testing
 * - Hot reload support
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: LivePreviewAgent
 * - COGNITIVE_LEVEL: Intermediate
 * - AUTONOMY_DEGREE: 72
 * - TRINITY_INTEGRATED: None (Pure UI)
 * ============================================================================
 */

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import {
  RefreshCw,
  Smartphone,
  Tablet,
  Monitor,
  ExternalLink,
  AlertCircle,
  Loader2,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { Button } from '@components/common/Button';
import { Tooltip } from '@components/common/Tooltip';
import toast from 'react-hot-toast';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface PreviewPaneProps {
  /**
   * HTML content to preview
   */
  html?: string;

  /**
   * CSS styles
   */
  css?: string;

  /**
   * JavaScript code
   */
  javascript?: string;

  /**
   * Preview URL (alternative to inline content)
   */
  url?: string;

  /**
   * Enable hot reload
   * @default true
   */
  hotReload?: boolean;

  /**
   * Reload delay (ms)
   * @default 500
   */
  reloadDelay?: number;

  /**
   * On load callback
   */
  onLoad?: () => void;

  /**
   * On error callback
   */
  onError?: (error: Error) => void;
}

type ViewportSize = 'mobile' | 'tablet' | 'desktop' | 'fullwidth';

interface ViewportConfig {
  width: number;
  height: number;
  label: string;
  icon: React.ElementType;
}

// ============================================================================
// VIEWPORT CONFIGURATIONS
// ============================================================================

const VIEWPORT_CONFIGS: Record<ViewportSize, ViewportConfig> = {
  mobile: {
    width: 375,
    height: 667,
    label: 'Mobile',
    icon: Smartphone,
  },
  tablet: {
    width: 768,
    height: 1024,
    label: 'Tablet',
    icon: Tablet,
  },
  desktop: {
    width: 1920,
    height: 1080,
    label: 'Desktop',
    icon: Monitor,
  },
  fullwidth: {
    width: 0, // Full width
    height: 0, // Full height
    label: 'Full Width',
    icon: Maximize2,
  },
};

// ============================================================================
// PREVIEW PANE COMPONENT
// ============================================================================

export const PreviewPane: React.FC<PreviewPaneProps> = ({
  html = '',
  css = '',
  javascript = '',
  url,
  hotReload = true,
  reloadDelay = 500,
  onLoad,
  onError,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [viewport, setViewport] = useState<ViewportSize>('fullwidth');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const reloadTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate preview document
  const generatePreviewDocument = (): string => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    
    ${css}
  </style>
</head>
<body>
  ${html}
  
  <script>
    // Error handling
    window.addEventListener('error', (event) => {
      window.parent.postMessage({
        type: 'preview-error',
        error: {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      }, '*');
    });
    
    // Console redirection
    const originalConsole = {
      log: console.log,
      error: console.error,
      warn: console.warn
    };
    
    console.log = (...args) => {
      originalConsole.log(...args);
      window.parent.postMessage({
        type: 'console-log',
        level: 'log',
        args: args.map(String)
      }, '*');
    };
    
    console.error = (...args) => {
      originalConsole.error(...args);
      window.parent.postMessage({
        type: 'console-log',
        level: 'error',
        args: args.map(String)
      }, '*');
    };
    
    console.warn = (...args) => {
      originalConsole.warn(...args);
      window.parent.postMessage({
        type: 'console-log',
        level: 'warn',
        args: args.map(String)
      }, '*');
    };
    
    // User code
    try {
      ${javascript}
    } catch (error) {
      console.error('Preview Error:', error.message);
    }
    
    // Notify parent when loaded
    window.parent.postMessage({ type: 'preview-loaded' }, '*');
  </script>
</body>
</html>
    `.trim();
  };

  // Update preview with debounce
  useEffect(() => {
    if (!hotReload || (!html && !css && !javascript && !url)) return;

    if (reloadTimerRef.current) {
      clearTimeout(reloadTimerRef.current);
    }

    reloadTimerRef.current = setTimeout(() => {
      reloadPreview();
    }, reloadDelay);

    return () => {
      if (reloadTimerRef.current) {
        clearTimeout(reloadTimerRef.current);
      }
    };
  }, [html, css, javascript, url, hotReload, reloadDelay]);

  // Handle iframe messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'preview-loaded') {
        setIsLoading(false);
        setHasError(false);
        if (onLoad) {
          onLoad();
        }
      } else if (event.data.type === 'preview-error') {
        setHasError(true);
        setErrorMessage(event.data.error.message);
        if (onError) {
          onError(new Error(event.data.error.message));
        }
      } else if (event.data.type === 'console-log') {
        // Handle console logs from iframe
        const { level, args } = event.data;
        console[level as 'log' | 'error' | 'warn']('[Preview]', ...args);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [onLoad, onError]);

  // Reload preview
  const reloadPreview = () => {
    if (!iframeRef.current) return;

    setIsLoading(true);
    setHasError(false);

    try {
      if (url) {
        iframeRef.current.src = url;
      } else {
        const doc = generatePreviewDocument();
        const blob = new Blob([doc], { type: 'text/html' });
        const blobUrl = URL.createObjectURL(blob);
        iframeRef.current.src = blobUrl;
      }
    } catch (error) {
      setHasError(true);
      setErrorMessage((error as Error).message);
      setIsLoading(false);
      if (onError) {
        onError(error as Error);
      }
    }
  };

  // Handle manual reload
  const handleReload = () => {
    reloadPreview();
    toast.success('Preview reloaded');
  };

  // Open in new tab
  const handleOpenExternal = () => {
    if (url) {
      window.open(url, '_blank');
    } else {
      const doc = generatePreviewDocument();
      const blob = new Blob([doc], { type: 'text/html' });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    }
  };

  // Get viewport dimensions
  const getViewportDimensions = () => {
    if (viewport === 'fullwidth') {
      return { width: '100%', height: '100%' };
    }

    const config = VIEWPORT_CONFIGS[viewport];
    return {
      width: `${config.width}px`,
      height: `${config.height}px`,
    };
  };

  const dimensions = getViewportDimensions();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={clsx(
        'flex flex-col bg-background-surface rounded-lg border border-primary/20 overflow-hidden',
        isFullscreen && 'fixed inset-4 z-50'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-background-elevated border-b border-primary/20">
        {/* Viewport Controls */}
        <div className="flex items-center gap-2">
          {Object.entries(VIEWPORT_CONFIGS).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <Tooltip key={key} content={config.label}>
                <button
                  onClick={() => setViewport(key as ViewportSize)}
                  className={clsx(
                    'p-2 rounded-lg transition-colors',
                    viewport === key
                      ? 'bg-primary text-background'
                      : 'hover:bg-background text-foreground-muted'
                  )}
                  aria-label={config.label}
                >
                  <Icon className="w-4 h-4" />
                </button>
              </Tooltip>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Tooltip content="Reload preview">
            <button
              onClick={handleReload}
              disabled={isLoading}
              className="p-2 rounded-lg hover:bg-background transition-colors disabled:opacity-50"
              aria-label="Reload"
            >
              <RefreshCw className={clsx('w-4 h-4 text-foreground-muted', isLoading && 'animate-spin')} />
            </button>
          </Tooltip>

          <Tooltip content="Open in new tab">
            <button
              onClick={handleOpenExternal}
              className="p-2 rounded-lg hover:bg-background transition-colors"
              aria-label="Open in new tab"
            >
              <ExternalLink className="w-4 h-4 text-foreground-muted" />
            </button>
          </Tooltip>

          <Tooltip content={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-lg hover:bg-background transition-colors"
              aria-label="Toggle fullscreen"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4 text-foreground-muted" />
              ) : (
                <Maximize2 className="w-4 h-4 text-foreground-muted" />
              )}
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Preview Container */}
      <div className="flex-1 flex items-center justify-center p-4 bg-background overflow-auto">
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-foreground-muted"
            >
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading preview...</span>
            </motion.div>
          )}

          {hasError && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center gap-4 p-8 max-w-md text-center"
            >
              <AlertCircle className="w-16 h-16 text-error" />
              <h3 className="text-lg font-semibold text-foreground">Preview Error</h3>
              <p className="text-sm text-foreground-muted">{errorMessage}</p>
              <Button onClick={handleReload} variant="secondary">
                Try Again
              </Button>
            </motion.div>
          )}

          {!isLoading && !hasError && (
            <motion.div
              key="iframe"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-full flex items-center justify-center"
            >
              <iframe
                ref={iframeRef}
                title="Preview"
                sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
                className="bg-white rounded-lg shadow-elevated"
                style={{
                  width: dimensions.width,
                  height: dimensions.height,
                  maxWidth: '100%',
                  maxHeight: '100%',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: PreviewPane (Live preview component)
 * NAMED_EXPORTS: PreviewPaneProps
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal
 * ============================================================================
 */
