/**
 * ============================================================================
 * PREVIEW SANDBOX - RENDERIZAÇÃO ISOLADA DE COMPONENTES REACT
 * ============================================================================
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Loader2 } from 'lucide-react';

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
    if (!code) return;

    try {
      setLoading(true);
      setError(null);

      // Gera HTML completo com React injetado
      const html = generatePreviewHTML(code);

      // Injeta no iframe
      if (iframeRef.current?.contentWindow) {
        const iframeDoc = iframeRef.current.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(html);
        iframeDoc.close();
      }

      // Timeout para loading
      setTimeout(() => setLoading(false), 1000);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }, [code]);

  return (
    <div className="relative w-full h-full bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-2xl">
      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50 dark:bg-slate-900 z-10">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto mb-2" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Renderizando componente...
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900/20 z-10 p-6"
        >
          <div className="text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">
              Erro ao renderizar
            </h3>
            <p className="text-sm text-red-600 dark:text-red-300 font-mono bg-red-100 dark:bg-red-900/40 p-3 rounded">
              {error}
            </p>
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
 * GERADOR DE HTML PARA PREVIEW (SEM BABEL - VERSÃO SIMPLIFICADA)
 * ============================================================================
 */
function generatePreviewHTML(code: string, filename: string): string {
  // Extrair nome do componente do código
  const componentMatch = code.match(/(?:export default|const|function)\s+(\w+)/);
  const componentName = componentMatch ? componentMatch[1] : 'Component';
  
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Preview</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
      <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
      <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
      
      <style>
        body { margin: 0; padding: 20px; font-family: system-ui; background: #f9fafb; }
        #root { min-height: 100vh; }
      </style>
    </head>
    <body>
      <div id="root"></div>
      
      <script type="text/babel">
        const { useState, useEffect } = React;
        
        ${code}
        
        // Renderiza o componente
        const rootElement = document.getElementById('root');
        const root = ReactDOM.createRoot(rootElement);
        
        try {
          // Tenta renderizar o componente detectado automaticamente
          const ComponentToRender = typeof ${componentName} !== 'undefined' 
            ? ${componentName} 
            : (typeof module !== 'undefined' && module.exports?.default) || null;
          
          if (ComponentToRender) {
            root.render(<ComponentToRender />);
          } else {
            throw new Error('Componente não encontrado: ${componentName}');
          }
        } catch (error) {
          rootElement.innerHTML = \`
            <div style="padding: 20px; background: #fee; border: 1px solid #fcc; border-radius: 8px;">
              <h3 style="color: #c00;">❌ Erro ao renderizar</h3>
              <pre style="font-size: 12px; overflow-x: auto;">\${error.message}</pre>
            </div>
          \`;
        }
      </script>
    </body>
    </html>
  `;
}
export default PreviewSandbox;
