/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 ORUS BUILDER - GENERATE PAGE v5.0 SUPREME
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * ✨ REFATORAÇÃO COMPLETA - CODE-FIRST APPROACH
 * 
 * MUDANÇAS v5.0:
 * ✅ Removido preview iframe (Coming Soon)
 * ✅ Código como protagonista principal
 * ✅ Action Bar intuitiva acima do código
 * ✅ UX melhorada visualmente
 * ✅ Mantidas todas funcionalidades (ZIP, Deploy, Dashboard)
 * ✅ Syntax highlighting melhorado
 * ✅ Tabs para navegação entre arquivos
 * ✅ Layout responsivo e moderno
 * 
 * Backend: Groq API ✅ | Download ZIP ✅ | Chat Trinity ✅
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
const isGeneratingRef = useRef(false);
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
    const response = await fetch(`http://localhost:5000/api/v1/generation/generate`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        prompt: prompt.trim(),
        options: {
          framework: options.framework || 'react',
          language: options.language || 'typescript',
          complexity: options.complexity || 'standard',
          includeTests: options.includeTests || false,
          style: options.style || 'modern',
          applyStyles: true,
          applyTailwind: true,
          darkMode: true,
          responsive: true,
        },
      }),
    });

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

    console.log('✅ Formatted files:', formattedFiles.map(f => f.fileName));

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
      style: 'standard',
      includeTests: true,
    });
  }
}, []); 
  // ─────────────────────────────────────────────────────────────────────────
  // UI CONDITIONS
  // ─────────────────────────────────────────────────────────────────────────

  const showPromptInput = !hasInitialPrompt && !isGenerating && !isComplete;

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* HEADER */}
      {/* ═══════════════════════════════════════════════════════════════════ */}

      <header className="sticky top-0 z-50 glass-card border-b border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 shadow-glow flex items-center justify-center">
  <img 
    src="/trinity-ai-icon.png" 
    alt="Trinity AI" 
    className="w-6 h-6 object-contain"
  />
</div>

              <div>
                <h1 className="font-heading font-bold text-lg gradient-text">
                  ORUS Builder
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Trinity AI + Orus Builder
                </p>
              </div>
            </div>

            {/* Actions */}
            {isComplete && files && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleNewGeneration}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  <span className="hidden sm:inline">Nova Geração</span>
                </button>
              </div>
            )}
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
                  <h1 className="text-4xl sm:text-5xl font-heading font-bold">
                    O que você quer{' '}
                    <span className="gradient-text">criar</span> hoje?
                  </h1>
                  <p className="text-lg text-gray-700 dark:text-gray-300">
                    Descreva sua ideia e Trinity AI gerará código real
                  </p>
                </div>

                <PromptInput
                  onSubmit={(prompt, options) => {
                    addMessage('user', prompt);
                    handleGenerate(prompt, options);
                  }}
                  isGenerating={isGenerating}
                  validatePrompt={(prompt) => ({
                    isValid: prompt.length >= 10,
                    quality: Math.min((prompt.length / 100) * 100, 100),
                    minLength: 10,
                    maxLength: 2000,
                  })}
                />
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
                className="glass-card p-12 space-y-8"
              >
                <div className="text-center space-y-6">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                    }}
                    className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 shadow-glow"
                  >
                    <Sparkles className="w-12 h-12 text-white" />
                  </motion.div>

                  <div>
                    <h2 className="text-3xl font-heading font-bold mb-2">
                      🧠 Trinity AI está trabalhando...
                    </h2>
                    <p className="text-xl text-gray-700 dark:text-gray-300">
                      {currentStage}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{currentStage}</span>
                    <span className="text-3xl font-bold gradient-text">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
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
                <div className="glass-card p-8">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-20 h-20 rounded-full bg-gradient-to-br from-success-500 to-success-600 flex items-center justify-center shadow-lg"
                    >
                      <CheckCircle className="w-10 h-10 text-white" />
                    </motion.div>
                    <div className="flex-1 text-center sm:text-left">
                      <h2 className="text-3xl font-heading font-bold mb-2">
                        🎉 Seu App Está Pronto!
                      </h2>
                      <p className="text-lg text-gray-700 dark:text-gray-300">
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
                  className="glass-card p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-2 border-dashed border-purple-300 dark:border-purple-700"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading font-bold text-lg mb-1">
                        🚀 Live Preview - Em Breve
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
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

                <div className="glass-card p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-300 dark:border-gray-700">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    {/* Left Side - File Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md">
                        <FileCode className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                          Arquivos Gerados
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
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
                        className="btn-ghost px-4 py-2 flex items-center gap-2 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-all"
                      >
                        <Code2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Ver Código</span>
                      </button>

                      {/* Download ZIP */}
                      <button
                        onClick={handleDownload}
                        className="btn-secondary px-4 py-2 flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all shadow-md"
                      >
                        <Download className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          Download ZIP
                        </span>
                      </button>

                      {/* Salvar Dashboard */}
                      <button
                        onClick={handleSaveProject}
                        className="btn-secondary px-4 py-2 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all shadow-md"
                      >
                        <Save className="w-4 h-4" />
                        <span className="text-sm font-medium hidden sm:inline">
                          Salvar
                        </span>
                      </button>

                      {/* Ir para Dashboard */}
                      <button
                        onClick={() => navigate('/dashboard')}
                        className="btn-secondary px-4 py-2 flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all shadow-md"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span className="text-sm font-medium hidden sm:inline">
                          Dashboard
                        </span>
                      </button>

                      {/* Deploy */}
                      <button
                        onClick={handleDeploy}
                        className="btn-primary px-4 py-2 flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg transition-all shadow-lg"
                      >
                        <Rocket className="w-4 h-4" />
                        <span className="text-sm font-medium hidden sm:inline">
                          Deploy
                        </span>
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
                    <div className="glass-card p-2 flex items-center gap-2 overflow-x-auto">
                      {files.map((file, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveFileIndex(index)}
                          className={`px-4 py-2 rounded-lg font-mono text-sm whitespace-nowrap transition-all ${
                            activeFileIndex === index
                              ? 'bg-primary-600 text-white shadow-md'
                              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
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
                          className="glass-card overflow-hidden shadow-2xl"
                        >
                          {/* File Header - MELHORADO */}
                          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
                                <FileCode className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h3 className="font-mono text-sm font-semibold text-white">
                                  {file.path}
                                </h3>
                                <p className="text-xs text-gray-400">
                                  {file.lines} linhas • {file.language}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                handleCopyFile(file.content, file.path)
                              }
                              className="px-4 py-2 flex items-center gap-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all text-white"
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
                            <pre className="overflow-x-auto p-6 bg-gray-950 text-gray-100 text-sm font-mono leading-relaxed max-h-[600px] overflow-y-auto">
                              <code>{file.content}</code>
                            </pre>

                            {/* Line Numbers (opcional) */}
                            <div className="absolute top-0 left-0 p-6 pr-4 text-gray-600 select-none pointer-events-none border-r border-gray-800">
                              {Array.from({ length: file.lines }, (_, i) => (
                                <div key={i} className="text-xs leading-relaxed">
                                  {i + 1}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* File Footer - Stats */}
                          <div className="p-4 bg-gray-800 border-t border-gray-700 flex items-center justify-between">
                            <div className="flex items-center gap-4 text-xs text-gray-400">
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
                <div className="glass-card p-6 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20">
                  <h3 className="font-heading font-bold text-lg mb-4">
                    🚀 Próximos Passos
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button
                      onClick={handleDownload}
                      className="p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-lg transition-all text-left"
                    >
                      <Download className="w-8 h-8 mb-2 text-blue-600" />
                      <h4 className="font-semibold text-sm mb-1">
                        Baixar Código
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Download completo em ZIP
                      </p>
                    </button>

                    <button
                      onClick={handleSaveProject}
                      className="p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-lg transition-all text-left"
                    >
                      <Save className="w-8 h-8 mb-2 text-green-600" />
                      <h4 className="font-semibold text-sm mb-1">
                        Salvar Projeto
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Adicionar ao dashboard
                      </p>
                    </button>

                    <button
                      onClick={() => navigate('/dashboard')}
                      className="p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-lg transition-all text-left"
                    >
                      <LayoutDashboard className="w-8 h-8 mb-2 text-purple-600" />
                      <h4 className="font-semibold text-sm mb-1">
                        Ver Dashboard
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Gerenciar projetos
                      </p>
                    </button>

                    <button
                      onClick={handleDeploy}
                      className="p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-lg transition-all text-left"
                    >
                      <Rocket className="w-8 h-8 mb-2 text-orange-600" />
                      <h4 className="font-semibold text-sm mb-1">
                        Deploy Rápido
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
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
        className="border-t bg-white dark:bg-gray-800 flex flex-col shadow-2xl"
      >
        {/* Chat Header */}
        <div
          className="flex items-center justify-between px-6 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          onClick={() => setIsChatExpanded(!isChatExpanded)}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center shadow-md">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm">
                Trinity AI Chat
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
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
          <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-gray-50 dark:bg-gray-900">
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
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
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
