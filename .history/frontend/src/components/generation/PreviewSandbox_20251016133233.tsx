// frontend/src/components/generation/PreviewSandbox.tsx

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Loader2, RefreshCw, CheckCircle } from 'lucide-react';

interface PreviewSandboxProps {
  code: string;
  className?: string;
}

/**
 * PreviewSandbox V5.0 - UNIVERSAL React Preview (DEFINITIVO)
 * 
 * ✅ DETECTA: export default App → preserva nome
 * ✅ HANDLES: Multi-file, TypeScript, CSS, arrow functions
 * ✅ WORKS: Com QUALQUER código gerado
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
      // ✅ EXTRACT CSS
      const cssMatches = code.matchAll(/``````/g);
      const allCSS = Array.from(cssMatches).map(m => m[1]).join('\n\n');

      // ✅ MERGE ALL TYPESCRIPT/TSX BLOCKS
      const tsxMatches = code.matchAll(/``````/g);
      let mergedCode = Array.from(tsxMatches).map(m => m[1]).join('\n\n');

      // ✅ DETECT DEFAULT EXPORT COMPONENT NAME
      const defaultExportMatch = mergedCode.match(/export\s+default\s+(\w+)/);
      const mainComponentName = defaultExportMatch ? defaultExportMatch[1] : null;

      // ✅ CLEAN CODE FOR BABEL
      mergedCode = mergedCode
        // Remove ALL imports
        .replace(/import\s+.*?from\s+['"].*?['"];?\n?/g, '')
        // Remove export keywords from interfaces/types
        .replace(/export\s+(interface|type)\s+/g, '$1 ')
        // Fix TypeScript generic syntax
        .replace(/:\s*React\.FC<{[^}]+}>/g, '')
        // Remove export from const/function (but keep component definitions)
        .replace(/export\s+const\s+(\w+)/g, 'const $1')
        .replace(/export\s+function\s+(\w+)/g, 'function $1')
        // Keep export default for now (will use it to detect component)
        .trim();

      // ✅ IF NO DEFAULT EXPORT FOUND, TRY TO DETECT LAST COMPONENT
      let componentToRender = mainComponentName;
      
      if (!componentToRender) {
        const allComponents = [];
        const componentRegex = /(?:const|function)\s+(\w+)(?:\s*:\s*React\.FC)?(?:<[^>]+>)?\s*=?\s*(?:\(|{)/g;
        let match;
        while ((match = componentRegex.exec(mergedCode)) !== null) {
          // Ignore lowercase (utilities) and all caps (CONSTANTS)
          const name = match[1];
          if (name[0] === name[0].toUpperCase() && name !== name.toUpperCase()) {
            allComponents.push(name);
          }
        }
        componentToRender = allComponents[allComponents.length - 1] || 'App';
      }

      // ✅ NOW REMOVE export default
      mergedCode = mergedCode.replace(/export\s+default\s+\w+;?/g, '');

      console.log('🎯 Component to render:', componentToRender);
      console.log('📦 Code length:', mergedCode.length);

      // ✅ HTML TEMPLATE
      const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      padding: 20px;
      background: #f9fafb;
    }
    #root {
      width: 100%;
      min-height: 100vh;
    }
    
    /* User CSS */
    ${allCSS}
  </style>
  
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone@7.23.5/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>
  
  <script type="text/babel">
    const { useState, useEffect } = React;
    
    ${mergedCode}
    
    // ✅ RENDER COMPONENT
    const rootElement = document.getElementById('root');
    if (rootElement) {
      try {
        const root = ReactDOM.createRoot(rootElement);
        
        // ✅ GET COMPONENT BY NAME
        const ComponentToRender = ${componentToRender};
        
        if (!ComponentToRender) {
          throw new Error('Component "${componentToRender}" not found in code');
        }
        
        console.log('✅ Rendering:', '${componentToRender}');
        root.render(<ComponentToRender />);
        
      } catch (err) {
        console.error('❌ Render error:', err);
        rootElement.innerHTML = \`
          <div style="padding: 20px; background: #fee2e2; border: 2px solid #dc2626; border-radius: 8px; max-width: 800px;">
            <h2 style="color: #dc2626; margin-bottom: 12px; font-size: 18px;">❌ Preview Error</h2>
            <div style="background: white; padding: 12px; border-radius: 4px; margin-bottom: 12px;">
              <pre style="color: #991b1b; font-size: 13px; overflow-x: auto; margin: 0;">\${err.toString()}</pre>
            </div>
            <details style="font-size: 12px; color: #7f1d1d;">
              <summary style="cursor: pointer; font-weight: 600; margin-bottom: 8px;">🔍 Debug Info</summary>
              <div style="background: white; padding: 12px; border-radius: 4px; margin-top: 8px;">
                <p><strong>Component:</strong> ${componentToRender}</p>
                <p><strong>Error:</strong> \${err.message}</p>
                <p><strong>Stack:</strong></p>
                <pre style="font-size: 11px; overflow-x: auto; margin-top: 4px;">\${err.stack}</pre>
              </div>
            </details>
          </div>
        \`;
      }
    }
  </script>
  
  <script>
    window.onerror = function(message, source, lineno, colno, error) {
      console.error('🔴 Global error:', { message, source, lineno, colno, error });
      const root = document.getElementById('root');
      if (root && !root.innerHTML.includes('Preview Error')) {
        root.innerHTML = \`
          <div style="padding: 20px; background: #fee2e2; border: 2px solid #dc2626; border-radius: 8px; max-width: 800px;">
            <h2 style="color: #dc2626; margin-bottom: 12px; font-size: 18px;">❌ Runtime Error</h2>
            <div style="background: white; padding: 12px; border-radius: 4px;">
              <pre style="color: #991b1b; font-size: 13px; overflow-x: auto; margin: 0;">\${message}</pre>
            </div>
            <p style="margin-top: 12px; font-size: 12px; color: #7f1d1d;">
              <strong>Location:</strong> Line \${lineno}, Column \${colno}
            </p>
          </div>
        \`;
      }
      return true;
    };
    
    console.log('✅ Preview sandbox loaded successfully');
  </script>
</body>
</html>
      `;

      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();

      setIsLoading(false);

    } catch (err: any) {
      console.error('❌ Preview Setup Error:', err);
      setError(err.message || 'Unknown preview error');
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
          textAlign: 'center',
          zIndex: 10
        }}>
          <div style={{
            padding: '20px',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>⏳ Loading preview...</div>
            <div style={{ fontSize: '12px', color: '#999' }}>Compiling React components</div>
          </div>
        </div>
      )}
      
      {error && (
        <div style={{
          padding: '20px',
          backgroundColor: '#fee2e2',
          border: '2px solid #dc2626',
          borderRadius: '8px',
          color: '#7f1d1d'
        }}>
          <h3 style={{ marginBottom: '10px', color: '#dc2626' }}>❌ Preview Setup Error</h3>
          <pre style={{
            fontSize: '12px',
            overflow: 'auto',
            background: 'white',
            padding: '12px',
            borderRadius: '4px',
            color: '#991b1b'
          }}>{error}</pre>
        </div>
      )}
      
      <iframe
        ref={iframeRef}
        title="Preview"
        sandbox="allow-scripts allow-same-origin"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          backgroundColor: 'white',
          display: error ? 'none' : 'block'
        }}
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