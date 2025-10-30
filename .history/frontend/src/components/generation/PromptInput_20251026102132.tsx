/**
 * ============================================================================
 * ORUS BUILDER - PROMPT INPUT COMPONENT ⭐ (v3.0 - AI-POWERED)
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator) + Minerva Omega
 * VERSION: 3.0.0
 * LAST_MODIFIED: 2025-10-26T10:23:00-03:00
 * 
 * ============================================================================
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface PromptOptions {
  framework?: 'react' | 'vue' | 'angular' | 'nextjs';
  language?: 'typescript' | 'javascript';
  includeTests?: boolean;
  style?: 'modern' | 'minimal' | 'classic';
}

interface PromptInputProps {
  onSubmit: (prompt: string, options: PromptOptions) => void;
  isGenerating?: boolean;
  className?: string;
}

// ============================================================================
// EXAMPLE PROMPTS
// ============================================================================

const EXAMPLE_PROMPTS = [
  {
    icon: '📊',
    label: 'Dashboard',
    prompt: 'Dashboard moderno com gráficos de vendas, métricas em tempo real e tabela de produtos'
  },
  {
    icon: '🎨',
    label: 'Landing Page',
    prompt: 'Landing page responsiva com hero section, features, testimonials e formulário de contato'
  },
  {
    icon: '📝',
    label: 'Blog',
    prompt: 'Sistema de blog com posts, comentários, autenticação e painel admin'
  },
  {
    icon: '🛒',
    label: 'E-commerce',
    prompt: 'Sistema de e-commerce com catálogo, carrinho, checkout e admin'
  }
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const PromptInput: React.FC<PromptInputProps> = ({
  onSubmit,
  isGenerating = false,
  className
}) => {
  // STATE
  const [prompt, setPrompt] = useState('');
  const [options, setOptions] = useState<PromptOptions>({
    framework: 'react',
    language: 'typescript',
    includeTests: true,
    style: 'modern'
  });
  
  const [showOptions, setShowOptions] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [isValid, setIsValid] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // EFFECTS
  useEffect(() => {
    setCharCount(prompt.length);
    setIsValid(prompt.length >= 10);
  }, [prompt]);
  
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);
  
  // HANDLERS
  const handleSubmit = () => {
    if (isValid && !isGenerating) {
      console.log('═══════════════════════════════════════════════════════');
      console.log('🔍 [PromptInput] handleSubmit() CHAMADO');
      console.log('[PromptInput] prompt:', prompt);
      console.log('[PromptInput] options:', options);
      console.log('═══════════════════════════════════════════════════════');
      
      onSubmit(prompt, options);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };
  
  const handleExampleClick = (examplePrompt: string) => {
    if (!isGenerating) {
      setPrompt(examplePrompt);
    }
  };
  
  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <div className={clsx('w-full max-w-4xl mx-auto', className)}>
      
      {/* ========================================
          MAIN INPUT CARD
      ======================================== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-card/95 dark:bg-background/95 border border-border rounded-2xl p-8 shadow-xl backdrop-blur-sm"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">
            Descreva Seu Projeto
          </h2>
          
          <button
            onClick={() => setShowOptions(!showOptions)}
            className={clsx(
              'px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm',
              showOptions
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80 text-foreground'
            )}
          >
            {showOptions ? 'Ocultar' : 'Mostrar'} Opções
          </button>
        </div>
        
        {/* ========================================
            TEXTAREA
        ======================================== */}
        <div className="relative mb-4">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Exemplo: Dashboard com gráficos de vendas, tabela de produtos e filtros por data..."
            disabled={isGenerating}
            maxLength={5000}
            className={clsx(
              'w-full min-h-[180px] max-h-[500px] px-4 py-3 rounded-xl',
              'bg-background border-2 transition-all duration-300',
              'text-foreground placeholder:text-muted-foreground',
              'focus:outline-none focus:ring-2 focus:ring-primary/50',
              'resize-none',
              isValid ? 'border-primary/50' : 'border-border',
              isGenerating && 'opacity-50 cursor-not-allowed'
            )}
          />
          
          {/* Character Counter */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <span className={clsx(
              'text-xs font-medium',
              charCount >= 4500 ? 'text-destructive' : 'text-muted-foreground'
            )}>
              {charCount} / 5000
            </span>
            {isValid && (
              <span className="text-green-500 text-sm">✓</span>
            )}
          </div>
        </div>
        
        {/* ========================================
            AI HINT
        ======================================== */}
        <div className="mb-6 p-4 bg-muted/30 dark:bg-muted/10 rounded-lg border border-border/30">
          <p className="text-sm text-foreground/80">
            💡 <strong>Dica:</strong> Quanto mais detalhes você fornecer, melhor será o resultado. 
            A IA analisará sua descrição e gerará automaticamente a quantidade ideal de arquivos.
          </p>
        </div>
        
        {/* ========================================
            OPTIONS PANEL
        ======================================== */}
        <AnimatePresence>
          {showOptions && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-xl">
                
                {/* FRAMEWORK */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Framework
                  </label>
                  <select
                    value={options.framework}
                    onChange={(e) => setOptions({ ...options, framework: e.target.value as any })}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/50 focus:outline-none"
                  >
                    <option value="react">React</option>
                    <option value="vue">Vue</option>
                    <option value="angular">Angular</option>
                    <option value="nextjs">Next.js</option>
                  </select>
                </div>
                
                {/* LANGUAGE */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Linguagem
                  </label>
                  <select
                    value={options.language}
                    onChange={(e) => setOptions({ ...options, language: e.target.value as any })}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/50 focus:outline-none"
                  >
                    <option value="typescript">TypeScript</option>
                    <option value="javascript">JavaScript</option>
                  </select>
                </div>
                
                {/* INCLUDE TESTS */}
                <div className="md:col-span-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.includeTests}
                      onChange={(e) => setOptions({ ...options, includeTests: e.target.checked })}
                      className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                    />
                    <div>
                      <span className="text-sm font-semibold text-foreground">
                        Incluir Testes
                      </span>
                      <p className="text-xs text-muted-foreground">
                        Gerar testes unitários para os componentes
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* ========================================
            SUBMIT BUTTON
        ======================================== */}
        <motion.button
          onClick={handleSubmit}
          disabled={!isValid || isGenerating}
          whileHover={isValid && !isGenerating ? { scale: 1.02 } : {}}
          whileTap={isValid && !isGenerating ? { scale: 0.98 } : {}}
          className={clsx(
            'w-full py-4 rounded-xl font-bold text-lg transition-all duration-300',
            'flex items-center justify-center space-x-3',
            isValid && !isGenerating
              ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg hover:shadow-xl'
              : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
          )}
        >
          {isGenerating ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-6 h-6 border-3 border-t-transparent border-white rounded-full"
              />
              <span>Gerando com Trinity AI...</span>
            </>
          ) : (
            <>
              <span>⚡</span>
              <span>Gerar Projeto</span>
              <span className="text-sm opacity-75">(Ctrl+Enter)</span>
            </>
          )}
        </motion.button>
        
        {/* Helper Text */}
        {!isValid && prompt.length > 0 && (
          <p className="mt-2 text-xs text-muted-foreground text-center">
            Por favor, digite pelo menos 10 caracteres
          </p>
        )}
      </motion.div>

      {/* ========================================
          EXAMPLE PROMPTS
      ======================================== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 text-center"
      >
        <p className="text-sm font-semibold text-foreground mb-4">
          Exemplos de prompts:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {EXAMPLE_PROMPTS.map((example, index) => (
            <motion.button
              key={index}
              onClick={() => handleExampleClick(example.prompt)}
              disabled={isGenerating}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={clsx(
                'p-4 rounded-xl transition-all duration-300 text-left',
                'bg-muted/50 hover:bg-muted border border-border/50',
                'hover:border-primary/50 hover:shadow-md',
                isGenerating && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{example.icon}</span>
                <span className="font-semibold text-sm text-foreground">
                  {example.label}
                </span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {example.prompt}
              </p>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default PromptInput;
