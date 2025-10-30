/**
 * ============================================================================
 * ORUS BUILDER - GENERATE PAGE (INTEGRATED WITH PROMPTINPUT)
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
}

// ============================================================================
// GENERATE PAGE COMPONENT
// ============================================================================

export const GeneratePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

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

  /**
   * Handle generation submission
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
   * Validate prompt (for PromptInput component)
   */
  const validatePrompt = (prompt: string) => {
    const words = prompt.trim().split(/\s+/);
    const length = prompt.trim().length;
    
    let quality = 0;
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: any[] = [];

    // Length check
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

    // Word count
    if (words.length < 5) {
      warnings.push('Adicione mais detalhes sobre o que deseja criar');
    }

    // Keywords check
    const hasAction = /create|build|make|generate/i.test(prompt);
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
              INPUT SECTION (Using YOUR PromptInput component!)
              =============================================================== */}
          {!isGenerating && !isComplete && !hasError && (
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

              {/* USE YOUR COMPONENT HERE! */}
              <PromptInput
                onSubmit={handleGenerate}
                isGenerating={isGenerating}
                validatePrompt={validatePrompt}
                minLength={10}
                maxLength={2000}
              />
            </motion.div>
          )}

          {/* ===============================================================
              GENERATING SECTION
              =============================================================== */}
          {isGenerating && (
            <motion.div
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="glass-card p-8 space-y-6">
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 shadow-glow animate-pulse">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-heading font-bold">
                    Trinity AI está trabalhando...
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    {currentStage || 'Iniciando geração'}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">
                      Progresso
                    </span>
                    <span className="font-bold gradient-text">
                      {progress}%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 shadow-glow"
                    />
                  </div>
                </div>

                <div className="grid gap-4">
                  {[
                    { name: 'Analisando prompt', progress: 20 },
                    { name: 'Gerando estrutura', progress: 40 },
                    { name: 'Escrevendo código', progress: 60 },
                    { name: 'Validando com CIG-2.0', progress: 80 },
                    { name: 'Finalizando', progress: 100 },
                  ].map((stage, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 ${
                        progress >= stage.progress
                          ? 'opacity-100'
                          : 'opacity-40'
                      }`}
                    >
                      {progress >= stage.progress ? (
                        <CheckCircle className="w-5 h-5 text-success-600" />
                      ) : (
                        <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
                      )}
                      <span className="text-sm">{stage.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ===============================================================
              RESULTS SECTION
              =============================================================== */}
          {isComplete && files && files.length > 0 && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="glass-card p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-success-100 dark:bg-success-900/30 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-success-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-heading font-bold">
                      ✨ Geração Completa!
                    </h2>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {files.length} arquivos gerados • 100% pronto para produção
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDownload}
                      className="btn-secondary"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button
                      onClick={handleNewGeneration}
                      className="btn-primary"
                    >
                      <Zap className="w-4 h-4" />
                      Nova Geração
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                {files.map((file, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
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
                      <pre className="code-block overflow-x-auto max-h-96 scrollbar-hide">
                        <code>{file.content}</code>
                      </pre>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ===============================================================
              ERROR SECTION
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
