/**
 * ============================================================================
 * ORUS BUILDER - GENERATE PAGE (VERTICAL LAYOUT + TRINITY CHAT)
 * ============================================================================
 * 
 * LAYOUT: Vertical full-width + Trinity Chat bottom panel
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
  AlertCircle,
  Sparkles,
  MessageCircle,
  Send,
  FileCode,
  Copy,
  CheckCheck,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { PromptInput, PromptOptions } from '@/components/generation/PromptInput';
import { useGeneration } from '@/hooks/useGeneration';
import { ProgrammingLanguage, Framework } from '@/types/api.types';
import toast from 'react-hot-toast';

// ============================================================================
// TYPES
// ============================================================================

interface LocationState {
  prompt?: string;
  autoStart?: boolean;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'trinity' | 'system';
  content: string;
  timestamp: Date;
  type?: 'info' | 'success' | 'error' | 'suggestion';
}

// ============================================================================
// GENERATE PAGE COMPONENT
// ============================================================================

export const GeneratePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const hasInitialPrompt = Boolean(state?.prompt);
  const shouldAutoStart = state?.autoStart !== false;

  // Generation hook
  const {
    startGeneration,
    isGenerating,
    isComplete,
    hasError,
    currentStage,
    progress,
    files,
    error,
    reset,
    downloadProject,
  } = useGeneration({
    enableRealtime: true,
    onSuccess: (files) => {
      toast.success(`✅ ${files.length} arquivos gerados com sucesso!`);
      addTrinityMessage(
        `✨ Geração completa! ${files.length} arquivos criados com sucesso. Todos os arquivos foram validados e estão prontos para uso.`,
        'success'
      );
    },
    onError: (error) => {
      toast.error(`❌ Erro: ${error.message}`);
      addTrinityMessage(
        `❌ Erro na geração: ${error.message}. Posso tentar novamente com ajustes?`,
        'error'
      );
    },
  });

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatExpanded, setIsChatExpanded] = useState(true);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  /**
   * Add Trinity message helper
   */
  const addTrinityMessage = (content: string, type: ChatMessage['type'] = 'info') => {
    const message: ChatMessage = {
      id: `trinity-${Date.now()}`,
      role: 'trinity',
      content,
      timestamp: new Date(),
      type,
    };
    setChatMessages((prev) => [...prev, message]);
  };

  /**
   * Add user message helper
   */
  const addUserMessage = (content: string) => {
    const message: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, message]);
  };

  /**
   * Auto-start generation if coming from HomePage
   */
  useEffect(() => {
    if (hasInitialPrompt && shouldAutoStart && !isGenerating && !isComplete) {
      const prompt = state.prompt!;
      
      addUserMessage(prompt);
      addTrinityMessage('🚀 Entendi! Vou iniciar a geração do seu projeto. Aguarde enquanto configuro a arquitetura ideal...');

      handleGenerate(prompt, {
        framework: 'react',
        language: 'typescript',
        style: 'standard',
        includeTests: true,
      });
    }
  }, []);

  /**
   * Update Trinity messages based on generation stage
   */
  useEffect(() => {
    if (currentStage) {
      const stageMessages: Record<string, string> = {
        analyzing: '🔍 Analisando requisitos e definindo arquitetura...',
        architecture: '🏗️ Desenhando estrutura de componentes...',
        components: '⚛️ Gerando componentes React com TypeScript...',
        styling: '🎨 Aplicando estilos e tema visual...',
        tests: '🧪 Criando testes automatizados...',
        optimization: '⚡ Otimizando código e performance...',
        validation: '✅ Validando com CIG-2.0 (zero erros garantidos)...',
      };

      if (stageMessages[currentStage]) {
        addTrinityMessage(stageMessages[currentStage], 'info');
      }
    }
  }, [currentStage]);

  /**
   * Handle generation
   */
  const handleGenerate = async (prompt: string, options: PromptOptions) => {
    try {
      await startGeneration({
        projectId: 'new',
        prompt: prompt.trim(),
        language: options.language === 'typescript' 
          ? ProgrammingLanguage.TYPESCRIPT 
          : ProgrammingLanguage.JAVASCRIPT,
        framework: (options.framework?.toUpperCase() as Framework) || Framework.REACT,
        options: {
          style: options.style || 'standard',
          includeTests: options.includeTests || true,
          includeDocumentation: true,
        },
      });
    } catch (error) {
      console.error('Generation failed:', error);
    }
  };

  /**
   * Handle chat submit
   */
  const handleChatSubmit = () => {
    if (!chatInput.trim()) return;

    addUserMessage(chatInput);

    // Mock Trinity response (replace with real API call)
    setTimeout(() => {
      addTrinityMessage(
        `Entendi sua mensagem: "${chatInput}". Como posso ajudar? Posso corrigir código, sugerir melhorias ou explicar a arquitetura.`,
        'info'
      );
    }, 500);

    setChatInput('');
  };

  /**
   * Validate prompt
   */
  const validatePrompt = (prompt: string) => {
    const length = prompt.trim().length;
    let quality = 0;
    const errors: string[] = [];
    const warnings: string[] = [];

    if (length < 10) {
      errors.push('Prompt muito curto (mínimo 10 caracteres)');
    } else if (length < 30) {
      warnings.push('Considere adicionar mais detalhes');
      quality = 40;
    } else if (length < 100) {
      quality = 70;
    } else {
      quality = 90;
    }

    return {
      isValid: errors.length === 0 && length >= 10,
      errors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined,
      quality,
    };
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
    reset();
    setChatMessages([]);
    navigate('/generate', { replace: true, state: {} });
  };

  /**
   * Handle download
   */
  const handleDownload = async () => {
    try {
      await downloadProject('zip');
      toast.success('📦 Download iniciado!');
    } catch (error) {
      toast.error('Erro ao fazer download');
    }
  };

  const showPromptInput = !hasInitialPrompt && !isGenerating && !isComplete;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* ===================================================================
          HEADER
          =================================================================== */}
      <header className="sticky top-0 z-50 glass-card border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="btn-ghost flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 shadow-glow" />
              <span className="font-heading font-bold gradient-text">
                ORUS Builder
              </span>
            </div>

            <div className="flex items-center gap-2">
              {isComplete && (
                <>
                  <button
                    onClick={handleDownload}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={handleNewGeneration}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    Nova Geração
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ===================================================================
          MAIN CONTENT AREA (VERTICAL FULL-WIDTH)
          =================================================================== */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <AnimatePresence mode="wait">
              {/* PROMPT INPUT (Direct access) */}
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
                      O que você quer{' '}
                      <span className="gradient-text">criar</span> hoje?
                    </h1>
                    <p className="text-gray-700 dark:text-gray-300">
                      Descreva sua ideia e Trinity AI gerará código pronto para produção
                    </p>
                  </div>

                  <PromptInput
                    onSubmit={(prompt, options) => {
                      addUserMessage(prompt);
                      addTrinityMessage('🚀 Iniciando geração...');
                      handleGenerate(prompt, options);
                    }}
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
                  <div className="glass-card p-8 space-y-6">
                    <div className="text-center space-y-4">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 shadow-glow animate-pulse">
                        <Sparkles className="w-10 h-10 text-white animate-spin" style={{ animationDuration: '3s' }} />
                      </div>
                      <h2 className="text-3xl font-heading font-bold">
                        Trinity AI está trabalhando...
                      </h2>
                      <p className="text-lg text-gray-700 dark:text-gray-300">
                        {currentStage || 'Iniciando geração'}
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Progresso
                        </span>
                        <span className="text-2xl font-bold gradient-text">
                          {progress}%
                        </span>
                      </div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.5 }}
                          className="h-full bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 shadow-glow"
                        />
                      </div>
                    </div>

                    {/* Stages */}
                    <div className="grid md:grid-cols-2 gap-4 mt-8">
                      {[
                        { name: 'Analisando prompt', progress: 20 },
                        { name: 'Gerando estrutura', progress: 40 },
                        { name: 'Escrevendo código', progress: 60 },
                        { name: 'Validando com CIG-2.0', progress: 80 },
                        { name: 'Finalizando', progress: 100 },
                      ].map((stage, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-3 p-3 rounded-lg ${
                            progress >= stage.progress
                              ? 'bg-success-50 dark:bg-success-900/20'
                              : 'bg-gray-100 dark:bg-gray-800'
                          }`}
                        >
                          {progress >= stage.progress ? (
                            <CheckCircle className="w-6 h-6 text-success-600 flex-shrink-0" />
                          ) : (
                            <Loader2 className="w-6 h-6 animate-spin text-primary-600 flex-shrink-0" />
                          )}
                          <span className={`text-sm font-medium ${
                            progress >= stage.progress
                              ? 'text-success-700 dark:text-success-300'
                              : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            {stage.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* RESULTS STATE */}
              {isComplete && files && files.length > 0 && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Success Header */}
                  <div className="glass-card p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-success-100 dark:bg-success-900/30 flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-success-600" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-heading font-bold">
                          ✨ Geração Completa!
                        </h2>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                          {files.length} arquivos gerados • 100% pronto para produção • Zero erros de compilação
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Files Grid */}
                  <div className="grid gap-4">
                    {files.map((file, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="glass-card p-6 space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                              <FileCode className="w-5 h-5 text-primary-600" />
                            </div>
                            <div>
                              <h3 className="font-mono text-sm font-semibold">
                                {file.path}
                              </h3>
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

                        <div className="relative">
                          <pre className="code-block overflow-x-auto max-h-96 scrollbar-hide text-xs">
                            <code>{file.content}</code>
                          </pre>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ERROR STATE */}
              {hasError && error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card p-8"
                >
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error-100 dark:bg-error-900/30">
                      <AlertCircle className="w-8 h-8 text-error-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-heading font-bold">
                        Erro na Geração
                      </h2>
                      <p className="text-gray-700 dark:text-gray-300 mt-2">
                        {error.message}
                      </p>
                    </div>
                    <button
                      onClick={handleNewGeneration}
                      className="btn-primary"
                    >
                      Tentar Novamente
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ===================================================================
            TRINITY CHAT PANEL (BOTTOM)
            =================================================================== */}
        <motion.div
          initial={false}
          animate={{
            height: isChatExpanded ? '400px' : '60px',
          }}
          className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 flex flex-col"
        >
          {/* Chat Header */}
          <div
            className="flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-gray-800 cursor-pointer"
            onClick={() => setIsChatExpanded(!isChatExpanded)}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm">Trinity AI Chat</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {isGenerating ? 'Gerando...' : 'Pronto para ajudar'}
                </p>
              </div>
            </div>
            <button
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {isChatExpanded ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Chat Messages */}
          {isChatExpanded && (
            <>
              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                {chatMessages.length === 0 && (
                  <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-8">
                    Converse com Trinity AI sobre o projeto...
                  </div>
                )}

                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.role === 'user'
                          ? 'bg-primary-600 text-white'
                          : msg.type === 'error'
                          ? 'bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800'
                          : msg.type === 'success'
                          ? 'bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800'
                          : 'bg-gray-100 dark:bg-gray-700'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {msg.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                    placeholder="Pergunte algo ou peça ajuda..."
                    className="input flex-1"
                  />
                  <button
                    onClick={handleChatSubmit}
                    disabled={!chatInput.trim()}
                    className="btn-primary"
                  >
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
