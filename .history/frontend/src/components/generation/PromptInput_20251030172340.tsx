'use client';

import { useState, useRef, useEffect } from 'react';

interface PromptInputProps {
  onGenerate: (prompt: string) => Promise<void>;
  isLoading: boolean;
}

export default function PromptInput({ onGenerate, isLoading }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(
        textareaRef.current.scrollHeight,
        300
      ) + 'px';
    }
  }, [prompt]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt) {
      setError('Por favor, digite uma descrição do projeto');
      return;
    }

    if (trimmedPrompt.length < 10) {
      setError('A descrição deve ter pelo menos 10 caracteres');
      return;
    }

    setError('');

    try {
      await onGenerate(trimmedPrompt);
      setPrompt('');
    } catch (err) {
      setError('Erro ao gerar projeto. Tente novamente.');
      console.error(err);
    }
  };

  const examplePrompts = [
    'Sistema de e-commerce com catálogo, carrinho, checkout e admin',
    'App de tarefas com autenticação e notificações',
    'Blog com comentários, categorias e busca',
  ];

  const example = examplePrompts[
    Math.floor(Math.random() * examplePrompts.length)
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          🚀 Descreva seu Projeto
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Dica: Quanto mais detalhes você fornecer, melhor será o resultado.
        </p>
      </div>

      {/* Textarea */}
      <div>
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Descreva seu projeto... (ex: 'Sistema de e-commerce com catálogo, carrinho, checkout')"
          className={`
            w-full p-4 border rounded-lg resize-none 
            focus:outline-none focus:ring-2 transition-colors duration-200
            
            bg-white text-gray-900 border-gray-300 placeholder-gray-500
            focus:ring-blue-500 focus:border-blue-500
            
            dark:bg-gray-800 dark:text-white dark:border-gray-600 
            dark:placeholder-gray-400 dark:focus:ring-blue-400 
            dark:focus:border-blue-400
            
            disabled:opacity-50 disabled:cursor-not-allowed 
            disabled:dark:bg-gray-700
            
            ${error ? 'border-red-500 dark:border-red-500' : ''}
          `}
          disabled={isLoading}
          rows={6}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Dica: Pressione <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Ctrl + Enter</kbd> para enviar
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-400">⚠️ {error}</p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={isLoading || !prompt.trim()}
          className={`
            flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200
            
            bg-blue-600 text-white hover:bg-blue-700
            dark:bg-blue-600 dark:hover:bg-blue-700
            
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600
            
            flex items-center justify-center gap-2
          `}
        >
          {isLoading ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Gerando...
            </>
          ) : (
            <>
              ✨ Gerar Projeto
            </>
          )}
        </button>

        <button
          onClick={() => {
            setPrompt('');
            setError('');
          }}
          disabled={isLoading}
          className={`
            px-6 py-3 rounded-lg font-semibold transition-all duration-200
            
            bg-gray-200 text-gray-800 hover:bg-gray-300
            dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600
            
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          Limpar
        </button>
      </div>

      {/* Info Box */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-700 dark:text-blue-400 font-medium mb-2">
          💡 A IA analisará sua descrição e gerará automaticamente a quantidade ideal de arquivos.
        </p>
        <p className="text-xs text-blue-600 dark:text-blue-300 mb-3">
          Por favor, digite pelo menos 10 caracteres.
        </p>

        {/* Example Prompts */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">
            Exemplos de prompts:
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-300 italic">
            {example}
          </p>
        </div>
      </div>

      {/* Character Count */}
      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <span>Caracteres: {prompt.length}</span>
        <span>{prompt.trim().length > 0 ? '✅ Pronto!' : '⏳ Aguardando entrada...'}</span>
      </div>
    </div>
  );
}
