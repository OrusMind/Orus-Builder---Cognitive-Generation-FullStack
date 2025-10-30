// frontend/src/components/generation/PreviewSandbox.tsx

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
      return undefined; // ✅ Return explícito
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

      return undefined; // ✅ Return quando iframe não existe
    } catch (err: any) {
      console.error('❌ PreviewSandbox: Erro:', err);
      setError(err.message || 'Erro desconhecido');
      setLoading(false);
      setSuccess(false);
      return undefined; // ✅ Return no catch
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
// 🔧 HELPER FUNCTIONS
// ═════════════════════════════════════════════════════════════════════════

function generatePreviewHTML(code: string, filename: string): string {
  let componentName = detectComponentName(code, filename); // ✅ let em vez de const

  // ✅ FALLBACK DEFINITIVO
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
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview - ${componentName}</title>
  
  <script src="https://cdn.tailwindcss.com"></script>
  <script crossorigin src="https://unpkg.com/react@18.3.1/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone@7.24.0/babel.min.js"></script>
  
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }
    #root { width: 100vw; min-height: 100vh; }
    .preview-error {
      padding: 2rem;
      background: #fee2e2;
      color: #dc2626;
      font-family: 'Courier New', monospace;
      white-space: pre-wrap;
      border-left: 4px solid #dc2626;
    }
  </style>
</head>
<body>
  <div id="root">
    <div style="padding: 2rem; text-align: center; color: #666;">
      <div style="display: inline-block; width: 40px; height: 40px; border: 4px solid #ddd; border-top-color: #6366f1; border-radius: 50%; animation: spin 1s linear infinite;"></div>
      <p style="margin-top: 1rem;">Transpilando código...</p>
    </div>
  </div>

  <style>
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>

  <script type="text/babel" data-type="module">
    ${cleanCode}

    const rootElement = document.getElementById('root');
    const root = ReactDOM.createRoot(rootElement);
    
    try {
      const ComponentToRender = ${componentName};
      
      if (!ComponentToRender) {
        throw new Error('Component "${componentName}" is undefined! Check export default.');
      }

      console.log('✅ Rendering component:', '${componentName}');
      root.render(React.createElement(ComponentToRender));
      console.log('✅ Component rendered successfully!');
      
    } catch (error) {
      console.error('❌ Render error:', error);
      rootElement.innerHTML = \`
        <div class="preview-error">
          <h3 style="font-size: 1.5rem; margin-bottom: 1rem; font-weight: bold;">
            ❌ Erro ao Renderizar Componente
          </h3>
          <p style="margin-bottom: 1rem;">
            <strong>Componente:</strong> ${componentName}
          </p>
          <p style="margin-bottom: 1rem;">
            <strong>Erro:</strong> \${error.message}
          </p>
          <details style="margin-top: 1rem;">
            <summary style="cursor: pointer; font-weight: bold;">Stack Trace</summary>
            <pre style="margin-top: 0.5rem; padding: 1rem; background: #fef2f2; border-radius: 0.5rem; overflow-x: auto;">\${error.stack}</pre>
          </details>
        </div>
      \`;
    }
  </script>
</body>
</html>
  `;
}

function detectComponentName(code: string, filename: string): string {
  // 1. Export default
  const exportDefaultMatch = code.match(/export\s+default\s+(?:function\s+)?(\w+)/);
  if (exportDefaultMatch && exportDefaultMatch[1]) {
    console.log('✅ Component name from export default:', exportDefaultMatch[1]);
    return exportDefaultMatch[1];
  }

  // 2. Const declaration
  const constMatch = code.match(/const\s+([A-Z]\w+)\s*[:=]\s*(?:\(\)|React\.FC|.*?=>)/);
  if (constMatch && constMatch[1]) {
    console.log('✅ Component name from const:', constMatch[1]);
    return constMatch[1];
  }

  // 3. Function declaration
  const functionMatch = code.match(/function\s+([A-Z]\w+)\s*\(/);
  if (functionMatch && functionMatch[1]) {
    console.log('✅ Component name from function:', functionMatch[1]);
    return functionMatch[1];
  }

  // 4. From filename
  const fromFilename = filename
    .replace(/\.(tsx?|jsx?)$/, '')
    .replace(/[-_](.)/g, (_, char) => char.toUpperCase())
    .replace(/^(.)/, (char) => char.toUpperCase());
  
  console.log('⚠️ Using filename as component name:', fromFilename);
  return fromFilename || 'Component';
}



/**
 * Limpa código TypeScript para compatibilidade com Babel
 * Remove imports, generics, type annotations, múltiplos componentes
 */
/**
 * Limpa código TypeScript para compatibilidade com Babel
 * CORRIGE: Detecta o componente CORRETO do export default ANTES de remover
 */
function cleanComponentCode(code: string): string {
  let cleaned = code;
  
  console.log('🧹 Starting code cleaning...');
  console.log('Original code length:', code.length);

  // ✅ PASSO 0: DETECTAR NOME DO COMPONENTE DO 'export default' ORIGINAL
  // FAZER ISSO ANTES de remover o export!
  let mainComponentName = '';
  const exportDefaultMatch = code.match(/export\s+default\s+(\w+);?/);
  if (exportDefaultMatch && exportDefaultMatch[1]) {
    mainComponentName = exportDefaultMatch[1];
    console.log('✅ Step 0: Detected main component from export default:', mainComponentName);
  }

  // ✅ PASSO 1: DETECTAR SE É MÚLTIPLOS ARQUIVOS
  const hasMultipleFiles = code.includes('// components/') || 
                           code.includes('// pages/') || 
                           code.includes('// App.tsx');
  
  if (hasMultipleFiles) {
    console.warn('⚠️ Multiple files detected! Extracting FIRST file only.');
    
    const firstFileRegex = /(\/\/\s*\w+\.tsx[\s\S]*?)(?=\/\/\s*\w+\.tsx|$)/;
    const match = code.match(firstFileRegex);
    
    if (match && match[1]) {
      cleaned = match[1];
      console.log('✅ Extracted first file only. New length:', cleaned.length);
      
      // Redetectar o componente principal do arquivo extraído
      const newExportMatch = cleaned.match(/export\s+default\s+(\w+);?/);
      if (newExportMatch && newExportMatch[1]) {
        mainComponentName = newExportMatch[1];
        console.log('✅ Re-detected component from extracted file:', mainComponentName);
      }
    }
  }
// ✅ PASSO 2: REMOVER TODOS OS IMPORTS (externos E locais)
cleaned = cleaned.replace(/import\s+.*?from\s+['"].*?['"];?\n?/g, '');
console.log('✅ Step 2: Removed ALL imports');

// ✅ PASSO 2.5: REMOVER MARKDOWN FENCES
cleaned = cleaned
  .replace(/`{3}typescript\n?/g, '')
  .replace(/`{3}tsx\n?/g, '')
  .replace(/`{3}javascript\n?/g, '')
  .replace(/`{3}jsx\n?/g, '')
  .replace(/`{3}\n?/g, '');

console.log('✅ Step 2.5: Removed markdown fences');

// ✅ PASSO 3: REMOVER COMENTÁRIOS (// filename.tsx, JSDoc, etc)
cleaned = cleaned
  .replace(/\/\/\s*\w+\.tsx/g, '')
  .replace(/\/\*\*[\s\S]*?\*\//g, '')
  .replace(/\/\*[\s\S]*?\*\//g, '');
  // NÃO remover // comments para preservar URLs

console.log('✅ Step 3: Removed comments (preserving URLs)');

  
  // ✅ PASSO 4: REMOVER INTERFACES E TYPE ALIASES
  cleaned = cleaned.replace(/interface\s+\w+\s*{[^}]*}/gs, '');
  cleaned = cleaned.replace(/type\s+\w+\s*=\s*[^;]+;/g, '');
  console.log('✅ Step 4: Removed interfaces and type aliases');
// ✅ PASSO 5: ADICIONAR REACT GLOBALS
cleaned = `const { useState, useEffect, useCallback, useMemo, useRef } = React;\n\n${cleaned}`;
console.log('✅ Step 5: Added React globals at top');

// ⭐ SUBSTITUIR TODO O PASSO 5.5 POR ESTE CÓDIGO:
// ✅ PASSO 5.5: REMOVER GENERICS ISOLADOS
cleaned = cleaned
  .replace(/(\w+)\s*<[A-Z]\w+>\s*=/g, '$1 =')
  .replace(/(\w+)<[A-Z]\w+>\s*=/g, '$1 =');

console.log('✅ Step 5.5: Removed isolated generics');


// ✅ PASSO 6: REMOVER GENERICS TYPESCRIPT (preservando JSX)
cleaned = cleaned
  .replace(/useState<[^>]+>/g, 'useState')
  // ...

  // ✅ PASSO 6: REMOVER GENERICS TYPESCRIPT (<Type>) - VERSÃO SEGURA
// Remove hooks com generics
cleaned = cleaned
  .replace(/useState<[^>]+>/g, 'useState')
  .replace(/useEffect<[^>]+>/g, 'useEffect')
  .replace(/useMemo<[^>]+>/g, 'useMemo')
  .replace(/useCallback<[^>]+>/g, 'useCallback')
  .replace(/useRef<[^>]+>/g, 'useRef')
  .replace(/useContext<[^>]+>/g, 'useContext')
  .replace(/createContext<[^>]+>/g, 'createContext');

// Remove generics em type annotations (não JSX!)
// Formato: : Type<Generic> ou as Type<Generic>
cleaned = cleaned
  .replace(/:\s*[A-Z]\w+<[^>]+>/g, '')  // Remove : Product<T>
  .replace(/\bas\s+[A-Z]\w+<[^>]+>/g, '');  // Remove as Product<T>

// ⚠️ NÃO usar .replace(/<[^>]+>/g, '') - isso quebra JSX!

console.log('✅ Step 6: Removed generics (preserving JSX)');

// ✅ PASSO 7: REMOVER TYPE ANNOTATIONS
cleaned = cleaned
  .replace(/:\s*React\.FC\s*/g, ' ')
  .replace(/:\s*JSX\.Element/g, '')
  
  // Remove tipos primitivos
  .replace(/:\s*string\b/g, '')
  .replace(/:\s*number\b/g, '')
  .replace(/:\s*boolean\b/g, '')
  .replace(/:\s*any\b/g, '')
  .replace(/:\s*void\b/g, '')
  
  // ⭐ NOVO: Corrigir event.FormEvent → event: React.FormEvent
  .replace(/\(event\.FormEvent<([^>]+)>\)/g, '(event: React.FormEvent<$1>)')
  .replace(/\(event\.ChangeEvent<([^>]+)>\)/g, '(event: React.ChangeEvent<$1>)')
  .replace(/\(event\.MouseEvent<([^>]+)>\)/g, '(event: React.MouseEvent<$1>)')
  
  // Remove union types
  .replace(/:\s*Error\s*\|\s*null/g, '')
  .replace(/:\s*[A-Z]\w+\s*\|\s*null/g, '')
  
  // Remove arrays COM tipo (ORDEM IMPORTA!)
  .replace(/:\s*[A-Z]\w+\[\]/g, '')
  
  // Remove inline object types
  .replace(/:\s*\{[^}]+\}/g, '')
  
  // Remove tipos simples
  .replace(/:\s*[A-Z]\w+\b/g, '');

console.log('✅ Step 7: Removed type annotations (preserving events)');


// Usar regex que SÓ matcha espaços horizontais, NÃO quebras de linha
cleaned = cleaned.replace(/ {2,}/g, ' '); // ✅ CORRETO
console.log('✅ Step 7.5: Cleaned up whitespace');

  // ✅ PASSO 8: REMOVER PARAMETER TYPES
  cleaned = cleaned
    .replace(/\((\w+):\s*[A-Z]\w+(\[\])?\)/g, '($1)')
    .replace(/,\s*(\w+):\s*[A-Z]\w+(\[\])?/g, ', $1');
  
  console.log('✅ Step 8: Removed parameter types');

  // ✅ PASSO 9: REMOVER RETURN TYPES
  cleaned = cleaned.replace(/\):\s*[A-Z]\w+(\[\])?\s*=>/g, ') =>');
  console.log('✅ Step 9: Removed return types');

  // ✅ PASSO 10: REMOVER TYPE ASSERTIONS
  cleaned = cleaned.replace(/\s+as\s+[A-Z]\w+/g, '');
  console.log('✅ Step 10: Removed type assertions');

  // ✅ PASSO 11: REMOVER TODOS OS 'export default' EXISTENTES
  cleaned = cleaned.replace(/export\s+default\s+\w+;?/g, '');
  console.log('✅ Step 11: Removed all existing export default statements');

  // ✅ PASSO 12: ADICIONAR EXPORT DEFAULT DO COMPONENTE CORRETO
if (!mainComponentName) {
  mainComponentName = detectComponentName(cleaned, 'Component');
  console.log('⚠️ Fallback: Using detectComponentName:', mainComponentName);
}

if (mainComponentName) {
  cleaned = cleaned.trim() + `

export default ${mainComponentName};`;
  console.log('✅ Step 12: Added export default for MAIN component:', mainComponentName);
} else {
  console.error('❌ Could not detect component name!');
}

// ⭐ ADICIONAR ESTE LOG AQUI:
console.log('📋 CLEANED CODE (primeiras 20 linhas):');
const lines = cleaned.split('\n');
lines.slice(0, 20).forEach((line, i) => {
  console.log(`${i+1}: ${line}`);
});
console.log('...');
console.log(`TOTAL LINES: ${lines.length}`);
// ⭐ FIM DO LOG

console.log('✅ Code cleaned successfully! Final length:', cleaned.length);
return cleaned;
}