/**
 * ============================================================================
 * ORUS BUILDER - PROMPT INPUT COMPONENT ⭐ (ENHANCED)
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator) + Minerva Omega
 * CREATED: 2025-10-09T21:10:00-03:00
 * LAST_MODIFIED: 2025-10-26T09:17:00-03:00
 * VERSION: 2.0.0
 * 
 * CHANGES:
 * - Unified complexity control (removed style confusion)
 * - Enhanced visual design with modern gradients
 * - Added informative tooltips
 * - Removed provider-specific references (Groq → AI Engine)
 * - Improved UX with real-time validation
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
  complexity?: 'minimal' | 'standard' | 'feature_rich' | 'enterprise'; // ✅ UNIFICADO
  includeTests?: boolean;
}

interface PromptInputProps {
  onSubmit: (prompt: string, options: PromptOptions) => void;
  isGenerating?: boolean;
  className?: string;
}

// ============================================================================
// COMPLEXITY CONFIG
// ============================================================================

const COMPLEXITY_OPTIONS = [
  {
    value: 'minimal',
    label: 'Minimal (MVP)',
    description: 'Single component with minimal features',
    files: '1-3 files',
    icon: '📦',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    value: 'standard',
    label: 'Standard',
    description: 'Complete component with types and styles',
    files: '4-8 files',
    icon: '⚡',
    color: 'from-purple-500 to-pink-500'
  },
  {
    value: 'feature_rich',
    label: 'Feature Rich',
    description: 'Full feature set with multiple components',
    files: '15-25 files',
    icon: '🚀',
    color: 'from-orange-500 to-red-500'
  },
  {
    value: 'enterprise',
    label: 'Enterprise Fullstack',
    description: 'Complete system with frontend, backend, and database',
    files: '30-60 files',
    icon: '💎',
    color: 'from-green-500 to-emerald-500'
  }
] as const;

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const PromptInput: React.FC<PromptInputProps> = ({
  onSubmit,
  isGenerating = false,
  className
}) => {
  // ============================================================================
  // STATE
  // ============================================================================
  
  const [prompt, setPrompt] = useState('');
  const [options, setOptions] = useState<PromptOptions>({
    framework: 'react',
    language: 'typescript',
    complexity: 'standard', // ✅ DEFAULT
    includeTests: true,
  });
  
  const [showOptions, setShowOptions] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [isValid, setIsValid] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // ============================================================================
  // EFFECTS
  // ============================================================================
  
  useEffect(() => {
    setCharCount(prompt.length);
    setIsValid(prompt.length >= 10); // Mínimo 10 caracteres
  }, [prompt]);
  
  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);
  
  // ============================================================================
  // HANDLERS
  // ============================================================================
  
  const handleSubmit = () => {
    if (isValid && !isGenerating) {
      onSubmit(prompt, options);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
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
        className="relative bg-gradient-to-br from-background/95 to-background border border-primary/30 rounded-2xl p-6 shadow-2xl backdrop-blur-sm"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Describe Your App
          </h2>
          
          <button
            onClick={() => setShowOptions(!showOptions)}
            className={clsx(
              'px-4 py-2 rounded-lg font-medium transition-all duration-300',
              showOptions
                ? 'bg-primary text-primary-foreground'
                : 'bg-background-secondary text-foreground hover:bg-primary/20'
            )}
          >
            {showOptions ? 'Hide' : 'Show'} Options
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
            placeholder="Describe the app you want to create... (min 10 characters)"
            disabled={isGenerating}
            className={clsx(
              'w-full min-h-[120px] max-h-[400px] px-4 py-3 rounded-xl',
              'bg-background-secondary border-2 transition-all duration-300',
              'text-foreground placeholder-foreground-muted',
              'focus:outline-none focus:ring-2 focus:ring-primary/50',
              'resize-none',
              isValid ? 'border-primary/50' : 'border-border',
              isGenerating && 'opacity-50 cursor-not-allowed'
            )}
          />
          
          {/* Character Counter */}
          <div className="absolute bottom-3 right-3 text-xs text-foreground-muted">
            {charCount} / 2000 {isValid ? '✓' : ''}
          </div>
        </div>
        
        {/* ========================================
            OPTIONS PANEL (EXPANDABLE)
        ======================================== */}
        <AnimatePresence>
          {showOptions && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-background-secondary/50 rounded-xl">
                
                {/* ========================================
                    FRAMEWORK SELECT
                ======================================== */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Framework
                  </label>
                  <select
                    value={options.framework}
                    onChange={(e) => setOptions({ ...options, framework: e.target.value as any })}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-primary/30 text-foreground focus:ring-2 focus:ring-primary/50 focus:outline-none"
                  >
                    <option value="react">React</option>
                    <option value="vue">Vue</option>
                    <option value="angular">Angular</option>
                    <option value="nextjs">Next.js</option>
                  </select>
                </div>
                
                {/* ========================================
                    LANGUAGE SELECT
                ======================================== */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Language
                  </label>
                  <select
                    value={options.language}
                    onChange={(e) => setOptions({ ...options, language: e.target.value as any })}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-primary/30 text-foreground focus:ring-2 focus:ring-primary/50 focus:outline-none"
                  >
                    <option value="typescript">TypeScript</option>
                    <option value="javascript">JavaScript</option>
                  </select>
                </div>
                
                {/* ========================================
                    COMPLEXITY SELECT (ENHANCED)
                ======================================== */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Complexity Level
                  </label>
                  
                  {/* Visual Complexity Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {COMPLEXITY_OPTIONS.map((complexity) => (
                      <motion.button
                        key={complexity.value}
                        onClick={() => setOptions({ ...options, complexity: complexity.value })}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={clsx(
                          'relative p-4 rounded-xl border-2 transition-all duration-300',
                          'text-left overflow-hidden group',
                          options.complexity === complexity.value
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50 bg-background-secondary'
                        )}
                      >
                        {/* Gradient Background */}
                        <div className={clsx(
                          'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity',
                          complexity.color
                        )} />
                        
                        {/* Content */}
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">{complexity.icon}</span>
                            {options.complexity === complexity.value && (
                              <span className="text-primary text-sm">✓</span>
                            )}
                          </div>
                          
                          <h4 className="font-bold text-foreground mb-1">
                            {complexity.label}
                          </h4>
                          
                          <p className="text-xs text-foreground-muted mb-2">
                            {complexity.description}
                          </p>
                          
                          <span className={clsx(
                            'inline-block px-2 py-1 rounded text-xs font-medium',
                            options.complexity === complexity.value
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-background-secondary text-foreground-muted'
                          )}>
                            {complexity.files}
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
                
                {/* ========================================
                    INCLUDE TESTS TOGGLE
                ======================================== */}
                <div className="md:col-span-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.includeTests}
                      onChange={(e) => setOptions({ ...options, includeTests: e.target.checked })}
                      className="w-5 h-5 rounded border-border text-primary focus:ring-primary focus:ring-offset-0"
                    />
                    <div>
                      <span className="text-sm font-medium text-foreground">Include Tests</span>
                      <p className="text-xs text-foreground-muted">
                        Generate unit tests for components
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
              : 'bg-background-secondary text-foreground-muted cursor-not-allowed opacity-50'
          )}
        >
          {isGenerating ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-6 h-6 border-3 border-t-transparent border-white rounded-full"
              />
              <span>Generating with AI Engine...</span>
            </>
          ) : (
            <>
              <span>⚡</span>
              <span>Generate App</span>
              <span className="text-sm opacity-75">(Ctrl+Enter)</span>
            </>
          )}
        </motion.button>
        
        {/* Helper Text */}
        {!isValid && prompt.length > 0 && (
          <p className="mt-2 text-xs text-foreground-muted text-center">
            Please enter at least 10 characters
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default PromptInput;
