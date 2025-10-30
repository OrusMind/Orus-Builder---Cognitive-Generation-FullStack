export interface I18nText {
  en: string;
  pt: string;
  pt_BR?: string;  // ← OPCIONAL para compatibilidade
  es?: string;
  fr?: string;
  de?: string;
  it?: string;
  ja?: string;
  zh?: string;
}

export const createI18nText = (
  en: string, 
  pt: string = en,
  es?: string,
  fr?: string
): I18nText => ({
  en,
  pt: pt || en,
  pt_BR: pt || en,  // ← Auto-preencher
  es,
  fr
});

export const getI18nText = (
  text: I18nText,
  language: 'en' | 'pt' | 'pt_BR' | 'es' | 'fr' | 'de' | 'it' | 'ja' | 'zh' = 'en'
): string => {
  return text[language] || text.pt_BR || text.pt || text.en;
};
