'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Translation } from '@/types';
import { translations } from '@/i18n';

interface LangContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
}

const LangContext = createContext<LangContextType>({
  lang: 'ar',
  setLang: () => {},
  t: (k) => k,
  dir: 'rtl',
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('ar');

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Language | null;
    if (saved === 'ar' || saved === 'en') setLangState(saved);
  }, []);

  const setLang = (l: Language) => {
    setLangState(l);
    localStorage.setItem('lang', l);
    document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = l;
  };

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: unknown = translations[lang];
    for (const k of keys) {
      if (value && typeof value === 'object') value = (value as Record<string, unknown>)[k];
      else return key;
    }
    return typeof value === 'string' ? value : key;
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t, dir: lang === 'ar' ? 'rtl' : 'ltr' }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
