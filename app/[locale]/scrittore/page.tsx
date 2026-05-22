/**
 * @package fabiocherici.com — Scrittore Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-18
 * @purpose Scrittore page — under construction placeholder.
 */

import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildAlternates, buildOgImage, buildPageSchema } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('scrittore_title'),
    description: t('scrittore_description'),
    alternates: buildAlternates(locale, '/scrittore'),
    openGraph: { title: t('scrittore_title'), description: t('scrittore_description'), type: 'website', locale, images: [buildOgImage(locale, 'scrittore')] },
    twitter: { card: 'summary_large_image', title: t('scrittore_title'), description: t('scrittore_description') },
  };
}

export default async function ScrittorePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const tm = await getTranslations({ locale, namespace: 'meta' });
  const pageSchema = buildPageSchema({
    locale, path: '/scrittore', title: tm('scrittore_title'), description: tm('scrittore_description'),
    type: 'Article',
    datePublished: '2026-05-18',
    extra: { author: { '@id': 'https://fabiocherici.com/#person' } },
    breadcrumbItems: [
      { name: tm('home_title'), url: `https://fabiocherici.com/${locale}` },
      { name: tm('scrittore_title'), url: `https://fabiocherici.com/${locale}/scrittore` },
    ],
  });


  return (
    <div className="flex min-h-[80dvh] flex-col items-center justify-center px-6 pt-24 text-center">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': pageSchema }) }} />
      <p className="text-sm font-mono uppercase tracking-[0.3em] text-[var(--accent)] mb-4">
        {t('under_construction.subtitle')}
      </p>
      <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl font-light tracking-tight text-[var(--text-primary)] mb-8">
        {t('nav.scrittore')}
      </h1>
      <p className="text-[var(--text-muted)] max-w-md mb-8 leading-relaxed">
        {t('under_construction.message')}
      </p>
      <Link
        href={`/${locale}`}
        className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors underline underline-offset-4"
      >
        {t('under_construction.back')}
      </Link>
    </div>
  );
}
