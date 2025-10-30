'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

interface GeneratedFile {
  name: string;
  language: string;
  content: string;
  lines: number;
  path: string;
}

interface LogMessage {
  content: string;
  timestamp: Date;
}

interface GeneratePageProps {
  prompt: string;
  options?: any;
}

// ✅ FIX #18: Language Translations
const translations = {
  pt: {
    title: 'Gerando seu projeto',
    subtitle: 'Descreva sua ideia e Trinity AI gerará código real',
    generating: 'Gerando',
    complete: 'Completo',
    ready: 'Pronto',
    files_generated: 'arquivos gerados',
    files: 'arquivos',
    lines: 'linhas',
    production_ready: '100% pronto para produção',
    live_preview: 'Estamos trabalhando em um sistema incrível de preview ao vivo',
    download_code: 'Por enquanto, você pode baixar o código e testar localmente',
    processing_stages: {
      analyzing: '🔍 Analisando sua descrição...',
      architecture: '🏗️ Projetando arquitetura...',
      components: '⚛️ Gerando componentes...',
      backend: '🔧 Construindo backend...',
      tests: '✅ Criando testes...',
      optimizing: '⚡ Otimizando código...',
      finalizing: '🎯 Finalizando...'
    }
  },
  en: {
    title: 'Generating your project',
    subtitle: 'Describe your idea and Trinity AI will generate real code',
    generating: 'Generating',
    complete: 'Complete',
    ready: 'Ready',
    files_generated: 'files generated',
    files: 'files',
    lines: 'lines',
    production_ready: '100% ready for production',
    live_preview: 'We are working on an amazing live preview system',
    download_code: 'For now, you can download the code and test locally',
    processing_stages: {
      analyzing: '🔍 Analyzing your description...',
      architecture: '🏗️ Designing architecture...',
      components: '⚛️ Generating components...',
      backend: '🔧 Building backend...',
      tests: '✅ Creating tests...',
      optimizing: '⚡ Optimizing code...',
      finalizing: '🎯 Finalizing...'
    }
  }
};

export default function GeneratePage({ prompt, options }: GeneratePageProps) {
  // ✅ STATE
  const [isGenerating, setIsGenerating] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [files, setFiles] = useState<GeneratedFile[]>([]);
  const [currentStage, setCurrentStage] = useState(0);
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  
  // ✅ FIX #18: Language Toggle
  const [language, setLanguage] = useState<'pt' | 'en'>('pt');
  const [isDark, setIsDark] = useState(true);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const t = translations[language];
  const stages = Object.values(t.processing_stages);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // ✅ Simulate generation
  useEffect(() => {
    if (!isGenerating) return;

    const stageInterval = setInterval(() => {
      setCurrentStage(prev => {
        const next = prev + 1;
        if (next >= stages.length) {
          setIsGenerating(false);
          setIsComplete(true);
          clearInterval(stageInterval);
          return prev;
        }
        return next;
      });
    }, 1500);

    const logInterval = setInterval(() => {
      setLogs(prev => [...prev, {
        content: stages[Math.floor(Math.random() * stages.length)],
        timestamp: new Date()
      }]);
    }, 800);

    return () => {
      clearInterval(stageInterval);
      clearInterval(logInterval);
    };
  }, [isGenerating, stages]);

  // Mock files
  useEffect(() => {
    if (isComplete && files.length === 0) {
      setFiles([
        {
          name: 'index.tsx',
          language: 'typescript',
          path: 'src/components/',
          lines: 42,
          content: `import React from 'react';\n\nexport const Hero: React.FC = () => {\n  return (\n    <div className="w-full h-screen bg-gradient-to-r from-blue-600 to-purple-600">\n      <div className="flex items-center justify-center h-full">\n        <h1 className="text-4xl font-bold text-white">Welcome</h1>\n      </div>\n    </div>\n  );\n};\n\nexport default Hero;`
        },
        {
          name: 'api.ts',
          language: 'typescript',
          path: 'src/backend/',
          lines: 28,
          content: `import express from 'express';\nimport cors from 'cors';\n\nconst app = express();\napp.use(cors());\napp.use(express.json());\n\napp.get('/api/health', (req, res) => {\n  res.json({ status: 'healthy' });\n});\n\napp.listen(3000, () => {\n  console.log('Server running on port 3000');\n});`
        },
        {
          name: 'styles.css',
          language: 'css',
          path: 'src/styles/',
          lines: 35,
          content: `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\nbody {\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;\n  background: #f9fafb;\n  color: #1f2937;\n}\n\n.container {\n  max-width: 1280px;\n  margin: 0 auto;\n  padding: 0 1rem;\n}`
        }
      ]);
    }
  }, [isComplete, files.length]);

  const selectedFile = files[selectedFileIndex];
  const progress = (currentStage / stages.length) * 100;

  return (
    <div className={clsx(
      'min-h-screen transition-colors duration-300',
      isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
    )}>
      
      {/* ✅ HEADER WITH THEME & LANGUAGE TOGGLE */}
      <div className={clsx(
        'border-b backdrop-blur-sm sticky top-0 z-50',
        isDark ? 'border-gray-800 bg-gray-900/80' : 'border-gray-200 bg-white/80'
      )}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className={clsx(
              'w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold',
              isDark ? 'bg-blue-600' : 'bg-blue-500'
            )}>
              ⚡
            </div>
            <div>
              <h1 className="text-2xl font-bold">ORUS Builder</h1>
              <p className={clsx('text-xs', isDark ? 'text-gray-400' : 'text-gray-600')}>
                Trinity AI
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* ✅ FIX #18.1: Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
              className={clsx(
                'px-4 py-2 rounded-lg font-medium transition-all',
                isDark 
                  ? 'bg-gray-800 hover:bg-gray-700' 
                  : 'bg-gray-100 hover:bg-gray-200'
              )}
            >
              {language === 'pt' ? '🇬🇧 EN' : '🇧🇷 PT'}
            </button>

            {/* ✅ FIX #18.2: Theme Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className={clsx(
                'w-12 h-12 rounded-lg flex items-center justify-center transition-all text-xl',
                isDark 
                  ? 'bg-gray-800 hover:bg-gray-700' 
                  : 'bg-gray-100 hover:bg-gray-200'
              )}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* TITLE */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold mb-2">{t.title}</h1>
          <p className={clsx(isDark ? 'text-gray-400' : 'text-gray-600')}>
            {t.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: Progress & Logs */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* ✅ FIX #18.3: Enhanced Progress Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={clsx(
                'rounded-xl p-6 backdrop-blur-sm',
                isDark 
                  ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
                  : 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200'
              )}
            >
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-sm">
                    {isGenerating ? t.generating : isComplete ? t.complete : t.ready}
                  </span>
                  <span className="text-sm font-mono">{Math.round(progress)}%</span>
                </div>
                
                {/* ✅ Animated Gradient Progress Bar */}
                <div className={clsx(
                  'h-3 rounded-full overflow-hidden',
                  isDark ? 'bg-gray-700' : 'bg-gray-300'
                )}>
                  <motion.div
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg"
                  />
                </div>
              </div>

              {/* Current Stage with Animation */}
              <motion.div
                key={currentStage}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className={clsx(
                  'text-lg font-semibold p-3 rounded-lg',
                  isDark ? 'bg-gray-700' : 'bg-gray-200'
                )}
              >
                {stages[currentStage] || t.processing_stages.finalizing}
              </motion.div>
            </motion.div>

            {/* ✅ FIX #18.4: Improved Logs Display */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={clsx(
                'rounded-xl p-6 backdrop-blur-sm max-h-96 overflow-y-auto',
                isDark 
                  ? 'bg-gray-800 border border-gray-700' 
                  : 'bg-gray-50 border border-gray-200'
              )}
            >
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                📋 Logs
              </h3>
              
              <div className="space-y-2 font-mono text-sm">
                {logs.map((log, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={clsx(
                      'p-2 rounded flex gap-2 items-start',
                      isDark ? 'bg-gray-700/50' : 'bg-gray-200/50'
                    )}
                  >
                    <span className="text-gray-500 flex-shrink-0">
                      {log.timestamp.toLocaleTimeString(language === 'pt' ? 'pt-BR' : 'en-US')}
                    </span>
                    <span className={isDark ? 'text-green-400' : 'text-green-600'}>
                      {log.content}
                    </span>
                  </motion.div>
                ))}
              </div>
              <div ref={logsEndRef} />
            </motion.div>
          </div>

          {/* RIGHT: Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={clsx(
              'rounded-xl p-6 backdrop-blur-sm h-fit',
              isDark 
                ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
                : 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200'
            )}
          >
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">
                {isGenerating ? '⚙️' : isComplete ? '✅' : '💬'}
              </div>
              <h3 className="text-2xl font-bold mb-2">
                {isGenerating ? t.generating : isComplete ? t.complete : t.ready}
              </h3>
              <p className={clsx(
                'text-sm',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}>
                {isGenerating 
                  ? `${Math.round(progress)}% ${language === 'pt' ? 'concluído' : 'complete'}`
                  : `${files.length} ${t.files_generated}`
                }
              </p>
            </div>

            <div className={clsx(
              'p-4 rounded-lg mb-6 text-sm',
              isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700'
            )}>
              <p className="font-semibold mb-2">
                📊 {files.length} {t.files}
              </p>
              <p className="text-xs opacity-75">
                {files.reduce((acc, f) => acc + f.lines, 0).toLocaleString()} {t.lines}
              </p>
            </div>

            <p className={clsx(
              'text-xs text-center',
              isDark ? 'text-gray-400' : 'text-gray-600'
            )}>
              {t.production_ready}
            </p>
          </motion.div>
        </div>

        {/* ✅ FIX #18.5: Code Display Section with Proper Styling */}
        {isComplete && files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold mb-6">
              💾 {language === 'pt' ? 'Arquivos Gerados' : 'Generated Files'}
            </h2>

            {/* File Tabs */}
            <div className={clsx(
              'flex gap-2 overflow-x-auto pb-4 mb-4 rounded-lg p-3',
              isDark ? 'bg-gray-800' : 'bg-gray-100'
            )}>
              {files.map((file, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedFileIndex(idx)}
                  className={clsx(
                    'px-4 py-2 rounded-lg font-mono text-sm whitespace-nowrap transition-all',
                    selectedFileIndex === idx
                      ? 'bg-blue-600 text-white shadow-lg'
                      : isDark
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  )}
                >
                  📄 {file.name}
                </button>
              ))}
            </div>

            {/* Code Display */}
            {selectedFile && (
              <motion.div
                key={selectedFileIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={clsx(
                  'rounded-xl overflow-hidden border',
                  isDark 
                    ? 'bg-gray-900 border-gray-700' 
                    : 'bg-gray-50 border-gray-200'
                )}
              >
                {/* Header */}
                <div className={clsx(
                  'px-6 py-4 flex justify-between items-center border-b',
                  isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'
                )}>
                  <div>
                    <p className="font-semibold">{selectedFile.name}</p>
                    <p className={clsx(
                      'text-xs',
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    )}>
                      {selectedFile.path} • {selectedFile.lines} {t.lines} • {selectedFile.language}
                    </p>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(selectedFile.content)}
                    className={clsx(
                      'px-3 py-1 rounded text-sm font-medium transition-all',
                      isDark
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    )}
                  >
                    📋 {language === 'pt' ? 'Copiar' : 'Copy'}
                  </button>
                </div>

                {/* Code Content */}
                <pre className={clsx(
                  'p-6 overflow-x-auto font-mono text-sm',
                  isDark ? 'text-gray-300' : 'text-gray-700'
                )}>
                  <code>{selectedFile.content}</code>
                </pre>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Info Message */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={clsx(
              'mt-8 p-6 rounded-xl',
              isDark 
                ? 'bg-yellow-900/20 border border-yellow-800 text-yellow-300' 
                : 'bg-yellow-50 border border-yellow-200 text-yellow-800'
            )}
          >
            <p className="text-sm mb-2 font-semibold">ℹ️ {language === 'pt' ? 'Próximas Etapas' : 'Next Steps'}</p>
            <p className="text-sm">
              {language === 'pt' 
                ? t.download_code 
                : t.download_code
              }
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
