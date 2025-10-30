/**
 * ============================================================================
 * ORUS BUILDER - GENERATE PAGE (FINAL VERSION v4.0)
 * ============================================================================
 * ✅ Backend REAL com Groq API
 * ✅ Download ZIP completo
 * ✅ Live Preview FUNCIONANDO
 * ✅ Chat Trinity AI
 * ✅ Animações épicas
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Download,
  Zap,
  CheckCircle,
  Sparkles,
  FileCode,
  Copy,
  CheckCheck,
  MessageCircle,
  Eye,
  RefreshCw,
  Maximize2,
  AlertCircle,
} from 'lucide-react';
import { PromptInput, PromptOptions } from '@/components/generation/PromptInput';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

// ============================================================================
// TYPES
// ============================================================================

interface LocationState {
  prompt?: string;
  autoStart?: boolean;
}

interface GeneratedFile {
  path: string;
  fileName: string;
  content: string;
  language: string;
  lines: number;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'trinity';
  content: string;
  timestamp: Date;
}

// ============================================================================
// LIVE PREVIEW COMPONENT (EMBEDDED)
// ============================================================================

const LivePreview: React.FC<{ files: GeneratedFile[] }> = ({ files }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Build preview HTML
   */
  const buildPreviewHTML = (): string => {
    try {
      // Find App file
      const appFile = files.find(f => 
        f.path.includes('App.tsx') || 
        f.path.includes('App.jsx') ||
        f.fileName.includes('App.tsx') ||
        f.fileName.includes('App.jsx')
      );

      if (!appFile) {
        throw new Error('No App.tsx/App.jsx file found in generated files');
      }

      // Build HTML with React and Babel
      return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ORUS Preview</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    #root {
      min-height: 100vh;
    }
    * {
      box-sizing: border-box;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  
  <script type="text/babel">
    try {
      // Generated code
      ${appFile.content}
      
      // Render
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(React.createElement(App));
    } catch (error) {
      document.getElementById('root').innerHTML = 
        '<div style="padding: 40px; text-align: center; color: #e74c3c; font-family: monospace;">' +
        '<h2>Preview Error</h2>' +
        '<p>' + error.message + '</p>' +
        '<small>Check console for details</small>' +
        '</div>';
      console.error('Preview render error:', error);
    }
  </script>
</body>
</html>
      `;
    } catch (error: any) {
      throw error;
    }
  };

  /**
   * Update iframe
   */
  useEffect(() => {
    if (!iframeRef.current) return;

    try {
      setIsLoading(true);
      setError(null);

      const html = buildPreviewHTML();
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;

      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
      }

      // Simulate loading
      setTimeout(() => setIsLoading(false), 1500);
    } catch (error: any) {
      setError(error.message);
      setIsLoading(false);
      console.error('Preview build error:', error);
    }
  }, [files]);

  /**
   * Refresh preview
   */
  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  /**
   * Open in new tab
   */
  const handleOpenInTab = () => {
    try {
      const html = buildPreviewHTML();
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error: any) {
      toast.error('Erro ao abrir preview');
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
      {/* Preview Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Live Preview
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpenInTab}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Open in new tab"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 relative bg-white">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900 z-10">
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-12 h-12 mx-auto mb-3 text-primary-600" />
              </motion.div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Carregando preview...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900 z-10">
            <div className="text-center max-w-md p-6">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error-600" />
              <h3 className="text-lg font-semibold mb-2">Preview Error</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {error}
              </p>
              <button
                onClick={handleRefresh}
                className="btn-primary"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          className="w-full h-full border-0"
          title="Preview"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
};

// ============================================================================
// MAIN GENERATE PAGE COMPONENT
// ============================================================================

export const GeneratePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const hasInitialPrompt = Boolean(state?.prompt);

  // State
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState<string | null>(null);
  const [files, setFiles] = useState<GeneratedFile[] | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  /**
   * Add message helper
   */
  const addMessage = (role: 'user' | 'trinity', content: string) => {
    setChatMessages(prev => [...prev, {
      id: `${role}-${Date.now()}`,
      role,
      content,
      timestamp: new Date(),
    }]);
  };

  /**
 * Handle generation with REAL backend + UI Enhancement
 */
const handleGenerate = async (prompt: string, options: PromptOptions) => {
  setIsGenerating(true);
  setIsComplete(false);
  setProgress(0);
  setFiles(null);
  setJobId(null);
  setShowPreview(false);

  addMessage('user', prompt);
  addMessage('trinity', '🚀 Conectando com Groq API + UI Enhancement Engine...');

  try {
    // Step 1: Create generation job
    console.log('📤 Enviando request para backend...');
    
    const response = await fetch('http://localhost:5000/api/v1/generation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: prompt.trim(),
        language: options.language || 'typescript',
        framework: options.framework?.toUpperCase() || 'REACT',
        projectId: 'new',
        options: {
          style: 'modern',                    // ✅ Estilo moderno
          includeTests: options.includeTests || false,
          
          // ✅ UI ENHANCEMENT OPTIONS (ADICIONAR)
          applyStyles: true,                 // ✅ Ativar UI Enhancement
          applyTailwind: true,               // ✅ Aplicar Tailwind CSS
          applyFramerMotion: false,          // Opcional: animações
          darkMode: true,                    // ✅ Classes dark mode
          responsive: true,                  // ✅ Classes responsivas
          minTailwindClasses: 10,            // ✅ Mínimo 10 classes por componente
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Backend response:', data);
    
    const generatedJobId = data.jobId || data.data?.jobId;

    if (!generatedJobId) {
      throw new Error('No jobId received from backend');
    }

    setJobId(generatedJobId);
    addMessage('trinity', `✅ Job criado: ${generatedJobId}. Gerando código com Tailwind CSS...`);

    // Step 2: Simulate progress while backend processes
    const stages = [
      { name: 'Analisando prompt com Trinity AI', progress: 15, duration: 2000 },
      { name: 'Groq gerando arquitetura React...', progress: 35, duration: 3000 },
      { name: '🎨 Aplicando UI Enhancement (Tailwind CSS)...', progress: 60, duration: 3000 },
      { name: 'Adicionando dark mode e responsividade...', progress: 80, duration: 2000 },
      { name: 'Validando com CIG-2.0...', progress: 95, duration: 1500 },
      { name: 'Finalizando...', progress: 100, duration: 1000 },
    ];

    for (const stage of stages) {
      setCurrentStage(stage.name);
      setProgress(stage.progress);
      await new Promise(resolve => setTimeout(resolve, stage.duration));
    }

    // Step 3: Get results from backend
    console.log('📥 Buscando resultado do backend...');
    
    const resultResponse = await fetch(
      `http://localhost:5000/api/v1/generation/${generatedJobId}/result`
    );
    
    if (!resultResponse.ok) {
      throw new Error(`Failed to get results: ${resultResponse.statusText}`);
    }

    const result = await resultResponse.json();
    console.log('✅ Result from backend:', result);

    // Parse files
    const generatedFiles: GeneratedFile[] = 
      result.data?.files || 
      result.files || 
      result.result?.files || 
      [];

    if (generatedFiles.length === 0) {
      throw new Error('No files generated by backend');
    }

    // Format files
    const formattedFiles: GeneratedFile[] = generatedFiles.map((file: any) => ({
      path: file.path || file.fileName || 'unknown',
      fileName: file.fileName || file.name || file.path || 'file.tsx',
      content: file.content || '// No content',
      language: file.language || 'typescript',
      lines: file.lines || file.content?.split('\n').length || 0,
    }));

    // ✅ Verificar se Tailwind foi aplicado
    const firstFile = formattedFiles[0];
    const tailwindClassCount = (firstFile.content.match(/className="/g) || []).length;
    
    console.log('🎨 Classes Tailwind detectadas:', tailwindClassCount);
    
    if (tailwindClassCount === 0) {
      console.warn('⚠️ UI Enhancement não foi aplicado! Nenhuma classe Tailwind encontrada');
      addMessage('trinity', '⚠️ Aviso: UI Enhancement pode não ter sido aplicado corretamente');
    } else {
      console.log('✅ UI Enhancement aplicado!', tailwindClassCount, 'classes Tailwind');
      addMessage('trinity', `✅ UI Enhancement aplicado! ${tailwindClassCount} classes Tailwind adicionadas`);
    }

    setFiles(formattedFiles);
    setIsGenerating(false);
    setIsComplete(true);
    setProgress(100);

    // Celebration!
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
    });

    addMessage('trinity', `🎉 Código REAL gerado com Tailwind! ${formattedFiles.length} arquivos criados com Groq!`);
    toast.success(`✅ ${formattedFiles.length} arquivos gerados com UI Enhancement!`);

  } catch (error: any) {
    console.error('❌ Generation error:', error);
    
    setIsGenerating(false);
    setIsComplete(false);
    
    addMessage('trinity', `❌ Erro: ${error.message}`);
    toast.error(`Erro: ${error.message}`);
  }
};


  /**
   * Handle download ZIP
   */
  const handleDownload = async () => {
    if (!files || files.length === 0) {
      toast.error('Nenhum arquivo para baixar');
      return;
    }

    try {
      const { saveAs } = await import('file-saver');
      const JSZip = (await import('jszip')).default;

      const zip = new JSZip();

      // Add all files
      files.forEach((file) => {
        zip.file(file.path, file.content);
      });

      // Add package.json
      const packageJson = {
        name: 'orus-generated-project',
        version: '1.0.0',
        private: true,
        scripts: {
          dev: 'vite',
          build: 'tsc && vite build',
          preview: 'vite preview',
        },
        dependencies: {
          react: '^18.3.1',
          'react-dom': '^18.3.1',
          axios: '^1.6.0',
        },
        devDependencies: {
          '@types/react': '^18.3.0',
          '@types/react-dom': '^18.3.0',
          '@vitejs/plugin-react': '^4.2.0',
          typescript: '^5.2.2',
          vite: '^5.0.0',
        },
      };

      zip.file('package.json', JSON.stringify(packageJson, null, 2));

      // Add README
      const readme = `# ORUS Generated Project

Generated by ORUS Builder with Trinity AI + Groq

## Setup

\`\`\`bash
npm install
npm run dev
\`\`\`

## Build

\`\`\`bash
npm run build
\`\`\`

## Files Generated

${files.map(f => `- ${f.path}`).join('\n')}

---

Powered by ORUS Builder 🚀
`;

      zip.file('README.md', readme);

      // Generate and download
      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, `orus-project-${Date.now()}.zip`);

      toast.success('📦 Download iniciado!');
      addMessage('trinity', '📦 Projeto baixado com sucesso!');
    } catch (error: any) {
      console.error('Download error:', error);
      toast.error(`Erro ao fazer download: ${error.message}`);
    }
  };

  /**
   * Auto-start on mount
   */
  useEffect(() => {
    if (hasInitialPrompt && state.prompt && !isGenerating && !isComplete && !jobId) {
      handleGenerate(state.prompt, {
        framework: 'react',
        language: 'typescript',
        style: 'standard',
        includeTests: true,
      });
    }
  }, []);

  /**
   * Copy file
   */
  const handleCopyFile = async (content: string, filename: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedFile(filename);
      toast.success(`📋 ${filename} copiado!`);
      setTimeout(() => setCopiedFile(null), 2000);
    } catch (error) {
      toast.error('Erro ao copiar');
    }
  };

  /**
   * Handle new generation
   */
  const handleNewGeneration = () => {
    setFiles(null);
    setIsComplete(false);
    setIsGenerating(false);
    setShowPreview(false);
    setProgress(0);
    setChatMessages([]);
    navigate('/generate', { replace: true, state: {} });
  };

  const showPromptInput = !hasInitialPrompt && !isGenerating && !isComplete;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* HEADER */}
      <header className="sticky top-0 z-50 glass-card border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/')} className="btn-ghost flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 shadow-glow" />
              <span className="font-heading font-bold gradient-text">ORUS Builder</span>
            </div>

            {isComplete && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  {showPreview ? 'Ver Código' : 'Ver Preview'}
                </button>

                <button
                  onClick={handleDownload}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download ZIP
                </button>

                <button
                  onClick={handleNewGeneration}
                  className="btn-primary flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Nova Geração
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <AnimatePresence mode="wait">
            {/* PROMPT INPUT */}
            {showPromptInput && (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2 mb-8">
                  <h1 className="text-4xl font-heading font-bold">
                    O que você quer <span className="gradient-text">criar</span> hoje?
                  </h1>
                  <p className="text-gray-700 dark:text-gray-300">
                    Descreva sua ideia e Trinity AI gerará código real
                  </p>
                </div>

                <PromptInput
                  onSubmit={(prompt, options) => {
                    addMessage('user', prompt);
                    handleGenerate(prompt, options);
                  }}
                  isGenerating={isGenerating}
                  validatePrompt={(prompt) => ({
                    isValid: prompt.length >= 10,
                    quality: Math.min((prompt.length / 100) * 100, 100),
                  })}
                  minLength={10}
                  maxLength={2000}
                />
              </motion.div>
            )}

            {/* GENERATING */}
            {isGenerating && (
              <motion.div key="generating" className="glass-card p-12 space-y-8">
                <div className="text-center space-y-6">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 shadow-glow"
                  >
                    <Sparkles className="w-12 h-12 text-white" />
                  </motion.div>

                  <h2 className="text-4xl font-heading font-bold">
                    Trinity AI está trabalhando...
                  </h2>
                  <p className="text-xl text-gray-700 dark:text-gray-300">{currentStage}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{currentStage}</span>
                    <span className="text-3xl font-bold gradient-text">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      style={{ width: `${progress}%` }}
                      className="h-full bg-gradient-to-r from-primary-600 to-accent-600"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* RESULTS */}
            {isComplete && files && (
              <motion.div key="results" className="space-y-6">
                <div className="glass-card p-8">
                  <div className="flex items-center gap-6">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-20 h-20 rounded-full bg-gradient-to-br from-success-500 to-success-600 flex items-center justify-center shadow-lg"
                    >
                      <CheckCircle className="w-10 h-10 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <h2 className="text-3xl font-heading font-bold mb-2">
                        🎉 Seu App Está Pronto!
                      </h2>
                      <p className="text-lg text-gray-700 dark:text-gray-300">
                        {files.length} arquivos gerados • 100% pronto para produção
                      </p>
                    </div>
                  </div>
                </div>

                {/* Preview or Code */}
                {showPreview ? (
                  <div className="glass-card overflow-hidden" style={{ height: '600px' }}>
                    <LivePreview files={files} />
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {files.map((file, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-card p-6"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                              <FileCode className="w-5 h-5 text-primary-600" />
                            </div>
                            <div>
                              <h3 className="font-mono text-sm font-semibold">{file.path}</h3>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {file.lines} linhas • {file.language}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleCopyFile(file.content, file.path)}
                            className="btn-ghost p-2"
                          >
                            {copiedFile === file.path ? (
                              <CheckCheck className="w-5 h-5 text-success-600" />
                            ) : (
                              <Copy className="w-5 h-5" />
                            )}
                          </button>
                        </div>

                        <pre className="code-block overflow-x-auto max-h-96 text-xs">
                          <code>{file.content}</code>
                        </pre>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* TRINITY CHAT */}
      <motion.div
        animate={{ height: isChatExpanded ? '300px' : '60px' }}
        className="border-t bg-white dark:bg-gray-800 flex flex-col"
      >
        <div
          className="flex items-center justify-between px-6 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
          onClick={() => setIsChatExpanded(!isChatExpanded)}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm">Trinity AI Chat</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {isGenerating ? 'Gerando...' : isComplete ? 'Completo!' : 'Pronto'}
              </p>
            </div>
          </div>
        </div>

        {isChatExpanded && (
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};
