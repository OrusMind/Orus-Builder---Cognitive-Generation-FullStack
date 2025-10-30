/**
 * ============================================================================
 * ORUS BUILDER - PROMPT INPUT COMPONENT ⭐
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-09T21:10:00-03:00
 * LAST_MODIFIED: 2025-10-09T21:10:00-03:00
 * COMPONENT_HASH: orus.frontend.component.promptinput.20251009.PRM1W2X3
 * 
 * PURPOSE:
 * - Natural language prompt input for app generation
 * - Real-time validation and suggestions
 * - Voice input support
 * - Rich text editor with syntax highlighting
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: NaturalLanguageInputAgent
 * - COGNITIVE_LEVEL: Advanced
 * - AUTONOMY_DEGREE: 85
 * - TRINITY_INTEGRATED: Voz (Natural Language Processing)
 * ============================================================================
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { 
  Sparkles, 
  Mic, 
  StopCircle, 
  Send, 
  AlertCircle,
  CheckCircle,
  Lightbulb,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { Button } from '@components/common/Button';
import { Tooltip } from '@components/common/Tooltip';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface PromptInputProps {
  /**
   * Callback when prompt is submitted
   */
  onSubmit: (prompt: string, options: PromptOptions) => void;

  /**
   * Loading state during generation
   */
  isGenerating?: boolean;

  /**
   * Validation function for prompt
   */
  validatePrompt?: (prompt: string) => PromptValidation;

  /**
   * Custom placeholder
   */
  placeholder?: string;

  /**
   * Minimum prompt length
   */
  minLength?: number;

  /**
   * Maximum prompt length
   */
  maxLength?: number;
}

export interface PromptOptions {
  framework?: 'react' | 'vue' | 'angular' | 'nextjs';
  language?: 'typescript' | 'javascript';
  style?: 'minimal' | 'standard' | 'feature-rich';
  includeTests?: boolean;
}

export interface PromptValidation {
  isValid: boolean;
  errors?: string[];
  warnings?: string[];
  suggestions?: PromptSuggestion[];
  quality: number; // 0-100
}

export interface PromptSuggestion {
  id: string;
  type: 'framework' | 'feature' | 'improvement' | 'clarification';
  message: string;
  action?: string;
}

// ============================================================================
// EXAMPLE PROMPTS
// ============================================================================

const EXAMPLE_PROMPTS = [
  'Create a dashboard with user analytics and real-time charts',
  'Build a todo app with drag-and-drop and local storage',
  'Generate an e-commerce product catalog with filters',
  'Make a blog with markdown editor and dark mode',
];

// ============================================================================
// PROMPT INPUT COMPONENT
// ============================================================================

export const PromptInput: React.FC<PromptInputProps> = ({
  onSubmit,
  isGenerating = false,
  validatePrompt,
  placeholder = 'Describe the app you want to create...',
  minLength = 10,
  maxLength = 2000,
}) => {
  const [prompt, setPrompt] = useState('');
  const [options, setOptions] = useState<PromptOptions>({
    framework: 'react',
    language: 'typescript',
    style: 'standard',
    includeTests: true,
  });
  const [validation, setValidation] = useState<PromptValidation | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Real-time validation
  useEffect(() => {
    if (prompt.length >= minLength && validatePrompt) {
      const result = validatePrompt(prompt);
      setValidation(result);
    } else {
      setValidation(null);
    }
  }, [prompt, minLength, validatePrompt]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  const handleSubmit = () => {
    if (prompt.length >= minLength && (!validation || validation.isValid)) {
      onSubmit(prompt, options);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit with Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleVoiceInput = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      // TODO: Implement voice recognition
    } else {
      // Start recording
      setIsRecording(true);
      // TODO: Implement voice recognition
    }
  };

  const handleExampleClick = (example: string) => {
    setPrompt(example);
    setShowExamples(false);
    textareaRef.current?.focus();
  };

  const characterCount = prompt.length;
  const isPromptValid = characterCount >= minLength && characterCount <= maxLength;
  const qualityScore = validation?.quality || 0;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Input Area */}
      <div
        className={clsx(
          'relative rounded-2xl border-2 transition-all duration-300',
          'bg-background-surface',
          validation?.isValid
            ? 'border-accent shadow-glow-green'
            : validation?.errors && validation.errors.length > 0
            ? 'border-error shadow-glow-red'
            : 'border-primary/30 hover:border-primary/60'
        )}
      >
        {/* Header with quality indicator */}
        {validation && (
          <div className="px-6 pt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {validation.isValid ? (
                <CheckCircle className="w-5 h-5 text-accent" />
              ) : (
                <AlertCircle className="w-5 h-5 text-error" />
              )}
              <span className="text-sm font-medium text-foreground">
                {validation.isValid ? 'Prompt ready' : 'Needs improvement'}
              </span>
            </div>

            {/* Quality Score */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-foreground-muted">Quality:</span>
              <div className="flex items-center gap-1">
                <div className="w-24 h-2 bg-background-elevated rounded-full overflow-hidden">
                  <motion.div
                    className={clsx(
                      'h-full',
                      qualityScore >= 80
                        ? 'bg-accent'
                        : qualityScore >= 50
                        ? 'bg-primary'
                        : 'bg-error'
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${qualityScore}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className="text-sm font-medium text-foreground">
                  {qualityScore}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Textarea */}
        <div className="relative p-6">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            maxLength={maxLength}
            disabled={isGenerating}
            className={clsx(
              'w-full min-h-[120px] max-h-[400px]',
              'bg-transparent text-foreground',
              'resize-none outline-none',
              'placeholder:text-foreground-muted',
              'font-sans text-base leading-relaxed',
              isGenerating && 'opacity-50 cursor-not-allowed'
            )}
          />

          {/* Voice Input Button */}
          <Tooltip content={isRecording ? 'Stop recording' : 'Voice input'}>
            <button
              onClick={handleVoiceInput}
              disabled={isGenerating}
              className={clsx(
                'absolute bottom-4 right-4',
                'p-2 rounded-lg transition-all duration-200',
                isRecording
                  ? 'bg-error text-white animate-pulse'
                  : 'bg-background-elevated hover:bg-primary hover:text-background',
                isGenerating && 'opacity-50 cursor-not-allowed'
              )}
              aria-label={isRecording ? 'Stop recording' : 'Start voice input'}
            >
              {isRecording ? (
                <StopCircle className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>
          </Tooltip>
        </div>

        {/* Footer */}
        <div className="px-6 pb-4 flex items-center justify-between">
          {/* Character Count */}
          <div className="flex items-center gap-4">
            <span
              className={clsx(
                'text-sm',
                characterCount < minLength
                  ? 'text-foreground-muted'
                  : characterCount > maxLength
                  ? 'text-error'
                  : 'text-accent'
              )}
            >
              {characterCount} / {maxLength}
              {characterCount < minLength && ` (min: ${minLength})`}
            </span>

            {/* Example Prompts Trigger */}
            <button
              onClick={() => setShowExamples(!showExamples)}
              className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
            >
              <Lightbulb className="w-4 h-4" />
              Examples
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Options Toggle */}
            <button
              onClick={() => setShowOptions(!showOptions)}
              className={clsx(
                'px-3 py-2 rounded-lg transition-colors',
                'text-sm font-medium',
                'border border-primary/30',
                'hover:border-primary/60 hover:bg-background-elevated',
                showOptions && 'bg-background-elevated border-primary/60'
              )}
            >
              Options
              <ChevronDown
                className={clsx(
                  'w-4 h-4 inline-block ml-1 transition-transform',
                  showOptions && 'rotate-180'
                )}
              />
            </button>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={!isPromptValid || isGenerating || (validation && !validation.isValid)}
              isLoading={isGenerating}
              leftIcon={isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              size="lg"
            >
              {isGenerating ? 'Generating...' : 'Generate App'}
            </Button>
          </div>
        </div>
      </div>

      {/* Options Panel */}
      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-6 rounded-xl bg-background-surface border border-primary/20"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Generation Options</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Framework Selection */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Framework
                </label>
                <select
                  value={options.framework}
                  onChange={(e) => setOptions({ ...options, framework: e.target.value as any })}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-primary/30 text-foreground"
                >
                  <option value="react">React</option>
                  <option value="vue">Vue</option>
                  <option value="angular">Angular</option>
                  <option value="nextjs">Next.js</option>
                </select>
              </div>

              {/* Language Selection */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Language
                </label>
                <select
                  value={options.language}
                  onChange={(e) => setOptions({ ...options, language: e.target.value as any })}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-primary/30 text-foreground"
                >
                  <option value="typescript">TypeScript</option>
                  <option value="javascript">JavaScript</option>
                </select>
              </div>

              {/* Style Selection */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Complexity
                </label>
                <select
                  value={options.style}
                  onChange={(e) => setOptions({ ...options, style: e.target.value as any })}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-primary/30 text-foreground"
                >
                  <option value="minimal">Minimal (MVP)</option>
                  <option value="standard">Standard</option>
                  <option value="feature-rich">Feature Rich</option>
                </select>
              </div>

              {/* Include Tests */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  Include Tests
                </label>
                <button
                  onClick={() => setOptions({ ...options, includeTests: !options.includeTests })}
                  className={clsx(
                    'relative w-12 h-6 rounded-full transition-colors',
                    options.includeTests ? 'bg-accent' : 'bg-background-elevated'
                  )}
                >
                  <span
                    className={clsx(
                      'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                      options.includeTests ? 'right-1' : 'left-1'
                    )}
                  />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Example Prompts */}
      <AnimatePresence>
        {showExamples && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-6 rounded-xl bg-background-surface border border-primary/20"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-accent" />
              Example Prompts
            </h3>

            <div className="grid grid-cols-1 gap-2">
              {EXAMPLE_PROMPTS.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(example)}
                  className="text-left px-4 py-3 rounded-lg bg-background hover:bg-background-elevated border border-transparent hover:border-primary/30 transition-all"
                >
                  <span className="text-sm text-foreground">{example}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Validation Messages */}
      {validation && (validation.errors || validation.warnings || validation.suggestions) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 space-y-2"
        >
          {/* Errors */}
          {validation.errors && validation.errors.length > 0 && (
            <div className="p-4 rounded-lg bg-error/10 border border-error">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-error mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-error mb-1">Issues Found</h4>
                  <ul className="text-sm text-foreground space-y-1">
                    {validation.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Warnings */}
          {validation.warnings && validation.warnings.length > 0 && (
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-primary mb-1">Suggestions</h4>
                  <ul className="text-sm text-foreground space-y-1">
                    {validation.warnings.map((warning, index) => (
                      <li key={index}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Suggestions */}
          {validation.suggestions && validation.suggestions.length > 0 && (
            <div className="p-4 rounded-lg bg-accent/10 border border-accent">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-accent mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-accent mb-2">Improvements</h4>
                  <div className="space-y-2">
                    {validation.suggestions.map((suggestion) => (
                      <div key={suggestion.id} className="flex items-start justify-between gap-2">
                        <span className="text-sm text-foreground">{suggestion.message}</span>
                        {suggestion.action && (
                          <button className="text-xs font-medium text-accent hover:text-accent/80 transition-colors whitespace-nowrap">
                            {suggestion.action}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: PromptInput (Natural language input component)
 * NAMED_EXPORTS: PromptInputProps, PromptOptions, PromptValidation
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal
 * ============================================================================
 */
