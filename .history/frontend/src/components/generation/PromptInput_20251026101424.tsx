import React, { useState, useEffect } from 'react';
import { Wand2, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useI18n } from '../hooks/useI18n';

interface PromptInputProps {
  onSubmit: (prompt: string, options: any) => void;
  isGenerating: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ onSubmit, isGenerating }) => {
  const { t } = useI18n(); // ✅ MULTILINGUAL SUPPORT
  const [prompt, setPrompt] = useState('');
  const [selectedComplexity, setSelectedComplexity] = useState<string>('standard');
  const [options, setOptions] = useState({
    style: 'modern',
    theme: {},
    includeTests: true,
    language: 'typescript',
  });

  // ✅ SINCRONIZAR complexity COM options
  useEffect(() => {
    setOptions(prev => ({
      ...prev,
      complexity: selectedComplexity
    }));
  }, [selectedComplexity]);

  const isValid = prompt.trim().length >= 10;
  const charCount = prompt.length;
  const maxChars = 5000; // ✅ AUMENTADO DE 2000 PARA 5000

  const handleSubmit = () => {
    if (isValid && !isGenerating) {
      // ✅ GARANTIR QUE complexity ESTÁ INCLUSO
      const fullOptions = {
        ...options,
        complexity: selectedComplexity
      };
      
      console.log('═══════════════════════════════════════════════════════');
      console.log('🔍 [PromptInput] handleSubmit() CHAMADO');
      console.log('[PromptInput] prompt:', prompt);
      console.log('[PromptInput] selectedComplexity:', selectedComplexity);
      console.log('[PromptInput] fullOptions:', fullOptions);
      console.log('═══════════════════════════════════════════════════════');
      
      onSubmit(prompt, fullOptions);
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
      {/* ✅ HEADER COM MELHOR CONTRASTE */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-3">
          {t('hero.title.start')} <span className="text-primary">{t('hero.title.create')}</span> {t('hero.title.end')}
        </h1>
        <p className="text-xl text-foreground/80 dark:text-foreground/70">
          {t('hero.subtitle')}
        </p>
      </div>

      {/* ✅ CARD COM MELHOR CONTRASTE NO TEMA CLARO */}
      <div className="bg-card dark:bg-card/50 backdrop-blur-sm rounded-2xl shadow-xl border border-border/50 p-8">
        {/* ✅ LABEL COM MELHOR VISIBILIDADE */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-foreground dark:text-foreground/90 mb-2">
            {t('prompt.label')}
          </label>
          
          {/* ✅ TEXTAREA AUMENTADO PARA 5000 CARACTERES */}
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('prompt.placeholder')}
            className="min-h-[150px] text-base resize-none focus:ring-2 focus:ring-primary/50"
            maxLength={maxChars}
            disabled={isGenerating}
          />
          
          {/* ✅ CHARACTER COUNTER COM MELHOR CONTRASTE */}
          <div className="flex justify-between items-center mt-2 text-sm">
            <span className={`font-medium ${charCount >= maxChars * 0.9 ? 'text-destructive' : 'text-muted-foreground dark:text-muted-foreground/80'}`}>
              {charCount} / {maxChars}
            </span>
            {charCount < 10 && (
              <span className="text-destructive text-xs">
                {t('prompt.minChars', { min: 10 })}
              </span>
            )}
          </div>
        </div>

        {/* ✅ COMPLEXITY SELECTOR COM MELHOR LABEL */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-foreground dark:text-foreground/90 mb-2">
            {t('complexity.label')}
          </label>
          
          <Select
            value={selectedComplexity}
            onValueChange={(value) => {
              console.log('🎚️ [PromptInput] Complexity changed to:', value);
              setSelectedComplexity(value);
            }}
            disabled={isGenerating}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('complexity.placeholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="minimal">
                <div className="flex flex-col items-start">
                  <span className="font-semibold">{t('complexity.minimal.title')}</span>
                  <span className="text-xs text-muted-foreground">{t('complexity.minimal.desc')}</span>
                </div>
              </SelectItem>
              <SelectItem value="standard">
                <div className="flex flex-col items-start">
                  <span className="font-semibold">{t('complexity.standard.title')}</span>
                  <span className="text-xs text-muted-foreground">{t('complexity.standard.desc')}</span>
                </div>
              </SelectItem>
              <SelectItem value="feature_rich">
                <div className="flex flex-col items-start">
                  <span className="font-semibold">{t('complexity.featureRich.title')}</span>
                  <span className="text-xs text-muted-foreground">{t('complexity.featureRich.desc')}</span>
                </div>
              </SelectItem>
              <SelectItem value="enterprise">
                <div className="flex flex-col items-start">
                  <span className="font-semibold">{t('complexity.enterprise.title')}</span>
                  <span className="text-xs text-muted-foreground">{t('complexity.enterprise.desc')}</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
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
              {t('button.generating')}
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-5 w-5" />
              {t('button.generate')} (Ctrl+Enter)
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
