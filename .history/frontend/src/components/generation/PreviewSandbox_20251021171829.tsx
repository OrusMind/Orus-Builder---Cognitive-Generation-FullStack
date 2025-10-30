import React, { useState, useEffect } from 'react';
import { Sandpack } from '@codesandbox/sandpack-react';
import '@codesandbox/sandpack-react/dist/index.css';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Loader2, CheckCircle } from 'lucide-react';

interface PreviewSandboxProps {
  code: string;
  filename?: string;
  className?: string;
}

function cleanMarkdownFences(code: string): string {
  let cleaned = code;
  const backticks = '```'
  
  if (cleaned.startsWith(backticks)) {
    const firstNewline = cleaned.indexOf('\n');
    if (firstNewline > 0) {
      cleaned = cleaned.substring(firstNewline + 1);
    }
  }

  if (cleaned.endsWith(backticks)) {
    const lastBackticks = cleaned.lastIndexOf(backticks);
    cleaned = cleaned.substring(0, lastBackticks);
  }

  cleaned = cleaned.replace(/^#{1,6}\s+/gm, '');
  return cleaned.trim();
}

function processMultiFileCode(code: string, filename: string): Record<string, string> {
  const cleanedCode = cleanMarkdownFences(code);
const filePattern = /\/\/\s*(?:src\/)?([^\n]+\.tsx?)\s*\n([^]*?)(?=\/\/\s*(?:src\/)?[^\n]+\.tsx?|$)/gi;
  const matches = [...cleanedCode.matchAll(filePattern)];

  if (matches.length > 1) {
    const files: Record<string, string> = {};
    matches.forEach(([_, path, content]) => {
      const cleanPath = `/${path.trim()}`;
      files[cleanPath] = cleanMarkdownFences(content.trim());
    });
    return files;
  }

  return { '/App.tsx': cleanMarkdownFences(cleanedCode) };
}

function detectExternalLibs(code: string): Record<string, string> {
  const deps: Record<string, string> = {};

  if (code.includes('chart.js') || code.includes('Chart')) {
    deps['chart.js'] = 'latest';
    deps['react-chartjs-2'] = 'latest';
  }

  if (code.includes('socket.io-client')) {
    deps['socket.io-client'] = 'latest';
  }

  if (code.includes('axios')) {
    deps['axios'] = 'latest';
  }

  if (code.includes('framer-motion')) {
    deps['framer-motion'] = 'latest';
  }

  if (code.includes('lucide-react')) {
    deps['lucide-react'] = 'latest';
  }

  return deps;
}

export const PreviewSandbox: React.FC<PreviewSandboxProps> = ({
  code,
  filename = 'Component.tsx',
  className = ''
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const files = processMultiFileCode(code, filename);
  const dependencies = detectExternalLibs(code);

  useEffect(() => {
    if (!code || code.trim() === '') {
      setError('No code provided');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [code]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <AnimatePresence>
        {loading && (
          <motion.div
            className="absolute inset-0 z-50 bg-gray-900/90 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p className="text-gray-300 text-sm">Loading preview...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.div
          className="absolute inset-0 z-40 bg-red-900/20 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <div>
                <h3 className="text-red-300 font-semibold mb-2">Error</h3>
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {success && (
        <motion.div
          className="absolute top-4 right-4 z-30 bg-green-500/20 border border-green-500/50 rounded-lg px-3 py-2 flex items-center gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span className="text-green-300 text-sm">Ready!</span>
        </motion.div>
      )}

      <Sandpack
        template="react-ts"
        files={files}
        options={{
          showTabs: Object.keys(files).length > 1,
          showNavigator: false,
          showLineNumbers: false,
          editorHeight: '100%',
          editorWidthPercentage: 0,
          showInlineErrors: true,
          autorun: true,
        }}
        theme="dark"
        customSetup={{
          dependencies: {
            ...dependencies,
            react: 'latest',
            'react-dom': 'latest',
          }
        }}
      />
    </div>
  );
};
