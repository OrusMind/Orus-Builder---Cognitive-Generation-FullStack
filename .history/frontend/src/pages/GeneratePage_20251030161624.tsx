'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Code2, Download, Eye, Sun, Moon, Zap, Check, MessageCircle } from 'lucide-react';
import { useTheme } from 'next-themes';

interface GeneratedFile {
  id: string;
  path: string;
  filename: string;
  language: string;
  content: string;
  lines: number;
}

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  isUser: boolean;
}

export default function GeneratePage() {
  const { theme, setTheme } = useTheme();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentStage, setCurrentStage] = useState('Aguardando prompt...');
  const [files, setFiles] = useState<GeneratedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<GeneratedFile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [mounted, setMounted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setIsComplete(false);
    setCurrentStage('Iniciando geração...';

    // Simular progresso
    const stages = [
      'Analisando prompt...',
      'Detectando arquitetura...',
      'Gerando Backend...',
      'Gerando Frontend...',
      'Gerando Testes...',
      'Otimizando código...',
      'Validando qualidade...',
    ];

    for (const stage of stages) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setCurrentStage(stage);
    }

    // Adicionar mensagem do usuário
    const userMsg: Message = {
      id: Date.now().toString(),
      content: prompt,
      timestamp: new Date(),
      isUser: true,
    };
    setMessages((prev) => [...prev, userMsg]);

    // Simular arquivos gerados
    const mockFiles: GeneratedFile[] = [
      {
        id: '1',
        path: 'backend/src/app.ts',
        filename: 'app.ts',
        language: 'TypeScript',
        content: `import express from 'express';
const app = express();
app.use(express.json());
// Seu código aqui`,
        lines: 45,
      },
      {
        id: '2',
        path: 'frontend/src/App.tsx',
        filename: 'App.tsx',
        language: 'React',
        content: `export default function App() {
  return (
    <div>
      {/* Seu componente aqui */}
    </div>
  );
}`,
        lines: 82,
      },
    ];

    setFiles(mockFiles);
    setSelectedFile(mockFiles[0]);

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      content: `Criei ${mockFiles.length} arquivos com ${mockFiles.reduce((acc, f) => acc + f.lines, 0)} linhas de código. Pronto para download!`,
      timestamp: new Date(),
      isUser: false,
    };
    setMessages((prev) => [...prev, aiMsg]);

    setIsGenerating(false);
    setIsComplete(true);
    setCurrentStage('✅ Geração Completa!');
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className={`min-h-screen flex flex-col ${
      theme === 'dark' 
        ? 'bg-slate-950 text-white' 
        : 'bg-white text-slate-950'
    }`}>
      {/* Header com Logo e Botão de Tema */}
      <header className={`border-b ${
        theme === 'dark' 
          ? 'border-slate-800 bg-slate-900/50' 
          : 'border-slate-200 bg-slate-50'
      } backdrop-blur-lg sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo com Animação */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 relative">
              <img
                src="/trinity-ai-icon.png"
                alt="Trinity AI"
                className="w-full h-full animate-spin"
                style={{ animationDuration: '3s' }}
              />
            </div>
            <div>
              <h1 className="text-xl font-bold">Trinity AI</h1>
              <p className={`text-xs ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
              }`}>ORUS Builder</p>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center gap-3">
            {/* Botão Tema Dark/Light */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`p-2 rounded-lg transition-all ${
                theme === 'dark'
                  ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              }`}
              title="Alternar tema"
            >
              {theme === 'dark' ? (
                <Sun size={20} />
              ) : (
                <Moon size={20} />
              )}
            </button>

            {/* Botão Deploy - Coming Soon */}
            <button
              disabled
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all opacity-60 cursor-not-allowed ${
                theme === 'dark'
                  ? 'bg-slate-800 text-slate-400'
                  : 'bg-slate-200 text-slate-500'
              }`}
              title="Deploy - Coming Soon"
            >
              <Zap size={18} />
              Deploy
              <span className="text-xs">(Coming soon)</span>
            </button>

            {/* Botão Dashboard - Coming Soon */}
            <button
              disabled
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all opacity-60 cursor-not-allowed ${
                theme === 'dark'
                  ? 'bg-slate-800 text-slate-400'
                  : 'bg-slate-200 text-slate-500'
              }`}
              title="Dashboard - Coming Soon"
            >
              <Eye size={18} />
              Dashboard
              <span className="text-xs">(Coming soon)</span>
            </button>

            {/* Botão Download */}
            <button
              onClick={() => console.log('Download gerado')}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium flex items-center gap-2 transition-all"
            >
              <Download size={18} />
              Download ZIP
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Input */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Input Prompt */}
            <div className={`rounded-2xl p-6 border ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-800'
                : 'bg-slate-50 border-slate-200'
            }`}>
              <label className="block text-sm font-semibold mb-3">
                Descreva sua ideia
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: Crie um sistema de e-commerce com catálogo, carrinho e checkout..."
                rows={6}
                className={`w-full px-4 py-3 rounded-lg border outline-none resize-none transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500'
                    : 'bg-white border-slate-300 text-slate-950 placeholder-slate-400 focus:border-blue-500'
                }`}
              />
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full mt-4 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap size={20} />
                {isGenerating ? 'Gerando...' : 'Gerar Código'}
              </button>
            </div>

            {/* Status */}
            <div className={`rounded-2xl p-6 border ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-800'
                : 'bg-slate-50 border-slate-200'
            }`}>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                {isGenerating && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />}
                {isComplete && <Check size={18} className="text-green-500" />}
                Status
              </h3>
              <p className={`text-sm font-medium ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
              }`}>
                {currentStage}
              </p>
              {files.length > 0 && (
                <p className={`text-xs mt-2 ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {files.length} arquivos gerados • 100% pronto para produção
                </p>
              )}
            </div>

            {/* Info */}
            <div className={`rounded-2xl p-6 border ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-800'
                : 'bg-slate-50 border-slate-200'
            }`}>
              <h3 className="font-semibold mb-3">ℹ️ Sobre o Preview</h3>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Estamos trabalhando em um sistema incrível de preview ao vivo. Por enquanto, você pode baixar o código e testar localmente!
              </p>
            </div>
          </div>

          {/* Right Panel - Files & Chat */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Files List */}
            {files.length > 0 && (
              <div className={`rounded-2xl p-6 border ${
                theme === 'dark'
                  ? 'bg-slate-900 border-slate-800'
                  : 'bg-slate-50 border-slate-200'
              }`}>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Code2 size={20} />
                  Arquivos Gerados ({files.length})
                </h3>
                <div className="space-y-2">
                  {files.map((file) => (
                    <button
                      key={file.id}
                      onClick={() => setSelectedFile(file)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                        selectedFile?.id === file.id
                          ? theme === 'dark'
                            ? 'bg-blue-900 border border-blue-600'
                            : 'bg-blue-100 border border-blue-400'
                          : theme === 'dark'
                            ? 'bg-slate-800 hover:bg-slate-700'
                            : 'bg-white hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      <div className="font-medium">{file.filename}</div>
                      <div className={`text-xs ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        {file.lines} linhas • {file.language}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Code Preview */}
            {selectedFile && (
              <div className={`rounded-2xl border overflow-hidden ${
                theme === 'dark'
                  ? 'bg-slate-900 border-slate-800'
                  : 'bg-slate-50 border-slate-200'
              }`}>
                <div className={`px-6 py-4 border-b ${
                  theme === 'dark'
                    ? 'border-slate-800 bg-slate-800/50'
                    : 'border-slate-200 bg-slate-100'
                } font-mono text-sm`}>
                  {selectedFile.path}
                </div>
                <div className={`p-6 overflow-auto max-h-96 font-mono text-sm ${
                  theme === 'dark'
                    ? 'text-slate-300'
                    : 'text-slate-700'
                }`}>
                  <pre className="whitespace-pre-wrap">{selectedFile.content}</pre>
                </div>
              </div>
            )}

            {/* Chat Messages */}
            <div className={`rounded-2xl p-6 border flex flex-col gap-4 h-64 overflow-y-auto ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-800'
                : 'bg-slate-50 border-slate-200'
            }`}>
              {messages.length === 0 ? (
                <div className={`flex items-center justify-center h-full text-center ${
                  theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  <MessageCircle size={32} className="opacity-50" />
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.isUser
                          ? theme === 'dark'
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-500 text-white'
                          : theme === 'dark'
                            ? 'bg-slate-800 text-slate-200'
                            : 'bg-white text-slate-800 border border-slate-200'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 opacity-70`}>
                        {msg.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Save Button - Coming Soon */}
            <button
              disabled
              className={`w-full px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all opacity-60 cursor-not-allowed ${
                theme === 'dark'
                  ? 'bg-slate-800 text-slate-400'
                  : 'bg-slate-200 text-slate-500'
              }`}
              title="Salvar - Coming Soon"
            >
              💾 Salvar (Coming soon)
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
