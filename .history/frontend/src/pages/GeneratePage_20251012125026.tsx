/**
 * ORUS BUILDER - GENERATE PAGE (WORKING VERSION v2.0)
 * Combina visual épico + conexão backend REAL
 */

import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { PromptInput, PromptOptions } from '@/components/generation/PromptInput';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

// Types
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

  const handleGenerate = async (prompt: string, options: PromptOptions) => {
  setIsGenerating(true);
  setIsComplete(false);
  setProgress(0);
  setFiles(null);
  setJobId(null);

  addMessage('user', prompt);
  addMessage('trinity', '🚀 Conectando com backend...');

  try {
    // 🔥 CALL REAL BACKEND
    const response = await fetch('http://localhost:5000/api/v1/generation', {
      method: 'POST', // ← ESSENCIAL!
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: prompt.trim(),
        language: options.language || 'typescript',
        framework: options.framework?.toUpperCase() || 'REACT',
        projectId: 'new',
        options: {
          style: options.style || 'standard',
          includeTests: options.includeTests || false,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.statusText}`);
    }

    const data = await response.json();
    const generatedJobId = data.jobId || data.data?.jobId;

    if (!generatedJobId) {
      throw new Error('No jobId received from backend');
    }

    setJobId(generatedJobId);
    addMessage('trinity', `✅ Job criado: ${generatedJobId}. Gerando código...`);

    // Simulate progress
    const stages = [
      { name: 'Analisando prompt', progress: 20, duration: 2000 },
      { name: 'Gerando arquitetura', progress: 40, duration: 3000 },
      { name: 'Escrevendo componentes', progress: 70, duration: 4000 },
      { name: 'Validando com CIG-2.0', progress: 90, duration: 2000 },
      { name: 'Finalizando', progress: 100, duration: 1000 },
    ];

    for (const stage of stages) {
      setCurrentStage(stage.name);
      setProgress(stage.progress);
      await new Promise(resolve => setTimeout(resolve, stage.duration));
    }

    // Get results
   const resultResponse = await fetch(`http://localhost:5000/api/v1/generation/${generatedJobId}/result`);
    
    if (!resultResponse.ok) {
      throw new Error('Failed to get results');
    }

    const result = await resultResponse.json();
    const generatedFiles: GeneratedFile[] = result.data?.files || result.files || [];

    if (generatedFiles.length === 0) {
      throw new Error('No files generated');
    }

    setFiles(generatedFiles);
    setIsGenerating(false);
    setIsComplete(true);
    setProgress(100);

    // Celebration
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    addMessage('trinity', `🎉 Código gerado! ${generatedFiles.length} arquivos criados!`);
    toast.success(`✅ ${generatedFiles.length} arquivos gerados!`);

  } catch (error: any) {
    console.error('❌ Generation error:', error);
    
    setIsGenerating(false);
    setIsComplete(false);
    
    addMessage('trinity', `❌ Erro: ${error.message}`);
    toast.error(`Erro: ${error.message}`);
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
  }, []); // Run once on mount

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
              <button onClick={() => navigate('/generate', { replace: true, state: {} })} className="btn-primary">
                <Zap className="w-4 h-4" />
                Nova Geração
              </button>
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
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-success-500 to-success-600 flex items-center justify-center">
                      <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-heading font-bold mb-2">
                        🎉 Seu App Está Pronto!
                      </h2>
                      <p className="text-lg text-gray-700 dark:text-gray-300">
                        {files.length} arquivos gerados • 100% pronto
                      </p>
                    </div>
                  </div>
                </div>

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
                        <FileCode className="w-5 h-5 text-primary-600" />
                        <div>
                          <h3 className="font-mono text-sm font-semibold">{file.path}</h3>
                          <p className="text-xs text-gray-600">{file.lines} linhas</p>
                        </div>
                      </div>
                      <button onClick={() => handleCopyFile(file.content, file.path)} className="btn-ghost p-2">
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
