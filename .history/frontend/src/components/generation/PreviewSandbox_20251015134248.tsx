/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎨 ORUS BUILDER - PREVIEW SANDBOX COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * DEVELOPER: ORUS Team + Minerva AI
 * CREATED: 2025-10-15
 * LAST_MODIFIED: 2025-10-15T13:40:00-03:00
 * VERSION: 2.0.0
 * 
 * PURPOSE:
 * - Renderização segura de componentes React em iframe isolado
 * - Auto-detecção inteligente de nome de componente
 * - Tratamento robusto de erros com mensagens descritivas
 * - Suporte a múltiplos formatos de código (TypeScript, JSX, TSX)
 * - Escape correto de template literals e caracteres especiais
 * 
 * FEATURES:
 * ✅ Remoção automática de markdown code blocks (``````jsx, etc)
 * ✅ Limpeza de imports e exports
 * ✅ Escape seguro de código para injeção no iframe
 * ✅ Estados de loading, error e success com animações
 * ✅ Botão de retry para recarregar preview
 * ✅ Console logs detalhados para debugging
 * 
 * COGNITIVE DNA:
 * - AGENT_TYPE: SafePreviewAgent
 * - COGNITIVE_LEVEL: Advanced
 * - AUTONOMY_DEGREE: 85%
 * - ERROR_RESILIENCE: High
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Loader2, RefreshCw, CheckCircle } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface PreviewSandboxProps {
  code: string;
  filename?: string;
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const PreviewSandbox: React.FC<PreviewSandboxProps> = ({ 
  code, 
  filename = 'Component.tsx',
  className = ''
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // ═══════════════════════════════════════════════════════════════════════════
  // EFFECT: Render Preview
  // ═══════════════════════════════════════════════════════════════════════════

 useEffect(() => {
  if (!code || code.trim() === '') {
    setError('Nenhum código fornecido para renderizar');
    setLoading(false);
    return; // ✅ OK - Early return sem cleanup
  }

  try {
    console.log('🎨 PreviewSandbox: Iniciando renderização...');
    console.log('📄 Arquivo:', filename);
    console.log('📏 Tamanho do código:', code.length, 'caracteres');
    
    setLoading(true);
    setError(null);
    setSuccess(false);

    // ✅ Gerar HTML do preview
    const html = generatePreviewHTML(code, filename);

    // ✅ Injetar no iframe
    if (iframeRef.current?.contentWindow) {
      const iframeDoc = iframeRef.current.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(html);
      iframeDoc.close();
      
      console.log('✅ PreviewSandbox: HTML injetado no iframe');
    }

    // ✅ Aguardar renderização
    const renderTimeout = setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      console.log('✅ PreviewSandbox: Renderização concluída');
    }, 1500);

    // ✅ Cleanup function
    return () => {
      clearTimeout(renderTimeout);
    };
    
  } catch (err: any) {
    console.error('❌ PreviewSandbox: Erro ao renderizar:', err);
    setError(err.message || 'Erro desconhecido ao processar o código');
    setLoading(false);
    setSuccess(false);
    return undefined; // ✅ Cleanup function (mesmo que vazio)
  }
}, [code, filename]);

  // ═══════════════════════════════════════════════════════════════════════════
  // HANDLER: Retry
  // ═══════════════════════════════════════════════════════════════════════════

  const handleRetry = () => {
    console.log('🔄 PreviewSandbox: Tentando novamente...');
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
        }
        setLoading(false);
        setSuccess(true);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    }, 500);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className={`relative w-full h-full bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 ${className}`}>
      
      {/* ========== LOADING STATE ========== */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 z-20"
          >
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mx-auto mb-4" />
              <p className="text-sm text-slate-600 dark:text-slate-400 font-semibold">
                Renderizando componente...
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                {filename}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== ERROR STATE ========== */}
      <AnimatePresence>
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 flex items-center justify-center bg-red-50/95 dark:bg-red-900/30 backdrop-blur-sm z-20 p-8"
          >
            <div className="text-center max-w-2xl">
              <AlertCircle className="w-16 h-16 text-red-500 dark:text-red-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-3">
                Erro ao Renderizar
              </h3>
              <div className="bg-red-100 dark:bg-red-900/50 rounded-xl p-4 mb-6 max-h-64 overflow-y-auto">
                <pre className="text-sm text-red-800 dark:text-red-200 font-mono text-left whitespace-pre-wrap break-words">
                  {error}
                </pre>
              </div>
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              >
                <RefreshCw className="w-5 h-5" />
                Tentar Novamente
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== SUCCESS INDICATOR ========== */}
      <AnimatePresence>
        {success && !loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 right-4 z-10"
          >
            <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-semibold">Renderizado!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== PREVIEW IFRAME ========== */}
      <iframe
        ref={iframeRef}
        title="Component Preview"
        sandbox="allow-scripts allow-same-origin"
        className="w-full h-full border-0 bg-white dark:bg-slate-900"
      />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// UTILS: HTML Generator
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gera HTML completo para preview do componente React
 * Com escape seguro e tratamento de erros inline
 */
function generatePreviewHTML(code: string, filename: string): string {
  
  // ✅ STEP 1: Detectar nome do componente
  let componentName = detectComponentName(code, filename);
  console.log('🔍 Componente detectado:', componentName);

  // ✅ STEP 2: Limpar código (remover markdown, imports, etc)
  let cleanCode = cleanComponentCode(code);
  console.log('🧹 Código limpo:', cleanCode.length, 'caracteres');

  // ✅ STEP 3: Escapar código para injeção segura
  const codeEscaped = escapeCodeForHTML(cleanCode);
  console.log('🔒 Código escapado para HTML');

  // ✅ STEP 4: Gerar HTML completo
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview - ${componentName}</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"><\/script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"><\/script>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
  ${getPreviewStyles()}
</head>
<body>
  <div id="root">
    <div class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">Carregando ${componentName}...</p>
    </div>
  </div>
  <script type="text/babel">
    const { useState, useEffect, useRef, useMemo, useCallback } = React;
    
    try {
      // ✅ CÓDIGO DO COMPONENTE
      ${codeEscaped}
      
      // ✅ RENDERIZAR
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
          <${componentName} />
        </div>
      );
      
      console.log('✅ Componente renderizado com sucesso:', '${componentName}');
      
    } catch (error) {
      console.error('❌ Erro ao renderizar componente:', error);
      document.getElementById('root').innerHTML = \`
        <div class="error-container">
          <div class="error-box">
            <div class="error-icon">⚠️</div>
            <h2 class="error-title">Erro no Preview</h2>
            <p class="error-description">
              O componente <strong>${componentName}</strong> encontrou um erro:
            </p>
            <pre class="error-code">\${error.message || error.toString()}</pre>
            <div class="error-stack">
              <details>
                <summary>Stack Trace (clique para expandir)</summary>
                <pre>\${error.stack || 'Stack trace não disponível'}</pre>
              </details>
            </div>
            <p class="error-hint">
              💡 <strong>Dica:</strong> Verifique se todas as variáveis, hooks e props estão corretamente definidos.
            </p>
          </div>
        </div>
      \`;
    }
  <\/script>
</body>
</html>
`;
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILS: Component Name Detection
// ═══════════════════════════════════════════════════════════════════════════

function detectComponentName(code: string, filename: string): string {
  // Tentar várias estratégias de detecção
  
  // 1. Export default function ComponentName
  let match = code.match(/export\s+default\s+function\s+(\w+)/);
  if (match) return match[1];
  
  // 2. export default ComponentName
  match = code.match(/export\s+default\s+(\w+)/);
  if (match) return match[1];
  
  // 3. const ComponentName = () => ...
  match = code.match(/const\s+(\w+)\s*[:=]\s*\(/);
  if (match) return match[1];
  
  // 4. function ComponentName() ...
  match = code.match(/function\s+(\w+)\s*\(/);
  if (match) return match[1];
  
  // 5. Fallback: usar nome do arquivo
  const fileNameMatch = filename.match(/([A-Z]\w+)\.(tsx?|jsx?)$/);
  if (fileNameMatch) return fileNameMatch[1];
  
  // 6. Default genérico
  return 'Component';
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILS: Code Cleaning
// ═══════════════════════════════════════════════════════════════════════════

function cleanComponentCode(code: string): string {
  let cleanedCode = code;
  
  console.log('🧹 Limpando código - tamanho original:', cleanedCode.length);
  
  // ✅ STEP 1: Remover markdown code blocks (CRITICAL!)
  cleanedCode = cleanedCode.replace(/```
  cleanedCode = cleanedCode.replace(/```tsx\s*/gi, '');
  cleanedCode = cleanedCode.replace(/```
  cleanedCode = cleanedCode.replace(/```jsx\s*/gi, '');
  cleanedCode = cleanedCode.replace(/```
  cleanedCode = cleanedCode.replace(/```js\s*/gi, '');
  cleanedCode = cleanedCode.replace(/```
  
  console.log('🧹 Após remover markdown:', cleanedCode.length);
  
  // ✅ STEP 2: Remover imports
  cleanedCode = cleanedCode.replace(/import\s+.*?\s+from\s+['"][^'"]+['"];?\s*\n?/g, '');
  
  // ✅ STEP 3: Remover export default
  cleanedCode = cleanedCode.replace(/export\s+default\s+/g, '');
  
  // ✅ STEP 4: Remover comentários de path
  const pathCommentPattern = new RegExp('^//\\s*[\\w/.-]+\\.[tj]sx?\\s*$', 'gm');
  cleanedCode = cleanedCode.replace(pathCommentPattern, '');
  
  // ✅ STEP 5: Remover blocos de comentários de documentação
  cleanedCode = cleanedCode.replace(/\/\*\*[\s\S]*?\*\//g, '');
  
  // ✅ STEP 6: Remover linhas em branco excessivas
  cleanedCode = cleanedCode.replace(/\n{3,}/g, '\n\n');
  
  // ✅ STEP 7: Remover espaços no início/fim
  cleanedCode = cleanedCode.trim();
  
  console.log('🧹 Código final limpo:', cleanedCode.length, 'caracteres');
  console.log('🧹 Preview dos primeiros 200 caracteres:', cleanedCode.substring(0, 200));
  
  return cleanedCode;
}
// ✅ STEP 2: Limpar código (remover markdown, imports, etc)
let cleanCode = cleanComponentCode(code);

// ✅ VALIDAÇÃO: Verificar se ainda tem markdown
if (cleanCode.includes('```')) {
  console.warn('⚠️ ATENÇÃO: Código ainda contém markdown blocks! Removendo força bruta...');
  cleanCode = cleanCode.replace(/```
}

console.log('🧹 Código limpo:', cleanCode.length, 'caracteres');

// ═══════════════════════════════════════════════════════════════════════════
// UTILS: Code Escaping
// ═══════════════════════════════════════════════════════════════════════════

function escapeCodeForHTML(code: string): string {
  return code
    .replace(/\\/g, '\\\\')      // Backslashes
    .replace(/`/g, '\\`')        // Backticks
    .replace(/\$/g, '\\$')       // Dollar signs
    .replace(/\${/g, '\\${');    // Template literals
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILS: Styles
// ═══════════════════════════════════════════════════════════════════════════

function getPreviewStyles(): string {
  return `
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
      background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
      min-height: 100vh;
    }
    
    #root {
      min-height: 100vh;
    }
    
    /* Loading */
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    
    .loading-spinner {
      width: 56px;
      height: 56px;
      border: 5px solid #e0e7ff;
      border-top: 5px solid #6366f1;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 20px;
    }
    
    .loading-text {
      color: #64748b;
      font-size: 15px;
      font-weight: 600;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    /* Error */
    .error-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 30px;
    }
    
    .error-box {
      max-width: 700px;
      width: 100%;
      padding: 40px;
      background: white;
      border: 3px solid #fca5a5;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    }
    
    .error-icon {
      font-size: 64px;
      text-align: center;
      margin-bottom: 20px;
    }
    
    .error-title {
      color: #dc2626;
      font-size: 28px;
      font-weight: 800;
      text-align: center;
      margin-bottom: 16px;
    }
    
    .error-description {
      color: #4b5563;
      font-size: 16px;
      text-align: center;
      margin-bottom: 20px;
      line-height: 1.6;
    }
    
    .error-code {
      background: #fef2f2;
      padding: 20px;
      border-radius: 12px;
      border: 2px solid #fca5a5;
      font-family: 'Courier New', monospace;
      font-size: 14px;
      overflow-x: auto;
      white-space: pre-wrap;
      word-break: break-word;
      color: #991b1b;
      margin-bottom: 20px;
      max-height: 300px;
      overflow-y: auto;
    }
    
    .error-stack {
      margin: 20px 0;
    }
    
    .error-stack summary {
      cursor: pointer;
      color: #6366f1;
      font-weight: 600;
      padding: 10px;
      background: #f3f4f6;
      border-radius: 8px;
    }
    
    .error-stack pre {
      background: #f9fafb;
      padding: 15px;
      border-radius: 8px;
      font-size: 12px;
      color: #374151;
      overflow-x: auto;
      margin-top: 10px;
    }
    
    .error-hint {
      text-align: center;
      color: #6b7280;
      font-size: 14px;
      line-height: 1.6;
      padding: 16px;
      background: #f9fafb;
      border-radius: 10px;
      border-left: 4px solid #6366f1;
    }
  </style>
  `;
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export default PreviewSandbox;
