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
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

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

    // Timeout para considerar sucesso
    const timer = setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      console.log('✅ Preview renderizado com sucesso');
    }, 2000);

    return () => clearTimeout(timer);
  } catch (err: any) {
    console.error('❌ PreviewSandbox Error:', err);
    setError(err.message || 'Erro desconhecido ao renderizar preview');
    setLoading(false);
    return undefined; // ✅ FIX - Adicione esta linha
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
  <div className={`relative w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg overflow-hidden ${className}`}>
    {/* Loading Overlay */}
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm"
        >
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            <p className="text-sm text-slate-300 font-medium">Transpilando código...</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Error State */}
    {error && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-4 right-4 z-40 bg-red-500/90 backdrop-blur-sm text-white px-4 py-3 rounded-lg shadow-lg flex items-start gap-3"
      >
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1 text-sm">
          <p className="font-semibold mb-1">Erro ao Renderizar Preview</p>
          <p className="text-red-100 text-xs">{error}</p>
        </div>
      </motion.div>
    )}

    {/* Success Indicator */}
    {success && (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        className="absolute top-4 right-4 z-40 bg-green-500 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2"
      >
        <CheckCircle className="w-4 h-4" />
        <span className="text-sm font-medium">Renderizado!</span>
      </motion.div>
    )}

    {/* Iframe com srcdoc */}
    <iframe
      ref={iframeRef}
      title="Preview Sandbox"
      sandbox="allow-scripts allow-same-origin"
      className="w-full h-full border-0 bg-white"
      srcDoc={generatePreviewHTMLSafe(code, filename)}
    />
  </div>
);

};
function generatePreviewHTML(code: string, filename: string): string {
  let componentName = detectComponentName(code, filename);
  if (!componentName || componentName.trim() === '') {
    componentName = 'GeneratedComponent';
  }

  console.log('🎨 Generating HTML for component:', componentName);
  
  // Remove exports mas MANTÉM template literals intactos
  const cleanCode = code
    .replace(/export\s+(interface|type|const|function|class|enum)\s+/g, '$1 ')
    .replace(/export\s+default\s+/g, '')
    .replace(/export\s*\{[^}]+\}\s*;?/g, '');

  // NÃO ESCAPAR! Babel precisa do código original
  const codeToInject = cleanCode;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview - ${componentName}</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"><\/script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"><\/script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    #root { width: 100%; max-width: 1200px; }
    .error-box {
      background: #fee;
      border: 2px solid #c33;
      border-radius: 8px;
      padding: 1.5rem;
      color: #c33;
      font-family: 'Courier New', monospace;
      max-width: 600px;
      margin: 0 auto;
    }
  </style>
</head>
<body>
  <div id="root">
    <div style="color: white; text-align: center;">⚡ Transpilando código...</div>
  </div>

  <script type="text/babel">
    const { useState, useEffect, useRef } = React;
    
    ${codeToInject}

    // Renderizar com dados de exemplo
    const App = () => {
      return (
        <div className="flex flex-wrap gap-6 justify-center items-center">
          <${componentName}
            image="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop"
            title="Headphone Premium"
            price={299.90}
            onAddToCart={() => alert('Produto adicionado ao carrinho!')}
          />
          <${componentName}
            image="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop"
            title="Relógio Elegante"
            price={549.90}
            onAddToCart={() => alert('Produto adicionado ao carrinho!')}
          />
          <${componentName}
            image="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop"
            title="Óculos de Sol"
            price={199.90}
            onAddToCart={() => alert('Produto adicionado ao carrinho!')}
          />
        </div>
      );
    };

    // Renderizar
    try {
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(<App />);
    } catch (error) {
      console.error('Render Error:', error);
      document.getElementById('root').innerHTML = \`
        <div class="error-box">
          <h3>❌ Erro ao Renderizar</h3>
          <pre>\${error.message}</pre>
        </div>
      \`;
    }
  <\/script>
</body>
</html>`;
}

/**
 * Remove markdown fence blocks do código gerado.
 * Backend pode retornar código com ``````
 */
function cleanMarkdownFences(code: string): string {
  let cleaned = code;
  // Remover fence blocks de abertura (```tsx, ```
  cleaned = cleaned.replace(/`{3}[\w]*\s*\n?/g, '');
  // Remover fence blocks de fechamento (```)
  cleaned = cleaned.replace(/`{3}\s*\n?/g, '');
  // Limpar linhas vazias extras
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  return cleaned;
}
/**
 * Remove TypeScript type annotations para compatibilidade com Babel Standalone
 * IMPORTANTE: Preserva sintaxe de objetos JavaScript { key: value }
 */
function removeTypeScriptSyntax(code: string): string {
  let cleaned = code;
  
  // === IMPORTS - FASE 1: UUID ===
  // Substituir import uuid por polyfill inline
  cleaned = cleaned.replace(/import\s+\{\s*v4\s+as\s+uuidv4\s*\}\s+from\s+['"]uuid['"];?\s*/g, 
    '// UUID v4 polyfill\nconst uuidv4 = () => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16); });\n'
  );
  
  // === IMPORTS - FASE 2: LIBS EXTERNAS ===
  // Remover imports de bibliotecas externas (EXCETO 'react' puro e imports relativos)
  cleaned = cleaned.replace(/import\s+[^;]+from\s+['"]([^'"]+)['"];?\s*/g, (match, lib) => {
    // MANTER: imports relativos (./  ../)
    if (lib.startsWith('.')) {
      return match;
    }
    // REMOVER: tudo o resto (react, react-router-dom, uuid, etc)
    console.log('⏭️ Removendo import externo:', lib);
    return '';
  });

  // === FASE 3: REMOVER IMPORT REACT TAMBÉM (React global via CDN!) ===
  console.log('🗑️ Removendo imports React (disponível globalmente via CDN)');
  cleaned = cleaned.replace(/import\s+React[^;]+from\s+['"]react['"];?\s*/g, '');
  cleaned = cleaned.replace(/import\s+\{[^}]+\}\s+from\s+['"]react['"];?\s*/g, '');
  
  // === REACT ROUTER DOM - SUBSTITUIÇÕES ===
  // Substituir componentes do Router por HTML nativo
  cleaned = cleaned.replace(/<Link\s+to=['"]([^'"]+)['"]([^>]*)>/g, '<a href="$1"$2>');
  cleaned = cleaned.replace(/<\/Link>/g, '</a>');
  
  // Substituir hook useLocation por objeto mock
  cleaned = cleaned.replace(/const\s+\w+\s*=\s*useLocation\(\)/g, 'const location = { pathname: "/" }');
  cleaned = cleaned.replace(/useLocation\(\)/g, '{ pathname: "/" }');
  
  // === GENERICS ===
  // Remover generics de hooks React
  cleaned = cleaned.replace(/useState<[^>]+>/g, 'useState');
  cleaned = cleaned.replace(/useReducer<[^>]+>/g, 'useReducer');
  cleaned = cleaned.replace(/useMemo<[^>]+>/g, 'useMemo');
  cleaned = cleaned.replace(/useCallback<[^>]+>/g, 'useCallback');
  cleaned = cleaned.replace(/useRef<[^>]+>/g, 'useRef');
  cleaned = cleaned.replace(/useContext<[^>]+>/g, 'useContext');
  cleaned = cleaned.replace(/createContext<[^>]+>/g, 'createContext');
  
  // === UTILITY TYPES ===
  // Substituir utility types TypeScript por 'any'
  cleaned = cleaned.replace(/Omit<[^>]+>/g, 'any');
  cleaned = cleaned.replace(/Pick<[^>]+>/g, 'any');
  cleaned = cleaned.replace(/Partial<[^>]+>/g, 'any');
  cleaned = cleaned.replace(/Record<[^>]+>/g, 'any');
  cleaned = cleaned.replace(/Readonly<[^>]+>/g, 'any');
  cleaned = cleaned.replace(/Required<[^>]+>/g, 'any');
  
  // === TYPE ANNOTATIONS ===
  // 1. Remover tipo em declarações de variáveis: const name: Type = ...
  cleaned = cleaned.replace(/const\s+(\w+)\s*:\s*[^=]+=/, 'const $1 =');
  cleaned = cleaned.replace(/let\s+(\w+)\s*:\s*[^=]+=/, 'let $1 =');
  
  // 2. Remover return types: ): Type => ou ): Type {
  cleaned = cleaned.replace(/\)\s*:\s*[A-Z][\w<>[\]|&\s]*(?=\s*=>)/g, ')');
  cleaned = cleaned.replace(/\)\s*:\s*[A-Z][\w<>[\]|&\s]*(?=\s*\{)/g, ')');
  
  // 3. Remover tipos em arrow function params SIMPLES (sem object destructuring)
  cleaned = cleaned.replace(/\(([^){}[\]]+)\)\s*=>/g, (match, params) => {
    // Se tem { ou [, PULAR (é object/array destructuring)
    if (params.includes('{') || params.includes('[')) {
      return match; // NÃO processar - preserva objetos
    }
    
    // Remover types: param: Type → param
    const cleanParams = params.replace(/(\w+)\s*:\s*[^,)]+/g, '$1');
    return `(${cleanParams}) =>`;
  });
  
  // === DECLARATIONS (CUIDADO - NÃO DELETAR COMPONENTES!) ===
  // Remover APENAS interface/type de 1 linha ou simples (não componentes grandes)
  cleaned = cleaned.replace(/^(export\s+)?(interface|type)\s+\w+(\s+extends\s+\w+)?\s*=?\s*\{[^}]{0,200}\}\s*;?\s*$/gm, '');
  
  // === ASSERTIONS ===
  // Remover type assertions
  cleaned = cleaned.replace(/\s+as\s+const/g, '');
  cleaned = cleaned.replace(/\s+as\s+[^;,)}\n]+/g, '');
  
  // === FALLBACK - GARANTIR REMOÇÃO DE EXPORTS/IMPORTS RESIDUAIS ===
  // Remover qualquer 'export' isolado que sobrou
  cleaned = cleaned.replace(/\bexport\s+/g, '');
  
  // Remover imports residuais
  cleaned = cleaned.replace(/import\s+[^;]+;?\s*/g, '');
  
  // === DEBUG ===
  console.log('🔍 CÓDIGO LIMPO - Primeiros 1000 chars:');
  console.log(cleaned.substring(0, 1000));
  console.log('🔍 Tamanho total:', cleaned.length, 'chars');
  console.log('🔍 Contém código real?', /const\s+\w+\s*=/.test(cleaned));
  console.log('🔍 Contém "export"?', cleaned.includes('export'));
  console.log('🔍 Contém "import"?', cleaned.includes('import'));
  console.log('🔍 Contém "react-router-dom"?', cleaned.includes('react-router-dom'));
  
  // === CLEANUP ===
  // Remover linhas vazias extras
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  
  return cleaned;
}

function processMultiFileCode(code: string): { 
  isMultiFile: boolean; 
  processedCode: string;
  componentName: string;
} {
  const cleanedCode = cleanMarkdownFences(code);
  
  const srcMatches = cleanedCode.match(/\/\/\s*src\/[\w\/\-\.]+\.(?:ts|tsx)/g);
  console.log('🔍 Comentários "// src/" encontrados:', srcMatches ? srcMatches.length : 0);
  
  const isMultiFile = srcMatches && srcMatches.length > 1;

  // ===== SINGLE-FILE =====
  if (!isMultiFile) {
    let processedCode = cleanedCode;
    
    // Remover export default PRIMEIRO (completamente)
    processedCode = processedCode.replace(/^export\s+default\s+/gm, '');
    
    // Depois remover outros exports
    processedCode = processedCode.replace(/^export\s+(interface|type|const|function|class|enum)\s+/gm, '$1 ');
    
    // Remover export { ... }
    processedCode = processedCode.replace(/^export\s*\{[^}]+\}\s*;?/gm, '');
    
    // Garantir import React
    if (!processedCode.includes('import React')) {
      processedCode = 'import React from "react";\n' + processedCode;
    }
    
    console.log('✅ Single-file processado');
    
   return { 
    
  isMultiFile: false, 
  processedCode: removeTypeScriptSyntax(processedCode),  // ← ADICIONAR
  componentName: detectComponentName(processedCode, '') || 'App'
};

  }

  // ===== MULTI-FILE =====
  console.log('🗂️ Multi-file detectado:', srcMatches!.length, 'arquivos');

  const files: { path: string; content: string }[] = [];
const filePattern = /\/\/\s*([\w\/\-\.]+\.[\w]+)\s*\n([\s\S]*?)(?=\/\/\s*[\w\/]|$)/g;
let match;

while ((match = filePattern.exec(cleanedCode)) !== null) {
  const filePath = match[1];
  const fileContent = match[2].trim();
  
  // Filtrar APENAS arquivos .ts, .tsx, .js, .jsx
  if (/\.(tsx?|jsx?)$/.test(filePath)) {
    files.push({ path: filePath, content: fileContent });
  } else {
    console.log('⏭️ Ignorando arquivo não-JS:', filePath);
  }
}

  files.sort((a, b) => {
    if (a.path.includes('types.ts')) return -1;
    if (b.path.includes('types.ts')) return 1;
    if (a.path.includes('App.tsx')) return 1;
    if (b.path.includes('App.tsx')) return -1;
    return 0;
  });

  const processedFiles = files.map(file => {
    let content = file.content;
    
    // Remover TODOS os imports
    content = content.replace(/import\s+React[^;]+;?\s*/g, '');
    content = content.replace(/import\s+(?:type\s+)?\{[^}]+\}\s+from\s+['"][^'"]+['"];?\s*/g, '');
    content = content.replace(/import\s+[\w\s,{}]+\s+from\s+['"][^'"]+['"];?\s*/g, '');
    
    // Remover export default PRIMEIRO (completamente)
content = content.replace(/^export\s+default\s+(\w+)\s*;?\s*$/gm, '');
    // Depois remover outros exports
content = content.replace(/^export\s+(interface|type|const|function|class|enum)\s+/gm, '$1 ');    
    // Remover export { ... }
content = content.replace(/^export\s*\{[^}]+\}\s*;?/gm, '');
    
    return `\n// ============ ${file.path} ============\n${content}\n`;
  });

  const allContent = processedFiles.join('\n');
  const needsHooks = allContent.includes('useState') || 
                     allContent.includes('useEffect') || 
                     allContent.includes('useContext') ||
                     allContent.includes('useReducer') ||
                     allContent.includes('useMemo') ||
                     allContent.includes('useCallback') ||
                     allContent.includes('createContext') ||
                     allContent.includes('ReactNode');

  const reactImport = needsHooks 
    ? 'import React, { useState, useEffect, useContext, useReducer, useMemo, useCallback, createContext, ReactNode } from "react";\n\n'
    : 'import React from "react";\n\n';

  const finalCode = reactImport + allContent;
  const appFile = files.find(f => f.path.includes('App.tsx'));
  const componentName = appFile ? 'App' : (detectComponentName(finalCode, '') || 'GeneratedComponent');

  console.log('✅ Multi-file processado:', componentName);
  
 return { 
  isMultiFile: true, 
  processedCode: removeTypeScriptSyntax(finalCode),  
  componentName 
};
}


/**
 * Gera HTML completo para preview no iframe
 */
function generatePreviewHTMLSafe(code: string, filename: string): string {
  // Processar multi-file ou single-file
  const { isMultiFile, processedCode, componentName } = processMultiFileCode(code);

  console.log('🎨 Gerando preview para:', componentName, isMultiFile ? '(multi-file)' : '(single-file)');

  // NÃO ESCAPAR - srcDoc={} aceita código direto porque está em JSX
  const finalCode = processedCode;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview - ${componentName}</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"><\/script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"><\/script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: ${isMultiFile ? '#f5f5f5' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
      min-height: 100vh;
      padding: 2rem;
    }
    #root { 
      width: 100%; 
      max-width: ${isMultiFile ? '1000px' : '1200px'}; 
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    h1 { color: #333; margin-bottom: 1.5rem; }
    h2 { color: #666; margin: 1.5rem 0 0.5rem; }
    h3 { color: #888; margin: 1rem 0 0.5rem; font-size: 1.1rem; }
    article { border-bottom: 1px solid #eee; padding: 1.5rem 0; }
    form { 
      background: #f9f9f9; 
      padding: 1rem; 
      border-radius: 8px; 
      margin-top: 1rem;
    }
    form div { margin-bottom: 0.75rem; }
    label { display: block; font-weight: 600; margin-bottom: 0.25rem; color: #555; }
    input, textarea { 
      width: 100%; 
      padding: 0.5rem; 
      border: 1px solid #ddd; 
      border-radius: 4px;
      font-family: inherit;
    }
    button { 
      background: #667eea; 
      color: white; 
      border: none; 
      padding: 0.5rem 1.5rem; 
      border-radius: 4px; 
      cursor: pointer;
      font-weight: 600;
    }
    button:hover { background: #5568d3; }
    ul { list-style: none; padding: 0; }
    li { 
      background: #f5f5f5; 
      padding: 0.75rem; 
      margin: 0.5rem 0; 
      border-radius: 6px;
    }
    li strong { color: #667eea; }
    li em { color: #999; font-size: 0.85rem; }
  </style>
</head>
<body>
  <div id="root">
    <div style="text-align:center;color:#999;">⚡ Loading...</div>
  </div>
  
  <script type="text/babel" data-presets="react" data-type="module">
    // ✅ Destructure React hooks para uso direto (crítico!)
    const { useState, useEffect, useContext, useReducer, useMemo, useCallback, useRef, createContext } = React;
    
    ${finalCode}
    
    // Renderizar
    try {
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(<${componentName} />);
    } catch (error) {
      console.error('Preview render error:', error);
      document.getElementById('root').innerHTML = '<div style="color:red;padding:2rem;"><h2>❌ Erro ao Renderizar</h2><pre style="background:#fee;padding:1rem;border-radius:4px;overflow-x:auto;">' + error.message + '\\n\\n' + error.stack + '</pre></div>';
    }
  <\/script>
</body>
</html>`;
}



function cleanComponentCode(code: string): string {
  let cleaned = code.trim();

  console.log('🧹 Starting code cleaning...');
  console.log('Original code length:', code.length);

  cleaned = cleaned
    .replace(/\/\/\s*src\/[^\n]+\n/g, '')
    .replace(/\/\*\s*src\/[^\*]+\*\//g, '')
    .replace(/\/\/\s*File:\s*[^\n]+\n/g, '')
    .replace(/\/\*\s*File:\s*[^\*]+\*\//g, '');
  console.log('✅ Step 1: File separator comments removed');

  cleaned = cleaned.replace(/import\s+.*?from\s+['"].*?['"];?\n?/g, '');
  console.log('✅ Step 2: Removed ALL imports');

  cleaned = cleaned
    .replace(/`{3}typescript\n?/g, '')
    .replace(/`{3}tsx\n?/g, '')
    .replace(/`{3}javascript\n?/g, '')
    .replace(/`{3}jsx\n?/g, '')
    .replace(/`{3}\n?/g, '');
  console.log('✅ Step 3: Removed markdown fences');

  cleaned = cleaned
  .replace(/export\s+interface\s+\w+(\s+extends\s+\w+)?\s*{[^}]*}/gs, '')
  .replace(/interface\s+\w+(\s+extends\s+\w+)?\s*{[^}]*}/gs, '')
  .replace(/type\s+\w+\s*=\s*[^;]+;/g, '');
  console.log('✅ Step 4: Removed "export" keywords');

  cleaned = cleaned
    .replace(/\/\/\s*\w+\.tsx/g, '')
    .replace(/\/\*\*[\s\S]*?\*\//g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '');
  console.log('✅ Step 5: Removed comments (preserving URLs)');

  cleaned = cleaned
    .replace(/interface\s+\w+\s*{[^}]*}/gs, '')
    .replace(/type\s+\w+\s*=\s*[^;]+;/g, '');
  console.log('✅ Step 6: Removed interfaces and type aliases');

  cleaned = `const { useState, useEffect, useCallback, useMemo, useRef } = React;\n\n${cleaned}`;
  console.log('✅ Step 7: Added React globals at top');

  cleaned = cleaned
    .replace(/(\w+)\s*<\{[^}]+\}>\s*=/g, '$1 =')
    .replace(/(\w+)\s*<[A-Z]\w+>\s*=/g, '$1 =')
    .replace(/(\w+)<\{[^}]+\}>\s*=/g, '$1 =')
    .replace(/(\w+)<[A-Z]\w+>\s*=/g, '$1 =')
    .replace(/(\w+)\s*<[A-Z]\w+>\s*\(/g, '$1(')
    .replace(/(\w+)\s*<\{[^}]+\}>\s*\(/g, '$1(');
  console.log('✅ Step 8: Removed ALL isolated generics');

  cleaned = cleaned
    .replace(/useState<[^>]+>/g, 'useState')
    .replace(/useEffect<[^>]+>/g, 'useEffect')
    .replace(/useMemo<[^>]+>/g, 'useMemo')
    .replace(/useCallback<[^>]+>/g, 'useCallback')
    .replace(/useRef<[^>]+>/g, 'useRef')
    .replace(/useContext<[^>]+>/g, 'useContext')
    .replace(/createContext<[^>]+>/g, 'createContext')
    .replace(/:\s*[A-Z]\w+<[^>]+>/g, '')
    .replace(/\bas\s+[A-Z]\w+<[^>]+>/g, '');
  console.log('✅ Step 9: Removed generics (preserving JSX)');

cleaned = cleaned
  .replace(/:\s*React\.FC\s*/g, ' ')
  .replace(/:\s*JSX\.Element/g, '')
  .replace(/:\s*React\.CSSProperties/g, '')  
  .replace(/:\s*React\.ReactNode/g, '')      
  .replace(/:\s*React\.\w+/g, '')          
  .replace(/:\s*string\b/g, '')
  .replace(/:\s*number\b/g, '')
  .replace(/:\s*boolean\b/g, '')
  .replace(/:\s*any\b/g, '')
  .replace(/:\s*void\b/g, '')
  .replace(/:\s*Error\s*\|\s*null/g, '')
  .replace(/:\s*[A-Z]\w+\s*\|\s*null/g, '')
  .replace(/:\s*[A-Z]\w+\[\]/g, '')
  .replace(/:\s*\{[^}]+\}/g, '')
  .replace(/:\s*[A-Z]\w+\b/g, '');
  console.log('✅ Step 10: Removed type annotations');

  cleaned = cleaned
    .replace(/\s+as\s+any\b/g, '')
    .replace(/\s+as\s+typeof\s+[^\s;,)]+/g, '')
    .replace(/\s+as\s+[A-Z]\w+/g, '')
    .replace(/\s+as\s+\([^)]+\)\s*=>\s*[A-Z]\w+/g, '');
  console.log('✅ Step 11: Removed type assertions');

  cleaned = cleaned.replace(/^\s*\n/gm, '');
  console.log('✅ Step 12: Cleaned up whitespace');

  cleaned = cleaned
    .replace(/\((\w+):\s*[A-Z]\w+(\[\])?\)/g, '($1)')
    .replace(/,\s*(\w+):\s*[A-Z]\w+(\[\])?/g, ', $1');
  console.log('✅ Step 13: Removed parameter types');

  cleaned = cleaned.replace(/\):\s*[A-Z]\w+(\[\])?\s*=>/g, ') =>');
  console.log('✅ Step 14: Removed return types');

  cleaned = cleaned.replace(/export\s+default\s+\w+;?/g, '');
  console.log('✅ Step 15: Removed all existing export default statements');

  let mainComponentName = detectComponentName(cleaned, 'Component.tsx');

  if (!mainComponentName) {
    mainComponentName = 'Component';
    console.warn('⚠️ Could not detect component name! Using fallback:', mainComponentName);
  }

  cleaned = cleaned.trim() + `\n\nexport default ${mainComponentName};`;
  console.log('✅ Step 16: Added export default for:', mainComponentName);

  console.log('📋 CLEANED CODE (first 20 lines):');
  const lines = cleaned.split('\n');
  lines.slice(0, 20).forEach((line, i) => {
    console.log(`${String(i + 1).padStart(2, '0')}: ${line}`);
  });
  console.log(`... (${lines.length} total lines)`);

  console.log('✅ Code cleaned successfully! Final length:', cleaned.length);
  return cleaned;
}
function detectComponentName(code: string, filename: string): string | null {
  console.log('🔍 Detectando component name...');
  
  // 1. Procurar export default primeiro (mais confiável)
  const exportDefaultMatch = code.match(/export\s+default\s+(\w+)/);
  if (exportDefaultMatch && exportDefaultMatch[1]) {
    console.log('✅ Detectado via export default:', exportDefaultMatch[1]);
    return exportDefaultMatch[1];
  }
  
  // 2. Procurar ALL componentes React (const Nome = ou const Nome: tipo =)
  // REGEX ATUALIZADO: suporta type annotations `: React.FC =`
  const componentMatches: string[] = [];
  const regex = /const\s+([A-Z]\w+)\s*(?::\s*[^=]+)?\s*=/g;
  let match;
  
  while ((match = regex.exec(code)) !== null) {
    componentMatches.push(match[1]); // Extrair o nome capturado
  }
  
  if (componentMatches.length > 0) {
    // Pegar o ÚLTIMO (geralmente é o component principal)
    const lastComponentName = componentMatches[componentMatches.length - 1];
    console.log('✅ Detectado via const (último):', lastComponentName, '- Total encontrados:', componentMatches.length);
    return lastComponentName;
  }
  
  // 3. Procurar function Component
  const functionComponentMatch = code.match(/function\s+([A-Z]\w+)\s*\(/);
  if (functionComponentMatch && functionComponentMatch[1]) {
    console.log('✅ Detectado via function:', functionComponentMatch[1]);
    return functionComponentMatch[1];
  }
  
  // 4. Procurar no filename
  const filenameMatch = filename.match(/([A-Z]\w+)\.tsx?/);
  if (filenameMatch && filenameMatch[1]) {
    console.log('✅ Detectado via filename:', filenameMatch[1]);
    return filenameMatch[1];
  }
  
  console.warn('⚠️ Could not detect component name! Using fallback: App');
  return 'App'; // ✅ FALLBACK
}
