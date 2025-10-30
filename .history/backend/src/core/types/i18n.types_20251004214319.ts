// Re-export from index.ts to avoid conflicts
export type { I18nText } from './index';

export const createI18nText = (
  en: string, 
  pt: string = en,
  es: string = en
): I18nText => ({
  en,
  pt_BR: pt || en,
  es: es || en
});

export const getI18nText = (
  text: I18nText,
  language: 'en' | 'pt_BR' | 'es' = 'en'
): string => {
  return text[language] || text.en;
};

// Import type from index
import type { I18nText } from './index';
