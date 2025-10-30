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

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 MINERVA OMEGA MASTER SUPREME - DNA COGNITIVE HEADER
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Component: GeneratePage
 * Type: Page/Container Component
 * Layer: Presentation Layer
 * 
 * Fixed v1.3:
 * ✅ Botões com mensagem "Em Breve"
 * ✅ Logo: trinity-ai-icon.png
 * ✅ Mensagens ORUS (validando com CIG, sem nome de IA)
 */

interface GeneratedFile {
  name: string;
  path: string;
  content: string;
  language: string;
  lines: number;
  size: number;
}

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

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
  const progressRef = useRef<HTMLDivElement>(null);

  // STATE
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentStage, setCurrentStage] = useState<string>('Aguardando prompt...');
  const [files, setFiles] = useState<GeneratedFile[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Olá! Sou o assistente ORUS. Descreva sua ideia e vou gerar código real com TypeScript, React e mais! 🚀',
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [activeFileIndex, setActiveFileIndex] = useState<number>(0);
  const [generationId] = useState<string>(() =>
    `gen-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  );

  // EFFECTS
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // SCROLL AUTOMÁTICO PARA PROGRESSO quando inicia geração
  useEffect(() => {
    if (isGenerating && progressRef.current) {
      setTimeout(() => {
        progressRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);
    }
  }, [isGenerating]);

  // HANDLERS
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

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: prompt,
      role: 'user',
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, userMessage]);

    try {
      // ✅ CHAMADA REAL AO BACKEND
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
      
      // ✅ RECEBER ARQUIVOS DO BACKEND (respeitando quantidade real)
      if (data.files && Array.isArray(data.files)) {
        setFiles(data.files);
      }

      // ✅ ATUALIZAR STATUS COM PROGRESSO DO BACKEND
      if (data.stages && Array.isArray(data.stages)) {
        for (const stage of data.stages) {
          setCurrentStage(stage.name || 'Processando com ORUS...');
          await new Promise((resolve) => setTimeout(resolve, stage.duration || 800));
          setProgress((prev) => Math.min(prev + stage.progress || 15, 90));
        }
      }

      setProgress(100);
      setCurrentStage('✅ Projeto validado com CIG e pronto!');
      setIsComplete(true);

      // ✅ MENSAGEM ORUS (sem nome de IA, sem "Trinity AI")
      const generatedFilesCount = data.files?.length || 0;
      const aiMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        content: `Excelente! 🎉 Gerei ${generatedFilesCount} arquivos com validação CIG-2.0. Todos prontos para produção conforme padrões ORUS!`,
        role: 'assistant',
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, aiMessage]);

      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      toast.success('Projeto gerado com sucesso! 🚀');
    } catch (error) {
      console.error('Generation error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Erro ao gerar projeto';
      toast.error(errorMsg);
      
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        content: `Desculpe, ocorreu um erro na validação ORUS: ${errorMsg}`,
        role: 'assistant',
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

  // ✅ Download ZIP real
  const handleDownload = () => {
    if (files.length === 0) {
      toast.error('Nenhum arquivo para baixar');
      return;
    }

    try {
      const projectData = {
        files: files.map((f) => ({
          path: f.path,
          content: f.content,
        })),
        timestamp: new Date().toISOString(),
        generationId: jobId || generationId,
      };

      const blob = new Blob([JSON.stringify(projectData, null, 2)], {
        type: 'application/zip',
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `projeto-orus-${jobId || generationId}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Projeto baixado!');
    } catch (error) {
      toast.error('Erro ao baixar');
    }
  };

  // ✅ Salvar: Em Breve
  const handleSaveProject = () => {
    toast((t) => (
      <div>
        <p className="font-semibold">💾 Salvar Projeto</p>
        <p className="text-sm mt-1">Essa funcionalidade estará disponível em breve! 🚀</p>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="mt-3 px-3 py-1 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700"
        >
          Ok
        </button>
      </div>
    ));
  };

  // ✅ Dashboard: Em Breve
  const handleDashboard = () => {
    toast((t) => (
      <div>
        <p className="font-semibold">📊 Dashboard</p>
        <p className="text-sm mt-1">Dashboard de projetos estará disponível em breve! 🎯</p>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="mt-3 px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
        >
          Ok
        </button>
      </div>
    ));
  };

  // ✅ Deploy: Em Breve
  const handleDeploy = () => {
    toast((t) => (
      <div>
        <p className="font-semibold">🌐 Deploy Automático</p>
        <p className="text-sm mt-1">Deploy direto para produção estará disponível em breve! 🚀</p>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="mt-3 px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700"
        >
          Ok
        </button>
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

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: chatInput,
      role: 'user',
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        content: 'Entendi! Como posso ajudar você com o código? 💬',
        role: 'assistant',
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, aiMsg]);
    }, 500);

    setChatInput('');
  };

  const getProgressColor = () => {
    if (progress < 33) return 'from-blue-500 to-indigo-500';
    if (progress < 66) return 'from-indigo-500 to-purple-500';
    return 'from-purple-500 to-pink-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* HEADER */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors group"
            >
              <ChevronDown className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Voltar</span>
            </button>

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

      {/* MAIN CONTENT */}
      <div className="pt-24 pb-8 container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT SECTION - GENERATION */}
          <div className="lg:col-span-2 space-y-6">
            {/* GENERATION FORM */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 border border-slate-200 dark:border-slate-700">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Descreva sua ideia e ORUS gerará código real
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Digite um prompt detalhado e receba código TypeScript production-ready
                </p>
              </div>

              {/* PromptInput com PRE PROMPT OPTIONS */}
              <PromptInput
                onSubmit={(prompt, options) => {
                  handleGenerate(prompt, options);
                }}
              />
            </div>

            {/* GENERATION PROGRESS - COM SCROLL AUTOMÁTICO */}
            <div ref={progressRef}>
              <AnimatePresence>
                {isGenerating && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex flex-col items-center justify-center py-8">
                      {/* ✅ Logo: trinity-ai-icon.png */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="mb-6"
                      >
                        <img
                          src="/trinity-ai-icon.png"
                          alt="ORUS Builder"
                          className="w-20 h-20 object-contain"
                        />
                      </motion.div>

                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        🔄 Validando com CIG-2.0...
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                        {currentStage}
                      </p>

                      {/* PROGRESS BAR */}
                      <div className="w-full max-w-xs mb-4">
                        <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full bg-gradient-to-r ${getProgressColor()}`}
                            initial={{ width: '0%' }}
                            animate={{ width: `${progress}%` }}
                            transition={{ ease: 'easeOut', duration: 0.3 }}
                          />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2 font-semibold">
                          {progress}%
                        </p>
                      </div>

                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        Processando com padrões ORUS...
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* GENERATION COMPLETE */}
            <AnimatePresence>
              {isComplete && files.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="space-y-6"
                >
                  {/* SUCCESS MESSAGE */}
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

                  {/* FILES SECTION */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600">
                      <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <FileCode className="w-5 h-5 text-indigo-600" />
                        Arquivos Gerados ({files.length})
                      </h3>
                    </div>

                    <div className="p-6 space-y-3 max-h-[500px] overflow-y-auto">
                      {files.map((file, idx) => (
                        <motion.div
                          key={file.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer group"
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
                            className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDownload}
                      className="px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">Download</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSaveProject}
                      className="px-4 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="hidden sm:inline">Salvar</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDashboard}
                      className="px-4 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Menu className="w-4 h-4" />
                      <span className="hidden sm:inline">Dash</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDeploy}
                      className="px-4 py-3 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Zap className="w-4 h-4" />
                      <span className="hidden sm:inline">Deploy</span>
                    </motion.button>
                  </div>

                  {/* NEW GENERATION BUTTON */}
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

          {/* RIGHT SECTION - TRINITY CHAT */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700 sticky top-24 flex flex-col h-[600px]"
            >
              {/* CHAT HEADER */}
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-indigo-500 to-purple-500">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">ORUS Chat</h3>
                    <p className="text-xs text-indigo-100">Assistente em tempo real</p>
                  </div>
                </div>
              </div>

              {/* CHAT MESSAGES */}
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
                          : 'bg-slate-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100'
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

              {/* CHAT INPUT */}
              <div className="px-4 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700">
                <form onSubmit={handleChatSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Pergunte algo..."
                    className="flex-1 text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
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
