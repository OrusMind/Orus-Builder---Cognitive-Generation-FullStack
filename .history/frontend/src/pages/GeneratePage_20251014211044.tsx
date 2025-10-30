/**
 * ═══════════════════════════════════════════════════════════════════
 * ORUS BUILDER - GENERATE PAGE V5.0 ULTIMATE EDITION
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Features:
 * - Real-time code generation with SSE
 * - Live preview in iframe
 * - Trinity AI chat assistant
 * - Progress tracking with animations
 * - Save to dashboard
 * - Download ZIP
 * - Deploy (coming soon)
 * - Dark mode support
 * - Fully responsive
 * 
 * Backend Integration:
 * - POST /api/generate/stream (SSE)
 * - POST /api/dashboard/projects (Save)
 * 
 * Author: Minerva Omega Protocol
 * Date: October 14, 2025
 * ═══════════════════════════════════════════════════════════════════
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
  Code2,
  Rocket,
  LayoutDashboard,
  Loader2,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PromptInput } from '../components/generation/PromptInput'; // ✅ ADICIONE ESTA LINHA

// ═══════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════

interface GeneratedFile {
  path: string;
  fileName?: string;
  content: string;
  language: string;
  lines: number;
  size?: number;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'trinity';
  content: string;
  timestamp: Date;
}

interface LocationState {
  prompt?: string;
  autoStart?: boolean;
}

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

export default function GeneratePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  // ─────────────────────────────────────────────────────────────────
  // STATE MANAGEMENT
  // ─────────────────────────────────────────────────────────────────
  
  const [prompt, setPrompt] = useState(state?.prompt || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('');
  const [files, setFiles] = useState<GeneratedFile[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [showCode, setShowCode] = useState(false);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // ─────────────────────────────────────────────────────────────────
  // EFFECTS
  // ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (state?.autoStart && state?.prompt) {
      handleGenerate(state.prompt);
    }

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  // ─────────────────────────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────────────────────────

  const handleGenerate = async (userPrompt: string) => {
    if (!userPrompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setIsComplete(false);
    setProgress(0);
    setFiles([]);
    setShowCode(false);
    setChatMessages([{
      id: Date.now().toString(),
      role: 'user',
      content: userPrompt,
      timestamp: new Date()
    }]);

    try {
      const url = `http://localhost:5000/api/generate/stream?prompt=${encodeURIComponent(userPrompt)}`;
      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'progress') {
            setProgress(data.progress || 0);
            setCurrentStage(data.stage || '');
          } else if (data.type === 'message') {
  setChatMessages(prev => [...prev, {
      id: `${Date.now()}-msg`, 
    role: 'trinity',

              content: data.content || '',
              timestamp: new Date()
            }]);
          } else if (data.type === 'file') {
            setFiles(prev => [...prev, data.file]);
          } else if (data.type === 'complete') {
            setIsComplete(true);
            setIsGenerating(false);
            setProgress(100);
            eventSource.close();
            
            // 🎉 CELEBRATION!
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });

            setChatMessages(prev => [...prev, {
              id: Date.now().toString(),
              role: 'trinity',
              content: '✅ Projeto concluído! Todos os arquivos foram gerados com sucesso.',
              timestamp: new Date()
            }]);
          } else if (data.type === 'error') {
            throw new Error(data.message || 'Erro na geração');
          }
        } catch (err) {
          console.error('Parse error:', err);
        }
      };

      eventSource.onerror = (error) => {
        console.error('SSE Error:', error);
        setIsGenerating(false);
        setChatMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'trinity',
          content: '❌ Erro ao conectar com o servidor. Tente novamente.',
          timestamp: new Date()
        }]);
        eventSource.close();
      };

    } catch (error: any) {
      console.error('Generation error:', error);
      setIsGenerating(false);
      setChatMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'trinity',
        content: `❌ Erro: ${error.message}`,
        timestamp: new Date()
      }]);
    }
  };

  const handleSaveProject = async () => {
    if (!files || files.length === 0) {
      alert('❌ Nenhum arquivo para salvar');
      return;
    }

    const projectName = prompt('Nome do projeto:', 'Meu Projeto ORUS');
    if (!projectName) return;

    try {
      const response = await fetch('http://localhost:5000/api/dashboard/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: projectName,
          description: chatMessages[0]?.content || 'Projeto gerado pelo ORUS Builder',
          files: files,
          framework: 'react',
          prompt: chatMessages[0]?.content || ''
        })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        alert('✅ Projeto salvo no dashboard!');
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } else {
        alert(`❌ ${data.message || 'Erro ao salvar'}`);
      }
    } catch (error: any) {
      console.error('Save error:', error);
      alert('❌ Erro ao conectar com backend');
    }
  };

  const handleDownload = () => {
    if (!files || files.length === 0) {
      alert('❌ Nenhum arquivo para download');
      return;
    }

    files.forEach(file => {
      const blob = new Blob([file.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.fileName || file.path;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    alert(`✅ ${files.length} arquivo(s) baixado(s)!`);
  };

  const handleCopyFile = (content: string, fileName: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFile(fileName);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const handleNewGeneration = () => {
    setIsComplete(false);
    setIsGenerating(false);
    setFiles([]);
    setPrompt('');
    setProgress(0);
    setCurrentStage('');
    setChatMessages([]);
    setShowCode(false);
  };

  const handleDeploy = () => {
    alert('🚀 Deploy em desenvolvimento! Em breve você poderá fazer deploy direto para Vercel, Netlify e outros.');
  };
  // ─────────────────────────────────────────────────────────────────
  // LIVEPREVIEW COMPONENT - IFRAME RENDERING
  // ─────────────────────────────────────────────────────────────────

  const LivePreview: React.FC<{ files: GeneratedFile[] }> = ({ files }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      if (!files || files.length === 0) {
        setError('Nenhum arquivo para preview');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const mainFile = files[0];
        let code = mainFile.content;

        // Remove imports
        code = code.replace(/import\s+.*\s+from\s+['"].*['"];?\n?/g, '');
        
        // Detect component name
        const exportMatch = code.match(/export\s+default\s+(?:function\s+)?(\w+)/);
        const constMatch = code.match(/const\s+(\w+)\s*[:=]/);
        const componentName = exportMatch?.[1] || constMatch?.[1] || 'Component';
        
        // Remove export default
        code = code.replace(/export\s+default\s+/g, '');

        const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview - ORUS Builder</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body { margin: 0; padding: 20px; font-family: system-ui, -apple-system, sans-serif; background: #f9fafb; }
    #root { min-height: 100vh; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const { useState, useEffect, useRef } = React;
    
    try {
      ${code}
      
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <${componentName} />
        </div>
      );
      
      console.log('✅ Componente renderizado:', '${componentName}');
    } catch (error) {
      console.error('❌ Erro de renderização:', error);
      document.getElementById('root').innerHTML = \`
        <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px;">
          <div style="max-width: 600px; padding: 32px; background: white; border: 2px solid #fca5a5; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #dc2626; margin: 0 0 16px 0; font-size: 24px; font-weight: bold;">
              ❌ Erro no Preview
            </h2>
            <p style="margin: 0 0 16px 0; color: #666; line-height: 1.6;">
              O componente tem um erro que impede a renderização:
            </p>
            <pre style="margin: 0; font-size: 14px; overflow-x: auto; background: #fef2f2; padding: 16px; border-radius: 8px; border: 1px solid #fca5a5; font-family: monospace; line-height: 1.5;">\${error.message}</pre>
            <p style="margin: 16px 0 0 0; color: #666; font-size: 14px;">
              💡 <strong>Dica:</strong> Verifique se todas as variáveis e props estão definidas corretamente.
            </p>
          </div>
        </div>
      \`;
    }
  </script>
</body>
</html>`;

        const iframe = iframeRef.current;
        if (iframe?.contentDocument) {
          const doc = iframe.contentDocument;
          doc.open();
          doc.write(html);
          doc.close();
        }

        setTimeout(() => setLoading(false), 1000);
      } catch (err: any) {
        console.error('Preview setup error:', err);
        setError(err.message || 'Erro ao configurar preview');
        setLoading(false);
      }
    }, [files]);

    if (error) {
      return (
        <div className="flex items-center justify-center h-full bg-red-50 dark:bg-red-900/20 p-6">
          <div className="text-center max-w-md">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
              Erro no Preview
            </h3>
            <p className="text-sm text-red-500 dark:text-red-300 bg-red-100 dark:bg-red-900/40 p-4 rounded-lg font-mono">
              {error}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="relative w-full h-full bg-white dark:bg-slate-900 rounded-xl overflow-hidden">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm z-10">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Renderizando preview...
              </p>
            </div>
          </div>
        )}
        <iframe
          ref={iframeRef}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin"
          title="Live Preview"
        />
      </div>
    );
  };
  // ─────────────────────────────────────────────────────────────────
  // RENDER / JSX
  // ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* HEADER */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Voltar</span>
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  ORUS Builder
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">Powered by Trinity AI</p>
              </div>
            </div>
            
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* MAIN CONTENT */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div className="container mx-auto px-6 pt-24 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* ───────────────────────────────────────────────────── */}
          {/* INPUT SECTION - Mostrado quando NÃO está gerando e NÃO está completo */}
          {/* ───────────────────────────────────────────────────── */}
          {!isGenerating && !isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-6"
            >
              <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                  🎨 Descreva sua ideia e <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Trinity AI</span> gerará código real
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Digite o que você precisa e aguarde a mágica acontecer ✨
                </p>
              </div>

<div className="max-w-3xl mx-auto">
  <PromptInput
    onSubmit={(prompt) => handleGenerate(prompt)}
    placeholder="Ex: crie um dashboard com cards de estatísticas e gráficos..."
  />
                <div className="relative">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && prompt.trim()) {
                        handleGenerate(prompt);
                      }
                    }}
                    placeholder="Ex: crie um dashboard com cards de estatísticas e gráficos..."
                    className="w-full px-6 py-4 pr-14 text-lg rounded-2xl border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-lg"
                  />
                  <button
                    onClick={() => handleGenerate(prompt)}
                    disabled={!prompt.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Zap className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                  <button
                    onClick={() => setPrompt('crie um card de produto com imagem, título e preço')}
                    className="px-4 py-2 text-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors"
                  >
                    💳 Card de Produto
                  </button>
                  <button
                    onClick={() => setPrompt('crie um formulário de contato com nome, email e mensagem')}
                    className="px-4 py-2 text-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors"
                  >
                    📝 Formulário
                  </button>
                  <button
                    onClick={() => setPrompt('crie um dashboard com estatísticas e gráficos')}
                    className="px-4 py-2 text-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors"
                  >
                    📊 Dashboard
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ───────────────────────────────────────────────────── */}
          {/* LOADING SECTION - Mostrado durante geração */}
          {/* ───────────────────────────────────────────────────── */}
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-700">
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {currentStage || 'Inicializando Trinity AI...'}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Aguarde enquanto geramos seu código
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {progress}% concluído
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ───────────────────────────────────────────────────── */}
          {/* RESULT SECTION - Mostrado quando completo */}
          {/* ───────────────────────────────────────────────────── */}
          {isComplete && files && files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Success Header */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border-2 border-green-200 dark:border-green-800 shadow-lg">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-9 h-9 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        🎉 Seu App Está Pronto!
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {files.length} arquivo{files.length > 1 ? 's' : ''} gerado{files.length > 1 ? 's' : ''} • 100% pronto para produção
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setShowCode(!showCode)}
                      className="px-4 py-2.5 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-xl transition-all flex items-center gap-2 font-medium shadow-md border border-gray-200 dark:border-slate-600"
                    >
                      {showCode ? <Eye className="w-4 h-4" /> : <Code2 className="w-4 h-4" />}
                      {showCode ? 'Ver Preview' : 'Ver Código'}
                    </button>

                    <button
                      onClick={handleSaveProject}
                      className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all flex items-center gap-2 font-medium shadow-md"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Salvar
                    </button>

                    <button
                      onClick={() => navigate('/dashboard')}
                      className="px-4 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-all flex items-center gap-2 font-medium shadow-md"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Dashboard
                    </button>

                    <button
                      onClick={handleDeploy}
                      className="px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all flex items-center gap-2 font-medium shadow-md"
                    >
                      <Rocket className="w-4 h-4" />
                      Deploy
                    </button>

                    <button
                      onClick={handleDownload}
                      className="px-4 py-2.5 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-xl transition-all flex items-center gap-2 font-medium shadow-md border border-gray-200 dark:border-slate-600"
                    >
                      <Download className="w-4 h-4" />
                      ZIP
                    </button>

                    <button
                      onClick={handleNewGeneration}
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all flex items-center gap-2 font-medium shadow-md"
                    >
                      <Zap className="w-4 h-4" />
                      Novo
                    </button>
                  </div>
                </div>
              </div>

              {/* Preview or Code Display */}
              <AnimatePresence mode="wait">
                {!showCode ? (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700"
                    style={{ height: '700px' }}
                  >
                    <LivePreview files={files} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="code"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    {files.map((file, index) => (
                      <div key={index} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                              <FileCode className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                              <h3 className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                                {file.path || file.fileName}
                              </h3>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {file.lines} linhas • {file.language}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleCopyFile(file.content, file.path)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            title="Copiar código"
                          >
                            {copiedFile === file.path ? (
                              <CheckCheck className="w-5 h-5 text-green-600" />
                            ) : (
                              <Copy className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            )}
                          </button>
                        </div>
                        <pre className="bg-slate-900 text-slate-100 p-5 rounded-xl overflow-x-auto max-h-96 text-sm leading-relaxed font-mono shadow-inner">
                          <code>{file.content}</code>
                        </pre>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ───────────────────────────────────────────────────── */}
          {/* CHAT TRINITY - Sempre visível quando há mensagens */}
          {/* ───────────────────────────────────────────────────── */}
          {chatMessages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center shadow-lg">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Trinity AI Assistant</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Acompanhamento em tempo real</p>
                </div>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {chatMessages.map((msg, idx) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`px-4 py-2.5 rounded-xl max-w-[80%] shadow-md ${
                        msg.role === 'user'
                          ? 'bg-indigo-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-gray-900 dark:text-white'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}
