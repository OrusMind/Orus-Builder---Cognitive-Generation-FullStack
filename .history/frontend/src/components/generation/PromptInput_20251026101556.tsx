import React, { useState } from 'react';
import { Wand2, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

interface PromptInputProps {
  onSubmit: (prompt: string, options: any) => void;
  isGenerating: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ onSubmit, isGenerating }) => {
  const [prompt, setPrompt] = useState('');

  const isValid = prompt.trim().length >= 10;
  const charCount = prompt.length;
  const maxChars = 5000;

  const handleSubmit = () => {
    if (isValid && !isGenerating) {
      // ✅ REMOVER complexity - deixar AI decidir!
      const options = {
        style: 'modern',
        theme: {},
        includeTests: true,
        language: 'typescript',
        // ❌ complexity: 'standard' - REMOVIDO!
      };
      
      console.log('═══════════════════════════════════════════════════════');
      console.log('🔍 [PromptInput] handleSubmit() CHAMADO');
      console.log('[PromptInput] prompt:', prompt);
      console.log('[PromptInput] options:', options);
      console.log('═══════════════════════════════════════════════════════');
      
      onSubmit(prompt, options);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* ✅ HEADER */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-3">
          O que você quer <span className="text-primary">criar</span> hoje?
        </h1>
        <p className="text-xl text-foreground/80 dark:text-foreground/70">
          Descreva sua ideia em linguagem natural e Trinity AI gerará código real
        </p>
      </div>

      {/* ✅ CARD SIMPLIFICADO */}
      <div className="bg-card dark:bg-card/50 backdrop-blur-sm rounded-2xl shadow-xl border border-border/50 p-8">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-foreground dark:text-foreground/90 mb-2">
            Descreva Seu Projeto
          </label>
          
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Exemplo: Dashboard com gráficos de vendas, tabela de produtos e filtros por data..."
            className="min-h-[200px] text-base resize-none focus:ring-2 focus:ring-primary/50"
            maxLength={maxChars}
            disabled={isGenerating}
          />
          
          {/* ✅ CHARACTER COUNTER */}
          <div className="flex justify-between items-center mt-2 text-sm">
            <span className={`font-medium ${
              charCount >= maxChars * 0.9 
                ? 'text-destructive' 
                : 'text-muted-foreground dark:text-muted-foreground/80'
            }`}>
              {charCount} / {maxChars}
            </span>
            {charCount < 10 && (
              <span className="text-destructive text-xs">
                Mínimo 10 caracteres
              </span>
            )}
          </div>
        </div>

        {/* ✅ DICA VISUAL - OPCIONAL */}
        <div className="mb-6 p-4 bg-muted/30 rounded-lg border border-border/30">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Dica:</strong> Quanto mais detalhes você fornecer, melhor será o resultado. 
            A IA analisará sua descrição e gerará automaticamente a quantidade ideal de arquivos.
          </p>
        </div>

        {/* ✅ GENERATE BUTTON */}
        <Button
          onClick={handleSubmit}
          disabled={!isValid || isGenerating}
          size="lg"
          className="w-full text-lg font-semibold h-14"
        >
          {isGenerating ? (
            <>
              <Sparkles className="mr-2 h-5 w-5 animate-spin" />
              Gerando seu projeto...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-5 w-5" />
              Gerar Projeto (Ctrl+Enter)
            </>
          )}
        </Button>
      </div>

      {/* ✅ EXEMPLOS - OPCIONAL */}
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground mb-3">Exemplos de prompts:</p>
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setPrompt('Dashboard moderno com gráficos de vendas e métricas em tempo real')}
            className="px-4 py-2 text-sm bg-muted/50 hover:bg-muted rounded-lg transition-colors"
            disabled={isGenerating}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setPrompt('Landing page responsiva com hero section, features e formulário de contato')}
            className="px-4 py-2 text-sm bg-muted/50 hover:bg-muted rounded-lg transition-colors"
            disabled={isGenerating}
          >
            🎨 Landing Page
          </button>
          <button
            onClick={() => setPrompt('Sistema completo de blog com posts, comentários, autenticação e painel admin')}
            className="px-4 py-2 text-sm bg-muted/50 hover:bg-muted rounded-lg transition-colors"
            disabled={isGenerating}
          >
            📝 Blog Completo
          </button>
        </div>
      </div>
    </div>
  );
};
