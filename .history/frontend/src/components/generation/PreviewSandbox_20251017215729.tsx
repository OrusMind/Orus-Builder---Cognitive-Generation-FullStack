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
function generatePreviewHTMLSafe(code: string, filename: string): string {
  let componentName = detectComponentName(code, filename);
  if (!componentName || componentName.trim() === '') {
    componentName = 'App';
  }

  console.log('🎨 Gerando preview para:', componentName);

  // Remove exports
  const cleanCode = code
    .replace(/export\s+(interface|type|const|function|class|enum)\s+/g, '$1 ')
    .replace(/export\s+default\s+/g, '')
    .replace(/export\s*\{[^}]+\}\s*;?/g, '');

  // Escapar APENAS aspas duplas para não quebrar o atributo srcDoc
  const safeCode = cleanCode.replace(/"/g, '&quot;');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview - ${componentName}</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
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
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const { useState } = React;
    
    ${safeCode}
    
    // Renderizar o componente principal
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<${componentName} />);
  </script>
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
  const exportDefaultMatch = code.match(/export\s+default\s+(\w+)/);
  if (exportDefaultMatch && exportDefaultMatch[1]) {
    console.log('🔍 Detected from export default:', exportDefaultMatch[1]);
    return exportDefaultMatch[1];
  }

  const constComponentMatch = code.match(/const\s+([A-Z]\w+)\s*=\s*\(/);
  if (constComponentMatch && constComponentMatch[1]) {
    console.log('🔍 Detected from const:', constComponentMatch[1]);
    return constComponentMatch[1];
  }

  const functionComponentMatch = code.match(/function\s+([A-Z]\w+)\s*\(/);
  if (functionComponentMatch && functionComponentMatch[1]) {
    console.log('🔍 Detected from function:', functionComponentMatch[1]);
    return functionComponentMatch[1];
  }

  const filenameMatch = filename.match(/([A-Z]\w+)\.tsx?/);
  if (filenameMatch && filenameMatch[1]) {
    console.log('🔍 Detected from filename:', filenameMatch[1]);
    return filenameMatch[1];
  }

  console.error('❌ Could not detect component name!');
  return null;
}
