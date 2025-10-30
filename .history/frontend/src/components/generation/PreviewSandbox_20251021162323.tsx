import React, { useState, useEffect } from 'react';
import { Sandpack } from '@codesandbox/sandpack-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Loader2, CheckCircle } from 'lucide-react';

/**
 * 🧹 Remove markdown fences do código gerado
 */
/**
 * 🧹 Remove markdown fences do código gerado
 */
function cleanMarkdownFences(code: string): string {
  return code
    // Remove markdown fences no início/fim (```typescript, ``````tsx, ```
    .replace(/^```[\w]*\s*\n/gm, '')
    .replace(/\n```
    .replace(/^```\s*$/gm, '')
    // Remove fences soltos no meio do código
    .replace(/\n```
    .replace(/\n```$/g, '')
    .trim();
}


/**
 * 🔄 Processa código multi-file separado por comentários
 */
function processMultiFileCode(code: string, filename: string): Record<string, string> {
  // 🧹 PRIMEIRO: Limpar markdown fences de TODO o código
  const cleanedCode = cleanMarkdownFences(code);
  
  // Detecta padrão: // src/components/Header.tsx
  const filePattern = /\/\/\s*(?:src\/)?([^\n]+\.tsx?)\n([^]*?)(?=\/\/\s*(?:src\/)?[^\n]+\.tsx?|$)/gi;
  const matches = [...cleanedCode.matchAll(filePattern)];
  
  if (matches.length > 1) {
    console.log('🗂️ Multi-file detectado:', matches.length, 'arquivos');
    const files: Record<string, string> = {};
    
    matches.forEach(([_, path, content]) => {
      const cleanPath = `/${path.trim()}`;
      // 🧹 Limpar cada arquivo individualmente também
      const cleanContent = cleanMarkdownFences(content.trim());
      files[cleanPath] = cleanContent;
      console.log('📄 Arquivo processado:', cleanPath);
    });
    
    return files;
  }
  
  // Single file - usar App.tsx como padrão
  console.log('📄 Single-file detectado');
  return {
    '/App.tsx': cleanedCode
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
      {/* ✅ Loading Overlay */}
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
              <p className="text-gray-300 text-sm font-medium">Transpilando código...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Error State */}
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

      {/* ✅ Success Indicator */}
      <AnimatePresence>
        {success && (
          <motion.div
            className="absolute top-4 right-4 z-30 bg-green-500/20 border border-green-500/30 rounded-lg px-4 py-2 flex items-center gap-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-300 text-sm font-medium">Renderizado!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🎨 Sandpack Preview com Tema Dark Customizado */}
      <div 
        className="w-full h-full rounded-lg overflow-hidden"
        style={{ minHeight: '400px' }}
      >
        <Sandpack
          template="react-ts"
          files={files}
          options={{
  showNavigator: false,
  showTabs: Object.keys(files).length > 1,
  showLineNumbers: false,
  editorHeight: '100%',
  editorWidthPercentage: 0,
  showInlineErrors: true,
  autorun: true,
  autoReload: true,
}}

          theme={{
            colors: {
              surface1: '#1e1e1e',        // Background principal (VS Code Dark)
              surface2: '#252526',        // Background secundário
              surface3: '#2d2d30',        // Background terciário
              clickable: '#0e639c',       // Links e botões clicáveis
              base: '#d4d4d4',           // Texto padrão
              disabled: '#858585',        // Texto desabilitado
              hover: '#2a2d2e',          // Hover state
              accent: '#007acc',          // Cor de destaque (VS Code azul)
              error: '#f48771',           // Cor de erro
              errorSurface: '#3f1f1f',   // Background de erro
            },
            syntax: {
              plain: '#d4d4d4',          // Texto normal
              comment: { 
                color: '#6a9955',        // Comentários (verde)
                fontStyle: 'italic' 
              },
              keyword: { color: '#569cd6' },      // Keywords (azul claro)
              tag: { color: '#4ec9b0' },          // Tags JSX (ciano)
              punctuation: { color: '#d4d4d4' },  // Pontuação
              definition: { color: '#dcdcaa' },   // Definições de função
              property: { color: '#9cdcfe' },     // Propriedades
              static: { color: '#4fc1ff' },       // Membros estáticos
              string: { color: '#ce9178' },       // Strings (laranja)
            },
            font: {
              body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              mono: '"Fira Code", "Fira Mono", Consolas, "Courier New", monospace',
              size: '14px',
              lineHeight: '1.6',
            },
          }}
          customSetup={{
            dependencies: {
              ...dependencies,
              react: 'latest',
              'react-dom': 'latest',
            }
          }}
        />
      </div>
    </div>
  );
};
