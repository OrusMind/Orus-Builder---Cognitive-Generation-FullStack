// frontend/src/components/generation/PreviewSandbox.tsx

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Loader2, RefreshCw, CheckCircle } from 'lucide-react';

interface PreviewSandboxProps {
  code: string;
  className?: string;
}

/**
 * PreviewSandbox V8.0 - FINAL SOLUTION
 * 
 * Handles: Markdown blocks, imports, multiple files, TypeScript
 */
const PreviewSandbox: React.FC<PreviewSandboxProps> = ({ code, className = '' }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!code || !iframeRef.current) return;

    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

    if (!iframeDoc) {
      setError('Failed to access iframe document');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let cleanCode = code;

      // ✅ STEP 1: REMOVE MARKDOWN BLOCKS (if present)
      if (cleanCode.includes('```
        // Extract all code from markdown blocks
        const codeBlocks = cleanCode.matchAll(/```(?:typescript|tsx|javascript|jsx)?\n([\s\S]*?)```
        const extractedBlocks = Array.from(codeBlocks).map(match => match);[1]
        
        if (extractedBlocks.length > 0) {
          cleanCode = extractedBlocks.join('\n\n');
        }
      }

      // ✅ STEP 2: REMOVE ALL IMPORTS (won't work in iframe)
      cleanCode = cleanCode
        .replace(/import\s+.*?from\s+['"].*?['"];?\n?/g, '')
        .replace(/import\s+type\s+.*?from\s+['"].*?['"];?\n?/g, '')
        .trim();

      // ✅ STEP 3: DETECT MAIN COMPONENT (from export default)
      const exportMatches = cleanCode.matchAll(/export\s+default\s+(\w+)/g);
      const allExports = Array.from(exportMatches).map(m => m);[1]
      const componentName = allExports[allExports.length - 1] || 'App';

      // ✅ STEP 4: REMOVE EXPORT KEYWORDS (but keep component definitions)
      cleanCode = cleanCode
        .replace(/export\s+default\s+\w+;?/g, '')
        .replace(/export\s+(interface|type|class|const|function)\s+/g, '$1 ')
        .trim();

      console.log('🎯 Component:', componentName);
      console.log('📦 Code length:', cleanCode.length);
      console.log('📝 Preview (first 300):', cleanCode.substring(0, 300));

      // ✅ HTML TEMPLATE
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; 
      padding: 20px; 
      background: #f9fafb;
    }
    #root { width: 100%; min-height: 100vh; }
    button {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      margin: 0 4px;
      font-size: 14px;
    }
    button:hover { background: #2563eb; }
    ul { list-style: none; padding: 0; }
    li { 
      background: white; 
      margin: 8px 0; 
      padding: 12px; 
      border-radius: 8px; 
      border: 1px solid #e5e7eb;
    }
    h1 { color: #1f2937; margin-bottom: 16px; }
    h2 { color: #374151; margin-bottom: 8px; }
  </style>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone@7.23.5/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>
  
  <script type="text/babel">
    const { useState, useEffect } = React;
    
    ${cleanCode}
    
    // Render
    const rootElement = document.getElementById('root');
    const root = ReactDOM.createRoot(rootElement);
    
    try {
      const Component = typeof ${componentName} !== 'undefined' ? ${componentName} : null;
      
      if (!Component) {
        throw new Error('Component "${componentName}" not found. Available: ' + Object.keys(window).filter(k => /^[A-Z]/.test(k)).join(', '));
      }
      
      if (typeof Component !== 'function') {
        throw new Error('${componentName} is not a component (type: ' + typeof Component + ')');
      }
      
      root.render(<Component />);
      console.log('✅ Rendered:', '${componentName}');
      
    } catch (err) {
      console.error('❌ Render error:', err);
      rootElement.innerHTML = \`
        <div style="padding: 20px; background: #fef2f2; border: 2px solid #ef4444; border-radius: 12px; max-width: 800px;">
          <h2 style="color: #dc2626; margin-bottom: 12px;">❌ Preview Error</h2>
          <div style="background: white; padding: 16px; border-radius: 8px; margin-bottom: 12px;">
            <pre style="color: #991b1b; font-size: 13px; overflow-x: auto; white-space: pre-wrap; margin: 0;">\${err.toString()}</pre>
          </div>
          <details style="font-size: 13px;">
            <summary style="cursor: pointer; font-weight: 600; margin-bottom: 8px; color: #7f1d1d;">🔍 Debug Info</summary>
            <div style="background: white; padding: 12px; border-radius: 8px; margin-top: 8px;">
              <p><strong>Target:</strong> ${componentName}</p>
              <p><strong>Message:</strong> \${err.message}</p>
              <p><strong>All exports found:</strong> ${allExports.join(', ')}</p>
            </div>
          </details>
        </div>
      \`;
    }
  </script>
  
  <script>
    window.onerror = (msg, url, line) => {
      console.error('🔴 Global error:', msg, 'at line', line);
      return true;
    };
  </script>
</body>
</html>
      `;

      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();

      setIsLoading(false);

    } catch (err: any) {
      console.error('❌ Setup error:', err);
      setError(err.message);
      setIsLoading(false);
    }
  }, [code]);

  return (
    <div className={`preview-sandbox ${className}`} style={{ position: 'relative', width: '100%', height: '100%' }}>
      {isLoading && (
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
            ⏳ Loading Preview
          </div>
          <div style={{ fontSize: '13px', color: '#9ca3af' }}>
            Compiling components...
          </div>
        </div>
      )}
      
      {error && (
        <div style={{ 
          padding: 20, 
          background: '#fef2f2', 
          border: '2px solid #ef4444', 
          borderRadius: 12,
          margin: 20
        }}>
          <h3 style={{ color: '#dc2626', marginBottom: 12 }}>Setup Error</h3>
          <pre style={{ fontSize: 12, overflow: 'auto', background: 'white', padding: 16, borderRadius: 8 }}>
            {error}
          </pre>
        </div>
      )}
      
      <iframe
        ref={iframeRef}
        title="Preview"
        sandbox="allow-scripts allow-same-origin"
        style={{ width: '100%', height: '100%', border: 'none', display: error ? 'none' : 'block' }}
      />
    </div>
  );
};

export default PreviewSandbox;
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


// ═══════════════════════════════════════════════════════════════
// ✅ PASSO 1: EXTRAIR PRIMEIRO ARQUIVO
// ═══════════════════════════════════════════════════════════════
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
// PASSO 5: ADICIONAR REACT GLOBALS
cleaned = `const { useState, useEffect, useCallback, useMemo, useRef } = React;\n\n${cleaned}`;
console.log('✅ Step 5: Added React globals at top');

// ═══════════════════════════════════════════════════════════════
// ✅ PASSO 5.5: REMOVER GENERICS ISOLADOS
// ═══════════════════════════════════════════════════════════════
// Remove generics soltos após remover React.FC:
//   const Post <PostProps> = (...) → const Post = (...)
//   const Component<Props> = (...) → const Component = (...)
//   function Comp <Props>(...) → function Comp (...)

cleaned = cleaned
  .replace(/(\w+)\s*<[A-Z]\w+>\s*=/g, '$1 =')  // Com espaço
  .replace(/(\w+)<[A-Z]\w+>\s*=/g, '$1 =')     // Sem espaço
  .replace(/(\w+)\s*<[A-Z]\w+>\s*\(/g, '$1('); // Functions

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