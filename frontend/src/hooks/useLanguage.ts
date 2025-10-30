// hooks/useLanguage.ts
import { useState, useEffect } from 'react';

type Language = 'pt-BR' | 'en-US' | 'es-ES';

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('orus-language');
    if (saved) return saved as Language;
    
    const browserLang = navigator.language;
    if (browserLang.startsWith('pt')) return 'pt-BR';
    if (browserLang.startsWith('es')) return 'es-ES';
    return 'en-US';
  });

  useEffect(() => {
    localStorage.setItem('orus-language', language);
  }, [language]);

  return { language, setLanguage };
};
