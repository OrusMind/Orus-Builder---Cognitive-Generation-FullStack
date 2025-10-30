/**
 * ============================================================================
 * ORUS BUILDER - PROMPT INPUT COMPONENT ⭐ (v3.0 - AI-POWERED)
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator) + Minerva Omega
 * VERSION: 3.0.0
 * LAST_MODIFIED: 2025-10-30T17:29:00-03:00
 * 
 * ✅ FIX #17: Dark Mode Support - Textarea + All Elements
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
        className={clsx(
          'relative rounded-2xl p-8 shadow-xl backdrop-blur-sm',
          'bg-white dark:bg-gray-800',
          'border border-gray-200 dark:border-gray-700'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className={clsx(
            'text-xl font-bold',
            'text-gray-900 dark:text-white'
          )}>
            Descreva Seu Projeto
          </h2>
          
          <button
            onClick={() => setShowOptions(!showOptions)}
            className={clsx(
              'px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm',
              showOptions
                ? 'bg-blue-600 text-white dark:bg-blue-700'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'
            )}
          >
            {showOptions ? 'Ocultar' : 'Mostrar'} Opções
          </button>
        </div>
        
        {/* ========================================
            TEXTAREA - ✅ FIX #17: DARK MODE SUPPORT
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
              'border-2 transition-all duration-300',
              'resize-none',
              
              // ✅ FIX #17.1: Background + Text Color
              'bg-white dark:bg-gray-700',
              'text-gray-900 dark:text-white',
              'placeholder:text-gray-500 dark:placeholder:text-gray-400',
              
              // ✅ FIX #17.2: Border Colors
              'border-gray-300 dark:border-gray-600',
              isValid ? 'focus:border-blue-500 dark:focus:border-blue-400' : 'focus:border-gray-400 dark:focus:border-gray-500',
              
              // ✅ FIX #17.3: Focus Ring
              'focus:outline-none focus:ring-2',
              'focus:ring-blue-500/50 dark:focus:ring-blue-400/50',
              
              // ✅ FIX #17.4: Disabled State
              isGenerating && 'opacity-50 cursor-not-allowed dark:opacity-50'
            )}
          />
          
          {/* Character Counter - ✅ FIX #17.5: Dark Mode Colors */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <span className={clsx(
              'text-xs font-medium',
              charCount >= 4500 
                ? 'text-red-600 dark:text-red-400' 
                : 'text-gray-500 dark:text-gray-400'
            )}>
              {charCount} / 5000
            </span>
            {isValid && (
              <span className="text-green-500 dark:text-green-400 text-sm">✓</span>
            )}
          </div>
        </div>
        
        {/* ========================================
            AI HINT - ✅ FIX #17.6: Dark Mode Support
        ======================================== */}
        <div className={clsx(
          'mb-6 p-4 rounded-lg border',
          'bg-blue-50 dark:bg-blue-900/20',
          'border-blue-200 dark:border-blue-800'
        )}>
          <p className={clsx(
            'text-sm',
            'text-blue-900 dark:text-blue-300'
          )}>
            💡 <strong>Dica:</strong> Quanto mais detalhes você fornecer, melhor será o resultado. 
            A IA analisará sua descrição e gerará automaticamente a quantidade ideal de arquivos.
          </p>
        </div>
        
        {/* ========================================
            OPTIONS PANEL - ✅ FIX #17.7: Dark Mode Support
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
              <div className={clsx(
                'grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl',
                'bg-gray-50 dark:bg-gray-700/50'
              )}>
                
                {/* FRAMEWORK */}
                <div>
                  <label className={clsx(
                    'block text-sm font-semibold mb-2',
                    'text-gray-900 dark:text-white'
                  )}>
                    Framework
                  </label>
                  <select
                    value={options.framework}
                    onChange={(e) => setOptions({ ...options, framework: e.target.value as any })}
                    className={clsx(
                      'w-full px-4 py-2 rounded-lg',
                      'bg-white dark:bg-gray-600',
                      'text-gray-900 dark:text-white',
                      'border border-gray-300 dark:border-gray-500',
                      'focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none'
                    )}
                  >
                    <option value="react">React</option>
                    <option value="vue">Vue</option>
                    <option value="angular">Angular</option>
                    <option value="nextjs">Next.js</option>
                  </select>
                </div>
                
                {/* LANGUAGE */}
                <div>
                  <label className={clsx(
                    'block text-sm font-semibold mb-2',
                    'text-gray-900 dark:text-white'
                  )}>
                    Linguagem
                  </label>
                  <select
                    value={options.language}
                    onChange={(e) => setOptions({ ...options, language: e.target.value as any })}
                    className={clsx(
                      'w-full px-4 py-2 rounded-lg',
                      'bg-white dark:bg-gray-600',
                      'text-gray-900 dark:text-white',
                      'border border-gray-300 dark:border-gray-500',
                      'focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none'
                    )}
                  >
                    <option value="typescript">TypeScript</option>
                    <option value="javascript">JavaScript</option>
                  </select>
                </div>
                
                {/* INCLUDE TESTS */}
                <div className="md:col-span-2">
                  <label className={clsx(
                    'flex items-center space-x-3 cursor-pointer',
                    'text-gray-900 dark:text-white'
                  )}>
                    <input
                      type="checkbox"
                      checked={options.includeTests}
                      onChange={(e) => setOptions({ ...options, includeTests: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300 dark:border-gray-500 text-blue-600 dark:text-blue-500 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-sm font-semibold">
                        Incluir Testes
                      </span>
                      <p className={clsx(
                        'text-xs',
                        'text-gray-600 dark:text-gray-400'
                      )}>
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
            SUBMIT BUTTON - ✅ FIX #17.8: Dark Mode Support
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
              ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg hover:shadow-xl dark:from-blue-700 dark:to-blue-600'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-50 dark:bg-gray-700 dark:text-gray-400'
          )}
        >
          {isGenerating ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-6 h-6 border-3 border-t-transparent border-white dark:border-white rounded-full"
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
        
        {/* Helper Text - ✅ FIX #17.9: Dark Mode Colors */}
        {!isValid && prompt.length > 0 && (
          <p className={clsx(
            'mt-2 text-xs text-center',
            'text-gray-600 dark:text-gray-400'
          )}>
            Por favor, digite pelo menos 10 caracteres
          </p>
        )}
      </motion.div>


      {/* ========================================
          EXAMPLE PROMPTS - ✅ FIX #17.10: Dark Mode Support
      ======================================== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 text-center"
      >
        <p className={clsx(
          'text-sm font-semibold mb-4',
          'text-gray-900 dark:text-white'
        )}>
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
                'bg-gray-50 dark:bg-gray-700',
                'hover:bg-gray-100 dark:hover:bg-gray-600',
                'border border-gray-200 dark:border-gray-600',
                'hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md',
                isGenerating && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{example.icon}</span>
                <span className={clsx(
                  'font-semibold text-sm',
                  'text-gray-900 dark:text-white'
                )}>
                  {example.label}
                </span>
              </div>
              <p className={clsx(
                'text-xs line-clamp-2',
                'text-gray-600 dark:text-gray-400'
              )}>
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
