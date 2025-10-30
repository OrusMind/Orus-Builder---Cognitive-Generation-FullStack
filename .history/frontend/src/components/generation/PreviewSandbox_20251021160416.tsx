import React, { useState, useEffect } from 'react';
import { Sandpack } from '@codesandbox/sandpack-react';
import '@codesandbox/sandpack-react/dist/index.css';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Loader2, CheckCircle } from 'lucide-react';
/**
 * 🔄 Processa código multi-file separado por comentários
 */
function processMultiFileCode(code: string, filename: string): Record<string, string> {
  // Detecta padrão: // src/components/Header.tsx
  const filePattern = /\/\/\s*(?:src\/)?([^\n]+\.tsx?)\n([^]*?)(?=\/\/\s*(?:src\/)?[^\n]+\.tsx?|$)/gi;
  const matches = [...code.matchAll(filePattern)];
  
  if (matches.length > 1) {
    console.log('🗂️ Multi-file detectado:', matches.length, 'arquivos');
    const files: Record<string, string> = {};
    
    matches.forEach(([_, path, content]) => {
      const cleanPath = `/${path.trim()}`;
      files[cleanPath] = content.trim();
      console.log('📄 Arquivo processado:', cleanPath);
    });
    
    return files;
  }
  
  // Single file - usar App.tsx como padrão
  console.log('📄 Single-file detectado');
  return {
    '/App.tsx': code
  };
}

/**
 * 🔍 Detecta bibliotecas externas no código
 */
function detectExternalLibs(code: string): Record<string, string> {
  const deps: Record<string, string> = {};
  
  // Chart.js
  if (code.includes('chart.js') || code.includes('react-chartjs') || code.includes('Chart')) {
    deps['chart.js'] = 'latest';
    deps['react-chartjs-2'] = 'latest';
    console.log('📊 Chart.js detectado');
  }
  
  // Socket.io
  if (code.includes('socket.io-client') || code.includes('io(')) {
    deps['socket.io-client'] = 'latest';
    console.log('🔌 Socket.io detectado');
  }
  
  // Axios
  if (code.includes('axios') || code.includes("from 'axios'")) {
    deps['axios'] = 'latest';
    console.log('🌐 Axios detectado');
  }
  
  // Framer Motion
  if (code.includes('framer-motion')) {
    deps['framer-motion'] = 'latest';
    console.log('✨ Framer Motion detectado');
  }
  
  // Lucide Icons
  if (code.includes('lucide-react')) {
    deps['lucide-react'] = 'latest';
    console.log('🎨 Lucide Icons detectado');
  }
  
  return deps;
}


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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Processar código e detectar libs
  const files = processMultiFileCode(code, filename);
  const dependencies = detectExternalLibs(code);

  useEffect(() => {
    if (!code || code.trim() === '') {
      setError('Nenhum código fornecido para renderizar');
      setLoading(false);
      return;
    }

    console.log('🎨 PreviewSandbox: Iniciando renderização Sandpack...');
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Sandpack carrega automaticamente - dar tempo para inicializar
    const timer = setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      console.log('✅ Preview Sandpack renderizado com sucesso');
    }, 1500);

    return () => clearTimeout(timer);
  }, [code]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* ✅ MANTER: Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            className="absolute inset-0 z-50 bg-gray-900/90 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p className="text-gray-300 text-sm font-medium">Carregando Sandpack...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ MANTER: Error State */}
      {error && (
        <motion.div 
          className="absolute inset-0 z-40 bg-red-900/20 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 max-w-md">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-red-300 font-semibold mb-2">Erro ao Renderizar Preview</h3>
                <p className="text-red-200 text-sm mb-4">{error}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ✅ MANTER: Success Indicator */}
      <AnimatePresence>
        {success && (
          <motion.div
            className="absolute top-4 right-4 z-30 bg-green-500/20 border border-green-500/30 rounded-lg px-4 py-2 flex items-center gap-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-300 text-sm font-medium">Renderizado!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🆕 NOVO: Sandpack Preview */}
      <div className="w-full h-full">
        <Sandpack
          template="react-ts"
          files={files}
          options={{
            showNavigator: false,
            showTabs: Object.keys(files).length > 1, // Tabs apenas se multi-file
            showLineNumbers: false,
            editorHeight: '100%',
            editorWidthPercentage: 0, // Esconde editor, mostra só preview
            showInlineErrors: true,
            showErrorOverlay: true,
            autorun: true,
            autoReload: true,
          }}
          theme="dark"
          customSetup={{
            dependencies: {
              ...dependencies,
              // Garantir React sempre presente
              react: 'latest',
              'react-dom': 'latest',
            }
          }}
          style={{ 
            height: '100%', 
            width: '100%',
            borderRadius: '0.5rem',
            overflow: 'hidden'
          }}
        />
      </div>
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
/**
 * Remove markdown code fences e conteúdo não-executável
 */
function cleanMarkdownFences(code: string): string {
  let cleaned = code;
  
  // Remover fence blocks de abertura (``````typescript, etc)
  cleaned = cleaned.replace(/`{3}[\w]*\s*\n?/g, '');
  
  // Remover fence blocks de fechamento (```
  cleaned = cleaned.replace(/`{3}\s*\n?/g, '');
  
  // ✅ NOVO! Remover blocos JSON completos (package.json, tsconfig.json, etc)
  // Detecta padrões: // nome-arquivo.json seguido de { ... }
  cleaned = cleaned.replace(/\/\/\s*[\w\-\.\/]+\.json\s*\n\{[\s\S]*?\n\}/gi, '');
  
  // ✅ NOVO! Remover arquivos Markdown
  cleaned = cleaned.replace(/\/\/\s*[\w\-\.\/]+\.md\s*\n[\s\S]*?(?=\/\/\s*[\w\/]|\n\n\n|$)/gi, '');
  
  // ✅ NOVO! Remover arquivos de configuração (tsconfig, .eslintrc, etc)
  cleaned = cleaned.replace(/\/\/\s*\.[\w\-]+(?:rc)?(?:\.json)?\s*\n[\s\S]*?(?=\/\/\s*[\w\/]|\n\n\n|$)/gi, '');
  
  // Limpar linhas vazias extras
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  
  return cleaned.trim();
}

function removeTypeScriptSyntax(code: string): string {
  let cleaned = code;
  
  console.log('🗑️ Removendo TypeScript minimalista...');
  
  // === PASSO 1: REMOVER IMPORTS ===
  let previousLength = 0;
  while (cleaned.length !== previousLength && cleaned.includes('import')) {
    previousLength = cleaned.length;
    cleaned = cleaned.replace(/^import\s+[^;]+from\s+['"][^'"]+['"];?\s*$/gm, '');
    cleaned = cleaned.replace(/^import\s+[^;]+from\s+['"][^'"]+['"];?/gm, '');
    cleaned = cleaned.replace(/import\s+[^;]+;?\s*/g, '');
  }
  
  // === PASSO 2: REMOVER EXPORTS ===
  cleaned = cleaned.replace(/^export\s+default\s+/gm, '');
  cleaned = cleaned.replace(/^export\s+/gm, '');
  cleaned = cleaned.replace(/export\s*\{[^}]+\}\s*;?/gm, '');
  
  // === PASSO 3: REMOVER GENERICS DE HOOKS ===
  cleaned = cleaned.replace(/useState<[^>]+>/g, 'useState');
  cleaned = cleaned.replace(/useReducer<[^>]+>/g, 'useReducer');
  cleaned = cleaned.replace(/useMemo<[^>]+>/g, 'useMemo');
  cleaned = cleaned.replace(/useCallback<[^>]+>/g, 'useCallback');
  cleaned = cleaned.replace(/useRef<[^>]+>/g, 'useRef');
  cleaned = cleaned.replace(/useContext<[^>]+>/g, 'useContext');
  cleaned = cleaned.replace(/createContext<[^>]+>/g, 'createContext');
  
  // === PASSO 3.5: REMOVER TYPE CASTS (as Type) - VERSÃO AGRESSIVA! ===
  // Remove "as" seguido de QUALQUER coisa até vírgula, ponto-e-vírgula, ) ou ]
  cleaned = cleaned.replace(/\s+as\s+[a-zA-Z][\w<>[\]()]+(?=[,\s;)\]])/g, '');
  cleaned = cleaned.replace(/\s+as\s+const/g, '');
  
  // === PASSO 4: REMOVER ": React.FC" e annotations SIMPLES ===
  cleaned = cleaned.replace(/:\s*React\.FC(<[^>]+>)?/g, '');
  cleaned = cleaned.replace(/:\s*React\.ReactNode/g, '');
  cleaned = cleaned.replace(/:\s*JSX\.Element/g, '');
  
  // === PASSO 5: REMOVER type annotations EM PARAMS ===
  cleaned = cleaned.replace(/(\w+)\s*:\s*[A-Z]\w+(\s*[,)])/g, '$1$2');
  
  // === PASSO 6: REMOVER return types ===
  cleaned = cleaned.replace(/\)\s*:\s*[A-Z][\w<>[\]|&\s]*\s*(?=\{|=>)/g, ') ');
  
  // === PASSO 7: REMOVER INTERFACES/TYPES ===
  cleaned = cleaned.replace(/^interface\s+\w+\s*\{[\s\S]*?\}\s*$/gm, '');
  cleaned = cleaned.replace(/^type\s+\w+\s*=[\s\S]*?;/gm, '');
  
  // === DEBUG ===
  console.log('🔍 CÓDIGO LIMPO - Primeiros 1000 chars:');
  console.log(cleaned.substring(0, 1000));
  console.log('🔍 Tamanho total:', cleaned.length, 'chars');
  console.log('🔍 Contém código real?', /const\s+\w+\s*=/.test(cleaned));
  console.log('🔍 Contém "export"?', cleaned.includes('export'));
  console.log('🔍 Contém "import"?', cleaned.includes('import'));
  console.log('🔍 Contém "interface"?', cleaned.includes('interface'));
  console.log('🔍 Contém " as "?', cleaned.includes(' as '));
  
  // === CLEANUP ===
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  
  return cleaned;
}


/**
 * Processa código multi-file ou single-file
 * Detecta automaticamente e processa apropriadamente
 */
/**
 * Processa código multi-file ou single-file
 * Detecta automaticamente e processa apropriadamente
 */
/**
 * Processa código multi-file ou single-file
 * Filtro inteligente que identifica apenas código executável
 */
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
  
  // ✅ NOVO! Filtrar blocos não-executáveis mesmo em single-file
  // Remove package.json, tsconfig.json, etc.
  processedCode = processedCode.replace(/\/\/\s*[\w\-\.\/]+\.json[\s\S]*?(?=\/\/|$)/gi, '');
  processedCode = processedCode.replace(/\/\/\s*[\w\-\.\/]+\.md[\s\S]*?(?=\/\/|$)/gi, '');
  
  // Remover exports
  processedCode = processedCode.replace(/^export\s+default\s+(\w+)\s*;?\s*$/gm, '');
  processedCode = processedCode.replace(/^export\s+default\s+(?=function|const|class)/gm, '');
  processedCode = processedCode.replace(/^export\s+(interface|type|const|function|class|enum)\s+/gm, '$1 ');
  processedCode = processedCode.replace(/^export\s*\{[^}]+\}\s*;?/gm, '');
  
  console.log('✅ Single-file processado');
  
  return { 
    isMultiFile: false, 
    processedCode: removeTypeScriptSyntax(processedCode),
    componentName: detectComponentName(processedCode, '') || 'App'
  };
}

  // ===== MULTI-FILE =====
  console.log('🗂️ Multi-file detectado:', srcMatches!.length, 'arquivos');

  const files: { path: string; content: string }[] = [];
const filePattern = /\/\/\s*([\w\/\-\.]+\.[\w]+)\s*\n([\s\S]*?)(?=\n\/\/\s*[\w\/\-\.]+\.[\w]+|$)/g;  let match;

  /**
   * Determina se um arquivo deve ser incluído no preview
   * Critério: Arquivo DEVE conter código React executável
   */
  const shouldIncludeFile = (filePath: string, fileContent: string): boolean => {
    // ❌ IGNORAR: Extensões não-executáveis
    if (/\.(css|json|md|txt)$/i.test(filePath)) return false;
    
    // ❌ IGNORAR: TypeScript declaration files (.d.ts)
    if (/\.d\.ts$/i.test(filePath)) return false;
    
    // ❌ IGNORAR: Entry points (index.tsx, index.ts, main.tsx)
    if (/\/(index|main)\.(tsx?|jsx?)$/i.test(filePath)) return false;
    
    // ❌ IGNORAR: Arquivos sem código executável
    // Declaration files só com declare, module, etc
    if (/^\s*declare\s+/m.test(fileContent)) return false;
    
    // ✅ INCLUIR: Arquivos com código real (componentes, funções, constantes)
    const hasExecutableCode = /(?:const|function|class)\s+\w+/.test(fileContent);
    
    return hasExecutableCode;
  };

  while ((match = filePattern.exec(cleanedCode)) !== null) {
    const filePath = match[1];
    const fileContent = match[2].trim();
    
    if (shouldIncludeFile(filePath, fileContent)) {
      files.push({ path: filePath, content: fileContent });
      console.log('✅ Incluindo arquivo:', filePath);
    } else {
      console.log('⏭️ Ignorando (não executável):', filePath);
    }
  }

  // Fallback se não achou nenhum arquivo válido
  if (files.length === 0) {
    console.log('⚠️ Nenhum arquivo executável encontrado! Processando como single-file');
    return {
      isMultiFile: false,
      processedCode: removeTypeScriptSyntax(cleanedCode),
      componentName: detectComponentName(cleanedCode, '') || 'App'
    };
  }

  // Ordenar: types.ts primeiro, App.tsx por último
  files.sort((a, b) => {
    if (a.path.includes('types.ts')) return -1;
    if (b.path.includes('types.ts')) return 1;
    if (a.path.includes('App.tsx')) return 1;
    if (b.path.includes('App.tsx')) return -1;
    return 0;
  });

  // Processar cada arquivo
  const processedFiles = files.map(file => {
    let content = file.content;
    
    // Remover imports
    content = content.replace(/import\s+React[^;]+;?\s*/g, '');
    content = content.replace(/import\s+(?:type\s+)?\{[^}]+\}\s+from\s+['"][^'"]+['"];?\s*/g, '');
    content = content.replace(/import\s+[\w\s,{}]+\s+from\s+['"][^'"]+['"];?\s*/g, '');
    
    // Remover exports
    content = content.replace(/^export\s+default\s+(\w+)\s*;?\s*$/gm, '');
    content = content.replace(/^export\s+default\s+(?=function|const|class)/gm, '');
    content = content.replace(/^export\s+(interface|type|const|function|class|enum)\s+/gm, '$1 ');
    content = content.replace(/^export\s*\{[^}]+\}\s*;?/gm, '');
    
    return `\n// ============ ${file.path} ============\n${content}\n`;
  });

  const allContent = processedFiles.join('\n');
  const appFile = files.find(f => f.path.includes('App.tsx'));
  const componentName = appFile ? 'App' : (detectComponentName(allContent, '') || 'GeneratedComponent');

  console.log('✅ Multi-file processado:', componentName);
  
  return { 
    isMultiFile: true, 
    processedCode: removeTypeScriptSyntax(allContent),
    componentName 
  };
}

/**
 * Detecta quais bibliotecas externas são usadas no código
 */
function detectExternalLibraries(code: string): string[] {
  const libs: string[] = [];
  
  // Chart.js
  if (/\b(ChartJS|Chart|Bar|Line|Pie)\b/.test(code)) {
    libs.push('chartjs');
  }
  
  // Socket.io
  if (/\b(io|Socket)\b/.test(code)) {
    libs.push('socketio');
  }
  
  // Axios
  if (/\baxios\b/.test(code)) {
    libs.push('axios');
  }
  
  // Lodash
  if (/\b(lodash|_\.)\b/.test(code)) {
    libs.push('lodash');
  }
  
  return libs;
}

/**
 * Retorna os scripts CDN necessários para as libs detectadas
 */
function getLibraryCDNScripts(libs: string[]): string {
  const cdnMap: Record<string, string> = {
    chartjs: `
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"><\/script>
  <script src="https://cdn.jsdelivr.net/npm/react-chartjs-2@5.2.0/dist/index.umd.js"><\/script>`,
    
    socketio: `
  <script src="https://cdn.socket.io/4.7.2/socket.io.min.js"><\/script>`,
    
    axios: `
  <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"><\/script>`,
    
    lodash: `
  <script src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"><\/script>`,
  };
  
  return libs.map(lib => cdnMap[lib] || '').join('\n');
}

/**
 * Gera HTML completo para preview no iframe
 */
function generatePreviewHTMLSafe(code: string, filename: string): string {
  // Processar multi-file ou single-file
  const { isMultiFile, processedCode, componentName } = processMultiFileCode(code);

  console.log('🎨 Gerando preview para:', componentName, isMultiFile ? '(multi-file)' : '(single-file)');

  // ✅ NOVO! Detectar libs necessárias
  const externalLibs = detectExternalLibraries(processedCode);
  const libScripts = getLibraryCDNScripts(externalLibs);
  
  console.log('📦 Libs externas detectadas:', externalLibs);

  const finalCode = processedCode;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview - ${componentName}</title>
  
  <!-- React & ReactDOM -->
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"><\/script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"><\/script>
  
  <!-- ✅ LIBS EXTERNAS DINÂMICAS -->
  ${libScripts}
  
  <!-- Babel & Tailwind -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
  <script src="https://cdn.tailwindcss.com"><\/script>
  
  <style>
    /* ... seu CSS existente ... */
  </style>
</head>
<body>
  <div id="root">
    <div style="text-align:center;color:#999;">⚡ Loading...</div>
  </div>
  
  <script type="text/babel" data-type="module" data-presets="react">
    const { useState, useEffect, useContext, useReducer, useMemo, useCallback, useRef, createContext } = React;
    
    ${finalCode}
    
    // Renderização segura
    const renderApp = () => {
      try {
        const rootEl = document.getElementById('root');
        if (!rootEl) {
          console.error('❌ Root element not found');
          return;
        }
        
        const root = ReactDOM.createRoot(rootEl);
        root.render(React.createElement(${componentName}));
        console.log('✅ App renderizado com sucesso!');
      } catch (error) {
        console.error('❌ Preview render error:', error);
        const rootEl = document.getElementById('root');
        if (rootEl) {
          const errorDiv = document.createElement('div');
          errorDiv.style.color = 'red';
          errorDiv.style.padding = '2rem';
          errorDiv.style.fontFamily = 'monospace';
          
          const title = document.createElement('h2');
          title.textContent = '❌ Erro ao Renderizar';
          
          const pre = document.createElement('pre');
          pre.style.cssText = 'background:#fee;padding:1rem;border-radius:4px;overflow-x:auto;white-space:pre-wrap;';
          pre.textContent = (error && error.message ? error.message : 'Unknown error') + 
                            '\\n\\n' + 
                            (error && error.stack ? error.stack : '');
          
          errorDiv.appendChild(title);
          errorDiv.appendChild(pre);
          rootEl.innerHTML = '';
          rootEl.appendChild(errorDiv);
        }
      }
    };
    
    renderApp();
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
