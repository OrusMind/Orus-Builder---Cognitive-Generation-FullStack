/**
 * ============================================================================
 * ORUS BUILDER - PREVIEW SANDBOX COMPONENT
 * ============================================================================
 * Renderização isolada de componentes React em iframe
 * Com auto-detecção de nome de componente
 * ============================================================================
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';

interface PreviewSandboxProps {
  code: string;
  filename?: string;
}

export const PreviewSandbox: React.FC<PreviewSandboxProps> = ({ 
  code, 
  filename = 'Component.tsx' 
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) {
      setError('Nenhum código fornecido');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // ✅ CORRIGIDO: Passar filename como segundo argumento
      const html = generatePreviewHTML(code, filename);

      // Injeta no iframe
      if (iframeRef.current?.contentWindow) {
        const iframeDoc = iframeRef.current.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(html);
        iframeDoc.close();
      }

      // Timeout para loading
      setTimeout(() => setLoading(false), 1500);
    } catch (err: any) {
      console.error('Preview error:', err);
      setError(err.message || 'Erro desconhecido ao renderizar');
      setLoading(false);
    }
  }, [code, filename]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    // Força re-render do useEffect
    setTimeout(() => {
      const html = generatePreviewHTML(code, filename);
      if (iframeRef.current?.contentWindow) {
        const iframeDoc = iframeRef.current.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(html);
        iframeDoc.close();
      }
      setLoading(false);
    }, 100);
  };

  return (
    <div className="relative w-full h-full bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700">
      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center bg-slate-50 dark:bg-slate-900 z-10"
        >
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mx-auto mb-3" />
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              Renderizando componente...
            </p>
          </div>
        </motion.div>
      )}

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900/20 z-10 p-6"
        >
          <div className="text-center max-w-md">
            <AlertCircle className="w-14 h-14 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-2">
              Erro ao renderizar
            </h3>
            <p className="text-sm text-red-600 dark:text-red-300 font-mono bg-red-100 dark:bg-red-900/40 p-4 rounded-lg mb-4">
              {error}
            </p>
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              <RefreshCw className="w-4 h-4" />
              Tentar Novamente
            </button>
          </div>
        </motion.div>
      )}

      {/* Preview Iframe */}
      <iframe
        ref={iframeRef}
        title="Component Preview"
        sandbox="allow-scripts allow-same-origin"
        className="w-full h-full border-0"
      />
    </div>
  );
};

/**
 * ============================================================================
 * GERADOR DE HTML PARA PREVIEW
 * ============================================================================
 * Com auto-detecção de nome de componente
 */
function generatePreviewHTML(code: string, filename: string): string {
  // Auto-detectar nome do componente
  const componentMatch = code.match(/(?:export\s+default\s+(?:function\s+)?|const\s+|function\s+)(\w+)/);
  const componentName = componentMatch ? componentMatch[1] : 'Component';
  
  console.log('🔍 Componente detectado:', componentName);

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Preview - ${componentName}</title>
      
      <!-- Tailwind CSS CDN -->
      <script src="https://cdn.tailwindcss.com"></script>
      
      <!-- React + ReactDOM CDN (UMD) -->
      <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
      <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
      
      <!-- Babel Standalone para transpilar JSX -->
      <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
      
      <style>
        body {
          margin: 0;
          padding: 24px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        #root {
          background: white;
          border-radius: 12px;
          padding: 32px;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
          min-width: 300px;
        }
        .preview-error {
          padding: 20px;
          background: #fee;
          border: 2px solid #fcc;
          border-radius: 12px;
          color: #c00;
          font-family: 'Courier New', monospace;
          max-width: 600px;
        }
        .preview-error h3 {
          margin: 0 0 12px 0;
          font-size: 18px;
        }
        .preview-error pre {
          margin: 0;
          font-size: 12px;
          overflow-x: auto;
          background: #fff;
          padding: 12px;
          border-radius: 6px;
        }
      </style>
    </head>
    <body>
      <div id="root"></div>
      
      <script type="text/babel">
        const { useState, useEffect } = React;
        
        try {
          // Código do componente gerado
          ${code}
          
          // Renderiza o componente
          const rootElement = document.getElementById('root');
          const root = ReactDOM.createRoot(rootElement);
          
          // Auto-detectar componente
          let ComponentToRender = null;
          
          // Tentativa 1: Export default
          if (typeof ${componentName} !== 'undefined') {
            ComponentToRender = ${componentName};
            console.log('✅ Componente encontrado:', '${componentName}');
          }
          
          // Tentativa 2: Procurar no window
          if (!ComponentToRender) {
            const componentNames = Object.keys(window).filter(key => 
              typeof window[key] === 'function' && 
              key[0] === key[0].toUpperCase() &&
              !['React', 'ReactDOM', 'Babel'].includes(key)
            );
            
            if (componentNames.length > 0) {
              ComponentToRender = window[componentNames[0]];
              console.log('✅ Componente encontrado no window:', componentNames[0]);
            }
          }
          
          if (ComponentToRender) {
            root.render(
              <div style={{ textAlign: 'center' }}>
                <ComponentToRender />
              </div>
            );
          } else {
            throw new Error(\`Componente "${componentName}" não encontrado. Certifique-se de usar 'export default'.\`);
          }
        } catch (error) {
          console.error('❌ Erro ao renderizar:', error);
          document.getElementById('root').innerHTML = \`
            <div class="preview-error">
              <h3>❌ Erro ao renderizar componente</h3>
              <pre>\${error.message || error}</pre>
            </div>
          \`;
        }
      </script>
    </body>
    </html>
  `;
}

export default PreviewSandbox;
