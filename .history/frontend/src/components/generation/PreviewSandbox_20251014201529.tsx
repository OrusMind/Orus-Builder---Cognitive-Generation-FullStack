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
  // ✅ MELHORAR DETECÇÃO DE COMPONENTE
  let componentName = 'Component';
  
  // Tentar detectar export default
  const exportDefaultMatch = code.match(/export\s+default\s+(?:function\s+)?(\w+)/);
  if (exportDefaultMatch) {
    componentName = exportDefaultMatch[1];
  } else {
    // Tentar detectar const/function
    const constMatch = code.match(/(?:const|function)\s+(\w+)\s*[=:]/);
    if (constMatch) {
      componentName = constMatch[1];
    }
  }
  
  console.log('🔍 Componente detectado:', componentName);

  // ✅ LIMPAR CÓDIGO (remover imports)
  let cleanCode = code.replace(/import .* from .*;?\n?/g, '');
  
  // ✅ GARANTIR QUE TENHA EXPORT DEFAULT
  if (!cleanCode.includes('export default')) {
    cleanCode = cleanCode.replace(
      new RegExp(`(?:const|function)\\s+${componentName}`),
      `const ${componentName}`
    );
    cleanCode += `\nexport default ${componentName};`;
  }

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Preview - ${componentName}</title>
      
      <script src="https://cdn.tailwindcss.com"></script>
      <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
      <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
      <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
      
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          min-height: 100vh;
        }
        #root {
          min-height: 100vh;
        }
        .preview-error {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 20px;
          background: #fee;
        }
        .preview-error-content {
          max-width: 600px;
          padding: 24px;
          background: white;
          border: 2px solid #fcc;
          border-radius: 12px;
          color: #c00;
          font-family: 'Courier New', monospace;
        }
        .preview-error h3 {
          margin: 0 0 12px 0;
          font-size: 18px;
        }
        .preview-error pre {
          margin: 0;
          font-size: 12px;
          overflow-x: auto;
          background: #fff8f8;
          padding: 12px;
          border-radius: 6px;
          border: 1px solid #fcc;
        }
      </style>
    </head>
    <body>
      <div id="root"></div>
      
      <script type="text/babel">
        const { useState, useEffect } = React;
        
        try {
          ${cleanCode}
          
          // ✅ RENDERIZAR
          const rootElement = document.getElementById('root');
          const root = ReactDOM.createRoot(rootElement);
          
          // ✅ USAR EXPORT DEFAULT
          const ComponentToRender = ${componentName};
          
          if (ComponentToRender) {
            root.render(<ComponentToRender />);
            console.log('✅ Componente renderizado com sucesso!');
          } else {
            throw new Error('Componente não encontrado');
          }
        } catch (error) {
          console.error('❌ Erro ao renderizar:', error);
          document.getElementById('root').innerHTML = \`
            <div class="preview-error">
              <div class="preview-error-content">
                <h3>❌ Erro ao renderizar componente</h3>
                <pre>\${error.message || error.toString()}</pre>
              </div>
            </div>
          \`;
        }
      </script>
      
      <script>
        // ✅ CAPTURAR ERROS GLOBAIS
        window.onerror = function(msg, url, line, col, error) {
          console.error('Global error:', msg, line);
          document.getElementById('root').innerHTML = \`
            <div class="preview-error">
              <div class="preview-error-content">
                <h3>❌ Erro no Preview</h3>
                <pre>\${msg}\nLinha: \${line}</pre>
              </div>
            </div>
          \`;
          return true;
        };
      </script>
    </body>
    </html>
  `;
}

export default PreviewSandbox;
