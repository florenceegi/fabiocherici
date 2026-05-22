/**
 * @package fabiocherici.com — SEO Utilities
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-22
 * @purpose Shared SEO helpers — canonical URL and hreflang alternates for all pages.
 */

import { locales } from '@/lib/i18n/config';

const BASE_URL = 'https://fabiocherici.com';

export function buildAlternates(locale: string, path: string = '') {
  const canonical = `${BASE_URL}/${locale}${path}`;
  const languages: Record<string, string> = {};
  for (const loc of locales) {
    languages[loc] = `${BASE_URL}/${loc}${path}`;
  }
  languages['x-default'] = `${BASE_URL}/it${path}`;
  return { canonical, languages };
}
