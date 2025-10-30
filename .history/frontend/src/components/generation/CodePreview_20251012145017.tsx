/**
 * ============================================================================
 * ORUS BUILDER - CODE PREVIEW COMPONENT v2.0 (SIMPLIFIED)
 * ============================================================================
 * 
 * COGNITIVE DNA: Simple-First, Progressive Enhancement
 * PALETA: Neural Flow (Indigo + Purple + Pink)
 * UX PHILOSOPHY: Não assuste usuários novos!
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { 
  Eye, 
  Code2, 
  Download, 
  Copy, 
  Check,
  Settings2,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import toast from 'react-hot-toast';

// ============================================================================
// TYPES
// ============================================================================

export interface GeneratedFile {
  path: string;
  content: string;
  language: string;
  type: 'component' | 'test' | 'config' | 'style';
}

export interface CodePreviewProps {
  files: GeneratedFile[];
  mode?: 'simple' | 'advanced';
  projectName?: string;
  showPreview?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const CodePreview: React.FC<CodePreviewProps> = ({
  files,
  mode: initialMode = 'simple',
  projectName = 'Meu App',
  showPreview = true,
}) => {
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [mode, setMode] = useState<'simple' | 'advanced'>(initialMode);
  const [selectedFile, setSelectedFile] = useState<GeneratedFile>(files[0]);
  const [copied, setCopied] = useState(false);

  // Syntax highlighting quando código é exibido
  useEffect(() => {
    if (viewMode === 'code') {
      Prism.highlightAll();
    }
  }, [viewMode, selectedFile]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleCopy = async () => {
    await navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    toast.success('Código copiado!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const zip = generateZip(files);
    const blob = new Blob([zip], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.toLowerCase().replace(/\s/g, '-')}.zip`;
    a.click();
    toast.success('Download iniciado!');
  };

  const handleOpenCodeSandbox = () => {
    // TODO: Integrar com CodeSandbox API
    toast.success('Abrindo no CodeSandbox...');
  };

  // ============================================================================
  // RENDER - MODO SIMPLES
  // ============================================================================

  if (mode === 'simple') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl mx-auto"
      >
        {/* Header Simples */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Seu App Está Pronto!
            </h3>
          </div>

          <button
            onClick={() => setMode('advanced')}
            className="text-sm text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1"
          >
            <Settings2 className="w-4 h-4" />
            Modo Avançado
          </button>
        </div>

        {/* Tabs Simples */}
        <div className="flex gap-2 mb-4">
          {showPreview && (
            <button
              onClick={() => setViewMode('preview')}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all',
                viewMode === 'preview'
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              )}
            >
              <Eye className="w-4 h-4" />
              Visual
            </button>
          )}

          <button
            onClick={() => setViewMode('code')}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all',
              viewMode === 'code'
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            )}
          >
            <Code2 className="w-4 h-4" />
            Código
          </button>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {viewMode === 'preview' ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              {/* Preview Iframe Sandbox */}
              <PreviewSandbox code={selectedFile.content} />
            </motion.div>
          ) : (
            <motion.div
              key="code"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 dark:bg-slate-950 rounded-2xl shadow-xl overflow-hidden"
            >
              {/* Code Block com Syntax Highlighting */}
              <div className="flex items-center justify-between px-6 py-3 bg-slate-800 dark:bg-slate-900 border-b border-slate-700">
                <span className="text-sm font-mono text-slate-300">
                  {selectedFile.path}
                </span>
                <button
                  onClick={handleCopy}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <pre className="p-6 overflow-x-auto max-h-[600px]">
                <code className={`language-${selectedFile.language}`}>
                  {selectedFile.content}
                </code>
              </pre>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions - Apenas 2 botões principais */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleDownload}
            className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Baixar Projeto
          </button>

          <button
            onClick={handleOpenCodeSandbox}
            className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold py-3 px-6 rounded-xl transition-all flex items-center gap-2"
          >
            <ExternalLink className="w-5 h-5" />
            Testar Online
          </button>
        </div>
      </motion.div>
    );
  }

  // ============================================================================
  // RENDER - MODO AVANÇADO
  // ============================================================================

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-7xl mx-auto"
    >
      {/* Header Avançado */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-indigo-500" />
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Código Gerado
          </h3>
        </div>

        <button
          onClick={() => setMode('simple')}
          className="text-sm text-slate-500 hover:text-indigo-600 transition-colors"
        >
          ← Voltar para Modo Simples
        </button>
      </div>

      {/* File Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {files.map((file) => (
          <button
            key={file.path}
            onClick={() => setSelectedFile(file)}
            className={clsx(
              'px-4 py-2 rounded-lg font-mono text-sm whitespace-nowrap transition-all',
              selectedFile.path === file.path
                ? 'bg-indigo-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            )}
          >
            {file.path.split('/').pop()}
          </button>
        ))}
      </div>

      {/* Monaco Editor ou Code Block */}
      <div className="bg-slate-900 rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-3 bg-slate-800 border-b border-slate-700">
          <span className="text-sm font-mono text-slate-300">
            {selectedFile.path}
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="text-slate-400 hover:text-white transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={handleDownload}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* TODO: Integrar Monaco Editor aqui para modo avançado */}
        <pre className="p-6 overflow-x-auto max-h-[700px]">
          <code className={`language-${selectedFile.language}`}>
            {selectedFile.content}
          </code>
        </pre>
      </div>
    </motion.div>
  );
};

// ============================================================================
// PREVIEW SANDBOX COMPONENT
// ============================================================================

interface PreviewSandboxProps {
  code: string;
}

const PreviewSandbox: React.FC<PreviewSandboxProps> = ({ code }) => {
  const [iframeContent, setIframeContent] = useState('');

  useEffect(() => {
    // Gera HTML completo para renderização isolada
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { margin: 0; padding: 20px; font-family: system-ui, -apple-system, sans-serif; }
          </style>
        </head>
        <body>
          <div id="root"></div>
          <script type="module">
            ${code}
          </script>
        </body>
      </html>
    `;
    setIframeContent(html);
  }, [code]);

  return (
    <div className="relative w-full h-[500px] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
      <iframe
        srcDoc={iframeContent}
        title="Component Preview"
        sandbox="allow-scripts"
        className="w-full h-full border-0"
      />
    </div>
  );
};

// ============================================================================
// UTILITIES
// ============================================================================

const generateZip = (files: GeneratedFile[]): string => {
  // TODO: Implementar geração de ZIP real com JSZip
  return 'mock-zip-content';
};

export default CodePreview;
