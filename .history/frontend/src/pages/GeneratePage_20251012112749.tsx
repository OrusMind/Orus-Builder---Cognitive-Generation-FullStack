/**
 * ============================================================================
 * ORUS BUILDER - GENERATE PAGE (SMART UX)
 * ============================================================================
 * 
 * CREATED: 2025-10-12T11:30:00-03:00
 * 
 * UX SCENARIOS:
 * 1. From HomePage (prompt filled) → Skip input, show chat + preview
 * 2. Direct access (no prompt) → Show input, then chat + preview
 * 3. Authenticated user → Show recent + community projects
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
  FileCode,
  Copy,
  CheckCheck,
  Sparkles,
  MessageCircle,
  Play,
  Clock,
  TrendingUp,
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
  autoStart?: boolean; // ← NEW: Auto-start generation
}

interface RecentProject {
  id: string;
  name: string;
  preview: string;
  createdAt: string;
  framework: string;
}

// ============================================================================
// GENERATE PAGE COMPONENT
// ============================================================================

export const GeneratePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  // Check if user came from HomePage with prompt
  const hasInitialPrompt = Boolean(state?.prompt);
  const shouldAutoStart = state?.autoStart !== false;

  // Mock auth state (replace with real auth later)
  const [isAuthenticated] = useState(false);
  const [recentProjects] = useState<RecentProject[]>([]);

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
    },
    onError: (error) => {
      toast.error(`❌ Erro: ${error.message}`);
    },
  });

  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);

  /**
   * Auto-start generation if coming from HomePage
   */
  useEffect(() => {
    if (hasInitialPrompt && shouldAutoStart && !isGenerating && !isComplete) {
      const prompt = state.prompt!;
      
      // Add initial message to chat
      setChatMessages([
        { role: 'user', content: prompt },
        { role: 'assistant', content: '🚀 Iniciando geração com Trinity AI...' },
      ]);

      // Start generation
      handleGenerate(prompt, {
        framework: 'react',
        language: 'typescript',
        style: 'standard',
        includeTests: true,
      });
    }
  }, []);

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
   * Validate prompt
   */
  const validatePrompt = (prompt: string) => {
    const words = prompt.trim().split(/\s+/);
    const length = prompt.trim().length;
    
    let quality = 0;
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: any[] = [];

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

    if (words.length < 5) {
      warnings.push('Adicione mais detalhes sobre o que deseja criar');
    }

    const hasAction = /create|build|make|generate|criar|fazer|gerar/i.test(prompt);
    const hasTech = /react|vue|angular|next|typescript|javascript/i.test(prompt);
    
    if (!hasAction) {
      suggestions.push({
        id: 'action',
        type: 'improvement',
        message: 'Inicie com um verbo de ação (ex: "Criar", "Fazer", "Gerar")',
      });
      quality = Math.max(quality - 10, 0);
    }

    if (hasTech) {
      quality = Math.min(quality + 10, 100);
    }

    const isValid = errors.length === 0 && length >= 10;

    return {
      isValid,
      errors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined,
      suggestions: suggestions.length > 0 ? suggestions : undefined,
      quality,
    };
  };

  /**
   * Handle copy file content
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
      console.error('Download failed:', error);
      toast.error('Erro ao fazer download');
    }
  };

  /**
   * Decide which view to show
   */
  const showPromptInput = !hasInitialPrompt && !isGenerating && !isComplete;
  const showChatView = (hasInitialPrompt || isGenerating || isComplete) && !hasError;
  const showRecentProjects = isAuthenticated && !isGenerating && !isComplete && recentProjects.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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

      <div className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {/* ===============================================================
              SCENARIO 1: PROMPT INPUT (Direct access, no prompt)
              =============================================================== */}
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
                  setChatMessages([
                    { role: 'user', content: prompt },
                    { role: 'assistant', content: '🚀 Iniciando geração com Trinity AI...' },
                  ]);
                  handleGenerate(prompt, options);
                }}
                isGenerating={isGenerating}
                validatePrompt={validatePrompt}
                minLength={10}
                maxLength={2000}
              />

              {/* Recent Projects (if authenticated) */}
              {showRecentProjects && (
                <div className="mt-12">
                  <h2 className="text-2xl font-heading font-bold mb-6">
                    Suas Criações Recentes
                  </h2>
                  <div className="grid md:grid-cols-3 gap-4">
                    {recentProjects.map((project) => (
                      <div key={project.id} className="card-hover p-4">
                        <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-3" />
                        <h3 className="font-semibold mb-1">{project.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {project.createdAt}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ===============================================================
              SCENARIO 2: CHAT + LIVE PREVIEW (From HomePage or generating)
              =============================================================== */}
          {showChatView && (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid lg:grid-cols-2 gap-6"
            >
              {/* LEFT: Chat Panel */}
              <div className="space-y-4">
                <div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="font-heading font-bold">Trinity AI</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {isGenerating ? 'Gerando...' : isComplete ? 'Completo' : 'Pronto'}
                      </p>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {chatMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-4 rounded-lg ${
                            msg.role === 'user'
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      </div>
                    ))}

                    {/* Generation Progress */}
                    {isGenerating && (
                      <div className="flex justify-start">
                        <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg space-y-3">
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-primary-600" />
                            <span className="text-sm">{currentStage || 'Processando...'}</span>
                          </div>
                          <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              className="h-full bg-gradient-to-r from-primary-600 to-accent-600 rounded-full"
                            />
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {progress}% completo
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Success Message */}
                    {isComplete && (
                      <div className="flex justify-start">
                        <div className="bg-success-100 dark:bg-success-900/30 p-4 rounded-lg">
                          <div className="flex items-center gap-2 text-success-700 dark:text-success-300">
                            <CheckCircle className="w-5 h-5" />
                            <span className="text-sm font-semibold">
                              ✨ Geração completa! {files?.length || 0} arquivos criados.
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT: Live Preview */}
              <div className="space-y-4">
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <Play className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <h2 className="font-heading font-bold">Live Preview</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {isGenerating ? 'Atualizando em tempo real...' : 'Pronto para visualizar'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Preview Area */}
                  <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                    {isGenerating && (
                      <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Gerando preview...
                        </p>
                      </div>
                    )}

                    {isComplete && (
                      <div className="text-center">
                        <CheckCircle className="w-12 h-12 text-success-600 mx-auto mb-4" />
                        <p className="text-sm font-semibold">Preview pronto!</p>
                      </div>
                    )}

                    {!isGenerating && !isComplete && (
                      <div className="text-center text-gray-400">
                        <Sparkles className="w-12 h-12 mx-auto mb-4" />
                        <p className="text-sm">Aguardando geração...</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Files List */}
                {files && files.length > 0 && (
                  <div className="glass-card p-6">
                    <h3 className="font-semibold mb-4">Arquivos Gerados ({files.length})</h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {files.map((file, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <FileCode className="w-5 h-5 text-primary-600" />
                            <div className="flex-1 min-w-0">
                              <p className="font-mono text-sm truncate">{file.path}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {file.lines} linhas
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleCopyFile(file.content, file.path)}
                            className="btn-ghost p-2"
                          >
                            {copiedFile === file.path ? (
                              <CheckCheck className="w-4 h-4 text-success-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ===============================================================
              SCENARIO 3: ERROR STATE
              =============================================================== */}
          {hasError && error && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-8 space-y-4"
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
  );
};
