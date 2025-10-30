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

function detectComponentName(code: string, filename: string): string | null {
  // Ordem 1: export default ComponentName
  const exportDefaultMatch = code.match(/export\s+default\s+(\w+)/);
  if (exportDefaultMatch && exportDefaultMatch[1]) {
    console.log('🔍 Detected from export default:', exportDefaultMatch[1]);
    return exportDefaultMatch[1];
  }

  // Ordem 2: const ComponentName = () => { ... }
  const constComponentMatch = code.match(/const\s+([A-Z]\w+)\s*=\s*\(/);
  if (constComponentMatch && constComponentMatch[1]) {
    console.log('🔍 Detected from const:', constComponentMatch[1]);
    return constComponentMatch[1];
  }

  // Ordem 3: function ComponentName() { ... }
  const functionComponentMatch = code.match(/function\s+([A-Z]\w+)\s*\(/);
  if (functionComponentMatch && functionComponentMatch[1]) {
    console.log('🔍 Detected from function:', functionComponentMatch[1]);
    return functionComponentMatch[1];
  }

  // Ordem 4: Nome do arquivo (fallback)
  const filenameMatch = filename.match(/([A-Z]\w+)\.tsx?/);
  if (filenameMatch && filenameMatch[1]) {
    console.log('🔍 Detected from filename:', filenameMatch[1]);
    return filenameMatch[1];
  }

  console.error('❌ Could not detect component name!');
  return null; // ✅ ADICIONAR ESTA LINHA
}



/**
 * Limpa código TypeScript para compatibilidade com Babel
 * CORRIGE: Detecta o componente CORRETO do export default ANTES de remover
 */
function cleanComponentCode(code: string): string {
  let cleaned = code;
  
  console.log('🧹 Starting code cleaning...');
  console.log('Original code length:', code.length);
// ✅ PASSO 0: DETECTAR COMPONENTE PRINCIPAL
let mainComponentName = '';
const exportDefaultMatch = code.match(/export\s+default\s+(\w+)/);
if (exportDefaultMatch) {
  mainComponentName = exportDefaultMatch[1] || '';
  console.log('✅ Step 0: Detected main component from export default:', mainComponentName);
}

// ═══════════════════════════════════════════════════════════════
// ✅ PASSO 0.5: COMBINAR MÚLTIPLOS ARQUIVOS
// ═══════════════════════════════════════════════════════════════
if (cleaned.includes('// ') && (cleaned.match(/\/\/ \w+\.tsx/g) || []).length > 1) {
  console.log('📦 Multiple files detected, combining into single file...');
  
  cleaned = cleaned.replace(/\/\/ \w+\.tsx\n?/g, '');
  cleaned = cleaned.replace(/^import .+ from ['"]\.\/.+['"'];?\n?/gm, '');
  
  const exportDefaults = cleaned.match(/export default \w+;/g) || [];
  if (exportDefaults.length > 1) {
    for (let i = 0; i < exportDefaults.length - 1; i++) {
      cleaned = cleaned.replace(exportDefaults[i]!, '');
    }
    console.log(`  Merged ${exportDefaults.length} export defaults into one`);
  }
  
  // ⭐ ADICIONAR ESTE FIX:
  // Fix useEffect com dependência circular que causa loops infinitos
  cleaned = cleaned.replace(
    /useEffect\(\(\) => \{[\s\S]*?setCart\(\{ \.\.\.cart, total \}\);[\s\S]*?\}, \[cart\]\);/g,
    '// Total calculado inline no render, não precisa useEffect'
  );
  
  console.log('✅ Step 0.5: Combined multiple files and fixed circular dependencies');
} else {
  console.log('✅ Step 0.5: Single file detected');
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎨 PROCESS CODE - REMOVE TYPESCRIPT, ADD REACT GLOBALS, PREPARE FOR BABEL
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * OBJETIVO: Converter TypeScript React para JavaScript puro (Babel-safe)
 * 
 * FLUXO:
 * 1. Remove separadores de arquivos múltiplos
 * 2. Remove imports (externos e locais)
 * 3. Remove markdown code fences
 * 4. Remove 'export' keywords
 * 5. Remove comentários (JSDoc, inline, file headers)
 * 6. Remove interfaces e types
 * 7. Adiciona React globals (useState, useEffect, etc)
 * 8. Remove generics isolados (órfãos)
 * 9. Remove generics TypeScript (hooks, types)
 * 10. Remove type annotations (: string, : number, etc)
 * 11. Remove type assertions (as any, as typeof, etc)
 * 12. Remove linhas vazias
 * 13. Remove parameter types
 * 14. Remove return types
 * 15. Remove todos 'export default'
 * 16. Adiciona export default correto
 * 17. Debug log (primeiras 20 linhas)
 * 
 * @param {string} code - Código TypeScript bruto da AI
 * @param {string} filename - Nome do arquivo (para detectar component)
 * @returns {string} - Código JavaScript limpo (Babel-safe)
 */
function processCode(code: string, filename: string): string {
  let cleaned = code.trim();
  
  // ═══════════════════════════════════════════════════════════════
  // 🔧 PASSO 1: REMOVER SEPARADORES DE ARQUIVOS MÚLTIPLOS
  // ═══════════════════════════════════════════════════════════════
  console.log('🔧 Step 1: Removing file separator comments...');
  cleaned = cleaned
    .replace(/\/\/\s*src\/[^\n]+\n/g, '')       // Remove // src/types/dashboard.ts
    .replace(/\/\*\s*src\/[^\*]+\*\//g, '')     // Remove /* src/types/dashboard.ts */
    .replace(/\/\/\s*File:\s*[^\n]+\n/g, '')    // Remove // File: dashboard.ts
    .replace(/\/\*\s*File:\s*[^\*]+\*\//g, ''); // Remove /* File: dashboard.ts */
  console.log('✅ Step 1: File separator comments removed');

  // ═══════════════════════════════════════════════════════════════
  // 🚫 PASSO 2: REMOVER TODOS OS IMPORTS
  // ═══════════════════════════════════════════════════════════════
  console.log('🔧 Step 2: Removing ALL imports...');
  cleaned = cleaned.replace(/import\s+.*?from\s+['"].*?['"];?\n?/g, '');
  console.log('✅ Step 2: Removed ALL imports');

  // ═══════════════════════════════════════════════════════════════
  // 📋 PASSO 3: REMOVER MARKDOWN CODE FENCES
  // ═══════════════════════════════════════════════════════════════
  console.log('🔧 Step 3: Removing markdown code fences...');
  cleaned = cleaned
    .replace(/`{3}typescript\n?/g, '')
    .replace(/`{3}tsx\n?/g, '')
    .replace(/`{3}javascript\n?/g, '')
    .replace(/`{3}jsx\n?/g, '')
    .replace(/`{3}\n?/g, '');
  console.log('✅ Step 3: Removed markdown fences');

  // ═══════════════════════════════════════════════════════════════
  // 🚫 PASSO 4: REMOVER 'export' DE DECLARAÇÕES
  // ═══════════════════════════════════════════════════════════════
  console.log('🔧 Step 4: Removing "export" keywords...');
  cleaned = cleaned
    .replace(/export\s+(interface|type|const|function|class|enum)\s+/g, '$1 ')
    .replace(/^\s*\n/gm, ''); // Remove linhas vazias resultantes
  console.log('✅ Step 4: Removed "export" keywords');

  // ═══════════════════════════════════════════════════════════════
  // 💬 PASSO 5: REMOVER COMENTÁRIOS
  // ═══════════════════════════════════════════════════════════════
  console.log('🔧 Step 5: Removing comments...');
  cleaned = cleaned
    .replace(/\/\/\s*\w+\.tsx/g, '')          // Remove // filename.tsx
    .replace(/\/\*\*[\s\S]*?\*\//g, '')       // Remove JSDoc /** ... */
    .replace(/\/\*[\s\S]*?\*\//g, '');        // Remove /* ... */
  console.log('✅ Step 5: Removed comments (preserving URLs)');

  // ═══════════════════════════════════════════════════════════════
  // 🔷 PASSO 6: REMOVER INTERFACES E TYPE ALIASES
  // ═══════════════════════════════════════════════════════════════
  console.log('🔧 Step 6: Removing interfaces and type aliases...');
  cleaned = cleaned
    .replace(/interface\s+\w+\s*{[^}]*}/gs, '')  // Remove interface X { ... }
    .replace(/type\s+\w+\s*=\s*[^;]+;/g, '');    // Remove type X = ...;
  console.log('✅ Step 6: Removed interfaces and type aliases');

  // ═══════════════════════════════════════════════════════════════
  // ⚛️ PASSO 7: ADICIONAR REACT GLOBALS
  // ═══════════════════════════════════════════════════════════════
  console.log('🔧 Step 7: Adding React globals...');
  cleaned = `const { useState, useEffect, useCallback, useMemo, useRef } = React;\n\n${cleaned}`;
  console.log('✅ Step 7: Added React globals at top');

  // ═══════════════════════════════════════════════════════════════
  // 🔷 PASSO 8: REMOVER GENERICS ISOLADOS (ÓRFÃOS)
  // ═══════════════════════════════════════════════════════════════
  console.log('🔧 Step 8: Removing isolated generics...');
  cleaned = cleaned
    // Component <Props> = ... → Component = ...
    .replace(/(\w+)\s*<\{[^}]+\}>\s*=/g, '$1 =')     // Component <{ prop }> = ...
    .replace(/(\w+)\s*<[A-Z]\w+>\s*=/g, '$1 =')      // Component <Props> = ...
    .replace(/(\w+)<\{[^}]+\}>\s*=/g, '$1 =')        // Component<{ prop }> = ...
    .replace(/(\w+)<[A-Z]\w+>\s*=/g, '$1 =')         // Component<Props> = ...
    // function<Props>(...) → function(...)
    .replace(/(\w+)\s*<[A-Z]\w+>\s*\(/g, '$1(')      // function<Props>(...)
    .replace(/(\w+)\s*<\{[^}]+\}>\s*\(/g, '$1(');    // function<{ prop }>(...)
  console.log('✅ Step 8: Removed ALL isolated generics');

  // ═══════════════════════════════════════════════════════════════
  // 🔷 PASSO 9: REMOVER GENERICS TYPESCRIPT (HOOKS, TYPES)
  // ═══════════════════════════════════════════════════════════════
  console.log('🔧 Step 9: Removing TypeScript generics...');
  cleaned = cleaned
    .replace(/useState<[^>]+>/g, 'useState')
    .replace(/useEffect<[^>]+>/g, 'useEffect')
    .replace(/useMemo<[^>]+>/g, 'useMemo')
    .replace(/useCallback<[^>]+>/g, 'useCallback')
    .replace(/useRef<[^>]+>/g, 'useRef')
    .replace(/useContext<[^>]+>/g, 'useContext')
    .replace(/createContext<[^>]+>/g, 'createContext')
    .replace(/:\s*[A-Z]\w+<[^>]+>/g, '')           // Remove : Product<T>
    .replace(/\bas\s+[A-Z]\w+<[^>]+>/g, '');       // Remove as Product<T>
  console.log('✅ Step 9: Removed generics (preserving JSX)');

  // ═══════════════════════════════════════════════════════════════
  // 🔷 PASSO 10: REMOVER TYPE ANNOTATIONS
  // ═══════════════════════════════════════════════════════════════
  console.log('🔧 Step 10: Removing type annotations...');
  cleaned = cleaned
    .replace(/:\s*React\.FC\s*/g, ' ')               // Remove : React.FC
    .replace(/:\s*JSX\.Element/g, '')                // Remove : JSX.Element
    // Remove tipos primitivos
    .replace(/:\s*string\b/g, '')
    .replace(/:\s*number\b/g, '')
    .replace(/:\s*boolean\b/g, '')
    .replace(/:\s*any\b/g, '')
    .replace(/:\s*void\b/g, '')
    // Remove union types
    .replace(/:\s*Error\s*\|\s*null/g, '')
    .replace(/:\s*[A-Z]\w+\s*\|\s*null/g, '')
    // Remove arrays COM tipo
    .replace(/:\s*[A-Z]\w+\[\]/g, '')
    // Remove inline object types
    .replace(/:\s*\{[^}]+\}/g, '')
    // Remove tipos simples
    .replace(/:\s*[A-Z]\w+\b/g, '');
  console.log('✅ Step 10: Removed type annotations');

  // ═══════════════════════════════════════════════════════════════
  // 🔷 PASSO 11: REMOVER TYPE ASSERTIONS (as any, as typeof, etc)
  // ═══════════════════════════════════════════════════════════════
  console.log('🔧 Step 11: Removing type assertions...');
  cleaned = cleaned
    .replace(/\s+as\s+any\b/g, '')                                      // Remove as any
    .replace(/\s+as\s+typeof\s+[^\s;,)]+/g, '')                         // Remove as typeof import(...)
    .replace(/\s+as\s+[A-Z]\w+/g, '')                                   // Remove as Socket
    .replace(/\s+as\s+\([^)]+\)\s*=>\s*[A-Z]\w+/g, '');                 // Remove as (url, opts?) => Socket
  console.log('✅ Step 11: Removed type assertions');

  // ═══════════════════════════════════════════════════════════════
  // 🧹 PASSO 12: LIMPAR LINHAS VAZIAS
  // ═══════════════════════════════════════════════════════════════
  console.log('🔧 Step 12: Cleaning up whitespace...');
  cleaned = cleaned.replace(/^\s*\n/gm, '');  // Remove linhas vazias
  console.log('✅ Step 12: Cleaned up whitespace');

  // ═══════════════════════════════════════════════════════════════
  // 🔷 PASSO 13: REMOVER PARAMETER TYPES
  // ═══════════════════════════════════════════════════════════════
  console.log('🔧 Step 13: Removing parameter types...');
  cleaned = cleaned
    .replace(/\((\w+):\s*[A-Z]\w+(\[\])?\)/g, '($1)')        // (param: Type) → (param)
    .replace(/,\s*(\w+):\s*[A-Z]\w+(\[\])?/g, ', $1');       // , param: Type → , param
  console.log('✅ Step 13: Removed parameter types');

  // ═══════════════════════════════════════════════════════════════
  // 🔷 PASSO 14: REMOVER RETURN TYPES
  // ═══════════════════════════════════════════════════════════════
  console.log('🔧 Step 14: Removing return types...');
  cleaned = cleaned.replace(/\):\s*[A-Z]\w+(\[\])?\s*=>/g, ') =>');
  console.log('✅ Step 14: Removed return types');

  // ═══════════════════════════════════════════════════════════════
  // 🚫 PASSO 15: REMOVER TODOS OS 'export default' EXISTENTES
  // ═══════════════════════════════════════════════════════════════
  console.log('🔧 Step 15: Removing existing export default...');
  cleaned = cleaned.replace(/export\s+default\s+\w+;?/g, '');
  console.log('✅ Step 15: Removed all existing export default statements');

  // ═══════════════════════════════════════════════════════════════
  // ✅ PASSO 16: ADICIONAR EXPORT DEFAULT DO COMPONENTE CORRETO
  // ═══════════════════════════════════════════════════════════════
  console.log('🔧 Step 16: Adding export default...');
  let mainComponentName = detectComponentName(cleaned, filename);
  
  if (!mainComponentName) {
    mainComponentName = 'Component'; // Fallback genérico
    console.warn('⚠️ Could not detect component name! Using fallback:', mainComponentName);
  }

  cleaned = cleaned.trim() + `\n\nexport default ${mainComponentName};`;
  console.log('✅ Step 16: Added export default for:', mainComponentName);

  // ═══════════════════════════════════════════════════════════════
  // 🐛 PASSO 17: DEBUG LOG (PRIMEIRAS 20 LINHAS)
  // ═══════════════════════════════════════════════════════════════
  console.log('📋 CLEANED CODE (first 20 lines):');
  const lines = cleaned.split('\n');
  lines.slice(0, 20).forEach((line, i) => {
    console.log(`${String(i + 1).padStart(2, '0')}: ${line}`);
  });
  console.log(`... (${lines.length} total lines)`);

  console.log('✅ Code cleaned successfully! Final length:', cleaned.length);
  return cleaned;
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔍 DETECT COMPONENT NAME - IDENTIFICA O COMPONENTE PRINCIPAL
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * ORDEM DE DETECÇÃO:
 * 1. export default ComponentName
 * 2. const ComponentName = () => { ... }
 * 3. function ComponentName() { ... }
 * 4. Nome do arquivo (fallback)
 * 
 * @param {string} code - Código JavaScript limpo
 * @param {string} filename - Nome do arquivo
 * @returns {string | null} - Nome do componente ou null
 */
function detectComponentName(code: string, filename: string): string | null {
  // Ordem 1: export default ComponentName
  const exportDefaultMatch = code.match(/export\s+default\s+(\w+)/);
  if (exportDefaultMatch && exportDefaultMatch[1]) {
    console.log('🔍 Detected from export default:', exportDefaultMatch[1]);
    return exportDefaultMatch[1];
  }

  // Ordem 2: const ComponentName = () => { ... }
  const constComponentMatch = code.match(/const\s+([A-Z]\w+)\s*=\s*\(/);
  if (constComponentMatch && constComponentMatch[1]) {
    console.log('🔍 Detected from const:', constComponentMatch[1]);
    return constComponentMatch[1];
  }

  // Ordem 3: function ComponentName() { ... }
  const functionComponentMatch = code.match(/function\s+([A-Z]\w+)\s*\(/);
  if (functionComponentMatch && functionComponentMatch[1]) {
    console.log('🔍 Detected from function:', functionComponentMatch[1]);
    return functionComponentMatch[1];
  }

  // Ordem 4: Nome do arquivo (fallback)
  const filenameMatch = filename.match(/([A-Z]\w+)\.tsx?/);
  if (filenameMatch && filenameMatch[1]) {
    console.log('🔍 Detected from filename:', filenameMatch[1]);
    return filenameMatch[1];
  }

  console.error('❌ Could not detect component name!');
  return null;
}
}