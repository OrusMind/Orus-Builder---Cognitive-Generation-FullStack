/**
 * ============================================================================
 * ORUS BUILDER - CODE PREVIEW COMPONENT
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-09T21:13:00-03:00
 * LAST_MODIFIED: 2025-10-09T21:13:00-03:00
 * COMPONENT_HASH: orus.frontend.component.codepreview.20251009.CPV3Y4Z5
 * 
 * PURPOSE:
 * - Monaco editor integration for generated code preview
 * - Syntax highlighting with language detection
 * - Diff viewer for before/after comparison
 * - Copy, download, and edit capabilities
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: CodeVisualizationAgent
 * - COGNITIVE_LEVEL: Advanced
 * - AUTONOMY_DEGREE: 80
 * - TRINITY_INTEGRATED: Cerebro (Code Logic)
 * ============================================================================
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import Editor, { Monaco, OnMount } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import {
  Copy,
  Check,
  Download,
  Maximize2,
  Minimize2,
  Code,
  Eye,
  GitCompare,
  FileCode,
} from 'lucide-react';
import { Button } from '@components/common/Button';
import { Tooltip } from '@components/common/Tooltip';
import toast from 'react-hot-toast';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface CodePreviewProps {
  /**
   * Generated code files
   */
  files: GeneratedFile[];

  /**
   * Selected file path
   */
  selectedFile?: string;

  /**
   * File selection callback
   */
  onFileSelect?: (filePath: string) => void;

  /**
   * Code change callback (if editable)
   */
  onCodeChange?: (filePath: string, newCode: string) => void;

  /**
   * Enable editing
   * @default false
   */
  editable?: boolean;

  /**
   * Show diff mode
   * @default false
   */
  showDiff?: boolean;

  /**
   * Original code for diff comparison
   */
  originalCode?: string;

  /**
   * Theme
   * @default 'vs-dark'
   */
  theme?: 'vs-dark' | 'light' | 'hc-black';
}

export interface GeneratedFile {
  path: string;
  name: string;
  language: string;
  content: string;
  size: number;
  lines: number;
}

type ViewMode = 'code' | 'preview' | 'diff';

// ============================================================================
// CODE PREVIEW COMPONENT
// ============================================================================

export const CodePreview: React.FC<CodePreviewProps> = ({
  files,
  selectedFile,
  onFileSelect,
  onCodeChange,
  editable = false,
  showDiff = false,
  originalCode,
  theme = 'vs-dark',
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>(showDiff ? 'diff' : 'code');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);

  const currentFile = files.find((f) => f.path === selectedFile) || files[0];

  // Monaco editor mount handler
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Configure Monaco editor
    monaco.editor.defineTheme('orus-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
        { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'type', foreground: '4EC9B0' },
        { token: 'function', foreground: 'DCDCAA' },
      ],
      colors: {
        'editor.background': '#0A0E27',
        'editor.foreground': '#D4D4D4',
        'editorLineNumber.foreground': '#858585',
        'editorCursor.foreground': '#00D4FF',
        'editor.selectionBackground': '#264F78',
        'editor.lineHighlightBackground': '#1E1E3F',
      },
    });

    monaco.editor.setTheme('orus-dark');

    // Enable format on paste
    editor.updateOptions({
      formatOnPaste: true,
      formatOnType: true,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      fontSize: 14,
      lineNumbers: 'on',
      renderWhitespace: 'selection',
      folding: true,
      autoClosingBrackets: 'always',
      autoClosingQuotes: 'always',
    });
  };

  // Handle code change
  const handleCodeChange = (value: string | undefined) => {
    if (value && editable && onCodeChange && currentFile) {
      onCodeChange(currentFile.path, value);
    }
  };

  // Copy to clipboard
  const handleCopy = async () => {
    if (!currentFile) return;

    try {
      await navigator.clipboard.writeText(currentFile.content);
      setCopied(true);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  // Download file
  const handleDownload = () => {
    if (!currentFile) return;

    const blob = new Blob([currentFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(`Downloaded ${currentFile.name}`);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Format code
  const formatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run();
      toast.success('Code formatted');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={clsx(
        'flex flex-col bg-background-surface rounded-lg border border-primary/20 overflow-hidden',
        isFullscreen && 'fixed inset-4 z-50'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-background-elevated border-b border-primary/20">
        {/* File Info */}
        <div className="flex items-center gap-3">
          <FileCode className="w-5 h-5 text-primary" />
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {currentFile?.name || 'No file selected'}
            </h3>
            {currentFile && (
              <p className="text-xs text-foreground-muted">
                {currentFile.lines} lines · {(currentFile.size / 1024).toFixed(2)} KB · {currentFile.language}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          {showDiff && (
            <div className="flex items-center gap-1 bg-background rounded-lg p-1">
              <Tooltip content="Code view">
                <button
                  onClick={() => setViewMode('code')}
                  className={clsx(
                    'p-2 rounded transition-colors',
                    viewMode === 'code'
                      ? 'bg-primary text-background'
                      : 'text-foreground-muted hover:text-foreground'
                  )}
                  aria-label="Code view"
                >
                  <Code className="w-4 h-4" />
                </button>
              </Tooltip>

              <Tooltip content="Preview">
                <button
                  onClick={() => setViewMode('preview')}
                  className={clsx(
                    'p-2 rounded transition-colors',
                    viewMode === 'preview'
                      ? 'bg-primary text-background'
                      : 'text-foreground-muted hover:text-foreground'
                  )}
                  aria-label="Preview"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </Tooltip>

              <Tooltip content="Diff view">
                <button
                  onClick={() => setViewMode('diff')}
                  className={clsx(
                    'p-2 rounded transition-colors',
                    viewMode === 'diff'
                      ? 'bg-primary text-background'
                      : 'text-foreground-muted hover:text-foreground'
                  )}
                  aria-label="Diff view"
                >
                  <GitCompare className="w-4 h-4" />
                </button>
              </Tooltip>
            </div>
          )}

          {/* Copy */}
          <Tooltip content="Copy code">
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg hover:bg-background transition-colors"
              aria-label="Copy code"
            >
              {copied ? (
                <Check className="w-5 h-5 text-accent" />
              ) : (
                <Copy className="w-5 h-5 text-foreground-muted" />
              )}
            </button>
          </Tooltip>

          {/* Download */}
          <Tooltip content="Download file">
            <button
              onClick={handleDownload}
              className="p-2 rounded-lg hover:bg-background transition-colors"
              aria-label="Download file"
            >
              <Download className="w-5 h-5 text-foreground-muted" />
            </button>
          </Tooltip>

          {/* Format */}
          {editable && (
            <Tooltip content="Format code">
              <button
                onClick={formatCode}
                className="px-3 py-2 rounded-lg hover:bg-background transition-colors text-sm font-medium text-foreground-muted"
              >
                Format
              </button>
            </Tooltip>
          )}

          {/* Fullscreen */}
          <Tooltip content={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg hover:bg-background transition-colors"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5 text-foreground-muted" />
              ) : (
                <Maximize2 className="w-5 h-5 text-foreground-muted" />
              )}
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Editor Container */}
      <div className="flex-1 relative">
        {currentFile && (
          <Editor
            height="100%"
            language={currentFile.language}
            value={currentFile.content}
            theme={theme === 'vs-dark' ? 'orus-dark' : theme}
            onChange={handleCodeChange}
            onMount={handleEditorDidMount}
            options={{
              readOnly: !editable,
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              fontSize: 14,
              lineNumbers: 'on',
              renderWhitespace: 'selection',
              folding: true,
            }}
          />
        )}

        {!currentFile && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <FileCode className="w-16 h-16 text-foreground-muted mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground-muted">No file selected</p>
              <p className="text-sm text-foreground-muted mt-2">
                Select a file from the tree to preview
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer - File Stats */}
      {currentFile && (
        <div className="flex items-center justify-between px-4 py-2 bg-background-elevated border-t border-primary/20 text-xs text-foreground-muted">
          <span>UTF-8</span>
          <span>{currentFile.language}</span>
          <span>
            Ln {editorRef.current?.getPosition()?.lineNumber || 1}, Col{' '}
            {editorRef.current?.getPosition()?.column || 1}
          </span>
        </div>
      )}
    </motion.div>
  );
};

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: CodePreview (Monaco editor preview component)
 * NAMED_EXPORTS: CodePreviewProps, GeneratedFile
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal
 * ============================================================================
 */
