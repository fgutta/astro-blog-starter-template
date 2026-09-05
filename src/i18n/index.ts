// src/i18n/index.ts
import { en } from './en';
import { fr } from './fr';
export type Lang = 'en' | 'fr';
export type Dict = typeof en;
export const dicts = { en, fr } as const;
export const t = (lang: Lang): Dict => dicts[lang];
