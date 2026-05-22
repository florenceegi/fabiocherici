/**
 * @package fabiocherici.com — EPP Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-18
 * @purpose EPP page — under construction placeholder.
 */

import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildAlternates } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('epp_title'),
    description: t('epp_description'),
    alternates: buildAlternates(locale, '/epp'),
    openGraph: { title: t('epp_title'), description: t('epp_description'), type: 'website', locale },
  };
}

export default async function EppPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="flex min-h-[80dvh] flex-col items-center justify-center px-6 pt-24 text-center">
      <p className="text-sm font-mono uppercase tracking-[0.3em] text-[var(--accent)] mb-4">
        {t('under_construction.subtitle')}
      </p>
      <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl font-light tracking-tight text-[var(--text-primary)] mb-8">
        EPP
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
