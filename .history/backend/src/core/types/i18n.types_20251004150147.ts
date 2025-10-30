// ═══════════════════════════════════════════════════════════════
// src/core/types/i18n.types.ts - CRIAR ESTE ARQUIVO NOVO
// ═══════════════════════════════════════════════════════════════

/**
 * I18n Text - Multilingual text support
 */
export interface I18nText {
  en: string;
  pt: string;
  es?: string;
  fr?: string;
  de?: string;
  it?: string;
  ja?: string;
  zh?: string;
}

/**
 * Helper function to create I18nText easily
 */
export const createI18nText = (
  en: string, 
  pt: string = en,
  es?: string,
  fr?: string
): I18nText => ({
  en,
  pt: pt || en,
  es,
  fr
});

/**
 * Get text in specific language
 */
export const getI18nText = (
  text: I18nText,
  language: 'en' | 'pt' | 'es' | 'fr' | 'de' | 'it' | 'ja' | 'zh' = 'en'
): string => {
  return text[language] || text.en;
};
