import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Download,
  Copy,
  ChevronDown,
  Zap,
  CheckCircle,
  MessageCircle,
  Sparkles,
  FileCode,
  Settings,
  Menu,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { PromptInput, PromptOptions } from '../components/generation/PromptInput';

interface LocationState {
  projectName?: string;
  description?: string;
  prompt?: string;
}

export const GeneratePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) || {};
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('Aguardando prompt...');
  const [files, setFiles] = useState<Array<{ name: string; path: string; content: string; language: string; lines: number; size: number }>>([]);
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; content: string; role: 'user' | 'assistant'; timestamp: Date }>>([
    {
      id: '1',
      content: 'Olá! Sou Trinity AI. Descreva sua ideia e vou gerar código real com TypeScript, React e mais! 🚀',
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [generationId] = useState(() => `gen-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleGenerate = async (prompt: string, options: PromptOptions) => {
    if (!prompt.trim()) {
      toast.error('Por favor, descreva sua ideia!');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setIsComplete(false);
    setFiles([]);
    const newJobId = `job-${Date.now()}`;
    setJobId(newJobId);

    const userMessage = {
      id: `msg-${Date.now()}`,
      content: prompt,
      role: 'user' as const,
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch('http://localhost:5000/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          options,
          generationId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro do servidor: ${response.status}`);
      }

      const data = await response.json();

      if (data.files && Array.isArray(data.files)) {
        setFiles(data.files);
      }

      if (data.stages && Array.isArray(data.stages)) {
        for (const stage of data.stages) {
          setCurrentStage(stage.name || 'Processando...');
          await new Promise((resolve) => setTimeout(resolve, stage.duration || 800));
          setProgress((prev) => Math.min(prev + (stage.progress || 15), 90));
        }
      }

      setProgress(100);
      setCurrentStage('✅ Projeto gerado com sucesso!');
      setIsComplete(true);

      const generatedFilesCount = data.files?.length || 0;
      const aiMessage = {
        id: `msg-${Date.now()}-ai`,
        content: `Excelente! 🎉 Gerei ${generatedFilesCount} arquivos. Todos prontos para produção!`,
        role: 'assistant' as const,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, aiMessage]);

      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      toast.success('Projeto gerado com sucesso! 🚀');
    } catch (error) {
      console.error('Generation error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Erro ao gerar projeto';
      toast.error(errorMsg);

      const errorMessage = {
        id: `msg-${Date.now()}-error`,
        content: `Desculpe, ocorreu um erro: ${errorMsg}`,
        role: 'assistant' as const,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyFile = (fileName: string) => {
    const file = files.find((f) => f.name === fileName);
    if (!file) return;
    navigator.clipboard.writeText(file.content);
    setCopiedFile(fileName);
    toast.success('Código copiado!');
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const handleDownload = () => {
    if (!generationId && !jobId) {
      toast.error('Nenhuma geração disponível para download');
      return;
    }

    try {
      const projectZip = {
        files: files.map((f) => ({
          path: f.path,
          content: f.content,
        })),
        timestamp: new Date().toISOString(),
        generationId: jobId || generationId,
      };

      const element = document.createElement('a');
      element.setAttribute(
        'href',
        'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(projectZip, null, 2))
      );
      element.setAttribute('download', `projeto-orus-${jobId || generationId}.zip`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      toast.success('Projeto baixado!');
    } catch (error) {
      toast.error('Erro ao baixar projeto');
    }
  };

  // ✅ APENAS MUDANÇA 1: BOTÃO SALVAR COM TOAST "EM BREVE"
  const handleSaveProject = () => {
    toast((t) => (
      <div>
        <p className="font-semibold">💾 Salvar Projeto</p>
        <p className="text-sm mt-1">Em breve! 🚀</p>
        <button onClick={() => toast.dismiss(t.id)} className="mt-3 px-3 py-1 bg-emerald-600 text-white rounded text-sm">Ok</button>
      </div>
    ));
  };

  // ✅ APENAS MUDANÇA 2: BOTÃO DASHBOARD COM TOAST "EM BREVE"
  const handleDashboard = () => {
    toast((t) => (
      <div>
        <p className="font-semibold">📊 Dashboard</p>
        <p className="text-sm mt-1">Em breve! 🎯</p>
        <button onClick={() => toast.dismiss(t.id)} className="mt-3 px-3 py-1 bg-purple-600 text-white rounded text-sm">Ok</button>
      </div>
    ));
  };

  // ✅ APENAS MUDANÇA 3: BOTÃO DEPLOY COM TOAST "EM BREVE"
  const handleDeploy = () => {
    toast((t) => (
      <div>
        <p className="font-semibold">🌐 Deploy</p>
        <p className="text-sm mt-1">Em breve! 🚀</p>
        <button onClick={() => toast.dismiss(t.id)} className="mt-3 px-3 py-1 bg-orange-600 text-white rounded text-sm">Ok</button>
      </div>
    ));
  };

  const handleNewGeneration = () => {
    setFiles([]);
    setIsComplete(false);
    setProgress(0);
    setCurrentStage('Aguardando prompt...');
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      content: chatInput,
      role: 'user' as const,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      const aiMsg = {
        id: `msg-${Date.now()}-ai`,
        content: 'Entendi sua mensagem! Como posso ajudar você com o código? 💬',
        role: 'assistant' as const,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, aiMsg]);
    }, 500);

    setChatInput('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* HEADER - SEM MUDANÇAS ESTRUTURAIS */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* ✅ MUDANÇA 4: DARK MODE TOGGLE */}
              <button
                onClick={() => document.documentElement.classList.toggle('dark')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                title="Toggle dark mode"
              >
                <svg className="w-5 h-5 dark:hidden" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
                <svg className="w-5 h-5 hidden dark:block" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l-2.12-2.12a4 4 0 00-5.656 0l-2.12 2.12a1 1 0 101.414 1.414l2.12-2.12a2 2 0 012.828 0l2.12 2.12a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors group"
              >
                <ChevronDown className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Voltar</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  ORUS Builder
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Trinity AI + Minerva Omega</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT - SEU LAYOUT ORIGINAL */}
      <div className="pt-24 pb-8 container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT SECTION */}
          <div className="lg:col-span-2 space-y-6">
            {/* GENERATION FORM */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Descreva sua ideia e Trinity AI gerará código real
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Digite um prompt detalhado e receba código TypeScript production-ready
                </p>
              </div>

              <PromptInput
                onSubmit={(prompt, options) => {
                  handleGenerate(prompt, options);
                }}
              />
            </div>

            {/* GENERATION PROGRESS */}
            <AnimatePresence>
              {isGenerating && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex flex-col items-center justify-center py-8">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="mb-6"
                    >
                      <img
                        src="/trinity-ai-icon.png"
                        alt="Trinity AI Loading"
                        className="w-20 h-20"
                        onError={(e) => {
                          const img = e.currentTarget;
                          img.src = '/logo.png';
                        }}
                      />
                    </motion.div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      🤖 Trinity AI está trabalhando...
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                      {currentStage}
                    </p>

                    <div className="w-full max-w-xs mb-4">
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                          initial={{ width: '0%' }}
                          animate={{ width: `${progress}%` }}
                          transition={{ ease: 'easeOut', duration: 0.3 }}
                        />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2 font-semibold">
                        {progress}%
                      </p>
                    </div>

                    <p className="text-sm text-gray-500">
                      Estamos trabalhando em um sistema incrível de preview ao vivo. Por enquanto, você pode baixar o código e testar localmente!
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* GENERATION COMPLETE */}
            <AnimatePresence>
              {isComplete && files.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="space-y-6"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl shadow-lg p-8 border border-green-200 dark:border-green-700"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-green-900 dark:text-green-100">
                          🎉 Seu App Está Pronto!
                        </h3>
                        <p className="text-green-800 dark:text-green-300 mt-1">
                          {files.length} arquivos gerados • 100% pronto para produção
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
                      <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <FileCode className="w-5 h-5 text-indigo-600" />
                        Arquivos Gerados ({files.length})
                      </h3>
                    </div>

                    <div className="p-6 space-y-3">
                      {files.map((file, idx) => (
                        <motion.div
                          key={file.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer group"
                          onClick={() => setActiveFileIndex(idx)}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                              <FileCode className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {file.lines} linhas • {file.language}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyFile(file.name);
                            }}
                            className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 flex-wrap">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDownload}
                      className="flex-1 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download ZIP
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSaveProject}
                      className="flex-1 px-4 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Salvar
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDashboard}
                      className="flex-1 px-4 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Menu className="w-4 h-4" />
                      Dashboard
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDeploy}
                      className="flex-1 px-4 py-3 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Zap className="w-4 h-4" />
                      Deploy
                    </motion.button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNewGeneration}
                    className="w-full px-6 py-3 rounded-lg border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                  >
                    ✨ Gerar Novo Projeto
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT SECTION - CHAT */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 sticky top-24 flex flex-col h-[600px]"
            >
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-500 to-purple-500">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Trinity AI Chat</h3>
                    <p className="text-xs text-indigo-100">Gerando...</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.role === 'user'
                            ? 'text-indigo-200'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {msg.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                <form onSubmit={handleChatSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Pergunte algo..."
                    className="flex-1 text-sm px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim()}
                    className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 transition-colors"
                  >
                    <Zap className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratePage;
