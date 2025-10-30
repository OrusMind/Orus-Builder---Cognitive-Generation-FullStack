/**
 * ============================================================================
 * ORUS BUILDER - GENERATE PAGE (FINAL VERSION v4.0)
 * ============================================================================
 * ✅ Backend REAL com Groq API
 * ✅ Download ZIP completo
 * ✅ Live Preview FUNCIONANDO
 * ✅ Chat Trinity AI
 * ✅ Animações épicas
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Download,
  Zap,
  CheckCircle,
  Sparkles,
  FileCode,
  Copy,
  CheckCheck,
  MessageCircle,
  Eye,
  RefreshCw,
  Maximize2,
  AlertCircle,
} from 'lucide-react';
import { PromptInput, PromptOptions } from '@/components/generation/PromptInput';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

// ============================================================================
// TYPES
// ============================================================================

interface LocationState {
  prompt?: string;
  autoStart?: boolean;
}

interface GeneratedFile {
  path: string;
  fileName: string;
  content: string;
  language: string;
  lines: number;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'trinity';
  content: string;
  timestamp: Date;
}

// ============================================================================
// LIVE PREVIEW COMPONENT (EMBEDDED)
// ============================================================================

const LivePreview: React.FC<{ files: GeneratedFile[] }> = ({ files }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Build preview HTML
   */
  const buildPreviewHTML = (): string => {
    try {
      // Find App file
      const appFile = files.find(f => 
        f.path.includes('App.tsx') || 
        f.path.includes('App.jsx') ||
        f.fileName.includes('App.tsx') ||
        f.fileName.includes('App.jsx')
      );

      if (!appFile) {
        throw new Error('No App.tsx/App.jsx file found in generated files');
      }

      // Build HTML with React and Babel
      return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ORUS Preview</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    #root {
      min-height: 100vh;
    }
    * {
      box-sizing: border-box;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  
  <script type="text/babel">
    try {
      // Generated code
      ${appFile.content}
      
      // Render
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(React.createElement(App));
    } catch (error) {
      document.getElementById('root').innerHTML = 
        '<div style="padding: 40px; text-align: center; color: #e74c3c; font-family: monospace;">' +
        '<h2>Preview Error</h2>' +
        '<p>' + error.message + '</p>' +
        '<small>Check console for details</small>' +
        '</div>';
      console.error('Preview render error:', error);
    }
  </script>
</body>
</html>
      `;
    } catch (error: any) {
      throw error;
    }
  };

  /**
   * Update iframe
   */
  useEffect(() => {
    if (!iframeRef.current) return;

    try {
      setIsLoading(true);
      setError(null);

      const html = buildPreviewHTML();
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;

      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
      }

      // Simulate loading
      setTimeout(() => setIsLoading(false), 1500);
    } catch (error: any) {
      setError(error.message);
      setIsLoading(false);
      console.error('Preview build error:', error);
    }
  }, [files]);

  /**
   * Refresh preview
   */
  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  /**
   * Open in new tab
   */
  const handleOpenInTab = () => {
    try {
      const html = buildPreviewHTML();
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error: any) {
      toast.error('Erro ao abrir preview');
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
      {/* Preview Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Live Preview
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpenInTab}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Open in new tab"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 relative bg-white">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900 z-10">
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-12 h-12 mx-auto mb-3 text-primary-600" />
              </motion.div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Carregando preview...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900 z-10">
            <div className="text-center max-w-md p-6">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error-600" />
              <h3 className="text-lg font-semibold mb-2">Preview Error</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {error}
              </p>
              <button
                onClick={handleRefresh}
                className="btn-primary"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          className="w-full h-full border-0"
          title="Preview"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
};

// ============================================================================
// MAIN GENERATE PAGE COMPONENT
// ============================================================================

export const GeneratePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const hasInitialPrompt = Boolean(state?.prompt);

  // State
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState<string | null>(null);
  const [files, setFiles] = useState<GeneratedFile[] | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  /**
   * Add message helper
   */
  const addMessage = (role: 'user' | 'trinity', content: string) => {
    setChatMessages(prev => [...prev, {
      id: `${role}-${Date.now()}`,
      role,
      content,
      timestamp: new Date(),
    }]);
  };

  /**
   * Handle generation with REAL backend
   */
  const handleGenerate = async (prompt: string, options: PromptOptions) => {
    setIsGenerating(true);
    setIsComplete(false);
    setProgress(0);
    setFiles(null);
    setJobId(null);
    setShowPreview(false);

    addMessage('user', prompt);
    addMessage('trinity', '🚀 Conectando com Groq API...');

    try {
      // Step 1: Create generation job
      const response = await fetch('http://localhost:5000/api/v1/generation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          language: options.language || 'typescript',
          framework: options.framework?.toUpperCase() || 'REACT',
          projectId: 'new',
          options: {
            style: options.style || 'standard',
            includeTests: options.includeTests || false,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Backend response:', data);
      
      const generatedJobId = data.jobId || data.data?.jobId;

      if (!generatedJobId) {
        throw new Error('No jobId received from backend');
      }

      setJobId(generatedJobId);
      addMessage('trinity', `✅ Job criado: ${generatedJobId}. Gerando com Groq...`);

      // Step 2: Simulate progress while backend processes
      const stages = [
        { name: 'Analisando prompt com Trinity AI', progress: 20, duration: 2000 },
        { name: 'Groq gerando arquitetura...', progress: 40, duration: 3000 },
        { name: 'Escrevendo componentes React...', progress: 70, duration: 4000 },
        { name: 'Validando com CIG-2.0...', progress: 90, duration: 2000 },
        { name: 'Finalizando...', progress: 100, duration: 1000 },
      ];

      for (const stage of stages) {
        setCurrentStage(stage.name);
        setProgress(stage.progress);
        await new Promise(resolve => setTimeout(resolve, stage.duration));
      }

      // Step 3: Get results from backend
      const resultResponse = await fetch(
        `http://localhost:5000/api/v1/generation/${generatedJobId}/result`
      );
      
      if (!resultResponse.ok) {
        throw new Error
