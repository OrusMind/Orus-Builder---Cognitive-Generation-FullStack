

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  ArrowLeft,
  Download,
  Zap,
  CheckCircle,
  FileCode,
  Copy,
  CheckCheck,
  MessageCircle,
  Eye,
  AlertCircle,
  LayoutDashboard,
  Rocket,
  ExternalLink,
  Save,
  FolderOpen,
  Code2,
  Terminal,
  Package,
  Globe,
  Settings,
  ChevronDown,
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react';
import { PromptInput, PromptOptions } from '../components/generation/PromptInput';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface LocationState {
  prompt?: string;
  autoStart?: boolean;
}

interface GeneratedFile {
  path: string;
  fileName: string;
  name?: string;
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

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const GeneratePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const hasInitialPrompt = Boolean(state?.prompt);
  const { theme, setTheme } = useTheme();

  // ─────────────────────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────────────────────

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
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [generationId, setGenerationId] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const isGeneratingRef = useRef(false);

  // ─────────────────────────────────────────────────────────────────────────
  // MOUNT STATE
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    setMounted(true);
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // MESSAGE COUNTER
  // ─────────────────────────────────────────────────────────────────────────

  let messageIdCounter = 0;

  const addMessage = (role: 'user' | 'trinity', content: string) => {
    messageIdCounter++;
    setChatMessages((prev) => [
      ...prev,
      {
        id: `${role}-${Date.now()}-${messageIdCounter}`,
        role,
        content,
        timestamp: new Date(),
      },
    ]);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // BACKEND GENERATION WITH GROQ
  // ─────────────────────────────────────────────────────────────────────────

  const handleGenerate = async (prompt: string, options: PromptOptions) => {
    // ✅ BLOQUEIA DUPLA CHAMADA!
    if (isGeneratingRef.current) {
      console.warn('⚠️ Generation already in progress! Ignoring duplicate call.');
      return;
    }

    console.log('🚀 Starting generation for prompt:', prompt.substring(0, 50));

    // ✅ ATIVA AS FLAGS
    isGeneratingRef.current = true;
    setIsGenerating(true);
    setIsComplete(false);
    setProgress(0);
    setFiles(null);
    setJobId(null);

    addMessage('user', prompt);
    addMessage('trinity', '🔗 Conectando com Groq API...');

    try {
      // ═══════════════════════════════════════════════════════════════════════
      // STEP 1: GENERATE CODE WITH GROQ
      // ═══════════════════════════════════════════════════════════════════════
      const response = await fetch(
        `http://localhost:5000/api/v1/generation/generate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: prompt.trim(),
            options: {
              framework: options.framework || 'react',
              language: options.language || 'typescript',
              includeTests: options.includeTests || false,
              style: options.style || 'modern',
              applyStyles: true,
              applyTailwind: true,
              darkMode: true,
              responsive: true,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Backend error: ${response.statusText}`);
      }

      const data = await response.json();

      console.log('📦 Backend response:', {
        success: data.success,
        hasJobId: Boolean(data.jobId || data.data?.jobId),
        hasFiles: Boolean(data.data?.files || data.files),
      });

      const generatedJobId = data.jobId || data.data?.jobId;

      if (!generatedJobId) {
        throw new Error('No jobId received from backend');
      }

      setJobId(generatedJobId);
      setGenerationId(generatedJobId);

      addMessage('trinity', `✅ Job criado: ${generatedJobId}. Gerando com Groq...`);

      // ═══════════════════════════════════════════════════════════════════════
      // STEP 2: SIMULATE PROGRESS (VISUAL FEEDBACK)
      // ═══════════════════════════════════════════════════════════════════════
      const stages = [
        { name: '🧠 Analisando prompt com Trinity AI', progress: 20, duration: 2000 },
        { name: '⚡ Groq gerando arquitetura...', progress: 40, duration: 3000 },
        { name: '📝 Escrevendo componentes React...', progress: 70, duration: 4000 },
        { name: '🔍 Validando com CIG-2.0...', progress: 90, duration: 2000 },
        { name: '✨ Finalizando...', progress: 100, duration: 1000 },
      ];

      for (const stage of stages) {
        setCurrentStage(stage.name);
        setProgress(stage.progress);
        await new Promise((resolve) => setTimeout(resolve, stage.duration));
      }

      // ═══════════════════════════════════════════════════════════════════════
      // STEP 3: GET FILES FROM RESPONSE
      // ═══════════════════════════════════════════════════════════════════════
      const generatedFiles = data.data?.files || data.files || [];

      console.log('📂 Files received:', generatedFiles.length);

      if (generatedFiles.length === 0) {
        throw new Error('No files generated by backend');
      }

      // ✅ FORMAT FILES
      const formattedFiles: GeneratedFile[] = generatedFiles.map((file: any) => ({
        path: file.path || file.fileName || 'unknown',
        fileName: file.fileName || file.name || file.path || 'file.tsx',
        content: file.content || '// No content',
        language: file.language || 'typescript',
        lines: file.lines || file.content?.split('\n').length || 0,
      }));

      console.log('✅ Formatted files:', formattedFiles.map((f) => f.fileName));

      // ✅ UPDATE STATE
      setFiles(formattedFiles);
      setIsComplete(true);
      setProgress(100);

      // ✅ VISUAL FEEDBACK
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

      addMessage(
        'trinity',
        `🎉 Código REAL gerado! ${formattedFiles.length} arquivos criados com Groq!`
      );

      toast.success(`${formattedFiles.length} arquivos gerados!`);
    } catch (error: any) {
      console.error('❌ Generation error:', error);
      console.error('❌ Error stack:', error.stack);

      setIsComplete(false);

      addMessage('trinity', `❌ Erro: ${error.message}`);
      toast.error(`Erro: ${error.message}`);
    } finally {
      // ✅ SEMPRE LIBERA AS FLAGS!
      console.log('🏁 Generation completed. Releasing flags...');
      setIsGenerating(false);
      isGeneratingRef.current = false;
    }
  };

  /**
   * ═══════════════════════════════════════════════════════════════════════════
   * 📦 DOWNLOAD ZIP - PROJETO COMPLETO E PRONTO PARA USO
   * ═══════════════════════════════════════════════════════════════════════════
   *
   * GERA: Estrutura completa com configs, package.json, README, .gitignore
   * OBJETIVO: Usuário abre no VSCode e roda `npm install && npm run dev` PRONTO!
   */
  const handleDownload = () => {
    // ✅ VERIFICAR SE EXISTE jobId OU generationId
    if (!generationId && !jobId) {
      toast.error('Nenhuma geração disponível para download');
      return;
    }

    // ✅ USAR O QUE ESTIVER DISPONÍVEL (jobId ou generationId)
    const idToUse = generationId || jobId;

    console.log('📦 Iniciando download com ID:', idToUse);

    // ✅ REDIRECIONAR PARA A ROTA DE DOWNLOAD
    window.location.href = `http://localhost:5000/api/v1/generation/download/${idToUse}`;

    toast.success('Download iniciado!');
  };

  // ─────────────────────────────────────────────────────────────────────────
  // SAVE TO DASHBOARD
  // ─────────────────────────────────────────────────────────────────────────

  const handleSaveProject = async () => {
    if (!files || files.length === 0) {
      toast.error('Nenhum arquivo para salvar');
      return;
    }

    const projectName = window.prompt('Nome do projeto:', 'Meu Projeto ORUS');
    if (!projectName) return;

    try {
      const response = await fetch('http://localhost:5000/api/dashboard/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: projectName,
          description:
            chatMessages[0]?.content || 'Projeto gerado pelo ORUS Builder',
          files: files,
          framework: 'react',
          prompt: chatMessages[0]?.content,
          status: 'active',
          createdAt: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (response.ok && (data.success || data.project)) {
        toast.success('✅ Projeto salvo no dashboard!');
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      } else {
        toast.error(data.message || data.error || 'Erro ao salvar');
      }
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(`Erro: ${error.message}`);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // OTHER ACTIONS
  // ─────────────────────────────────────────────────────────────────────────

  const handleDeploy = () => {
    toast('🚀 Deploy em desenvolvimento!', { icon: '🔧' });
  };

  const handleNewGeneration = () => {
    setFiles(null);
    setIsComplete(false);
    setIsGenerating(false);
    setProgress(0);
    setChatMessages([]);
    navigate('/generate', { replace: true, state: {} });
  };

  const handleCopyFile = async (content: string, filename: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedFile(filename);
      toast.success(`${filename} copiado!`);
      setTimeout(() => setCopiedFile(null), 2000);
    } catch (error) {
      toast.error('Erro ao copiar');
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // AUTO-START
  // ─────────────────────────────────────────────────────────────────────────
  const hasGeneratedRef = useRef(false);

  useEffect(() => {
    if (hasGeneratedRef.current) return;

    if (hasInitialPrompt && state.prompt && !isGenerating) {
      hasGeneratedRef.current = true;
      handleGenerate(state.prompt, {
        framework: 'react',
        language: 'typescript',
        style: 'modern',
        includeTests: true,
      });
    }
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // UI CONDITIONS
  // ─────────────────────────────────────────────────────────────────────────

  const showPromptInput = !hasInitialPrompt && !isGenerating && !isComplete;

  if (!mounted) {
    return null;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className={`min-h-screen flex flex-col ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200'
    }`}>
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* HEADER */}
      {/* ═══════════════════════════════════════════════════════════════════ */}

      <header className={`sticky top-0 z-50 glass-card border-b shadow-lg ${
        theme === 'dark'
          ? 'border-gray-700 bg-gray-900/50'
          : 'border-gray-200 bg-white/50'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'hover:bg-gray-800'
                    : 'hover:bg-gray-100'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              {/* ✅ MUDANÇA 1: Logo Trinity AI sem círculo roxo, girando */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="w-10 h-10 flex items-center justify-center"
              >
                <img
                  src="/trinity-ai-icon.png"
                  alt="Trinity AI"
                  className="w-full h-full object-contain"
                />
              </motion.div>

              <div>
                <h1 className="font-heading font-bold text-lg gradient-text">
                  ORUS Builder
                </h1>
                <p className={`text-xs ${
                  theme === 'dark'
                    ? 'text-gray-400'
                    : 'text-gray-600'
                }`}>
                  Trinity AI + Orus Builder
                </p>
              </div>
            </div>

            {/* ✅ MUDANÇA 2: Botão tema dark/light */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={`p-2 rounded-lg transition-all ${
                  theme === 'dark'
                    ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
                title="Alternar tema"
              >
                {theme === 'dark' ? (
                  <Sun size={20} />
                ) : (
                  <Moon size={20} />
                )}
              </button>

              {isComplete && files && (
                <button
                  onClick={handleNewGeneration}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  <span className="hidden sm:inline">Nova Geração</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* MAIN CONTENT */}
      {/* ═══════════════════════════════════════════════════════════════════ */}

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <AnimatePresence mode="wait">
            {/* ───────────────────────────────────────────────────────────── */}
            {/* PROMPT INPUT */}
            {/* ───────────────────────────────────────────────────────────── */}

            {showPromptInput && (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2 mb-8">
                  <h1 className={`text-4xl sm:text-5xl font-heading font-bold ${
                    theme === 'dark'
                      ? 'text-white'
                      : 'text-gray-900'
                  }`}>
                    O que você quer{' '}
                    <span className="gradient-text">criar</span> hoje?
                  </h1>
                  <p className={`text-lg ${
                    theme === 'dark'
                      ? 'text-gray-300'
                      : 'text-gray-700'
                  }`}>
                    Descreva sua ideia e Trinity AI gerará código real
                  </p>
                </div>

                {/* ✅ MUDANÇA 4: FIX textarea visibilidade dark */}
                <div className={`glass-card p-8 ${
                  theme === 'dark'
                    ? 'bg-gray-800'
                    : 'bg-white'
                }`}>
                  <PromptInput
                    onSubmit={(prompt: string, options: PromptOptions) => {
                      addMessage('user', prompt);
                      handleGenerate(prompt, options);
                    }}
                    isGenerating={isGenerating}
                  />
                </div>
              </motion.div>
            )}

            {/* ───────────────────────────────────────────────────────────── */}
            {/* GENERATING */}
            {/* ───────────────────────────────────────────────────────────── */}

            {isGenerating && (
              <motion.div
                key="generating"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`glass-card p-12 space-y-8 ${
                  theme === 'dark'
                    ? 'bg-gray-800'
                    : 'bg-white'
                }`}
              >
                <div className="text-center space-y-6">
                  {/* ✅ MUDANÇA 1 (continuação): Logo girando na geração */}
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="inline-flex items-center justify-center w-24 h-24"
                  >
                    <img
                      src="/trinity-ai-icon.png"
                      alt="Trinity AI"
                      className="w-full h-full object-contain"
                    />
                  </motion.div>

                  <div>
                    <h2 className={`text-3xl font-heading font-bold mb-2 ${
                      theme === 'dark'
                        ? 'text-white'
                        : 'text-gray-900'
                    }`}>
                      🧠 Trinity AI está trabalhando...
                    </h2>
                    <p className={`text-xl ${
                      theme === 'dark'
                        ? 'text-gray-300'
                        : 'text-gray-700'
                    }`}>
                      {currentStage}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className={`text-sm font-medium ${
                      theme === 'dark'
                        ? 'text-gray-300'
                        : 'text-gray-700'
                    }`}>{currentStage}</span>
                    <span className="text-3xl font-bold gradient-text">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className={`h-6 rounded-full overflow-hidden ${
                    theme === 'dark'
                      ? 'bg-gray-700'
                      : 'bg-gray-200'
                  }`}>
                    <motion.div
                      style={{ width: `${progress}%` }}
                      className="h-full bg-gradient-to-r from-primary-600 to-accent-600"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ───────────────────────────────────────────────────────────── */}
            {/* RESULTS - CODE DISPLAY */}
            {/* ───────────────────────────────────────────────────────────── */}

            {isComplete && files && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Success Header */}
                <div className={`glass-card p-8 ${
                  theme === 'dark'
                    ? 'bg-gray-800'
                    : 'bg-white'
                }`}>
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-20 h-20 rounded-full bg-gradient-to-br from-success-500 to-success-600 flex items-center justify-center shadow-lg"
                    >
                      <CheckCircle className="w-10 h-10 text-white" />
                    </motion.div>
                    <div className="flex-1 text-center sm:text-left">
                      <h2 className={`text-3xl font-heading font-bold mb-2 ${
                        theme === 'dark'
                          ? 'text-white'
                          : 'text-gray-900'
                      }`}>
                        🎉 Seu App Está Pronto!
                      </h2>
                      <p className={`text-lg ${
                        theme === 'dark'
                          ? 'text-gray-300'
                          : 'text-gray-700'
                      }`}>
                        {files.length} arquivos gerados • 100% pronto para
                        produção
                      </p>
                    </div>
                  </div>
                </div>

                {/* Preview Coming Soon Banner */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`glass-card p-6 bg-gradient-to-r border-2 border-dashed ${
                    theme === 'dark'
                      ? 'from-purple-900/20 to-blue-900/20 border-purple-700'
                      : 'from-purple-50 to-blue-50 border-purple-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-heading font-bold text-lg mb-1 ${
                        theme === 'dark'
                          ? 'text-white'
                          : 'text-gray-900'
                      }`}>
                        🚀 Live Preview - Em Breve
                      </h3>
                      <p className={`text-sm ${
                        theme === 'dark'
                          ? 'text-gray-400'
                          : 'text-gray-600'
                      }`}>
                        Estamos trabalhando em um sistema incrível de preview ao
                        vivo. Por enquanto, você pode baixar o código e testar
                        localmente!
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* ═══════════════════════════════════════════════════════════ */}
                {/* ACTION BAR - ACIMA DO CÓDIGO */}
                {/* ═══════════════════════════════════════════════════════════ */}

                <div className={`glass-card p-4 border-2 ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-gray-50 border-gray-300'
                }`}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    {/* Left Side - File Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md">
                        <FileCode className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className={`font-semibold text-sm ${
                          theme === 'dark'
                            ? 'text-gray-100'
                            : 'text-gray-900'
                        }`}>
                          Arquivos Gerados
                        </h3>
                        <p className={`text-xs ${
                          theme === 'dark'
                            ? 'text-gray-400'
                            : 'text-gray-600'
                        }`}>
                          {files.length} arquivos •{' '}
                          {files.reduce((acc, f) => acc + f.lines, 0)} linhas
                        </p>
                      </div>
                    </div>

                    {/* Right Side - Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Ver Código (scroll to code) */}
                      <button
                        onClick={() => {
                          const codeSection =
                            document.getElementById('code-section');
                          codeSection?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                          });
                        }}
                        className={`px-4 py-2 flex items-center gap-2 rounded-lg transition-all ${
                          theme === 'dark'
                            ? 'hover:bg-gray-700 text-gray-100'
                            : 'hover:bg-gray-100 text-gray-900'
                        }`}
                      >
                        <Code2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Ver Código</span>
                      </button>

                      {/* Download ZIP */}
                      <button
                        onClick={handleDownload}
                        className="px-4 py-2 flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all shadow-md"
                      >
                        <Download className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          Download ZIP
                        </span>
                      </button>

                      {/* ✅ MUDANÇA 3: Salvar Dashboard - Coming soon */}
                      <button
                        onClick={handleSaveProject}
                        title="Coming soon"
                        className="px-4 py-2 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all shadow-md"
                      >
                        <Save className="w-4 h-4" />
                        <span className="text-sm font-medium hidden sm:inline">
                          Salvar
                        </span>
                        <span className="text-xs">(Coming soon)</span>
                      </button>

                      {/* ✅ MUDANÇA 3: Ir para Dashboard - Coming soon */}
                      <button
                        onClick={() => navigate('/dashboard')}
                        title="Coming soon"
                        className="px-4 py-2 flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all shadow-md"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span className="text-sm font-medium hidden sm:inline">
                          Dashboard
                        </span>
                        <span className="text-xs">(Coming soon)</span>
                      </button>

                      {/* ✅ MUDANÇA 3: Deploy - Coming soon */}
                      <button
                        onClick={handleDeploy}
                        title="Coming soon"
                        className="px-4 py-2 flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg transition-all shadow-lg"
                      >
                        <Rocket className="w-4 h-4" />
                        <span className="text-sm font-medium hidden sm:inline">
                          Deploy
                        </span>
                        <span className="text-xs">(Coming soon)</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════ */}
                {/* CODE FILES SECTION - MELHORADO */}
                {/* ═══════════════════════════════════════════════════════════ */}

                <div id="code-section" className="space-y-4">
                  {/* File Tabs */}
                  {files.length > 1 && (
                    <div className={`glass-card p-2 flex items-center gap-2 overflow-x-auto ${
                      theme === 'dark'
                        ? 'bg-gray-800'
                        : 'bg-white'
                    }`}>
                      {files.map((file, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveFileIndex(index)}
                          className={`px-4 py-2 rounded-lg font-mono text-sm whitespace-nowrap transition-all ${
                            activeFileIndex === index
                              ? 'bg-primary-600 text-white shadow-md'
                              : theme === 'dark'
                              ? 'bg-gray-700 hover:bg-gray-600'
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          <FileCode className="w-4 h-4 inline mr-2" />
                          {file.fileName}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Active File Display */}
                  {files.map(
                    (file, index) =>
                      index === activeFileIndex && (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`glass-card overflow-hidden shadow-2xl ${
                            theme === 'dark'
                              ? 'bg-gray-900'
                              : 'bg-white'
                          }`}
                        >
                          {/* File Header - MELHORADO */}
                          <div className={`flex items-center justify-between p-4 border-b ${
                            theme === 'dark'
                              ? 'bg-gray-800 border-gray-700'
                              : 'bg-gray-100 border-gray-200'
                          }`}>
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
                                <FileCode className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h3 className={`font-mono text-sm font-semibold ${
                                  theme === 'dark'
                                    ? 'text-white'
                                    : 'text-gray-900'
                                }`}>
                                  {file.path}
                                </h3>
                                <p className={`text-xs ${
                                  theme === 'dark'
                                    ? 'text-gray-400'
                                    : 'text-gray-600'
                                }`}>
                                  {file.lines} linhas • {file.language}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                handleCopyFile(file.content, file.path)
                              }
                              className={`px-4 py-2 flex items-center gap-2 rounded-lg transition-all ${
                                theme === 'dark'
                                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                              }`}
                            >
                              {copiedFile === file.path ? (
                                <>
                                  <CheckCheck className="w-5 h-5 text-success-400" />
                                  <span className="text-sm font-medium">
                                    Copiado!
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-5 h-5" />
                                  <span className="text-sm font-medium">
                                    Copiar
                                  </span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* Code Block - MELHORADO COM SYNTAX HIGHLIGHT */}
                          <div className="relative">
                            <pre className={`overflow-x-auto p-6 text-sm font-mono leading-relaxed max-h-[600px] overflow-y-auto ${
                              theme === 'dark'
                                ? 'bg-gray-950 text-gray-100'
                                : 'bg-white text-gray-900'
                            }`}>
                              <code>{file.content}</code>
                            </pre>

                            {/* Line Numbers (opcional) */}
                            <div className={`absolute top-0 left-0 p-6 pr-4 select-none pointer-events-none border-r ${
                              theme === 'dark'
                                ? 'text-gray-600 border-gray-800'
                                : 'text-gray-400 border-gray-200'
                            }`}>
                              {Array.from({ length: file.lines }, (_, i) => (
                                <div key={i} className="text-xs leading-relaxed">
                                  {i + 1}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* File Footer - Stats */}
                          <div className={`p-4 border-t flex items-center justify-between ${
                            theme === 'dark'
                              ? 'bg-gray-800 border-gray-700'
                              : 'bg-gray-50 border-gray-200'
                          }`}>
                            <div className={`flex items-center gap-4 text-xs ${
                              theme === 'dark'
                                ? 'text-gray-400'
                                : 'text-gray-600'
                            }`}>
                              <span className="flex items-center gap-1">
                                <Terminal className="w-3 h-3" />
                                {file.language}
                              </span>
                              <span className="flex items-center gap-1">
                                <FileCode className="w-3 h-3" />
                                {file.lines} linhas
                              </span>
                              <span className="flex items-center gap-1">
                                <Package className="w-3 h-3" />
                                {(file.content.length / 1024).toFixed(2)} KB
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse"></div>
                              <span className="text-xs text-success-400 font-medium">
                                Pronto para produção
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )
                  )}
                </div>

                {/* Quick Actions Bottom */}
                <div className={`glass-card p-6 bg-gradient-to-r ${
                  theme === 'dark'
                    ? 'from-primary-900/20 to-secondary-900/20'
                    : 'from-primary-50 to-secondary-50'
                }`}>
                  <h3 className={`font-heading font-bold text-lg mb-4 ${
                    theme === 'dark'
                      ? 'text-white'
                      : 'text-gray-900'
                  }`}>
                    🚀 Próximos Passos
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button
                      onClick={handleDownload}
                      className={`p-4 rounded-lg hover:shadow-lg transition-all text-left ${
                        theme === 'dark'
                          ? 'bg-gray-800 text-white'
                          : 'bg-white text-gray-900'
                      }`}
                    >
                      <Download className="w-8 h-8 mb-2 text-blue-600" />
                      <h4 className="font-semibold text-sm mb-1">
                        Baixar Código
                      </h4>
                      <p className={`text-xs ${
                        theme === 'dark'
                          ? 'text-gray-400'
                          : 'text-gray-600'
                      }`}>
                        Download completo em ZIP
                      </p>
                    </button>

                    <button
                      onClick={handleSaveProject}
                      className={`p-4 rounded-lg hover:shadow-lg transition-all text-left ${
                        theme === 'dark'
                          ? 'bg-gray-800 text-white'
                          : 'bg-white text-gray-900'
                      }`}
                    >
                      <Save className="w-8 h-8 mb-2 text-green-600" />
                      <h4 className="font-semibold text-sm mb-1">
                        Salvar Projeto
                      </h4>
                      <p className={`text-xs ${
                        theme === 'dark'
                          ? 'text-gray-400'
                          : 'text-gray-600'
                      }`}>
                        Adicionar ao dashboard
                      </p>
                    </button>

                    <button
                      onClick={() => navigate('/dashboard')}
                      className={`p-4 rounded-lg hover:shadow-lg transition-all text-left ${
                        theme === 'dark'
                          ? 'bg-gray-800 text-white'
                          : 'bg-white text-gray-900'
                      }`}
                    >
                      <LayoutDashboard className="w-8 h-8 mb-2 text-purple-600" />
                      <h4 className="font-semibold text-sm mb-1">
                        Ver Dashboard
                      </h4>
                      <p className={`text-xs ${
                        theme === 'dark'
                          ? 'text-gray-400'
                          : 'text-gray-600'
                      }`}>
                        Gerenciar projetos
                      </p>
                    </button>

                    <button
                      onClick={handleDeploy}
                      className={`p-4 rounded-lg hover:shadow-lg transition-all text-left ${
                        theme === 'dark'
                          ? 'bg-gray-800 text-white'
                          : 'bg-white text-gray-900'
                      }`}
                    >
                      <Rocket className="w-8 h-8 mb-2 text-orange-600" />
                      <h4 className="font-semibold text-sm mb-1">
                        Deploy Rápido
                      </h4>
                      <p className={`text-xs ${
                        theme === 'dark'
                          ? 'text-gray-400'
                          : 'text-gray-600'
                      }`}>
                        Publicar online
                      </p>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TRINITY CHAT - BOTTOM */}
      {/* ═══════════════════════════════════════════════════════════════════ */}

      <motion.div
        animate={{ height: isChatExpanded ? '300px' : '60px' }}
        className={`border-t flex flex-col shadow-2xl ${
          theme === 'dark'
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}
      >
        {/* Chat Header */}
        <div
          className={`flex items-center justify-between px-6 py-3 cursor-pointer transition-colors ${
            theme === 'dark'
              ? 'hover:bg-gray-700/50'
              : 'hover:bg-gray-50'
          }`}
          onClick={() => setIsChatExpanded(!isChatExpanded)}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center shadow-md">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className={`font-heading font-bold text-sm ${
                theme === 'dark'
                  ? 'text-white'
                  : 'text-gray-900'
              }`}>
                Trinity AI Chat
              </h3>
              <p className={`text-xs ${
                theme === 'dark'
                  ? 'text-gray-400'
                  : 'text-gray-600'
              }`}>
                {isGenerating
                  ? '⚡ Gerando...'
                  : isComplete
                  ? '✅ Completo!'
                  : '💬 Pronto'}
              </p>
            </div>
          </div>
          <div>
            {isChatExpanded ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </div>
        </div>

        {/* Chat Messages */}
        {isChatExpanded && (
          <div className={`flex-1 overflow-y-auto p-6 space-y-3 ${
            theme === 'dark'
              ? 'bg-gray-900'
              : 'bg-gray-50'
          }`}>
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 shadow-md ${
                    msg.role === 'user'
                      ? 'bg-primary-600 text-white'
                      : theme === 'dark'
                      ? 'bg-gray-800 text-gray-100'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {msg.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};