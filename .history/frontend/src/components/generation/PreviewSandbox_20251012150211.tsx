/**
 * ============================================================================
 * PREVIEW SANDBOX - RENDERIZAÇÃO ISOLADA DE COMPONENTES REACT
 * ============================================================================
 * Transpila TSX → JS em tempo real
 * Renderiza em iframe com React injetado
 * ============================================================================
 */

import React, { useEffect, useRef, useState } from 'react';
import { transform } from '@babel/standalone';
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

      // PASSO 1: Transpila TSX → JavaScript vanilla
      const transpiledCode = transform(code, {
        presets: ['react', 'typescript'],
        filename: filename,
      }).code;

      // PASSO 2: Gera HTML completo com React injetado
      const html = generatePreviewHTML(transpiledCode);

      // PASSO 3: Injeta no iframe
      if (iframeRef.current?.contentWindow) {
        const iframeDoc = iframeRef.current.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(html);
        iframeDoc.close();
      }

      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }, [code, filename]);

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
          className="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900/20 z-10"
        >
          <div className="text-center max-w-md p-6">
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
        onLoad={() => setLoading(false)}
      />
    </div>
  );
};

/**
 * ============================================================================
 * GERADOR DE HTML PARA PREVIEW
 * ============================================================================
 * Injeta React, ReactDOM e Tailwind CSS
 * Renderiza componente transpilado
 */
function generatePreviewHTML(transpiledCode: string): string {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Preview</title>
      
      <!-- Tailwind CSS CDN -->
      <script src="https://cdn.tailwindcss.com"></script>
      
      <!-- React + ReactDOM CDN -->
      <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
      <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
      
      <!-- Axios (caso o componente use) -->
      <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
      
      <style>
        body {
          margin: 0;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          background: #f9fafb;
        }
        #root {
          min-height: 100vh;
        }
      </style>
    </head>
    <body>
      <div id="root"></div>
      
      <script type="text/babel">
        const { useState, useEffect } = React;
        
        // Código transpilado do componente
        ${transpiledCode}
        
        // Renderiza o componente
        const rootElement = document.getElementById('root');
        const root = ReactDOM.createRoot(rootElement);
        
        // Tenta renderizar o export default
        try {
          // Se o componente exportou como default
          if (typeof __default !== 'undefined') {
            root.render(React.createElement(__default));
          }
          // Se exportou com nome específico (Blog, Login, etc)
          else {
            const ComponentName = Object.keys(window).find(key => 
              typeof window[key] === 'function' && 
              key !== 'React' && 
              key !== 'ReactDOM'
            );
            if (ComponentName) {
              root.render(React.createElement(window[ComponentName]));
            }
          }
        } catch (error) {
          rootElement.innerHTML = \`
            <div style="padding: 20px; background: #fee; border: 1px solid #fcc; border-radius: 8px;">
              <h3 style="color: #c00;">Erro ao renderizar componente</h3>
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
