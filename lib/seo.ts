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

export interface PageSchemaOptions {
  locale: string;
  path: string;
  title: string;
  description: string;
  type?: string;
  datePublished?: string;
  breadcrumbItems?: { name: string; url: string }[];
  extra?: Record<string, unknown>;
}

export function buildPageSchema(opts: PageSchemaOptions): object[] {
  const url = `${BASE_URL}/${opts.locale}${opts.path}`;
  const schemas: object[] = [];

  schemas.push({
    '@type': opts.type || 'WebPage',
    '@id': url,
    url,
    name: opts.title,
    description: opts.description,
    inLanguage: opts.locale,
    isPartOf: { '@id': `${BASE_URL}/#website` },
    ...opts.extra,
  });

  if (opts.breadcrumbItems && opts.breadcrumbItems.length > 0) {
    schemas.push({
      '@type': 'BreadcrumbList',
      itemListElement: opts.breadcrumbItems.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        item: item.url,
      })),
    });
  }

  return schemas;
}
