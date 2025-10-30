/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ORUS BUILDER - PREVIEW SANDBOX COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════
 */

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
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
      }

      const renderTimeout = setTimeout(() => {
        setLoading(false);
        setSuccess(true);
      }, 1500);

      return () => {
        clearTimeout(renderTimeout);
      };
      
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
        }
        setLoading(false);
        setSuccess(true);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    }, 500);
  };

  return (
    <div className={`relative w-full h-full bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 ${className}`}>
      
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 z-20"
          >
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mx-auto mb-4" />
              <p className="text-sm text-slate-600 dark:text-slate-400 font-semibold">
                Renderizando componente...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 flex items-center justify-center bg-red-50/95 dark:bg-red-900/30 backdrop-blur-sm z-20 p-8"
          >
            <div className="text-center max-w-2xl">
              <AlertCircle className="w-16 h-16 text-red-500 dark:text-red-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-3">
                Erro ao Renderizar
              </h3>
              <div className="bg-red-100 dark:bg-red-900/50 rounded-xl p-4 mb-6 max-h-64 overflow-y-auto">
                <pre className="text-sm text-red-800 dark:text-red-200 font-mono text-left whitespace-pre-wrap break-words">
                  {error}
                </pre>
              </div>
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              >
                <RefreshCw className="w-5 h-5" />
                Tentar Novamente
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {success && !loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 right-4 z-10"
          >
            <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-semibold">Renderizado!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <iframe
        ref={iframeRef}
        title="Component Preview"
        sandbox="allow-scripts allow-same-origin"
        className="w-full h-full border-0 bg-white dark:bg-slate-900"
      />
    </div>
  );
};

function generatePreviewHTML(code: string, filename: string): string {
  const componentName = detectComponentName(code, filename);
  const cleanCode = cleanComponentCode(code);
  const codeEscaped = escapeCodeForHTML(cleanCode);

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview - ${componentName}</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"><\/script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"><\/script>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; background: #f9fafb; padding: 20px; }
    #root { min-height: 100vh; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const { useState, useEffect, useRef } = React;
    
    try {
      ${codeEscaped}
      
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(<${componentName} />);
    } catch (error) {
      document.getElementById('root').innerHTML = '<div style="padding: 40px; text-align: center;"><h2 style="color: #dc2626;">Erro no Preview</h2><pre style="background: #fef2f2; padding: 20px; border-radius: 8px; margin-top: 16px; color: #991b1b;">' + error.message + '</pre></div>';
    }
  <\/script>
</body>
</html>
`;
}

function detectComponentName(code: string, filename: string): string {
  let match = code.match(/export\s+default\s+function\s+(\w+)/);
  if (match) return match[1];
  
  match = code.match(/export\s+default\s+(\w+)/);
  if (match) return match[1];
  
  match = code.match(/const\s+(\w+)\s*[:=]\s*\(/);
  if (match) return match[1];
  
  match = code.match(/function\s+(\w+)\s*\(/);
  if (match) return match[1];
  
  const fileNameMatch = filename.match(/([A-Z]\w+)\.(tsx?|jsx?)$/);
  if (fileNameMatch) return fileNameMatch[1];
  
  return 'Component';
}

function cleanComponentCode(code: string): string {
  let cleanedCode = code;
  
  const markdownPatterns = [
    '```
    '```tsx',
    '```
    '```jsx',
    '```
    '```js',
    '```
  ];
  
  markdownPatterns.forEach(pattern => {
    while (cleanedCode.includes(pattern)) {
      cleanedCode = cleanedCode.replace(pattern, '');
    }
  });
  
  const importPattern = new RegExp('import\\s+.*?\\s+from\\s+[\'"][^\'"]+[\'"];?\\s*\\n?', 'g');
  cleanedCode = cleanedCode.replace(importPattern, '');
  
  cleanedCode = cleanedCode.replace(/export\s+default\s+/g, '');
  
  const pathCommentPattern = new RegExp('^//\\s*[\\w/.-]+\\.[tj]sx?\\s*$', 'gm');
  cleanedCode = cleanedCode.replace(pathCommentPattern, '');
  
  while (cleanedCode.includes('\n\n\n')) {
    cleanedCode = cleanedCode.replace('\n\n\n', '\n\n');
  }
  
  return cleanedCode.trim();
}

function escapeCodeForHTML(code: string): string {
  return code
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$')
    .replace(/\${/g, '\\${');
}

export default PreviewSandbox;
