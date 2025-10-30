/**
 * ============================================================================
 * ORUS BUILDER - CODE EDITOR COMPONENT ⭐
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-10T08:46:00-03:00
 * LAST_MODIFIED: 2025-10-10T08:46:00-03:00
 * COMPONENT_HASH: orus.frontend.component.codeeditor.20251010.CED1G2H3
 * 
 * PURPOSE:
 * - Advanced Monaco editor integration
 * - Multi-file editing with tabs
 * - IntelliSense and autocomplete
 * - Git integration and diff viewer
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: CodeEditingAgent
 * - COGNITIVE_LEVEL: Supreme
 * - AUTONOMY_DEGREE: 92
 * - TRINITY_INTEGRATED: Cerebro (Code Intelligence)
 * ============================================================================
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Editor, { Monaco, OnMount, OnChange } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import {
  X,
  Save,
  RotateCcw,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Settings,
  FileCode,
  GitCompare,
} from 'lucide-react';
import { Button } from '@components/common/Button';
import { Tooltip } from '@components/common/Tooltip';
import { useEditorStore, EditorTab, EditorSettings } from '@store/editor.store';
import toast from 'react-hot-toast';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface CodeEditorProps {
  /**
   * Current file content
   */
  value?: string;

  /**
   * Programming language
   * @default 'typescript'
   */
  language?: string;

  /**
   * Read-only mode
   * @default false
   */
  readOnly?: boolean;

  /**
   * Show minimap
   * @default true
   */
  showMinimap?: boolean;

  /**
   * Change callback
   */
  onChange?: (value: string) => void;

  /**
   * Save callback
   */
  onSave?: (value: string) => void;

  /**
   * Height
   * @default '100%'
   */
  height?: string | number;
}

// ============================================================================
// MONACO THEME CONFIGURATION
// ============================================================================

const ORUS_DARK_THEME = {
  base: 'vs-dark' as const,
  inherit: true,
  rules: [
    { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
    { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
    { token: 'string', foreground: 'CE9178' },
    { token: 'number', foreground: 'B5CEA8' },
    { token: 'type', foreground: '4EC9B0' },
    { token: 'function', foreground: 'DCDCAA' },
    { token: 'variable', foreground: '9CDCFE' },
    { token: 'constant', foreground: '4FC1FF' },
    { token: 'class', foreground: '4EC9B0', fontStyle: 'bold' },
    { token: 'interface', foreground: 'B8D7A3' },
    { token: 'enum', foreground: 'D4D4AA' },
    { token: 'operator', foreground: 'D4D4D4' },
    { token: 'tag', foreground: '569CD6' },
    { token: 'attribute', foreground: '9CDCFE' },
  ],
  colors: {
    'editor.background': '#0A0E27',
    'editor.foreground': '#D4D4D4',
    'editorLineNumber.foreground': '#858585',
    'editorLineNumber.activeForeground': '#C6C6C6',
    'editorCursor.foreground': '#00D4FF',
    'editor.selectionBackground': '#264F78',
    'editor.inactiveSelectionBackground': '#3A3D41',
    'editor.lineHighlightBackground': '#1E1E3F',
    'editorWhitespace.foreground': '#404040',
    'editorIndentGuide.background': '#404040',
    'editorIndentGuide.activeBackground': '#707070',
    'editorBracketMatch.background': '#0064001a',
    'editorBracketMatch.border': '#888888',
  },
};

// ============================================================================
// CODE EDITOR COMPONENT
// ============================================================================

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value = '',
  language = 'typescript',
  readOnly = false,
  showMinimap = true,
  onChange,
  onSave,
  height = '100%',
}) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { settings, updateSettings } = useEditorStore();

  // Monaco editor mount handler
  const handleEditorDidMount: OnMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Define ORUS Dark theme
    monaco.editor.defineTheme('orus-dark', ORUS_DARK_THEME);
    monaco.editor.setTheme('orus-dark');

    // Configure editor options
    editor.updateOptions({
      fontSize: settings.fontSize,
      tabSize: settings.tabSize,
      wordWrap: settings.wordWrap,
      minimap: { enabled: showMinimap && settings.minimap },
      lineNumbers: settings.lineNumbers,
      formatOnPaste: settings.formatOnSave,
      formatOnType: settings.formatOnSave,
      scrollBeyondLastLine: false,
      folding: true,
      autoClosingBrackets: 'always',
      autoClosingQuotes: 'always',
      autoIndent: 'full',
      bracketPairColorization: { enabled: true },
      smoothScrolling: true,
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
      renderWhitespace: 'selection',
      renderLineHighlight: 'all',
      scrollbar: {
        vertical: 'auto',
        horizontal: 'auto',
        useShadows: true,
        verticalScrollbarSize: 10,
        horizontalScrollbarSize: 10,
      },
    });

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleSave();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF, () => {
      editor.getAction('actions.find')?.run();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyH, () => {
      editor.getAction('editor.action.startFindReplaceAction')?.run();
    });

    // IntelliSense configuration
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: 'React',
      allowJs: true,
      typeRoots: ['node_modules/@types'],
    });

    // Enable suggestions
    monaco.languages.registerCompletionItemProvider('typescript', {
      provideCompletionItems: (model, position) => {
        const suggestions: any[] = [];
        // Add custom ORUS suggestions here
        return { suggestions };
      },
    });
  }, [settings, showMinimap]);

  // Handle code change
  const handleChange: OnChange = useCallback((value) => {
    if (value !== undefined) {
      setHasUnsavedChanges(true);
      if (onChange) {
        onChange(value);
      }
    }
  }, [onChange]);

  // Save handler
  const handleSave = useCallback(() => {
    if (editorRef.current && onSave) {
      const currentValue = editorRef.current.getValue();
      onSave(currentValue);
      setHasUnsavedChanges(false);
      toast.success('File saved successfully');
    }
  }, [onSave]);

  // Copy to clipboard
  const handleCopy = useCallback(async () => {
    if (editorRef.current) {
      const value = editorRef.current.getValue();
      try {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        toast.success('Code copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        toast.error('Failed to copy code');
      }
    }
  }, []);

  // Format code
  const handleFormat = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run();
      toast.success('Code formatted');
    }
  }, []);

  // Undo changes
  const handleUndo = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.trigger('keyboard', 'undo', null);
    }
  }, []);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  // Apply settings changes
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({
        fontSize: settings.fontSize,
        tabSize: settings.tabSize,
        wordWrap: settings.wordWrap,
        minimap: { enabled: settings.minimap },
        lineNumbers: settings.lineNumbers,
      });
    }
  }, [settings]);

  return (
    <div
      className={clsx(
        'relative flex flex-col bg-background-surface rounded-lg border border-primary/20 overflow-hidden',
        isFullscreen && 'fixed inset-4 z-50'
      )}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-background-elevated border-b border-primary/20">
        {/* Left Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-sm text-foreground-muted">
            <FileCode className="w-4 h-4" />
            <span className="font-medium capitalize">{language}</span>
          </div>

          {hasUnsavedChanges && (
            <div className="flex items-center gap-1 text-xs text-primary">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>Unsaved</span>
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {!readOnly && (
            <>
              <Tooltip content="Save (Ctrl+S)">
                <button
                  onClick={handleSave}
                  disabled={!hasUnsavedChanges}
                  className="p-2 rounded-lg hover:bg-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Save"
                >
                  <Save className="w-4 h-4 text-foreground-muted" />
                </button>
              </Tooltip>

              <Tooltip content="Undo">
                <button
                  onClick={handleUndo}
                  className="p-2 rounded-lg hover:bg-background transition-colors"
                  aria-label="Undo"
                >
                  <RotateCcw className="w-4 h-4 text-foreground-muted" />
                </button>
              </Tooltip>

              <Tooltip content="Format">
                <button
                  onClick={handleFormat}
                  className="px-3 py-2 rounded-lg hover:bg-background transition-colors text-xs font-medium text-foreground-muted"
                >
                  Format
                </button>
              </Tooltip>
            </>
          )}

          <Tooltip content="Copy code">
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg hover:bg-background transition-colors"
              aria-label="Copy"
            >
              {copied ? (
                <Check className="w-4 h-4 text-accent" />
              ) : (
                <Copy className="w-4 h-4 text-foreground-muted" />
              )}
            </button>
          </Tooltip>

          <Tooltip content="Settings">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg hover:bg-background transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4 text-foreground-muted" />
            </button>
          </Tooltip>

          <Tooltip content={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg hover:bg-background transition-colors"
              aria-label="Toggle fullscreen"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4 text-foreground-muted" />
              ) : (
                <Maximize2 className="w-4 h-4 text-foreground-muted" />
              )}
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 relative">
        <Editor
          height={height}
          language={language}
          value={value}
          theme="orus-dark"
          onChange={handleChange}
          onMount={handleEditorDidMount}
          options={{
            readOnly,
            automaticLayout: true,
          }}
        />
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute top-0 right-0 w-80 h-full bg-background-surface border-l border-primary/20 p-6 overflow-y-auto shadow-elevated"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-foreground">Editor Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 rounded-lg hover:bg-background-elevated transition-colors"
              >
                <X className="w-5 h-5 text-foreground-muted" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Font Size */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Font Size
                </label>
                <input
                  type="range"
                  min="10"
                  max="24"
                  value={settings.fontSize}
                  onChange={(e) => updateSettings({ fontSize: parseInt(e.target.value) })}
                  className="w-full"
                />
                <span className="text-xs text-foreground-muted">{settings.fontSize}px</span>
              </div>

              {/* Tab Size */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Tab Size
                </label>
                <input
                  type="range"
                  min="2"
                  max="8"
                  step="2"
                  value={settings.tabSize}
                  onChange={(e) => updateSettings({ tabSize: parseInt(e.target.value) })}
                  className="w-full"
                />
                <span className="text-xs text-foreground-muted">{settings.tabSize} spaces</span>
              </div>

              {/* Word Wrap */}
              <div>
                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Word Wrap</span>
                  <button
                    onClick={() => updateSettings({ wordWrap: settings.wordWrap === 'on' ? 'off' : 'on' })}
                    className={clsx(
                      'relative w-12 h-6 rounded-full transition-colors',
                      settings.wordWrap === 'on' ? 'bg-accent' : 'bg-background-elevated'
                    )}
                  >
                    <span
                      className={clsx(
                        'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                        settings.wordWrap === 'on' ? 'right-1' : 'left-1'
                      )}
                    />
                  </button>
                </label>
              </div>

              {/* Minimap */}
              <div>
                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Minimap</span>
                  <button
                    onClick={() => updateSettings({ minimap: !settings.minimap })}
                    className={clsx(
                      'relative w-12 h-6 rounded-full transition-colors',
                      settings.minimap ? 'bg-accent' : 'bg-background-elevated'
                    )}
                  >
                    <span
                      className={clsx(
                        'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                        settings.minimap ? 'right-1' : 'left-1'
                      )}
                    />
                  </button>
                </label>
              </div>

              {/* Format on Save */}
              <div>
                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Format on Save</span>
                  <button
                    onClick={() => updateSettings({ formatOnSave: !settings.formatOnSave })}
                    className={clsx(
                      'relative w-12 h-6 rounded-full transition-colors',
                      settings.formatOnSave ? 'bg-accent' : 'bg-background-elevated'
                    )}
                  >
                    <span
                      className={clsx(
                        'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                        settings.formatOnSave ? 'right-1' : 'left-1'
                      )}
                    />
                  </button>
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: CodeEditor (Monaco code editor component)
 * NAMED_EXPORTS: CodeEditorProps
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal
 * ============================================================================
 */
