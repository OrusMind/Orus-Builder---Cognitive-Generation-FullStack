import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Loader2, RefreshCw, CheckCircle } from 'lucide-react';

interface PreviewSandboxProps {
  code: string;
  filename?: string;
  className?: string;
}

export const PreviewSandbox: React.FC<PreviewSandboxProps> = ({
  code,
  filename = 'Component.tsx',
  className = ''
}) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (!code || code.trim() === '') {
      setError('Nenhum código fornecido para renderizar');
      setLoading(false);
      return undefined;
    }

    try {
      console.log('🎨 PreviewSandbox: Iniciando renderização...');
      setLoading(true);
      setError(null);
      setSuccess(false);

      const html = generatePreviewHTML(code, filename);

      if (iframeRef.current?.contentWindow) {
        const iframeDoc = iframeRef.current.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(html);
        iframeDoc.close();

        const errorHandler = (event: ErrorEvent) => {
          console.error('❌ Preview Error:', event.error);
          setError(event.error?.message || 'Erro desconhecido');
          setLoading(false);
        };

        iframeRef.current.contentWindow.addEventListener('error', errorHandler);

        const renderTimeout = setTimeout(() => {
          setLoading(false);
          setSuccess(true);
        }, 2000);

        return () => {
          clearTimeout(renderTimeout);
          if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.removeEventListener('error', errorHandler);
          }
        };
      }

      return undefined;
    } catch (err: any) {
      console.error('❌ PreviewSandbox: Erro:', err);
      setError(err.message || 'Erro desconhecido');
      setLoading(false);
      setSuccess(false);
      return undefined;
    }
  }, [code, filename]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    setTimeout(() => {
      try {
        const html = generatePreviewHTML(code, filename);
        if (iframeRef.current?.contentWindow) {
          const iframeDoc = iframeRef.current.contentWindow.document;
          iframeDoc.open();
          iframeDoc.write(html);
          iframeDoc.close();
          setLoading(false);
          setSuccess(true);
        }
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    }, 500);
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10"
          >
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-sm text-gray-600">Renderizando componente...</p>
            </div>
          </motion.div>
        )}

        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-red-50 z-10"
          >
            <div className="flex flex-col items-center gap-3 p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-600" />
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">Erro ao Renderizar</h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <button
                onClick={handleRetry}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Tentar Novamente
              </button>
            </div>
          </motion.div>
        )}

        {success && !loading && !error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-4 right-4 z-20"
          >
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Renderizado!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <iframe
        ref={iframeRef}
        title="Component Preview"
        sandbox="allow-scripts allow-same-origin"
        className="w-full h-full border-0 bg-white"
      />
    </div>
  );
};

function generatePreviewHTML(code: string, filename: string): string {
  let componentName = detectComponentName(code, filename);

  if (!componentName || componentName.trim() === '') {
    componentName = 'GeneratedComponent';
    console.warn('⚠️ Component name detection failed, using fallback:', componentName);
  }

  console.log('🎨 Generating HTML for component:', componentName);
  const cleanCode = cleanComponentCode(code);

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Preview - ${componentName}</title>
        <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
              'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
              sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          #root {
            min-height: 100vh;
          }
          .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 0.9);
            z-index: 9999;
          }
          .loading-spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      </head>
      <body>
        <div id="root"></div>
        <div class="loading-overlay" id="loading">
          <div>
            <div class="loading-spinner"></div>
            <p style="margin-top: 16px; color: #666;">Transpilando código...</p>
          </div>
        </div>
        <script type="text/babel">
          ${cleanCode}
          
          setTimeout(() => {
            const root = ReactDOM.createRoot(document.getElementById('root'));
            root.render(React.createElement(${componentName}));
            document.getElementById('loading').style.display = 'none';
          }, 500);
        </script>
      </body>
    </html>
  `;
}

function cleanComponentCode(code: string): string {
  let cleaned = code.trim();

  console.log('🧹 Starting code cleaning...');
  console.log('Original code length:', code.length);

  cleaned = cleaned
    .replace(/\/\/\s*src\/[^\n]+\n/g, '')
    .replace(/\/\*\s*src\/[^\*]+\*\//g, '')
    .replace(/\/\/\s*File:\s*[^\n]+\n/g, '')
    .replace(/\/\*\s*File:\s*[^\*]+\*\//g, '');
  console.log('✅ Step 1: File separator comments removed');

  cleaned = cleaned.replace(/import\s+.*?from\s+['"].*?['"];?\n?/g, '');
  console.log('✅ Step 2: Removed ALL imports');

  cleaned = cleaned
    .replace(/`{3}typescript\n?/g, '')
    .replace(/`{3}tsx\n?/g, '')
    .replace(/`{3}javascript\n?/g, '')
    .replace(/`{3}jsx\n?/g, '')
    .replace(/`{3}\n?/g, '');
  console.log('✅ Step 3: Removed markdown fences');

  cleaned = cleaned
    .replace(/export\s+(interface|type|const|function|class|enum)\s+/g, '$1 ')
    .replace(/^\s*\n/gm, '');
  console.log('✅ Step 4: Removed "export" keywords');

  cleaned = cleaned
    .replace(/\/\/\s*\w+\.tsx/g, '')
    .replace(/\/\*\*[\s\S]*?\*\//g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '');
  console.log('✅ Step 5: Removed comments (preserving URLs)');

  cleaned = cleaned
    .replace(/interface\s+\w+\s*{[^}]*}/gs, '')
    .replace(/type\s+\w+\s*=\s*[^;]+;/g, '');
  console.log('✅ Step 6: Removed interfaces and type aliases');

  cleaned = `const { useState, useEffect, useCallback, useMemo, useRef } = React;\n\n${cleaned}`;
  console.log('✅ Step 7: Added React globals at top');

  cleaned = cleaned
    .replace(/(\w+)\s*<\{[^}]+\}>\s*=/g, '$1 =')
    .replace(/(\w+)\s*<[A-Z]\w+>\s*=/g, '$1 =')
    .replace(/(\w+)<\{[^}]+\}>\s*=/g, '$1 =')
    .replace(/(\w+)<[A-Z]\w+>\s*=/g, '$1 =')
    .replace(/(\w+)\s*<[A-Z]\w+>\s*\(/g, '$1(')
    .replace(/(\w+)\s*<\{[^}]+\}>\s*\(/g, '$1(');
  console.log('✅ Step 8: Removed ALL isolated generics');

  cleaned = cleaned
    .replace(/useState<[^>]+>/g, 'useState')
    .replace(/useEffect<[^>]+>/g, 'useEffect')
    .replace(/useMemo<[^>]+>/g, 'useMemo')
    .replace(/useCallback<[^>]+>/g, 'useCallback')
    .replace(/useRef<[^>]+>/g, 'useRef')
    .replace(/useContext<[^>]+>/g, 'useContext')
    .replace(/createContext<[^>]+>/g, 'createContext')
    .replace(/:\s*[A-Z]\w+<[^>]+>/g, '')
    .replace(/\bas\s+[A-Z]\w+<[^>]+>/g, '');
  console.log('✅ Step 9: Removed generics (preserving JSX)');

 cleaned = cleaned
  .replace(/:\s*React\.FC\s*/g, ' ')
  .replace(/:\s*JSX\.Element/g, '')
  .replace(/:\s*React\.CSSProperties/g, '')  
  .replace(/:\s*string\b/g, '')
  .replace(/:\s*number\b/g, '')
  .replace(/:\s*boolean\b/g, '')
  .replace(/:\s*any\b/g, '')
  .replace(/:\s*void\b/g, '')
  .replace(/:\s*Error\s*\|\s*null/g, '')
  .replace(/:\s*[A-Z]\w+\s*\|\s*null/g, '')
  .replace(/:\s*[A-Z]\w+\[\]/g, '')
  .replace(/:\s*\{[^}]+\}/g, '')
  .replace(/:\s*React\.\w+/g, '')              
  .replace(/:\s*[A-Z]\w+\b/g, '');

  console.log('✅ Step 10: Removed type annotations');

  cleaned = cleaned
    .replace(/\s+as\s+any\b/g, '')
    .replace(/\s+as\s+typeof\s+[^\s;,)]+/g, '')
    .replace(/\s+as\s+[A-Z]\w+/g, '')
    .replace(/\s+as\s+\([^)]+\)\s*=>\s*[A-Z]\w+/g, '');
  console.log('✅ Step 11: Removed type assertions');

  cleaned = cleaned.replace(/^\s*\n/gm, '');
  console.log('✅ Step 12: Cleaned up whitespace');

  cleaned = cleaned
    .replace(/\((\w+):\s*[A-Z]\w+(\[\])?\)/g, '($1)')
    .replace(/,\s*(\w+):\s*[A-Z]\w+(\[\])?/g, ', $1');
  console.log('✅ Step 13: Removed parameter types');

  cleaned = cleaned.replace(/\):\s*[A-Z]\w+(\[\])?\s*=>/g, ') =>');
  console.log('✅ Step 14: Removed return types');

  cleaned = cleaned.replace(/export\s+default\s+\w+;?/g, '');
  console.log('✅ Step 15: Removed all existing export default statements');

  let mainComponentName = detectComponentName(cleaned, 'Component.tsx');

  if (!mainComponentName) {
    mainComponentName = 'Component';
    console.warn('⚠️ Could not detect component name! Using fallback:', mainComponentName);
  }

  cleaned = cleaned.trim() + `\n\nexport default ${mainComponentName};`;
  console.log('✅ Step 16: Added export default for:', mainComponentName);

  console.log('📋 CLEANED CODE (first 20 lines):');
  const lines = cleaned.split('\n');
  lines.slice(0, 20).forEach((line, i) => {
    console.log(`${String(i + 1).padStart(2, '0')}: ${line}`);
  });
  console.log(`... (${lines.length} total lines)`);

  console.log('✅ Code cleaned successfully! Final length:', cleaned.length);
  return cleaned;
}

function detectComponentName(code: string, filename: string): string | null {
  const exportDefaultMatch = code.match(/export\s+default\s+(\w+)/);
  if (exportDefaultMatch && exportDefaultMatch[1]) {
    console.log('🔍 Detected from export default:', exportDefaultMatch[1]);
    return exportDefaultMatch[1];
  }

  const constComponentMatch = code.match(/const\s+([A-Z]\w+)\s*=\s*\(/);
  if (constComponentMatch && constComponentMatch[1]) {
    console.log('🔍 Detected from const:', constComponentMatch[1]);
    return constComponentMatch[1];
  }

  const functionComponentMatch = code.match(/function\s+([A-Z]\w+)\s*\(/);
  if (functionComponentMatch && functionComponentMatch[1]) {
    console.log('🔍 Detected from function:', functionComponentMatch[1]);
    return functionComponentMatch[1];
  }

  const filenameMatch = filename.match(/([A-Z]\w+)\.tsx?/);
  if (filenameMatch && filenameMatch[1]) {
    console.log('🔍 Detected from filename:', filenameMatch[1]);
    return filenameMatch[1];
  }

  console.error('❌ Could not detect component name!');
  return null;
}
