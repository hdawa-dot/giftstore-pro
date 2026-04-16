import { ar } from './ar';
import { en } from './en';
import { Language, Translation } from '@/types';

export const translations: Record<Language, Translation> = { ar, en };

export function t(lang: Language, key: string): string {
  const keys = key.split('.');
  let value: unknown = translations[lang];
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }
  return typeof value === 'string' ? value : key;
}
