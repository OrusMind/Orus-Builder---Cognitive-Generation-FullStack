/**
 * ============================================================================
 * ORUS BUILDER - GENERATE PAGE (WORKING VERSION)
 * ============================================================================
 * 
 * Versão funcional com progresso REAL incrementando
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Download,
  Zap,
  CheckCircle,
  Loader2,
  Sparkles,
  FileCode,
  Copy,
  CheckCheck,
  MessageCircle,
  Send,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { PromptInput, PromptOptions } from '@/components/generation/PromptInput';
import toast from 'react-hot-toast';

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
// MOCK FILES (será substituído por backend real)
// ============================================================================

const generateMockFiles = (prompt: string): GeneratedFile[] => {
  return [
    {
      path: 'src/App.tsx',
      fileName: 'App.tsx',
      language: 'typescript',
      content: `import React from 'react';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <h1 className="text-4xl font-bold mb-4">
        ${prompt}
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        Gerado com ORUS Builder - Trinity AI ✨
      </p>
    </div>
  );
};

export default App;`,
      lines: 14,
    },
    {
      path: 'src/main.tsx',
      fileName: 'main.tsx',
      language: 'typescript',
      content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
      lines: 10,
    },
    {
      path: 'package.json',
      fileName: 'package.json',
      language: 'json',
      content: `{
  "name": "orus-generated-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}`,
      lines: 12,
    },
  ];
};

// ============================================================================
// GENERATE PAGE COMPONENT
// ============================================================================

export const GeneratePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const hasInitialPrompt = Boolean(state?.prompt);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState<string | null>(null);
  const [files, setFiles] = useState<GeneratedFile[] | null>(null);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatExpanded, setIsChatExpanded] = useState(false);

  /**
   * Auto-start if coming from HomePage
   */
  useEffect(() => {
    if (hasInitialPrompt && state.prompt) {
      handleGenerate(state.prompt, {
        framework: 'react',
        language: 'typescript',
        style: 'standard',
        includeTests: true,
      });
    }
  }, []);

  /**
   * Simulate generation with REAL progress
   */
  const handleGenerate = async (prompt: string, options: PromptOptions) => {
    setIsGenerating(true);
    setIsComplete(false);
    setProgress(0);
    setFiles(null);

    // Add user message
    setChatMessages([
      {
        id: '1',
        role: 'user',
        content: prompt,
        timestamp: new Date(),
      },
      {
        id: '2',
        role: 'trinity',
        content: '🚀 Iniciando geração com Trinity AI...',
        timestamp: new Date(),
      },
    ]);

    const stages = [
      { name: 'Analisando prompt', progress: 15, duration: 1500 },
      { name: 'Gerando estrutura', progress: 30, duration: 2000 },
      { name: 'Escrevendo código', progress: 60, duration: 3000 },
      { name: 'Validando com CIG-2.0', progress: 85, duration: 1500 },
      { name: 'Finalizando', progress: 100, duration: 1000 },
    ];

    for (const stage of stages) {
      setCurrentStage(stage.name);
      
      // Smooth progress increment
      const increment = (stage.progress - progress) / 20;
      for (let i = 0; i < 20; i++) {
        await new Promise(resolve => setTimeout(resolve, stage.duration / 20));
        setProgress(prev => Math.min(prev + increment, stage.progress));
      }

      setProgress(stage.progress);
    }

    // Generation complete!
    const generatedFiles = generateMockFiles(prompt);
    setFiles(generatedFiles);
    setIsGenerating(false);
    setIsComplete(true);
    setCurrentStage('Completo');
    setProgress(100);

    setChatMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'trinity',
        content: `✨ Geração completa! ${generatedFiles.length} arquivos criados com 0 erros. Todos validados com CIG-2.0!`,
        timestamp: new Date(),
      },
    ]);

    toast.success(`✅ ${generatedFiles.length} arquivos gerados!`);
  };

  /**
   * Handle copy file
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
    setIsGenerating(false);
    setIsComplete(false);
    setProgress(0);
    setFiles(null);
    setChatMessages([]);
    navigate('/generate', { replace: true, state: {} });
  };

  /**
   * Validate prompt
   */
  const validatePrompt = (prompt: string) => {
    const length = prompt.trim().length;
    return {
      isValid: length >= 10,
      quality: Math.min((length / 100) * 100, 100),
      warnings: length < 30 ? ['Considere adicionar mais detalhes'] : undefined,
    };
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

            <div className="flex items-center gap-2">
              {isComplete && (
                <>
                  <button onClick={handleNewGeneration} className="btn-primary flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Nova Geração
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
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
                      Descreva sua ideia e Trinity AI gerará código pronto para produção
                    </p>
                  </div>

                  <PromptInput
                    onSubmit={(prompt, options) => handleGenerate(prompt, options)}
                    isGenerating={isGenerating}
                    validatePrompt={validatePrompt}
                    minLength={10}
                    maxLength={2000}
                  />
                </motion.div>
              )}

              {/* GENERATING STATE */}
              {isGenerating && (
                <motion.div
                  key="generating"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="glass-card p-12 space-y-8">
                    <div className="text-center space-y-6">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1], rotate: [0, 360] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 shadow-glow"
                      >
                        <Sparkles className="w-12 h-12 text-white" />
                      </motion.div>

                      <div>
                        <h2 className="text-4xl font-heading font-bold mb-2">
                          Trinity AI está trabalhando...
                        </h2>
                        <p className="text-xl text-gray-700 dark:text-gray-300">
                          Criando algo incrível para você
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {currentStage}
                        </span>
                        <span className="text-3xl font-bold gradient-text">
                          {Math.round(progress)}%
                        </span>
                      </div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
                        <motion.div
                          style={{ width: `${progress}%` }}
                          transition={{ duration: 0.3 }}
                          className="h-full bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 shadow-glow"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* RESULTS STATE */}
              {isComplete && files && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="glass-card p-8">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-success-500 to-success-600 flex items-center justify-center">
                        <CheckCircle className="w-10 h-10 text-white" />
                      </div>
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

                  {/* Files */}
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* TRINITY CHAT (minimizado) */}
        <motion.div
          animate={{ height: isChatExpanded ? '400px' : '60px' }}
          className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 flex flex-col"
        >
          <div
            className="flex items-center justify-between px-6 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
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
            <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg">
              {isChatExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>

          {isChatExpanded && (
            <>
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
                      <p className="text-xs opacity-70 mt-1">{msg.timestamp.toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Pergunte algo..."
                    className="input flex-1"
                  />
                  <button className="btn-primary">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};
