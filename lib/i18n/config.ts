/**
 * @package fabiocherici.com — i18n Config
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-15
 * @purpose i18n configuration — 7 languages (P0-9 + zh), IT default, EN fallback
 */

export const locales = ['it', 'en', 'fr', 'de', 'es', 'pt', 'zh'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'it';
export const fallbackLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  it: 'Italiano',
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  pt: 'Português',
  zh: '中文',
};
