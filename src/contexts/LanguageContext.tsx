import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  translations,
  categoryNamesAm,
  type Lang,
  type TranslationKey,
} from '@/i18n/translations';

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
  translateCategory: (name: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'daros-lang';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === 'am' ? 'am' : 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang === 'am' ? 'am' : 'en';
  }, [lang]);

  const setLang = (next: Lang) => setLangState(next);

  const t = (key: TranslationKey) => translations[lang][key] ?? translations.en[key];

  const translateCategory = (name: string) => {
    if (lang === 'am') return categoryNamesAm[name] || name;
    return name;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, translateCategory }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
