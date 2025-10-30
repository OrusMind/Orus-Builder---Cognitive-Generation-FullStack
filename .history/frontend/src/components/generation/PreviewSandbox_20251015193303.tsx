// frontend/src/components/PreviewSandbox.tsx

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

        // ✅ Escutar erros do iframe
        const errorHandler = (event: ErrorEvent) => {
          console.error('❌ Preview Error:', event.error);
          setError(event.error?.message || 'Erro desconhecido');
          setLoading(false);
        };

        iframeRef.current.contentWindow.addEventListener('error', errorHandler);

        const renderTimeout = setTimeout(() => {
          setLoading(false);
          setSuccess(true);
        }, 2000); // 2s para transpilar e renderizar

        return () => {
          clearTimeout(renderTimeout);
          if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.removeEventListener('error', errorHandler);
          }
        };
      }
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
            className="absolute inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm"
          >
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
              <p className="text-slate-700 font-medium">Renderizando componente...</p>
            </div>
          </motion.div>
        )}

        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-red-50/90 backdrop-blur-sm"
          >
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md mx-4">
              <div className="flex items-center space-x-3 mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
                <h3 className="text-xl font-bold text-slate-900">Erro ao Renderizar</h3>
              </div>
              <p className="text-slate-600 mb-6">{error}</p>
              <button
                onClick={handleRetry}
                className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Tentar Novamente</span>
              </button>
            </div>
          </motion.div>
        )}

        {success && !loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2"
          >
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Renderizado!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <iframe
        ref={iframeRef}
        className="w-full h-full border-0 rounded-lg shadow-inner"
        sandbox="allow-scripts allow-same-origin"
        title="Component Preview"
      />
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════
// ✅ GERADOR DE HTML COM BABEL STANDALONE CORRETO
// ═════════════════════════════════════════════════════════════════════════

function generatePreviewHTML(code: string, filename: string): string {
  const componentName = detectComponentName(code, filename);
  const cleanCode = cleanComponentCode(code);

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview - ${componentName}</title>
  
  <!-- ✅ Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- ✅ React 18 Production (CDN correto) -->
  <script crossorigin src="https://unpkg.com/react@18.3.1/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js"></script>
  
  <!-- ✅ Babel Standalone (transpilar JSX em runtime) -->
  <script src="https://unpkg.com/@babel/standalone@7.24.0/babel.min.js"></script>
  
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      overflow-x: hidden;
    }
    #root {
      width: 100vw;
      min-height: 100vh;
    }
    .preview-error {
      padding: 2rem;
      background: #fee;
      color: #c00;
      font-family: monospace;
      white-space: pre-wrap;
    }
  </style>
</head>
<body>
  <div id="root">
    <div style="padding: 2rem; text-align: center; color: #666;">
      <div style="display: inline-block; width: 40px; height: 40px; border: 4px solid #ddd; border-top-color: #6366f1; border-radius: 50%; animation: spin 1s linear infinite;"></div>
      <p style="margin-top: 1rem; font-size: 14px;">Renderizando componente...</p>
    </div>
  </div>

  <style>
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>

  <!-- ✅ Código do componente (será transpilado) -->
  <script type="text/babel" data-type="module">
    ${cleanCode}

    // ✅ Renderizar usando React 18 API
    const rootElement = document.getElementById('root');
    const root = ReactDOM.createRoot(rootElement);
    
    try {
      root.render(React.createElement(${componentName}));
      console.log('✅ Componente renderizado com sucesso:', '${componentName}');
    } catch (error) {
      console.error('❌ Erro ao renderizar:', error);
      rootElement.innerHTML = \`
        <div class="preview-error">
          <h3>❌ Erro ao Renderizar Componente</h3>
          <p>\${error.message}</p>
          <pre>\${error.stack}</pre>
        </div>
      \`;
    }
  </script>
</body>
</html>
  `;
}

// ═════════════════════════════════════════════════════════════════════════
// ✅ UTILITÁRIOS DE LIMPEZA DE CÓDIGO
// ═════════════════════════════════════════════════════════════════════════

// ✅ SUBSTITUIR FUNÇÃO COMPLETA (linha ~170-185):

function detectComponentName(code: string, filename: string): string {
  // ✅ 1. Tentar detectar export default
  const exportDefaultMatch = code.match(/export\s+default\s+(?:function\s+)?(\w+)/);
  if (exportDefaultMatch && exportDefaultMatch[1]) {
    console.log('✅ Component name from export default:', exportDefaultMatch[1]);
    return exportDefaultMatch[1];
  }

  // ✅ 2. Tentar detectar const ComponentName = 
  const constMatch = code.match(/const\s+([A-Z]\w+)\s*[:=]\s*(?:\(\)|React\.FC|.*?=>)/);
  if (constMatch && constMatch[1]) {
    console.log('✅ Component name from const:', constMatch[1]);
    return constMatch[1];
  }

  // ✅ 3. Tentar detectar function ComponentName
  const functionMatch = code.match(/function\s+([A-Z]\w+)\s*\(/);
  if (functionMatch && functionMatch[1]) {
    console.log('✅ Component name from function:', functionMatch[1]);
    return functionMatch[1];
  }

  // ✅ 4. Extrair do filename (sem extensão, PascalCase)
  const fromFilename = filename
    .replace(/\.(tsx?|jsx?)$/, '')
    .replace(/[-_](.)/g, (_, char) => char.toUpperCase())
    .replace(/^(.)/, (char) => char.toUpperCase());
  
  console.log('⚠️ Using filename as component name:', fromFilename);
  return fromFilename || 'Component'; // ← FALLBACK SEGURO
}

function cleanComponentCode(code: string): string {
  let cleaned = code;

  // ✅ 1. Remover imports (não funcionam no browser)
  cleaned = cleaned.replace(/import\s+.*?from\s+['"].*?['"];?\n?/g, '');

  // ✅ 2. Adicionar React global (já está no CDN)
  cleaned = `const { useState, useEffect, useCallback, useMemo, useRef } = React;\n\n${cleaned}`;

  // ✅ 3. Garantir export default (Babel precisa)
  if (!cleaned.includes('export default')) {
    const componentName = detectComponentName(code, 'Component');
    cleaned += `\n\nexport default ${componentName};`;
  }

  // ✅ 4. Remover tipos TypeScript para Babel
  cleaned = cleaned
    .replace(/:\s*React\.FC\s*<?.*?>?/g, '')
    .replace(/:\s*JSX\.Element/g, '')
    .replace(/:\s*string\b/g, '')
    .replace(/:\s*number\b/g, '')
    .replace(/:\s*boolean\b/g, '')
    .replace(/<\w+>\(/g, '('); // Remover generics

  return cleaned;
}
