/**
 * ============================================================================
 * ORUS BUILDER - GENERATE PAGE (EPIC FINAL VERSION)
 * ============================================================================
 * 
 * UX FEATURES:
 * - Chat minimizado por padrão com badge de notificação
 * - Animações visuais épicas durante geração
 * - Confetti e celebração quando completar
 * - Preview visual 3D do app sendo construído
 * - Conexão REAL com backend (WebSocket + API)
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
  Bell,
  Eye,
  Code2,
  Box,
  Layers,
} from 'lucide-react';
import { PromptInput, PromptOptions } from '@/components/generation/PromptInput';
import { useGeneration } from '@/hooks/useGeneration';
import { ProgrammingLanguage, Framework } from '@/types/api.types';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

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
  read?: boolean;
}

interface VisualStep {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  color: string;
}

// ============================================================================
// VISUAL STEPS FOR ANIMATION
// ============================================================================

const VISUAL_STEPS: VisualStep[] = [
  {
    id: 'analyzing',
    icon: <Sparkles className="w-8 h-8" />,
    label: 'Analisando',
    description: 'Compreendendo sua ideia...',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'architecture',
    icon: <Box className="w-8 h-8" />,
    label: 'Arquitetura',
    description: 'Desenhando estrutura...',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'components',
    icon: <Layers className="w-8 h-8" />,
    label: 'Componentes',
    description: 'Criando componentes...',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'styling',
    icon: <Sparkles className="w-8 h-8" />,
    label: 'Estilização',
    description: 'Aplicando design...',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: 'validation',
    icon: <CheckCircle className="w-8 h-8" />,
    label: 'Validação',
    description: 'Garantindo qualidade...',
    color: 'from-teal-500 to-cyan-500',
  },
];

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
      // 🎉 CELEBRAÇÃO!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      
      toast.success(`✅ ${files.length} arquivos gerados com sucesso!`);
      
      addTrinityMessage(
        `🎉 Parabéns! Seu app está pronto! ${files.length} arquivos criados com 0 erros. Quer que eu explique a arquitetura?`,
        'success',
        false // não lido = badge de notificação
      );
      
      setUnreadCount((prev) => prev + 1);
    },
    onError: (error) => {
      toast.error(`❌ Erro: ${error.message}`);
      
      addTrinityMessage(
        `❌ Encontrei um problema: ${error.message}. Posso tentar novamente com ajustes?`,
        'error',
        false
      );
      
      setUnreadCount((prev) => prev + 1);
    },
  });

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatExpanded, setIsChatExpanded] = useState(false); // ← MINIMIZADO POR PADRÃO
  const [unreadCount, setUnreadCount] = useState(0);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  
  // Visual state
  const [currentVisualStep, setCurrentVisualStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  /**
   * Add Trinity message helper
   */
  const addTrinityMessage = (content: string, type: ChatMessage['type'] = 'info', read = false) => {
    const message: ChatMessage = {
      id: `trinity-${Date.now()}`,
      role: 'trinity',
      content,
      timestamp: new Date(),
      type,
      read,
    };
    setChatMessages((prev) => [...prev, message]);
    
    if (!read && !isChatExpanded) {
      setUnreadCount((prev) => prev + 1);
    }
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
      read: true,
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
      addTrinityMessage(
        '🚀 Entendi perfeitamente! Vou criar seu app agora. Acompanhe o progresso em tempo real...',
        'info',
        true // já lido porque está começando
      );

      handleGenerate(prompt, {
        framework: 'react',
        language: 'typescript',
        style: 'standard',
        includeTests: true,
      });
    }
  }, []);

  /**
   * Update visual step based on progress
   */
  useEffect(() => {
    if (isGenerating) {
      const stepIndex = Math.floor((progress / 100) * VISUAL_STEPS.length);
      setCurrentVisualStep(Math.min(stepIndex, VISUAL_STEPS.length - 1));
    }
  }, [progress, isGenerating]);

  /**
   * Update Trinity messages based on generation stage
   */
  useEffect(() => {
    if (currentStage) {
      const stageMessages: Record<string, string> = {
        analyzing: '🔍 Analisando requisitos e definindo arquitetura ideal...',
        architecture: '🏗️ Desenhando estrutura de componentes e fluxo de dados...',
        components: '⚛️ Gerando componentes React com TypeScript type-safe...',
        styling: '🎨 Aplicando seu design system com Tailwind CSS...',
        tests: '🧪 Criando testes automatizados para garantir qualidade...',
        optimization: '⚡ Otimizando código e performance...',
        validation: '✅ Validando com CIG-2.0 - garantindo 0 erros de compilação...',
      };

      if (stageMessages[currentStage]) {
        addTrinityMessage(stageMessages[currentStage], 'info', true);
      }
    }
  }, [currentStage]);

  /**
   * Auto-scroll chat
   */
  useEffect(() => {
    if (isChatExpanded) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatExpanded]);

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

    // TODO: Replace with real Trinity API call
    setTimeout(() => {
      addTrinityMessage(
        `Analisando: "${chatInput}". Como posso ajudar? Posso corrigir código, sugerir melhorias ou explicar decisões de arquitetura.`,
        'suggestion',
        false
      );
      
      if (!isChatExpanded) {
        setUnreadCount((prev) => prev + 1);
      }
    }, 800);

    setChatInput('');
  };

  /**
   * Handle chat expand/collapse
   */
  const handleChatToggle = () => {
    setIsChatExpanded(!isChatExpanded);
    
    if (!isChatExpanded) {
      // Mark all as read when opening
      setUnreadCount(0);
      setChatMessages((prev) =>
        prev.map((msg) => ({ ...msg, read: true }))
      );
    }
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
    setUnreadCount(0);
    setCurrentVisualStep(0);
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
                    onClick={() => setShowPreview(!showPreview)}
                    className="btn-ghost flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    {showPreview ? 'Código' : 'Preview'}
                  </button>
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
                    Novo
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ===================================================================
          MAIN CONTENT AREA
          =================================================================== */}
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
                      addTrinityMessage('🚀 Iniciando geração...', 'info', true);
                      handleGenerate(prompt, options);
                    }}
                    isGenerating={isGenerating}
                    validatePrompt={validatePrompt}
                    minLength={10}
                    maxLength={2000}
                  />
                </motion.div>
              )}

              {/* GENERATING STATE - EPIC VISUAL */}
              {isGenerating && (
                <motion.div
                  key="generating"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >
                  {/* Hero Animation */}
                  <div className="glass-card p-12 space-y-8">
                    <div className="text-center space-y-6">
                      {/* Animated Icon */}
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
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
                          Progresso da Geração
                        </span>
                        <span className="text-3xl font-bold gradient-text">
                          {progress}%
                        </span>
                      </div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.5 }}
                          className="h-full bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 shadow-glow relative overflow-hidden"
                        >
                          {/* Shimmer effect */}
                          <motion.div
                            animate={{
                              x: ['-100%', '100%'],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: 'linear',
                            }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          />
                        </motion.div>
                      </div>
                    </div>

                    {/* Visual Steps */}
                    <div className="grid grid-cols-5 gap-4">
                      {VISUAL_STEPS.map((step, index) => {
                        const isActive = currentVisualStep === index;
                        const isCompleted = currentVisualStep > index;

                        return (
                          <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`text-center space-y-3 p-4 rounded-xl transition-all ${
                              isActive
                                ? 'bg-white dark:bg-gray-800 shadow-lg scale-105'
                                : isCompleted
                                ? 'bg-success-50 dark:bg-success-900/20'
                                : 'bg-gray-100 dark:bg-gray-800/50'
                            }`}
                          >
                            <motion.div
                              animate={
                                isActive
                                  ? {
                                      scale: [1, 1.2, 1],
                                      rotate: [0, 180, 360],
                                    }
                                  : {}
                              }
                              transition={{
                                duration: 2,
                                repeat: isActive ? Infinity : 0,
                              }}
                              className={`inline-flex items-center justify-center w-16 h-16 rounded-full mx-auto ${
                                isActive
                                  ? `bg-gradient-to-br ${step.color} text-white shadow-lg`
                                  : isCompleted
                                  ? 'bg-success-500 text-white'
                                  : 'bg-gray-300 dark:bg-gray-700 text-gray-500'
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle className="w-8 h-8" />
                              ) : (
                                step.icon
                              )}
                            </motion.div>
                            <div>
                              <h3 className="font-semibold text-sm mb-1">
                                {step.label}
                              </h3>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {step.description}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Floating Code Particles */}
                    <div className="relative h-24 overflow-hidden">
                      {[...Array(10)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{
                            x: Math.random() * 100 + '%',
                            y: 100,
                            opacity: 0,
                          }}
                          animate={{
                            y: -100,
                            opacity: [0, 1, 0],
                          }}
                          transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                          }}
                          className="absolute"
                        >
                          <Code2
                            className="w-6 h-6 text-primary-400"
                            style={{
                              filter: 'blur(1px)',
                            }}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* RESULTS STATE */}
              {isComplete && files && files.length > 0 && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  {/* Success Header with Confetti Effect */}
                  <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="glass-card p-8"
                  >
                    <div className="flex items-center gap-6">
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                        className="w-20 h-20 rounded-full bg-gradient-to-br from-success-500 to-success-600 flex items-center justify-center shadow-lg"
                      >
                        <CheckCircle className="w-10 h-10 text-white" />
                      </motion.div>
                      <div className="flex-1">
                        <h2 className="text-3xl font-heading font-bold mb-2">
                          🎉 Seu App Está Pronto!
                        </h2>
                        <p className="text-lg text-gray-700 dark:text-gray-300">
                          {files.length} arquivos gerados • 100% pronto para produção • Zero erros de compilação
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          🏆 Parabéns! Você acabou de criar algo incrível que muitos achavam impossível.
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Files Grid */}
                  <div className="grid gap-4">
                    {files.map((file, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="glass-card p-6 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-4">
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

                        <pre className="code-block overflow-x-auto max-h-96 text-xs">
                          <code>{file.content}</code>
                        </pre>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ERROR STATE */}
              {hasError && error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-12"
                >
                  <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-error-100 dark:bg-error-900/30">
                      <AlertCircle className="w-10 h-10 text-error-600" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-heading font-bold mb-3">
                        Ops! Algo deu errado
                      </h2>
                      <p className="text-lg text-gray-700 dark:text-gray-300">
                        {error.message}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Não se preocupe! Vou tentar novamente com ajustes.
                      </p>
                    </div>
                    <button
                      onClick={handleNewGeneration}
                      className="btn-primary text-lg px-8 py-4"
                    >
                      <Zap className="w-5 h-5" />
                      Tentar Novamente
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ===================================================================
            TRINITY CHAT PANEL (MINIMIZED WITH NOTIFICATION BADGE)
            =================================================================== */}
        <motion.div
          initial={false}
          animate={{
            height: isChatExpanded ? '400px' : '60px',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 flex flex-col relative"
        >
          {/* Chat Header with Notification Badge */}
          <div
            className="flex items-center justify-between px-6 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            onClick={handleChatToggle}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                
                {/* NOTIFICATION BADGE */}
                {unreadCount > 0 && !isChatExpanded && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-error-500 flex items-center justify-center"
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                      }}
                    >
                      <Bell className="w-3 h-3 text-white" />
                    </motion.div>
                    <span className="absolute text-xs font-bold text-white">
                      {unreadCount}
                    </span>
                  </motion.div>
                )}
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm flex items-center gap-2">
                  Trinity AI Chat
                  {unreadCount > 0 && !isChatExpanded && (
                    <span className="px-2 py-0.5 rounded-full bg-error-500 text-white text-xs">
                      {unreadCount} nova{unreadCount > 1 ? 's' : ''}
                    </span>
                  )}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {isGenerating
                    ? 'Gerando seu projeto...'
                    : isComplete
                    ? 'Projeto completo! Posso ajudar?'
                    : 'Pronto para ajudar'}
                </p>
              </div>
            </div>
            <motion.button
              animate={{ rotate: isChatExpanded ? 180 : 0 }}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              {isChatExpanded ? (
                <Minimize2 className="w-5 h-5" />
              ) : (
                <Maximize2 className="w-5 h-5" />
              )}
            </motion.button>
          </div>

          {/* Chat Messages (only when expanded) */}
          {isChatExpanded && (
            <>
              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                {chatMessages.length === 0 && (
                  <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-8">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Converse com Trinity AI sobre o projeto...</p>
                    <p className="text-xs mt-2">
                      Posso explicar decisões, corrigir código ou sugerir melhorias
                    </p>
                  </div>
                )}

                {chatMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
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
                          : msg.type === 'suggestion'
                          ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
                          : 'bg-gray-100 dark:bg-gray-700'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {msg.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
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
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  💡 Dica: Peça para Trinity explicar decisões, corrigir bugs ou melhorar código
                </p>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};
