'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeContext } from '../context/ThemeContext';
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
  LayoutDashboard,
  Rocket,
  Save,
  Code2,
  Terminal,
  Package,
  ChevronDown,
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react';
import { PromptInput, PromptOptions } from '../components/generation/PromptInput';
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

// ============================================================================
// TRANSLATIONS
// ============================================================================

type Language = 'pt' | 'en' | 'es';

const translations: Record<Language, Record<string, string>> = {
  pt: {
    title: 'Gerando seu projeto',
    subtitle: 'Descreva sua ideia e Trinity AI gerará código real',
    generating: 'Gerando',
    complete: 'Completo',
    ready: 'Pronto',
    files_generated: 'arquivos gerados',
    code: 'Ver Código',
    download: 'Download ZIP',
    save: 'Salvar',
    dashboard: 'Dashboard',
    deploy: 'Deploy',
    new_generation: 'Nova Geração',
    chat_generating: 'Gerando',
    chat_complete: 'Completo',
    chat_ready: 'Pronto',
    copy: 'Copiar',
    copied: 'Copiado!',
    production_ready: 'Pronto para produção',
    next_steps: 'Próximos Passos',
    download_code_desc: 'Download completo em ZIP',
    save_project_desc: 'Adicionar ao dashboard',
    deploy_desc: 'Publicar online',
    files: 'arquivos',
    lines: 'linhas',
    view_dashboard: 'Ver Dashboard',
    coming_soon: 'Em breve',
  },
  en: {
    title: 'Generating your project',
    subtitle: 'Describe your idea and Trinity AI will generate real code',
    generating: 'Generating',
    complete: 'Complete',
    ready: 'Ready',
    files_generated: 'files generated',
    code: 'View Code',
    download: 'Download ZIP',
    save: 'Save',
    dashboard: 'Dashboard',
    deploy: 'Deploy',
    new_generation: 'New Generation',
    chat_generating: 'Generating',
    chat_complete: 'Complete',
    chat_ready: 'Ready',
    copy: 'Copy',
    copied: 'Copied!',
    production_ready: 'Production ready',
    next_steps: 'Next Steps',
    download_code_desc: 'Complete download in ZIP',
    save_project_desc: 'Add to dashboard',
    deploy_desc: 'Publish online',
    files: 'files',
    lines: 'lines',
    view_dashboard: 'View Dashboard',
    coming_soon: 'Coming soon',
  },
  es: {
    title: 'Generando tu proyecto',
    subtitle: 'Describe tu idea y Trinity AI generará código real',
    generating: 'Generando',
    complete: 'Completado',
    ready: 'Listo',
    files_generated: 'archivos generados',
    code: 'Ver Código',
    download: 'Descargar ZIP',
    save: 'Guardar',
    dashboard: 'Dashboard',
    deploy: 'Desplegar',
    new_generation: 'Nueva Generación',
    chat_generating: 'Generando',
    chat_complete: 'Completado',
    chat_ready: 'Listo',
    copy: 'Copiar',
    copied: '¡Copiado!',
    production_ready: 'Listo para producción',
    next_steps: 'Próximos Pasos',
    download_code_desc: 'Descarga completa en ZIP',
    save_project_desc: 'Agregar al panel',
    deploy_desc: 'Publicar en línea',
    files: 'archivos',
    lines: 'líneas',
    view_dashboard: 'Ver Dashboard',
    coming_soon: 'Próximamente',
  },
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const GeneratePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const hasInitialPrompt = Boolean(state?.prompt);

  // ✅ USE THEME CONTEXT
  const { theme, setTheme, language, setLanguage } = useThemeContext();

  const t = translations[language];
  const [mounted, setMounted] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState<string | null>(null);
  const [files, setFiles] = useState<GeneratedFile[] | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [generationId, setGenerationId] = useState<string>('');
  const isGeneratingRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const handleGenerate = async (prompt: string, options: PromptOptions) => {
    if (isGeneratingRef.current) {
      console.warn('⚠️ Generation already in progress!');
      return;
    }

    isGeneratingRef.current = true;
    setIsGenerating(true);
    setIsComplete(false);
    setProgress(0);
    setFiles(null);
    setJobId(null);

    addMessage('user', prompt);
    addMessage('trinity', '🔗 Conectando com Groq API...');

    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/generation/generate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
      const generatedJobId = data.jobId || data.data?.jobId;

      if (!generatedJobId) {
        throw new Error('No jobId received from backend');
      }

      setJobId(generatedJobId);
      setGenerationId(generatedJobId);

      addMessage('trinity', `✅ Job criado: ${generatedJobId}. Gerando com Groq...`);

      const stagesData: Record<Language, Array<{ name: string; progress: number; duration: number }>> = {
        pt: [
          { name: '🧠 Analisando sua descrição com Trinity AI', progress: 20, duration: 2000 },
          { name: '⚡ Projetando arquitetura do projeto...', progress: 40, duration: 3000 },
          { name: '📝 Gerando componentes React...', progress: 60, duration: 3000 },
          { name: '🔧 Construindo backend...', progress: 75, duration: 2500 },
          { name: '✅ Criando testes unitários...', progress: 90, duration: 2000 },
          { name: '⚡ Otimizando código...', progress: 95, duration: 1500 },
          { name: '🎯 Finalizando geração...', progress: 100, duration: 1000 },
        ],
        en: [
          { name: '🧠 Analyzing your description with Trinity AI', progress: 20, duration: 2000 },
          { name: '⚡ Designing project architecture...', progress: 40, duration: 3000 },
          { name: '📝 Generating React components...', progress: 60, duration: 3000 },
          { name: '🔧 Building backend...', progress: 75, duration: 2500 },
          { name: '✅ Creating unit tests...', progress: 90, duration: 2000 },
          { name: '⚡ Optimizing code...', progress: 95, duration: 1500 },
          { name: '🎯 Finalizing generation...', progress: 100, duration: 1000 },
        ],
        es: [
          { name: '🧠 Analizando tu descripción con Trinity AI', progress: 20, duration: 2000 },
          { name: '⚡ Diseñando arquitectura del proyecto...', progress: 40, duration: 3000 },
          { name: '📝 Generando componentes React...', progress: 60, duration: 3000 },
          { name: '🔧 Construyendo backend...', progress: 75, duration: 2500 },
          { name: '✅ Creando pruebas unitarias...', progress: 90, duration: 2000 },
          { name: '⚡ Optimizando código...', progress: 95, duration: 1500 },
          { name: '🎯 Finalizando generación...', progress: 100, duration: 1000 },
        ],
      };

      const stages = stagesData[language];

      for (const stage of stages) {
        setCurrentStage(stage.name);
        setProgress(stage.progress);
        await new Promise((resolve) => setTimeout(resolve, stage.duration));
      }

      const generatedFiles = data.data?.files || data.files || [];

      if (generatedFiles.length === 0) {
        throw new Error('No files generated by backend');
      }

      const formattedFiles: GeneratedFile[] = generatedFiles.map((file: any) => ({
        path: file.path || file.fileName || 'unknown',
        fileName: file.fileName || file.name || file.path || 'file.tsx',
        content: file.content || '// No content',
        language: file.language || 'typescript',
        lines: file.lines || file.content?.split('\n').length || 0,
      }));

      setFiles(formattedFiles);
      setIsComplete(true);
      setProgress(100);

      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      addMessage(
        'trinity',
        `🎉 Código REAL gerado! ${formattedFiles.length} ${t.files_generated}!`
      );
      toast.success(`${formattedFiles.length} ${t.files_generated}!`);
    } catch (error: any) {
      console.error('❌ Generation error:', error);
      setIsComplete(false);
      addMessage('trinity', `❌ Erro: ${error.message}`);
      toast.error(`Erro: ${error.message}`);
    } finally {
      setIsGenerating(false);
      isGeneratingRef.current = false;
    }
  };

  const handleDownload = () => {
    if (!generationId && !jobId) {
      toast.error('Nenhuma geração disponível para download');
      return;
    }

    const idToUse = generationId || jobId;
    window.location.href = `http://localhost:5000/api/v1/generation/download/${idToUse}`;
    toast.success('Download iniciado!');
  };

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
          description: chatMessages[0]?.content || 'Projeto gerado pelo ORUS Builder',
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

  const handleDashboard = () => {
    toast('🚀 ' + t.coming_soon, { icon: '🔧' });
  };

  const handleDeploy = () => {
    toast('🚀 ' + t.coming_soon, { icon: '🔧' });
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
      toast.success(`${filename} ${t.copied.toLowerCase()}!`);
      setTimeout(() => setCopiedFile(null), 2000);
    } catch (error) {
      toast.error('Erro ao copiar');
    }
  };

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

  const showPromptInput = !hasInitialPrompt && !isGenerating && !isComplete;

  if (!mounted) {
    return null;
  }

  return (
    <div className={`min-h-screen flex flex-col ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200'
    }`}>
      {/* ============================================================================
          HEADER
      ============================================================================ */}
      <header className={`sticky top-0 z-50 border-b backdrop-blur-sm ${
        theme === 'dark'
          ? 'border-gray-700 bg-gray-800/80'
          : 'border-gray-200 bg-white/80'
      } shadow-lg`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'hover:bg-gray-700'
                    : 'hover:bg-gray-100'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              {/* Logo - Spinning + Glow */}
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 bg-gradient-to-br from-blue-400/30 via-purple-400/30 to-pink-400/30 rounded-full blur-xl"
                />
                <motion.img
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  src="/trinity-ai-icon.png"
                  alt="Trinity AI"
                  className="w-16 h-16 object-contain relative z-10 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                />
              </div>

              <div>
                <h1 className={`font-heading font-bold text-xl ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  ORUS Builder
                </h1>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Trinity AI + ORUS Builder
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className={`px-3 py-2 rounded-lg font-medium text-sm transition-all border ${
                  theme === 'dark'
                    ? 'border-gray-600 bg-gray-700 text-white hover:bg-gray-600'
                    : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
                }`}
              >
                <option value="pt">🇧🇷 PT</option>
                <option value="en">🇺🇸 EN</option>
                <option value="es">🇪🇸 ES</option>
              </select>

              {/* Theme Toggle - ✅ FUNCIONA COM CONTEXTO */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={`p-2 rounded-lg transition-all ${
                  theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>

              {isComplete && files && (
                <button
                  onClick={handleNewGeneration}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-all"
                >
                  <Zap className="w-4 h-4" />
                  <span className="hidden sm:inline">{t.new_generation}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

   {/* MAIN CONTENT */}
<div className="flex-1 overflow-y-auto">
  <div className="max-w-7xl mx-auto px-6 py-8">
    <AnimatePresence mode="wait">
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
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              O que você quer{' '}
              <span className="gradient-text">criar</span> hoje?
            </h1>
            <p className={`text-lg ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t.subtitle}
            </p>
          </div>

          <div className={`glass-card p-8 rounded-2xl ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
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

      {isGenerating && (
        <motion.div
          key="generating"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`glass-card p-12 space-y-8 rounded-2xl ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-28 h-28">
              <motion.img
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                src="/trinity-ai-icon.png"
                alt="Trinity AI"
                className="w-24 h-24 object-contain"
              />
            </div>

            <div>
              <h2 className={`text-3xl font-heading font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                🧠 Trinity AI está trabalhando...
              </h2>
              <p className={`text-xl min-h-[2rem] ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
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

            <div className={`h-3 rounded-full overflow-hidden relative ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
            }`}>
              <motion.div
                style={{ width: `${progress}%` } as any}
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg"
                transition={{ duration: 0.5 }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full"></div>
            </div>
          </div>
        </motion.div>
      )}

      {isComplete && files && (
        <motion.div
          key="results"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Success Card */}
          <div className={`glass-card p-8 rounded-2xl ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
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
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  🎉 Seu App Está Pronto!
                </h2>
                <p className={`text-lg ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {files.length} {t.files_generated} • 100% {t.production_ready}
                </p>
              </div>
            </div>
          </div>

          {/* Live Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-6 bg-gradient-to-r border-2 border-dashed rounded-2xl ${
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
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  🚀 Live Preview - Em Breve
                </h3>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Estamos trabalhando em um sistema incrível de preview ao vivo. Por enquanto, você pode baixar o código e testar localmente!
                </p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className={`glass-card p-4 border-2 rounded-2xl ${
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md">
                  <FileCode className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className={`font-semibold text-sm ${
                    theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    Arquivos Gerados
                  </h3>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {files.length} {t.files} • {files.reduce((acc, f) => acc + f.lines, 0)} {t.lines}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    const codeSection = document.getElementById('code-section');
                    codeSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`px-4 py-2 flex items-center gap-2 rounded-lg transition-all ${
                    theme === 'dark'
                      ? 'hover:bg-gray-700 text-gray-100'
                      : 'hover:bg-gray-100 text-gray-900'
                  }`}
                >
                  <Code2 className="w-4 h-4" />
                  <span className="text-sm font-medium">{t.code}</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="px-4 py-2 flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm font-medium">{t.download}</span>
                </button>

                <button
                  onClick={handleSaveProject}
                  className="px-4 py-2 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span className="text-sm font-medium hidden sm:inline">{t.save}</span>
                </button>

                <button
                  onClick={handleDashboard}
                  className="px-4 py-2 flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all shadow-md"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="text-sm font-medium hidden sm:inline">{t.view_dashboard}</span>
                </button>

                <button
                  onClick={handleDeploy}
                  className="px-4 py-2 flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg transition-all shadow-lg"
                >
                  <Rocket className="w-4 h-4" />
                  <span className="text-sm font-medium hidden sm:inline">{t.deploy}</span>
                </button>
              </div>
            </div>
          </div>

          {/* CODE SECTION */}
          <div id="code-section" className="space-y-4">
            {files.length > 1 && (
              <div className={`glass-card p-2 flex items-center gap-2 overflow-x-auto rounded-2xl ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                {files.map((file, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveFileIndex(index)}
                    className={`px-4 py-2 rounded-lg font-mono text-sm whitespace-nowrap transition-all flex-shrink-0 ${
                      activeFileIndex === index
                        ? 'bg-primary-600 text-white shadow-md'
                        : theme === 'dark'
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <FileCode className="w-4 h-4 inline mr-2" />
                    {file.fileName}
                  </button>
                ))}
              </div>
            )}

            {files.map(
              (file, index) =>
                index === activeFileIndex && (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`glass-card overflow-hidden shadow-2xl rounded-2xl ${
                      theme === 'dark' ? 'bg-gray-900' : 'bg-white'
                    }`}
                  >
                    {/* Header */}
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
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {file.path}
                          </h3>
                          <p className={`text-xs ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {file.lines} {t.lines} • {file.language}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopyFile(file.content, file.path)}
                        className={`px-4 py-2 flex items-center gap-2 rounded-lg transition-all ${
                          theme === 'dark'
                            ? 'bg-gray-700 hover:bg-gray-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                        }`}
                      >
                        {copiedFile === file.path ? (
                          <>
                            <CheckCheck className="w-5 h-5 text-success-400" />
                            <span className="text-sm font-medium">{t.copied}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-5 h-5" />
                            <span className="text-sm font-medium">{t.copy}</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Code Content */}
                    <pre className={`overflow-x-auto p-6 text-sm font-mono leading-relaxed max-h-[600px] overflow-y-auto ${
                      theme === 'dark'
                        ? 'bg-gray-950 text-gray-100'
                        : 'bg-white text-gray-900'
                    }`}>
                      <code>{file.content}</code>
                    </pre>

                    {/* Footer */}
                    <div className={`p-4 border-t flex items-center justify-between ${
                      theme === 'dark'
                        ? 'bg-gray-800 border-gray-700'
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className={`flex items-center gap-4 text-xs ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <span className="flex items-center gap-1">
                          <Terminal className="w-3 h-3" />
                          {file.language}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileCode className="w-3 h-3" />
                          {file.lines} {t.lines}
                        </span>
                        <span className="flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          {(file.content.length / 1024).toFixed(2)} KB
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse"></div>
                        <span className="text-xs text-success-400 font-medium">
                          {t.production_ready}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )
            )}
          </div>

          {/* Next Steps */}
          <div className={`glass-card p-6 bg-gradient-to-r rounded-2xl ${
            theme === 'dark'
              ? 'from-primary-900/20 to-secondary-900/20'
              : 'from-primary-50 to-secondary-50'
          }`}>
            <h3 className={`font-heading font-bold text-lg mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              🚀 {t.next_steps}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={handleDownload}
                className={`p-4 rounded-lg hover:shadow-lg transition-all text-left ${
                  theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                }`}
              >
                <Download className="w-8 h-8 mb-2 text-blue-600" />
                <h4 className="font-semibold text-sm mb-1">{t.download}</h4>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {t.download_code_desc}
                </p>
              </button>

              <button
                onClick={handleSaveProject}
                className={`p-4 rounded-lg hover:shadow-lg transition-all text-left ${
                  theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                }`}
              >
                <Save className="w-8 h-8 mb-2 text-green-600" />
                <h4 className="font-semibold text-sm mb-1">{t.save}</h4>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {t.save_project_desc}
                </p>
              </button>

              <button
                onClick={handleDeploy}
                className={`p-4 rounded-lg hover:shadow-lg transition-all text-left ${
                  theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                }`}
              >
                <Rocket className="w-8 h-8 mb-2 text-orange-600" />
                <h4 className="font-semibold text-sm mb-1">{t.deploy}</h4>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {t.deploy_desc}
                </p>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
</div>

      {/* CHAT FOOTER */}
      <motion.div
        animate={{ height: isChatExpanded ? '300px' : '60px' }}
        className={`border-t flex flex-col shadow-2xl ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}
      >
        <div
          className={`flex items-center justify-between px-6 py-3 cursor-pointer transition-colors ${
            theme === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
          }`}
          onClick={() => setIsChatExpanded(!isChatExpanded)}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center shadow-md">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className={`font-heading font-bold text-sm ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Trinity AI Chat
              </h3>
              <p className={`text-xs ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {isGenerating ? `⚡ ${t.chat_generating}...` : isComplete ? `✅ ${t.chat_complete}!` : `💬 ${t.chat_ready}`}
              </p>
            </div>
          </div>
          <div>
            {isChatExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </div>
        </div>

        {isChatExpanded && (
          <div className={`flex-1 overflow-y-auto p-6 space-y-3 ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
          }`}>
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
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

export default GeneratePage;
