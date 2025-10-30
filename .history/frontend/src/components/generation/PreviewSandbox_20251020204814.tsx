import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Loader2, CheckCircle } from 'lucide-react';

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
      return undefined;
    }
  }, [code, filename]);

  return (
    <div className={`relative w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg overflow-hidden ${className}`}>
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

/**
 * Remove TypeScript syntax para Babel Standalone
 */
function removeTypeScriptSyntax(code: string): string {
  let cleaned = code;
  
  // UUID polyfill
  cleaned = cleaned.replace(/import\s+\{\s*v4\s+as\s+uuidv4\s*\}\s+from\s+['"]uuid['"];?\s*/g, 
    'const uuidv4 = () => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16); });\n'
  );
  
  // Remover imports externos (exceto React)
  cleaned = cleaned.replace(/import\s+[^;]+from\s+['"]([^'"]+)['"];?\s*/g, (match, lib) => {
    if (lib === 'react' || lib.startsWith('.')) return match;
    console.log('⏭️ Removendo import:', lib);
    return '';
  });
  
  // React Router substitutions
  cleaned = cleaned.replace(/<Link\s+to=['"]([^'"]+)['"]([^>]*)>/g, '<a href="$1"$2>');
  cleaned = cleaned.replace(/<\/Link>/g, '</a>');
  cleaned = cleaned.replace(/useLocation\(\)/g, '{ pathname: "/" }');
  
  // Generics
  cleaned = cleaned.replace(/useState<[^>]+>/g, 'useState');
  cleaned = cleaned.replace(/useReducer<[^>]+>/g, 'useReducer');
  cleaned = cleaned.replace(/useMemo<[^>]+>/g, 'useMemo');
  cleaned = cleaned.replace(/useCallback<[^>]+>/g, 'useCallback');
  cleaned = cleaned.replace(/useRef<[^>]+>/g, 'useRef');
  cleaned = cleaned.replace(/createContext<[^>]+>/g, 'createContext');
  
  // Utility types
  cleaned = cleaned.replace(/Omit<[^>]+>/g, 'any');
  cleaned = cleaned.replace(/Pick<[^>]+>/g, 'any');
  cleaned = cleaned.replace(/Partial<[^>]+>/g, 'any');
  cleaned = cleaned.replace(/Record<[^>]+>/g, 'any');
  
  // Type annotations
  cleaned = cleaned.replace(/const\s+(\w+)\s*:\s*[^=]+=/, 'const $1 =');
  cleaned = cleaned.replace(/let\s+(\w+)\s*:\s*[^=]+=/, 'let $1 =');
  cleaned = cleaned.replace(/\)\s*:\s*[A-Z][\w<>[\]|&\s]*(?=\s*=>)/g, ')');
  cleaned = cleaned.replace(/\)\s*:\s*[A-Z][\w<>[\]|&\s]*(?=\s*\{)/g, ')');
  
  cleaned = cleaned.replace(/\(([^){}[\]]+)\)\s*=>/g, (match, params) => {
    if (params.includes('{') || params.includes('[')) return match;
    const cleanParams = params.replace(/(\w+)\s*:\s*[^,)]+/g, '$1');
    return `(${cleanParams}) =>`;
  });
  
  // Interfaces/types (só simples)
  cleaned = cleaned.replace(/^(export\s+)?(interface|type)\s+\w+(\s+extends\s+\w+)?\s*=?\s*\{[^}]{0,200}\}\s*;?\s*$/gm, '');
  
  // Assertions
  cleaned = cleaned.replace(/\s+as\s+const/g, '');
  cleaned = cleaned.replace(/\s+as\s+[^;,)}\n]+/g, '');
  
  // Fallback
  cleaned = cleaned.replace(/\bexport\s+/g, '');
  
  console.log('🔍 Código limpo:', cleaned.length, 'chars');
  
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  return cleaned;
}

/**
 * Processa código multi-file
 */
function processMultiFileCode(code: string): { isMultiFile: boolean; processedCode: string; componentName: string } {
  const srcMatches = code.match(/\/\/\s*src\/[\w\/\-\.]+\.(?:ts|tsx)/g);
  const isMultiFile = srcMatches && srcMatches.length > 1;

  if (!isMultiFile) {
    let processed = code
      .replace(/^export\s+default\s+/gm, '')
      .replace(/^export\s+(interface|type|const|function|class|enum)\s+/gm, '$1 ')
      .replace(/^export\s*\{[^}]+\}\s*;?/gm, '');
    
    return {
      isMultiFile: false,
      processedCode: removeTypeScriptSyntax(processed),
      componentName: detectComponentName(processed, '') || 'App'
    };
  }

  // Multi-file processing
  const files: { path: string; content: string }[] = [];
  const filePattern = /\/\/\s*([\w\/\-\.]+\.[\w]+)\s*\n([\s\S]*?)(?=\/\/\s*[\w\/]|$)/g;
  let match;

  while ((match = filePattern.exec(code)) !== null) {
    const filePath = match[1];
    const fileContent = match[2].trim();
    
    if (/\.(tsx?|jsx?)$/.test(filePath)) {
      files.push({ path: filePath, content: fileContent });
    }
  }

  const processedFiles = files.map(file => {
    let content = file.content
      .replace(/import\s+[^;]+;?\s*/g, '')
      .replace(/^export\s+default\s+/gm, '')
      .replace(/^export\s+(interface|type|const|function|class|enum)\s+/gm, '$1 ')
      .replace(/^export\s*\{[^}]+\}\s*;?/gm, '');
    
    return `\n// ============ ${file.path} ============\n${content}\n`;
  });

  const needsHooks = processedFiles.join('').includes('useState') || processedFiles.join('').includes('useEffect');
  const reactImport = needsHooks 
    ? 'import React, { useState, useEffect, useContext, createContext } from "react";\n\n'
    : 'import React from "react";\n\n';

  const finalCode = reactImport + processedFiles.join('\n');
  const componentName = files.find(f => f.path.includes('App.tsx')) ? 'App' : 'GeneratedComponent';

  return {
    isMultiFile: true,
    processedCode: removeTypeScriptSyntax(finalCode),
    componentName
  };
}

/**
 * Gera HTML do preview
 */
function generatePreviewHTMLSafe(code: string, filename: string): string {
  const { processedCode, componentName } = processMultiFileCode(code);

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
      background: #f5f5f5;
      min-height: 100vh;
      padding: 2rem;
    }
    #root { 
      width: 100%; 
      max-width: 1200px; 
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
  </style>
</head>
<body>
  <div id="root"><div style="text-align:center;color:#999;">⚡ Loading...</div></div>
  
  <script type="text/babel" data-presets="react" data-type="module">
    ${processedCode}
    
    try {
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(<${componentName} />);
    } catch (error) {
      console.error('Render error:', error);
      document.getElementById('root').innerHTML = '<div style="color:red;padding:2rem;"><h2>❌ Erro</h2><pre>' + error.message + '</pre></div>';
    }
  <\/script>
</body>
</html>`;
}

function detectComponentName(code: string, filename: string): string | null {
  const exportMatch = code.match(/export\s+default\s+(\w+)/);
  if (exportMatch) return exportMatch[1];
  
  const constMatch = code.match(/const\s+([A-Z]\w+)\s*=\s*\(/);
  if (constMatch) return constMatch[1];
  
  const funcMatch = code.match(/function\s+([A-Z]\w+)\s*\(/);
  if (funcMatch) return funcMatch[1];
  
  const fileMatch = filename.match(/([A-Z]\w+)\.tsx?/);
  if (fileMatch) return fileMatch[1];
  
  return null;
}
